
import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface UseOptimizedDragDropProps {
  onGateAdd: (gate: Gate) => void;
  numQubits: number;
  gridSize: number;
  canvasRef: React.RefObject<HTMLElement>;
}

export function useOptimizedDragDrop({ 
  onGateAdd, 
  numQubits, 
  gridSize, 
  canvasRef 
}: UseOptimizedDragDropProps) {
  const { state, startDrag, updateDrag, endDrag, setPreviewGate } = useDragDrop();
  const rafRef = useRef<number>();
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Throttled mouse move handler for performance
  const throttledMouseMove = useCallback((clientX: number, clientY: number) => {
    // Cancel previous RAF if still pending
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const relativeY = clientY - rect.top;
      
      // Calculate grid position with snapping
      const snapTolerance = gridSize * 0.4;
      const rawQubit = (relativeY - 40) / 60; // 60px qubit spacing, 40px offset
      const rawPosition = (relativeX - 100) / gridSize; // 100px offset
      
      // Snap to grid
      const qubit = Math.round(rawQubit);
      const position = Math.round(rawPosition);
      
      // Check if within valid bounds and snap tolerance
      const isValidQubit = qubit >= 0 && qubit < numQubits && 
                          Math.abs(rawQubit - qubit) < snapTolerance / 60;
      const isValidPosition = position >= 0 && 
                             Math.abs(rawPosition - position) < snapTolerance / gridSize;
      
      // Create preview gate for visual feedback
      if (isValidQubit && isValidPosition && state.dragState.gateType) {
        const previewGate: Gate = {
          id: `preview_${Date.now()}`,
          type: state.dragState.gateType,
          qubit,
          position,
          // Set default parameters for parametric gates
          ...(state.dragState.gateType.startsWith('R') && { angle: Math.PI / 4 }),
          ...(state.dragState.gateType === 'CNOT' && { 
            qubits: [qubit, Math.min(qubit + 1, numQubits - 1)] 
          })
        };
        setPreviewGate(previewGate);
      } else {
        setPreviewGate(null);
      }
      
      updateDrag(
        { x: clientX, y: clientY },
        isValidQubit ? qubit : null,
        isValidPosition ? position : null
      );
    });
  }, [canvasRef, gridSize, numQubits, state.dragState.gateType, updateDrag, setPreviewGate]);

  // Optimized mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    startDrag(gateType, { x: e.clientX, y: e.clientY });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [startDrag]);

  const handleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    if (touch) {
      startDrag(gateType, { x: touch.clientX, y: touch.clientY });
      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    }
  }, [startDrag]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!state.dragState.isDragging) return;
    
    // Only update if mouse moved significantly (reduces unnecessary updates)
    const deltaX = Math.abs(e.clientX - lastMousePos.current.x);
    const deltaY = Math.abs(e.clientY - lastMousePos.current.y);
    
    if (deltaX > 2 || deltaY > 2) {
      throttledMouseMove(e.clientX, e.clientY);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [state.dragState.isDragging, throttledMouseMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!state.dragState.isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      const deltaX = Math.abs(touch.clientX - lastMousePos.current.x);
      const deltaY = Math.abs(touch.clientY - lastMousePos.current.y);
      
      if (deltaX > 2 || deltaY > 2) {
        throttledMouseMove(touch.clientX, touch.clientY);
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  }, [state.dragState.isDragging, throttledMouseMove]);

  const handleMouseUp = useCallback(() => {
    if (!state.dragState.isDragging) return;
    
    // Add gate if valid position
    if (state.dragState.hoverQubit !== null && 
        state.dragState.hoverPosition !== null && 
        state.dragState.previewGate) {
      
      const newGate: Gate = {
        ...state.dragState.previewGate,
        id: `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      onGateAdd(newGate);
    }
    
    setPreviewGate(null);
    endDrag();
  }, [state.dragState, onGateAdd, setPreviewGate, endDrag]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleMouseUp();
  }, [handleMouseUp]);

  // Event listeners with cleanup
  useEffect(() => {
    if (state.dragState.isDragging) {
      const options = { passive: false };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, options);
      document.addEventListener('touchend', handleTouchEnd, options);
      
      // Prevent text selection and context menu during drag
      document.body.style.userSelect = 'none';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        
        document.body.style.userSelect = '';
        document.body.style.touchAction = '';
        
        // Cancel any pending RAF
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [state.dragState.isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    dragState: state.dragState,
    handleMouseDown,
    handleTouchStart,
    isValidDropZone: state.dragState.hoverQubit !== null && state.dragState.hoverPosition !== null
  };
}
