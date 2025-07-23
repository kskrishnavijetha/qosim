
import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { Gate, Circuit } from '@/hooks/useCircuitWorkspace';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
  previewGate: Gate | null;
}

interface DragDropState {
  dragState: DragState;
  virtualizedRange: { start: number; end: number };
  viewportOffset: number;
  selectedGates: Set<string>;
  clipboard: Gate[];
}

type DragDropAction = 
  | { type: 'START_DRAG'; payload: { gateType: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_DRAG'; payload: { position: { x: number; y: number }; hoverQubit?: number; hoverPosition?: number } }
  | { type: 'END_DRAG' }
  | { type: 'SET_VIRTUALIZED_RANGE'; payload: { start: number; end: number } }
  | { type: 'SET_VIEWPORT_OFFSET'; payload: number }
  | { type: 'SELECT_GATE'; payload: string }
  | { type: 'DESELECT_GATE'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'COPY_GATES'; payload: Gate[] }
  | { type: 'SET_PREVIEW_GATE'; payload: Gate | null };

const initialState: DragDropState = {
  dragState: {
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null,
    previewGate: null
  },
  virtualizedRange: { start: 0, end: 20 },
  viewportOffset: 0,
  selectedGates: new Set(),
  clipboard: []
};

function dragDropReducer(state: DragDropState, action: DragDropAction): DragDropState {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        dragState: {
          ...state.dragState,
          isDragging: true,
          gateType: action.payload.gateType,
          dragPosition: action.payload.position
        }
      };
    
    case 'UPDATE_DRAG':
      return {
        ...state,
        dragState: {
          ...state.dragState,
          dragPosition: action.payload.position,
          hoverQubit: action.payload.hoverQubit ?? state.dragState.hoverQubit,
          hoverPosition: action.payload.hoverPosition ?? state.dragState.hoverPosition
        }
      };
    
    case 'END_DRAG':
      return {
        ...state,
        dragState: {
          ...initialState.dragState
        }
      };
    
    case 'SET_VIRTUALIZED_RANGE':
      return {
        ...state,
        virtualizedRange: action.payload
      };
    
    case 'SET_VIEWPORT_OFFSET':
      return {
        ...state,
        viewportOffset: action.payload
      };
    
    case 'SELECT_GATE':
      return {
        ...state,
        selectedGates: new Set([...state.selectedGates, action.payload])
      };
    
    case 'DESELECT_GATE':
      const newSelection = new Set(state.selectedGates);
      newSelection.delete(action.payload);
      return {
        ...state,
        selectedGates: newSelection
      };
    
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedGates: new Set()
      };
    
    case 'COPY_GATES':
      return {
        ...state,
        clipboard: action.payload
      };
    
    case 'SET_PREVIEW_GATE':
      return {
        ...state,
        dragState: {
          ...state.dragState,
          previewGate: action.payload
        }
      };
    
    default:
      return state;
  }
}

interface DragDropContextValue {
  state: DragDropState;
  startDrag: (gateType: string, position: { x: number; y: number }) => void;
  updateDrag: (position: { x: number; y: number }, hoverQubit?: number, hoverPosition?: number) => void;
  endDrag: () => void;
  setVirtualizedRange: (start: number, end: number) => void;
  setViewportOffset: (offset: number) => void;
  selectGate: (gateId: string) => void;
  deselectGate: (gateId: string) => void;
  clearSelection: () => void;
  copyGates: (gates: Gate[]) => void;
  setPreviewGate: (gate: Gate | null) => void;
}

const DragDropContext = createContext<DragDropContextValue | undefined>(undefined);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(dragDropReducer, initialState);

  const contextValue = useMemo(() => ({
    state,
    startDrag: (gateType: string, position: { x: number; y: number }) => {
      dispatch({ type: 'START_DRAG', payload: { gateType, position } });
    },
    updateDrag: (position: { x: number; y: number }, hoverQubit?: number, hoverPosition?: number) => {
      dispatch({ type: 'UPDATE_DRAG', payload: { position, hoverQubit, hoverPosition } });
    },
    endDrag: () => {
      dispatch({ type: 'END_DRAG' });
    },
    setVirtualizedRange: (start: number, end: number) => {
      dispatch({ type: 'SET_VIRTUALIZED_RANGE', payload: { start, end } });
    },
    setViewportOffset: (offset: number) => {
      dispatch({ type: 'SET_VIEWPORT_OFFSET', payload: offset });
    },
    selectGate: (gateId: string) => {
      dispatch({ type: 'SELECT_GATE', payload: gateId });
    },
    deselectGate: (gateId: string) => {
      dispatch({ type: 'DESELECT_GATE', payload: gateId });
    },
    clearSelection: () => {
      dispatch({ type: 'CLEAR_SELECTION' });
    },
    copyGates: (gates: Gate[]) => {
      dispatch({ type: 'COPY_GATES', payload: gates });
    },
    setPreviewGate: (gate: Gate | null) => {
      dispatch({ type: 'SET_PREVIEW_GATE', payload: gate });
    }
  }), [state]);

  return (
    <DragDropContext.Provider value={contextValue}>
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
