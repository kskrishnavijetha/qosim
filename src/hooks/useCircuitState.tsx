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

  // Enhanced validation function with detailed logging
  const validateAndFixGate = (gate: Gate): Gate => {
    console.log('🔍 Validating gate:', gate);
    const fixedGate = { ...gate };
    
    // Ensure gate has valid ID
    if (!fixedGate.id) {
      fixedGate.id = `gate-${Date.now()}-${Math.random()}`;
      console.warn(`Gate missing ID, assigned: ${fixedGate.id}`);
    }
    
    // Ensure gate has valid type
    if (!fixedGate.type) {
      console.error('Gate missing type:', fixedGate);
      fixedGate.type = 'I'; // Default to identity gate
    }
    
    // Ensure position is valid
    if (fixedGate.position === undefined || isNaN(fixedGate.position) || fixedGate.position < 0) {
      console.warn(`Invalid position ${fixedGate.position} for gate ${fixedGate.type}, setting to 0`);
      fixedGate.position = 0;
    }
    
    // Handle single qubit gates
    if (fixedGate.qubit !== undefined) {
      if (isNaN(fixedGate.qubit) || fixedGate.qubit < 0) {
        console.warn(`Invalid qubit index ${fixedGate.qubit} for gate ${fixedGate.type}, setting to 0`);
        fixedGate.qubit = 0;
      }
    }
    
    // Handle multi-qubit gates
    if (fixedGate.qubits) {
      if (!Array.isArray(fixedGate.qubits)) {
        console.warn(`Invalid qubits array for gate ${fixedGate.type}:`, fixedGate.qubits);
        fixedGate.qubits = [0, 1]; // Default to first two qubits
      } else {
        fixedGate.qubits = fixedGate.qubits.map((q, index) => {
          if (q === undefined || q === null || isNaN(q) || q < 0) {
            console.warn(`Invalid qubit index ${q} at position ${index} for gate ${fixedGate.type}, setting to ${index}`);
            return index;
          }
          return Math.floor(q); // Ensure integer
        });
      }
    }
    
    // Handle composite gates - ensure they have proper qubit arrays
    if (fixedGate.type === 'BELL' && !fixedGate.qubits) {
      fixedGate.qubits = [0, 1];
      console.log('Set BELL gate qubits to [0, 1]');
    } else if (fixedGate.type === 'GHZ' && !fixedGate.qubits) {
      fixedGate.qubits = [0, 1, 2];
      console.log('Set GHZ gate qubits to [0, 1, 2]');
    } else if (fixedGate.type === 'W' && !fixedGate.qubits) {
      fixedGate.qubits = [0, 1, 2];
      console.log('Set W gate qubits to [0, 1, 2]');
    }
    
    // Handle two-qubit gates that need qubits array
    const twoQubitGates = ['CNOT', 'CZ', 'SWAP', 'CX'];
    if (twoQubitGates.includes(fixedGate.type) && !fixedGate.qubits) {
      if (fixedGate.qubit !== undefined) {
        // If only single qubit specified, create array with control and target
        fixedGate.qubits = [fixedGate.qubit, (fixedGate.qubit + 1) % 5];
        delete fixedGate.qubit; // Remove single qubit property
        console.log(`Converted ${fixedGate.type} single qubit to qubits array:`, fixedGate.qubits);
      } else {
        fixedGate.qubits = [0, 1]; // Default
        console.log(`Set default qubits for ${fixedGate.type}:`, fixedGate.qubits);
      }
    }
    
    // Handle three-qubit gates
    const threeQubitGates = ['CCX', 'TOFFOLI'];
    if (threeQubitGates.includes(fixedGate.type) && (!fixedGate.qubits || fixedGate.qubits.length < 3)) {
      fixedGate.qubits = [0, 1, 2];
      console.log(`Set default qubits for ${fixedGate.type}:`, fixedGate.qubits);
    }
    
    // Validate angles for rotation gates
    const rotationGates = ['RX', 'RY', 'RZ'];
    if (rotationGates.includes(fixedGate.type)) {
      if (fixedGate.angle === undefined || isNaN(fixedGate.angle)) {
        fixedGate.angle = 0;
        console.warn(`Set default angle 0 for rotation gate ${fixedGate.type}`);
      }
      
      // Ensure these gates have a valid qubit
      if (fixedGate.qubit === undefined || isNaN(fixedGate.qubit) || fixedGate.qubit < 0) {
        fixedGate.qubit = 0;
        console.warn(`Set default qubit 0 for rotation gate ${fixedGate.type}`);
      }
    }
    
    console.log('✅ Validated gate result:', fixedGate);
    return fixedGate;
  };

  const simulateQuantumState = useCallback(async (gates: Gate[]) => {
    console.log('🔄 simulateQuantumState called with gates:', gates);
    console.log('🔄 Current simulation mode:', simulationMode);
    
    if (!gates || gates.length === 0) {
      console.log('🔄 No gates to simulate, setting null result');
      setSimulationResult(null);
      return;
    }
    
    // Validate and fix all gates before simulation
    const validatedGates = gates.map(validateAndFixGate);
    console.log('🔄 Validated gates:', validatedGates);
    
    // Verify no undefined values remain
    const hasUndefined = validatedGates.some(gate => 
      gate.qubit === undefined && gate.qubits === undefined ||
      (gate.qubits && gate.qubits.some(q => q === undefined))
    );
    
    if (hasUndefined) {
      console.error('❌ Still have undefined values after validation:', validatedGates);
      return;
    }
    
    // Generate circuit hash for uniqueness verification
    const circuitHash = JSON.stringify(validatedGates.map(g => ({ 
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
      
      // Convert our Gate interface to QuantumGate interface with validation
      const quantumGates: QuantumGate[] = validatedGates.map(gate => {
        console.log('🔄 Converting gate to QuantumGate:', gate);
        
        const quantumGate: QuantumGate = {
          id: gate.id,
          type: gate.type,
          position: gate.position
        };
        
        // Add qubit information with validation
        if (gate.qubit !== undefined && !isNaN(gate.qubit)) {
          quantumGate.qubit = Math.max(0, Math.floor(gate.qubit)); // Ensure non-negative integer
        }
        
        if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0) {
          quantumGate.qubits = gate.qubits.map(q => Math.max(0, Math.floor(q))); // Ensure non-negative integers
        }
        
        if (gate.angle !== undefined && !isNaN(gate.angle)) {
          quantumGate.angle = gate.angle;
        }
        
        console.log('🔄 Converted QuantumGate:', quantumGate);
        return quantumGate;
      });
      
      console.log('🔄 Final quantum gates for simulation:', quantumGates);
      
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
        gateCount: validatedGates.length, 
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
    
    // Validate and fix the gate before adding
    const validatedGate = validateAndFixGate(newGate);
    console.log('🔄 Validated gate:', validatedGate);
    
    const newCircuit = [...circuit, validatedGate];
    console.log('🔄 New circuit length:', newCircuit.length);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    
    // Track analytics
    trackEvent('gate_added', { 
      gateType: validatedGate.type, 
      qubit: validatedGate.qubit, 
      position: validatedGate.position 
    });
    gateUsageTracker.increment(validatedGate.type);
    trackEvent('circuit_modified', { 
      gateType: validatedGate.type, 
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
      .map(validateAndFixGate) // Validate gates in circuit data
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
