
import React from "react";
import { type OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { VirtualizedCircuitGrid } from "./VirtualizedCircuitGrid";

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
  isMobile?: boolean;
}

export function CircuitGrid({ 
  circuit, 
  dragState, 
  simulationResult, 
  onDeleteGate, 
  circuitRef, 
  NUM_QUBITS, 
  GRID_SIZE,
  isMobile = false
}: CircuitGridProps) {
  // Check if circuit is long enough to benefit from virtualization
  const maxPosition = circuit.reduce((max, gate) => Math.max(max, gate.position), 0);
  const shouldVirtualize = maxPosition > 20;

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
        isMobile={isMobile}
      />
    );
  }

  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma' },
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary' },
    { type: 'M', name: 'Measure', color: 'bg-destructive' },
  ];

  const qubitLineSpacing = isMobile ? 50 : 60;
  const gateSize = isMobile ? 36 : 40;
  const touchTargetSize = isMobile ? 44 : gateSize; // Minimum 44px for touch targets

  return (
    <div className="flex-1">
      <div 
        ref={circuitRef} 
        className={`relative bg-quantum-matrix rounded-lg quantum-panel ${
          isMobile ? 'p-2 min-h-[280px]' : 'p-4 min-h-[320px]'
        }`}
        style={{ 
          backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${GRID_SIZE}px)`,
          overflowX: 'auto',
          touchAction: 'pan-x pinch-zoom'
        }}
      >
        {/* Qubit Lines */}
        {Array.from({ length: NUM_QUBITS }).map((_, i) => (
          <div key={i} className="flex items-center mb-4 relative" style={{ top: i * qubitLineSpacing + 20 }}>
            <div className={`text-xs font-mono text-quantum-neon absolute ${isMobile ? 'w-6 -left-8' : 'w-8 -left-10'}`}>
              q{i}
            </div>
            <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
            <div className={`text-xs font-mono text-muted-foreground absolute ${isMobile ? 'w-12 -right-14' : 'w-16 -right-20'}`}>
              {simulationResult?.qubitStates[i]?.state || '|0⟩'}
            </div>
          </div>
        ))}

        {/* Placed Gates */}
        {circuit.map((gate, index) => (
          <div
            key={gate.id}
            className={`absolute rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in zoom-in select-none ${
              gateTypes.find(g => g.type === gate.type)?.color || 'bg-secondary'
            }`}
            style={{
              left: gate.position * GRID_SIZE + (isMobile ? 10 : 20),
              top: gate.type === 'CNOT' ? 
                (gate.qubits ? gate.qubits[0] * qubitLineSpacing + (isMobile ? 10 : 15) : 0) : 
                (gate.qubit ? gate.qubit * qubitLineSpacing + (isMobile ? 10 : 15) : 0),
              width: `${touchTargetSize}px`,
              height: `${touchTargetSize}px`,
              minWidth: `${touchTargetSize}px`,
              minHeight: `${touchTargetSize}px`,
              animationDelay: `${index * 100}ms`,
              touchAction: 'manipulation'
            }}
            onClick={() => onDeleteGate(gate.id)}
            title="Tap to delete gate"
          >
            <span className={isMobile ? 'text-xs' : 'text-sm'}>{gate.type}</span>
            {gate.type === 'CNOT' && gate.qubits && (
              <div 
                className="absolute w-0.5 bg-quantum-neon animate-in slide-in-from-top"
                style={{
                  height: Math.abs(gate.qubits[1] - gate.qubits[0]) * qubitLineSpacing,
                  top: gate.qubits[0] < gate.qubits[1] ? '100%' : `-${Math.abs(gate.qubits[1] - gate.qubits[0]) * qubitLineSpacing}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  animationDelay: `${index * 100 + 200}ms`
                }}
              />
            )}
          </div>
        ))}

        {/* Drop Zone Indicator */}
        {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
          <div
            className="absolute border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
            style={{
              left: dragState.hoverPosition * GRID_SIZE + (isMobile ? 10 : 20),
              top: dragState.hoverQubit * qubitLineSpacing + (isMobile ? 10 : 15),
              width: `${touchTargetSize}px`,
              height: `${touchTargetSize}px`
            }}
          >
            <span className={isMobile ? 'text-xs' : 'text-sm'}>{dragState.gateType}</span>
          </div>
        )}
      </div>
    </div>
  );
}
