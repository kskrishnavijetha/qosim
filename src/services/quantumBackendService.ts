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

  async executeCircuit(
    circuit: QuantumCircuit, 
    backend: 'qiskit' | 'qutip' | 'braket' | 'local' = 'local',
    shots: number = 1024
  ): Promise<QuantumBackendResult> {
    console.log('🚀 QuantumBackendService: executeCircuit called', { backend, shots, gateCount: circuit.gates.length });
    
    const startTime = performance.now();
    
    try {
      // Initialize state vector for |00000⟩
      const numQubits = circuit.qubits;
      const stateSize = 2 ** numQubits;
      let stateVector = new Array(stateSize).fill(null).map(() => new Complex(0, 0));
      stateVector[0] = new Complex(1, 0); // |00000⟩
      
      console.log('🚀 Initial state vector length:', stateVector.length, 'for', numQubits, 'qubits');

      // Apply each gate
      for (const gate of circuit.gates) {
        console.log('🚀 Applying gate:', gate.type, 'to qubits:', gate.qubit || gate.qubits);
        
        switch (gate.type) {
          case 'H':
            stateVector = this.applyHadamard(stateVector, gate.qubit!, numQubits);
            break;
          case 'X':
            stateVector = this.applyPauliX(stateVector, gate.qubit!, numQubits);
            break;
          case 'Y':
            stateVector = this.applyPauliY(stateVector, gate.qubit!, numQubits);
            break;
          case 'Z':
            stateVector = this.applyPauliZ(stateVector, gate.qubit!, numQubits);
            break;
          case 'S':
            stateVector = this.applyPhaseS(stateVector, gate.qubit!, numQubits);
            break;
          case 'T':
            stateVector = this.applyTGate(stateVector, gate.qubit!, numQubits);
            break;
          case 'RX':
            stateVector = this.applyRotationX(stateVector, gate.qubit!, gate.angle || 0, numQubits);
            break;
          case 'RY':
            stateVector = this.applyRotationY(stateVector, gate.qubit!, gate.angle || 0, numQubits);
            break;
          case 'RZ':
            stateVector = this.applyRotationZ(stateVector, gate.qubit!, gate.angle || 0, numQubits);
            break;
          case 'CNOT':
            const controlQubit = gate.controlQubit !== undefined ? gate.controlQubit : gate.qubits?.[0] || 0;
            const targetQubit = gate.qubit !== undefined ? gate.qubit : gate.qubits?.[1] || 1;
            stateVector = this.applyCNOT(stateVector, controlQubit, targetQubit, numQubits);
            break;
          case 'CZ':
            stateVector = this.applyCZ(stateVector, gate.qubits?.[0] || 0, gate.qubits?.[1] || 1, numQubits);
            break;
          case 'SWAP':
            stateVector = this.applySWAP(stateVector, gate.qubits?.[0] || 0, gate.qubits?.[1] || 1, numQubits);
            break;
          case 'TOFFOLI':
            stateVector = this.applyToffoli(stateVector, gate.qubits?.[0] || 0, gate.qubits?.[1] || 1, gate.qubits?.[2] || 2, numQubits);
            break;
          case 'BELL':
            stateVector = this.createBellState(stateVector, gate.qubits?.[0] || 0, gate.qubits?.[1] || 1, numQubits);
            break;
          case 'GHZ':
            stateVector = this.createGHZState(stateVector, gate.qubits || [0, 1, 2], numQubits);
            break;
          case 'W':
            stateVector = this.createWState(stateVector, gate.qubits || [0, 1, 2], numQubits);
            break;
        }
        
        stateVector = this.normalizeStateVector(stateVector);
      }

      console.log('🚀 Final state vector non-zero amplitudes:', 
        stateVector.filter(amp => amp.magnitude() > 1e-10).length);

      // Calculate results
      const measurementProbabilities = this.calculateMeasurementProbabilities(stateVector, numQubits);
      const qubitStates = this.calculateQubitStates(stateVector, numQubits);
      const blochSphereData = this.calculateBlochSphereData(stateVector, numQubits);
      const entanglement = this.calculateEntanglement(stateVector, numQubits);

      // Generate counts for shot simulation
      const counts = this.simulateShots(measurementProbabilities, shots);

      console.log('🚀 Entanglement calculation result:', {
        totalEntanglement: entanglement.totalEntanglement,
        pairsCount: entanglement.pairs.length,
        pairs: entanglement.pairs.map(p => `Q${p.qubit1}-Q${p.qubit2}: ${(p.strength * 100).toFixed(1)}%`)
      });

      const executionTime = performance.now() - startTime;
      
      return {
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

    } catch (error) {
      console.error('❌ QuantumBackendService error:', error);
      throw error;
    }
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

  private applyHadamard(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = new Array(stateVector.length).fill(null).map(() => new Complex(0, 0));
    const factor = 1 / Math.sqrt(2);

    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      const flippedIndex = i ^ (1 << qubit);
      
      if (qubitBit === 0) {
        // |0⟩ -> (|0⟩ + |1⟩)/√2
        newStateVector[i] = newStateVector[i].add(stateVector[i].multiply(new Complex(factor, 0)));
        newStateVector[flippedIndex] = newStateVector[flippedIndex].add(stateVector[i].multiply(new Complex(factor, 0)));
      } else {
        // |1⟩ -> (|0⟩ - |1⟩)/√2
        newStateVector[flippedIndex] = newStateVector[flippedIndex].add(stateVector[i].multiply(new Complex(factor, 0)));
        newStateVector[i] = newStateVector[i].add(stateVector[i].multiply(new Complex(-factor, 0)));
      }
    }

    return newStateVector;
  }

  private applyPauliX(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const flippedIndex = i ^ (1 << qubit);
      if (i < flippedIndex) {
        // Swap amplitudes
        const temp = newStateVector[i];
        newStateVector[i] = newStateVector[flippedIndex];
        newStateVector[flippedIndex] = temp;
      }
    }
    
    return newStateVector;
  }

  private applyPauliY(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      const flippedIndex = i ^ (1 << qubit);
      
      if (i < flippedIndex) {
        const temp = newStateVector[i];
        if (qubitBit === 0) {
          // |0⟩ -> i|1⟩
          newStateVector[flippedIndex] = temp.multiply(new Complex(0, 1));
          // |1⟩ -> -i|0⟩
          newStateVector[i] = newStateVector[flippedIndex].multiply(new Complex(0, -1));
        }
      }
    }
    
    return newStateVector;
  }

  private applyPauliZ(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      if (qubitBit === 1) {
        // Apply -1 phase to |1⟩
        newStateVector[i] = newStateVector[i].multiply(new Complex(-1, 0));
      }
    }
    
    return newStateVector;
  }

  private applyPhaseS(stateVector: Complex[], qubit: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const qubitBit = (i >> qubit) & 1;
      if (qubitBit === 1) {
        // Apply i phase to |1⟩
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
        // Apply e^(iπ/4) phase to |1⟩
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
        // RX matrix: [[cos, -i*sin], [-i*sin, cos]]
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
        // RY matrix: [[cos, -sin], [sin, cos]]
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
        // Apply e^(-iθ/2) phase to |0⟩
        newStateVector[i] = newStateVector[i].multiply(new Complex(Math.cos(-angle/2), Math.sin(-angle/2)));
      } else {
        // Apply e^(iθ/2) phase to |1⟩
        newStateVector[i] = newStateVector[i].multiply(new Complex(Math.cos(angle/2), Math.sin(angle/2)));
      }
    }
    
    return newStateVector;
  }

  private applyCNOT(stateVector: Complex[], control: number, target: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const controlBit = (i >> control) & 1;
      if (controlBit === 1) {
        // Flip target qubit
        const flippedIndex = i ^ (1 << target);
        const temp = newStateVector[i];
        newStateVector[i] = newStateVector[flippedIndex];
        newStateVector[flippedIndex] = temp;
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
        // Apply -1 phase
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

  private applyToffoli(stateVector: Complex[], control1: number, control2: number, target: number, numQubits: number): Complex[] {
    const newStateVector = [...stateVector];
    
    for (let i = 0; i < stateVector.length; i++) {
      const control1Bit = (i >> control1) & 1;
      const control2Bit = (i >> control2) & 1;
      
      if (control1Bit === 1 && control2Bit === 1) {
        // Flip target qubit
        const flippedIndex = i ^ (1 << target);
        const temp = newStateVector[i];
        newStateVector[i] = newStateVector[flippedIndex];
        newStateVector[flippedIndex] = temp;
      }
    }
    
    return newStateVector;
  }

  private createBellState(stateVector: Complex[], qubit1: number, qubit2: number, numQubits: number): Complex[] {
    // First apply H to qubit1, then CNOT(qubit1, qubit2)
    let newStateVector = this.applyHadamard(stateVector, qubit1, numQubits);
    newStateVector = this.applyCNOT(newStateVector, qubit1, qubit2, numQubits);
    return newStateVector;
  }

  private createGHZState(stateVector: Complex[], qubits: number[], numQubits: number): Complex[] {
    // H on first qubit, then CNOT to all others
    let newStateVector = this.applyHadamard(stateVector, qubits[0], numQubits);
    for (let i = 1; i < qubits.length; i++) {
      newStateVector = this.applyCNOT(newStateVector, qubits[0], qubits[i], numQubits);
    }
    return newStateVector;
  }

  private createWState(stateVector: Complex[], qubits: number[], numQubits: number): Complex[] {
    // Create W state: (|001⟩ + |010⟩ + |100⟩) / √3
    const newStateVector = new Array(stateVector.length).fill(null).map(() => new Complex(0, 0));
    const factor = 1 / Math.sqrt(3);
    
    // Only set the W state components
    for (let qubit of qubits) {
      let index = 0;
      index |= (1 << qubit); // Set only this qubit to 1
      newStateVector[index] = new Complex(factor, 0);
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
      if (probability > 1e-10) { // Only include significant probabilities
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
      
      // Convert to spherical coordinates
      const theta = Math.acos(z);
      const phi = Math.atan2(y, x);
      
      blochData.push({ qubit, x, y, z, theta, phi });
    }
    
    return blochData;
  }

  private calculateEntanglement(stateVector: Complex[], numQubits: number) {
    const pairs = [];
    let totalEntanglement = 0;
    
    console.log('🔍 Calculating entanglement for', numQubits, 'qubits');
    console.log('🔍 State vector has', stateVector.filter(amp => amp.magnitude() > 1e-10).length, 'non-zero amplitudes');
    
    // Calculate pairwise entanglement using concurrence
    for (let i = 0; i < numQubits; i++) {
      for (let j = i + 1; j < numQubits; j++) {
        const concurrence = this.calculateConcurrence(stateVector, i, j, numQubits);
        
        console.log(`🔍 Concurrence for qubits ${i}-${j}:`, concurrence.toFixed(4));
        
        if (concurrence > 0.001) { // Threshold for significant entanglement
          pairs.push({
            qubit1: i,
            qubit2: j,
            strength: concurrence
          });
          totalEntanglement += concurrence;
        }
      }
    }
    
    // Normalize total entanglement
    const maxPossiblePairs = (numQubits * (numQubits - 1)) / 2;
    totalEntanglement = totalEntanglement / maxPossiblePairs;
    
    console.log('🔍 Final entanglement result:', {
      totalEntanglement: totalEntanglement.toFixed(4),
      pairsFound: pairs.length,
      pairs: pairs.map(p => `${p.qubit1}-${p.qubit2}: ${(p.strength * 100).toFixed(1)}%`)
    });
    
    return {
      pairs,
      totalEntanglement,
      entanglementThreads: [] // TODO: Implement multi-qubit entanglement detection
    };
  }

  private calculateConcurrence(stateVector: Complex[], qubit1: number, qubit2: number, numQubits: number): number {
    // Calculate concurrence for two qubits
    // This is a simplified version - full implementation would require density matrix calculation
    
    // Get the reduced density matrix for the two qubits
    const reducedMatrix = this.getReducedDensityMatrix(stateVector, [qubit1, qubit2], numQubits);
    
    // Calculate concurrence from the density matrix
    // For two qubits: C = max(0, λ1 - λ2 - λ3 - λ4) where λi are eigenvalues of R
    
    // Simplified calculation using state amplitudes
    let entanglement = 0;
    
    // Check for Bell-like states
    const states = [
      this.getAmplitudeForBitPattern([0, 0], [qubit1, qubit2], stateVector, numQubits),
      this.getAmplitudeForBitPattern([0, 1], [qubit1, qubit2], stateVector, numQubits),
      this.getAmplitudeForBitPattern([1, 0], [qubit1, qubit2], stateVector, numQubits),
      this.getAmplitudeForBitPattern([1, 1], [qubit1, qubit2], stateVector, numQubits)
    ];
    
    // Calculate entanglement measure
    const prob00 = states[0].magnitude() ** 2;
    const prob01 = states[1].magnitude() ** 2;
    const prob10 = states[2].magnitude() ** 2;
    const prob11 = states[3].magnitude() ** 2;
    
    // Simple entanglement measure: deviation from product states
    const marginal1_0 = prob00 + prob01;
    const marginal1_1 = prob10 + prob11;
    const marginal2_0 = prob00 + prob10;
    const marginal2_1 = prob01 + prob11;
    
    // Product state probabilities
    const product00 = marginal1_0 * marginal2_0;
    const product01 = marginal1_0 * marginal2_1;
    const product10 = marginal1_1 * marginal2_0;
    const product11 = marginal1_1 * marginal2_1;
    
    // Calculate deviation from product state
    entanglement = Math.sqrt(
      (prob00 - product00) ** 2 +
      (prob01 - product01) ** 2 +
      (prob10 - product10) ** 2 +
      (prob11 - product11) ** 2
    );
    
    return Math.min(1, entanglement * 2); // Scale to [0,1]
  }

  private getReducedDensityMatrix(stateVector: Complex[], qubits: number[], numQubits: number): Complex[][] {
    const reducedSize = 2 ** qubits.length;
    const matrix = Array(reducedSize).fill(null).map(() => Array(reducedSize).fill(null).map(() => new Complex(0, 0)));
    
    // This is a simplified implementation
    // Full implementation would trace out other qubits
    
    return matrix;
  }

  private getAmplitudeForBitPattern(pattern: number[], qubits: number[], stateVector: Complex[], numQubits: number): Complex {
    let amplitude = new Complex(0, 0);
    
    for (let i = 0; i < stateVector.length; i++) {
      let matches = true;
      for (let j = 0; j < qubits.length; j++) {
        const bit = (i >> qubits[j]) & 1;
        if (bit !== pattern[j]) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        amplitude = amplitude.add(stateVector[i]);
      }
    }
    
    return amplitude;
  }
}

// Create a Complex number class if it doesn't exist
class Complex {
  constructor(public real: number, public imaginary: number) {}

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imaginary + other.imaginary);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imaginary);
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  phase(): number {
    return Math.atan2(this.imaginary, this.real);
  }
}

export const quantumBackendService = new QuantumBackendService();
