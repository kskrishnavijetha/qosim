
import React from "react";
import { type OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { VirtualizedCircuitGrid } from "./VirtualizedCircuitGrid";
import { MemoizedGate } from "./MemoizedGate";
import { useCircuitValidation } from "@/hooks/useCircuitValidation";

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[];
}

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface CircuitGridProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  NUM_QUBITS: number;
  GRID_SIZE: number;
}

export function CircuitGrid({ 
  circuit, 
  dragState, 
  simulationResult, 
  onDeleteGate, 
  circuitRef, 
  NUM_QUBITS, 
  GRID_SIZE 
}: CircuitGridProps) {
  const { validateCircuit, isInitialized, validateGateType } = useCircuitValidation();

  // Validate circuit before rendering
  const validation = React.useMemo(() => {
    if (!isInitialized) {
      return { isValid: false, errors: ['Gate registry not initialized'], steps: [] };
    }
    return validateCircuit(circuit, NUM_QUBITS);
  }, [circuit, NUM_QUBITS, isInitialized, validateCircuit]);

  // Check if circuit is long enough to benefit from virtualization
  const maxPosition = circuit.reduce((max, gate) => Math.max(max, gate.position), 0);
  const shouldVirtualize = maxPosition > 20;

  // Validate drag state gate type
  const isDragGateValid = React.useMemo(() => {
    if (!dragState.isDragging || !isInitialized) return true;
    const gateValidation = validateGateType(dragState.gateType);
    if (!gateValidation.isValid) {
      console.error('❌ Invalid drag gate type:', gateValidation.error);
      return false;
    }
    return true;
  }, [dragState.isDragging, dragState.gateType, isInitialized, validateGateType]);

  // Display validation errors
  if (!validation.isValid) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Circuit Validation Errors:</h3>
          <ul className="list-disc list-inside">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (shouldVirtualize) {
    return (
      <VirtualizedCircuitGrid
        circuit={circuit}
        dragState={dragState}
        simulationResult={simulationResult}
        onDeleteGate={onDeleteGate}
        circuitRef={circuitRef}
        NUM_QUBITS={NUM_QUBITS}
        GRID_SIZE={GRID_SIZE}
      />
    );
  }

  return (
    <div className="flex-1">
      <div 
        ref={circuitRef} 
        className="relative bg-quantum-matrix rounded-lg p-4 min-h-[320px] quantum-panel overflow-hidden"
        style={{ 
          backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${GRID_SIZE}px)`,
          minWidth: `${Math.max(800, (maxPosition + 10) * GRID_SIZE)}px`
        }}
      >
        {/* Qubit Lines */}
        {Array.from({ length: NUM_QUBITS }).map((_, i) => (
          <div key={i} className="absolute left-0 right-0" style={{ top: i * 60 + 35 }}>
            <div className="flex items-center h-0.5 bg-quantum-neon relative">
              <div className="absolute -left-12 w-10 text-xs font-mono text-quantum-neon text-right">
                q{i}
              </div>
              <div className="absolute -right-20 w-16 text-xs font-mono text-muted-foreground">
                {simulationResult?.qubitStates[i]?.state || '|0⟩'}
              </div>
            </div>
          </div>
        ))}

        {/* Drop zones grid */}
        {dragState.isDragging && isDragGateValid && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: NUM_QUBITS }).map((_, qubitIndex) => 
              Array.from({ length: Math.floor((circuitRef.current?.offsetWidth || 800) / GRID_SIZE) }).map((_, posIndex) => (
                <div
                  key={`${qubitIndex}-${posIndex}`}
                  className="absolute border border-dashed border-transparent hover:border-quantum-glow/50 transition-colors"
                  style={{
                    left: posIndex * GRID_SIZE + 12,
                    top: qubitIndex * 60 + 19,
                    width: 32,
                    height: 24,
                  }}
                />
              ))
            )}
          </div>
        )}

        {/* Placed Gates */}
        {circuit.map((gate, index) => (
          <MemoizedGate
            key={gate.id}
            gate={gate}
            index={index}
            gridSize={GRID_SIZE}
            onDeleteGate={onDeleteGate}
            qubitSpacing={60}
          />
        ))}

        {/* Drop Zone Indicator */}
        {dragState.isDragging && isDragGateValid && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
          <div
            className="absolute w-8 h-6 border-2 border-dashed border-quantum-glow rounded bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
            style={{
              left: dragState.hoverPosition * GRID_SIZE + 12,
              top: dragState.hoverQubit * 60 + 19
            }}
          >
            {dragState.gateType}
          </div>
        )}

        {/* Invalid gate warning */}
        {dragState.isDragging && !isDragGateValid && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded">
            ⚠️ Unknown gate: {dragState.gateType}
          </div>
        )}
      </div>
    </div>
  );
}
