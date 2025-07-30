
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
    I: { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-600' },
    H: { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700' },
    X: { bg: 'bg-cyan-500', text: 'text-white', border: 'border-cyan-600' },
    Y: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    Z: { bg: 'bg-purple-700', text: 'text-white', border: 'border-purple-800' },
    S: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-700' },
    T: { bg: 'bg-cyan-600', text: 'text-white', border: 'border-cyan-700' },
    RX: { bg: 'bg-cyan-400', text: 'text-white', border: 'border-cyan-500' },
    RY: { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-600' },
    RZ: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-600' },
    CNOT: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    CX: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600' },
    CZ: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' },
    SWAP: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' },
    M: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' },
    BARRIER: { bg: 'bg-amber-500', text: 'text-black', border: 'border-amber-600' }
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
  const gateWidth = 32;
  const gateHeight = 24;
  const fontSize = 'text-xs';
  
  const gateStyle = getGateStyle(gate.type);
  
  // Calculate gate position
  const leftPosition = gate.position * gridSize + 12;
  const topPosition = gate.type === 'CNOT' || gate.type === 'CX' 
    ? (gate.qubits ? gate.qubits[0] * qubitSpacing + 19 : 0) 
    : (gate.qubit !== undefined ? gate.qubit * qubitSpacing + 19 : 0);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteGate(gate.id);
  };

  return (
    <>
      {/* Multi-qubit gate connection line */}
      {(gate.type === 'CNOT' || gate.type === 'CX' || gate.type === 'CZ' || gate.type === 'SWAP') && gate.qubits && gate.qubits.length >= 2 && (
        <div
          className="absolute w-0.5 bg-quantum-neon"
          style={{
            left: leftPosition + gateWidth / 2,
            top: gate.qubits[0] * qubitSpacing + 19 + gateHeight / 2,
            height: Math.abs(gate.qubits[1] - gate.qubits[0]) * qubitSpacing,
            animationDelay: `${index * 100 + 50}ms`
          }}
        />
      )}
      
      {/* Main gate */}
      <div
        className={`absolute rounded border flex items-center justify-center ${fontSize} font-bold cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm ${gateStyle.bg} ${gateStyle.text} ${gateStyle.border}`}
        style={{
          width: gateWidth,
          height: gateHeight,
          left: leftPosition,
          top: topPosition,
          animationDelay: `${index * 50}ms`
        }}
        onDoubleClick={handleDoubleClick}
        title={`${gate.type} gate - Double-click to delete`}
      >
        {gate.type === 'BARRIER' ? 'BAR' : gate.type}
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
          className="absolute w-3 h-3 rounded-full border border-quantum-neon bg-white flex items-center justify-center"
          style={{
            left: leftPosition + (gateWidth - 12) / 2,
            top: gate.qubits[1] * qubitSpacing + 19 + (gateHeight - 12) / 2
          }}
        >
          <div className="w-1.5 h-1.5 bg-quantum-neon rounded-full" />
        </div>
      )}

      {/* Special rendering for SWAP gates */}
      {gate.type === 'SWAP' && gate.qubits && gate.qubits.length >= 2 && (
        <>
          <div
            className="absolute w-3 h-3 transform rotate-45 border border-quantum-neon bg-white"
            style={{
              left: leftPosition + (gateWidth - 12) / 2,
              top: gate.qubits[0] * qubitSpacing + 19 + (gateHeight - 12) / 2
            }}
          />
          <div
            className="absolute w-3 h-3 transform rotate-45 border border-quantum-neon bg-white"
            style={{
              left: leftPosition + (gateWidth - 12) / 2,
              top: gate.qubits[1] * qubitSpacing + 19 + (gateHeight - 12) / 2
            }}
          />
        </>
      )}
    </>
  );
});
