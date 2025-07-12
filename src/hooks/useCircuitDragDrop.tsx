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
            // For QFT, apply to all qubits starting from hover position
            qubits = Array.from({ length: Math.min(3, numQubits - dragState.hoverQubit) }, 
                               (_, i) => dragState.hoverQubit + i);
            break;
        }
      }
      
      // Set default parameters for parametric gates
      let angle: number | undefined;
      let params: number[] | undefined;
      
      if (gateType.startsWith('R') || gateType === 'U1') {
        angle = Math.PI / 4; // Default angle
      } else if (gateType === 'U2') {
        params = [0, Math.PI / 2]; // Default φ, λ for U2
      } else if (gateType === 'U3') {
        params = [Math.PI / 2, 0, Math.PI / 2]; // Default θ, φ, λ for U3
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