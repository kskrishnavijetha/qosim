
/**
 * Bell State Generator SDK Module
 * Creates maximally entangled two-qubit states
 */

import { QOSimSDK, QuantumCircuit } from '../qosim-sdk';

export type BellStateType = 'phi+' | 'phi-' | 'psi+' | 'psi-';

export interface BellStateConfig {
  type: BellStateType;
  qubits?: [number, number]; // Which qubits to use
}

export interface BellStateResult {
  circuit: QuantumCircuit;
  type: BellStateType;
  description: string;
  qubits: [number, number];
  expectedEntanglement: number;
}

export class BellStateGenerator {
  private sdk: QOSimSDK;

  constructor(sdk: QOSimSDK) {
    this.sdk = sdk;
  }

  /**
   * Create Bell state circuit
   */
  async createBellState(config: BellStateConfig): Promise<BellStateResult> {
    const { type, qubits = [0, 1] } = config;
    const [qubit1, qubit2] = qubits;
    
    let circuit = this.sdk.createCircuit(
      `Bell State |Φ${type.charAt(3)}⟩`,
      Math.max(qubit1, qubit2) + 1,
      this.getBellStateDescription(type)
    );

    // Create the specific Bell state
    switch (type) {
      case 'phi+': // |Φ+⟩ = (|00⟩ + |11⟩)/√2
        circuit = this.sdk.addGate(circuit, { type: 'h', qubit: qubit1 });
        circuit = this.sdk.addGate(circuit, { type: 'cnot', controlQubit: qubit1, qubit: qubit2 });
        break;
        
      case 'phi-': // |Φ-⟩ = (|00⟩ - |11⟩)/√2
        circuit = this.sdk.addGate(circuit, { type: 'h', qubit: qubit1 });
        circuit = this.sdk.addGate(circuit, { type: 'z', qubit: qubit1 });
        circuit = this.sdk.addGate(circuit, { type: 'cnot', controlQubit: qubit1, qubit: qubit2 });
        break;
        
      case 'psi+': // |Ψ+⟩ = (|01⟩ + |10⟩)/√2
        circuit = this.sdk.addGate(circuit, { type: 'h', qubit: qubit1 });
        circuit = this.sdk.addGate(circuit, { type: 'x', qubit: qubit2 });
        circuit = this.sdk.addGate(circuit, { type: 'cnot', controlQubit: qubit1, qubit: qubit2 });
        break;
        
      case 'psi-': // |Ψ-⟩ = (|01⟩ - |10⟩)/√2
        circuit = this.sdk.addGate(circuit, { type: 'h', qubit: qubit1 });
        circuit = this.sdk.addGate(circuit, { type: 'z', qubit: qubit1 });
        circuit = this.sdk.addGate(circuit, { type: 'x', qubit: qubit2 });
        circuit = this.sdk.addGate(circuit, { type: 'cnot', controlQubit: qubit1, qubit: qubit2 });
        break;
    }

    return {
      circuit,
      type,
      description: this.getBellStateDescription(type),
      qubits,
      expectedEntanglement: 1.0 // Bell states are maximally entangled
    };
  }

  private getBellStateDescription(type: BellStateType): string {
    const descriptions = {
      'phi+': '|Φ+⟩ = (|00⟩ + |11⟩)/√2 - Maximally entangled Bell state',
      'phi-': '|Φ-⟩ = (|00⟩ - |11⟩)/√2 - Bell state with phase flip',
      'psi+': '|Ψ+⟩ = (|01⟩ + |10⟩)/√2 - Bell state with bit flip',
      'psi-': '|Ψ-⟩ = (|01⟩ - |10⟩)/√2 - Bell state with both flips'
    };
    return descriptions[type];
  }

  /**
   * Create all four Bell states
   */
  async createAllBellStates(): Promise<BellStateResult[]> {
    const types: BellStateType[] = ['phi+', 'phi-', 'psi+', 'psi-'];
    const results: BellStateResult[] = [];
    
    for (const type of types) {
      results.push(await this.createBellState({ type }));
    }
    
    return results;
  }

  /**
   * Quick Bell state (Φ+)
   */
  async quickBellState(): Promise<BellStateResult> {
    return this.createBellState({ type: 'phi+' });
  }
}
