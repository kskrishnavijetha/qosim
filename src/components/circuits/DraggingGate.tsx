import React from 'react';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface DraggingGateProps {
  dragState: DragState;
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

export function DraggingGate({ dragState }: DraggingGateProps) {
  if (!dragState.isDragging) return null;

  return (
    <div
      className={`fixed w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black pointer-events-none z-50 quantum-glow animate-pulse shadow-2xl ${
        gateTypes.find(g => g.type === dragState.gateType)?.color || 'bg-secondary'
      }`}
      style={{
        left: dragState.dragPosition.x - 20,
        top: dragState.dragPosition.y - 20,
        transform: 'rotate(5deg) scale(1.1)'
      }}
    >
      {dragState.gateType}
    </div>
  );
}