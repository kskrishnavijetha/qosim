// Enhanced Quantum Circuit Simulator with Real-time Optimization
// Uses direct statevector manipulation (Float64Array) - NO tensor products or matrix building
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
  mode: SimulationMode;
  error?: string;
}

export interface SimulationStepData {
  gateIndex: number;
  gate: QuantumGate;
  stateVector: StateVector;
  entanglement: any;
  timestamp: number;
}

// Gate matrix type for direct statevector ops: {r, i} format
type GateMatrix = Array<Array<{r: number; i: number}>>;

// Enhanced gates using {r, i} format
const enhancedGates: Record<string, GateMatrix> & {
  RX: (angle: number) => GateMatrix;
  RY: (angle: number) => GateMatrix;
  RZ: (angle: number) => GateMatrix;
  U1: (lambda: number) => GateMatrix;
  U2: (phi: number, lambda: number) => GateMatrix;
  U3: (theta: number, phi: number, lambda: number) => GateMatrix;
  CRk: (k: number) => GateMatrix;
} = {
  I: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: 1, i: 0}]],
  X: [[{r: 0, i: 0}, {r: 1, i: 0}], [{r: 1, i: 0}, {r: 0, i: 0}]],
  Y: [[{r: 0, i: 0}, {r: 0, i: -1}], [{r: 0, i: 1}, {r: 0, i: 0}]],
  Z: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: -1, i: 0}]],
  H: [[{r: 1/Math.sqrt(2), i: 0}, {r: 1/Math.sqrt(2), i: 0}], [{r: 1/Math.sqrt(2), i: 0}, {r: -1/Math.sqrt(2), i: 0}]],
  S: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: 0, i: 1}]],
  SDG: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: 0, i: -1}]],
  T: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: Math.cos(Math.PI/4), i: Math.sin(Math.PI/4)}]],
  TDG: [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: Math.cos(-Math.PI/4), i: Math.sin(-Math.PI/4)}]],

  RX: (angle: number): GateMatrix => {
    if (Math.abs(angle) < 1e-10) return enhancedGates.I as GateMatrix;
    const c = Math.cos(angle/2), s = Math.sin(angle/2);
    return [[{r: c, i: 0}, {r: 0, i: -s}], [{r: 0, i: -s}, {r: c, i: 0}]];
  },
  RY: (angle: number): GateMatrix => {
    if (Math.abs(angle) < 1e-10) return enhancedGates.I as GateMatrix;
    const c = Math.cos(angle/2), s = Math.sin(angle/2);
    return [[{r: c, i: 0}, {r: -s, i: 0}], [{r: s, i: 0}, {r: c, i: 0}]];
  },
  RZ: (angle: number): GateMatrix => {
    if (Math.abs(angle) < 1e-10) return enhancedGates.I as GateMatrix;
    const p = angle/2;
    return [[{r: Math.cos(-p), i: Math.sin(-p)}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: Math.cos(p), i: Math.sin(p)}]];
  },
  U1: (lambda: number): GateMatrix => {
    if (Math.abs(lambda) < 1e-10) return enhancedGates.I as GateMatrix;
    return [[{r: 1, i: 0}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: Math.cos(lambda), i: Math.sin(lambda)}]];
  },
  U2: (phi: number, lambda: number): GateMatrix => {
    const s = 1/Math.sqrt(2);
    return [
      [{r: s, i: 0}, {r: -s*Math.cos(lambda), i: -s*Math.sin(lambda)}],
      [{r: s*Math.cos(phi), i: s*Math.sin(phi)}, {r: s*Math.cos(phi+lambda), i: s*Math.sin(phi+lambda)}]
    ];
  },
  U3: (theta: number, phi: number, lambda: number): GateMatrix => {
    const c = Math.cos(theta/2), s = Math.sin(theta/2);
    return [
      [{r: c, i: 0}, {r: -s*Math.cos(lambda), i: -s*Math.sin(lambda)}],
      [{r: s*Math.cos(phi), i: s*Math.sin(phi)}, {r: c*Math.cos(phi+lambda), i: c*Math.sin(phi+lambda)}]
    ];
  },
  CRk: (k: number): GateMatrix => {
    const angle = 2 * Math.PI / Math.pow(2, k);
    if (Math.abs(angle) < 1e-10) return enhancedGates.I as GateMatrix;
    const p = angle/2;
    return [[{r: Math.cos(-p), i: Math.sin(-p)}, {r: 0, i: 0}], [{r: 0, i: 0}, {r: Math.cos(p), i: Math.sin(p)}]];
  },
};

// Entanglement calculation
function calculateAdvancedEntanglement(re: Float64Array, im: Float64Array, numQubits: number) {
  const pairs: Array<{ qubit1: number; qubit2: number; strength: number }> = [];
  const threads: Array<{ qubits: number[]; strength: number }> = [];
  let totalEntanglement = 0;
  const d = re.length;

  for (let q1 = 0; q1 < numQubits; q1++) {
    for (let q2 = q1 + 1; q2 < numQubits; q2++) {
      // Build reduced density matrix for 2-qubit subsystem
      let prob00 = 0, prob01 = 0, prob10 = 0, prob11 = 0;
      for (let state = 0; state < d; state++) {
        const b1 = (state >> (numQubits - 1 - q1)) & 1;
        const b2 = (state >> (numQubits - 1 - q2)) & 1;
        const p = re[state]*re[state] + im[state]*im[state];
        if (b1 === 0 && b2 === 0) prob00 += p;
        else if (b1 === 0 && b2 === 1) prob01 += p;
        else if (b1 === 1 && b2 === 0) prob10 += p;
        else prob11 += p;
      }

      const m1_0 = prob00 + prob01, m1_1 = prob10 + prob11;
      const m2_0 = prob00 + prob10, m2_1 = prob01 + prob11;
      const deviation = Math.sqrt(
        (prob00 - m1_0*m2_0)**2 + (prob01 - m1_0*m2_1)**2 +
        (prob10 - m1_1*m2_0)**2 + (prob11 - m1_1*m2_1)**2
      );
      const maxE = Math.sqrt(0.5);
      let strength = Math.min(1, deviation / maxE);
      const bellMeasure = Math.abs(prob00*prob11 - prob01*prob10);
      if (bellMeasure > 0.1) strength = Math.max(strength, Math.min(1, bellMeasure * 2));

      if (strength > 0.0001) {
        pairs.push({ qubit1: q1, qubit2: q2, strength });
        totalEntanglement += strength;
      }
    }
  }

  // Find entanglement threads
  for (let i = 0; i < numQubits; i++) {
    const connected = [i];
    const connPairs = pairs.filter(p => p.qubit1 === i || p.qubit2 === i);
    connPairs.forEach(pair => {
      const other = pair.qubit1 === i ? pair.qubit2 : pair.qubit1;
      if (!connected.includes(other)) connected.push(other);
    });
    if (connected.length > 1) {
      threads.push({ qubits: connected, strength: connPairs.reduce((s, p) => s + p.strength, 0) / connPairs.length });
    }
  }

  return { pairs, totalEntanglement: Math.min(1, totalEntanglement), entanglementThreads: threads };
}

// Also export a StateVector-based version for backward compat
function calculateAdvancedEntanglementFromSV(stateVector: StateVector, numQubits: number) {
  const d = stateVector.length;
  const re = new Float64Array(d);
  const im = new Float64Array(d);
  for (let i = 0; i < d; i++) {
    re[i] = stateVector[i].real;
    im[i] = stateVector[i].imag;
  }
  return calculateAdvancedEntanglement(re, im, numQubits);
}

export class OptimizedQuantumSimulator {
  private numQubits: number;
  private re: Float64Array;
  private im: Float64Array;
  private stepResults: SimulationStepData[] = [];
  private isStepMode: boolean = false;
  private currentStep: number = 0;
  private isPaused: boolean = false;
  private measurementHistory: Array<{ qubit: number; result: 0 | 1; timestamp: number }> = [];
  private currentMode: SimulationMode = 'fast';

  get qubits(): number { return this.numQubits; }
  
  // Keep stateVector getter for backward compat
  private get stateVector(): StateVector {
    const d = 1 << this.numQubits;
    const sv: StateVector = [];
    for (let i = 0; i < d; i++) {
      sv.push({ real: this.re[i], imag: this.im[i] });
    }
    return sv;
  }

  setMode(mode: SimulationMode): void { this.currentMode = mode; }
  
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
    this.stepResults = [];
    this.currentStep = 0;
    this.isPaused = false;
  }
  
  enableStepMode(enabled: boolean): void {
    this.isStepMode = enabled;
    if (enabled) { this.stepResults = []; this.currentStep = 0; }
  }
  
  pause(): void { this.isPaused = true; }
  resume(): void { this.isPaused = false; }
  
  step(): SimulationStepData | null {
    if (this.currentStep < this.stepResults.length) return this.stepResults[this.currentStep++];
    return null;
  }

  // === DIRECT STATEVECTOR GATE APPLICATION ===

  private applySingleQubitGate(gm: GateMatrix, q: number): void {
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

  private applyCNOTDirect(ctrl: number, tgt: number): void {
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

  private applyCZDirect(ctrl: number, tgt: number): void {
    const d = 1 << this.numQubits;
    const cb = 1 << (this.numQubits - 1 - ctrl);
    const tb = 1 << (this.numQubits - 1 - tgt);
    for (let i = 0; i < d; i++) {
      if ((i & cb) && (i & tb)) {
        this.re[i] = -this.re[i];
        this.im[i] = -this.im[i];
      }
    }
  }

  private applySWAPDirect(q1: number, q2: number): void {
    const d = 1 << this.numQubits;
    const b1 = 1 << (this.numQubits - 1 - q1);
    const b2 = 1 << (this.numQubits - 1 - q2);
    for (let i = 0; i < d; i++) {
      const v1 = (i & b1) ? 1 : 0;
      const v2 = (i & b2) ? 1 : 0;
      if (v1 !== v2 && v1 === 0) {
        // only swap once (when q1=0, q2=1)
        const j = (i | b1) & ~b2;
        let tmp = this.re[i]; this.re[i] = this.re[j]; this.re[j] = tmp;
        tmp = this.im[i]; this.im[i] = this.im[j]; this.im[j] = tmp;
      }
    }
  }

  private applyToffoliDirect(c1: number, c2: number, tgt: number): void {
    const d = 1 << this.numQubits;
    const cb1 = 1 << (this.numQubits - 1 - c1);
    const cb2 = 1 << (this.numQubits - 1 - c2);
    const tb = 1 << (this.numQubits - 1 - tgt);
    for (let i = 0; i < d; i++) {
      if ((i & cb1) && (i & cb2) && !(i & tb)) {
        const j = i | tb;
        let tmp = this.re[i]; this.re[i] = this.re[j]; this.re[j] = tmp;
        tmp = this.im[i]; this.im[i] = this.im[j]; this.im[j] = tmp;
      }
    }
  }

  private applyFredkinDirect(ctrl: number, t1: number, t2: number): void {
    const d = 1 << this.numQubits;
    const cb = 1 << (this.numQubits - 1 - ctrl);
    const b1 = 1 << (this.numQubits - 1 - t1);
    const b2 = 1 << (this.numQubits - 1 - t2);
    for (let i = 0; i < d; i++) {
      if (!(i & cb)) continue;
      const v1 = (i & b1) ? 1 : 0;
      const v2 = (i & b2) ? 1 : 0;
      if (v1 !== v2 && v1 === 0) {
        const j = (i | b1) & ~b2;
        let tmp = this.re[i]; this.re[i] = this.re[j]; this.re[j] = tmp;
        tmp = this.im[i]; this.im[i] = this.im[j]; this.im[j] = tmp;
      }
    }
  }

  // Controlled single-qubit gate: apply gm to target when control is |1⟩
  private applyControlledGate(gm: GateMatrix, ctrl: number, tgt: number): void {
    const d = 1 << this.numQubits;
    const cb = 1 << (this.numQubits - 1 - ctrl);
    const tb = 1 << (this.numQubits - 1 - tgt);
    for (let i = 0; i < d; i++) {
      if (!(i & cb)) continue; // control must be 1
      if (i & tb) continue; // only process target=0 pairs
      const j = i | tb;
      const r0 = this.re[i], i0 = this.im[i];
      const r1 = this.re[j], i1 = this.im[j];
      const a = gm[0][0], b = gm[0][1], c = gm[1][0], d2 = gm[1][1];
      this.re[i] = a.r*r0 - a.i*i0 + b.r*r1 - b.i*i1;
      this.im[i] = a.r*i0 + a.i*r0 + b.r*i1 + b.i*r1;
      this.re[j] = c.r*r0 - c.i*i0 + d2.r*r1 - d2.i*i1;
      this.im[j] = c.r*i0 + c.i*r0 + d2.r*i1 + d2.i*r1;
    }
  }

  private measureQubit(qubit: number): 0 | 1 {
    const d = 1 << this.numQubits;
    const bit = 1 << (this.numQubits - 1 - qubit);
    let prob0 = 0;
    for (let i = 0; i < d; i++) {
      if (!(i & bit)) prob0 += this.re[i]*this.re[i] + this.im[i]*this.im[i];
    }
    const outcome = (Math.random() < prob0 ? 0 : 1) as 0 | 1;
    // Collapse
    let norm = 0;
    for (let i = 0; i < d; i++) {
      const match = outcome === 0 ? !(i & bit) : !!(i & bit);
      if (match) {
        norm += this.re[i]*this.re[i] + this.im[i]*this.im[i];
      } else {
        this.re[i] = 0; this.im[i] = 0;
      }
    }
    const f = 1 / Math.sqrt(norm);
    for (let i = 0; i < d; i++) { this.re[i] *= f; this.im[i] *= f; }
    this.measurementHistory.push({ qubit, result: outcome, timestamp: Date.now() });
    return outcome;
  }

  private resetQubit(qubit: number): void {
    if (this.measureQubit(qubit) === 1) {
      this.applySingleQubitGate(enhancedGates.X as GateMatrix, qubit);
    }
  }

  private applyQFT(qubits: number[]): void {
    const n = qubits.length;
    for (let i = 0; i < n; i++) {
      this.applySingleQubitGate(enhancedGates.H as GateMatrix, qubits[i]);
      for (let j = i + 1; j < n; j++) {
        const k = j - i + 1;
        this.applyControlledGate(enhancedGates.CRk(k), qubits[j], qubits[i]);
      }
    }
    for (let i = 0; i < Math.floor(n / 2); i++) {
      this.applySWAPDirect(qubits[i], qubits[n - 1 - i]);
    }
  }

  // === GATE DISPATCH ===
  private applyGate(gate: QuantumGate): void {
    switch (gate.type) {
      case 'I': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.I as GateMatrix, gate.qubit); break;
      case 'H': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.H as GateMatrix, gate.qubit); break;
      case 'X': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.X as GateMatrix, gate.qubit); break;
      case 'Y': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.Y as GateMatrix, gate.qubit); break;
      case 'Z': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.Z as GateMatrix, gate.qubit); break;
      case 'S': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.S as GateMatrix, gate.qubit); break;
      case 'SDG': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.SDG as GateMatrix, gate.qubit); break;
      case 'T': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.T as GateMatrix, gate.qubit); break;
      case 'TDG': if (gate.qubit !== undefined) this.applySingleQubitGate(enhancedGates.TDG as GateMatrix, gate.qubit); break;
      case 'RX': if (gate.qubit !== undefined && gate.angle !== undefined) this.applySingleQubitGate(enhancedGates.RX(gate.angle), gate.qubit); break;
      case 'RY': if (gate.qubit !== undefined && gate.angle !== undefined) this.applySingleQubitGate(enhancedGates.RY(gate.angle), gate.qubit); break;
      case 'RZ': if (gate.qubit !== undefined && gate.angle !== undefined) this.applySingleQubitGate(enhancedGates.RZ(gate.angle), gate.qubit); break;
      case 'U1': if (gate.qubit !== undefined && gate.angle !== undefined) this.applySingleQubitGate(enhancedGates.U1(gate.angle), gate.qubit); break;
      case 'U2': if (gate.qubit !== undefined && gate.params && gate.params.length >= 2) this.applySingleQubitGate(enhancedGates.U2(gate.params[0], gate.params[1]), gate.qubit); break;
      case 'U3': if (gate.qubit !== undefined && gate.params && gate.params.length >= 3) this.applySingleQubitGate(enhancedGates.U3(gate.params[0], gate.params[1], gate.params[2]), gate.qubit); break;
      case 'CNOT': case 'CX': if (gate.qubits && gate.qubits.length === 2) this.applyCNOTDirect(gate.qubits[0], gate.qubits[1]); break;
      case 'CZ': if (gate.qubits && gate.qubits.length === 2) this.applyCZDirect(gate.qubits[0], gate.qubits[1]); break;
      case 'SWAP': if (gate.qubits && gate.qubits.length === 2) this.applySWAPDirect(gate.qubits[0], gate.qubits[1]); break;
      case 'TOFFOLI': case 'CCX': if (gate.qubits && gate.qubits.length === 3) this.applyToffoliDirect(gate.qubits[0], gate.qubits[1], gate.qubits[2]); break;
      case 'FREDKIN': case 'CSWAP': if (gate.qubits && gate.qubits.length === 3) this.applyFredkinDirect(gate.qubits[0], gate.qubits[1], gate.qubits[2]); break;
      case 'M': case 'MEASURE': if (gate.qubit !== undefined) this.measureQubit(gate.qubit); break;
      case 'RESET': if (gate.qubit !== undefined) this.resetQubit(gate.qubit); break;
      case 'QFT': if (gate.qubits) this.applyQFT(gate.qubits); break;
      case 'BARRIER': break;
    }
  }

  // === ASYNC SIMULATION ===
  async simulateAsync(circuit: QuantumGate[]): Promise<OptimizedSimulationResult> {
    const startTime = performance.now();
    this.reset();
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    const batchSize = 10;
    
    for (let i = 0; i < sortedGates.length; i += batchSize) {
      const batch = sortedGates.slice(i, i + batchSize);
      for (const gate of batch) {
        if (this.isPaused) {
          await new Promise<void>(resolve => {
            const check = () => { if (!this.isPaused) resolve(); else setTimeout(check, 100); };
            check();
          });
        }
        this.applyGate(gate);
        if (this.isStepMode) {
          this.stepResults.push({
            gateIndex: i + batch.indexOf(gate),
            gate,
            stateVector: this.stateVector,
            entanglement: calculateAdvancedEntanglement(this.re, this.im, this.numQubits),
            timestamp: performance.now()
          });
        }
      }
      if (i + batchSize < sortedGates.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return this.getOptimizedResult(performance.now() - startTime);
  }

  private getOptimizedResult(executionTime: number): OptimizedSimulationResult {
    const d = 1 << this.numQubits;
    const measurementProbabilities: number[] = [];
    for (let i = 0; i < d; i++) {
      measurementProbabilities.push(this.re[i]*this.re[i] + this.im[i]*this.im[i]);
    }

    const entanglement = calculateAdvancedEntanglement(this.re, this.im, this.numQubits);

    const qubitStates = [];
    for (let q = 0; q < this.numQubits; q++) {
      let prob0 = 0, prob1 = 0;
      let a0r = 0, a0i = 0, a1r = 0, a1i = 0;
      for (let state = 0; state < d; state++) {
        const bit = (state >> (this.numQubits - 1 - q)) & 1;
        const p = this.re[state]*this.re[state] + this.im[state]*this.im[state];
        if (bit === 0) { prob0 += p; a0r += this.re[state]; a0i += this.im[state]; }
        else { prob1 += p; a1r += this.re[state]; a1i += this.im[state]; }
      }
      let dominantState = '|0⟩', dr = a0r, di = a0i, dp = prob0;
      if (prob1 > prob0) { dominantState = '|1⟩'; dr = a1r; di = a1i; dp = prob1; }
      else if (Math.abs(prob0 - prob1) < 0.01) { dominantState = '|+⟩'; dr = a0r + a1r; di = a0i + a1i; }
      qubitStates.push({
        qubit: q, state: dominantState,
        amplitude: { real: dr, imag: di },
        phase: Math.atan2(di, dr),
        probability: dp
      });
    }

    const totalProb = measurementProbabilities.reduce((s, p) => s + p, 0);

    return {
      stateVector: this.stateVector,
      measurementProbabilities,
      qubitStates,
      entanglement,
      executionTime,
      fidelity: Math.min(1, totalProb),
      mode: this.currentMode
    };
  }
  
  getStepResults(): SimulationStepData[] { return this.stepResults; }
}

export const optimizedQuantumSimulator = new OptimizedQuantumSimulator(5);
