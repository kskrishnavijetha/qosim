import React, { memo } from 'react';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

interface MemoizedGateProps {
  gate: Gate;
  index: number;
  gridSize: number;
  onDeleteGate: (gateId: string) => void;
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
  onDeleteGate 
}: MemoizedGateProps) {
  const gateConfig = gateTypes.find(g => g.type === gate.type);
  
  return (
    <>
      <div
        className={`absolute w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in zoom-in ${
          gateConfig?.color || 'bg-secondary'
        }`}
        style={{
          left: gate.position * gridSize + 20,
          top: gate.type === 'CNOT' ? (gate.qubits ? gate.qubits[0] * 60 + 15 : 0) : (gate.qubit ? gate.qubit * 60 + 15 : 0),
          animationDelay: `${index * 100}ms`
        }}
        onClick={() => onDeleteGate(gate.id)}
        title="Click to delete gate"
      >
        {gate.type}
      </div>
      
      {/* CNOT connection line */}
      {gate.type === 'CNOT' && gate.qubits && (
        <div 
          className="absolute w-0.5 bg-quantum-neon animate-in slide-in-from-top"
          style={{
            height: Math.abs(gate.qubits[1] - gate.qubits[0]) * 60,
            top: gate.qubits[0] < gate.qubits[1] ? 
              (gate.qubits[0] * 60 + 15 + 40) : 
              (gate.qubits[1] * 60 + 15 + 40),
            left: gate.position * gridSize + 20 + 20,
            transform: 'translateX(-50%)',
            animationDelay: `${index * 100 + 200}ms`
          }}
        />
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.gate.id === nextProps.gate.id &&
    prevProps.gate.position === nextProps.gate.position &&
    prevProps.gate.qubit === nextProps.gate.qubit &&
    JSON.stringify(prevProps.gate.qubits) === JSON.stringify(nextProps.gate.qubits) &&
    prevProps.gridSize === nextProps.gridSize
  );
});