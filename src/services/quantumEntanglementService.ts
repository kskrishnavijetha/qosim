
import { Complex } from './complexNumbers';

export interface EntanglementPair {
  qubit1: number;
  qubit2: number;
  strength: number;
}

export interface EntanglementThread {
  qubits: number[];
  strength: number;
}

export interface EntanglementAnalysis {
  pairs: EntanglementPair[];
  totalEntanglement: number;
  entanglementThreads: EntanglementThread[];
}

export class QuantumEntanglementService {
  /**
   * Calculate entanglement analysis from state vector
   */
  static calculateEntanglement(
    stateVector: Array<{ real: number; imaginary: number }>,
    numQubits: number
  ): EntanglementAnalysis {
    const pairs: EntanglementPair[] = [];
    const entanglementThreads: EntanglementThread[] = [];
    let totalEntanglement = 0;

    // Calculate pairwise entanglement using proper quantum measures
    for (let q1 = 0; q1 < numQubits; q1++) {
      for (let q2 = q1 + 1; q2 < numQubits; q2++) {
        const entanglementStrength = this.calculatePairEntanglement(stateVector, q1, q2, numQubits);
        
        if (entanglementStrength > 0.01) {
          pairs.push({ qubit1: q1, qubit2: q2, strength: entanglementStrength });
          totalEntanglement += entanglementStrength;
        }
      }
    }

    // Calculate multi-qubit entanglement for systems with 3+ qubits
    if (numQubits >= 3) {
      const multiQubitEntanglement = this.calculateMultiQubitEntanglement(stateVector, numQubits);
      entanglementThreads.push(...multiQubitEntanglement);
    }

    // Normalize total entanglement
    totalEntanglement = Math.min(1, totalEntanglement / (numQubits * (numQubits - 1) / 2));

    return { pairs, totalEntanglement, entanglementThreads };
  }

  /**
   * Calculate entanglement between two specific qubits
   */
  private static calculatePairEntanglement(
    stateVector: Array<{ real: number; imaginary: number }>,
    qubit1: number,
    qubit2: number,
    numQubits: number
  ): number {
    const reducedDensity = this.calculateReducedDensityMatrix(stateVector, [qubit1, qubit2], numQubits);
    const entropy = this.calculateVonNeumannEntropy(reducedDensity);
    
    // Convert entropy to entanglement strength (0-1 scale)
    return Math.min(1, entropy / Math.log(4)); // Max entropy for 2 qubits is log(4)
  }

  /**
   * Calculate multi-qubit entanglement patterns
   */
  private static calculateMultiQubitEntanglement(
    stateVector: Array<{ real: number; imaginary: number }>,
    numQubits: number
  ): EntanglementThread[] {
    const threads: EntanglementThread[] = [];

    // Look for 3-qubit entanglement patterns
    for (let i = 0; i < numQubits - 2; i++) {
      const qubits = [i, i + 1, i + 2];
      const reducedDensity = this.calculateReducedDensityMatrix(stateVector, qubits, numQubits);
      const entropy = this.calculateVonNeumannEntropy(reducedDensity);
      const strength = Math.min(1, entropy / Math.log(8)); // Max entropy for 3 qubits

      if (strength > 0.1) {
        threads.push({ qubits, strength });
      }
    }

    return threads;
  }

  /**
   * Calculate reduced density matrix for specific qubits
   */
  private static calculateReducedDensityMatrix(
    stateVector: Array<{ real: number; imaginary: number }>,
    targetQubits: number[],
    numQubits: number
  ): Complex[][] {
    const targetDim = Math.pow(2, targetQubits.length);
    const densityMatrix: Complex[][] = Array(targetDim).fill(null).map(() => 
      Array(targetDim).fill(null).map(() => ({ real: 0, imag: 0 }))
    );

    // Trace out non-target qubits
    for (let i = 0; i < stateVector.length; i++) {
      for (let j = 0; j < stateVector.length; j++) {
        const targetStateI = this.extractQubitState(i, targetQubits, numQubits);
        const targetStateJ = this.extractQubitState(j, targetQubits, numQubits);
        
        if (this.sameNonTargetQubits(i, j, targetQubits, numQubits)) {
          const amplitude = this.multiplyComplex(
            stateVector[i], 
            { real: stateVector[j].real, imag: -stateVector[j].imaginary }
          );
          
          densityMatrix[targetStateI][targetStateJ] = this.addComplex(
            densityMatrix[targetStateI][targetStateJ], 
            amplitude
          );
        }
      }
    }

    return densityMatrix;
  }

  /**
   * Extract target qubit state from full state
   */
  private static extractQubitState(fullState: number, targetQubits: number[], numQubits: number): number {
    let targetState = 0;
    for (let i = 0; i < targetQubits.length; i++) {
      const qubitValue = (fullState >> (numQubits - 1 - targetQubits[i])) & 1;
      targetState |= (qubitValue << (targetQubits.length - 1 - i));
    }
    return targetState;
  }

  /**
   * Check if non-target qubits are the same between two states
   */
  private static sameNonTargetQubits(
    state1: number, 
    state2: number, 
    targetQubits: number[], 
    numQubits: number
  ): boolean {
    for (let q = 0; q < numQubits; q++) {
      if (!targetQubits.includes(q)) {
        const bit1 = (state1 >> (numQubits - 1 - q)) & 1;
        const bit2 = (state2 >> (numQubits - 1 - q)) & 1;
        if (bit1 !== bit2) return false;
      }
    }
    return true;
  }

  /**
   * Calculate von Neumann entropy of density matrix
   */
  private static calculateVonNeumannEntropy(densityMatrix: Complex[][]): number {
    const eigenvalues = this.calculateEigenvalues(densityMatrix);
    
    let entropy = 0;
    for (const lambda of eigenvalues) {
      if (lambda > 1e-10) {
        entropy -= lambda * Math.log(lambda);
      }
    }
    
    return entropy;
  }

  /**
   * Calculate eigenvalues of density matrix (simplified implementation)
   */
  private static calculateEigenvalues(matrix: Complex[][]): number[] {
    const dim = matrix.length;
    const eigenvalues: number[] = [];
    
    // For small matrices, use diagonal approximation
    if (dim <= 4) {
      let sum = 0;
      for (let i = 0; i < dim; i++) {
        const eigenval = this.magnitude(matrix[i][i]);
        eigenvalues.push(eigenval);
        sum += eigenval;
      }
      
      // Normalize
      if (sum > 0) {
        return eigenvalues.map(val => val / sum);
      }
    }
    
    return eigenvalues.length > 0 ? eigenvalues : [1];
  }

  /**
   * Helper functions for complex number operations
   */
  private static addComplex(a: Complex, b: Complex): Complex {
    return { real: a.real + b.real, imag: a.imag + b.imag };
  }

  private static multiplyComplex(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imaginary * b.imag,
      imag: a.real * b.imag + a.imaginary * b.real
    };
  }

  private static magnitude(c: Complex): number {
    return Math.sqrt(c.real * c.real + c.imag * c.imag);
  }
}
