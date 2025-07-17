
import { useState, useCallback, useMemo } from 'react';
import { Gate } from './useCircuitState';
import { toast } from '@/hooks/use-toast';

const ENTANGLING_GATES = ['CNOT', 'CZ', 'BELL', 'GHZ', 'TOFFOLI', 'SWAP', 'ISWAP', 'FREDKIN'];

export function useEntanglementTracking() {
  const [selectedGates, setSelectedGates] = useState<string[]>([]);

  const hasEntanglingGates = useCallback((circuit: Gate[]) => {
    return circuit.some(gate => ENTANGLING_GATES.includes(gate.type));
  }, []);

  const getEntanglingGatesInCircuit = useCallback((circuit: Gate[]) => {
    return circuit.filter(gate => ENTANGLING_GATES.includes(gate.type));
  }, []);

  const validateEntanglementAnalysis = useCallback((circuit: Gate[]) => {
    const hasGates = hasEntanglingGates(circuit);
    
    if (!hasGates) {
      toast({
        title: "⚠️ Entanglement Analysis Required",
        description: "Please add at least one entangling gate (CNOT, CZ, BELL, GHZ, TOFFOLI) to begin analysis.",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "🧪 Quantum Entanglement Analysis",
      description: "Analysis in progress...",
      variant: "default"
    });
    return true;
  }, [hasEntanglingGates]);

  const toggleGateSelection = useCallback((gateType: string) => {
    setSelectedGates(prev => {
      if (prev.includes(gateType)) {
        return prev.filter(g => g !== gateType);
      } else {
        return [...prev, gateType];
      }
    });
  }, []);

  const mockEntanglementValue = useMemo(() => {
    // Generate consistent mock value based on selected gates
    if (selectedGates.length === 0) return 0;
    const seed = selectedGates.join('').length;
    return 0.1 + (Math.sin(seed) * 0.4 + 0.5) * 0.85; // 10% - 95%
  }, [selectedGates]);

  return {
    selectedGates,
    hasEntanglingGates,
    getEntanglingGatesInCircuit,
    validateEntanglementAnalysis,
    toggleGateSelection,
    mockEntanglementValue,
    entanglingGateTypes: ENTANGLING_GATES
  };
}
