
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

  // Handle both mouse and touch events
  const handleStart = useCallback((
    clientX: number, 
    clientY: number, 
    gateType: string
  ) => {
    console.log('Drag start:', gateType, clientX, clientY);
    
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: clientX, y: clientY },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    console.log('Mouse down:', gateType);
    e.preventDefault();
    e.stopPropagation();
    handleStart(e.clientX, e.clientY, gateType);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    console.log('Touch start:', gateType);
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) {
      handleStart(touch.clientX, touch.clientY, gateType);
    }
  }, [handleStart]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragState.isDragging || !circuitRef.current) return;
    
    const circuitRect = circuitRef.current.getBoundingClientRect();
    const relativeX = clientX - circuitRect.left;
    const relativeY = clientY - circuitRect.top;
    
    // Calculate qubit and position with better accuracy
    const qubit = Math.floor((relativeY - 15) / 60);
    const position = Math.max(0, Math.floor((relativeX - 20) / gridSize));
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: clientX, y: clientY },
      hoverQubit: qubit >= 0 && qubit < numQubits ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging, gridSize, numQubits]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragState.isDragging) {
      handleMove(e.clientX, e.clientY);
    }
  }, [handleMove, dragState.isDragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (dragState.isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    }
  }, [handleMove, dragState.isDragging]);

  const handleEnd = useCallback(() => {
    console.log('Drag end:', dragState);
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const gateType = dragState.gateType;
      
      // Determine if this is a multi-qubit gate
      const multiQubitGates = ['CNOT', 'CX', 'CZ', 'SWAP', 'TOFFOLI', 'CCX', 'FREDKIN', 'CSWAP'];
      const isMultiQubit = multiQubitGates.includes(gateType);
      
      // Determine qubits array for multi-qubit gates
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
          default:
            qubits = [dragState.hoverQubit, Math.min(dragState.hoverQubit + 1, numQubits - 1)];
            break;
        }
      }
      
      // Set default parameters for parametric gates
      let angle: number | undefined;
      
      if (gateType.startsWith('R') || gateType === 'U1') {
        angle = Math.PI / 4;
      }
      
      const newGate: Gate = {
        id: `gate_${Date.now()}`,
        type: gateType,
        qubit,
        qubits,
        position: dragState.hoverPosition,
        angle
      };
      
      console.log('Adding gate:', newGate);
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

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  useEffect(() => {
    if (dragState.isDragging) {
      console.log('Adding event listeners');
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Prevent scrolling on mobile during drag
      document.body.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      
      return () => {
        console.log('Removing event listeners');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.touchAction = 'auto';
        document.body.style.overflow = 'auto';
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    dragState,
    circuitRef,
    handleMouseDown,
    handleTouchStart
  };
}
