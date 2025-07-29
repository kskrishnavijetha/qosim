
export function useCircuits() {
  return {
    circuits: [],
    loadCircuits: () => Promise.resolve([]),
    saveCircuit: (circuit: any) => Promise.resolve(),
    deleteCircuit: (id: string) => Promise.resolve(),
    getCircuit: (id: string) => null
  };
}
