
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  controlQubit?: number;
  params?: number[];
}

export interface CircuitState {
  gates: Gate[];
  selectedGate: Gate | null;
  clipboard: Gate | null;
  history: Gate[][];
  historyIndex: number;
  gridSize: number;
  numQubits: number;
  numTimeSteps: number;
}

export interface CircuitActions {
  addGate: (gate: Omit<Gate, 'id'>) => void;
  removeGate: (gateId: string) => void;
  moveGate: (gateId: string, qubit: number, timeStep: number) => void;
  selectGate: (gate: Gate | null) => void;
  copyGate: (gate: Gate) => void;
  pasteGate: (qubit: number, timeStep: number) => void;
  undo: () => void;
  redo: () => void;
  clearCircuit: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setGridSize: (size: number) => void;
  setNumQubits: (num: number) => void;
  setNumTimeSteps: (num: number) => void;
}

type CircuitStore = CircuitState & CircuitActions;

const initialState: CircuitState = {
  gates: [],
  selectedGate: null,
  clipboard: null,
  history: [[]],
  historyIndex: 0,
  gridSize: 60,
  numQubits: 5,
  numTimeSteps: 10,
};

const addToHistory = (state: CircuitState, gates: Gate[]) => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push([...gates]);
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useCircuitStore = create<CircuitStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      addGate: (gateData) => {
        const id = `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newGate: Gate = { ...gateData, id };
        
        set((state) => {
          const newGates = [...state.gates, newGate];
          return {
            gates: newGates,
            ...addToHistory(state, newGates),
          };
        });
      },

      removeGate: (gateId) => {
        set((state) => {
          const newGates = state.gates.filter(gate => gate.id !== gateId);
          return {
            gates: newGates,
            selectedGate: state.selectedGate?.id === gateId ? null : state.selectedGate,
            ...addToHistory(state, newGates),
          };
        });
      },

      moveGate: (gateId, qubit, timeStep) => {
        set((state) => {
          const newGates = state.gates.map(gate => 
            gate.id === gateId ? { ...gate, qubit, position: timeStep } : gate
          );
          return {
            gates: newGates,
            ...addToHistory(state, newGates),
          };
        });
      },

      selectGate: (gate) => {
        set({ selectedGate: gate });
      },

      copyGate: (gate) => {
        set({ clipboard: gate });
      },

      pasteGate: (qubit, timeStep) => {
        const state = get();
        if (state.clipboard) {
          const newGate = {
            ...state.clipboard,
            qubit,
            position: timeStep,
          };
          state.addGate(newGate);
        }
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            return {
              gates: [...state.history[newIndex]],
              historyIndex: newIndex,
              selectedGate: null,
            };
          }
          return state;
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            return {
              gates: [...state.history[newIndex]],
              historyIndex: newIndex,
              selectedGate: null,
            };
          }
          return state;
        });
      },

      clearCircuit: () => {
        set((state) => ({
          gates: [],
          selectedGate: null,
          ...addToHistory(state, []),
        }));
      },

      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },

      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },

      setGridSize: (size) => {
        set({ gridSize: size });
      },

      setNumQubits: (num) => {
        set({ numQubits: num });
      },

      setNumTimeSteps: (num) => {
        set({ numTimeSteps: num });
      },
    }),
    { name: 'circuit-store' }
  )
);
