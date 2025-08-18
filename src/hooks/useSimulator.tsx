
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
        measurementProbabilities: circuit.map((_, i) => ({ 
          state: `|${i.toString(2).padStart(3, '0')}>`, 
          probability: Math.random() 
        })),
        qubitStates: Array(5).fill(0).map(() => ({ x: 0, y: 0, z: 1 })),
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
