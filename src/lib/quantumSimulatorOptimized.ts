// Enhanced Quantum Circuit Simulator with Real-time Optimization
import { Complex, StateVector, QuantumGate, complex } from './quantumSimulator';

export interface OptimizedSimulationResult {
  stateVector: StateVector;
  measurementProbabilities: number[];
  qubitStates: Array<{
    qubit: number;
    state: string;
    amplitude: Complex;
    phase: number;
    probability: number;
  }>;
  entanglement: {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    totalEntanglement: number;
    entanglementThreads: Array<{ qubits: number[]; strength: number }>;
  };
  executionTime: number;
  stepResults?: OptimizedSimulationResult[];
  fidelity: number;
  errorRates?: { [qubit: number]: number };
}

export interface SimulationStepData {
  gateIndex: number;
  gate: QuantumGate;
  stateVector: StateVector;
  entanglement: any;
  timestamp: number;
}

// Enhanced gates with multi-qubit support and optimizations
const enhancedGates = {
  // Standard single-qubit gates
  I: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: 1, imag: 0}]],
  
  X: [[{real: 0, imag: 0}, {real: 1, imag: 0}], 
      [{real: 1, imag: 0}, {real: 0, imag: 0}]],
  
  Y: [[{real: 0, imag: 0}, {real: 0, imag: -1}], 
      [{real: 0, imag: 1}, {real: 0, imag: 0}]],
  
  Z: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: -1, imag: 0}]],
  
  H: [[{real: 1/Math.sqrt(2), imag: 0}, {real: 1/Math.sqrt(2), imag: 0}], 
      [{real: 1/Math.sqrt(2), imag: 0}, {real: -1/Math.sqrt(2), imag: 0}]],
  
  S: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: 0, imag: 1}]], // Phase gate
  
  T: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: Math.cos(Math.PI/4), imag: Math.sin(Math.PI/4)}]], // T gate
      
  // Parametric rotation gates with precision thresholding
  RX: (angle: number) => {
    // Threshold very small angles to identity
    if (Math.abs(angle) < 1e-10) return enhancedGates.I;
    const cos = Math.cos(angle/2);
    const sin = Math.sin(angle/2);
    return [
      [{real: cos, imag: 0}, {real: 0, imag: -sin}],
      [{real: 0, imag: -sin}, {real: cos, imag: 0}]
    ];
  },
  
  RY: (angle: number) => {
    if (Math.abs(angle) < 1e-10) return enhancedGates.I;
    const cos = Math.cos(angle/2);
    const sin = Math.sin(angle/2);
    return [
      [{real: cos, imag: 0}, {real: -sin, imag: 0}],
      [{real: sin, imag: 0}, {real: cos, imag: 0}]
    ];
  },
  
  RZ: (angle: number) => {
    if (Math.abs(angle) < 1e-10) return enhancedGates.I;
    const phase = angle/2;
    return [
      [{real: Math.cos(-phase), imag: Math.sin(-phase)}, {real: 0, imag: 0}],
      [{real: 0, imag: 0}, {real: Math.cos(phase), imag: Math.sin(phase)}]
    ];
  },
};

// Optimized matrix operations with floating point precision
function precisionRound(value: number, precision: number = 12): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

function normalizeComplex(c: Complex): Complex {
  return {
    real: precisionRound(c.real),
    imag: precisionRound(c.imag)
  };
}

function optimizedMatrixMultiply(A: Complex[][], B: Complex[][]): Complex[][] {
  const result: Complex[][] = [];
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  
  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      result[i][j] = {real: 0, imag: 0};
      for (let k = 0; k < inner; k++) {
        const product = complex.multiply(A[i][k], B[k][j]);
        result[i][j] = complex.add(result[i][j], product);
      }
      result[i][j] = normalizeComplex(result[i][j]);
    }
  }
  return result;
}

// Optimized multi-qubit gate construction
function buildOptimizedCNOTMatrix(controlQubit: number, targetQubit: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map((_, i) => 
    Array(dim).fill(0).map((_, j) => i === j ? {real: 1, imag: 0} : {real: 0, imag: 0})
  );
  
  for (let state = 0; state < dim; state++) {
    const controlBit = (state >> (numQubits - 1 - controlQubit)) & 1;
    if (controlBit === 1) {
      const targetBit = (state >> (numQubits - 1 - targetQubit)) & 1;
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

// Toffoli gate for quantum error correction
function buildToffoliMatrix(control1: number, control2: number, target: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map((_, i) => 
    Array(dim).fill(0).map((_, j) => i === j ? {real: 1, imag: 0} : {real: 0, imag: 0})
  );
  
  for (let state = 0; state < dim; state++) {
    const control1Bit = (state >> (numQubits - 1 - control1)) & 1;
    const control2Bit = (state >> (numQubits - 1 - control2)) & 1;
    
    if (control1Bit === 1 && control2Bit === 1) {
      const flippedState = state ^ (1 << (numQubits - 1 - target));
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

// SWAP gate implementation
function buildSWAPMatrix(qubit1: number, qubit2: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map((_, i) => 
    Array(dim).fill(0).map((_, j) => i === j ? {real: 1, imag: 0} : {real: 0, imag: 0})
  );
  
  for (let state = 0; state < dim; state++) {
    const bit1 = (state >> (numQubits - 1 - qubit1)) & 1;
    const bit2 = (state >> (numQubits - 1 - qubit2)) & 1;
    
    if (bit1 !== bit2) {
      const swappedState = state ^ (1 << (numQubits - 1 - qubit1)) ^ (1 << (numQubits - 1 - qubit2));
      result[state][state] = {real: 0, imag: 0};
      result[swappedState][swappedState] = {real: 0, imag: 0};
      result[state][swappedState] = {real: 1, imag: 0};
      result[swappedState][state] = {real: 1, imag: 0};
    }
  }
  
  return result;
}

// Advanced entanglement calculation with visual threads
function calculateAdvancedEntanglement(stateVector: StateVector, numQubits: number) {
  const pairs: Array<{ qubit1: number; qubit2: number; strength: number }> = [];
  const threads: Array<{ qubits: number[]; strength: number }> = [];
  let totalEntanglement = 0;
  
  // Calculate pairwise entanglement
  for (let q1 = 0; q1 < numQubits; q1++) {
    for (let q2 = q1 + 1; q2 < numQubits; q2++) {
      const entanglementStrength = calculatePairEntanglement(stateVector, q1, q2, numQubits);
      
      if (entanglementStrength > 0.01) {
        pairs.push({ qubit1: q1, qubit2: q2, strength: entanglementStrength });
        totalEntanglement += entanglementStrength;
      }
    }
  }
  
  // Find entanglement threads (multi-qubit entanglement)
  for (let i = 0; i < numQubits; i++) {
    const connectedQubits = [i];
    const connectedPairs = pairs.filter(p => p.qubit1 === i || p.qubit2 === i);
    
    connectedPairs.forEach(pair => {
      const otherQubit = pair.qubit1 === i ? pair.qubit2 : pair.qubit1;
      if (!connectedQubits.includes(otherQubit)) {
        connectedQubits.push(otherQubit);
      }
    });
    
    if (connectedQubits.length > 1) {
      const threadStrength = connectedPairs.reduce((sum, pair) => sum + pair.strength, 0) / connectedPairs.length;
      threads.push({ qubits: connectedQubits, strength: threadStrength });
    }
  }
  
  return {
    pairs,
    totalEntanglement: Math.min(1, totalEntanglement),
    entanglementThreads: threads
  };
}

function calculatePairEntanglement(stateVector: StateVector, qubit1: number, qubit2: number, numQubits: number): number {
  // Simplified entanglement calculation using correlation
  let correlation = 0;
  const normalizer = stateVector.reduce((sum, amp) => sum + complex.magnitude(amp) ** 2, 0);
  
  for (let state = 0; state < stateVector.length; state++) {
    const bit1 = (state >> (numQubits - 1 - qubit1)) & 1;
    const bit2 = (state >> (numQubits - 1 - qubit2)) & 1;
    const probability = complex.magnitude(stateVector[state]) ** 2 / normalizer;
    
    // Calculate correlation coefficient
    correlation += probability * (bit1 === bit2 ? 1 : -1);
  }
  
  return Math.abs(correlation);
}

export class OptimizedQuantumSimulator {
  private numQubits: number;
  private stateVector: StateVector;
  private stepResults: SimulationStepData[] = [];
  private isStepMode: boolean = false;
  private currentStep: number = 0;
  private isPaused: boolean = false;
  
  constructor(numQubits: number = 5) {
    this.numQubits = numQubits;
    this.reset();
  }
  
  reset(): void {
    const dim = Math.pow(2, this.numQubits);
    this.stateVector = Array(dim).fill(0).map(() => ({real: 0, imag: 0}));
    this.stateVector[0] = {real: 1, imag: 0};
    this.stepResults = [];
    this.currentStep = 0;
    this.isPaused = false;
  }
  
  enableStepMode(enabled: boolean): void {
    this.isStepMode = enabled;
    if (enabled) {
      this.stepResults = [];
      this.currentStep = 0;
    }
  }
  
  pause(): void {
    this.isPaused = true;
  }
  
  resume(): void {
    this.isPaused = false;
  }
  
  step(): SimulationStepData | null {
    if (this.currentStep < this.stepResults.length) {
      return this.stepResults[this.currentStep++];
    }
    return null;
  }
  
  // Async simulation with batching to prevent UI freeze
  async simulateAsync(circuit: QuantumGate[]): Promise<OptimizedSimulationResult> {
    const startTime = performance.now();
    this.reset();
    
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    const batchSize = 10; // Process gates in batches
    
    for (let i = 0; i < sortedGates.length; i += batchSize) {
      const batch = sortedGates.slice(i, i + batchSize);
      
      for (const gate of batch) {
        if (this.isPaused) {
          await new Promise(resolve => {
            const checkPause = () => {
              if (!this.isPaused) resolve(undefined);
              else setTimeout(checkPause, 100);
            };
            checkPause();
          });
        }
        
        await this.applyGateAsync(gate);
        
        if (this.isStepMode) {
          const stepData: SimulationStepData = {
            gateIndex: i + batch.indexOf(gate),
            gate,
            stateVector: [...this.stateVector],
            entanglement: calculateAdvancedEntanglement(this.stateVector, this.numQubits),
            timestamp: performance.now()
          };
          this.stepResults.push(stepData);
        }
      }
      
      // Yield control to prevent UI freeze
      if (i + batchSize < sortedGates.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    const executionTime = performance.now() - startTime;
    return this.getOptimizedResult(executionTime);
  }
  
  private async applyGateAsync(gate: QuantumGate): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.applyGate(gate);
        resolve();
      }, 0);
    });
  }
  
  private applyGate(gate: QuantumGate): void {
    switch (gate.type) {
      case 'H':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.H, gate.qubit);
        }
        break;
        
      case 'X':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.X, gate.qubit);
        }
        break;
        
      case 'Y':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.Y, gate.qubit);
        }
        break;
        
      case 'Z':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.Z, gate.qubit);
        }
        break;
        
      case 'S':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.S, gate.qubit);
        }
        break;
        
      case 'T':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.T, gate.qubit);
        }
        break;
        
      case 'RX':
        if (gate.qubit !== undefined && gate.angle !== undefined) {
          this.applySingleQubitGate(enhancedGates.RX(gate.angle), gate.qubit);
        }
        break;
        
      case 'RY':
        if (gate.qubit !== undefined && gate.angle !== undefined) {
          this.applySingleQubitGate(enhancedGates.RY(gate.angle), gate.qubit);
        }
        break;
        
      case 'RZ':
        if (gate.qubit !== undefined && gate.angle !== undefined) {
          this.applySingleQubitGate(enhancedGates.RZ(gate.angle), gate.qubit);
        }
        break;
        
      case 'CNOT':
        if (gate.qubits && gate.qubits.length === 2) {
          this.applyCNOT(gate.qubits[0], gate.qubits[1]);
        }
        break;
        
      case 'TOFFOLI':
        if (gate.qubits && gate.qubits.length === 3) {
          this.applyToffoli(gate.qubits[0], gate.qubits[1], gate.qubits[2]);
        }
        break;
        
      case 'SWAP':
        if (gate.qubits && gate.qubits.length === 2) {
          this.applySWAP(gate.qubits[0], gate.qubits[1]);
        }
        break;
    }
  }
  
  private applySingleQubitGate(gateMatrix: Complex[][], qubit: number): void {
    const fullMatrix = this.buildGateMatrix(gateMatrix, qubit);
    this.stateVector = this.vectorMatrixMultiply(this.stateVector, fullMatrix);
  }
  
  private applyCNOT(controlQubit: number, targetQubit: number): void {
    const cnotMatrix = buildOptimizedCNOTMatrix(controlQubit, targetQubit, this.numQubits);
    this.stateVector = this.vectorMatrixMultiply(this.stateVector, cnotMatrix);
  }
  
  private applyToffoli(control1: number, control2: number, target: number): void {
    const toffoliMatrix = buildToffoliMatrix(control1, control2, target, this.numQubits);
    this.stateVector = this.vectorMatrixMultiply(this.stateVector, toffoliMatrix);
  }
  
  private applySWAP(qubit1: number, qubit2: number): void {
    const swapMatrix = buildSWAPMatrix(qubit1, qubit2, this.numQubits);
    this.stateVector = this.vectorMatrixMultiply(this.stateVector, swapMatrix);
  }
  
  private buildGateMatrix(gateMatrix: Complex[][], targetQubit: number): Complex[][] {
    let result = enhancedGates.I;
    
    for (let i = 0; i < this.numQubits; i++) {
      if (i === 0) {
        result = (i === targetQubit) ? gateMatrix : enhancedGates.I;
      } else {
        const nextGate = (i === targetQubit) ? gateMatrix : enhancedGates.I;
        result = this.tensorProduct(result, nextGate);
      }
    }
    
    return result;
  }
  
  private tensorProduct(A: Complex[][], B: Complex[][]): Complex[][] {
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
  
  private vectorMatrixMultiply(vector: StateVector, matrix: Complex[][]): StateVector {
    const result: StateVector = [];
    for (let i = 0; i < matrix.length; i++) {
      result[i] = {real: 0, imag: 0};
      for (let j = 0; j < vector.length; j++) {
        result[i] = complex.add(result[i], complex.multiply(vector[j], matrix[i][j]));
      }
      result[i] = normalizeComplex(result[i]);
    }
    return result;
  }
  
  private getOptimizedResult(executionTime: number): OptimizedSimulationResult {
    const measurementProbabilities = this.stateVector.map(amp => complex.magnitude(amp) ** 2);
    const entanglement = calculateAdvancedEntanglement(this.stateVector, this.numQubits);
    
    // Calculate individual qubit states
    const qubitStates = [];
    for (let q = 0; q < this.numQubits; q++) {
      let prob0 = 0, prob1 = 0;
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
      
      let dominantState = '|0⟩';
      let dominantAmplitude = amp0;
      let dominantProb = prob0;
      
      if (prob1 > prob0) {
        dominantState = '|1⟩';
        dominantAmplitude = amp1;
        dominantProb = prob1;
      } else if (Math.abs(prob0 - prob1) < 0.01) {
        dominantState = '|+⟩';
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
    
    // Calculate fidelity
    const totalProb = measurementProbabilities.reduce((sum, prob) => sum + prob, 0);
    const fidelity = Math.min(1, totalProb);
    
    return {
      stateVector: this.stateVector,
      measurementProbabilities,
      qubitStates,
      entanglement,
      executionTime,
      stepResults: this.isStepMode ? this.stepResults.map(step => this.getOptimizedResult(step.timestamp)) : undefined,
      fidelity
    };
  }
  
  getStepResults(): SimulationStepData[] {
    return this.stepResults;
  }
}

export const optimizedQuantumSimulator = new OptimizedQuantumSimulator(5);