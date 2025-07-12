import { useState, useCallback, useEffect } from 'react';
import { quantumSimulator, type QuantumGate, type SimulationResult } from '@/lib/quantumSimulator';
import { enhancedQuantumSimulationManager, type EnhancedSimulationMode } from '@/lib/enhancedQuantumSimulationService';
import { type OptimizedSimulationResult, type SimulationStepData } from '@/lib/quantumSimulatorOptimized';
import { type CloudSimulationConfig, quantumSimulationManager } from '@/lib/quantumSimulationService';
import { trackEvent, gateUsageTracker, CircuitSessionTracker } from '@/lib/analytics';

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
  const [simulationResult, setSimulationResult] = useState<OptimizedSimulationResult | null>(null);
  const [simulationMode, setSimulationMode] = useState<EnhancedSimulationMode>('fast');
  const [sessionTracker] = useState(() => new CircuitSessionTracker(`circuit-${Date.now()}`));
  const [cloudConfig, setCloudConfig] = useState<CloudSimulationConfig>(() => {
    try {
      const saved = localStorage.getItem('quantum-cloud-config');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist cloud config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quantum-cloud-config', JSON.stringify(cloudConfig));
    } catch (error) {
      console.error('Failed to save cloud config to localStorage:', error);
    }
  }, [cloudConfig]);

  const simulateQuantumState = useCallback(async (gates: Gate[]) => {
    console.log('🔄 simulateQuantumState called with gates:', gates);
    console.log('🔄 Current simulation mode:', simulationMode);
    
    // Generate circuit hash for uniqueness verification
    const circuitHash = JSON.stringify(gates.map(g => ({ 
      type: g.type, 
      qubit: g.qubit, 
      qubits: g.qubits, 
      position: g.position, 
      angle: g.angle 
    })));
    console.log('🔄 Circuit hash:', circuitHash.substring(0, 50) + '...');
    
    try {
      // Always reset the simulation manager for fresh state
      enhancedQuantumSimulationManager.reset();
      
      // Set the mode BEFORE simulation to ensure it's applied
      console.log('🔄 Setting simulation mode to:', simulationMode);
      enhancedQuantumSimulationManager.setMode(simulationMode);
      
      // Convert our Gate interface to QuantumGate interface
      const quantumGates: QuantumGate[] = gates.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        position: gate.position,
        angle: gate.angle
      }));
      
      console.log('🔄 Converted quantum gates:', quantumGates);
      
      // Run the enhanced quantum simulation
      console.log('🔄 Calling enhancedQuantumSimulationManager.simulate...');
      
      const result = await enhancedQuantumSimulationManager.simulate(quantumGates, 5);
      console.log('🔄 Simulation result received:', result);
      console.log('🔄 Result mode should be:', simulationMode, 'actual mode in result:', result.mode);
      
      // Track simulation analytics
      trackEvent('circuit_simulated', { 
        gateCount: gates.length, 
        numQubits: 5 
      });
      
      console.log('🔄 Setting simulation result with timestamp:', Date.now());
      setSimulationResult(result);
    } catch (error) {
      console.error('❌ Error in simulateQuantumState:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  }, [simulationMode]);

  const handleModeChange = useCallback((mode: EnhancedSimulationMode) => {
    setSimulationMode(mode);
    enhancedQuantumSimulationManager.setMode(mode);
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
    console.log('🔄 Adding gate:', newGate);
    const newCircuit = [...circuit, newGate];
    console.log('🔄 New circuit length:', newCircuit.length);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    
    // Track analytics
    trackEvent('gate_added', { 
      gateType: newGate.type, 
      qubit: newGate.qubit, 
      position: newGate.position 
    });
    gateUsageTracker.increment(newGate.type);
    trackEvent('circuit_modified', { 
      gateType: newGate.type, 
      numGates: newCircuit.length 
    });
    
    // Generate standardized circuit data structure and simulate
    const circuitData = generateCircuitData(newCircuit);
    console.log('🔄 Generated circuit data:', circuitData);
    console.log('🔄 About to call simulateQuantumState with circuit length:', newCircuit.length);
    simulateQuantumState(newCircuit);
  }, [circuit, simulateQuantumState]);

  const deleteGate = useCallback((gateId: string) => {
    const gateToDelete = circuit.find(g => g.id === gateId);
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    
    // Track analytics
    if (gateToDelete) {
      trackEvent('gate_removed', { gateType: gateToDelete.type });
    }
    
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
    // Track session time before clearing
    sessionTracker.trackTimeSpent();
    sessionTracker.reset();
    
    setCircuit([]);
    setHistory([[]]);
    setSimulationResult(null);
  }, [sessionTracker]);

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

  // Step-by-step execution methods
  const handleStepModeToggle = useCallback((enabled: boolean) => {
    enhancedQuantumSimulationManager.enableStepMode(enabled);
  }, []);

  const handleSimulationStep = useCallback((): SimulationStepData | null => {
    return enhancedQuantumSimulationManager.step();
  }, []);

  const handleSimulationReset = useCallback(() => {
    enhancedQuantumSimulationManager.reset();
    setSimulationResult(null);
  }, []);

  const handleSimulationPause = useCallback(() => {
    enhancedQuantumSimulationManager.pause();
  }, []);

  const handleSimulationResume = useCallback(() => {
    enhancedQuantumSimulationManager.resume();
  }, []);

  return {
    circuit,
    setCircuit,
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
    handleStepModeToggle,
    handleSimulationStep,
    handleSimulationReset,
    handleSimulationPause,
    handleSimulationResume,
    isCloudConfigured: !!cloudConfig.ibmqToken && cloudConfig.ibmqToken.trim().length > 0,
    canUndo
  };
}