
import { useCallback, useEffect, useMemo } from 'react';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface UseOptimizedDragDropProps {
  onGateAdd: (gate: Gate) => void;
  numQubits: number;
  gridSize: number;
  snapThreshold?: number;
}

export function useOptimizedDragDrop({ 
  onGateAdd, 
  numQubits, 
  gridSize, 
  snapThreshold = 20 
}: UseOptimizedDragDropProps) {
  const { dragState, startDrag, updateDrag, endDrag, canvasRef } = useDragDrop();

  // Memoized grid calculation for better performance
  const calculateGridPosition = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return { qubit: null, position: null };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const relativeY = clientY - rect.top;
    
    // Calculate grid position with snapping
    const gridX = Math.round((relativeX - 50) / gridSize); // 50px offset for labels
    const gridY = Math.round((relativeY - 30) / 60); // 60px qubit spacing, 30px offset
    
    // Validate bounds
    const qubit = gridY >= 0 && gridY < numQubits ? gridY : null;
    const position = gridX >= 0 ? gridX : null;
    
    return { qubit, position };
  }, [numQubits, gridSize]);

  // Optimized mouse/touch handlers
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, gateType: string) => {
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2
    };
    
    startDrag(gateType, { x: clientX, y: clientY }, offset);
  }, [startDrag]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const { qubit, position } = calculateGridPosition(clientX, clientY);
    updateDrag({ x: clientX, y: clientY }, qubit, position);
  }, [dragState.isDragging, calculateGridPosition, updateDrag]);

  const handleEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      // Create new gate based on type
      const newGate: Gate = {
        id: `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: dragState.gateType,
        qubit: dragState.hoverQubit,
        position: dragState.hoverPosition,
        ...(dragState.gateType.startsWith('R') && { angle: Math.PI / 4 }),
        ...(dragState.gateType === 'CNOT' && { 
          qubits: [dragState.hoverQubit, Math.min(dragState.hoverQubit + 1, numQubits - 1)] 
        })
      };
      
      onGateAdd(newGate);
    }
    
    endDrag();
  }, [dragState, onGateAdd, endDrag, numQubits]);

  // Event listeners with passive options for better performance
  useEffect(() => {
    if (!dragState.isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleMouseUp = () => handleEnd();
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e);
    };
    const handleTouchEnd = () => handleEnd();
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragState.isDragging, handleMove, handleEnd]);

  return {
    dragState,
    handleStart,
    canvasRef
  };
}
