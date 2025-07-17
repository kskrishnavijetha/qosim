import { useState, useCallback, useEffect } from 'react';
import { quantumSimulator, type QuantumGate, type SimulationResult } from '@/lib/quantumSimulator';
import { enhancedQuantumSimulationManager, type EnhancedSimulationMode } from '@/lib/enhancedQuantumSimulationService';
import { type OptimizedSimulationResult, type SimulationStepData, optimizedQuantumSimulator } from '@/lib/quantumSimulatorOptimized';
import { type CloudSimulationConfig, quantumSimulationManager } from '@/lib/quantumSimulationService';
import { trackEvent, gateUsageTracker, CircuitSessionTracker } from '@/lib/analytics';

export interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[]; // For multi-parameter gates like U2, U3
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
      // Set the mode on the optimized simulator to ensure consistency
      optimizedQuantumSimulator.setMode(simulationMode);
      console.log('🔄 Set mode on optimizedQuantumSimulator to:', simulationMode);
      
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
      
      // Use the appropriate simulation method based on mode
      let result: OptimizedSimulationResult;
      
      if (simulationMode === 'cloud' && isCloudConfigured) {
        console.log('🔄 Using cloud simulation...');
        result = await quantumSimulationManager.simulate(quantumGates, 5) as OptimizedSimulationResult;
      } else if (simulationMode === 'step-by-step') {
        console.log('🔄 Using step-by-step simulation...');
        result = await optimizedQuantumSimulator.simulateAsync(quantumGates);
      } else {
        console.log('🔄 Using optimized simulation with mode:', simulationMode);
        result = await optimizedQuantumSimulator.simulateAsync(quantumGates);
      }
      
      // Ensure the mode is set correctly in the result
      result.mode = simulationMode;
      
      console.log('🔄 Simulation result received:', result);
      console.log('🔄 Result mode should be:', simulationMode, 'actual mode in result:', result.mode);
      
      // Track simulation analytics
      trackEvent('circuit_simulated', { 
        gateCount: gates.length, 
        numQubits: 5,
        mode: simulationMode
      });
      
      console.log('🔄 Setting simulation result with timestamp:', Date.now());
      setSimulationResult(result);
    } catch (error) {
      console.error('❌ Error in simulateQuantumState:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Set a fallback result to show the error
      const fallbackResult: OptimizedSimulationResult = {
        stateVector: [],
        measurementProbabilities: [],
        qubitStates: [],
        entanglement: { pairs: [], totalEntanglement: 0, entanglementThreads: [] },
        executionTime: 0,
        fidelity: 0,
        mode: simulationMode
      };
      setSimulationResult(fallbackResult);
    }
  }, [simulationMode, cloudConfig]);

  const handleModeChange = useCallback(async (mode: EnhancedSimulationMode) => {
    console.log('🔄 handleModeChange called with mode:', mode);
    console.log('🔄 Previous mode was:', simulationMode);
    
    // Update the simulation mode state
    setSimulationMode(mode);
    
    // Update all relevant simulation managers
    enhancedQuantumSimulationManager.setMode(mode);
    quantumSimulationManager.setMode(mode);
    optimizedQuantumSimulator.setMode(mode);
    
    console.log('🔄 Mode updated on all simulators to:', mode);
    
    // Re-simulate with new mode if circuit exists
    if (circuit.length > 0) {
      console.log('🔄 Re-simulating circuit with new mode:', mode);
      await simulateQuantumState(circuit);
    } else {
      console.log('🔄 No circuit to re-simulate');
    }
  }, [circuit, simulateQuantumState, simulationMode]);

  const handleCloudConfigChange = useCallback((config: CloudSimulationConfig) => {
    setCloudConfig(config);
    quantumSimulationManager.setCloudConfig(config);
  }, []);

  const addGate = useCallback((newGate: Gate) => {
    console.log('🔄 Adding gate:', newGate);
    
    // Handle composite gates that need multiple qubits
    let finalGate = newGate;
    
    if (newGate.type === 'BELL' && !newGate.qubits) {
      finalGate = { ...newGate, qubits: [0, 1] };
    } else if (newGate.type === 'GHZ' && !newGate.qubits) {
      finalGate = { ...newGate, qubits: [0, 1, 2] };
    } else if (newGate.type === 'W' && !newGate.qubits) {
      finalGate = { ...newGate, qubits: [0, 1, 2] };
    }
    
    const newCircuit = [...circuit, finalGate];
    console.log('🔄 New circuit length:', newCircuit.length);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    
    // Track analytics - fix the type issue
    trackEvent('gate_added', { 
      gateType: finalGate.type, 
      qubit: finalGate.qubit, 
      position: finalGate.position 
    });
    gateUsageTracker.increment(finalGate.type);
    trackEvent('circuit_modified', { 
      gateType: finalGate.type, 
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
    optimizedQuantumSimulator.enableStepMode(enabled);
  }, []);

  const handleSimulationStep = useCallback((): SimulationStepData | null => {
    return optimizedQuantumSimulator.step();
  }, []);

  const handleSimulationReset = useCallback(() => {
    optimizedQuantumSimulator.reset();
    setSimulationResult(null);
  }, []);

  const handleSimulationPause = useCallback(() => {
    optimizedQuantumSimulator.pause();
  }, []);

  const handleSimulationResume = useCallback(() => {
    optimizedQuantumSimulator.resume();
  }, []);

  const isCloudConfigured = !!cloudConfig.ibmqToken && cloudConfig.ibmqToken.trim().length > 0;

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
    isCloudConfigured,
    canUndo
  };
}
