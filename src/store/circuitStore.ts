
import { create } from 'zustand';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface CircuitState {
  gates: Gate[];
  numQubits: number;
  selectedGate: Gate | null;
  history: Gate[][];
  historyIndex: number;
  
  // Actions
  addGate: (gate: Gate) => void;
  removeGate: (gateId: string) => void;
  updateGate: (gateId: string, updates: Partial<Gate>) => void;
  updateGates: (gates: Gate[]) => void;
  selectGate: (gate: Gate | null) => void;
  setNumQubits: (num: number) => void;
  clearCircuit: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Clipboard
  copyGate: (gate: Gate) => void;
  pasteGate: () => void;
  clipboardGate: Gate | null;
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  gates: [],
  numQubits: 5,
  selectedGate: null,
  history: [[]],
  historyIndex: 0,
  clipboardGate: null,
  
  addGate: (gate) => set((state) => {
    const newGates = [...state.gates, gate];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...newGates]);
    
    return {
      gates: newGates,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  removeGate: (gateId) => set((state) => {
    const newGates = state.gates.filter(g => g.id !== gateId);
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...newGates]);
    
    return {
      gates: newGates,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedGate: state.selectedGate?.id === gateId ? null : state.selectedGate
    };
  }),
  
  updateGate: (gateId, updates) => set((state) => {
    const newGates = state.gates.map(g => 
      g.id === gateId ? { ...g, ...updates } : g
    );
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...newGates]);
    
    return {
      gates: newGates,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  updateGates: (gates) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([...gates]);
    
    return {
      gates: [...gates],
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),
  
  selectGate: (gate) => set({ selectedGate: gate }),
  
  setNumQubits: (num) => set({ numQubits: num }),
  
  clearCircuit: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push([]);
    
    return {
      gates: [],
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedGate: null
    };
  }),
  
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        gates: [...state.history[newIndex]],
        historyIndex: newIndex,
        selectedGate: null
      };
    }
    return state;
  }),
  
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        gates: [...state.history[newIndex]],
        historyIndex: newIndex,
        selectedGate: null
      };
    }
    return state;
  }),
  
  get canUndo() {
    return get().historyIndex > 0;
  },
  
  get canRedo() {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
  
  copyGate: (gate) => set({ clipboardGate: { ...gate } }),
  
  pasteGate: () => {
    const state = get();
    if (state.clipboardGate) {
      const newGate = {
        ...state.clipboardGate,
        id: `${state.clipboardGate.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      state.addGate(newGate);
    }
  }
}));
