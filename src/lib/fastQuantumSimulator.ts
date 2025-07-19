
// Fast Classical Quantum Simulator supporting up to 30 qubits
import { Complex } from './complexNumbers';

export interface NoiseModel {
  depolarizing?: number;
  amplitude_damping?: number;
  phase_damping?: number;
  bitFlip?: number;
  phaseFlip?: number;
}

export interface SimulationConfig {
  numQubits: number;
  shots: number;
  noiseModel?: NoiseModel;
  idealSimulation: boolean;
  enableRuntimeAnalysis: boolean;
}

export interface SimulationMetrics {
  executionTime: number;
  memoryUsage: number;
  gateCount: number;
  circuitDepth: number;
  fidelity: number;
  entanglementMeasure: number;
}

export interface FastSimulationResult {
  stateVector: Complex[];
  probabilities: number[];
  counts: Record<string, number>;
  metrics: SimulationMetrics;
  bitstrings: string[];
  amplitudes: { state: string; amplitude: Complex; probability: number }[];
}

export interface QuantumOperation {
  type: string;
  qubits: number[];
  angle?: number;
  params?: number[];
}

export class FastQuantumSimulator {
  private config: SimulationConfig;
  private stateVector: Complex[];
  private metrics: Partial<SimulationMetrics> = {};
  private startTime: number = 0;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.validateConfiguration();
    this.reset();
  }

  private validateConfiguration(): void {
    if (this.config.numQubits > 30) {
      throw new Error('Maximum supported qubits is 30');
    }
    if (this.config.numQubits < 1) {
      throw new Error('Minimum required qubits is 1');
    }
  }

  reset(): void {
    const dim = 2 ** this.config.numQubits;
    this.stateVector = new Array(dim).fill(null).map(() => new Complex(0, 0));
    this.stateVector[0] = new Complex(1, 0); // |0...0⟩ state
    this.metrics = {};
  }

  // Optimized single-qubit gate application
  applySingleQubitGate(gate: number[][], qubit: number): void {
    const numQubits = this.config.numQubits;
    const dim = 2 ** numQubits;
    const newStateVector = new Array(dim).fill(null).map(() => new Complex(0, 0));
    
    for (let state = 0; state < dim; state++) {
      const qubitBit = (state >> (numQubits - 1 - qubit)) & 1;
      const flippedState = state ^ (1 << (numQubits - 1 - qubit));
      
      // Apply gate matrix
      const g00 = new Complex(gate[0][0], gate[0][1] || 0);
      const g01 = new Complex(gate[0][2] || 0, gate[0][3] || 0);
      const g10 = new Complex(gate[1][0], gate[1][1] || 0);
      const g11 = new Complex(gate[1][2] || 0, gate[1][3] || 0);
      
      if (qubitBit === 0) {
        newStateVector[state] = newStateVector[state].add(
          this.stateVector[state].multiply(g00)
        );
        newStateVector[flippedState] = newStateVector[flippedState].add(
          this.stateVector[state].multiply(g10)
        );
      } else {
        newStateVector[flippedState] = newStateVector[flippedState].add(
          this.stateVector[state].multiply(g01)
        );
        newStateVector[state] = newStateVector[state].add(
          this.stateVector[state].multiply(g11)
        );
      }
    }
    
    this.stateVector = newStateVector;
    
    // Apply noise if enabled
    if (!this.config.idealSimulation && this.config.noiseModel) {
      this.applyNoise(qubit);
    }
  }

  // Optimized CNOT gate
  applyCNOT(control: number, target: number): void {
    const numQubits = this.config.numQubits;
    const dim = 2 ** numQubits;
    
    for (let state = 0; state < dim; state++) {
      const controlBit = (state >> (numQubits - 1 - control)) & 1;
      if (controlBit === 1) {
        const targetBit = (state >> (numQubits - 1 - target)) & 1;
        const flippedState = state ^ (1 << (numQubits - 1 - target));
        
        // Swap amplitudes
        const temp = this.stateVector[state];
        this.stateVector[state] = this.stateVector[flippedState];
        this.stateVector[flippedState] = temp;
      }
    }
    
    // Apply noise to both qubits if enabled
    if (!this.config.idealSimulation && this.config.noiseModel) {
      this.applyNoise(control);
      this.applyNoise(target);
    }
  }

  private applyNoise(qubit: number): void {
    if (!this.config.noiseModel) return;
    
    const noise = this.config.noiseModel;
    
    // Depolarizing noise
    if (noise.depolarizing && Math.random() < noise.depolarizing) {
      const pauli = Math.floor(Math.random() * 3);
      switch (pauli) {
        case 0: this.applyPauliX(qubit); break;
        case 1: this.applyPauliY(qubit); break;
        case 2: this.applyPauliZ(qubit); break;
      }
    }
    
    // Amplitude damping
    if (noise.amplitude_damping && Math.random() < noise.amplitude_damping) {
      this.applyAmplitudeDamping(qubit, noise.amplitude_damping);
    }
  }

  private applyPauliX(qubit: number): void {
    const xGate = [[0, 0, 1, 0], [1, 0, 0, 0]]; // [real, imag, real, imag] format
    this.applySingleQubitGate(xGate, qubit);
  }

  private applyPauliY(qubit: number): void {
    const yGate = [[0, 0, 0, -1], [0, 1, 0, 0]];
    this.applySingleQubitGate(yGate, qubit);
  }

  private applyPauliZ(qubit: number): void {
    const zGate = [[1, 0, 0, 0], [0, 0, -1, 0]];
    this.applySingleQubitGate(zGate, qubit);
  }

  private applyAmplitudeDamping(qubit: number, gamma: number): void {
    // Simplified amplitude damping implementation
    const numQubits = this.config.numQubits;
    const dim = 2 ** numQubits;
    
    for (let state = 0; state < dim; state++) {
      const qubitBit = (state >> (numQubits - 1 - qubit)) & 1;
      if (qubitBit === 1) {
        this.stateVector[state] = this.stateVector[state].multiply(
          new Complex(Math.sqrt(1 - gamma), 0)
        );
      }
    }
  }

  // High-performance shot sampling
  sampleShots(): Record<string, number> {
    const counts: Record<string, number> = {};
    const probabilities = this.stateVector.map(amp => amp.magnitude() ** 2);
    const cumulativeProbs = this.buildCumulativeDistribution(probabilities);
    
    for (let shot = 0; shot < this.config.shots; shot++) {
      const rand = Math.random();
      const stateIndex = this.binarySearchSample(cumulativeProbs, rand);
      const bitstring = stateIndex.toString(2).padStart(this.config.numQubits, '0');
      counts[bitstring] = (counts[bitstring] || 0) + 1;
    }
    
    return counts;
  }

  private buildCumulativeDistribution(probabilities: number[]): number[] {
    const cumulative = new Array(probabilities.length);
    cumulative[0] = probabilities[0];
    
    for (let i = 1; i < probabilities.length; i++) {
      cumulative[i] = cumulative[i - 1] + probabilities[i];
    }
    
    return cumulative;
  }

  private binarySearchSample(cumulativeProbs: number[], target: number): number {
    let left = 0;
    let right = cumulativeProbs.length - 1;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (cumulativeProbs[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return left;
  }

  // Execute full circuit simulation
  async simulate(operations: QuantumOperation[]): Promise<FastSimulationResult> {
    this.startTime = performance.now();
    this.reset();
    
    let gateCount = 0;
    let circuitDepth = 0;
    
    // Apply operations
    for (const op of operations) {
      gateCount++;
      circuitDepth = Math.max(circuitDepth, gateCount);
      
      switch (op.type) {
        case 'H':
          const hGate = [[1/Math.sqrt(2), 0, 1/Math.sqrt(2), 0], [1/Math.sqrt(2), 0, -1/Math.sqrt(2), 0]];
          this.applySingleQubitGate(hGate, op.qubits[0]);
          break;
          
        case 'X':
          this.applyPauliX(op.qubits[0]);
          break;
          
        case 'Y':
          this.applyPauliY(op.qubits[0]);
          break;
          
        case 'Z':
          this.applyPauliZ(op.qubits[0]);
          break;
          
        case 'CNOT':
          this.applyCNOT(op.qubits[0], op.qubits[1]);
          break;
          
        case 'RX':
          if (op.angle !== undefined) {
            const cos = Math.cos(op.angle / 2);
            const sin = Math.sin(op.angle / 2);
            const rxGate = [[cos, 0, 0, -sin], [0, -sin, cos, 0]];
            this.applySingleQubitGate(rxGate, op.qubits[0]);
          }
          break;
          
        case 'RY':
          if (op.angle !== undefined) {
            const cos = Math.cos(op.angle / 2);
            const sin = Math.sin(op.angle / 2);
            const ryGate = [[cos, 0, -sin, 0], [sin, 0, cos, 0]];
            this.applySingleQubitGate(ryGate, op.qubits[0]);
          }
          break;
      }
      
      // Yield control periodically for large circuits
      if (gateCount % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    // Calculate final results
    const executionTime = performance.now() - this.startTime;
    const probabilities = this.stateVector.map(amp => amp.magnitude() ** 2);
    const counts = this.sampleShots();
    const fidelity = this.calculateFidelity();
    
    // Generate bitstrings and amplitudes for visualization
    const bitstrings = Object.keys(counts);
    const amplitudes = this.stateVector
      .map((amp, index) => ({
        state: index.toString(2).padStart(this.config.numQubits, '0'),
        amplitude: amp,
        probability: amp.magnitude() ** 2
      }))
      .filter(item => item.probability > 1e-10)
      .sort((a, b) => b.probability - a.probability);
    
    return {
      stateVector: this.stateVector,
      probabilities,
      counts,
      bitstrings,
      amplitudes,
      metrics: {
        executionTime,
        memoryUsage: this.estimateMemoryUsage(),
        gateCount,
        circuitDepth,
        fidelity,
        entanglementMeasure: this.calculateEntanglement()
      }
    };
  }

  private calculateFidelity(): number {
    const totalProb = this.stateVector.reduce((sum, amp) => sum + amp.magnitude() ** 2, 0);
    return Math.min(1, totalProb);
  }

  private calculateEntanglement(): number {
    // Simple entanglement measure based on participation ratio
    const probabilities = this.stateVector.map(amp => amp.magnitude() ** 2);
    const participationRatio = 1 / probabilities.reduce((sum, p) => sum + p * p, 0);
    return Math.min(1, participationRatio / (2 ** this.config.numQubits));
  }

  private estimateMemoryUsage(): number {
    // Estimate memory usage in MB
    const stateVectorSize = this.stateVector.length * 16; // 16 bytes per complex number
    return stateVectorSize / (1024 * 1024);
  }
}
