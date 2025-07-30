
import React from "react";
import { type OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { VirtualizedCircuitGrid } from "./VirtualizedCircuitGrid";
import { MemoizedGate } from "./MemoizedGate";

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
  // Check if circuit is long enough to benefit from virtualization
  const maxPosition = circuit.reduce((max, gate) => Math.max(max, gate.position), 0);
  const shouldVirtualize = maxPosition > 20; // Virtualize for circuits with >20 time steps

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
          minWidth: `${Math.max(800, (maxPosition + 5) * GRID_SIZE)}px`
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
        {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
          <div
            className="absolute w-12 h-8 border-2 border-dashed border-quantum-glow rounded bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
            style={{
              left: dragState.hoverPosition * GRID_SIZE + 16,
              top: dragState.hoverQubit * 60 + 19
            }}
          >
            {dragState.gateType}
          </div>
        )}
      </div>
    </div>
  );
}
