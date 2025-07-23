import { Complex } from './complexNumbers';

export interface QuantumBackendResult {
  stateVector: { real: number; imaginary: number; magnitude: number; phase: number }[];
  measurementProbabilities: Record<string, number>;
  qubitStates: Array<{ 
    qubit: number; 
    state: string;
    amplitude: { real: number; imag: number };
    probability: number;
    phase: number;
    probability0: number; 
    probability1: number; 
  }>;
  blochSphereData: Array<{ 
    qubit: number; 
    x: number; 
    y: number; 
    z: number;
    theta: number;
    phi: number;
  }>;
  executionTime: number;
  backend: string;
  jobId?: string;
  counts?: Record<string, number>;
  entanglement?: {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    totalEntanglement: number;
    entanglementThreads: Array<{ qubits: number[]; strength: number }>;
  };
  error?: string;
}

export interface QuantumCircuit {
  gates: Array<{
    type: string;
    qubit?: number;
    qubits?: number[];
    controlQubit?: number;
    angle?: number;
    parameters?: { params: number[] };
  }>;
  qubits: number;
  shots?: number;
}

class QuantumBackendService {
  private apiKey: string | null = null;
  private simulationCache = new Map<string, QuantumBackendResult>();
  private maxCacheSize = 100;

  async executeCircuit(
    circuit: QuantumCircuit, 
    backend: 'qiskit' | 'qutip' | 'braket' | 'local' = 'local',
    shots: number = 1024
  ): Promise<QuantumBackendResult> {
    console.log('🚀 QuantumBackendService: executeCircuit called', { backend, shots, gateCount: circuit.gates.length });
    
    // Create cache key
    const cacheKey = this.createCacheKey(circuit, backend, shots);
    
    // Check cache first
    if (this.simulationCache.has(cacheKey)) {
      console.log('⚡ Using cached simulation result');
      return this.simulationCache.get(cacheKey)!;
    }
    
    const startTime = performance.now();
    
    try {
      // For better performance, limit the number of qubits for complex circuits
      const numQubits = Math.min(circuit.qubits, 8); // Limit to 8 qubits max
      const stateSize = 2 ** numQubits;
      
      // Use optimized state vector initialization
      let stateVector = new Array(stateSize);
      stateVector.fill(new Complex(0, 0));
      stateVector[0] = new Complex(1, 0); // |00000⟩
      
      console.log('🚀 Processing', circuit.gates.length, 'gates for', numQubits, 'qubits');

      // Process gates in batches for better performance
      const batchSize = 20;
      for (let i = 0; i < circuit.gates.length; i += batchSize) {
        const batch = circuit.gates.slice(i, i + batchSize);
        
        for (const gate of batch) {
          stateVector = this.processGateOptimized(gate, stateVector, numQubits);
        }
        
        // Yield control periodically
        if (i + batchSize < circuit.gates.length) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      // Normalize state vector
      stateVector = this.normalizeStateVector(stateVector);

      // Calculate results efficiently
      const measurementProbabilities = this.calculateMeasurementProbabilities(stateVector, numQubits);
      const qubitStates = this.calculateQubitStates(stateVector, numQubits);
      const blochSphereData = this.calculateBlochSphereData(stateVector, numQubits);
      const entanglement = this.calculateEntanglementOptimized(stateVector, numQubits);

      // Generate counts for shot simulation
      const counts = this.simulateShots(measurementProbabilities, Math.min(shots, 1024)); // Limit shots

      const executionTime = performance.now() - startTime;
      
      const result: QuantumBackendResult = {
        stateVector: stateVector.map(amp => ({
          real: amp.real,
          imaginary: amp.imaginary,
          magnitude: amp.magnitude(),
          phase: amp.phase()
        })),
        measurementProbabilities,
        qubitStates,
        blochSphereData,
        entanglement,
        executionTime,
        backend,
        jobId: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        counts
      };

      // Cache the result
      this.cacheResult(cacheKey, result);
      
      return result;

    } catch (error) {
      console.error('❌ QuantumBackendService error:', error);
      throw error;
    }
  }

  private createCacheKey(circuit: QuantumCircuit, backend: string, shots: number): string {
    const gateString = circuit.gates.map(g => `${g.type}-${g.qubit || 0}-${g.angle || 0}`).join('|');
    return `${backend}-${circuit.qubits}-${shots}-${gateString}`;
  }

  private cacheResult(key: string, result: QuantumBackendResult): void {
    if (this.simulationCache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.simulationCache.keys().next().value;
      this.simulationCache.delete(firstKey);
    }
    this.simulationCache.set(key, result);
  }

  private processGateOptimized(gate: any, stateVector: Complex[], numQubits: number): Complex[] {
    switch (gate.type) {
      case 'H':
        return this.applyHadamardOptimized(stateVector, gate.qubit!, numQubits);
      case 'X':
        return this.applyPauliXOptimized(stateVector, gate.qubit!, numQubits);
      case 'Y':
        return this.applyPauliY(stateVector, gate.qubit!, numQubits);
      case 'Z':
        return this.applyPauliZOptimized(stateVector, gate.qubit!, numQubits);
      case 'S':
        return this.applyPhaseS(stateVector, gate.qubit!, numQubits);
      case 'T':
        return this.applyTGate(stateVector, gate.qubit!, numQubits);
      case 'CNOT':
        const controlQubit = gate.controlQubit !== undefined ? gate.controlQubit : gate.qubits?.[0] || 0;
        const targetQubit = gate.qubit !== undefined ? gate.qubit : gate.qubits?.[1] || 1;
        return this.applyCNOTOptimized(stateVector, controlQubit, targetQubit, numQubits);
      case 'CZ':
        return this.applyCZ(stateVector, gate.qubits?.[0] || 0, gate.qubits?.[1] || 1, numQubits);
      case 'SWAP':
        return this.applySWAP(stateVector, gate.qubits?.[0] || 0, gate.qubits?.[1] || 1, numQubits);
      case 'RX':
        return this.applyRotationX(stateVector, gate.qubit!, gate.angle || 0, numQubits);
      case 'RY':
        return this.applyRotationY(stateVector, gate.qubit!, gate.angle || 0, numQubits);
      case 'RZ':
        return this.applyRotationZ(stateVector, gate.qubit!, gate.angle || 0, numQubits);
      default:
        return stateVector;
    }
  }

  private applyHadamardOptimized(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = new Array(stateVector.length);
    const factor = 1 / Math.sqrt(2);
    const qubitMask = 1 << qubit;

    for (let i = 0; i < stateVector.length; i++) {
      const flippedIndex = i ^ qubitMask;
      const qubitBit = (i >> qubit) & 1;
      
      if (qubitBit === 0) {
        newStateVector[i] = stateVector[i].multiply(new Complex(factor, 0)).add(stateVector[flippedIndex].multiply(new Complex(factor, 0)));
        newStateVector[flippedIndex] = stateVector[i].multiply(new Complex(factor, 0)).add(stateVector[flippedIndex].multiply(new Complex(-factor, 0)));
      }
    }

    return newStateVector;
  }

  private applyPauliXOptimized(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    const qubitMask = 1 << qubit;
    
    for (let i = 0; i < stateVector.length; i++) {
      const flippedIndex = i ^ qubitMask;
      if (i < flippedIndex) {
        [newStateVector[i], newStateVector[flippedIndex]] = [newStateVector[flippedIndex], newStateVector[i]];
      }
    }
    
    return newStateVector;
  }

  private applyPauliZOptimized(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    const qubitMask = 1 << qubit;
    
    for (let i = 0; i < stateVector.length; i++) {
      if (i & qubitMask) {
        newStateVector[i] = newStateVector[i].multiply(new Complex(-1, 0));
      }
    }
    
    return newStateVector;
  }

  private applyCNOTOptimized(stateVector: Complex[], control: number, target: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    const controlMask = 1 << control;
    const targetMask = 1 << target;
    
    for (let i = 0; i < stateVector.length; i++) {
      if (i & controlMask) {
        const flippedIndex = i ^ targetMask;
        if (i < flippedIndex) {
          [newStateVector[i], newStateVector[flippedIndex]] = [newStateVector[flippedIndex], newStateVector[i]];
        }
      }
    }
    
    return newStateVector;
  }

  private calculateEntanglementOptimized(stateVector: Complex[], numQubits: number) {
    const pairs = [];
    let totalEntanglement = 0;
    
    // Quick check for ground state
    if (stateVector[0].magnitude() > 0.999) {
      return {
        pairs: [],
        totalEntanglement: 0,
        entanglementThreads: []
      };
    }
    
    // Simplified entanglement calculation for performance
    for (let i = 0; i < numQubits && i < 4; i++) { // Limit to 4 qubits for performance
      for (let j = i + 1; j < numQubits && j < 4; j++) {
        const entanglementStrength = this.calculatePairwiseEntanglementOptimized(stateVector, i, j, numQubits);
        
        if (entanglementStrength > 0.05) {
          pairs.push({
            qubit1: i,
            qubit2: j,
            strength: entanglementStrength
          });
          totalEntanglement += entanglementStrength;
        }
      }
    }
    
    return {
      pairs,
      totalEntanglement: totalEntanglement / Math.max(1, pairs.length),
      entanglementThreads: []
    };
  }

  private calculatePairwiseEntanglementOptimized(stateVector: Complex[], qubit1: number, qubit2: number, numQubits: number): number {
    const probs = [0, 0, 0, 0]; // |00⟩, |01⟩, |10⟩, |11⟩
    
    for (let i = 0; i < stateVector.length; i++) {
      const bit1 = (i >> qubit1) & 1;
      const bit2 = (i >> qubit2) & 1;
      const stateIndex = bit1 * 2 + bit2;
      probs[stateIndex] += stateVector[i].magnitude() ** 2;
    }
    
    // Quick mutual information calculation
    const p0 = probs[0] + probs[1];
    const p1 = probs[2] + probs[3];
    const q0 = probs[0] + probs[2];
    const q1 = probs[1] + probs[3];
    
    let entanglement = 0;
    for (let i = 0; i < 4; i++) {
      if (probs[i] > 1e-10) {
        const marginalProduct = (i < 2 ? p0 : p1) * (i % 2 === 0 ? q0 : q1);
        if (marginalProduct > 1e-10) {
          entanglement += probs[i] * Math.log2(probs[i] / marginalProduct);
        }
      }
    }
    
    return Math.abs(entanglement) / 2;
  }

  
  private simulateShots(probabilities: Record<string, number>, shots: number): Record<string, number> {
    const counts: Record<string, number> = {};
    const states = Object.keys(probabilities);
    const probs = Object.values(probabilities);
    
    // Simulate measurement shots
    for (let i = 0; i < shots; i++) {
      const rand = Math.random();
      let cumProb = 0;
      
      for (let j = 0; j < states.length; j++) {
        cumProb += probs[j];
        if (rand <= cumProb) {
          counts[states[j]] = (counts[states[j]] || 0) + 1;
          break;
        }
      }
    }
    
    return counts;
  }

  private applyPauliY(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      const flippedIndex = i ^ (1 << qubit);
      
      if (i < flippedIndex) {
        const temp = newStateVector[i];
        if (qubitBit === 0) {
          newStateVector[flippedIndex] = temp.multiply(new Complex(0, 1));
          newStateVector[i] = newStateVector[flippedIndex].multiply(new Complex(0, -1));
        }
      }
    }
    
    return newStateVector;
  }

  private applyPhaseS(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      if (qubitBit === 1) {
        newStateVector[i] = newStateVector[i].multiply(new Complex(0, 1));
      }
    }
    
    return newStateVector;
  }

  private applyTGate(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    const phase = Math.PI / 4;
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      if (qubitBit === 1) {
        newStateVector[i] = newStateVector[i].multiply(new Complex(Math.cos(phase), Math.sin(phase)));
      }
    }
    
    return newStateVector;
  }

  private applyRotationX(stateVector: Complex[], qubit: number, angle: number, numQubits: number): Complex[] {
    const newStateVector = new Array(stateVector.length).fill(null).map(() => new Complex(0, 0));
    const cos = Math.cos(angle / 2);
    const sin = Math.sin(angle / 2);

    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      const flippedIndex = i ^ (1 << qubit);
      
      if (qubitBit === 0) {
        newStateVector[i] = newStateVector[i].add(stateVector[i].multiply(new Complex(cos, 0)));
        newStateVector[flippedIndex] = newStateVector[flippedIndex].add(stateVector[i].multiply(new Complex(0, -sin)));
      } else {
        newStateVector[flippedIndex] = newStateVector[flippedIndex].add(stateVector[i].multiply(new Complex(0, -sin)));
        newStateVector[i] = newStateVector[i].add(stateVector[i].multiply(new Complex(cos, 0)));
      }
    }

    return newStateVector;
  }

  private applyRotationY(stateVector: Complex[], qubit: number, angle: number, numQubits: number): Complex[] {
    const newStateVector = new Array(stateVector.length).fill(null).map(() => new Complex(0, 0));
    const cos = Math.cos(angle / 2);
    const sin = Math.sin(angle / 2);

    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      const flippedIndex = i ^ (1 << qubit);
      
      if (qubitBit === 0) {
        newStateVector[i] = newStateVector[i].add(stateVector[i].multiply(new Complex(cos, 0)));
        newStateVector[flippedIndex] = newStateVector[flippedIndex].add(stateVector[i].multiply(new Complex(-sin, 0)));
      } else {
        newStateVector[flippedIndex] = newStateVector[flippedIndex].add(stateVector[i].multiply(new Complex(sin, 0)));
        newStateVector[i] = newStateVector[i].add(stateVector[i].multiply(new Complex(cos, 0)));
      }
    }

    return newStateVector;
  }

  private applyRotationZ(stateVector: Complex[], qubit: number, angle: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      if (qubitBit === 0) {
        newStateVector[i] = newStateVector[i].multiply(new Complex(Math.cos(-angle/2), Math.sin(-angle/2)));
      } else {
        newStateVector[i] = newStateVector[i].multiply(new Complex(Math.cos(angle/2), Math.sin(angle/2)));
      }
    }
    
    return newStateVector;
  }

  private applyCZ(stateVector: Complex[], control: number, target: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const controlBit = (i >> control) & 1;
      const targetBit = (i >> target) & 1;
      
      if (controlBit === 1 && targetBit === 1) {
        newStateVector[i] = newStateVector[i].multiply(new Complex(-1, 0));
      }
    }
    
    return newStateVector;
  }

  private applySWAP(stateVector: Complex[], qubit1: number, qubit2: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const bit1 = (i >> qubit1) & 1;
      const bit2 = (i >> qubit2) & 1;
      
      if (bit1 !== bit2) {
        const swappedIndex = i ^ (1 << qubit1) ^ (1 << qubit2);
        if (i < swappedIndex) {
          const temp = newStateVector[i];
          newStateVector[i] = newStateVector[swappedIndex];
          newStateVector[swappedIndex] = temp;
        }
      }
    }
    
    return newStateVector;
  }

  private normalizeStateVector(stateVector: Complex[]): Complex[] {
    const norm = Math.sqrt(stateVector.reduce((sum, amp) => sum + amp.magnitude() ** 2, 0));
    if (norm === 0) return stateVector;
    
    return stateVector.map(amp => new Complex(amp.real / norm, amp.imaginary / norm));
  }

  private calculateMeasurementProbabilities(stateVector: Complex[], numQubits: number): Record<string, number> {
    const probabilities: Record<string, number> = {};
    
    for (let i = 0; i < stateVector.length; i++) {
      const probability = stateVector[i].magnitude() ** 2;
      if (probability > 1e-10) {
        const binaryState = i.toString(2).padStart(numQubits, '0');
        probabilities[binaryState] = probability;
      }
    }
    
    return probabilities;
  }

  private calculateQubitStates(stateVector: Complex[], numQubits: number): Array<{ 
    qubit: number; 
    state: string;
    amplitude: { real: number; imag: number };
    probability: number;
    phase: number;
    probability0: number; 
    probability1: number; 
  }> {
    const qubitStates = [];
    
    for (let qubit = 0; qubit < numQubits; qubit++) {
      let prob0 = 0;
      let prob1 = 0;
      let amplitude0 = new Complex(0, 0);
      let amplitude1 = new Complex(0, 0);
      
      for (let i = 0; i < stateVector.length; i++) {
        const qubitBit = (i >> qubit) & 1;
        const probability = stateVector[i].magnitude() ** 2;
        
        if (qubitBit === 0) {
          prob0 += probability;
          amplitude0 = amplitude0.add(stateVector[i]);
        } else {
          prob1 += probability;
          amplitude1 = amplitude1.add(stateVector[i]);
        }
      }
      
      const dominantState = prob0 > prob1 ? '0' : '1';
      const dominantAmplitude = prob0 > prob1 ? amplitude0 : amplitude1;
      const dominantProb = Math.max(prob0, prob1);
      
      qubitStates.push({ 
        qubit, 
        state: dominantState,
        amplitude: { real: dominantAmplitude.real, imag: dominantAmplitude.imaginary },
        probability: dominantProb,
        phase: dominantAmplitude.phase(),
        probability0: prob0, 
        probability1: prob1 
      });
    }
    
    return qubitStates;
  }

  private calculateBlochSphereData(stateVector: Complex[], numQubits: number): Array<{ 
    qubit: number; 
    x: number; 
    y: number; 
    z: number;
    theta: number;
    phi: number;
  }> {
    const blochData = [];
    
    for (let qubit = 0; qubit < numQubits; qubit++) {
      let x = 0, y = 0, z = 0;
      
      for (let i = 0; i < stateVector.length; i++) {
        const qubitBit = (i >> qubit) & 1;
        const flippedIndex = i ^ (1 << qubit);
        const prob = stateVector[i].magnitude() ** 2;
        
        if (qubitBit === 0) {
          z += prob;
        } else {
          z -= prob;
        }
        
        if (i < flippedIndex) {
          const offDiagonal = stateVector[i].conjugate().multiply(stateVector[flippedIndex]);
          x += 2 * offDiagonal.real;
          y += -2 * offDiagonal.imaginary;
        }
      }
      
      const theta = Math.acos(z);
      const phi = Math.atan2(y, x);
      
      blochData.push({ qubit, x, y, z, theta, phi });
    }
    
    return blochData;
  }
}

export const quantumBackendService = new QuantumBackendService();
