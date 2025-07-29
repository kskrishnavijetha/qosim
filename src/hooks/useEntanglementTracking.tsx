
export function useEntanglementTracking() {
  return {
    entanglement: { pairs: [], strength: 0 },
    trackEntanglement: () => {},
    resetTracking: () => {},
    selectedGates: [],
    hasEntanglingGates: false,
    entanglingGatesInCircuit: []
  };
}
