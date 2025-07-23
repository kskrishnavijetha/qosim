
import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useDragDrop } from '@/contexts/DragDropContext';

const GATE_COLORS = {
  'H': 'bg-quantum-glow',
  'X': 'bg-quantum-neon',
  'Y': 'bg-purple-500',
  'Z': 'bg-quantum-particle',
  'S': 'bg-blue-500',
  'T': 'bg-cyan-500',
  'RX': 'bg-quantum-energy',
  'RY': 'bg-secondary',
  'RZ': 'bg-orange-500',
  'CNOT': 'bg-quantum-plasma',
  'CZ': 'bg-red-500',
  'SWAP': 'bg-green-500',
  'M': 'bg-destructive'
};

export const OptimizedDraggingGate = memo(function OptimizedDraggingGate() {
  const { dragState } = useDragDrop();
  
  const style = useMemo(() => ({
    left: `${dragState.dragPosition.x - dragState.offset.x}px`,
    top: `${dragState.dragPosition.y - dragState.offset.y}px`,
    transform: 'scale(1.1) rotate(2deg)',
    touchAction: 'none'
  }), [dragState.dragPosition, dragState.offset]);

  if (!dragState.isDragging) return null;

  return (
    <div
      className={cn(
        "fixed w-12 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black pointer-events-none z-50 quantum-glow animate-pulse shadow-2xl",
        GATE_COLORS[dragState.gateType as keyof typeof GATE_COLORS] || 'bg-secondary'
      )}
      style={style}
    >
      {dragState.gateType}
    </div>
  );
});
