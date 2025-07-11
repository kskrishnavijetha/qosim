import { useState, useCallback } from 'react';
import { quantumSimulator, type QuantumGate, type SimulationResult } from '@/lib/quantumSimulator';
import { quantumSimulationManager, type EnhancedSimulationResult, type SimulationMode, type CloudSimulationConfig } from '@/lib/quantumSimulationService';

export interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

export function useCircuitState() {
  const [circuit, setCircuit] = useState<Gate[]>([]);
  const [history, setHistory] = useState<Gate[][]>([[]]);
  const [simulationResult, setSimulationResult] = useState<EnhancedSimulationResult | null>(null);
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('fast');
  const [cloudConfig, setCloudConfig] = useState<CloudSimulationConfig>({});

  const simulateQuantumState = useCallback(async (gates: Gate[]) => {
    console.log('simulateQuantumState called with gates:', gates);
    
    try {
      // Convert our Gate interface to QuantumGate interface
      const quantumGates: QuantumGate[] = gates.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        position: gate.position,
        angle: gate.angle
      }));
      
      console.log('Converted quantum gates:', quantumGates);
      
      // Run the enhanced quantum simulation
      console.log('Calling quantumSimulationManager.simulate...');
      const result = await quantumSimulationManager.simulate(quantumGates, 5);
      console.log('Simulation result received:', result);
      setSimulationResult(result);
    } catch (error) {
      console.error('Error in simulateQuantumState:', error);
    }
  }, []);

  const handleModeChange = useCallback((mode: SimulationMode) => {
    setSimulationMode(mode);
    quantumSimulationManager.setMode(mode);
    // Re-simulate with new mode if circuit exists
    if (circuit.length > 0) {
      simulateQuantumState(circuit);
    }
  }, [circuit, simulateQuantumState]);

  const handleCloudConfigChange = useCallback((config: CloudSimulationConfig) => {
    setCloudConfig(config);
    quantumSimulationManager.setCloudConfig(config);
  }, []);

  const addGate = useCallback((newGate: Gate) => {
    const newCircuit = [...circuit, newGate];
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    
    // Generate standardized circuit data structure and simulate
    const circuitData = generateCircuitData(newCircuit);
    console.log('Generated circuit data:', circuitData);
    simulateQuantumState(newCircuit);
  }, [circuit, simulateQuantumState]);

  const deleteGate = useCallback((gateId: string) => {
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    simulateQuantumState(newCircuit);
  }, [circuit, simulateQuantumState]);

  const undo = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousCircuit = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCircuit(previousCircuit);
      simulateQuantumState(previousCircuit);
    }
  }, [history, simulateQuantumState]);

  const clearCircuit = useCallback(() => {
    setCircuit([]);
    setHistory([[]]);
    setSimulationResult(null);
  }, []);

  const generateCircuitData = (gates: Gate[]) => {
    return gates
      .sort((a, b) => a.position - b.position) // Sort by time step
      .map(gate => ({
        gate: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        time: gate.position,
        angle: gate.angle
      }));
  };

  const canUndo = history.length > 1;

  return {
    circuit,
    history,
    simulationResult,
    simulationMode,
    cloudConfig,
    addGate,
    deleteGate,
    undo,
    clearCircuit,
    simulateQuantumState,
    generateCircuitData,
    handleModeChange,
    handleCloudConfigChange,
    isCloudConfigured: quantumSimulationManager.isCloudConfigured(),
    canUndo
  };
}