
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  offset: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface DragDropContextType {
  dragState: DragState;
  startDrag: (gateType: string, position: { x: number; y: number }, offset: { x: number; y: number }) => void;
  updateDrag: (position: { x: number; y: number }, hoverQubit: number | null, hoverPosition: number | null) => void;
  endDrag: () => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null
  });

  const startDrag = useCallback((gateType: string, position: { x: number; y: number }, offset: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: position,
      offset,
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const updateDrag = useCallback((position: { x: number; y: number }, hoverQubit: number | null, hoverPosition: number | null) => {
    setDragState(prev => ({
      ...prev,
      dragPosition: position,
      hoverQubit,
      hoverPosition
    }));
  }, []);

  const endDrag = useCallback(() => {
    setDragState({
      isDragging: false,
      gateType: '',
      dragPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  return (
    <DragDropContext.Provider value={{
      dragState,
      startDrag,
      updateDrag,
      endDrag,
      canvasRef
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
