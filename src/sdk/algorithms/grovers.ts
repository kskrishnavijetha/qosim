
/**
 * Grover's Search Algorithm SDK Module
 * Implements quantum search for marked items
 */

import { QOSimSDK, QuantumCircuit, QuantumGate } from '../qosim-sdk';

export interface GroverConfig {
  numQubits: number;
  markedStates: number[]; // Which states to search for
  iterations?: number; // Number of Grover iterations
}

export interface GroverResult {
  circuit: QuantumCircuit;
  markedStates: number[];
  successProbability: number;
  iterations: number;
  theoreticalOptimal: number;
}

export class GroverAlgorithm {
  private sdk: QOSimSDK;

  constructor(sdk: QOSimSDK) {
    this.sdk = sdk;
  }

  /**
   * Create Grover's search circuit
   */
  async createGroverCircuit(config: GroverConfig): Promise<GroverResult> {
    const { numQubits, markedStates, iterations } = config;
    const totalStates = Math.pow(2, numQubits);
    
    // Calculate optimal iterations
    const optimalIterations = Math.floor(Math.PI / 4 * Math.sqrt(totalStates / markedStates.length));
    const actualIterations = iterations || optimalIterations;

    let circuit = this.sdk.createCircuit(
      `Grover Search (${numQubits}Q)`,
      numQubits,
      `Grover's algorithm searching for states: ${markedStates.join(', ')}`
    );

    // Step 1: Initialize superposition
    for (let i = 0; i < numQubits; i++) {
      circuit = this.sdk.addGate(circuit, { type: 'h', qubit: i });
    }

    // Step 2: Apply Grover iterations
    for (let iter = 0; iter < actualIterations; iter++) {
      // Oracle: mark target states
      circuit = this.applyOracle(circuit, markedStates, numQubits);
      
      // Diffusion operator (inversion about average)
      circuit = this.applyDiffusion(circuit, numQubits);
    }

    // Calculate success probability
    const successProbability = Math.pow(
      Math.sin((2 * actualIterations + 1) * Math.asin(Math.sqrt(markedStates.length / totalStates))),
      2
    );

    return {
      circuit,
      markedStates,
      successProbability,
      iterations: actualIterations,
      theoreticalOptimal: optimalIterations
    };
  }

  private applyOracle(circuit: QuantumCircuit, markedStates: number[], numQubits: number): QuantumCircuit {
    // Simple oracle for |11...1⟩ state (can be extended for other patterns)
    let result = circuit;
    
    for (const state of markedStates) {
      // Apply controlled-Z operations to mark the state
      if (numQubits === 2 && state === 3) { // |11⟩
        result = this.sdk.addGate(result, { type: 'cz', controlQubit: 0, qubit: 1 });
      } else if (numQubits >= 2) {
        // Multi-controlled Z gate approximation
        result = this.sdk.addGate(result, { type: 'z', qubit: numQubits - 1 });
      }
    }
    
    return result;
  }

  private applyDiffusion(circuit: QuantumCircuit, numQubits: number): QuantumCircuit {
    let result = circuit;
    
    // H gates
    for (let i = 0; i < numQubits; i++) {
      result = this.sdk.addGate(result, { type: 'h', qubit: i });
    }
    
    // X gates
    for (let i = 0; i < numQubits; i++) {
      result = this.sdk.addGate(result, { type: 'x', qubit: i });
    }
    
    // Multi-controlled Z
    if (numQubits >= 2) {
      result = this.sdk.addGate(result, { type: 'cz', controlQubit: 0, qubit: 1 });
    }
    
    // X gates (inverse)
    for (let i = 0; i < numQubits; i++) {
      result = this.sdk.addGate(result, { type: 'x', qubit: i });
    }
    
    // H gates (inverse)
    for (let i = 0; i < numQubits; i++) {
      result = this.sdk.addGate(result, { type: 'h', qubit: i });
    }
    
    return result;
  }

  /**
   * Quick 2-qubit Grover search
   */
  async quickGrover2Q(): Promise<GroverResult> {
    return this.createGroverCircuit({
      numQubits: 2,
      markedStates: [3], // Search for |11⟩
      iterations: 1
    });
  }
}
