
import { useState, useEffect, useCallback } from 'react';
import { type QuantumGate, type QuantumSimulationResult } from '@/types/qosim';

export function useQuantumSimulation(circuit: QuantumGate[]) {
  const [simulationResult, setSimulationResult] = useState<QuantumSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState<QuantumSimulationResult[]>([]);

  const runSimulation = useCallback(async () => {
    if (circuit.length === 0) return;
    
    setIsSimulating(true);
    
    try {
      // Simulate quantum computation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const qubits = Math.max(...circuit.map(g => Math.max(...g.qubits)), 0) + 1;
      const result: QuantumSimulationResult = {
        id: `sim_${Date.now()}`,
        circuitId: 'current',
        timestamp: new Date(),
        qubits,
        gates: circuit.length,
        depth: Math.max(...circuit.map(g => g.position.x / 60), 0),
        stateVector: Array.from({ length: Math.pow(2, qubits) }, (_, i) => ({
          real: Math.random(),
          imaginary: Math.random()
        })),
        qubitStates: Array.from({ length: qubits }, (_, i) => ({
          id: i,
          amplitude0: { real: Math.random(), imaginary: 0 },
          amplitude1: { real: Math.random(), imaginary: 0 },
          probability0: Math.random(),
          probability1: Math.random(),
          phase: Math.random() * Math.PI,
          entangled: Math.random() > 0.5,
          entangledWith: []
        })),
        measurementProbabilities: {
          '000': 0.125,
          '001': 0.125,
          '010': 0.125,
          '011': 0.125,
          '100': 0.125,
          '101': 0.125,
          '110': 0.125,
          '111': 0.125
        },
        entanglementMatrix: Array.from({ length: qubits }, () => 
          Array.from({ length: qubits }, () => Math.random())
        ),
        fidelity: 0.95 + Math.random() * 0.05,
        executionTime: 1000 + Math.random() * 1000,
        memoryUsed: Math.random() * 1000,
        metadata: {
          backend: 'QOSim Simulator'
        }
      };
      
      setSimulationResult(result);
      setSimulationHistory(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setIsSimulating(false);
    }
  }, [circuit]);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  return {
    simulationResult,
    isSimulating,
    simulationHistory,
    runSimulation,
    stopSimulation
  };
}
