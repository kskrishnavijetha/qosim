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

  // Ultra-strict validation function to eliminate all undefined values
  const validateAndFixGate = (gate: Gate): Gate => {
    console.log('🔍 STRICT Validating gate:', gate);
    
    // Start with a completely clean gate object
    const fixedGate: Gate = {
      id: gate.id || `gate-${Date.now()}-${Math.random()}`,
      type: gate.type || 'I',
      position: Math.max(0, Math.floor(gate.position || 0))
    };
    
    // Handle angles and params safely
    if (gate.angle !== undefined && gate.angle !== null && !isNaN(gate.angle)) {
      fixedGate.angle = Number(gate.angle);
    }
    if (gate.params && Array.isArray(gate.params)) {
      fixedGate.params = gate.params.filter(p => p !== undefined && p !== null && !isNaN(p)).map(p => Number(p));
    }
    
    console.log(`🔍 Processing gate type: ${fixedGate.type}`);
    
    // Define gate categories with explicit lists
    const singleQubitGates = ['I', 'X', 'Y', 'Z', 'H', 'S', 'SDG', 'T', 'TDG', 'RX', 'RY', 'RZ', 'U1', 'U2', 'U3', 'MEASURE', 'M', 'RESET'];
    const twoQubitGates = ['CNOT', 'CX', 'CZ', 'SWAP', 'CY', 'CH'];
    const threeQubitGates = ['CCX', 'TOFFOLI', 'FREDKIN', 'CSWAP'];
    const compositeGates = ['BELL', 'GHZ', 'W'];
    
    // Handle single-qubit gates with EXTREME validation
    if (singleQubitGates.includes(fixedGate.type)) {
      let targetQubit = 0; // Default fallback
      
      // Try to get qubit from various sources with strict validation
      if (gate.qubit !== undefined && gate.qubit !== null && !isNaN(gate.qubit) && gate.qubit >= 0) {
        targetQubit = Math.floor(Number(gate.qubit));
      } else if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0) {
        const firstQubit = gate.qubits[0];
        if (firstQubit !== undefined && firstQubit !== null && !isNaN(firstQubit) && firstQubit >= 0) {
          targetQubit = Math.floor(Number(firstQubit));
        }
      }
      
      // Ensure qubit is within valid range (0-4 for 5-qubit system)
      targetQubit = Math.max(0, Math.min(4, targetQubit));
      
      fixedGate.qubit = targetQubit;
      // Explicitly remove qubits array for single-qubit gates
      if ('qubits' in fixedGate) {
        delete fixedGate.qubits;
      }
      
      console.log(`🔍 Single-qubit gate ${fixedGate.type} FIXED to qubit ${fixedGate.qubit}`);
    }
    
    // Handle two-qubit gates with EXTREME validation
    else if (twoQubitGates.includes(fixedGate.type)) {
      let qubit1 = 0, qubit2 = 1; // Default fallback
      
      if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
        const q1 = gate.qubits[0];
        const q2 = gate.qubits[1];
        
        if (q1 !== undefined && q1 !== null && !isNaN(q1) && q1 >= 0) {
          qubit1 = Math.floor(Number(q1));
        }
        if (q2 !== undefined && q2 !== null && !isNaN(q2) && q2 >= 0) {
          qubit2 = Math.floor(Number(q2));
        }
      } else if (gate.qubit !== undefined && gate.qubit !== null && !isNaN(gate.qubit)) {
        qubit1 = Math.floor(Number(gate.qubit));
        qubit2 = (qubit1 + 1) % 5; // Next qubit, wrap around
      }
      
      // Ensure qubits are different and within range
      qubit1 = Math.max(0, Math.min(4, qubit1));
      qubit2 = Math.max(0, Math.min(4, qubit2));
      
      if (qubit1 === qubit2) {
        qubit2 = (qubit1 + 1) % 5;
      }
      
      fixedGate.qubits = [qubit1, qubit2];
      // Explicitly remove single qubit property
      if ('qubit' in fixedGate) {
        delete fixedGate.qubit;
      }
      
      console.log(`🔍 Two-qubit gate ${fixedGate.type} FIXED to qubits [${qubit1}, ${qubit2}]`);
    }
    
    // Handle three-qubit gates with EXTREME validation
    else if (threeQubitGates.includes(fixedGate.type)) {
      let qubit1 = 0, qubit2 = 1, qubit3 = 2; // Default fallback
      
      if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 3) {
        const q1 = gate.qubits[0];
        const q2 = gate.qubits[1];
        const q3 = gate.qubits[2];
        
        if (q1 !== undefined && q1 !== null && !isNaN(q1) && q1 >= 0) {
          qubit1 = Math.floor(Number(q1));
        }
        if (q2 !== undefined && q2 !== null && !isNaN(q2) && q2 >= 0) {
          qubit2 = Math.floor(Number(q2));
        }
        if (q3 !== undefined && q3 !== null && !isNaN(q3) && q3 >= 0) {
          qubit3 = Math.floor(Number(q3));
        }
      }
      
      // Ensure all qubits are different and within range
      qubit1 = Math.max(0, Math.min(4, qubit1));
      qubit2 = Math.max(0, Math.min(4, qubit2));
      qubit3 = Math.max(0, Math.min(4, qubit3));
      
      // Make sure all qubits are unique
      if (qubit1 === qubit2) qubit2 = (qubit1 + 1) % 5;
      if (qubit1 === qubit3 || qubit2 === qubit3) qubit3 = (Math.max(qubit1, qubit2) + 1) % 5;
      
      fixedGate.qubits = [qubit1, qubit2, qubit3];
      if ('qubit' in fixedGate) {
        delete fixedGate.qubit;
      }
      
      console.log(`🔍 Three-qubit gate ${fixedGate.type} FIXED to qubits [${qubit1}, ${qubit2}, ${qubit3}]`);
    }
    
    // Handle composite gates
    else if (compositeGates.includes(fixedGate.type)) {
      if (fixedGate.type === 'BELL') {
        let qubit1 = 0, qubit2 = 1;
        
        if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
          const q1 = gate.qubits[0];
          const q2 = gate.qubits[1];
          
          if (q1 !== undefined && q1 !== null && !isNaN(q1) && q1 >= 0) {
            qubit1 = Math.floor(Number(q1));
          }
          if (q2 !== undefined && q2 !== null && !isNaN(q2) && q2 >= 0) {
            qubit2 = Math.floor(Number(q2));
          }
        }
        
        qubit1 = Math.max(0, Math.min(4, qubit1));
        qubit2 = Math.max(0, Math.min(4, qubit2));
        if (qubit1 === qubit2) qubit2 = (qubit1 + 1) % 5;
        
        fixedGate.qubits = [qubit1, qubit2];
      } else if (fixedGate.type === 'GHZ' || fixedGate.type === 'W') {
        let qubit1 = 0, qubit2 = 1, qubit3 = 2;
        
        if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length >= 3) {
          const q1 = gate.qubits[0];
          const q2 = gate.qubits[1];
          const q3 = gate.qubits[2];
          
          if (q1 !== undefined && q1 !== null && !isNaN(q1) && q1 >= 0) {
            qubit1 = Math.floor(Number(q1));
          }
          if (q2 !== undefined && q2 !== null && !isNaN(q2) && q2 >= 0) {
            qubit2 = Math.floor(Number(q2));
          }
          if (q3 !== undefined && q3 !== null && !isNaN(q3) && q3 >= 0) {
            qubit3 = Math.floor(Number(q3));
          }
        }
        
        qubit1 = Math.max(0, Math.min(4, qubit1));
        qubit2 = Math.max(0, Math.min(4, qubit2));
        qubit3 = Math.max(0, Math.min(4, qubit3));
        
        if (qubit1 === qubit2) qubit2 = (qubit1 + 1) % 5;
        if (qubit1 === qubit3 || qubit2 === qubit3) qubit3 = (Math.max(qubit1, qubit2) + 1) % 5;
        
        fixedGate.qubits = [qubit1, qubit2, qubit3];
      }
      
      if ('qubit' in fixedGate) {
        delete fixedGate.qubit;
      }
      
      console.log(`🔍 Composite gate ${fixedGate.type} FIXED to qubits ${fixedGate.qubits}`);
    }
    
    // Final safety check: ensure NO undefined values remain
    if (fixedGate.qubit === undefined && (!fixedGate.qubits || fixedGate.qubits.length === 0)) {
      console.error(`❌ CRITICAL ERROR: Gate ${fixedGate.type} has no qubit assignment! Forcing qubit 0`);
      fixedGate.qubit = 0;
    }
    
    if (fixedGate.qubits) {
      const hasInvalidQubit = fixedGate.qubits.some(q => q === undefined || q === null || isNaN(q));
      if (hasInvalidQubit) {
        console.error(`❌ CRITICAL ERROR: Gate ${fixedGate.type} has invalid qubits! Fixing...`);
        fixedGate.qubits = fixedGate.qubits.map((q, index) => {
          if (q === undefined || q === null || isNaN(q)) {
            return index; // Use index as fallback
          }
          return Math.max(0, Math.min(4, Math.floor(Number(q))));
        });
      }
    }
    
    // Validate rotation gates have angles
    if (['RX', 'RY', 'RZ', 'U1'].includes(fixedGate.type) && (fixedGate.angle === undefined || fixedGate.angle === null)) {
      fixedGate.angle = 0;
      console.warn(`🔍 Set default angle 0 for rotation gate ${fixedGate.type}`);
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
    
    // ULTRA-STRICT validation of all gates
    const validatedGates = gates.map((gate, index) => {
      console.log(`🔄 Validating gate ${index}:`, gate);
      const validated = validateAndFixGate(gate);
      
      // Triple-check for any remaining undefined/null values
      if (validated.qubit !== undefined && (validated.qubit === null || isNaN(validated.qubit))) {
        console.error(`❌ STILL INVALID: Gate ${validated.type} has invalid qubit:`, validated.qubit);
        validated.qubit = 0;
      }
      
      if (validated.qubits) {
        validated.qubits = validated.qubits.map((q, i) => {
          if (q === undefined || q === null || isNaN(q)) {
            console.error(`❌ STILL INVALID: Gate ${validated.type} has invalid qubit at index ${i}:`, q);
            return i; // Use index as safe fallback
          }
          return Math.max(0, Math.min(4, Math.floor(Number(q))));
        });
      }
      
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
        
        // Ultra-safe qubit assignment
        if (gate.qubit !== undefined && gate.qubit !== null && !isNaN(gate.qubit)) {
          quantumGate.qubit = Math.max(0, Math.min(4, Math.floor(Number(gate.qubit))));
          console.log(`🔄 Assigned single qubit: ${quantumGate.qubit}`);
        }
        
        if (gate.qubits && Array.isArray(gate.qubits) && gate.qubits.length > 0) {
          quantumGate.qubits = gate.qubits.map(q => {
            const validQubit = Math.max(0, Math.min(4, Math.floor(Number(q))));
            console.log(`🔄 Converted qubit ${q} to ${validQubit}`);
            return validQubit;
          });
          console.log(`🔄 Assigned qubits array: [${quantumGate.qubits.join(', ')}]`);
        }
        
        if (gate.angle !== undefined && gate.angle !== null && !isNaN(gate.angle)) {
          quantumGate.angle = Number(gate.angle);
        }
        
        if (gate.params && Array.isArray(gate.params)) {
          quantumGate.params = gate.params.filter(p => p !== undefined && p !== null && !isNaN(p)).map(p => Number(p));
        }
        
        // Final validation check
        if (quantumGate.qubit === undefined && (!quantumGate.qubits || quantumGate.qubits.length === 0)) {
          console.error(`❌ EMERGENCY: QuantumGate ${quantumGate.type} still has no qubit! Forcing qubit 0`);
          quantumGate.qubit = 0;
        }
        
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
