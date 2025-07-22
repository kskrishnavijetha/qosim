
import React from "react";
import { type OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { VirtualizedCircuitGrid } from "./VirtualizedCircuitGrid";

// Import types from the workspace hook to ensure consistency
import type { Gate, Circuit } from '@/hooks/useCircuitWorkspace';

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

  // Fallback to original rendering for small circuits
  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma' },
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary' },
    { type: 'M', name: 'Measure', color: 'bg-destructive' },
  ];

  return (
    <div className="flex-1">
      <div 
        ref={circuitRef} 
        className="relative bg-quantum-matrix rounded-lg p-4 min-h-[320px] quantum-panel"
        style={{ backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${GRID_SIZE}px)` }}
      >
        {/* Qubit Lines */}
        {Array.from({ length: NUM_QUBITS }).map((_, i) => (
          <div key={i} className="flex items-center mb-4 relative" style={{ top: i * 60 + 20 }}>
            <div className="w-8 text-xs font-mono text-quantum-neon absolute -left-10">q{i}</div>
            <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
            <div className="w-16 text-xs font-mono text-muted-foreground absolute -right-20">
              {simulationResult?.qubitStates[i]?.state || '|0⟩'}
            </div>
          </div>
        ))}

        {/* Placed Gates */}
        {circuit.map((gate, index) => (
          <div
            key={gate.id}
            className={`absolute w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in zoom-in ${
              gateTypes.find(g => g.type === gate.type)?.color || 'bg-secondary'
            }`}
            style={{
              left: gate.position * GRID_SIZE + 20,
              top: gate.type === 'CNOT' ? (gate.qubits ? gate.qubits[0] * 60 + 15 : 0) : (gate.qubit ? gate.qubit * 60 + 15 : 0),
              animationDelay: `${index * 100}ms`
            }}
            onClick={() => onDeleteGate(gate.id)}
            title="Click to delete gate"
          >
            {gate.type}
            {gate.type === 'CNOT' && gate.qubits && (
              <div 
                className="absolute w-0.5 bg-quantum-neon animate-in slide-in-from-top"
                style={{
                  height: Math.abs(gate.qubits[1] - gate.qubits[0]) * 60,
                  top: gate.qubits[0] < gate.qubits[1] ? '100%' : `-${Math.abs(gate.qubits[1] - gate.qubits[0]) * 60}px`,
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
            className="absolute w-10 h-10 border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
            style={{
              left: dragState.hoverPosition * GRID_SIZE + 20,
              top: dragState.hoverQubit * 60 + 15
            }}
          >
            {dragState.gateType}
          </div>
        )}
      </div>
    </div>
  );
}
