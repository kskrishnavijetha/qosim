
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

export function DraggingGate({ dragState }: DraggingGateProps) {
  const isMobile = useIsMobile();
  
  if (!dragState.isDragging) return null;

  const gateStyle = getGateStyle(dragState.gateType);
  const width = isMobile ? 40 : 48;
  const height = isMobile ? 24 : 28;

  return (
    <div
      className={cn(
        "fixed rounded border-2 flex items-center justify-center font-bold pointer-events-none z-50 shadow-lg animate-pulse",
        isMobile ? "text-xs" : "text-sm",
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
      {dragState.gateType}
    </div>
  );
}
