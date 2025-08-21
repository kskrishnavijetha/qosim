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

  // Enhanced validation function with comprehensive error checking
  const validateAndFixGate = (gate: Gate): Gate => {
    console.log('🔍 Validating gate:', gate);
    
    // Create a deep copy to avoid mutations
    const fixedGate: Gate = {
      id: gate.id || `gate-${Date.now()}-${Math.random()}`,
      type: gate.type || 'I',
      position: Math.max(0, Math.floor(gate.position || 0))
    };
    
    // Copy other properties if they exist and are valid
    if (gate.angle !== undefined && !isNaN(gate.angle)) {
      fixedGate.angle = gate.angle;
    }
    if (gate.params && Array.isArray(gate.params)) {
      fixedGate.params = gate.params.filter(p => !isNaN(p));
    }
    
    console.log(`🔍 Processing gate type: ${fixedGate.type}`);
    
    // Handle single-qubit gates
    const singleQubitGates = ['I', 'X', 'Y', 'Z', 'H', 'S', 'SDG', 'T', 'TDG', 'RX', 'RY', 'RZ', 'U1', 'U2', 'U3', 'MEASURE', 'M', 'RESET'];
    if (singleQubitGates.includes(fixedGate.type)) {
      // Ensure single qubit gates have a valid qubit property
      if (gate.qubit !== undefined && !isNaN(gate.qubit) && gate.qubit >= 0) {
        fixedGate.qubit = Math.floor(gate.qubit);
      } else if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0 && !isNaN(gate.qubits[0])) {
        // Convert from qubits array to single qubit
        fixedGate.qubit = Math.max(0, Math.floor(gate.qubits[0]));
        console.log(`🔍 Converted qubits[0] to qubit for ${fixedGate.type}: ${fixedGate.qubit}`);
      } else {
        // Default to qubit 0
        fixedGate.qubit = 0;
        console.warn(`🔍 Set default qubit 0 for ${fixedGate.type}`);
      }
      
      // Remove qubits array for single-qubit gates
      delete fixedGate.qubits;
      
      console.log(`🔍 Single-qubit gate ${fixedGate.type} assigned to qubit ${fixedGate.qubit}`);
    }
    
    // Handle two-qubit gates
    const twoQubitGates = ['CNOT', 'CX', 'CZ', 'SWAP', 'CY', 'CH'];
    if (twoQubitGates.includes(fixedGate.type)) {
      if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
        // Use existing qubits array
        fixedGate.qubits = [
          Math.max(0, Math.floor(gate.qubits[0] || 0)),
          Math.max(0, Math.floor(gate.qubits[1] || 1))
        ];
      } else if (gate.qubit !== undefined && !isNaN(gate.qubit)) {
        // Convert single qubit to control-target pair
        const control = Math.max(0, Math.floor(gate.qubit));
        const target = (control + 1) % 5; // Wrap around to stay within 5 qubits
        fixedGate.qubits = [control, target];
        console.log(`🔍 Created qubit pair for ${fixedGate.type}: [${control}, ${target}]`);
      } else {
        // Default qubits
        fixedGate.qubits = [0, 1];
        console.warn(`🔍 Set default qubits [0, 1] for ${fixedGate.type}`);
      }
      
      // Ensure qubits are different
      if (fixedGate.qubits[0] === fixedGate.qubits[1]) {
        fixedGate.qubits[1] = (fixedGate.qubits[0] + 1) % 5;
        console.log(`🔍 Fixed identical qubits for ${fixedGate.type}: ${fixedGate.qubits}`);
      }
      
      // Remove single qubit property
      delete fixedGate.qubit;
      
      console.log(`🔍 Two-qubit gate ${fixedGate.type} assigned to qubits ${fixedGate.qubits}`);
    }
    
    // Handle three-qubit gates
    const threeQubitGates = ['CCX', 'TOFFOLI', 'FREDKIN', 'CSWAP'];
    if (threeQubitGates.includes(fixedGate.type)) {
      if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 3) {
        fixedGate.qubits = [
          Math.max(0, Math.floor(gate.qubits[0] || 0)),
          Math.max(0, Math.floor(gate.qubits[1] || 1)),
          Math.max(0, Math.floor(gate.qubits[2] || 2))
        ];
      } else {
        fixedGate.qubits = [0, 1, 2];
        console.warn(`🔍 Set default qubits [0, 1, 2] for ${fixedGate.type}`);
      }
      
      // Ensure all qubits are different
      const uniqueQubits = [...new Set(fixedGate.qubits)];
      if (uniqueQubits.length < 3) {
        fixedGate.qubits = [0, 1, 2];
        console.log(`🔍 Fixed duplicate qubits for ${fixedGate.type}: [0, 1, 2]`);
      }
      
      delete fixedGate.qubit;
      console.log(`🔍 Three-qubit gate ${fixedGate.type} assigned to qubits ${fixedGate.qubits}`);
    }
    
    // Handle composite gates
    if (fixedGate.type === 'BELL') {
      fixedGate.qubits = gate.qubits && gate.qubits.length >= 2 ? 
        [Math.max(0, Math.floor(gate.qubits[0] || 0)), Math.max(0, Math.floor(gate.qubits[1] || 1))] : 
        [0, 1];
      delete fixedGate.qubit;
      console.log(`🔍 BELL gate assigned to qubits ${fixedGate.qubits}`);
    }
    
    if (fixedGate.type === 'GHZ' || fixedGate.type === 'W') {
      fixedGate.qubits = gate.qubits && gate.qubits.length >= 3 ? 
        [
          Math.max(0, Math.floor(gate.qubits[0] || 0)),
          Math.max(0, Math.floor(gate.qubits[1] || 1)),
          Math.max(0, Math.floor(gate.qubits[2] || 2))
        ] : 
        [0, 1, 2];
      delete fixedGate.qubit;
      console.log(`🔍 ${fixedGate.type} gate assigned to qubits ${fixedGate.qubits}`);
    }
    
    // Validate rotation gates have angles
    if (['RX', 'RY', 'RZ'].includes(fixedGate.type) && fixedGate.angle === undefined) {
      fixedGate.angle = 0;
      console.warn(`🔍 Set default angle 0 for rotation gate ${fixedGate.type}`);
    }
    
    // Final validation: ensure no undefined values
    if (fixedGate.qubit === undefined && (!fixedGate.qubits || fixedGate.qubits.length === 0)) {
      console.error(`❌ Gate ${fixedGate.type} has no valid qubit assignment, defaulting to qubit 0`);
      fixedGate.qubit = 0;
    }
    
    // Check for any remaining undefined values in qubits array
    if (fixedGate.qubits) {
      const hasUndefined = fixedGate.qubits.some(q => q === undefined || isNaN(q));
      if (hasUndefined) {
        console.error(`❌ Found undefined qubits in ${fixedGate.type}, fixing...`);
        fixedGate.qubits = fixedGate.qubits.map((q, index) => 
          q !== undefined && !isNaN(q) ? Math.floor(q) : index
        );
      }
    }
    
    console.log('✅ Final validated gate:', fixedGate);
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
    
    // Validate and fix all gates before simulation with strict checking
    const validatedGates = gates.map(gate => {
      const validated = validateAndFixGate(gate);
      
      // Double-check for any remaining undefined values
      if (validated.qubit === undefined && (!validated.qubits || validated.qubits.length === 0)) {
        console.error(`❌ CRITICAL: Gate ${validated.type} still has undefined qubit assignment after validation!`);
        // Force assignment
        validated.qubit = 0;
      }
      
      if (validated.qubits && validated.qubits.some(q => q === undefined || isNaN(q))) {
        console.error(`❌ CRITICAL: Gate ${validated.type} still has undefined qubits after validation!`);
        // Force fix
        validated.qubits = validated.qubits.map((q, i) => q !== undefined && !isNaN(q) ? q : i);
      }
      
      return validated;
    });
    
    console.log('🔄 All gates validated:', validatedGates);
    
    // Final safety check
    const stillHasUndefined = validatedGates.some(gate => 
      (gate.qubit === undefined && (!gate.qubits || gate.qubits.length === 0)) ||
      (gate.qubits && gate.qubits.some(q => q === undefined || isNaN(q)))
    );
    
    if (stillHasUndefined) {
      console.error('❌ CRITICAL: Still have undefined values after validation, aborting simulation');
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
        
        // Add qubit information with strict validation
        if (gate.qubit !== undefined && !isNaN(gate.qubit)) {
          quantumGate.qubit = Math.max(0, Math.floor(gate.qubit));
        }
        
        if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0) {
          quantumGate.qubits = gate.qubits.map(q => Math.max(0, Math.floor(q)));
        }
        
        if (gate.angle !== undefined && !isNaN(gate.angle)) {
          quantumGate.angle = gate.angle;
        }
        
        if (gate.params && Array.isArray(gate.params)) {
          quantumGate.params = gate.params;
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
      
      // Track simulation analytics
      trackEvent('circuit_simulated', { 
        gateCount: validatedGates.length, 
        numQubits: 5,
        mode: simulationMode
      });
      
      setSimulationResult(result);
    } catch (error) {
      console.error('❌ Error in simulateQuantumState:', error);
      
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
