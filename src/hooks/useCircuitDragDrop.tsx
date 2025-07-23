
import { useState, useCallback, useRef, useEffect } from 'react';

// Define the Gate interface to match the workspace
interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  angle?: number;
  controlQubit?: number;
  params?: number[];
  qubits?: number[];
}

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
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Handle both mouse and touch events
  const handleStart = useCallback((
    clientX: number, 
    clientY: number, 
    gateType: string,
    target: HTMLElement
  ) => {
    const rect = target.getBoundingClientRect();
    dragStartRef.current = { x: clientX, y: clientY };
    
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: clientX, y: clientY },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY, gateType, e.currentTarget as HTMLElement);
  }, [handleStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      handleStart(touch.clientX, touch.clientY, gateType, e.currentTarget as HTMLElement);
    }
  }, [handleStart]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragState.isDragging || !circuitRef.current) return;
    
    const circuitRect = circuitRef.current.getBoundingClientRect();
    const relativeX = clientX - circuitRect.left;
    const relativeY = clientY - circuitRect.top;
    
    // Calculate qubit and position with touch-friendly tolerances
    const touchTolerance = window.innerWidth < 768 ? 30 : 16; // Larger tolerance on mobile
    const qubit = Math.floor((relativeY - touchTolerance - 15) / 60);
    const position = Math.floor((relativeX - touchTolerance - 20) / gridSize);
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: clientX, y: clientY },
      hoverQubit: qubit >= 0 && qubit < numQubits ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging, gridSize, numQubits]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const gateType = dragState.gateType;
      
      // Determine if this is a multi-qubit gate
      const multiQubitGates = ['CNOT', 'CX', 'CZ', 'SWAP', 'TOFFOLI', 'CCX', 'FREDKIN', 'CSWAP'];
      const isMultiQubit = multiQubitGates.includes(gateType);
      
      // For multi-qubit gates, use qubits array; for single-qubit gates, use qubit
      let qubit = dragState.hoverQubit;
      let qubits: number[] | undefined;
      
      if (isMultiQubit) {
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
          case 'QFT':
            qubits = Array.from({ length: Math.min(3, numQubits - dragState.hoverQubit) }, 
                               (_, i) => dragState.hoverQubit + i);
            break;
        }
      }
      
      // Set default parameters for parametric gates
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
        position: dragState.hoverPosition,
        angle,
        params,
        qubits
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
    dragStartRef.current = null;
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
      // Add both mouse and touch event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      // Prevent scrolling on mobile during drag
      document.body.style.touchAction = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.touchAction = 'auto';
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
