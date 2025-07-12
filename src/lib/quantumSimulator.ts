// Complex number representation
export interface Complex {
  real: number;
  imag: number;
}

// Quantum state vector (array of complex amplitudes)
export type StateVector = Complex[];

// Quantum gate interface
export interface QuantumGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[]; // For multi-parameter gates like U2, U3
}

// Simulation result
export interface SimulationResult {
  stateVector: StateVector;
  measurementProbabilities: number[];
  qubitStates: Array<{
    qubit: number;
    state: string;
    amplitude: Complex;
    phase: number;
    probability: number;
  }>;
}

// Complex number operations
export const complex = {
  add: (a: Complex, b: Complex): Complex => ({
    real: a.real + b.real,
    imag: a.imag + b.imag
  }),
  
  multiply: (a: Complex, b: Complex): Complex => ({
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real
  }),
  
  magnitude: (c: Complex): number => Math.sqrt(c.real * c.real + c.imag * c.imag),
  
  phase: (c: Complex): number => Math.atan2(c.imag, c.real),
  
  fromPolar: (magnitude: number, phase: number): Complex => ({
    real: magnitude * Math.cos(phase),
    imag: magnitude * Math.sin(phase)
  })
};

// Quantum gate matrices (2x2 complex matrices)
const gates = {
  I: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: 1, imag: 0}]], // Identity
  
  X: [[{real: 0, imag: 0}, {real: 1, imag: 0}], 
      [{real: 1, imag: 0}, {real: 0, imag: 0}]], // Pauli-X (NOT)
  
  Y: [[{real: 0, imag: 0}, {real: 0, imag: -1}], 
      [{real: 0, imag: 1}, {real: 0, imag: 0}]], // Pauli-Y
  
  Z: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: -1, imag: 0}]], // Pauli-Z
  
  H: [[{real: 1/Math.sqrt(2), imag: 0}, {real: 1/Math.sqrt(2), imag: 0}], 
      [{real: 1/Math.sqrt(2), imag: 0}, {real: -1/Math.sqrt(2), imag: 0}]], // Hadamard
      
  RX: (angle: number) => [
    [{real: Math.cos(angle/2), imag: 0}, {real: 0, imag: -Math.sin(angle/2)}],
    [{real: 0, imag: -Math.sin(angle/2)}, {real: Math.cos(angle/2), imag: 0}]
  ],
  
  RY: (angle: number) => [
    [{real: Math.cos(angle/2), imag: 0}, {real: -Math.sin(angle/2), imag: 0}],
    [{real: Math.sin(angle/2), imag: 0}, {real: Math.cos(angle/2), imag: 0}]
  ]
};

// Matrix operations
function matrixMultiply(A: Complex[][], B: Complex[][]): Complex[][] {
  const result: Complex[][] = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      result[i][j] = {real: 0, imag: 0};
      for (let k = 0; k < B.length; k++) {
        result[i][j] = complex.add(result[i][j], complex.multiply(A[i][k], B[k][j]));
      }
    }
  }
  return result;
}

function vectorMatrixMultiply(vector: StateVector, matrix: Complex[][]): StateVector {
  const result: StateVector = [];
  for (let i = 0; i < matrix.length; i++) {
    result[i] = {real: 0, imag: 0};
    for (let j = 0; j < vector.length; j++) {
      result[i] = complex.add(result[i], complex.multiply(vector[j], matrix[i][j]));
    }
  }
  return result;
}

// Create tensor product of matrices
function tensorProduct(A: Complex[][], B: Complex[][]): Complex[][] {
  const result: Complex[][] = [];
  for (let i = 0; i < A.length; i++) {
    for (let k = 0; k < B.length; k++) {
      const row: Complex[] = [];
      for (let j = 0; j < A[0].length; j++) {
        for (let l = 0; l < B[0].length; l++) {
          row.push(complex.multiply(A[i][j], B[k][l]));
        }
      }
      result.push(row);
    }
  }
  return result;
}

// Build full gate matrix for n-qubit system
function buildGateMatrix(gateMatrix: Complex[][], targetQubit: number, numQubits: number): Complex[][] {
  let result = gates.I;
  
  for (let i = 0; i < numQubits; i++) {
    if (i === 0) {
      result = (i === targetQubit) ? gateMatrix : gates.I;
    } else {
      const nextGate = (i === targetQubit) ? gateMatrix : gates.I;
      result = tensorProduct(result, nextGate);
    }
  }
  
  return result;
}

// Build CNOT gate matrix
function buildCNOTMatrix(controlQubit: number, targetQubit: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map(() => Array(dim).fill({real: 0, imag: 0}));
  
  // Initialize as identity
  for (let i = 0; i < dim; i++) {
    result[i][i] = {real: 1, imag: 0};
  }
  
  // Apply CNOT logic
  for (let state = 0; state < dim; state++) {
    const controlBit = (state >> (numQubits - 1 - controlQubit)) & 1;
    const targetBit = (state >> (numQubits - 1 - targetQubit)) & 1;
    
    if (controlBit === 1) {
      const flippedState = state ^ (1 << (numQubits - 1 - targetQubit));
      if (state !== flippedState) {
        result[state][state] = {real: 0, imag: 0};
        result[flippedState][flippedState] = {real: 0, imag: 0};
        result[state][flippedState] = {real: 1, imag: 0};
        result[flippedState][state] = {real: 1, imag: 0};
      }
    }
  }
  
  return result;
}

export class QuantumCircuitSimulator {
  private numQubits: number;
  private stateVector: StateVector;
  
  constructor(numQubits: number = 5) {
    this.numQubits = numQubits;
    this.reset();
  }
  
  // Initialize to |00000⟩ state
  reset(): void {
    const dim = Math.pow(2, this.numQubits);
    this.stateVector = Array(dim).fill(0).map(() => ({real: 0, imag: 0}));
    this.stateVector[0] = {real: 1, imag: 0}; // |00000⟩ state
  }
  
  // Apply a single qubit gate
  applySingleQubitGate(gateMatrix: Complex[][], qubit: number): void {
    const fullMatrix = buildGateMatrix(gateMatrix, qubit, this.numQubits);
    this.stateVector = vectorMatrixMultiply(this.stateVector, fullMatrix);
  }
  
  // Apply CNOT gate
  applyCNOT(controlQubit: number, targetQubit: number): void {
    const cnotMatrix = buildCNOTMatrix(controlQubit, targetQubit, this.numQubits);
    this.stateVector = vectorMatrixMultiply(this.stateVector, cnotMatrix);
  }
  
  // Simulate entire circuit
  simulate(circuit: QuantumGate[]): SimulationResult {
    this.reset();
    
    // Sort gates by position (time)
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    
    // Apply each gate
    for (const gate of sortedGates) {
      switch (gate.type) {
        case 'H':
          if (gate.qubit !== undefined) {
            this.applySingleQubitGate(gates.H, gate.qubit);
          }
          break;
          
        case 'X':
          if (gate.qubit !== undefined) {
            this.applySingleQubitGate(gates.X, gate.qubit);
          }
          break;
          
        case 'Y':
          if (gate.qubit !== undefined) {
            this.applySingleQubitGate(gates.Y, gate.qubit);
          }
          break;
          
        case 'Z':
          if (gate.qubit !== undefined) {
            this.applySingleQubitGate(gates.Z, gate.qubit);
          }
          break;
          
        case 'RX':
          if (gate.qubit !== undefined && gate.angle !== undefined) {
            this.applySingleQubitGate(gates.RX(gate.angle), gate.qubit);
          }
          break;
          
        case 'RY':
          if (gate.qubit !== undefined && gate.angle !== undefined) {
            this.applySingleQubitGate(gates.RY(gate.angle), gate.qubit);
          }
          break;
          
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2) {
            this.applyCNOT(gate.qubits[0], gate.qubits[1]);
          }
          break;
      }
    }
    
    return this.getResult();
  }
  
  // Get current simulation result
  getResult(): SimulationResult {
    const measurementProbabilities = this.stateVector.map(amp => complex.magnitude(amp) ** 2);
    
    // Calculate individual qubit states
    const qubitStates = [];
    for (let q = 0; q < this.numQubits; q++) {
      let prob0 = 0;
      let prob1 = 0;
      let amp0: Complex = {real: 0, imag: 0};
      let amp1: Complex = {real: 0, imag: 0};
      
      for (let state = 0; state < this.stateVector.length; state++) {
        const qubitValue = (state >> (this.numQubits - 1 - q)) & 1;
        const probability = complex.magnitude(this.stateVector[state]) ** 2;
        
        if (qubitValue === 0) {
          prob0 += probability;
          amp0 = complex.add(amp0, this.stateVector[state]);
        } else {
          prob1 += probability;
          amp1 = complex.add(amp1, this.stateVector[state]);
        }
      }
      
      // Determine dominant state
      let dominantState = '|0⟩';
      let dominantAmplitude = amp0;
      let dominantProb = prob0;
      
      if (prob1 > prob0) {
        dominantState = '|1⟩';
        dominantAmplitude = amp1;
        dominantProb = prob1;
      } else if (Math.abs(prob0 - prob1) < 0.01) {
        dominantState = '|+⟩'; // Superposition
        dominantAmplitude = complex.add(amp0, amp1);
      }
      
      qubitStates.push({
        qubit: q,
        state: dominantState,
        amplitude: dominantAmplitude,
        phase: complex.phase(dominantAmplitude),
        probability: dominantProb
      });
    }
    
    return {
      stateVector: this.stateVector,
      measurementProbabilities,
      qubitStates
    };
  }
  
  // Get state vector as string representation
  getStateString(): string {
    const significantStates = [];
    for (let i = 0; i < this.stateVector.length; i++) {
      const amplitude = complex.magnitude(this.stateVector[i]);
      if (amplitude > 0.001) { // Only show significant amplitudes
        const binaryState = i.toString(2).padStart(this.numQubits, '0');
        const phase = complex.phase(this.stateVector[i]);
        significantStates.push(`${amplitude.toFixed(3)}e^(${phase.toFixed(2)}i)|${binaryState}⟩`);
      }
    }
    return significantStates.join(' + ');
  }
}

// Export singleton instance
export const quantumSimulator = new QuantumCircuitSimulator(5);