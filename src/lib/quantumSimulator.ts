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

// Quantum gate matrices (2x2 complex matrices) using {r, i} format for direct statevector ops
const gateMatrices: Record<string, Array<Array<{r: number; i: number}>>> = {
  I: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: 1, i: 0}]],
  X: [[{r: 0, i: 0}, {r: 1, i: 0}], [{r: 1, i: 0}, {r: 0, i: 0}]],
  Y: [[{r: 0, i: 0}, {r: 0, i: -1}], [{r: 0, i: 1}, {r: 0, i: 0}]],
  Z: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: -1, i: 0}]],
  H: [[{r: 1/Math.sqrt(2), i: 0}, {r: 1/Math.sqrt(2), i: 0}], [{r: 1/Math.sqrt(2), i: 0}, {r: -1/Math.sqrt(2), i: 0}]],
};

function makeRX(angle: number): Array<Array<{r: number; i: number}>> {
  const c = Math.cos(angle/2), s = Math.sin(angle/2);
  return [[{r: c, i: 0}, {r: 0, i: -s}], [{r: 0, i: -s}, {r: c, i: 0}]];
}

function makeRY(angle: number): Array<Array<{r: number; i: number}>> {
  const c = Math.cos(angle/2), s = Math.sin(angle/2);
  return [[{r: c, i: 0}, {r: -s, i: 0}], [{r: s, i: 0}, {r: c, i: 0}]];
}

export class QuantumCircuitSimulator {
  private numQubits: number;
  private re: Float64Array;
  private im: Float64Array;
  
  constructor(numQubits: number = 5) {
    this.numQubits = Math.max(1, Math.min(numQubits, 8));
    this.re = new Float64Array(1 << this.numQubits);
    this.im = new Float64Array(1 << this.numQubits);
    this.reset();
  }
  
  reset(): void {
    const d = 1 << this.numQubits;
    this.re = new Float64Array(d);
    this.im = new Float64Array(d);
    this.re[0] = 1;
  }

  // Direct statevector manipulation for single-qubit gates - no matrix building
  private applyGate(gm: Array<Array<{r: number; i: number}>>, q: number): void {
    const d = 1 << this.numQubits;
    const bit = 1 << (this.numQubits - 1 - q);
    for (let i = 0; i < d; i++) {
      if (i & bit) continue;
      const j = i | bit;
      const r0 = this.re[i], i0 = this.im[i];
      const r1 = this.re[j], i1 = this.im[j];
      const a = gm[0][0], b = gm[0][1], c = gm[1][0], d2 = gm[1][1];
      this.re[i] = a.r*r0 - a.i*i0 + b.r*r1 - b.i*i1;
      this.im[i] = a.r*i0 + a.i*r0 + b.r*i1 + b.i*r1;
      this.re[j] = c.r*r0 - c.i*i0 + d2.r*r1 - d2.i*i1;
      this.im[j] = c.r*i0 + c.i*r0 + d2.r*i1 + d2.i*r1;
    }
  }

  // Direct statevector CNOT - no matrix building
  private applyCNOT(ctrl: number, tgt: number): void {
    const d = 1 << this.numQubits;
    const cb = 1 << (this.numQubits - 1 - ctrl);
    const tb = 1 << (this.numQubits - 1 - tgt);
    for (let i = 0; i < d; i++) {
      if (!(i & cb) || (i & tb)) continue;
      const j = i | tb;
      let tmp = this.re[i]; this.re[i] = this.re[j]; this.re[j] = tmp;
      tmp = this.im[i]; this.im[i] = this.im[j]; this.im[j] = tmp;
    }
  }

  private probs(): number[] {
    const d = 1 << this.numQubits;
    return Array.from({length: d}, (_, i) =>
      this.re[i]*this.re[i] + this.im[i]*this.im[i]
    );
  }

  // Build StateVector from internal Float64Arrays
  private getStateVector(): StateVector {
    const d = 1 << this.numQubits;
    const sv: StateVector = [];
    for (let i = 0; i < d; i++) {
      sv.push({ real: this.re[i], imag: this.im[i] });
    }
    return sv;
  }
  
  simulate(circuit: QuantumGate[]): SimulationResult {
    this.reset();
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    
    for (const gate of sortedGates) {
      switch (gate.type) {
        case 'H':
          if (gate.qubit !== undefined) this.applyGate(gateMatrices.H, gate.qubit);
          break;
        case 'X':
          if (gate.qubit !== undefined) this.applyGate(gateMatrices.X, gate.qubit);
          break;
        case 'Y':
          if (gate.qubit !== undefined) this.applyGate(gateMatrices.Y, gate.qubit);
          break;
        case 'Z':
          if (gate.qubit !== undefined) this.applyGate(gateMatrices.Z, gate.qubit);
          break;
        case 'RX':
          if (gate.qubit !== undefined && gate.angle !== undefined)
            this.applyGate(makeRX(gate.angle), gate.qubit);
          break;
        case 'RY':
          if (gate.qubit !== undefined && gate.angle !== undefined)
            this.applyGate(makeRY(gate.angle), gate.qubit);
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2)
            this.applyCNOT(gate.qubits[0], gate.qubits[1]);
          break;
      }
    }
    
    return this.getResult();
  }
  
  getResult(): SimulationResult {
    const stateVector = this.getStateVector();
    const measurementProbabilities = this.probs();
    
    const qubitStates = [];
    for (let q = 0; q < this.numQubits; q++) {
      let prob0 = 0, prob1 = 0;
      let amp0: Complex = {real: 0, imag: 0};
      let amp1: Complex = {real: 0, imag: 0};
      
      const d = 1 << this.numQubits;
      for (let state = 0; state < d; state++) {
        const qubitValue = (state >> (this.numQubits - 1 - q)) & 1;
        const probability = this.re[state]*this.re[state] + this.im[state]*this.im[state];
        
        if (qubitValue === 0) {
          prob0 += probability;
          amp0 = complex.add(amp0, { real: this.re[state], imag: this.im[state] });
        } else {
          prob1 += probability;
          amp1 = complex.add(amp1, { real: this.re[state], imag: this.im[state] });
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
    
    return { stateVector, measurementProbabilities, qubitStates };
  }
  
  getStateString(): string {
    const d = 1 << this.numQubits;
    const significantStates = [];
    for (let i = 0; i < d; i++) {
      const amplitude = Math.sqrt(this.re[i]*this.re[i] + this.im[i]*this.im[i]);
      if (amplitude > 0.001) {
        const binaryState = i.toString(2).padStart(this.numQubits, '0');
        const phase = Math.atan2(this.im[i], this.re[i]);
        significantStates.push(`${amplitude.toFixed(3)}e^(${phase.toFixed(2)}i)|${binaryState}⟩`);
      }
    }
    return significantStates.join(' + ');
  }
}

export const quantumSimulator = new QuantumCircuitSimulator(5);
