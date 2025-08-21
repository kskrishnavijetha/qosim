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

  // EMERGENCY VALIDATION: Ensure absolutely no undefined values pass through
  const emergencyValidateGate = (gate: Gate): Gate | null => {
    console.log('🚨 EMERGENCY Validating gate:', gate);
    
    // Reject completely invalid gates
    if (!gate || typeof gate !== 'object') {
      console.error('❌ EMERGENCY: Gate is not a valid object');
      return null;
    }
    
    if (!gate.type || typeof gate.type !== 'string') {
      console.error('❌ EMERGENCY: Gate type is invalid');
      return null;
    }
    
    if (gate.position === undefined || gate.position === null || isNaN(gate.position)) {
      console.error('❌ EMERGENCY: Gate position is invalid');
      return null;
    }
    
    // Start with completely clean gate
    const cleanGate: Gate = {
      id: gate.id || `emergency-${Date.now()}-${Math.random()}`,
      type: gate.type,
      position: Math.max(0, Math.floor(Number(gate.position) || 0))
    };
    
    // Define gate requirements
    const singleQubitGates = ['I', 'X', 'Y', 'Z', 'H', 'S', 'SDG', 'T', 'TDG', 'RX', 'RY', 'RZ', 'U1', 'U2', 'U3', 'MEASURE', 'M', 'RESET'];
    const twoQubitGates = ['CNOT', 'CX', 'CZ', 'SWAP', 'CY', 'CH'];
    const threeQubitGates = ['CCX', 'TOFFOLI', 'FREDKIN', 'CSWAP'];
    
    if (singleQubitGates.includes(cleanGate.type)) {
      // For single qubit gates, ensure we have exactly one valid qubit
      let targetQubit = 0;
      
      if (gate.qubit !== undefined && gate.qubit !== null && !isNaN(gate.qubit) && gate.qubit >= 0) {
        targetQubit = Math.max(0, Math.min(4, Math.floor(Number(gate.qubit))));
      } else if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0) {
        const firstQubit = gate.qubits[0];
        if (firstQubit !== undefined && firstQubit !== null && !isNaN(firstQubit) && firstQubit >= 0) {
          targetQubit = Math.max(0, Math.min(4, Math.floor(Number(firstQubit))));
        }
      }
      
      cleanGate.qubit = targetQubit;
      console.log(`🚨 EMERGENCY: Single qubit gate ${cleanGate.type} assigned to qubit ${targetQubit}`);
      
    } else if (twoQubitGates.includes(cleanGate.type)) {
      // For two qubit gates, ensure we have exactly two different valid qubits
      let qubit1 = 0;
      let qubit2 = 1;
      
      if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
        const q1 = gate.qubits[0];
        const q2 = gate.qubits[1];
        
        if (q1 !== undefined && q1 !== null && !isNaN(q1) && q1 >= 0) {
          qubit1 = Math.max(0, Math.min(4, Math.floor(Number(q1))));
        }
        if (q2 !== undefined && q2 !== null && !isNaN(q2) && q2 >= 0) {
          qubit2 = Math.max(0, Math.min(4, Math.floor(Number(q2))));
        }
      }
      
      // Ensure qubits are different
      if (qubit1 === qubit2) {
        qubit2 = (qubit1 + 1) % 5;
      }
      
      cleanGate.qubits = [qubit1, qubit2];
      console.log(`🚨 EMERGENCY: Two qubit gate ${cleanGate.type} assigned to qubits [${qubit1}, ${qubit2}]`);
      
    } else if (threeQubitGates.includes(cleanGate.type)) {
      // For three qubit gates, ensure we have exactly three different valid qubits
      let qubit1 = 0;
      let qubit2 = 1;
      let qubit3 = 2;
      
      if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 3) {
        const q1 = gate.qubits[0];
        const q2 = gate.qubits[1];
        const q3 = gate.qubits[2];
        
        if (q1 !== undefined && q1 !== null && !isNaN(q1) && q1 >= 0) {
          qubit1 = Math.max(0, Math.min(4, Math.floor(Number(q1))));
        }
        if (q2 !== undefined && q2 !== null && !isNaN(q2) && q2 >= 0) {
          qubit2 = Math.max(0, Math.min(4, Math.floor(Number(q2))));
        }
        if (q3 !== undefined && q3 !== null && !isNaN(q3) && q3 >= 0) {
          qubit3 = Math.max(0, Math.min(4, Math.floor(Number(q3))));
        }
      }
      
      // Ensure all qubits are different
      if (qubit1 === qubit2) qubit2 = (qubit1 + 1) % 5;
      if (qubit1 === qubit3 || qubit2 === qubit3) qubit3 = (Math.max(qubit1, qubit2) + 1) % 5;
      
      cleanGate.qubits = [qubit1, qubit2, qubit3];
      console.log(`🚨 EMERGENCY: Three qubit gate ${cleanGate.type} assigned to qubits [${qubit1}, ${qubit2}, ${qubit3}]`);
    } else {
      // Unknown gate type, assign default single qubit
      cleanGate.qubit = 0;
      console.warn(`🚨 EMERGENCY: Unknown gate type ${cleanGate.type}, assigned to qubit 0`);
    }
    
    // Handle angles and params safely
    if (gate.angle !== undefined && gate.angle !== null && !isNaN(gate.angle)) {
      cleanGate.angle = Number(gate.angle);
    } else if (['RX', 'RY', 'RZ', 'U1'].includes(cleanGate.type)) {
      cleanGate.angle = 0; // Default angle for rotation gates
    }
    
    if (gate.params && Array.isArray(gate.params)) {
      cleanGate.params = gate.params.filter(p => p !== undefined && p !== null && !isNaN(p)).map(p => Number(p));
    }
    
    console.log('✅ EMERGENCY: Gate validated:', cleanGate);
    return cleanGate;
  };

  // Ultra-strict validation function to eliminate all undefined values
  const validateAndFixGate = (gate: Gate): Gate => {
    console.log('🔍 STRICT Validating gate:', gate);
    
    // First pass: emergency validation
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
    
    // Second pass: detailed validation
    const fixedGate: Gate = { ...emergencyValidated };
    
    console.log(`🔍 Processing gate type: ${fixedGate.type}`);
    
    // Final safety check: ensure NO undefined values remain anywhere
    if (fixedGate.qubit !== undefined) {
      if (fixedGate.qubit === null || isNaN(fixedGate.qubit) || fixedGate.qubit < 0) {
        console.error(`❌ FINAL CHECK FAILED: Invalid qubit ${fixedGate.qubit}, forcing to 0`);
        fixedGate.qubit = 0;
      } else {
        fixedGate.qubit = Math.max(0, Math.min(4, Math.floor(Number(fixedGate.qubit))));
      }
    }
    
    if (fixedGate.qubits && Array.isArray(fixedGate.qubits)) {
      fixedGate.qubits = fixedGate.qubits.map((q, index) => {
        if (q === undefined || q === null || isNaN(q) || q < 0) {
          console.error(`❌ FINAL CHECK FAILED: Invalid qubit at index ${index}: ${q}, forcing to ${index}`);
          return Math.min(index, 4);
        }
        return Math.max(0, Math.min(4, Math.floor(Number(q))));
      });
    }
    
    // Absolutely ensure we have valid qubit assignment
    const hasValidQubit = (fixedGate.qubit !== undefined && fixedGate.qubit >= 0) || 
                         (fixedGate.qubits && fixedGate.qubits.length > 0 && fixedGate.qubits.every(q => q !== undefined && q >= 0));
    
    if (!hasValidQubit) {
      console.error('❌ FINAL EMERGENCY: No valid qubit assignment found, forcing single qubit 0');
      fixedGate.qubit = 0;
      delete fixedGate.qubits;
    }
    
    console.log('✅ FINAL VALIDATED GATE:', fixedGate);
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
    
    // EMERGENCY PRE-FILTER: Remove any completely invalid gates
    const preFilteredGates = gates.filter(gate => {
      if (!gate || typeof gate !== 'object' || !gate.type) {
        console.error('❌ PRE-FILTER: Removing invalid gate:', gate);
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
    const validatedGates = preFilteredGates.map((gate, index) => {
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
    } catch (error) {
      console.error('❌ Error in simulateQuantumState:', error);
      
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
