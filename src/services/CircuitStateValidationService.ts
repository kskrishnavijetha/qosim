
import { gateValidationService, type ValidatedGate } from './GateValidationService';

export interface CircuitState {
  id: string;
  name: string;
  gates: ValidatedGate[];
  qubits: number;
  created: number;
  modified: number;
}

export class CircuitStateValidationService {
  private static instance: CircuitStateValidationService;

  static getInstance(): CircuitStateValidationService {
    if (!CircuitStateValidationService.instance) {
      CircuitStateValidationService.instance = new CircuitStateValidationService();
    }
    return CircuitStateValidationService.instance;
  }

  createDefaultCircuitState(name?: string): CircuitState {
    const defaultState: CircuitState = {
      id: `circuit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name || 'New Circuit',
      gates: [],
      qubits: 5,
      created: Date.now(),
      modified: Date.now()
    };

    console.log('🏗️ Created default circuit state:', defaultState);
    return defaultState;
  }

  validateCircuitState(state: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    console.log('🔍 Validating circuit state:', state);
    
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check basic structure
    if (!state || typeof state !== 'object') {
      errors.push('Circuit state must be a valid object');
      return { isValid: false, errors, warnings };
    }

    // Validate required properties
    if (!state.id || typeof state.id !== 'string') {
      errors.push('Circuit state missing valid ID');
    }

    if (!state.name || typeof state.name !== 'string') {
      warnings.push('Circuit state missing name, using default');
    }

    if (typeof state.qubits !== 'number' || state.qubits < 1 || state.qubits > 10) {
      errors.push('Circuit state must have between 1 and 10 qubits');
    }

    // Validate gates array
    if (!Array.isArray(state.gates)) {
      errors.push('Circuit gates must be an array');
    } else {
      // Validate each gate
      state.gates.forEach((gate: any, index: number) => {
        const validation = gateValidationService.validateGate(
          gate.type || gate.gate,
          gate.qubits || gate.qubit,
          state.qubits
        );

        if (!validation.isValid) {
          errors.push(`Gate ${index + 1}: ${validation.error}`);
        }
      });
    }

    const isValid = errors.length === 0;
    console.log(`${isValid ? '✅' : '❌'} Circuit state validation:`, { isValid, errors, warnings });
    
    return { isValid, errors, warnings };
  }

  normalizeCircuitState(input: any): CircuitState | null {
    console.log('🔧 Normalizing circuit state:', input);

    // Start with default state
    const defaultState = this.createDefaultCircuitState();
    
    if (!input || typeof input !== 'object') {
      console.warn('⚠️ Invalid input, returning default state');
      return defaultState;
    }

    // Merge with input, validating each property
    const normalized: CircuitState = {
      id: input.id || defaultState.id,
      name: input.name || defaultState.name,
      qubits: Math.max(1, Math.min(10, parseInt(input.qubits) || 5)),
      gates: [],
      created: parseInt(input.created) || defaultState.created,
      modified: Date.now()
    };

    // Normalize gates
    if (Array.isArray(input.gates)) {
      normalized.gates = input.gates
        .map((gate: any) => gateValidationService.normalizeGate(gate))
        .filter((gate: ValidatedGate | null): gate is ValidatedGate => gate !== null);
    }

    console.log('✅ Circuit state normalized:', normalized);
    return normalized;
  }

  addGateToCircuit(circuit: CircuitState, gateInput: any): { success: boolean; error?: string; updatedCircuit?: CircuitState } {
    console.log('➕ Adding gate to circuit:', { circuit: circuit.id, gate: gateInput });

    // Validate and normalize the gate
    const normalizedGate = gateValidationService.normalizeGate(gateInput);
    
    if (!normalizedGate) {
      const error = 'Failed to add gate: Invalid gate configuration';
      console.error('❌', error);
      return { success: false, error };
    }

    // Validate against circuit constraints
    const validation = gateValidationService.validateGate(
      normalizedGate.type,
      normalizedGate.qubits || normalizedGate.qubit,
      circuit.qubits
    );

    if (!validation.isValid) {
      console.error('❌ Gate validation failed:', validation.error);
      return { success: false, error: validation.error };
    }

    // Create updated circuit
    const updatedCircuit: CircuitState = {
      ...circuit,
      gates: [...circuit.gates, normalizedGate],
      modified: Date.now()
    };

    console.log('✅ Gate added successfully to circuit');
    return { success: true, updatedCircuit };
  }

  removeGateFromCircuit(circuit: CircuitState, gateId: string): { success: boolean; error?: string; updatedCircuit?: CircuitState } {
    console.log('➖ Removing gate from circuit:', { circuit: circuit.id, gateId });

    const gateIndex = circuit.gates.findIndex(gate => gate.id === gateId);
    
    if (gateIndex === -1) {
      const error = `Gate with ID ${gateId} not found in circuit`;
      console.error('❌', error);
      return { success: false, error };
    }

    const updatedCircuit: CircuitState = {
      ...circuit,
      gates: circuit.gates.filter(gate => gate.id !== gateId),
      modified: Date.now()
    };

    console.log('✅ Gate removed successfully from circuit');
    return { success: true, updatedCircuit };
  }
}

export const circuitStateValidationService = CircuitStateValidationService.getInstance();
