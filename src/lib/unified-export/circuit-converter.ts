
import { Circuit as UnifiedCircuit, GateOp } from './types';
import { Gate } from '@/hooks/useCircuitState';

// Convert from existing QOSim circuit format to unified format
export function convertToUnifiedCircuit(
  gates: Gate[], 
  numQubits: number, 
  name: string = "Quantum Circuit"
): UnifiedCircuit {
  const unifiedGates: GateOp[] = gates.map(gate => {
    const gateOp: GateOp = {
      type: gate.type,
      targets: [],
      layer: gate.position
    };

    // Handle single-qubit gates
    if (gate.qubit !== undefined) {
      gateOp.targets = [gate.qubit];
    }

    // Handle multi-qubit gates
    if (gate.qubits && gate.qubits.length > 0) {
      const qubits = gate.qubits.map(q => typeof q === 'string' ? parseInt(q) : q);
      
      switch (gate.type.toUpperCase()) {
        case 'CNOT':
        case 'CX':
        case 'CY':
        case 'CZ':
        case 'CP':
          gateOp.controls = [qubits[0]];
          gateOp.targets = [qubits[1]];
          break;
        case 'CCX':
        case 'TOFFOLI':
          gateOp.controls = [qubits[0], qubits[1]];
          gateOp.targets = [qubits[2]];
          break;
        case 'CSWAP':
        case 'FREDKIN':
          gateOp.controls = [qubits[0]];
          gateOp.targets = [qubits[1], qubits[2]];
          break;
        case 'SWAP':
          gateOp.targets = qubits;
          break;
        default:
          gateOp.targets = qubits;
      }
    }

    // Handle rotation parameters
    if (gate.angle !== undefined) {
      gateOp.params = { theta: gate.angle };
    }

    // Handle custom parameters
    if (gate.params) {
      gateOp.params = { ...gateOp.params, ...gate.params };
    }

    return gateOp;
  });

  return {
    name,
    qubits: numQubits,
    gates: unifiedGates,
    metadata: {
      generatedBy: 'QOSim',
      timestamp: new Date().toISOString()
    }
  };
}
