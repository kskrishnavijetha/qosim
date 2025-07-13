// Enhanced Quantum Circuit Simulator with Real-time Optimization
import { Complex, StateVector, QuantumGate, complex } from './quantumSimulator';
import { SimulationMode } from './quantumSimulationService';

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
  mode: SimulationMode; // Add mode property for compatibility
}

export interface SimulationStepData {
  gateIndex: number;
  gate: QuantumGate;
  stateVector: StateVector;
  entanglement: any;
  timestamp: number;
}

// Enhanced gates with comprehensive quantum gate support
const enhancedGates = {
  // === 🟩 SINGLE-QUBIT GATES ===
  // Standard Pauli gates
  I: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: 1, imag: 0}]],
  
  X: [[{real: 0, imag: 0}, {real: 1, imag: 0}], 
      [{real: 1, imag: 0}, {real: 0, imag: 0}]],
  
  Y: [[{real: 0, imag: 0}, {real: 0, imag: -1}], 
      [{real: 0, imag: 1}, {real: 0, imag: 0}]],
  
  Z: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: -1, imag: 0}]],
  
  // Hadamard gate
  H: [[{real: 1/Math.sqrt(2), imag: 0}, {real: 1/Math.sqrt(2), imag: 0}], 
      [{real: 1/Math.sqrt(2), imag: 0}, {real: -1/Math.sqrt(2), imag: 0}]],
  
  // Phase gates
  S: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: 0, imag: 1}]], // Phase gate (π/2)
  
  SDG: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
        [{real: 0, imag: 0}, {real: 0, imag: -1}]], // S dagger (-π/2)
  
  T: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
      [{real: 0, imag: 0}, {real: Math.cos(Math.PI/4), imag: Math.sin(Math.PI/4)}]], // T gate (π/4)
  
  TDG: [[{real: 1, imag: 0}, {real: 0, imag: 0}], 
        [{real: 0, imag: 0}, {real: Math.cos(-Math.PI/4), imag: Math.sin(-Math.PI/4)}]], // T dagger (-π/4)
      
  // === 🟦 PARAMETRIC ROTATION GATES ===
  RX: (angle: number) => {
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
  
  // Universal gates U1, U2, U3
  U1: (lambda: number) => {
    if (Math.abs(lambda) < 1e-10) return enhancedGates.I;
    return [
      [{real: 1, imag: 0}, {real: 0, imag: 0}],
      [{real: 0, imag: 0}, {real: Math.cos(lambda), imag: Math.sin(lambda)}]
    ];
  },
  
  U2: (phi: number, lambda: number) => {
    const sqrt2inv = 1/Math.sqrt(2);
    return [
      [{real: sqrt2inv, imag: 0}, {real: -sqrt2inv * Math.cos(lambda), imag: -sqrt2inv * Math.sin(lambda)}],
      [{real: sqrt2inv * Math.cos(phi), imag: sqrt2inv * Math.sin(phi)}, {real: sqrt2inv * Math.cos(phi + lambda), imag: sqrt2inv * Math.sin(phi + lambda)}]
    ];
  },
  
  U3: (theta: number, phi: number, lambda: number) => {
    const cosHalfTheta = Math.cos(theta/2);
    const sinHalfTheta = Math.sin(theta/2);
    return [
      [{real: cosHalfTheta, imag: 0}, {real: -sinHalfTheta * Math.cos(lambda), imag: -sinHalfTheta * Math.sin(lambda)}],
      [{real: sinHalfTheta * Math.cos(phi), imag: sinHalfTheta * Math.sin(phi)}, {real: cosHalfTheta * Math.cos(phi + lambda), imag: cosHalfTheta * Math.sin(phi + lambda)}]
    ];
  },
  
  // === SPECIAL GATES ===
  // Controlled rotation gates for QFT implementation
  CRk: (k: number) => {
    const angle = 2 * Math.PI / Math.pow(2, k);
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

// === 🟨 MULTI-QUBIT GATE BUILDERS ===
// CZ gate implementation
function buildCZMatrix(controlQubit: number, targetQubit: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map((_, i) => 
    Array(dim).fill(0).map((_, j) => i === j ? {real: 1, imag: 0} : {real: 0, imag: 0})
  );
  
  for (let state = 0; state < dim; state++) {
    const controlBit = (state >> (numQubits - 1 - controlQubit)) & 1;
    const targetBit = (state >> (numQubits - 1 - targetQubit)) & 1;
    
    if (controlBit === 1 && targetBit === 1) {
      result[state][state] = {real: -1, imag: 0}; // Apply Z gate to target when control is |1⟩
    }
  }
  
  return result;
}

// Fredkin gate (CSWAP) implementation
function buildFredkinMatrix(control: number, target1: number, target2: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map((_, i) => 
    Array(dim).fill(0).map((_, j) => i === j ? {real: 1, imag: 0} : {real: 0, imag: 0})
  );
  
  for (let state = 0; state < dim; state++) {
    const controlBit = (state >> (numQubits - 1 - control)) & 1;
    
    if (controlBit === 1) {
      const bit1 = (state >> (numQubits - 1 - target1)) & 1;
      const bit2 = (state >> (numQubits - 1 - target2)) & 1;
      
      if (bit1 !== bit2) {
        const swappedState = state ^ (1 << (numQubits - 1 - target1)) ^ (1 << (numQubits - 1 - target2));
        result[state][state] = {real: 0, imag: 0};
        result[swappedState][swappedState] = {real: 0, imag: 0};
        result[state][swappedState] = {real: 1, imag: 0};
        result[swappedState][state] = {real: 1, imag: 0};
      }
    }
  }
  
  return result;
}

// Generic controlled gate implementation
function buildControlledGateMatrix(gateMatrix: Complex[][], controlQubit: number, targetQubit: number, numQubits: number): Complex[][] {
  const dim = Math.pow(2, numQubits);
  const result: Complex[][] = Array(dim).fill(0).map((_, i) => 
    Array(dim).fill(0).map((_, j) => i === j ? {real: 1, imag: 0} : {real: 0, imag: 0})
  );
  
  for (let state = 0; state < dim; state++) {
    const controlBit = (state >> (numQubits - 1 - controlQubit)) & 1;
    
    if (controlBit === 1) {
      // Apply the gate matrix to the target qubit
      const targetBit = (state >> (numQubits - 1 - targetQubit)) & 1;
      for (let newTargetBit = 0; newTargetBit < 2; newTargetBit++) {
        const newState = state ^ ((targetBit ^ newTargetBit) << (numQubits - 1 - targetQubit));
        result[newState][state] = gateMatrix[newTargetBit][targetBit];
      }
      result[state][state] = {real: 0, imag: 0}; // Clear diagonal for controlled states
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
  console.log(`🧬 calculatePairEntanglement: Computing for qubits ${qubit1}-${qubit2} of ${numQubits} total qubits`);
  
  // Calculate entanglement using proper concurrence/entropy measures
  let entanglement = 0;
  const normalizer = stateVector.reduce((sum, amp) => sum + complex.magnitude(amp) ** 2, 0);
  
  if (normalizer === 0) {
    console.log('🧬 calculatePairEntanglement: Zero normalizer, returning 0');
    return 0;
  }
  
  // For 2-qubit subsystem, calculate concurrence-like measure
  let prob00 = 0, prob01 = 0, prob10 = 0, prob11 = 0;
  
  for (let state = 0; state < stateVector.length; state++) {
    const bit1 = (state >> (numQubits - 1 - qubit1)) & 1;
    const bit2 = (state >> (numQubits - 1 - qubit2)) & 1;
    const probability = complex.magnitude(stateVector[state]) ** 2 / normalizer;
    
    if (bit1 === 0 && bit2 === 0) prob00 += probability;
    else if (bit1 === 0 && bit2 === 1) prob01 += probability;
    else if (bit1 === 1 && bit2 === 0) prob10 += probability;
    else if (bit1 === 1 && bit2 === 1) prob11 += probability;
  }
  
  console.log(`🧬 Probabilities for qubits ${qubit1}-${qubit2}:`, { prob00, prob01, prob10, prob11 });
  
  // Calculate entanglement based on deviation from product state
  const marginal1_0 = prob00 + prob01;
  const marginal1_1 = prob10 + prob11;
  const marginal2_0 = prob00 + prob10;
  const marginal2_1 = prob01 + prob11;
  
  // If it's a product state, prob_ij = marginal_i * marginal_j
  const expected00 = marginal1_0 * marginal2_0;
  const expected01 = marginal1_0 * marginal2_1;
  const expected10 = marginal1_1 * marginal2_0;
  const expected11 = marginal1_1 * marginal2_1;
  
  // Measure deviation (entanglement strength)
  entanglement = Math.sqrt(
    Math.pow(prob00 - expected00, 2) +
    Math.pow(prob01 - expected01, 2) +
    Math.pow(prob10 - expected10, 2) +
    Math.pow(prob11 - expected11, 2)
  );
  
  const finalEntanglement = Math.min(1, entanglement * 2); // Scale and clamp
  console.log(`🧬 calculatePairEntanglement: Final entanglement for qubits ${qubit1}-${qubit2}: ${finalEntanglement}`);
  
  return finalEntanglement;
}

export class OptimizedQuantumSimulator {
  private numQubits: number;
  private stateVector: StateVector;
  private stepResults: SimulationStepData[] = [];
  private isStepMode: boolean = false;
  private currentStep: number = 0;
  private isPaused: boolean = false;
  private measurementHistory: Array<{ qubit: number; result: 0 | 1; timestamp: number }> = [];
  private classicalBits: { [key: string]: 0 | 1 } = {};
  private circuit: QuantumGate[] = [];
  private currentMode: SimulationMode = 'fast';

  // Public getter for numQubits
  get qubits(): number {
    return this.numQubits;
  }
  private realTimeMode: boolean = false;
  
  setMode(mode: SimulationMode): void {
    this.currentMode = mode;
  }
  
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
      // === 🟩 SINGLE-QUBIT GATES ===
      case 'I':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.I, gate.qubit);
        }
        break;
        
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
        
      case 'SDG':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.SDG, gate.qubit);
        }
        break;
        
      case 'T':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.T, gate.qubit);
        }
        break;
        
      case 'TDG':
        if (gate.qubit !== undefined) {
          this.applySingleQubitGate(enhancedGates.TDG, gate.qubit);
        }
        break;
        
      // === 🟦 PARAMETRIC ROTATION GATES ===
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
        
      case 'U1':
        if (gate.qubit !== undefined && gate.angle !== undefined) {
          this.applySingleQubitGate(enhancedGates.U1(gate.angle), gate.qubit);
        }
        break;
        
      case 'U2':
        if (gate.qubit !== undefined && gate.params && gate.params.length >= 2) {
          this.applySingleQubitGate(enhancedGates.U2(gate.params[0], gate.params[1]), gate.qubit);
        }
        break;
        
      case 'U3':
        if (gate.qubit !== undefined && gate.params && gate.params.length >= 3) {
          this.applySingleQubitGate(enhancedGates.U3(gate.params[0], gate.params[1], gate.params[2]), gate.qubit);
        }
        break;
        
      // === 🟨 MULTI-QUBIT GATES ===
      case 'CNOT':
      case 'CX':
        if (gate.qubits && gate.qubits.length === 2) {
          this.applyCNOT(gate.qubits[0], gate.qubits[1]);
        }
        break;
        
      case 'CZ':
        if (gate.qubits && gate.qubits.length === 2) {
          this.applyCZ(gate.qubits[0], gate.qubits[1]);
        }
        break;
        
      case 'SWAP':
        if (gate.qubits && gate.qubits.length === 2) {
          this.applySWAP(gate.qubits[0], gate.qubits[1]);
        }
        break;
        
      case 'TOFFOLI':
      case 'CCX':
        if (gate.qubits && gate.qubits.length === 3) {
          this.applyToffoli(gate.qubits[0], gate.qubits[1], gate.qubits[2]);
        }
        break;
        
      case 'FREDKIN':
      case 'CSWAP':
        if (gate.qubits && gate.qubits.length === 3) {
          this.applyFredkin(gate.qubits[0], gate.qubits[1], gate.qubits[2]);
        }
        break;
        
      // === 🟪 SPECIAL/COMPOSITE GATES ===
      case 'M':
      case 'MEASURE':
        if (gate.qubit !== undefined) {
          this.measureQubit(gate.qubit);
        }
        break;
        
      case 'RESET':
        if (gate.qubit !== undefined) {
          this.resetQubit(gate.qubit);
        }
        break;
        
      case 'QFT':
        if (gate.qubits) {
          this.applyQFT(gate.qubits);
        }
        break;
        
      case 'BARRIER':
        // Barrier is a no-op for simulation (just for circuit visualization)
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
  
  // FIXED: Correct matrix-vector multiplication (matrix * vector)
  private vectorMatrixMultiply(vector: StateVector, matrix: Complex[][]): StateVector {
    const result: StateVector = [];
    for (let i = 0; i < matrix.length; i++) {
      result[i] = {real: 0, imag: 0};
      for (let j = 0; j < vector.length; j++) {
        result[i] = complex.add(result[i], complex.multiply(matrix[i][j], vector[j]));
      }
      result[i] = normalizeComplex(result[i]);
    }
    return result;
  }
  
  private getOptimizedResult(executionTime: number): OptimizedSimulationResult {
    console.log('🎯 getOptimizedResult: Starting result generation', { 
      executionTime, 
      stateVectorLength: this.stateVector.length,
      mode: this.currentMode 
    });
    
    const measurementProbabilities = this.stateVector.map(amp => complex.magnitude(amp) ** 2);
    const entanglement = calculateAdvancedEntanglement(this.stateVector, this.numQubits);
    
    console.log('🎯 getOptimizedResult: Entanglement calculated', { 
      pairsCount: entanglement.pairs.length,
      totalEntanglement: entanglement.totalEntanglement
    });
    
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
    
    const result = {
      stateVector: this.stateVector,
      measurementProbabilities,
      qubitStates,
      entanglement,
      executionTime,
      stepResults: this.isStepMode ? this.stepResults.map(step => this.getOptimizedResult(step.timestamp)) : undefined,
      fidelity,
      mode: this.currentMode
    };
    
    console.log('🎯 getOptimizedResult: Final result', { 
      hasEntanglement: !!result.entanglement,
      entanglementPairs: result.entanglement?.pairs?.length || 0,
      mode: result.mode,
      fidelity: result.fidelity
    });
    
    return result;
  }
  
  getStepResults(): SimulationStepData[] {
    return this.stepResults;
  }
  
  // === MISSING METHODS IMPLEMENTATION ===
  private applyCZ(controlQubit: number, targetQubit: number): void {
    const czMatrix = buildCZMatrix(controlQubit, targetQubit, this.numQubits);
    this.stateVector = this.vectorMatrixMultiply(this.stateVector, czMatrix);
  }
  
  private applyFredkin(control: number, target1: number, target2: number): void {
    const fredkinMatrix = buildFredkinMatrix(control, target1, target2, this.numQubits);
    this.stateVector = this.vectorMatrixMultiply(this.stateVector, fredkinMatrix);
  }
  
  private measureQubit(qubit: number): 0 | 1 {
    // Calculate probabilities for |0⟩ and |1⟩
    let prob0 = 0, prob1 = 0;
    
    for (let state = 0; state < this.stateVector.length; state++) {
      const qubitValue = (state >> (this.numQubits - 1 - qubit)) & 1;
      const probability = complex.magnitude(this.stateVector[state]) ** 2;
      
      if (qubitValue === 0) {
        prob0 += probability;
      } else {
        prob1 += probability;
      }
    }
    
    // Simulate measurement outcome
    const outcome = Math.random() < prob0 ? 0 : 1;
    
    // Collapse state vector
    const newStateVector: StateVector = Array(this.stateVector.length).fill(0).map(() => ({real: 0, imag: 0}));
    let normalization = 0;
    
    for (let state = 0; state < this.stateVector.length; state++) {
      const qubitValue = (state >> (this.numQubits - 1 - qubit)) & 1;
      if (qubitValue === outcome) {
        newStateVector[state] = this.stateVector[state];
        normalization += complex.magnitude(this.stateVector[state]) ** 2;
      }
    }
    
    // Normalize
    const normFactor = 1 / Math.sqrt(normalization);
    for (let i = 0; i < newStateVector.length; i++) {
      newStateVector[i] = complex.multiply(newStateVector[i], {real: normFactor, imag: 0});
    }
    
    this.stateVector = newStateVector;
    this.measurementHistory.push({ qubit, result: outcome as 0 | 1, timestamp: Date.now() });
    
    return outcome as 0 | 1;
  }
  
  private resetQubit(qubit: number): void {
    // Measure qubit and if it's |1⟩, apply X gate to reset to |0⟩
    const measurement = this.measureQubit(qubit);
    if (measurement === 1) {
      this.applySingleQubitGate(enhancedGates.X, qubit);
    }
  }
  
  private applyQFT(qubits: number[]): void {
    // Quantum Fourier Transform implementation
    const n = qubits.length;
    
    for (let i = 0; i < n; i++) {
      // Apply Hadamard to qubit i
      this.applySingleQubitGate(enhancedGates.H, qubits[i]);
      
      // Apply controlled rotation gates
      for (let j = i + 1; j < n; j++) {
        const k = j - i + 1;
        const controlledRZ = buildControlledGateMatrix(enhancedGates.CRk(k), qubits[j], qubits[i], this.numQubits);
        this.stateVector = this.vectorMatrixMultiply(this.stateVector, controlledRZ);
      }
    }
    
    // Reverse the order of qubits (bit reversal)
    for (let i = 0; i < Math.floor(n / 2); i++) {
      this.applySWAP(qubits[i], qubits[n - 1 - i]);
    }
  }
}

export const optimizedQuantumSimulator = new OptimizedQuantumSimulator(5);