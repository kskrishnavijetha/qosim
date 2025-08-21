

export interface GateDefinition {
  name: string;
  type: 'single' | 'control' | 'multi';
  requiredQubits: number;
  hasAngle?: boolean;
  hasParams?: boolean;
  description: string;
}

export interface ValidatedGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[];
  control?: number;
  targets?: number[];
}

export class GateValidationService {
  private static instance: GateValidationService;
  
  // Comprehensive gate map with all supported gates
  private readonly gateMap: Map<string, GateDefinition> = new Map([
    // Single qubit gates
    ['I', { name: 'Identity', type: 'single', requiredQubits: 1, description: 'Identity gate' }],
    ['X', { name: 'Pauli-X', type: 'single', requiredQubits: 1, description: 'NOT gate' }],
    ['Y', { name: 'Pauli-Y', type: 'single', requiredQubits: 1, description: 'Pauli-Y gate' }],
    ['Z', { name: 'Pauli-Z', type: 'single', requiredQubits: 1, description: 'Pauli-Z gate' }],
    ['H', { name: 'Hadamard', type: 'single', requiredQubits: 1, description: 'Superposition gate' }],
    ['S', { name: 'S gate', type: 'single', requiredQubits: 1, description: 'Phase gate' }],
    ['SDG', { name: 'S dagger', type: 'single', requiredQubits: 1, description: 'S gate dagger' }],
    ['T', { name: 'T gate', type: 'single', requiredQubits: 1, description: 'π/8 gate' }],
    ['TDG', { name: 'T dagger', type: 'single', requiredQubits: 1, description: 'T gate dagger' }],
    
    // Rotation gates
    ['RX', { name: 'Rotation X', type: 'single', requiredQubits: 1, hasAngle: true, description: 'X-axis rotation' }],
    ['RY', { name: 'Rotation Y', type: 'single', requiredQubits: 1, hasAngle: true, description: 'Y-axis rotation' }],
    ['RZ', { name: 'Rotation Z', type: 'single', requiredQubits: 1, hasAngle: true, description: 'Z-axis rotation' }],
    ['U1', { name: 'U1 gate', type: 'single', requiredQubits: 1, hasAngle: true, description: 'Phase rotation' }],
    ['U2', { name: 'U2 gate', type: 'single', requiredQubits: 1, hasParams: true, description: 'Two-parameter gate' }],
    ['U3', { name: 'U3 gate', type: 'single', requiredQubits: 1, hasParams: true, description: 'Three-parameter gate' }],
    
    // Control gates
    ['CNOT', { name: 'CNOT', type: 'control', requiredQubits: 2, description: 'Controlled NOT' }],
    ['CX', { name: 'Controlled X', type: 'control', requiredQubits: 2, description: 'Controlled NOT' }],
    ['CZ', { name: 'Controlled Z', type: 'control', requiredQubits: 2, description: 'Controlled Z' }],
    ['CY', { name: 'Controlled Y', type: 'control', requiredQubits: 2, description: 'Controlled Y' }],
    ['CH', { name: 'Controlled H', type: 'control', requiredQubits: 2, description: 'Controlled Hadamard' }],
    
    // Multi-qubit gates
    ['SWAP', { name: 'SWAP', type: 'multi', requiredQubits: 2, description: 'Swap gate' }],
    ['CCX', { name: 'Toffoli', type: 'multi', requiredQubits: 3, description: 'Controlled-controlled X' }],
    ['TOFFOLI', { name: 'Toffoli', type: 'multi', requiredQubits: 3, description: 'Controlled-controlled X' }],
    ['FREDKIN', { name: 'Fredkin', type: 'multi', requiredQubits: 3, description: 'Controlled SWAP' }],
    ['CSWAP', { name: 'Controlled SWAP', type: 'multi', requiredQubits: 3, description: 'Controlled SWAP' }],
    
    // Measurement and reset
    ['MEASURE', { name: 'Measure', type: 'single', requiredQubits: 1, description: 'Measurement' }],
    ['M', { name: 'Measure', type: 'single', requiredQubits: 1, description: 'Measurement' }],
    ['RESET', { name: 'Reset', type: 'single', requiredQubits: 1, description: 'Reset to |0⟩' }]
  ]);

  static getInstance(): GateValidationService {
    if (!GateValidationService.instance) {
      GateValidationService.instance = new GateValidationService();
    }
    return GateValidationService.instance;
  }

  validateGate(gateType: string, qubits?: number | number[], maxQubits: number = 5): { isValid: boolean; error?: string; suggestion?: string } {
    console.log('🔍 Validating gate:', { gateType, qubits, maxQubits });

    // Check if gate exists in map
    if (!this.gateMap.has(gateType)) {
      console.error('❌ Unknown gate type:', gateType);
      return {
        isValid: false,
        error: `Unknown gate: ${gateType}`,
        suggestion: `Available gates: ${Array.from(this.gateMap.keys()).join(', ')}`
      };
    }

    const gateDefinition = this.gateMap.get(gateType)!;
    
    // Validate qubit indices
    const qubitArray = Array.isArray(qubits) ? qubits : (qubits !== undefined ? [qubits] : []);
    
    for (const qubit of qubitArray) {
      if (qubit === undefined || qubit === null || isNaN(qubit)) {
        console.error('❌ Invalid qubit value:', qubit);
        return {
          isValid: false,
          error: 'Invalid qubit index',
          suggestion: 'Qubit indices must be valid numbers'
        };
      }

      if (qubit < 0 || qubit >= maxQubits) {
        console.error('❌ Qubit index out of range:', qubit);
        return {
          isValid: false,
          error: `Invalid qubit index: ${qubit}`,
          suggestion: `Qubit indices must be between 0 and ${maxQubits - 1}`
        };
      }
    }

    // Validate required number of qubits
    if (qubitArray.length !== gateDefinition.requiredQubits) {
      console.error('❌ Wrong number of qubits:', { required: gateDefinition.requiredQubits, provided: qubitArray.length });
      return {
        isValid: false,
        error: `${gateDefinition.name} requires exactly ${gateDefinition.requiredQubits} qubit(s)`,
        suggestion: `Provide ${gateDefinition.requiredQubits} valid qubit indices`
      };
    }

    // Check for duplicate qubits in multi-qubit gates
    if (gateDefinition.requiredQubits > 1) {
      const uniqueQubits = new Set(qubitArray);
      if (uniqueQubits.size !== qubitArray.length) {
        console.error('❌ Duplicate qubits in multi-qubit gate:', qubitArray);
        return {
          isValid: false,
          error: 'All qubits must be different',
          suggestion: 'Use different qubit indices for each target'
        };
      }
    }

    console.log('✅ Gate validation passed:', gateType);
    return { isValid: true };
  }

  normalizeGate(gateInput: any): ValidatedGate | null {
    console.log('🔧 Normalizing gate input:', gateInput);

    if (!gateInput || typeof gateInput !== 'object') {
      console.error('❌ Invalid gate input:', gateInput);
      return null;
    }

    // Ensure required properties exist
    const gate: ValidatedGate = {
      id: gateInput.id || `gate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: gateInput.type || gateInput.gate || 'I',
      position: Math.max(0, Number(gateInput.position) || 0)
    };

    // Validate gate type
    const validation = this.validateGate(gate.type, undefined, 5);
    if (!validation.isValid) {
      console.error('❌ Gate normalization failed:', validation.error);
      return null;
    }

    const gateDefinition = this.gateMap.get(gate.type)!;

    // Handle qubit assignments based on gate type
    if (gateDefinition.type === 'single') {
      // Single qubit gates
      const qubit = gateInput.qubit ?? gateInput.target ?? gateInput.targets?.[0] ?? 0;
      const qubitValidation = this.validateGate(gate.type, Number(qubit), 5);
      
      if (!qubitValidation.isValid) {
        console.error('❌ Single qubit validation failed:', qubitValidation.error);
        return null;
      }
      
      gate.qubit = Number(qubit);
      gate.targets = [gate.qubit];

    } else if (gateDefinition.type === 'control') {
      // Control gates (CNOT, CZ, etc.)
      let control: number, target: number;
      
      if (gateInput.qubits && Array.isArray(gateInput.qubits) && gateInput.qubits.length === 2) {
        [control, target] = gateInput.qubits;
      } else if (gateInput.control !== undefined && gateInput.target !== undefined) {
        control = gateInput.control;
        target = gateInput.target;
      } else if (gateInput.targets && Array.isArray(gateInput.targets) && gateInput.targets.length === 2) {
        [control, target] = gateInput.targets;
      } else {
        console.error('❌ Control gate missing proper qubit assignment');
        return null;
      }

      const qubitValidation = this.validateGate(gate.type, [Number(control), Number(target)], 5);
      if (!qubitValidation.isValid) {
        console.error('❌ Control gate validation failed:', qubitValidation.error);
        return null;
      }

      gate.qubits = [Number(control), Number(target)];
      gate.control = Number(control);
      gate.targets = [Number(target)];

    } else if (gateDefinition.type === 'multi') {
      // Multi-qubit gates
      const qubits = gateInput.qubits || gateInput.targets || [];
      
      if (!Array.isArray(qubits) || qubits.length !== gateDefinition.requiredQubits) {
        console.error('❌ Multi-qubit gate missing proper qubit assignment');
        return null;
      }

      const qubitValidation = this.validateGate(gate.type, qubits.map(q => Number(q)), 5);
      if (!qubitValidation.isValid) {
        console.error('❌ Multi-qubit gate validation failed:', qubitValidation.error);
        return null;
      }

      gate.qubits = qubits.map(q => Number(q));
      gate.targets = gate.qubits;
    }

    // Handle angle and parameters
    if (gateDefinition.hasAngle && gateInput.angle !== undefined) {
      gate.angle = parseFloat(gateInput.angle) || 0;
    }

    if (gateDefinition.hasParams && gateInput.params && Array.isArray(gateInput.params)) {
      gate.params = gateInput.params.map(p => parseFloat(p) || 0);
    }

    console.log('✅ Gate normalized successfully:', gate);
    return gate;
  }

  serializeCircuit(circuit: any[]): string {
    console.log('📦 Serializing circuit:', circuit);
    
    const serializedGates = circuit.map(gate => {
      const normalized = this.normalizeGate(gate);
      if (!normalized) {
        console.error('❌ Failed to normalize gate during serialization:', gate);
        return null;
      }

      const serialized: any = {
        gate: normalized.type,
        position: normalized.position
      };

      if (normalized.control !== undefined) {
        serialized.control = normalized.control;
      }

      if (normalized.targets && normalized.targets.length > 0) {
        serialized.targets = normalized.targets;
      }

      if (normalized.angle !== undefined) {
        serialized.angle = normalized.angle;
      }

      if (normalized.params && normalized.params.length > 0) {
        serialized.params = normalized.params;
      }

      return serialized;
    }).filter(Boolean);

    const serialized = JSON.stringify(serializedGates, null, 2);
    console.log('✅ Circuit serialized:', serialized);
    return serialized;
  }

  getAvailableGates(): string[] {
    return Array.from(this.gateMap.keys());
  }

  getGateDefinition(gateType: string): GateDefinition | undefined {
    return this.gateMap.get(gateType);
  }
}

export const gateValidationService = GateValidationService.getInstance();
