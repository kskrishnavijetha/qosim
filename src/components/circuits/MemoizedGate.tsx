
import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Import types from the workspace hook to ensure consistency
import type { Gate } from '@/hooks/useCircuitWorkspace';

interface MemoizedGateProps {
  gate: Gate;
  index: number;
  gridSize: number;
  onDeleteGate: (gateId: string) => void;
  qubitSpacing?: number;
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

export const MemoizedGate = memo(function MemoizedGate({ 
  gate, 
  index, 
  gridSize, 
  onDeleteGate,
  qubitSpacing = 60
}: MemoizedGateProps) {
  const isMobile = useIsMobile();
  const gateSize = isMobile ? 32 : 40;
  const fontSize = isMobile ? 'text-xs' : 'text-xs';
  
  const gateColor = gateTypes.find(g => g.type === gate.type)?.color || 'bg-secondary';

  return (
    <>
      <div
        className={`absolute rounded-lg border-2 flex items-center justify-center ${fontSize} font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in zoom-in ${gateColor}`}
        style={{
          width: gateSize,
          height: gateSize,
          left: gate.position * gridSize + (isMobile ? 16 : 20),
          top: gate.type === 'CNOT' 
            ? (gate.qubits ? gate.qubits[0] * qubitSpacing + 15 : 0) 
            : (gate.qubit ? gate.qubit * qubitSpacing + 15 : 0),
          animationDelay: `${index * 100}ms`
        }}
        onClick={() => onDeleteGate(gate.id)}
        title="Click to delete gate"
      >
        {isMobile && gate.type.length > 2 ? gate.type.charAt(0) : gate.type}
        {gate.type === 'CNOT' && gate.qubits && (
          <div 
            className="absolute w-0.5 bg-quantum-neon animate-in slide-in-from-top"
            style={{
              height: Math.abs(gate.qubits[1] - gate.qubits[0]) * qubitSpacing,
              top: gate.qubits[0] < gate.qubits[1] ? '100%' : `-${Math.abs(gate.qubits[1] - gate.qubits[0]) * qubitSpacing}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              animationDelay: `${index * 100 + 200}ms`
            }}
          />
        )}
      </div>
    </>
  );
});
