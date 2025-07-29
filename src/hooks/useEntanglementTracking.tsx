
import { Gate } from '@/hooks/useCircuitState';

export function useEntanglementTracking(circuit: Gate[] = []) {
  const ENTANGLING_GATES = ['CNOT', 'CZ', 'CY', 'SWAP', 'TOFFOLI'];

  return {
    entanglement: { pairs: [], strength: 0 },
    trackEntanglement: () => {},
    resetTracking: () => {},
    selectedGates: [],
    hasEntanglingGates: circuit.some(gate => ENTANGLING_GATES.includes(gate.type)),
    entanglingGatesInCircuit: circuit.filter(gate => ENTANGLING_GATES.includes(gate.type)),
    toggleGate: (gateType: string) => {},
    validateEntanglementAnalysis: () => true,
    calculateMockEntanglement: () => 0.5,
    ENTANGLING_GATES
  };
}
