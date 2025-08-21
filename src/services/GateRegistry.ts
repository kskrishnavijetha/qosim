
export interface GateMatrix {
  name: string;
  matrix: number[][];
  description: string;
  qubits: number;
  symbol?: string;
}

export interface GateRegistryMap {
  [key: string]: GateMatrix;
}

export class GateRegistry {
  private static instance: GateRegistry;
  private registry: GateRegistryMap = {};

  static getInstance(): GateRegistry {
    if (!GateRegistry.instance) {
      GateRegistry.instance = new GateRegistry();
    }
    return GateRegistry.instance;
  }

  constructor() {
    this.initializeDefaultGates();
  }

  private initializeDefaultGates() {
    console.log('🔧 Initializing comprehensive gate registry...');
    
    // Single qubit gates
    this.registry.I = {
      name: "Identity",
      matrix: [[1, 0], [0, 1]],
      description: "Identity gate - no operation",
      qubits: 1,
      symbol: "I"
    };

    this.registry.H = {
      name: "Hadamard",
      matrix: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
      description: "Creates superposition",
      qubits: 1,
      symbol: "H"
    };

    this.registry.X = {
      name: "Pauli-X",
      matrix: [[0, 1], [1, 0]],
      description: "NOT gate - bit flip",
      qubits: 1,
      symbol: "X"
    };

    this.registry.Y = {
      name: "Pauli-Y",
      matrix: [[0, -1], [1, 0]],
      description: "Pauli-Y gate",
      qubits: 1,
      symbol: "Y"
    };

    this.registry.Z = {
      name: "Pauli-Z",
      matrix: [[1, 0], [0, -1]],
      description: "Phase flip gate",
      qubits: 1,
      symbol: "Z"
    };

    this.registry.S = {
      name: "S Gate",
      matrix: [[1, 0], [0, 1]],
      description: "Phase gate (π/2)",
      qubits: 1,
      symbol: "S"
    };

    this.registry.T = {
      name: "T Gate",
      matrix: [[1, 0], [0, Math.cos(Math.PI/4) + Math.sin(Math.PI/4)]],
      description: "T gate (π/8)",
      qubits: 1,
      symbol: "T"
    };

    // Rotation gates
    this.registry.RX = {
      name: "Rotation X",
      matrix: [[1, 0], [0, 1]], // Placeholder - actual matrix depends on angle
      description: "X-axis rotation",
      qubits: 1,
      symbol: "RX"
    };

    this.registry.RY = {
      name: "Rotation Y", 
      matrix: [[1, 0], [0, 1]], // Placeholder - actual matrix depends on angle
      description: "Y-axis rotation",
      qubits: 1,
      symbol: "RY"
    };

    this.registry.RZ = {
      name: "Rotation Z",
      matrix: [[1, 0], [0, 1]], // Placeholder - actual matrix depends on angle
      description: "Z-axis rotation", 
      qubits: 1,
      symbol: "RZ"
    };

    // Two qubit gates
    this.registry.CNOT = {
      name: "CNOT",
      matrix: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]],
      description: "Controlled NOT gate",
      qubits: 2,
      symbol: "⊕"
    };

    this.registry.CX = {
      name: "Controlled-X",
      matrix: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]],
      description: "Controlled X gate",
      qubits: 2,
      symbol: "CX"
    };

    this.registry.CZ = {
      name: "Controlled-Z",
      matrix: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]],
      description: "Controlled Z gate",
      qubits: 2,
      symbol: "CZ"
    };

    this.registry.SWAP = {
      name: "SWAP",
      matrix: [[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]],
      description: "Swap gate",
      qubits: 2,
      symbol: "⤬"
    };

    // Three qubit gates
    this.registry.CCX = {
      name: "Toffoli",
      matrix: [[1,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1],[0,0,0,0,0,0,1,0]],
      description: "Controlled-controlled X",
      qubits: 3,
      symbol: "CCX"
    };

    this.registry.TOFFOLI = {
      name: "Toffoli",
      matrix: [[1,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0],[0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1],[0,0,0,0,0,0,1,0]],
      description: "Controlled-controlled X",
      qubits: 3,
      symbol: "TOF"
    };

    // Measurement
    this.registry.M = {
      name: "Measure",
      matrix: [[1, 0], [0, 1]], // Identity for measurement
      description: "Measurement operation",
      qubits: 1,
      symbol: "M"
    };

    this.registry.MEASURE = {
      name: "Measure",
      matrix: [[1, 0], [0, 1]],
      description: "Measurement operation",
      qubits: 1,
      symbol: "📏"
    };

    console.log('✅ Comprehensive gate registry initialized with', Object.keys(this.registry).length, 'gates');
  }

  getGate(gateType: string): GateMatrix | null {
    if (!gateType || typeof gateType !== 'string') {
      console.error(`❌ Invalid gate type: ${gateType}`);
      return null;
    }

    const gate = this.registry[gateType.toUpperCase()];
    if (!gate) {
      console.error(`❌ Undefined gate: ${gateType}`);
      console.log('📋 Available gates:', Object.keys(this.registry).join(', '));
      return null;
    }
    return gate;
  }

  isValidGate(gateType: string): boolean {
    if (!gateType || typeof gateType !== 'string') {
      return false;
    }
    return gateType.toUpperCase() in this.registry;
  }

  getAllGates(): GateRegistryMap {
    return { ...this.registry };
  }

  getAvailableGateTypes(): string[] {
    return Object.keys(this.registry);
  }

  registerCustomGate(type: string, gate: GateMatrix): void {
    if (!type || !gate) {
      console.error('❌ Invalid gate registration parameters');
      return;
    }
    console.log(`🔧 Registering custom gate: ${type}`);
    this.registry[type.toUpperCase()] = gate;
  }

  validateGateExists(gateType: string): { isValid: boolean; error?: string } {
    if (!gateType || typeof gateType !== 'string') {
      return {
        isValid: false,
        error: 'Gate type must be a non-empty string'
      };
    }

    if (!this.isValidGate(gateType)) {
      return {
        isValid: false,
        error: `Unknown gate: ${gateType}. Available gates: ${this.getAvailableGateTypes().join(', ')}`
      };
    }
    return { isValid: true };
  }
}

// Export singleton instance
export const gateRegistry = GateRegistry.getInstance();
