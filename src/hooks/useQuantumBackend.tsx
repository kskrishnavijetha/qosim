
import { useState, useCallback } from 'react';
import { quantumBackendService, QuantumBackendResult, QuantumCircuit } from '@/services/quantumBackendService';
import { Gate } from './useCircuitState';

export function useQuantumBackend() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<QuantumBackendResult | null>(null);
  const [executionHistory, setExecutionHistory] = useState<QuantumBackendResult[]>([]);

  const executeCircuit = useCallback(async (
    circuit: Gate[],
    backend: 'qiskit' | 'qutip' | 'braket' | 'local' = 'local',
    shots: number = 1024
  ) => {
    if (isExecuting) return null;
    
    setIsExecuting(true);
    console.log('🚀 Executing quantum circuit with backend:', backend);
    
    try {
      // Convert circuit gates to backend format
      const quantumCircuit: QuantumCircuit = {
        gates: circuit.map(gate => ({
          type: gate.type,
          qubit: gate.qubit || 0,
          controlQubit: gate.qubits?.[0],
          angle: gate.angle,
          parameters: gate.params ? { params: gate.params } : undefined
        })),
        qubits: Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))),
        shots
      };

      const result = await quantumBackendService.executeCircuit(quantumCircuit, backend, shots);
      
      setLastResult(result);
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      console.log('✅ Quantum circuit execution completed:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Quantum circuit execution failed:', error);
      const errorResult: QuantumBackendResult = {
        stateVector: [],
        measurementProbabilities: {},
        qubitStates: [],
        blochSphereData: [],
        executionTime: 0,
        backend,
        error: error instanceof Error ? error.message : 'Unknown execution error'
      };
      
      setLastResult(errorResult);
      return errorResult;
      
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting]);

  const executeOnQiskit = useCallback((circuit: Gate[], shots: number = 1024) => {
    return executeCircuit(circuit, 'qiskit', shots);
  }, [executeCircuit]);

  const executeOnBraket = useCallback((circuit: Gate[], shots: number = 1024) => {
    return executeCircuit(circuit, 'braket', shots);
  }, [executeCircuit]);

  const executeOnQuTiP = useCallback((circuit: Gate[]) => {
    return executeCircuit(circuit, 'qutip', 1);
  }, [executeCircuit]);

  const clearHistory = useCallback(() => {
    setExecutionHistory([]);
    setLastResult(null);
  }, []);

  return {
    isExecuting,
    lastResult,
    executionHistory,
    executeCircuit,
    executeOnQiskit,
    executeOnBraket,
    executeOnQuTiP,
    clearHistory
  };
}
