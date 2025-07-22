
import { useState, useCallback, useMemo } from 'react';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { toast } from '@/hooks/use-toast';

const ENTANGLING_GATES = ['CNOT', 'CZ', 'BELL', 'GHZ', 'TOFFOLI'];

export function useEntanglementTracking(circuit: Gate[]) {
  const [selectedGates, setSelectedGates] = useState<string[]>([]);

  // Check if circuit has entangling gates
  const hasEntanglingGates = useMemo(() => {
    return circuit.some(gate => ENTANGLING_GATES.includes(gate.type));
  }, [circuit]);

  // Get entangling gates from circuit
  const entanglingGatesInCircuit = useMemo(() => {
    return circuit.filter(gate => ENTANGLING_GATES.includes(gate.type));
  }, [circuit]);

  const toggleGate = useCallback((gateType: string) => {
    setSelectedGates(prev => {
      if (prev.includes(gateType)) {
        return prev.filter(g => g !== gateType);
      } else {
        return [...prev, gateType];
      }
    });
  }, []);

  const validateEntanglementAnalysis = useCallback(() => {
    if (!hasEntanglingGates) {
      toast({
        title: "⚠️ No Entangling Gates",
        description: "Please add at least one entangling gate (CNOT, CZ, BELL, GHZ, TOFFOLI) to begin analysis.",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "🧪 Quantum Entanglement Analysis",
      description: "Analysis in progress...",
    });
    return true;
  }, [hasEntanglingGates]);

  // Mock entanglement calculation for demo
  const calculateMockEntanglement = useCallback(() => {
    if (!hasEntanglingGates) return 0;
    // Simulate entanglement based on gate types and count
    const baseEntanglement = Math.random() * 0.85 + 0.1; // 10% to 95%
    const gateBonus = entanglingGatesInCircuit.length * 0.05;
    return Math.min(baseEntanglement + gateBonus, 0.95);
  }, [hasEntanglingGates, entanglingGatesInCircuit.length]);

  return {
    selectedGates,
    hasEntanglingGates,
    entanglingGatesInCircuit,
    toggleGate,
    validateEntanglementAnalysis,
    calculateMockEntanglement,
    ENTANGLING_GATES
  };
}
