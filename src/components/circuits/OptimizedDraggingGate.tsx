
import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { useDragDrop } from '@/contexts/DragDropContext';
import { cn } from '@/lib/utils';

export const OptimizedDraggingGate = memo(function OptimizedDraggingGate() {
  const { state } = useDragDrop();
  
  if (!state.dragState.isDragging) return null;

  const gateColors = {
    'I': 'bg-slate-500',
    'H': 'bg-quantum-glow',
    'X': 'bg-quantum-neon',
    'Y': 'bg-purple-500',
    'Z': 'bg-quantum-particle',
    'S': 'bg-blue-500',
    'T': 'bg-cyan-500',
    'SDG': 'bg-blue-600',
    'TDG': 'bg-cyan-600',
    'CNOT': 'bg-quantum-plasma',
    'CX': 'bg-quantum-plasma',
    'CY': 'bg-pink-500',
    'CZ': 'bg-red-500',
    'CH': 'bg-yellow-500',
    'CCX': 'bg-red-600',
    'SWAP': 'bg-green-500',
    'ISWAP': 'bg-green-600',
    'CSWAP': 'bg-green-700',
    'RX': 'bg-quantum-energy',
    'RY': 'bg-secondary',
    'RZ': 'bg-orange-500',
    'U1': 'bg-indigo-500',
    'U2': 'bg-indigo-600',
    'U3': 'bg-indigo-700',
    'MEASURE': 'bg-destructive',
    'RESET': 'bg-slate-600',
    'BARRIER': 'bg-amber-500'
  };

  const gateColor = gateColors[state.dragState.gateType] || 'bg-slate-500';

  return createPortal(
    <div
      className="fixed pointer-events-none z-[99999] transition-transform duration-100"
      style={{
        left: state.dragState.dragPosition.x - 20,
        top: state.dragState.dragPosition.y - 20,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black quantum-glow shadow-lg backdrop-blur-sm",
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
