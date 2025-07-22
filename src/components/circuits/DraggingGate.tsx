
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Import consistent drag state interface
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
  const isMobile = useIsMobile();
  
  if (!dragState.isDragging) return null;

  return (
    <div
      className={cn(
        "fixed rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black pointer-events-none z-50 quantum-glow animate-pulse shadow-2xl transition-transform",
        gateTypes.find(g => g.type === dragState.gateType)?.color || 'bg-secondary',
        isMobile ? "w-8 h-8 scale-110" : "w-10 h-10 scale-110"
      )}
      style={{
        left: dragState.dragPosition.x - (isMobile ? 16 : 20),
        top: dragState.dragPosition.y - (isMobile ? 16 : 20),
        transform: isMobile ? 'rotate(2deg) scale(1.2)' : 'rotate(5deg) scale(1.1)',
        touchAction: 'none'
      }}
    >
      {dragState.gateType}
    </div>
  );
}
