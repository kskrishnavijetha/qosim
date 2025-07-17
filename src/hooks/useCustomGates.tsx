
import { useState, useCallback, useEffect } from 'react';
import { CustomGate } from '@/lib/customGates';

export function useCustomGates() {
  const [customGates, setCustomGates] = useState<CustomGate[]>([]);

  // Load custom gates from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quantum-custom-gates');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomGates(parsed);
      }
    } catch (error) {
      console.error('Failed to load custom gates:', error);
    }
  }, []);

  // Save to localStorage whenever gates change
  useEffect(() => {
    try {
      localStorage.setItem('quantum-custom-gates', JSON.stringify(customGates));
    } catch (error) {
      console.error('Failed to save custom gates:', error);
    }
  }, [customGates]);

  const addCustomGate = useCallback((gate: CustomGate) => {
    setCustomGates(prev => [...prev, gate]);
  }, []);

  const deleteCustomGate = useCallback((gateId: string) => {
    setCustomGates(prev => prev.filter(gate => gate.id !== gateId));
  }, []);

  const updateCustomGate = useCallback((gateId: string, updates: Partial<CustomGate>) => {
    setCustomGates(prev => 
      prev.map(gate => 
        gate.id === gateId ? { ...gate, ...updates } : gate
      )
    );
  }, []);

  const getCustomGate = useCallback((gateId: string) => {
    return customGates.find(gate => gate.id === gateId);
  }, [customGates]);

  const clearAllCustomGates = useCallback(() => {
    setCustomGates([]);
  }, []);

  return {
    customGates,
    addCustomGate,
    deleteCustomGate,
    updateCustomGate,
    getCustomGate,
    clearAllCustomGates
  };
}
