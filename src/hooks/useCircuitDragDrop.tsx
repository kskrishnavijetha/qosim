import { useState, useCallback, useRef, useEffect } from 'react';
import { Gate } from './useCircuitState';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface UseCircuitDragDropProps {
  onGateAdd: (gate: Gate) => void;
  numQubits: number;
  gridSize: number;
}

export function useCircuitDragDrop({ onGateAdd, numQubits, gridSize }: UseCircuitDragDropProps) {
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
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !circuitRef.current) return;
    
    const circuitRect = circuitRef.current.getBoundingClientRect();
    const relativeX = e.clientX - circuitRect.left;
    const relativeY = e.clientY - circuitRect.top;
    
    // Match the exact positioning logic from CircuitGrid:
    // - Account for 16px padding (p-4)
    // - Gates are positioned at qubit * 60 + 15, so we calculate based on that
    const qubit = Math.floor((relativeY - 16 - 15) / 60);
    const position = Math.floor((relativeX - 16 - 20) / gridSize);
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverQubit: qubit >= 0 && qubit < numQubits ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging, gridSize, numQubits]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const newGate: Gate = {
        id: `gate_${Date.now()}`,
        type: dragState.gateType,
        qubit: dragState.gateType === 'CNOT' ? undefined : dragState.hoverQubit,
        qubits: dragState.gateType === 'CNOT' ? [dragState.hoverQubit, Math.min(dragState.hoverQubit + 1, numQubits - 1)] : undefined,
        position: dragState.hoverPosition,
        angle: dragState.gateType.startsWith('R') ? Math.PI / 4 : undefined
      };
      
      onGateAdd(newGate);
    }
    
    setDragState({
      isDragging: false,
      gateType: '',
      dragPosition: { x: 0, y: 0 },
      hoverQubit: null,
      hoverPosition: null
    });
  }, [dragState, onGateAdd, numQubits]);

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return {
    dragState,
    circuitRef,
    handleMouseDown
  };
}