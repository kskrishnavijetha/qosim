
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

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

export function DraggingGate({ dragState }: DraggingGateProps) {
  if (!dragState.isDragging) return null;

  const gateStyle = getGateStyle(dragState.gateType);
  const width = 32;
  const height = 24;

  return (
    <div
      className={cn(
        "fixed rounded border flex items-center justify-center font-bold pointer-events-none z-50 shadow-lg text-xs",
        gateStyle.bg,
        gateStyle.text,
        gateStyle.border
      )}
      style={{
        width,
        height,
        left: dragState.dragPosition.x - width / 2,
        top: dragState.dragPosition.y - height / 2,
        transform: 'scale(1.1)',
        touchAction: 'none'
      }}
    >
      {dragState.gateType === 'BARRIER' ? 'BAR' : dragState.gateType}
    </div>
  );
}
