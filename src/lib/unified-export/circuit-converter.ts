
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

    // Handle targets - ensure we have valid qubit indices
    if (typeof gate.qubit === 'number' && gate.qubit >= 0) {
      gateOp.targets = [gate.qubit];
    } else if (Array.isArray(gate.qubits) && gate.qubits.length > 0) {
      // For multi-qubit gates, use the qubits array
      gateOp.targets = gate.qubits.filter(q => typeof q === 'number' && q >= 0);
    }

    // Handle controls for controlled gates
    if (gate.type === 'CNOT' || gate.type === 'CX') {
      if (Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
        gateOp.controls = [gate.qubits[0]];
        gateOp.targets = [gate.qubits[1]];
      } else if (typeof gate.qubit === 'number') {
        // Fallback - assume control is qubit-1, target is qubit
        gateOp.controls = [Math.max(0, gate.qubit - 1)];
        gateOp.targets = [gate.qubit];
      }
    }

    // Handle other multi-qubit gates
    if (['CZ', 'SWAP', 'BELL'].includes(gate.type)) {
      if (Array.isArray(gate.qubits) && gate.qubits.length >= 2) {
        gateOp.targets = gate.qubits.slice(0, 2);
      }
    }

    if (['TOFFOLI', 'CCX'].includes(gate.type)) {
      if (Array.isArray(gate.qubits) && gate.qubits.length >= 3) {
        gateOp.controls = gate.qubits.slice(0, 2);
        gateOp.targets = [gate.qubits[2]];
      }
    }

    // Ensure we have at least one target
    if (gateOp.targets.length === 0) {
      console.warn(`⚠️ Gate ${gate.type} has no valid targets, assigning qubit 0`);
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
    throw new Error(`Invalid circuit: ${errors.join(', ')}`);
  }
  
  console.log('✅ Circuit validation passed');
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
