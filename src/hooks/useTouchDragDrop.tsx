
import { useState, useCallback, useRef, useEffect } from 'react';
import { Gate } from './useCircuitState';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface UseTouchDragDropProps {
  onGateAdd: (gate: Gate) => void;
  numQubits: number;
  gridSize: number;
}

export function useTouchDragDrop({ onGateAdd, numQubits, gridSize }: UseTouchDragDropProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null
  });

  const circuitRef = useRef<HTMLDivElement>(null);
  const touchIdentifier = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;

    touchIdentifier.current = touch.identifier;
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: touch.clientX, y: touch.clientY },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!dragState.isDragging || !circuitRef.current || touchIdentifier.current === null) return;
    
    const touch = Array.from(e.touches).find(t => t.identifier === touchIdentifier.current);
    if (!touch) return;

    e.preventDefault();
    
    const circuitRect = circuitRef.current.getBoundingClientRect();
    const relativeX = touch.clientX - circuitRect.left;
    const relativeY = touch.clientY - circuitRect.top;
    
    // Calculate qubit and position with touch-friendly zones
    const touchZoneSize = Math.max(gridSize * 1.2, 60); // Larger touch targets
    const qubit = Math.floor((relativeY - 16 - 15) / touchZoneSize);
    const position = Math.floor((relativeX - 16 - 20) / gridSize);
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: touch.clientX, y: touch.clientY },
      hoverQubit: qubit >= 0 && qubit < numQubits ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging, gridSize, numQubits]);

  const handleTouchEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const gateType = dragState.gateType;
      
      // Create new gate with same logic as mouse drag
      const multiQubitGates = ['CNOT', 'CX', 'CZ', 'SWAP', 'TOFFOLI', 'CCX', 'FREDKIN', 'CSWAP'];
      const isMultiQubit = multiQubitGates.includes(gateType);
      
      let qubits: number[] | undefined;
      let qubit: number | undefined = dragState.hoverQubit;
      
      if (isMultiQubit) {
        qubit = undefined;
        switch (gateType) {
          case 'CNOT':
          case 'CX':
          case 'CZ':
          case 'SWAP':
            qubits = [dragState.hoverQubit, Math.min(dragState.hoverQubit + 1, numQubits - 1)];
            break;
          case 'TOFFOLI':
          case 'CCX':
          case 'FREDKIN':
          case 'CSWAP':
            qubits = [
              dragState.hoverQubit, 
              Math.min(dragState.hoverQubit + 1, numQubits - 1),
              Math.min(dragState.hoverQubit + 2, numQubits - 1)
            ];
            break;
        }
      }
      
      let angle: number | undefined;
      let params: number[] | undefined;
      
      if (gateType.startsWith('R') || gateType === 'U1') {
        angle = Math.PI / 4;
      } else if (gateType === 'U2') {
        params = [0, Math.PI / 2];
      } else if (gateType === 'U3') {
        params = [Math.PI / 2, 0, Math.PI / 2];
      }
      
      const newGate: Gate = {
        id: `gate_${Date.now()}`,
        type: gateType,
        qubit,
        qubits,
        position: dragState.hoverPosition,
        angle,
        params
      };
      
      onGateAdd(newGate);
    }
    
    touchIdentifier.current = null;
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
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragState.isDragging, handleTouchMove, handleTouchEnd]);

  return {
    dragState,
    circuitRef,
    handleTouchStart
  };
}
