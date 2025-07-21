
import { useState, useCallback, useRef, useEffect } from 'react';

interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  angle?: number;
  controlQubit?: number;
}

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface UseDragDropCircuitProps {
  circuit: Gate[];
  numQubits: number;
  onCircuitChange: (gates: Gate[]) => void;
}

const GRID_SIZE = 60;
const QUBIT_SPACING = 80;

export function useDragDropCircuit({ circuit, numQubits, onCircuitChange }: UseDragDropCircuitProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null
  });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleGateMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const handleGateTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
      
      setDragState({
        isDragging: true,
        gateType,
        dragPosition: { x: touch.clientX, y: touch.clientY },
        hoverQubit: null,
        hoverPosition: null
      });
    }
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragState.isDragging) return;
    
    // Update drag position
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: clientX, y: clientY }
    }));

    // Calculate hover position (this would need to be relative to the circuit canvas)
    // For now, we'll use a simplified calculation
    const qubit = Math.floor((clientY - 100) / QUBIT_SPACING);
    const position = Math.floor((clientX - 100) / GRID_SIZE);
    
    setDragState(prev => ({
      ...prev,
      hoverQubit: qubit >= 0 && qubit < numQubits ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging, numQubits]);

  const handleEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const newGate: Gate = {
        id: `gate_${Date.now()}`,
        type: dragState.gateType,
        qubit: dragState.hoverQubit,
        position: dragState.hoverPosition,
        ...(dragState.gateType.startsWith('R') && { angle: Math.PI / 4 }),
        ...(dragState.gateType === 'CNOT' && { 
          controlQubit: Math.min(dragState.hoverQubit + 1, numQubits - 1) 
        })
      };
      
      onCircuitChange([...circuit, newGate]);
    }
    
    setDragState({
      isDragging: false,
      gateType: '',
      dragPosition: { x: 0, y: 0 },
      hoverQubit: null,
      hoverPosition: null
    });
    dragStartRef.current = null;
  }, [dragState, circuit, numQubits, onCircuitChange]);

  // Mouse event handlers
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handleEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragState.isDragging, handleMove, handleEnd]);

  const addGate = useCallback((gate: Gate) => {
    onCircuitChange([...circuit, gate]);
  }, [circuit, onCircuitChange]);

  const removeGate = useCallback((gateId: string) => {
    onCircuitChange(circuit.filter(gate => gate.id !== gateId));
  }, [circuit, onCircuitChange]);

  const updateGate = useCallback((gateId: string, updates: Partial<Gate>) => {
    onCircuitChange(circuit.map(gate => 
      gate.id === gateId ? { ...gate, ...updates } : gate
    ));
  }, [circuit, onCircuitChange]);

  return {
    dragState,
    handleGateMouseDown,
    handleGateTouchStart,
    addGate,
    removeGate,
    updateGate
  };
}
