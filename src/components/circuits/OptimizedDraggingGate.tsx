
import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { useDragDrop } from '@/contexts/DragDropContext';
import { cn } from '@/lib/utils';

export const OptimizedDraggingGate = memo(function OptimizedDraggingGate() {
  const { state } = useDragDrop();
  
  if (!state.dragState.isDragging) return null;

  const gateColors = {
    'H': 'bg-quantum-glow',
    'X': 'bg-quantum-neon',
    'Y': 'bg-purple-500',
    'Z': 'bg-quantum-particle',
    'CNOT': 'bg-quantum-plasma',
    'CX': 'bg-quantum-plasma',
    'RX': 'bg-quantum-energy',
    'RY': 'bg-secondary',
    'RZ': 'bg-orange-500',
    'MEASURE': 'bg-destructive'
  };

  const gateColor = gateColors[state.dragState.gateType] || 'bg-slate-500';

  return createPortal(
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-100"
      style={{
        left: state.dragState.dragPosition.x - 20,
        top: state.dragState.dragPosition.y - 20,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black quantum-glow shadow-lg",
        gateColor,
        state.dragState.hoverQubit !== null && state.dragState.hoverPosition !== null
          ? "scale-110 animate-pulse"
          : "scale-100 opacity-70"
      )}>
        {state.dragState.gateType.length > 4 
          ? state.dragState.gateType.slice(0, 3) 
          : state.dragState.gateType}
      </div>
    </div>,
    document.body
  );
});
