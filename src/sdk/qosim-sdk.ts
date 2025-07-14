/**
 * QOSim JavaScript SDK
 * A comprehensive SDK for creating, simulating, and managing quantum circuits
 */

import { supabase } from "@/integrations/supabase/client";

// Core types for the SDK
export interface QuantumGate {
  type: string;
  qubit: number;
  controlQubit?: number;
  angle?: number;
  parameters?: Record<string, any>;
}

export interface QuantumCircuit {
  id?: string;
  name: string;
  description?: string;
  gates: QuantumGate[];
  qubits: number;
  metadata?: Record<string, any>;
}

export interface SimulationResult {
  stateVector: Array<{ real: number; imaginary: number }>;
  probabilities: number[];
  basisStates: string[];
  measurements?: Record<string, number>;
  executionTime: number;
  circuitDepth: number;
}

export interface SDKConfig {
  autoSave?: boolean;
  defaultQubits?: number;
  simulationMode?: 'local' | 'cloud';
  maxQubits?: number;
}

/**
 * Main QOSim SDK class
 */
export class QOSimSDK {
  private config: SDKConfig;
  private isInitialized = false;
  private simulator: any = null;

  constructor(config: SDKConfig = {}) {
    this.config = {
      autoSave: false,
      defaultQubits: 3,
      simulationMode: 'local',
      maxQubits: 20,
      ...config
    };
  }

  /**
   * Initialize the SDK and load QOSim core
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load QOSim core if not already loaded
      if (!window.QOSimSimulator) {
        await this.loadQOSimCore();
      }
      
      this.simulator = new window.QOSimSimulator();
      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize QOSim SDK: ${error}`);
    }
  }

  private async loadQOSimCore(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.QOSimSimulator) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = '/qosim-core.js';
      script.onload = () => {
        // Wait a bit for the module to initialize
        setTimeout(() => {
          if (window.QOSimSimulator) {
            resolve();
          } else {
            reject(new Error('QOSim core failed to load properly'));
          }
        }, 100);
      };
      script.onerror = () => reject(new Error('Failed to load QOSim core'));
      document.head.appendChild(script);
    });
  }

  /**
   * Create a new quantum circuit
   */
  createCircuit(name: string, qubits?: number, description?: string): QuantumCircuit {
    return {
      name,
      description,
      gates: [],
      qubits: qubits || this.config.defaultQubits || 3,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }

  /**
   * Add a gate to a circuit
   */
  addGate(circuit: QuantumCircuit, gate: QuantumGate): QuantumCircuit {
    // Validate gate
    this.validateGate(gate, circuit.qubits);
    
    return {
      ...circuit,
      gates: [...circuit.gates, gate],
      metadata: {
        ...circuit.metadata,
        lastModified: new Date().toISOString()
      }
    };
  }

  /**
   * Validate a quantum gate
   */
  private validateGate(gate: QuantumGate, numQubits: number): void {
    if (gate.qubit < 0 || gate.qubit >= numQubits) {
      throw new Error(`Invalid qubit index: ${gate.qubit}. Must be between 0 and ${numQubits - 1}`);
    }

    if (gate.controlQubit !== undefined && (gate.controlQubit < 0 || gate.controlQubit >= numQubits)) {
      throw new Error(`Invalid control qubit index: ${gate.controlQubit}. Must be between 0 and ${numQubits - 1}`);
    }

    if (gate.controlQubit === gate.qubit) {
      throw new Error('Control qubit cannot be the same as target qubit');
    }
  }

  /**
   * Simulate a quantum circuit
   */
  async simulate(circuit: QuantumCircuit): Promise<SimulationResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = performance.now();

    try {
      // Reset simulator
      this.simulator.reset(circuit.qubits);

      // Apply gates in sequence
      for (const gate of circuit.gates) {
        await this.applyGate(gate);
      }

      // Get results
      const stateVector = this.simulator.getStateVector();
      const probabilities = this.simulator.getProbabilities();
      const basisStates = this.generateBasisStates(circuit.qubits);

      const executionTime = performance.now() - startTime;

      return {
        stateVector,
        probabilities,
        basisStates,
        executionTime,
        circuitDepth: this.calculateCircuitDepth(circuit)
      };
    } catch (error) {
      throw new Error(`Simulation failed: ${error}`);
    }
  }

  /**
   * Apply a single gate to the simulator
   */
  private async applyGate(gate: QuantumGate): Promise<void> {
    switch (gate.type.toLowerCase()) {
      case 'h':
      case 'hadamard':
        this.simulator.applyHadamard(gate.qubit);
        break;
      case 'x':
      case 'pauli-x':
        this.simulator.applyPauliX(gate.qubit);
        break;
      case 'y':
      case 'pauli-y':
        this.simulator.applyPauliY(gate.qubit);
        break;
      case 'z':
      case 'pauli-z':
        this.simulator.applyPauliZ(gate.qubit);
        break;
      case 'cnot':
      case 'cx':
        if (gate.controlQubit === undefined) {
          throw new Error('CNOT gate requires control qubit');
        }
        this.simulator.applyCNOT(gate.controlQubit, gate.qubit);
        break;
      case 'rx':
        this.simulator.applyRotationX(gate.qubit, gate.angle || 0);
        break;
      case 'ry':
        this.simulator.applyRotationY(gate.qubit, gate.angle || 0);
        break;
      case 'rz':
        this.simulator.applyRotationZ(gate.qubit, gate.angle || 0);
        break;
      default:
        throw new Error(`Unsupported gate type: ${gate.type}`);
    }
  }

  /**
   * Generate basis states for given number of qubits
   */
  private generateBasisStates(qubits: number): string[] {
    const states: string[] = [];
    const numStates = Math.pow(2, qubits);
    
    for (let i = 0; i < numStates; i++) {
      states.push(i.toString(2).padStart(qubits, '0'));
    }
    
    return states;
  }

  /**
   * Calculate circuit depth
   */
  private calculateCircuitDepth(circuit: QuantumCircuit): number {
    // Simple depth calculation - can be enhanced
    return circuit.gates.length;
  }

  /**
   * Save circuit to database
   */
  async saveCircuit(circuit: QuantumCircuit): Promise<string> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required to save circuits');
      }

      const { data, error } = await supabase
        .from('circuits')
        .insert({
          name: circuit.name,
          description: circuit.description || '',
          user_id: user.id,
          circuit_data: {
            gates: circuit.gates,
            qubits: circuit.qubits,
            metadata: circuit.metadata
          } as any
        })
        .select('id')
        .single();

      if (error) throw error;
      
      return data.id;
    } catch (error) {
      throw new Error(`Failed to save circuit: ${error}`);
    }
  }

  /**
   * Load circuit from database
   */
  async loadCircuit(circuitId: string): Promise<QuantumCircuit> {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('id', circuitId)
        .single();

      if (error) throw error;

      const circuitData = data.circuit_data as any;
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        gates: circuitData.gates,
        qubits: circuitData.qubits,
        metadata: circuitData.metadata
      };
    } catch (error) {
      throw new Error(`Failed to load circuit: ${error}`);
    }
  }

  /**
   * List user's circuits
   */
  async listCircuits(): Promise<QuantumCircuit[]> {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(circuit => {
        const circuitData = circuit.circuit_data as any;
        return {
          id: circuit.id,
          name: circuit.name,
          description: circuit.description,
          gates: circuitData.gates,
          qubits: circuitData.qubits,
          metadata: circuitData.metadata
        };
      });
    } catch (error) {
      throw new Error(`Failed to list circuits: ${error}`);
    }
  }

  /**
   * Export circuit to various formats
   */
  exportCircuit(circuit: QuantumCircuit, format: 'json' | 'qasm' | 'python'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(circuit, null, 2);
      case 'qasm':
        return this.toQASM(circuit);
      case 'python':
        return this.toPython(circuit);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private toQASM(circuit: QuantumCircuit): string {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\n`;
    qasm += `qreg q[${circuit.qubits}];\ncreg c[${circuit.qubits}];\n\n`;

    for (const gate of circuit.gates) {
      switch (gate.type.toLowerCase()) {
        case 'h':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'x':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'y':
          qasm += `y q[${gate.qubit}];\n`;
          break;
        case 'z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'cnot':
          qasm += `cx q[${gate.controlQubit}],q[${gate.qubit}];\n`;
          break;
        case 'rx':
          qasm += `rx(${gate.angle}) q[${gate.qubit}];\n`;
          break;
        case 'ry':
          qasm += `ry(${gate.angle}) q[${gate.qubit}];\n`;
          break;
        case 'rz':
          qasm += `rz(${gate.angle}) q[${gate.qubit}];\n`;
          break;
      }
    }

    qasm += `\nmeasure q -> c;\n`;
    return qasm;
  }

  private toPython(circuit: QuantumCircuit): string {
    let python = `from qosim import QOSimSDK\n\n`;
    python += `# Create SDK instance\nsdk = QOSimSDK()\n`;
    python += `await sdk.initialize()\n\n`;
    python += `# Create circuit\n`;
    python += `circuit = sdk.createCircuit("${circuit.name}", ${circuit.qubits})\n\n`;

    for (const gate of circuit.gates) {
      switch (gate.type.toLowerCase()) {
        case 'h':
          python += `circuit = sdk.addGate(circuit, {'type': 'h', 'qubit': ${gate.qubit}})\n`;
          break;
        case 'x':
          python += `circuit = sdk.addGate(circuit, {'type': 'x', 'qubit': ${gate.qubit}})\n`;
          break;
        case 'cnot':
          python += `circuit = sdk.addGate(circuit, {'type': 'cnot', 'controlQubit': ${gate.controlQubit}, 'qubit': ${gate.qubit}})\n`;
          break;
        default:
          python += `circuit = sdk.addGate(circuit, ${JSON.stringify(gate)})\n`;
      }
    }

    python += `\n# Simulate circuit\nresult = await sdk.simulate(circuit)\nconsole.log(result)\n`;
    return python;
  }
}

// Helper functions for common circuit patterns
export class CircuitBuilder {
  private sdk: QOSimSDK;

  constructor(sdk: QOSimSDK) {
    this.sdk = sdk;
  }

  /**
   * Create a Bell state circuit
   */
  bellState(name = "Bell State"): QuantumCircuit {
    const circuit = this.sdk.createCircuit(name, 2, "Creates a Bell state (maximally entangled state)");
    let result = this.sdk.addGate(circuit, { type: 'h', qubit: 0 });
    result = this.sdk.addGate(result, { type: 'cnot', controlQubit: 0, qubit: 1 });
    return result;
  }

  /**
   * Create a GHZ state circuit
   */
  ghzState(qubits = 3, name = "GHZ State"): QuantumCircuit {
    const circuit = this.sdk.createCircuit(name, qubits, `Creates a ${qubits}-qubit GHZ state`);
    let result = this.sdk.addGate(circuit, { type: 'h', qubit: 0 });
    
    for (let i = 1; i < qubits; i++) {
      result = this.sdk.addGate(result, { type: 'cnot', controlQubit: 0, qubit: i });
    }
    
    return result;
  }

  /**
   * Create a quantum random number generator
   */
  randomGenerator(qubits = 3, name = "Random Generator"): QuantumCircuit {
    const circuit = this.sdk.createCircuit(name, qubits, "Generates random bits using quantum superposition");
    let result = circuit;
    
    for (let i = 0; i < qubits; i++) {
      result = this.sdk.addGate(result, { type: 'h', qubit: i });
    }
    
    return result;
  }
}

// Export a default instance for convenience
export const qosim = new QOSimSDK();
export const circuitBuilder = new CircuitBuilder(qosim);