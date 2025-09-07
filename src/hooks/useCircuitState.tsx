import { useState, useCallback, useEffect } from 'react';
import { quantumSimulator, type QuantumGate, type SimulationResult } from '@/lib/quantumSimulator';
import { enhancedQuantumSimulationManager, type EnhancedSimulationMode } from '@/lib/enhancedQuantumSimulationService';
import { type OptimizedSimulationResult, type SimulationStepData, optimizedQuantumSimulator } from '@/lib/quantumSimulatorOptimized';
import { type CloudSimulationConfig, quantumSimulationManager } from '@/lib/quantumSimulationService';
import { trackEvent, gateUsageTracker, CircuitSessionTracker } from '@/lib/analytics';
import { gateValidationService, type ValidatedGate } from '@/services/GateValidationService';
import { circuitStateValidationService, type CircuitState } from '@/services/CircuitStateValidationService';

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
  // Initialize with validated default state
  const [circuitState, setCircuitState] = useState<CircuitState>(() => {
    console.log('🏗️ Initializing circuit state with defaults');
    return circuitStateValidationService.createDefaultCircuitState();
  });
  
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

  // EMERGENCY VALIDATION: Ensure absolutely no undefined values pass through
  const emergencyValidateGate = (gate: Gate): Gate | null => {
    console.log('🚨 EMERGENCY Validating gate:', gate);
    
    // Use the validation service for comprehensive validation
    const normalizedGate = gateValidationService.normalizeGate(gate);
    
    if (!normalizedGate) {
      console.error('❌ EMERGENCY: Gate failed validation service check');
      // Return a safe fallback gate
      return {
        id: `emergency-${Date.now()}`,
        type: 'I',
        qubit: 0,
        position: 0
      };
    }

    // Convert back to the legacy Gate format expected by existing code
    const legacyGate: Gate = {
      id: normalizedGate.id,
      type: normalizedGate.type,
      position: normalizedGate.position
    };

    if (normalizedGate.qubit !== undefined) {
      legacyGate.qubit = normalizedGate.qubit;
    }
    if (normalizedGate.qubits && normalizedGate.qubits.length > 0) {
      legacyGate.qubits = normalizedGate.qubits;
    }
    if (normalizedGate.angle !== undefined) {
      legacyGate.angle = normalizedGate.angle;
    }
    if (normalizedGate.params && normalizedGate.params.length > 0) {
      legacyGate.params = normalizedGate.params;
    }

    console.log('✅ EMERGENCY: Gate validated and converted:', legacyGate);
    return legacyGate;
  };

  // Ultra-strict validation function to eliminate all undefined values
  const validateAndFixGate = (gate: Gate): Gate => {
    console.log('🔍 STRICT Validating gate:', gate);
    
    // First pass: emergency validation using the validation service
    const emergencyValidated = emergencyValidateGate(gate);
    if (!emergencyValidated) {
      console.error('❌ CRITICAL: Gate failed emergency validation, creating fallback');
      return {
        id: `fallback-${Date.now()}`,
        type: 'I',
        qubit: 0,
        position: 0
      };
    }

    // Additional validation for gate type
    const availableGates = gateValidationService.getAvailableGates();
    if (!availableGates.includes(emergencyValidated.type)) {
      console.error(`❌ Unknown gate type: ${emergencyValidated.type}, defaulting to Identity`);
      emergencyValidated.type = 'I';
      emergencyValidated.qubit = emergencyValidated.qubit || 0;
    }

    // Validate qubit assignments one more time
    const validation = gateValidationService.validateGate(
      emergencyValidated.type,
      emergencyValidated.qubits || emergencyValidated.qubit,
      5
    );

    if (!validation.isValid) {
      console.error(`❌ Final validation failed: ${validation.error}, ${validation.suggestion}`);
      // Throw a user-friendly error instead of returning undefined
      throw new Error(`Gate validation failed: ${validation.error}. ${validation.suggestion}`);
    }
    
    console.log('✅ FINAL VALIDATED GATE:', emergencyValidated);
    return emergencyValidated;
  };

  const simulateQuantumState = useCallback(async (gates: Gate[]) => {
    console.log('🔄 simulateQuantumState called with gates:', gates);
    console.log('🔄 Current simulation mode:', simulationMode);
    
    if (!gates || gates.length === 0) {
      console.log('🔄 No gates to simulate, setting null result');
      setSimulationResult(null);
      return;
    }
    
    // EMERGENCY PRE-FILTER: Remove any completely invalid gates
    const preFilteredGates = gates.filter(gate => {
      if (!gate || typeof gate !== 'object' || !gate.type) {
        console.error('❌ PRE-FILTER: Removing invalid gate:', gate);
        return false;
      }
      
      // Check if gate type is supported
      const availableGates = gateValidationService.getAvailableGates();
      if (!availableGates.includes(gate.type)) {
        console.error(`❌ PRE-FILTER: Unknown gate type ${gate.type}, removing gate`);
        return false;
      }
      
      return true;
    });
    
    if (preFilteredGates.length === 0) {
      console.error('❌ All gates were invalid, aborting simulation');
      setSimulationResult(null);
      return;
    }
    
    // ULTRA-STRICT validation of all gates
    let validatedGates: Gate[];
    
    try {
      validatedGates = preFilteredGates.map((gate, index) => {
        console.log(`🔄 Validating gate ${index}:`, gate);
        const validated = validateAndFixGate(gate);
        
        // TRIPLE-CHECK for any remaining undefined/null values
        Object.keys(validated).forEach(key => {
          const value = (validated as any)[key];
          if (value === undefined) {
            console.error(`❌ STILL UNDEFINED: Gate property ${key} is undefined in gate:`, validated);
            // Remove undefined properties
            delete (validated as any)[key];
          }
        });
        
        console.log(`✅ Gate ${index} validated:`, validated);
        return validated;
      });
    } catch (validationError: any) {
      console.error('❌ Gate validation error:', validationError.message);
      // Set a user-friendly error in the simulation result
      const errorResult: OptimizedSimulationResult = {
        stateVector: [],
        measurementProbabilities: [],
        qubitStates: [],
        entanglement: { pairs: [], totalEntanglement: 0, entanglementThreads: [] },
        executionTime: 0,
        fidelity: 0,
        mode: simulationMode,
        error: validationError.message
      };
      setSimulationResult(errorResult);
      return;
    }
    
    console.log('🔄 All gates ULTRA-validated:', validatedGates);
    
    try {
      optimizedQuantumSimulator.setMode(simulationMode);
      
      // Convert to QuantumGate with EXTREME validation
      const quantumGates: QuantumGate[] = validatedGates.map((gate, index) => {
        console.log(`🔄 Converting gate ${index} to QuantumGate:`, gate);
        
        const quantumGate: QuantumGate = {
          id: gate.id,
          type: gate.type,
          position: gate.position
        };
        
        // Ultra-safe qubit assignment with final checks
        if (gate.qubit !== undefined && gate.qubit !== null && !isNaN(gate.qubit)) {
          const safeQubit = Math.max(0, Math.min(4, Math.floor(Number(gate.qubit))));
          quantumGate.qubit = safeQubit;
          console.log(`🔄 Assigned single qubit: ${safeQubit}`);
        }
        
        if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0) {
          const safeQubits = gate.qubits
            .filter(q => q !== undefined && q !== null && !isNaN(q))
            .map(q => Math.max(0, Math.min(4, Math.floor(Number(q)))));
          
          if (safeQubits.length > 0) {
            quantumGate.qubits = safeQubits;
            console.log(`🔄 Assigned qubits array: [${safeQubits.join(', ')}]`);
          }
        }
        
        if (gate.angle !== undefined && gate.angle !== null && !isNaN(gate.angle)) {
          quantumGate.angle = Number(gate.angle);
        }
        
        if (gate.params && Array.isArray(gate.params)) {
          quantumGate.params = gate.params.filter(p => p !== undefined && p !== null && !isNaN(p)).map(p => Number(p));
        }
        
        // ABSOLUTE FINAL CHECK: Ensure qubit assignment exists
        const hasQubit = (quantumGate.qubit !== undefined && quantumGate.qubit >= 0) || 
                        (quantumGate.qubits && quantumGate.qubits.length > 0);
        
        if (!hasQubit) {
          console.error(`❌ ABSOLUTE EMERGENCY: QuantumGate ${quantumGate.type} STILL has no qubit! Forcing qubit 0`);
          quantumGate.qubit = 0;
          delete quantumGate.qubits;
        }
        
        // Remove any undefined properties from the final quantum gate
        Object.keys(quantumGate).forEach(key => {
          if ((quantumGate as any)[key] === undefined) {
            delete (quantumGate as any)[key];
          }
        });
        
        console.log(`✅ Final QuantumGate ${index}:`, quantumGate);
        return quantumGate;
      });
      
      console.log('🔄 Final quantum gates for simulation:', quantumGates);
      
      let result: OptimizedSimulationResult;
      
      if (simulationMode === 'cloud' && isCloudConfigured) {
        console.log('🔄 Using cloud simulation...');
        result = await quantumSimulationManager.simulate(quantumGates, 5) as OptimizedSimulationResult;
      } else {
        console.log('🔄 Using optimized simulation with mode:', simulationMode);
        result = await optimizedQuantumSimulator.simulateAsync(quantumGates);
      }
      
      result.mode = simulationMode;
      console.log('🔄 Simulation completed successfully:', result);
      
      trackEvent('circuit_simulated', { 
        gateCount: validatedGates.length, 
        numQubits: 5,
        mode: simulationMode
      });
      
      setSimulationResult(result);
    } catch (error: any) {
      console.error('❌ Error in simulateQuantumState:', error);
      
      const fallbackResult: OptimizedSimulationResult = {
        stateVector: [],
        measurementProbabilities: [],
        qubitStates: [],
        entanglement: { pairs: [], totalEntanglement: 0, entanglementThreads: [] },
        executionTime: 0,
        fidelity: 0,
        mode: simulationMode,
        error: error.message || 'Simulation failed'
      };
      setSimulationResult(fallbackResult);
    }
  }, [simulationMode, cloudConfig]);

  const handleModeChange = useCallback(async (mode: EnhancedSimulationMode) => {
    console.log('🔄 handleModeChange called with mode:', mode);
    setSimulationMode(mode);
    
    enhancedQuantumSimulationManager.setMode(mode);
    quantumSimulationManager.setMode(mode);
    optimizedQuantumSimulator.setMode(mode);
    
    if (circuit.length > 0) {
      await simulateQuantumState(circuit);
    }
  }, [circuit, simulateQuantumState]);

  const handleCloudConfigChange = useCallback((config: CloudSimulationConfig) => {
    setCloudConfig(config);
    quantumSimulationManager.setCloudConfig(config);
  }, []);

  const addGate = useCallback((newGate: Gate) => {
    console.log('🔄 Adding gate:', newGate);
    
    try {
      const validatedGate = validateAndFixGate(newGate);
      console.log('🔄 Validated gate before adding:', validatedGate);
      
      const newCircuit = [...circuit, validatedGate];
      setCircuit(newCircuit);
      setHistory(prev => [...prev, newCircuit]);
      
      trackEvent('gate_added', { 
        gateType: validatedGate.type, 
        qubit: validatedGate.qubit, 
        position: validatedGate.position 
      });
      gateUsageTracker.increment(validatedGate.type);
      
      simulateQuantumState(newCircuit);
    } catch (error: any) {
      console.error('❌ Failed to add gate:', error.message);
      // Could emit an event here to show user-friendly error message
    }
  }, [circuit, simulateQuantumState]);

  const deleteGate = useCallback((gateId: string) => {
    const gateToDelete = circuit.find(g => g.id === gateId);
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    
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
    sessionTracker.trackTimeSpent();
    sessionTracker.reset();
    
    setCircuit([]);
    setHistory([[]]);
    setSimulationResult(null);
  }, [sessionTracker]);

  const generateCircuitData = (gates: Gate[]) => {
    return gates
      .map(validateAndFixGate)
      .sort((a, b) => a.position - b.position)
      .map(gate => ({
        gate: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        time: gate.position,
        angle: gate.angle
      }));
  };

  const canUndo = history.length > 1;

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
