
/**
 * Quantum Fourier Transform SDK Module
 * Implements QFT and inverse QFT operations
 */

import { QOSimSDK, QuantumCircuit } from '../qosim-sdk';

export interface QFTConfig {
  numQubits: number;
  inverse?: boolean;
  inputState?: string; // Binary string representing initial state
}

export interface QFTResult {
  circuit: QuantumCircuit;
  isInverse: boolean;
  inputState: string;
  description: string;
}

export class QuantumFourierTransform {
  private sdk: QOSimSDK;

  constructor(sdk: QOSimSDK) {
    this.sdk = sdk;
  }

  /**
   * Create QFT circuit
   */
  async createQFTCircuit(config: QFTConfig): Promise<QFTResult> {
    const { numQubits, inverse = false, inputState = '0'.repeat(numQubits) } = config;
    
    let circuit = this.sdk.createCircuit(
      inverse ? `Inverse QFT (${numQubits}Q)` : `QFT (${numQubits}Q)`,
      numQubits,
      `${inverse ? 'Inverse ' : ''}Quantum Fourier Transform on ${numQubits} qubits`
    );

    // Set initial state if not |00...0⟩
    if (inputState !== '0'.repeat(numQubits)) {
      for (let i = 0; i < numQubits; i++) {
        if (inputState[i] === '1') {
          circuit = this.sdk.addGate(circuit, { type: 'x', qubit: i });
        }
      }
    }

    if (inverse) {
      circuit = this.applyInverseQFT(circuit, numQubits);
    } else {
      circuit = this.applyQFT(circuit, numQubits);
    }

    return {
      circuit,
      isInverse: inverse,
      inputState,
      description: `${inverse ? 'Inverse ' : ''}QFT transforms between computational and frequency domains`
    };
  }

  private applyQFT(circuit: QuantumCircuit, numQubits: number): QuantumCircuit {
    let result = circuit;

    for (let i = 0; i < numQubits; i++) {
      // Apply Hadamard
      result = this.sdk.addGate(result, { type: 'h', qubit: i });
      
      // Apply controlled rotations
      for (let j = i + 1; j < numQubits; j++) {
        const angle = Math.PI / Math.pow(2, j - i);
        result = this.sdk.addGate(result, { 
          type: 'rz', 
          qubit: j, 
          angle: angle 
        });
      }
    }

    // Swap qubits for correct output order
    for (let i = 0; i < Math.floor(numQubits / 2); i++) {
      result = this.sdk.addGate(result, { 
        type: 'swap', 
        controlQubit: i, 
        qubit: numQubits - 1 - i 
      });
    }

    return result;
  }

  private applyInverseQFT(circuit: QuantumCircuit, numQubits: number): QuantumCircuit {
    let result = circuit;

    // Swap qubits first (reverse of QFT)
    for (let i = 0; i < Math.floor(numQubits / 2); i++) {
      result = this.sdk.addGate(result, { 
        type: 'swap', 
        controlQubit: i, 
        qubit: numQubits - 1 - i 
      });
    }

    // Apply inverse operations in reverse order
    for (let i = numQubits - 1; i >= 0; i--) {
      // Apply inverse controlled rotations
      for (let j = numQubits - 1; j > i; j--) {
        const angle = -Math.PI / Math.pow(2, j - i);
        result = this.sdk.addGate(result, { 
          type: 'rz', 
          qubit: j, 
          angle: angle 
        });
      }
      
      // Apply Hadamard
      result = this.sdk.addGate(result, { type: 'h', qubit: i });
    }

    return result;
  }

  /**
   * Quick 3-qubit QFT
   */
  async quickQFT3Q(): Promise<QFTResult> {
    return this.createQFTCircuit({
      numQubits: 3,
      inverse: false,
      inputState: '001' // Start with |001⟩
    });
  }

  /**
   * Quick inverse QFT
   */
  async quickInverseQFT3Q(): Promise<QFTResult> {
    return this.createQFTCircuit({
      numQubits: 3,
      inverse: true,
      inputState: '000'
    });
  }
}
