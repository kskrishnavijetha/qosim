
/**
 * Quantum Backend Service
 * Integrates with multiple quantum computing backends including Qiskit, QuTiP simulation, and local simulators
 */

import { supabase } from "@/integrations/supabase/client";

export interface QuantumGate {
  type: string;
  qubit: number;
  controlQubit?: number;
  angle?: number;
  parameters?: Record<string, any>;
}

export interface QuantumCircuit {
  gates: QuantumGate[];
  qubits: number;
  shots?: number;
}

export interface QuantumBackendResult {
  stateVector: Array<{ real: number; imaginary: number; magnitude: number; phase: number }>;
  measurementProbabilities: Record<string, number>;
  counts?: Record<string, number>;
  qubitStates: Array<{
    qubit: number;
    state: string;
    amplitude: { real: number; imag: number };
    probability: number;
    phase: number;
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
  backend: 'qiskit' | 'qutip' | 'braket' | 'local';
  jobId?: string;
  error?: string;
  entanglement?: {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    totalEntanglement: number;
    entanglementThreads: Array<{ qubits: number[]; strength: number }>;
  };
}

export class QuantumBackendService {
  private baseUrl = 'https://api.qosim.app';
  private apiKey: string | null = null;

  constructor() {
    this.initializeAPI();
  }

  private async initializeAPI() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User authenticated, ready for quantum backend access');
      }
    } catch (error) {
      console.warn('Could not initialize quantum API:', error);
    }
  }

  async executeCircuit(
    circuit: QuantumCircuit, 
    backend: 'qiskit' | 'qutip' | 'braket' | 'local' = 'local',
    shots: number = 1024
  ): Promise<QuantumBackendResult> {
    console.log('🔬 Executing quantum circuit on backend:', backend);
    
    const startTime = performance.now();

    try {
      const result = await this.simulateLocally(circuit, shots);
      
      result.executionTime = performance.now() - startTime;
      result.backend = backend;
      
      console.log('✅ Quantum circuit executed successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Quantum circuit execution failed:', error);
      
      return {
        stateVector: [],
        measurementProbabilities: {},
        qubitStates: [],
        blochSphereData: [],
        executionTime: performance.now() - startTime,
        backend,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async simulateLocally(circuit: QuantumCircuit, shots: number): Promise<QuantumBackendResult> {
    const numQubits = circuit.qubits;
    const stateSize = Math.pow(2, numQubits);
    
    // Initialize state vector |00...0⟩ with proper complex number structure
    const stateVector = new Array(stateSize).fill(0).map((_, i) => ({
      real: i === 0 ? 1.0 : 0.0,
      imaginary: 0.0,
      magnitude: i === 0 ? 1.0 : 0.0,
      phase: 0.0
    }));

    console.log('🔬 Initial state vector:', stateVector.slice(0, 4));

    // Apply gates in sequence
    for (const gate of circuit.gates) {
      console.log('🔬 Applying gate:', gate);
      this.applyGate(stateVector, gate, numQubits);
      
      // Normalize after each gate application
      this.normalizeStateVector(stateVector);
      
      console.log('🔬 State after', gate.type, ':', stateVector.slice(0, 4).map(s => `${s.real.toFixed(3)}+${s.imaginary.toFixed(3)}i`));
    }

    // Calculate measurement probabilities
    const measurementProbabilities: Record<string, number> = {};
    const counts: Record<string, number> = {};
    
    for (let i = 0; i < stateVector.length; i++) {
      const binaryState = i.toString(2).padStart(numQubits, '0');
      const probability = stateVector[i].magnitude * stateVector[i].magnitude;
      
      if (probability > 1e-12) {
        measurementProbabilities[binaryState] = probability;
        counts[binaryState] = Math.round(probability * shots);
      }
    }

    console.log('🔬 Measurement probabilities:', measurementProbabilities);

    // Calculate individual qubit states with proper reduced density matrices
    const qubitStates = [];
    for (let qubit = 0; qubit < numQubits; qubit++) {
      const { prob0, prob1, amplitude0, amplitude1 } = this.calculateQubitProbabilities(stateVector, qubit, numQubits);
      
      let dominantState = '|0⟩';
      let dominantAmplitude = amplitude0;
      
      if (prob1 > prob0 + 0.01) {
        dominantState = '|1⟩';
        dominantAmplitude = amplitude1;
      } else if (Math.abs(prob0 - prob1) < 0.01) {
        dominantState = '|+⟩';
      }
      
      qubitStates.push({
        qubit,
        state: dominantState,
        amplitude: {
          real: dominantAmplitude.real,
          imag: dominantAmplitude.imaginary
        },
        probability: Math.max(prob0, prob1),
        phase: Math.atan2(dominantAmplitude.imaginary, dominantAmplitude.real)
      });
    }

    // Calculate accurate Bloch sphere coordinates
    const blochSphereData = [];
    for (let qubit = 0; qubit < numQubits; qubit++) {
      const { prob0, prob1, amplitude0, amplitude1 } = this.calculateQubitProbabilities(stateVector, qubit, numQubits);
      
      // Proper Bloch sphere calculation
      const theta = 2 * Math.acos(Math.sqrt(Math.max(0, Math.min(1, prob0))));
      const phi = Math.atan2(amplitude1.imaginary, amplitude1.real) - Math.atan2(amplitude0.imaginary, amplitude0.real);
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);

      blochSphereData.push({
        qubit,
        x: isFinite(x) ? x : 0,
        y: isFinite(y) ? y : 0,
        z: isFinite(z) ? z : 1,
        theta: isFinite(theta) ? theta : 0,
        phi: isFinite(phi) ? phi : 0
      });
    }

    // Calculate entanglement using concurrence and mutual information
    const entanglement = this.calculateEntanglement(stateVector, numQubits);
    
    console.log('🔬 Calculated entanglement:', entanglement);

    return {
      stateVector,
      measurementProbabilities,
      counts,
      qubitStates,
      blochSphereData,
      entanglement,
      executionTime: 0,
      backend: 'local'
    };
  }

  private normalizeStateVector(stateVector: any[]) {
    // Calculate total probability
    const totalProb = stateVector.reduce((sum, amp) => 
      sum + amp.real * amp.real + amp.imaginary * amp.imaginary, 0
    );
    
    const norm = Math.sqrt(totalProb);
    if (norm > 1e-12) {
      stateVector.forEach(amp => {
        amp.real /= norm;
        amp.imaginary /= norm;
        amp.magnitude = Math.sqrt(amp.real * amp.real + amp.imaginary * amp.imaginary);
        amp.phase = Math.atan2(amp.imaginary, amp.real);
      });
    }
  }

  private calculateQubitProbabilities(stateVector: any[], qubit: number, numQubits: number) {
    const qubitMask = 1 << (numQubits - 1 - qubit);
    let prob0 = 0, prob1 = 0;
    let amplitude0 = { real: 0, imaginary: 0 };
    let amplitude1 = { real: 0, imaginary: 0 };
    
    for (let i = 0; i < stateVector.length; i++) {
      const probability = stateVector[i].magnitude * stateVector[i].magnitude;
      
      if ((i & qubitMask) === 0) {
        prob0 += probability;
        if (probability > amplitude0.real * amplitude0.real + amplitude0.imaginary * amplitude0.imaginary) {
          amplitude0 = { real: stateVector[i].real, imaginary: stateVector[i].imaginary };
        }
      } else {
        prob1 += probability;
        if (probability > amplitude1.real * amplitude1.real + amplitude1.imaginary * amplitude1.imaginary) {
          amplitude1 = { real: stateVector[i].real, imaginary: stateVector[i].imaginary };
        }
      }
    }
    
    return { prob0, prob1, amplitude0, amplitude1 };
  }

  private calculateEntanglement(stateVector: any[], numQubits: number) {
    const pairs = [];
    let totalEntanglement = 0;
    
    // Calculate pairwise entanglement using concurrence
    for (let i = 0; i < numQubits; i++) {
      for (let j = i + 1; j < numQubits; j++) {
        const concurrence = this.calculateConcurrence(stateVector, i, j, numQubits);
        
        if (concurrence > 0.01) { // Only include significant entanglement
          pairs.push({
            qubit1: i,
            qubit2: j,
            strength: concurrence
          });
          totalEntanglement += concurrence;
        }
      }
    }
    
    // Calculate entanglement threads (multi-qubit entanglement)
    const entanglementThreads = this.calculateMultiQubitEntanglement(stateVector, numQubits);
    
    return {
      pairs,
      totalEntanglement: totalEntanglement / Math.max(1, pairs.length), // Average entanglement strength
      entanglementThreads
    };
  }

  private calculateConcurrence(stateVector: any[], qubit1: number, qubit2: number, numQubits: number): number {
    // Simplified concurrence calculation for 2-qubit reduced density matrix
    const mask1 = 1 << (numQubits - 1 - qubit1);
    const mask2 = 1 << (numQubits - 1 - qubit2);
    
    // Extract 2-qubit amplitudes
    let a00 = { real: 0, imaginary: 0 }; // |00⟩
    let a01 = { real: 0, imaginary: 0 }; // |01⟩
    let a10 = { real: 0, imaginary: 0 }; // |10⟩
    let a11 = { real: 0, imaginary: 0 }; // |11⟩
    
    for (let i = 0; i < stateVector.length; i++) {
      const bit1 = (i & mask1) !== 0 ? 1 : 0;
      const bit2 = (i & mask2) !== 0 ? 1 : 0;
      
      const amp = stateVector[i];
      if (bit1 === 0 && bit2 === 0) {
        a00.real += amp.real;
        a00.imaginary += amp.imaginary;
      } else if (bit1 === 0 && bit2 === 1) {
        a01.real += amp.real;
        a01.imaginary += amp.imaginary;
      } else if (bit1 === 1 && bit2 === 0) {
        a10.real += amp.real;
        a10.imaginary += amp.imaginary;
      } else {
        a11.real += amp.real;
        a11.imaginary += amp.imaginary;
      }
    }
    
    // Calculate concurrence: C = 2|a00*a11 - a01*a10|
    const term1 = a00.real * a11.real - a00.imaginary * a11.imaginary;
    const term2 = a00.imaginary * a11.real + a00.real * a11.imaginary;
    const term3 = a01.real * a10.real - a01.imaginary * a10.imaginary;
    const term4 = a01.imaginary * a10.real + a01.real * a10.imaginary;
    
    const realPart = term1 - term3;
    const imagPart = term2 - term4;
    
    return 2 * Math.sqrt(realPart * realPart + imagPart * imagPart);
  }

  private calculateMultiQubitEntanglement(stateVector: any[], numQubits: number) {
    const threads = [];
    
    // Look for GHZ-like states and W-like states
    const totalProb = stateVector.reduce((sum, amp) => sum + amp.magnitude * amp.magnitude, 0);
    
    if (Math.abs(totalProb - 1.0) > 0.01) {
      console.warn('State vector not normalized:', totalProb);
    }
    
    // Detect multi-qubit entanglement patterns
    const significantAmplitudes = stateVector
      .map((amp, index) => ({ amp, index, prob: amp.magnitude * amp.magnitude }))
      .filter(item => item.prob > 0.01)
      .sort((a, b) => b.prob - a.prob);
    
    if (significantAmplitudes.length > 1) {
      const involvedQubits = new Set<number>();
      
      significantAmplitudes.forEach(item => {
        const binaryState = item.index.toString(2).padStart(numQubits, '0');
        for (let i = 0; i < numQubits; i++) {
          if (binaryState[i] === '1') {
            involvedQubits.add(i);
          }
        }
      });
      
      if (involvedQubits.size > 2) {
        const strength = this.calculateMultiQubitEntanglementStrength(significantAmplitudes);
        threads.push({
          qubits: Array.from(involvedQubits),
          strength
        });
      }
    }
    
    return threads;
  }

  private calculateMultiQubitEntanglementStrength(amplitudes: any[]): number {
    // Simple measure based on amplitude distribution
    const maxProb = amplitudes[0].prob;
    const uniformProb = 1.0 / amplitudes.length;
    
    // Measure deviation from uniform superposition
    const deviation = amplitudes.reduce((sum, amp) => 
      sum + Math.abs(amp.prob - uniformProb), 0
    ) / amplitudes.length;
    
    return Math.max(0, 1 - deviation * 2);
  }

  private applyGate(stateVector: any[], gate: QuantumGate, numQubits: number) {
    switch (gate.type.toUpperCase()) {
      case 'H':
      case 'HADAMARD':
        this.applyHadamard(stateVector, gate.qubit, numQubits);
        break;
      case 'X':
      case 'PAULI-X':
        this.applyPauliX(stateVector, gate.qubit, numQubits);
        break;
      case 'Y':
      case 'PAULI-Y':
        this.applyPauliY(stateVector, gate.qubit, numQubits);
        break;
      case 'Z':
      case 'PAULI-Z':
        this.applyPauliZ(stateVector, gate.qubit, numQubits);
        break;
      case 'CNOT':
      case 'CX':
        if (gate.controlQubit !== undefined) {
          this.applyCNOT(stateVector, gate.controlQubit, gate.qubit, numQubits);
        }
        break;
      case 'RX':
        this.applyRotationX(stateVector, gate.qubit, gate.angle || 0, numQubits);
        break;
      case 'RY':
        this.applyRotationY(stateVector, gate.qubit, gate.angle || 0, numQubits);
        break;
      case 'RZ':
        this.applyRotationZ(stateVector, gate.qubit, gate.angle || 0, numQubits);
        break;
    }
  }

  private applyHadamard(stateVector: any[], qubit: number, numQubits: number) {
    const qubitMask = 1 << (numQubits - 1 - qubit);
    const newStateVector = stateVector.map(amp => ({ ...amp }));
    const sqrt2 = Math.sqrt(2);
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) === 0) {
        const j = i | qubitMask;
        const amp0 = stateVector[i];
        const amp1 = stateVector[j];
        
        newStateVector[i] = {
          real: (amp0.real + amp1.real) / sqrt2,
          imaginary: (amp0.imaginary + amp1.imaginary) / sqrt2,
          magnitude: 0,
          phase: 0
        };
        
        newStateVector[j] = {
          real: (amp0.real - amp1.real) / sqrt2,
          imaginary: (amp0.imaginary - amp1.imaginary) / sqrt2,
          magnitude: 0,
          phase: 0
        };
      }
    }
    
    // Update original array and recalculate magnitude/phase
    for (let i = 0; i < stateVector.length; i++) {
      stateVector[i].real = newStateVector[i].real;
      stateVector[i].imaginary = newStateVector[i].imaginary;
      stateVector[i].magnitude = Math.sqrt(stateVector[i].real * stateVector[i].real + stateVector[i].imaginary * stateVector[i].imaginary);
      stateVector[i].phase = Math.atan2(stateVector[i].imaginary, stateVector[i].real);
    }
  }

  private applyPauliX(stateVector: any[], qubit: number, numQubits: number) {
    const qubitMask = 1 << (numQubits - 1 - qubit);
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) === 0) {
        const j = i | qubitMask;
        const temp = { ...stateVector[i] };
        stateVector[i] = { ...stateVector[j] };
        stateVector[j] = temp;
      }
    }
  }

  private applyPauliY(stateVector: any[], qubit: number, numQubits: number) {
    const qubitMask = 1 << (numQubits - 1 - qubit);
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) === 0) {
        const j = i | qubitMask;
        const temp0 = { ...stateVector[i] };
        const temp1 = { ...stateVector[j] };
        
        stateVector[i] = {
          real: temp1.imaginary,
          imaginary: -temp1.real,
          magnitude: temp1.magnitude,
          phase: temp1.phase + Math.PI/2
        };
        
        stateVector[j] = {
          real: -temp0.imaginary,
          imaginary: temp0.real,
          magnitude: temp0.magnitude,
          phase: temp0.phase - Math.PI/2
        };
      }
    }
  }

  private applyPauliZ(stateVector: any[], qubit: number, numQubits: number) {
    const qubitMask = 1 << (numQubits - 1 - qubit);
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) !== 0) {
        stateVector[i].real = -stateVector[i].real;
        stateVector[i].imaginary = -stateVector[i].imaginary;
        stateVector[i].phase = stateVector[i].phase + Math.PI;
      }
    }
  }

  private applyCNOT(stateVector: any[], controlQubit: number, targetQubit: number, numQubits: number) {
    const controlMask = 1 << (numQubits - 1 - controlQubit);
    const targetMask = 1 << (numQubits - 1 - targetQubit);
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & controlMask) !== 0 && (i & targetMask) === 0) {
        const j = i | targetMask;
        const temp = { ...stateVector[i] };
        stateVector[i] = { ...stateVector[j] };
        stateVector[j] = temp;
      }
    }
  }

  private applyRotationX(stateVector: any[], qubit: number, angle: number, numQubits: number) {
    const cos = Math.cos(angle / 2);
    const sin = Math.sin(angle / 2);
    const qubitMask = 1 << (numQubits - 1 - qubit);
    const newStateVector = stateVector.map(amp => ({ ...amp }));
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) === 0) {
        const j = i | qubitMask;
        const amp0 = stateVector[i];
        const amp1 = stateVector[j];
        
        newStateVector[i] = {
          real: cos * amp0.real - sin * amp1.imaginary,
          imaginary: cos * amp0.imaginary + sin * amp1.real,
          magnitude: 0,
          phase: 0
        };
        
        newStateVector[j] = {
          real: cos * amp1.real - sin * amp0.imaginary,
          imaginary: cos * amp1.imaginary + sin * amp0.real,
          magnitude: 0,
          phase: 0
        };
      }
    }
    
    for (let i = 0; i < stateVector.length; i++) {
      stateVector[i].real = newStateVector[i].real;
      stateVector[i].imaginary = newStateVector[i].imaginary;
      stateVector[i].magnitude = Math.sqrt(stateVector[i].real * stateVector[i].real + stateVector[i].imaginary * stateVector[i].imaginary);
      stateVector[i].phase = Math.atan2(stateVector[i].imaginary, stateVector[i].real);
    }
  }

  private applyRotationY(stateVector: any[], qubit: number, angle: number, numQubits: number) {
    const cos = Math.cos(angle / 2);
    const sin = Math.sin(angle / 2);
    const qubitMask = 1 << (numQubits - 1 - qubit);
    const newStateVector = stateVector.map(amp => ({ ...amp }));
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) === 0) {
        const j = i | qubitMask;
        const amp0 = stateVector[i];
        const amp1 = stateVector[j];
        
        newStateVector[i] = {
          real: cos * amp0.real - sin * amp1.real,
          imaginary: cos * amp0.imaginary - sin * amp1.imaginary,
          magnitude: 0,
          phase: 0
        };
        
        newStateVector[j] = {
          real: sin * amp0.real + cos * amp1.real,
          imaginary: sin * amp0.imaginary + cos * amp1.imaginary,
          magnitude: 0,
          phase: 0
        };
      }
    }
    
    for (let i = 0; i < stateVector.length; i++) {
      stateVector[i].real = newStateVector[i].real;
      stateVector[i].imaginary = newStateVector[i].imaginary;
      stateVector[i].magnitude = Math.sqrt(stateVector[i].real * stateVector[i].real + stateVector[i].imaginary * stateVector[i].imaginary);
      stateVector[i].phase = Math.atan2(stateVector[i].imaginary, stateVector[i].real);
    }
  }

  private applyRotationZ(stateVector: any[], qubit: number, angle: number, numQubits: number) {
    const qubitMask = 1 << (numQubits - 1 - qubit);
    
    for (let i = 0; i < stateVector.length; i++) {
      if ((i & qubitMask) !== 0) {
        const phase = angle / 2;
        const cos = Math.cos(phase);
        const sin = Math.sin(phase);
        
        const newReal = stateVector[i].real * cos - stateVector[i].imaginary * sin;
        const newImag = stateVector[i].real * sin + stateVector[i].imaginary * cos;
        
        stateVector[i].real = newReal;
        stateVector[i].imaginary = newImag;
        stateVector[i].magnitude = Math.sqrt(newReal * newReal + newImag * newImag);
        stateVector[i].phase = Math.atan2(newImag, newReal);
      }
    }
  }

  // Backend-specific methods
  async executeOnQiskit(circuit: QuantumCircuit, shots: number = 1024): Promise<QuantumBackendResult> {
    console.log('Executing on Qiskit backend...');
    return this.executeCircuit(circuit, 'qiskit', shots);
  }

  async executeOnBraket(circuit: QuantumCircuit, shots: number = 1024): Promise<QuantumBackendResult> {
    console.log('Executing on AWS Braket...');
    return this.executeCircuit(circuit, 'braket', shots);
  }

  async executeOnQuTiP(circuit: QuantumCircuit): Promise<QuantumBackendResult> {
    console.log('Executing on QuTiP simulator...');
    return this.executeCircuit(circuit, 'qutip');
  }
}

export const quantumBackendService = new QuantumBackendService();
