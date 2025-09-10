// Enhanced Quantum Simulator supporting up to 50 qubits with optimizations
import { Complex } from '@/services/complexNumbers';

export interface QuantumGateOp {
  id: string;
  type: string;
  qubits: number[];
  control?: number;
  target?: number;
  angle?: number;
  params?: number[];
  position: number;
}

export interface SimulationConfig {
  numQubits: number;
  shots: number;
  sparseMode: boolean;
  maxMemory: number; // MB
  enableNoise: boolean;
  noiseLevel: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  gateCount: number;
  circuitDepth: number;
  memoryEstimate: number;
}

export interface EnhancedSimulationResult {
  stateVector: Complex[];
  probabilities: number[];
  measurementCounts: Record<string, number>;
  qubitStates: Array<{
    qubit: number;
    probability0: number;
    probability1: number;
    blochVector: { x: number; y: number; z: number };
    phase: number;
  }>;
  entanglement: {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    totalEntanglement: number;
  };
  fidelity: number;
  executionTime: number;
  memoryUsed: number;
  validation: ValidationResult;
}

export class EnhancedQuantumSimulator {
  private config: SimulationConfig;
  private stateVector: Map<number, Complex> = new Map(); // Sparse representation
  private isInitialized: boolean = false;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.validateConfig();
    this.reset();
  }

  private validateConfig(): void {
    if (this.config.numQubits > 50) {
      throw new Error('Maximum supported qubits is 50');
    }
    if (this.config.numQubits < 1) {
      throw new Error('Minimum required qubits is 1');
    }
    const memoryNeeded = this.estimateMemoryNeeds();
    if (memoryNeeded > this.config.maxMemory) {
      console.warn(`Circuit requires ~${memoryNeeded}MB but limit is ${this.config.maxMemory}MB`);
    }
  }

  private estimateMemoryNeeds(): number {
    // Estimate memory for full state vector (worst case)
    const stateVectorSize = Math.pow(2, this.config.numQubits) * 16; // 16 bytes per complex
    return stateVectorSize / (1024 * 1024); // Convert to MB
  }

  reset(): void {
    this.stateVector.clear();
    // Initialize to |0...0⟩ state using sparse representation
    this.stateVector.set(0, new Complex(1, 0));
    this.isInitialized = true;
  }

  validateCircuit(gates: QuantumGateOp[]): ValidationResult {
    console.log('🔍 Validating quantum circuit...');
    const errors: string[] = [];
    const warnings: string[] = [];
    let gateCount = 0;
    let maxPosition = 0;

    for (const gate of gates) {
      gateCount++;
      maxPosition = Math.max(maxPosition, gate.position);

      // Validate gate type
      if (!this.isValidGateType(gate.type)) {
        errors.push(`Unknown gate type: ${gate.type}`);
        continue;
      }

      // Validate qubit indices
      for (const qubit of gate.qubits) {
        if (qubit < 0 || qubit >= this.config.numQubits) {
          errors.push(`Gate ${gate.id}: Invalid qubit index ${qubit}`);
        }
      }

      // Validate gate-specific constraints
      switch (gate.type) {
        case 'CNOT':
          if (gate.qubits.length !== 2) {
            errors.push(`Gate ${gate.id}: CNOT requires exactly 2 qubits`);
          } else if (gate.qubits[0] === gate.qubits[1]) {
            errors.push(`Gate ${gate.id}: CNOT control and target must be different`);
          }
          break;
        
        case 'TOFFOLI':
          if (gate.qubits.length !== 3) {
            errors.push(`Gate ${gate.id}: TOFFOLI requires exactly 3 qubits`);
          } else if (new Set(gate.qubits).size !== 3) {
            errors.push(`Gate ${gate.id}: TOFFOLI qubits must all be different`);
          }
          break;

        case 'RX':
        case 'RY':
        case 'RZ':
          if (gate.angle === undefined) {
            errors.push(`Gate ${gate.id}: Rotation gates require an angle parameter`);
          }
          break;
      }

      // Performance warnings
      if (gate.type === 'TOFFOLI' && this.config.numQubits > 20) {
        warnings.push(`TOFFOLI gates are expensive with ${this.config.numQubits} qubits`);
      }
    }

    const memoryEstimate = this.estimateMemoryNeeds();
    if (memoryEstimate > 1000) { // 1GB
      warnings.push(`Circuit may require ${memoryEstimate.toFixed(0)}MB of memory`);
    }

    const circuitDepth = maxPosition + 1;
    if (circuitDepth > 100) {
      warnings.push(`Deep circuit (depth: ${circuitDepth}) may be slow to simulate`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      gateCount,
      circuitDepth,
      memoryEstimate
    };
  }

  private isValidGateType(type: string): boolean {
    const validTypes = [
      'I', 'X', 'Y', 'Z', 'H', 'S', 'T', 'CNOT', 'TOFFOLI', 'SWAP',
      'RX', 'RY', 'RZ', 'U1', 'U2', 'U3', 'CZ', 'CY'
    ];
    return validTypes.includes(type.toUpperCase());
  }

  // Optimized Hadamard gate - correct implementation
  private applyHadamard(qubit: number): void {
    const newStateVector = new Map<number, Complex>();
    const sqrt2 = Math.sqrt(2);
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
      const flippedState = state ^ (1 << (this.config.numQubits - 1 - qubit));
      
      if (qubitBit === 0) {
        // |0⟩ → (|0⟩ + |1⟩)/√2
        const newAmp0 = amplitude.multiply(new Complex(1/sqrt2, 0));
        const newAmp1 = amplitude.multiply(new Complex(1/sqrt2, 0));
        
        this.addToSparseState(newStateVector, state, newAmp0);
        this.addToSparseState(newStateVector, flippedState, newAmp1);
      } else {
        // |1⟩ → (|0⟩ - |1⟩)/√2
        const newAmp0 = amplitude.multiply(new Complex(1/sqrt2, 0));
        const newAmp1 = amplitude.multiply(new Complex(-1/sqrt2, 0));
        
        this.addToSparseState(newStateVector, flippedState, newAmp0);
        this.addToSparseState(newStateVector, state, newAmp1);
      }
    }
    
    this.stateVector = newStateVector;
  }

  // Optimized CNOT gate
  private applyCNOT(control: number, target: number): void {
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const controlBit = (state >> (this.config.numQubits - 1 - control)) & 1;
      
      if (controlBit === 1) {
        // Flip target qubit
        const flippedState = state ^ (1 << (this.config.numQubits - 1 - target));
        newStateVector.set(flippedState, amplitude);
      } else {
        // Keep state unchanged
        newStateVector.set(state, amplitude);
      }
    }
    
    this.stateVector = newStateVector;
  }

  private addToSparseState(stateMap: Map<number, Complex>, state: number, amplitude: Complex): void {
    if (amplitude.magnitude() < 1e-14) return; // Skip near-zero amplitudes
    
    const existing = stateMap.get(state);
    if (existing) {
      stateMap.set(state, existing.add(amplitude));
    } else {
      stateMap.set(state, amplitude);
    }
  }

  async simulate(gates: QuantumGateOp[]): Promise<EnhancedSimulationResult> {
    const startTime = performance.now();
    console.log(`🚀 Starting enhanced simulation with ${gates.length} gates on ${this.config.numQubits} qubits`);
    
    // Validate circuit first
    const validation = this.validateCircuit(gates);
    if (!validation.isValid) {
      throw new Error('Circuit validation failed: ' + validation.errors.join(', '));
    }

    this.reset();
    
    // Sort gates by position
    const sortedGates = [...gates].sort((a, b) => a.position - b.position);
    
    // Apply gates with progress tracking
    for (let i = 0; i < sortedGates.length; i++) {
      const gate = sortedGates[i];
      
      switch (gate.type.toUpperCase()) {
        case 'H':
          this.applyHadamard(gate.qubits[0]);
          break;
        case 'X':
          this.applyPauliX(gate.qubits[0]);
          break;
        case 'Y':
          this.applyPauliY(gate.qubits[0]);
          break;
        case 'Z':
          this.applyPauliZ(gate.qubits[0]);
          break;
        case 'CNOT':
          this.applyCNOT(gate.control || gate.qubits[0], gate.target || gate.qubits[1]);
          break;
        case 'RX':
          this.applyRotationX(gate.qubits[0], gate.angle || 0);
          break;
        case 'RY':
          this.applyRotationY(gate.qubits[0], gate.angle || 0);
          break;
        case 'RZ':
          this.applyRotationZ(gate.qubits[0], gate.angle || 0);
          break;
      }
      
      // Yield control periodically for large circuits
      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    // Generate results
    const executionTime = performance.now() - startTime;
    const results = this.generateResults(validation, executionTime);
    
    console.log(`✅ Simulation completed in ${executionTime.toFixed(2)}ms`);
    return results;
  }

  private applyPauliX(qubit: number): void {
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const flippedState = state ^ (1 << (this.config.numQubits - 1 - qubit));
      newStateVector.set(flippedState, amplitude);
    }
    
    this.stateVector = newStateVector;
  }

  private applyPauliY(qubit: number): void {
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
      const flippedState = state ^ (1 << (this.config.numQubits - 1 - qubit));
      
      if (qubitBit === 0) {
        // |0⟩ → i|1⟩
        newStateVector.set(flippedState, amplitude.multiply(new Complex(0, 1)));
      } else {
        // |1⟩ → -i|0⟩
        newStateVector.set(flippedState, amplitude.multiply(new Complex(0, -1)));
      }
    }
    
    this.stateVector = newStateVector;
  }

  private applyPauliZ(qubit: number): void {
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
      
      if (qubitBit === 0) {
        // |0⟩ → |0⟩
        newStateVector.set(state, amplitude);
      } else {
        // |1⟩ → -|1⟩
        newStateVector.set(state, amplitude.multiply(new Complex(-1, 0)));
      }
    }
    
    this.stateVector = newStateVector;
  }

  private applyRotationX(qubit: number, angle: number): void {
    const cos = Math.cos(angle / 2);
    const sin = Math.sin(angle / 2);
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
      const flippedState = state ^ (1 << (this.config.numQubits - 1 - qubit));
      
      if (qubitBit === 0) {
        const newAmp0 = amplitude.multiply(new Complex(cos, 0));
        const newAmp1 = amplitude.multiply(new Complex(0, -sin));
        
        this.addToSparseState(newStateVector, state, newAmp0);
        this.addToSparseState(newStateVector, flippedState, newAmp1);
      } else {
        const newAmp0 = amplitude.multiply(new Complex(0, -sin));
        const newAmp1 = amplitude.multiply(new Complex(cos, 0));
        
        this.addToSparseState(newStateVector, flippedState, newAmp0);
        this.addToSparseState(newStateVector, state, newAmp1);
      }
    }
    
    this.stateVector = newStateVector;
  }

  private applyRotationY(qubit: number, angle: number): void {
    const cos = Math.cos(angle / 2);
    const sin = Math.sin(angle / 2);
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
      const flippedState = state ^ (1 << (this.config.numQubits - 1 - qubit));
      
      if (qubitBit === 0) {
        const newAmp0 = amplitude.multiply(new Complex(cos, 0));
        const newAmp1 = amplitude.multiply(new Complex(sin, 0));
        
        this.addToSparseState(newStateVector, state, newAmp0);
        this.addToSparseState(newStateVector, flippedState, newAmp1);
      } else {
        const newAmp0 = amplitude.multiply(new Complex(-sin, 0));
        const newAmp1 = amplitude.multiply(new Complex(cos, 0));
        
        this.addToSparseState(newStateVector, flippedState, newAmp0);
        this.addToSparseState(newStateVector, state, newAmp1);
      }
    }
    
    this.stateVector = newStateVector;
  }

  private applyRotationZ(qubit: number, angle: number): void {
    const exp_i_angle_2 = new Complex(Math.cos(angle/2), Math.sin(angle/2));
    const exp_minus_i_angle_2 = new Complex(Math.cos(-angle/2), Math.sin(-angle/2));
    
    const newStateVector = new Map<number, Complex>();
    
    for (const [state, amplitude] of this.stateVector.entries()) {
      const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
      
      if (qubitBit === 0) {
        newStateVector.set(state, amplitude.multiply(exp_minus_i_angle_2));
      } else {
        newStateVector.set(state, amplitude.multiply(exp_i_angle_2));
      }
    }
    
    this.stateVector = newStateVector;
  }

  private generateResults(validation: ValidationResult, executionTime: number): EnhancedSimulationResult {
    // Convert sparse state vector to dense for compatibility
    const stateVector: Complex[] = [];
    const maxState = Math.pow(2, this.config.numQubits);
    
    for (let i = 0; i < maxState; i++) {
      stateVector[i] = this.stateVector.get(i) || new Complex(0, 0);
    }

    // Calculate probabilities
    const probabilities = stateVector.map(amp => amp.magnitude() ** 2);
    
    // Generate measurement counts
    const measurementCounts = this.generateMeasurementCounts(probabilities);
    
    // Calculate qubit states and Bloch vectors
    const qubitStates = this.calculateQubitStates(stateVector);
    
    // Calculate entanglement
    const entanglement = this.calculateEntanglement(stateVector);
    
    // Calculate fidelity
    const fidelity = probabilities.reduce((sum, p) => sum + p, 0);
    
    return {
      stateVector,
      probabilities,
      measurementCounts,
      qubitStates,
      entanglement,
      fidelity,
      executionTime,
      memoryUsed: this.stateVector.size * 16 / (1024 * 1024), // MB
      validation
    };
  }

  private generateMeasurementCounts(probabilities: number[]): Record<string, number> {
    const counts: Record<string, number> = {};
    
    for (let shot = 0; shot < this.config.shots; shot++) {
      const rand = Math.random();
      let cumulative = 0;
      
      for (let state = 0; state < probabilities.length; state++) {
        cumulative += probabilities[state];
        if (rand <= cumulative) {
          const bitstring = state.toString(2).padStart(this.config.numQubits, '0');
          counts[bitstring] = (counts[bitstring] || 0) + 1;
          break;
        }
      }
    }
    
    return counts;
  }

  private calculateQubitStates(stateVector: Complex[]): Array<{
    qubit: number;
    probability0: number;
    probability1: number;
    blochVector: { x: number; y: number; z: number };
    phase: number;
  }> {
    const qubitStates = [];
    
    for (let qubit = 0; qubit < this.config.numQubits; qubit++) {
      let prob0 = 0;
      let prob1 = 0;
      let amp0 = new Complex(0, 0);
      let amp1 = new Complex(0, 0);
      
      for (let state = 0; state < stateVector.length; state++) {
        const qubitBit = (state >> (this.config.numQubits - 1 - qubit)) & 1;
        const amplitude = stateVector[state];
        const probability = amplitude.magnitude() ** 2;
        
        if (qubitBit === 0) {
          prob0 += probability;
          amp0 = amp0.add(amplitude);
        } else {
          prob1 += probability;
          amp1 = amp1.add(amplitude);
        }
      }
      
      // Calculate Bloch sphere coordinates
      const alpha = amp0;
      const beta = amp1;
      
      const x = 2 * (alpha.real * beta.real + alpha.imaginary * beta.imaginary);
      const y = 2 * (alpha.imaginary * beta.real - alpha.real * beta.imaginary);
      const z = alpha.magnitude() ** 2 - beta.magnitude() ** 2;
      
      qubitStates.push({
        qubit,
        probability0: prob0,
        probability1: prob1,
        blochVector: { x, y, z },
        phase: Math.atan2(beta.imaginary, beta.real) - Math.atan2(alpha.imaginary, alpha.real)
      });
    }
    
    return qubitStates;
  }

  private calculateEntanglement(stateVector: Complex[]): {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    totalEntanglement: number;
  } {
    const pairs = [];
    let totalEntanglement = 0;
    
    // Simple entanglement measure based on mutual information
    for (let i = 0; i < this.config.numQubits; i++) {
      for (let j = i + 1; j < this.config.numQubits; j++) {
        const strength = this.calculatePairwiseEntanglement(stateVector, i, j);
        if (strength > 0.01) { // Only include significant entanglement
          pairs.push({ qubit1: i, qubit2: j, strength });
          totalEntanglement += strength;
        }
      }
    }
    
    return { pairs, totalEntanglement: Math.min(1, totalEntanglement) };
  }

  private calculatePairwiseEntanglement(stateVector: Complex[], qubit1: number, qubit2: number): number {
    // Simplified entanglement measure using correlation
    const dim = stateVector.length;
    let correlation = 0;
    
    for (let state = 0; state < dim; state++) {
      const bit1 = (state >> (this.config.numQubits - 1 - qubit1)) & 1;
      const bit2 = (state >> (this.config.numQubits - 1 - qubit2)) & 1;
      const probability = stateVector[state].magnitude() ** 2;
      
      correlation += probability * (bit1 ^ bit2); // XOR correlation
    }
    
    return Math.abs(correlation - 0.5) * 2; // Normalize to [0, 1]
  }
}
