import { useState, useCallback } from 'react';
import { quantumBackendService, QuantumBackendResult, QuantumCircuit } from '@/services/quantumBackendService';
import { Gate } from '@/hooks/useCircuitWorkspace';

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
    console.log('🚀 Executing quantum circuit with backend:', backend, 'shots:', shots);
    console.log('🚀 Circuit gates:', circuit.map(g => `${g.type}(${g.qubit})`).join(', '));
    
    try {
      // Convert circuit gates to backend format with proper qubit indexing
      const maxQubit = Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || []))));
      
      const quantumCircuit: QuantumCircuit = {
        gates: circuit.map(gate => {
          const backendGate: any = {
            type: gate.type,
            qubit: gate.qubit || 0,
            angle: gate.angle
          };
          
          // Handle multi-qubit gates
          if (gate.type === 'CNOT' && gate.qubits && gate.qubits.length >= 2) {
            backendGate.controlQubit = gate.qubits[0];
            backendGate.qubit = gate.qubits[1];
          }
          
          if (gate.params) {
            backendGate.parameters = { params: gate.params };
          }
          
          return backendGate;
        }),
        qubits: Math.max(5, maxQubit + 1),
        shots
      };

      console.log('🚀 Quantum circuit prepared:', quantumCircuit);

      const result = await quantumBackendService.executeCircuit(quantumCircuit, backend, shots);
      
      console.log('✅ Backend execution completed:', {
        backend: result.backend,
        executionTime: result.executionTime,
        stateVectorLength: result.stateVector.length,
        measurementStates: Object.keys(result.measurementProbabilities).length,
        hasEntanglement: !!result.entanglement,
        entanglementPairs: result.entanglement?.pairs.length || 0,
        totalEntanglement: result.entanglement?.totalEntanglement || 0
      });
      
      setLastResult(result);
      setExecutionHistory(prev => [result, ...prev.slice(0, 9)]);
      
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
