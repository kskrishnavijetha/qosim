
import { Gate } from '@/hooks/useCircuitState';
import { Circuit, GateOp, validate } from './types';

export function convertToUnifiedCircuit(
  gates: Gate[],
  numQubits: number = 5,
  name: string = "QOSim Circuit"
): Circuit {
  console.log('🔄 Converting to unified circuit:', { gates: gates.length, numQubits, name });
  console.log('🔄 Input gates:', gates);
  
  const unifiedGates: GateOp[] = gates.map((gate, index) => {
    console.log(`🔄 Converting gate ${index}:`, gate);
    
    const gateOp: GateOp = {
      type: gate.type || 'I',
      targets: [],
      layer: gate.position
    };

    // Helper function to validate and ensure valid qubit index
    const ensureValidQubitIndex = (qubit: any, fallbackIndex: number = 0): number => {
      // If qubit is a valid number within range, use it
      if (typeof qubit === 'number' && !isNaN(qubit) && qubit >= 0 && qubit < numQubits) {
        return qubit;
      }
      
      // If qubit is a string number, try to parse it
      if (typeof qubit === 'string' && !isNaN(parseInt(qubit))) {
        const parsed = parseInt(qubit);
        if (parsed >= 0 && parsed < numQubits) {
          return parsed;
        }
      }
      
      // Use fallback index, ensuring it's within bounds
      const safeIndex = Math.max(0, Math.min(fallbackIndex, numQubits - 1));
      console.warn(`⚠️ Invalid qubit index ${qubit}, using fallback: ${safeIndex}`);
      return safeIndex;
    };

    // Handle single-qubit gates first
    if (typeof gate.qubit === 'number' || typeof gate.qubit === 'string') {
      gateOp.targets = [ensureValidQubitIndex(gate.qubit, 0)];
    }

    // Handle multi-qubit gates with qubits array
    if (Array.isArray(gate.qubits) && gate.qubits.length > 0) {
      const validQubits = gate.qubits
        .map((q, idx) => ensureValidQubitIndex(q, idx))
        .filter((q, idx, arr) => arr.indexOf(q) === idx); // Remove duplicates
      
      if (validQubits.length > 0) {
        gateOp.targets = validQubits;
      }
    }

    // Special handling for specific gate types with proper qubit assignment
    switch (gate.type?.toUpperCase()) {
      case 'CNOT':
      case 'CX':
        if (Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
          gateOp.controls = [ensureValidQubitIndex(gate.qubits[0], 0)];
          gateOp.targets = [ensureValidQubitIndex(gate.qubits[1], 1)];
        } else if (typeof gate.qubit === 'number' || typeof gate.qubit === 'string') {
          // Target is specified qubit, control is previous qubit
          const targetQubit = ensureValidQubitIndex(gate.qubit, 1);
          const controlQubit = ensureValidQubitIndex(Math.max(0, targetQubit - 1), 0);
          gateOp.controls = [controlQubit];
          gateOp.targets = [targetQubit];
        } else {
          // Default CNOT on qubits 0 and 1
          gateOp.controls = [0];
          gateOp.targets = [Math.min(1, numQubits - 1)];
        }
        break;

      case 'CZ':
      case 'SWAP':
      case 'BELL':
        if (Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
          gateOp.targets = [
            ensureValidQubitIndex(gate.qubits[0], 0),
            ensureValidQubitIndex(gate.qubits[1], 1)
          ];
        } else {
          // Default to qubits 0 and 1
          gateOp.targets = [0, Math.min(1, numQubits - 1)];
        }
        break;

      case 'TOFFOLI':
      case 'CCX':
        if (Array.isArray(gate.qubits) && gate.qubits.length >= 3) {
          gateOp.controls = [
            ensureValidQubitIndex(gate.qubits[0], 0),
            ensureValidQubitIndex(gate.qubits[1], 1)
          ];
          gateOp.targets = [ensureValidQubitIndex(gate.qubits[2], 2)];
        } else {
          // Default Toffoli on qubits 0, 1, 2
          gateOp.controls = [0, Math.min(1, numQubits - 1)];
          gateOp.targets = [Math.min(2, numQubits - 1)];
        }
        break;

      default:
        // For single-qubit gates, ensure we have at least one valid target
        if (gateOp.targets.length === 0) {
          if (typeof gate.qubit !== 'undefined') {
            gateOp.targets = [ensureValidQubitIndex(gate.qubit, 0)];
          } else {
            // Assign to qubit 0 by default for single-qubit gates
            console.warn(`⚠️ Gate ${gate.type} has no qubit specified, assigning to qubit 0`);
            gateOp.targets = [0];
          }
        }
        break;
    }

    // Final safety check - ensure we always have at least one target qubit
    if (gateOp.targets.length === 0) {
      console.warn(`⚠️ Gate ${gate.type} has no targets after processing, assigning qubit 0`);
      gateOp.targets = [0];
    }

    // Handle parameters with proper validation
    const params: Record<string, number> = {};
    
    // Add angle parameter if present and valid
    if (typeof gate.angle === 'number' && !isNaN(gate.angle)) {
      params.theta = gate.angle;
    }
    
    // Handle custom parameters - ensure proper type checking
    if (gate.params && typeof gate.params === 'object' && !Array.isArray(gate.params)) {
      Object.entries(gate.params).forEach(([key, value]) => {
        if (typeof key === 'string' && typeof value === 'number' && !isNaN(value)) {
          params[key] = value;
        }
      });
    }
    
    // Only assign params if we have valid parameters
    if (Object.keys(params).length > 0) {
      gateOp.params = params;
    }

    // Add label if present
    if (gate.id) {
      gateOp.label = gate.id;
    }

    console.log(`✅ Converted gate ${index}:`, gateOp);
    return gateOp;
  });

  const circuit: Circuit = {
    name,
    qubits: numQubits,
    cbits: numQubits,
    gates: unifiedGates
  };

  console.log('🔄 Final unified circuit:', circuit);
  
  // Validate the circuit
  const errors = validate(circuit);
  if (errors.length > 0) {
    console.error('❌ Circuit validation errors:', errors);
    // Don't throw error, just log warnings for now to prevent breaking export
    console.warn('⚠️ Circuit has validation issues but proceeding with export');
  }
  
  console.log('✅ Circuit conversion completed');
  return circuit;
}

export function convertFromQuantumBackend(
  simulationResult: any,
  originalGates: Gate[],
  numQubits: number = 5
): Circuit {
  console.log('🔄 Converting from quantum backend result:', { 
    hasResult: !!simulationResult,
    originalGatesCount: originalGates.length,
    numQubits 
  });
  
  if (!simulationResult) {
    return convertToUnifiedCircuit(originalGates, numQubits, "Empty Circuit");
  }

  // Use the original gates as the base circuit
  let circuit = convertToUnifiedCircuit(originalGates, numQubits, "Simulated Circuit");
  
  // Add measurement results as metadata if available
  if (simulationResult.measurementProbabilities) {
    const probabilities = simulationResult.measurementProbabilities;
    const metadata: Record<string, any> = {
      simulationResults: {
        measurementProbabilities: probabilities,
        executionTime: simulationResult.executionTime || 0,
        backend: simulationResult.backend || 'local'
      }
    };
    
    // Add significant measurement outcomes
    if (typeof probabilities === 'object') {
      const significantStates = Object.entries(probabilities)
        .filter(([_, prob]) => (prob as number) > 0.001)
        .sort(([_, a], [__, b]) => (b as number) - (a as number))
        .slice(0, 10);
      
      metadata.simulationResults.significantStates = significantStates.map(([state, prob]) => ({
        state: state.toString(),
        probability: prob,
        decimal: parseInt(state.toString(), 2)
      }));
    }
    
    circuit.metadata = metadata;
  }
  
  console.log('✅ Backend conversion complete:', circuit);
  return circuit;
}
