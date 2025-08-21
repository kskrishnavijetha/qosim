
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

    // Helper function to validate qubit index
    const validateQubitIndex = (qubit: any): number => {
      if (typeof qubit === 'number' && !isNaN(qubit) && qubit >= 0 && qubit < numQubits) {
        return qubit;
      }
      console.warn(`⚠️ Invalid qubit index ${qubit}, defaulting to 0`);
      return 0; // Default to qubit 0 if invalid
    };

    // Handle single-qubit gates
    if (typeof gate.qubit === 'number') {
      gateOp.targets = [validateQubitIndex(gate.qubit)];
    }

    // Handle multi-qubit gates with qubits array
    if (Array.isArray(gate.qubits) && gate.qubits.length > 0) {
      const validQubits = gate.qubits
        .filter(q => typeof q === 'number' && !isNaN(q))
        .map(q => validateQubitIndex(q));
      
      if (validQubits.length > 0) {
        gateOp.targets = validQubits;
      }
    }

    // Special handling for specific gate types
    switch (gate.type) {
      case 'CNOT':
      case 'CX':
        if (Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
          gateOp.controls = [validateQubitIndex(gate.qubits[0])];
          gateOp.targets = [validateQubitIndex(gate.qubits[1])];
        } else if (typeof gate.qubit === 'number') {
          // Fallback - control is previous qubit, target is specified qubit
          const targetQubit = validateQubitIndex(gate.qubit);
          const controlQubit = validateQubitIndex(Math.max(0, targetQubit - 1));
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
            validateQubitIndex(gate.qubits[0]),
            validateQubitIndex(gate.qubits[1])
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
            validateQubitIndex(gate.qubits[0]),
            validateQubitIndex(gate.qubits[1])
          ];
          gateOp.targets = [validateQubitIndex(gate.qubits[2])];
        } else {
          // Default Toffoli on qubits 0, 1, 2
          gateOp.controls = [0, Math.min(1, numQubits - 1)];
          gateOp.targets = [Math.min(2, numQubits - 1)];
        }
        break;

      default:
        // For single-qubit gates, ensure we have at least one target
        if (gateOp.targets.length === 0) {
          if (typeof gate.qubit === 'number') {
            gateOp.targets = [validateQubitIndex(gate.qubit)];
          } else {
            console.warn(`⚠️ Gate ${gate.type} has no valid targets, assigning qubit 0`);
            gateOp.targets = [0];
          }
        }
        break;
    }

    // Ensure we always have at least one target qubit
    if (gateOp.targets.length === 0) {
      console.warn(`⚠️ Gate ${gate.type} has no targets after processing, assigning qubit 0`);
      gateOp.targets = [0];
    }

    // Handle parameters with proper validation
    const params: Record<string, number> = {};
    
    // Add angle parameter if present
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
