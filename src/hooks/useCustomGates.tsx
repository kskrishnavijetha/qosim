
import { useState, useCallback } from 'react';

interface ComplexNumber {
  real: number;
  imaginary: number;
}

interface CustomGate {
  id: string;
  name: string;
  matrix: ComplexNumber[][];
  qubits: number;
  description?: string;
  isValid: boolean;
}

export function useCustomGates() {
  const [customGates, setCustomGates] = useState<CustomGate[]>([]);

  const addCustomGate = useCallback((gate: CustomGate) => {
    setCustomGates(prev => [...prev, gate]);
  }, []);

  const removeCustomGate = useCallback((gateId: string) => {
    setCustomGates(prev => prev.filter(g => g.id !== gateId));
  }, []);

  const getCustomGate = useCallback((gateId: string) => {
    return customGates.find(g => g.id === gateId);
  }, [customGates]);

  const isCustomGate = useCallback((gateType: string) => {
    return gateType.startsWith('custom_');
  }, []);

  return {
    customGates,
    addCustomGate,
    removeCustomGate,
    getCustomGate,
    isCustomGate
  };
}
