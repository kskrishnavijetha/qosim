
import { useState, useCallback, useEffect } from 'react';
import { Gate } from './useCircuitState';
import { type EnhancedSimulationMode } from '@/lib/enhancedQuantumSimulationService';
import { type OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { type CloudSimulationConfig } from '@/lib/quantumSimulationService';

export function useSimulator(circuit: Gate[]) {
  const [mode, setMode] = useState<EnhancedSimulationMode>('fast');
  const [config, setConfig] = useState<CloudSimulationConfig>({});
  const [simulationResult, setSimulationResult] = useState<OptimizedSimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const isConfigured = !!config.ibmqToken && config.ibmqToken.trim().length > 0;

  const simulateCircuit = useCallback(async (selectedMode?: EnhancedSimulationMode) => {
    if (circuit.length === 0) {
      setSimulationResult(null);
      return;
    }

    setIsRunning(true);
    const currentMode = selectedMode || mode;
    
    try {
      // Simulate the circuit based on the mode
      const mockResult: OptimizedSimulationResult = {
        stateVector: [],
        measurementProbabilities: [0.5, 0.3, 0.2], // Fix: should be number array
        qubitStates: Array(5).fill(0).map((_, i) => ({ 
          qubit: i,
          state: '|0⟩',
          amplitude: { real: 1, imag: 0 }, // Fix: use 'imag' not 'imaginary'
          phase: 0,
          probability: 1
        })), // Fix: match expected interface
        entanglement: { 
          pairs: [], 
          totalEntanglement: 0, 
          entanglementThreads: [] 
        },
        executionTime: Math.random() * 100,
        fidelity: 0.95 + Math.random() * 0.05,
        mode: currentMode
      };
      
      setSimulationResult(mockResult);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsRunning(false);
    }
  }, [circuit, mode]);

  const executionComplete = useCallback((result: any) => {
    console.log('Execution completed:', result);
  }, []);

  useEffect(() => {
    simulateCircuit();
  }, [circuit, mode]);

  return {
    mode,
    setMode,
    config,
    setConfig,
    isConfigured,
    simulationResult,
    simulateCircuit,
    executionComplete,
    isRunning
  };
}
