
export function useQuantumBackend() {
  return {
    backend: null,
    setBackend: () => {},
    simulate: () => Promise.resolve({}),
    isExecuting: false,
    lastResult: null,
    executeCircuit: (circuit: any, backend: string, shots: number) => Promise.resolve({}),
    executeOnQiskit: (circuit: any, shots: number) => Promise.resolve({}),
    executeOnBraket: (circuit: any, shots: number) => Promise.resolve({}),
    executeOnQuTiP: (circuit: any) => Promise.resolve({})
  };
}
