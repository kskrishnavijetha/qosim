
import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface UseSimpleDragDropProps {
  onGateAdd: (gateType: string, qubit: number, position: number) => void;
  numQubits: number;
  gridSize: number;
}

export function useSimpleDragDrop({ onGateAdd, numQubits, gridSize }: UseSimpleDragDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null
  });

  const circuitRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverQubit: null,
      hoverPosition: null
    });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!circuitRef.current) return;
      
      const rect = circuitRef.current.getBoundingClientRect();
      const relativeX = moveEvent.clientX - rect.left;
      const relativeY = moveEvent.clientY - rect.top;
      
      // Calculate qubit (every 60px vertically, starting at y=19)
      const qubit = Math.floor((relativeY - 19) / 60);
      // Calculate position (every gridSize pixels horizontally, starting at x=12)
      const position = Math.max(0, Math.floor((relativeX - 12) / gridSize));
      
      const validQubit = qubit >= 0 && qubit < numQubits ? qubit : null;
      const validPosition = position >= 0 ? position : null;
      
      setDragState(prev => ({
        ...prev,
        dragPosition: { x: moveEvent.clientX, y: moveEvent.clientY },
        hoverQubit: validQubit,
        hoverPosition: validPosition
      }));
    };

    const handleMouseUp = () => {
      setDragState(prev => {
        if (prev.hoverQubit !== null && prev.hoverPosition !== null) {
          onGateAdd(prev.gateType, prev.hoverQubit, prev.hoverPosition);
        }
        
        return {
          isDragging: false,
          gateType: '',
          dragPosition: { x: 0, y: 0 },
          hoverQubit: null,
          hoverPosition: null
        };
      });
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onGateAdd, numQubits, gridSize]);

  const handleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    if (!touch) return;
    
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: touch.clientX, y: touch.clientY },
      hoverQubit: null,
      hoverPosition: null
    });

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      const touch = moveEvent.touches[0];
      if (!touch || !circuitRef.current) return;
      
      const rect = circuitRef.current.getBoundingClientRect();
      const relativeX = touch.clientX - rect.left;
      const relativeY = touch.clientY - rect.top;
      
      const qubit = Math.floor((relativeY - 19) / 60);
      const position = Math.max(0, Math.floor((relativeX - 12) / gridSize));
      
      const validQubit = qubit >= 0 && qubit < numQubits ? qubit : null;
      const validPosition = position >= 0 ? position : null;
      
      setDragState(prev => ({
        ...prev,
        dragPosition: { x: touch.clientX, y: touch.clientY },
        hoverQubit: validQubit,
        hoverPosition: validPosition
      }));
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setDragState(prev => {
        if (prev.hoverQubit !== null && prev.hoverPosition !== null) {
          onGateAdd(prev.gateType, prev.hoverQubit, prev.hoverPosition);
        }
        
        return {
          isDragging: false,
          gateType: '',
          dragPosition: { x: 0, y: 0 },
          hoverQubit: null,
          hoverPosition: null
        };
      });
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.touchAction = 'auto';
      document.body.style.overflow = 'auto';
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.body.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';
  }, [onGateAdd, numQubits, gridSize]);

  return {
    dragState,
    circuitRef,
    handleMouseDown,
    handleTouchStart
  };
}
