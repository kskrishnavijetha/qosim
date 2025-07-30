
import React, { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  qubitSpacing?: number;
}

const getGateStyle = (type: string) => {
  const styles = {
    H: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
    X: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' },
    Y: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' },
    Z: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    S: { bg: 'bg-yellow-500', text: 'text-black', border: 'border-yellow-600' },
    T: { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-600' },
    RX: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    RY: { bg: 'bg-teal-500', text: 'text-white', border: 'border-teal-600' },
    RZ: { bg: 'bg-indigo-500', text: 'text-white', border: 'border-indigo-600' },
    CNOT: { bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-800' },
    CX: { bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-800' },
    CZ: { bg: 'bg-slate-600', text: 'text-white', border: 'border-slate-700' },
    SWAP: { bg: 'bg-cyan-500', text: 'text-white', border: 'border-cyan-600' },
    M: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-700' }
  };
  return styles[type as keyof typeof styles] || { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' };
};

export const MemoizedGate = memo(function MemoizedGate({ 
  gate, 
  index, 
  gridSize, 
  onDeleteGate,
  qubitSpacing = 60
}: MemoizedGateProps) {
  const isMobile = useIsMobile();
  const gateWidth = isMobile ? 40 : 48;
  const gateHeight = isMobile ? 24 : 28;
  const fontSize = isMobile ? 'text-xs' : 'text-sm';
  
  const gateStyle = getGateStyle(gate.type);
  
  // Calculate gate position
  const leftPosition = gate.position * gridSize + (isMobile ? 8 : 12);
  const topPosition = gate.type === 'CNOT' || gate.type === 'CX' 
    ? (gate.qubits ? gate.qubits[0] * qubitSpacing + 21 : 0) 
    : (gate.qubit !== undefined ? gate.qubit * qubitSpacing + 21 : 0);

  return (
    <>
      {/* Multi-qubit gate connection line */}
      {(gate.type === 'CNOT' || gate.type === 'CX' || gate.type === 'CZ' || gate.type === 'SWAP') && gate.qubits && gate.qubits.length >= 2 && (
        <div
          className="absolute w-0.5 bg-quantum-neon"
          style={{
            left: leftPosition + gateWidth / 2,
            top: gate.qubits[0] * qubitSpacing + 21 + gateHeight / 2,
            height: Math.abs(gate.qubits[1] - gate.qubits[0]) * qubitSpacing,
            animationDelay: `${index * 100 + 50}ms`
          }}
        />
      )}
      
      {/* Main gate */}
      <div
        className={`absolute rounded border-2 flex items-center justify-center ${fontSize} font-bold cursor-pointer hover:scale-105 transition-all duration-200 shadow-md ${gateStyle.bg} ${gateStyle.text} ${gateStyle.border}`}
        style={{
          width: gateWidth,
          height: gateHeight,
          left: leftPosition,
          top: topPosition,
          animationDelay: `${index * 50}ms`
        }}
        onClick={() => onDeleteGate(gate.id)}
        title={`${gate.type} gate - Click to delete`}
      >
        {gate.type}
      </div>
      
      {/* Parameter display for rotation gates */}
      {gate.angle && (gate.type.startsWith('R') || gate.type === 'U1') && (
        <div
          className="absolute text-xs font-mono text-muted-foreground"
          style={{
            left: leftPosition,
            top: topPosition + gateHeight + 2,
            width: gateWidth,
            textAlign: 'center'
          }}
        >
          {(gate.angle * 180 / Math.PI).toFixed(0)}°
        </div>
      )}

      {/* Special rendering for CNOT target */}
      {(gate.type === 'CNOT' || gate.type === 'CX') && gate.qubits && gate.qubits.length >= 2 && (
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-quantum-neon bg-white flex items-center justify-center"
          style={{
            left: leftPosition + (gateWidth - 16) / 2,
            top: gate.qubits[1] * qubitSpacing + 21 + (gateHeight - 16) / 2
          }}
        >
          <div className="w-2 h-2 bg-quantum-neon rounded-full" />
        </div>
      )}

      {/* Special rendering for SWAP gates */}
      {gate.type === 'SWAP' && gate.qubits && gate.qubits.length >= 2 && (
        <>
          <div
            className="absolute w-4 h-4 transform rotate-45 border-2 border-quantum-neon bg-white"
            style={{
              left: leftPosition + (gateWidth - 16) / 2,
              top: gate.qubits[0] * qubitSpacing + 21 + (gateHeight - 16) / 2
            }}
          />
          <div
            className="absolute w-4 h-4 transform rotate-45 border-2 border-quantum-neon bg-white"
            style={{
              left: leftPosition + (gateWidth - 16) / 2,
              top: gate.qubits[1] * qubitSpacing + 21 + (gateHeight - 16) / 2
            }}
          />
        </>
      )}
    </>
  );
});
