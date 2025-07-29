
export function useCircuits() {
  return {
    circuits: [],
    currentCircuit: null,
    saveCircuit: (name: string, description: string) => Promise.resolve("saved-id"),
    loadCircuit: () => {},
    deleteCircuit: () => {},
    createCircuit: () => {}
  };
}
