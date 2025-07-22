
import React, { forwardRef, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Gate, Circuit } from '@/hooks/useCircuitWorkspace';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface CircuitCanvasProps {
  circuit: Circuit;
  dragState: DragState;
  onGateSelect: (gateId: string) => void;
  onGateDelete: (gateId: string) => void;
  selectedGate: string | null;
}

const GRID_SIZE = 60;
const QUBIT_SPACING = 80;
const GATE_SIZE = 50;

const gateColors = {
  'I': 'bg-slate-400',
  'X': 'bg-quantum-neon',
  'Y': 'bg-purple-500',
  'Z': 'bg-quantum-particle',
  'H': 'bg-quantum-glow',
  'S': 'bg-blue-500',
  'T': 'bg-cyan-500',
  'RX': 'bg-quantum-energy',
  'RY': 'bg-orange-500',
  'RZ': 'bg-yellow-500',
  'U1': 'bg-pink-500',
  'U2': 'bg-indigo-500',
  'U3': 'bg-violet-500',
  'CNOT': 'bg-quantum-plasma',
  'CX': 'bg-quantum-plasma',
  'CZ': 'bg-red-500',
  'SWAP': 'bg-green-500',
  'TOFFOLI': 'bg-emerald-600',
  'CCX': 'bg-emerald-600',
  'FREDKIN': 'bg-teal-600',
  'CSWAP': 'bg-teal-600',
  'M': 'bg-destructive',
  'BARRIER': 'bg-amber-600',
  'RESET': 'bg-gray-600',
};

export const CircuitCanvas = forwardRef<HTMLDivElement, CircuitCanvasProps>(
  ({ circuit, dragState, onGateSelect, onGateDelete, selectedGate }, ref) => {
    
    const maxPosition = useMemo(() => {
      return Math.max(...circuit.gates.map(g => g.position), 10);
    }, [circuit.gates]);

    const canvasWidth = (maxPosition + 5) * GRID_SIZE;
    const canvasHeight = circuit.qubits * QUBIT_SPACING + 100;

    const handleGateClick = useCallback((gate: Gate, e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.detail === 2) { // Double click
        onGateDelete(gate.id);
      } else {
        onGateSelect(gate.id);
      }
    }, [onGateSelect, onGateDelete]);

    const renderGate = useCallback((gate: Gate) => {
      const x = gate.position * GRID_SIZE + 80;
      const isSelected = selectedGate === gate.id;
      
      // Handle multi-qubit gates
      if (gate.qubits && gate.qubits.length > 1) {
        const minQubit = Math.min(...gate.qubits);
        const maxQubit = Math.max(...gate.qubits);
        
        return (
          <div key={gate.id} className="absolute">
            {/* Connection line for multi-qubit gates */}
            <div
              className="absolute w-0.5 bg-quantum-plasma shadow-glow"
              style={{
                left: x + GATE_SIZE / 2,
                top: minQubit * QUBIT_SPACING + 50,
                height: (maxQubit - minQubit) * QUBIT_SPACING,
                boxShadow: '0 0 4px hsl(var(--quantum-plasma) / 0.8)'
              }}
            />
            
            {/* Render gates on each qubit */}
            {gate.qubits.map((qubit, index) => (
              <div
                key={`${gate.id}-${qubit}`}
                className={cn(
                  "rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer transition-all duration-200 hover:scale-110 quantum-glow select-none shadow-lg",
                  gateColors[gate.type as keyof typeof gateColors] || 'bg-secondary',
                  isSelected 
                    ? "border-quantum-glow shadow-[0_0_20px_hsl(var(--quantum-glow))] scale-110" 
                    : "border-current hover:shadow-[0_0_15px_currentColor]"
                )}
                style={{
                  left: x,
                  top: qubit * QUBIT_SPACING + 25,
                  width: GATE_SIZE,
                  height: GATE_SIZE,
                  zIndex: isSelected ? 10 : 1
                }}
                onClick={(e) => handleGateClick(gate, e)}
                title={`${gate.type} gate (double-click to delete)`}
              >
                <div className="text-center">
                  <div className="font-bold">
                    {gate.type === 'CNOT' || gate.type === 'CX' ? 
                      (index === 0 ? '●' : '⊕') : 
                      gate.type.length > 4 ? gate.type.substring(0, 3) : gate.type}
                  </div>
                  {gate.angle && (
                    <div className="text-xs opacity-75">
                      {gate.angle.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }
      
      // Single qubit gate - handle both qubit and qubits[0] cases
      const qubitIndex = gate.qubit !== undefined ? gate.qubit : (gate.qubits ? gate.qubits[0] : 0);
      
      return (
        <div key={gate.id} className="absolute">
          <div
            className={cn(
              "rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer transition-all duration-200 hover:scale-110 quantum-glow select-none shadow-lg",
              gateColors[gate.type as keyof typeof gateColors] || 'bg-secondary',
              isSelected 
                ? "border-quantum-glow shadow-[0_0_20px_hsl(var(--quantum-glow))] scale-110" 
                : "border-current hover:shadow-[0_0_15px_currentColor]"
            )}
            style={{
              left: x,
              top: (qubitIndex || 0) * QUBIT_SPACING + 25,
              width: GATE_SIZE,
              height: GATE_SIZE,
              zIndex: isSelected ? 10 : 1
            }}
            onClick={(e) => handleGateClick(gate, e)}
            title={`${gate.type} gate on qubit ${qubitIndex || 0} (double-click to delete)`}
          >
            <div className="text-center">
              <div className="font-bold">
                {gate.type.length > 4 ? gate.type.substring(0, 3) : gate.type}
              </div>
              {gate.angle && (
                <div className="text-xs opacity-75">
                  {gate.angle.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }, [selectedGate, handleGateClick]);

    return (
      <div className="relative h-full overflow-auto bg-quantum-void">
        <div 
          ref={ref}
          className="relative min-h-full p-8"
          style={{ 
            width: Math.max(canvasWidth, 800),
            height: Math.max(canvasHeight, 400),
            backgroundImage: `
              radial-gradient(circle at 1px 1px, hsl(var(--quantum-neon) / 0.15) 1px, transparent 0),
              linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px),
              linear-gradient(hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px, ${GRID_SIZE}px ${GRID_SIZE}px, ${QUBIT_SPACING}px ${QUBIT_SPACING}px`
          }}
        >
          {/* Qubit Lines */}
          {Array.from({ length: circuit.qubits }).map((_, qubitIndex) => (
            <div key={`qubit-${qubitIndex}`} className="absolute flex items-center">
              <div 
                className="absolute left-0 text-sm font-mono text-quantum-neon font-semibold"
                style={{ top: qubitIndex * QUBIT_SPACING + 40 }}
              >
                |q{qubitIndex}⟩
              </div>
              <div
                className="absolute h-0.5 bg-gradient-to-r from-quantum-neon to-quantum-glow"
                style={{
                  top: qubitIndex * QUBIT_SPACING + 50,
                  left: 80,
                  right: 40,
                  boxShadow: '0 0 4px hsl(var(--quantum-neon) / 0.5)'
                }}
              />
            </div>
          ))}

          {/* Circuit Gates */}
          {circuit.gates.map(renderGate)}

          {/* Drop Zone Indicator */}
          {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
            <div
              className="absolute border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
              style={{
                left: dragState.hoverPosition * GRID_SIZE + 80,
                top: dragState.hoverQubit * QUBIT_SPACING + 25,
                width: GATE_SIZE,
                height: GATE_SIZE
              }}
            >
              {dragState.gateType}
            </div>
          )}

          {/* Position Markers */}
          {Array.from({ length: maxPosition + 1 }).map((_, position) => (
            <div
              key={`marker-${position}`}
              className="absolute text-xs text-quantum-particle font-mono"
              style={{
                left: position * GRID_SIZE + 90,
                top: 10
              }}
            >
              {position}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CircuitCanvas.displayName = 'CircuitCanvas';
