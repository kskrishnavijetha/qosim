/**
 * QOSim Core - Quantum Circuit Simulation Engine
 * Statevector-based quantum circuit simulator
 */

class Complex {
  constructor(real = 0, imag = 0) {
    this.real = real;
    this.imag = imag;
  }

  static fromPolar(magnitude, phase) {
    return new Complex(
      magnitude * Math.cos(phase),
      magnitude * Math.sin(phase)
    );
  }

  add(other) {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  multiply(other) {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  conjugate() {
    return new Complex(this.real, -this.imag);
  }

  magnitude() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }

  phase() {
    return Math.atan2(this.imag, this.real);
  }

  toString() {
    const realStr = this.real.toFixed(4);
    const imagStr = Math.abs(this.imag).toFixed(4);
    const sign = this.imag >= 0 ? '+' : '-';
    return `${realStr}${sign}${imagStr}i`;
  }
}

class QuantumGate {
  constructor(name, qubits, params = []) {
    this.name = name;
    this.qubits = Array.isArray(qubits) ? qubits : [qubits];
    this.params = params;
  }

  static getMatrix(gateName, params = []) {
    const gates = {
      'I': [[new Complex(1), new Complex(0)], [new Complex(0), new Complex(1)]],
      'X': [[new Complex(0), new Complex(1)], [new Complex(1), new Complex(0)]],
      'Y': [[new Complex(0), new Complex(0, -1)], [new Complex(0, 1), new Complex(0)]],
      'Z': [[new Complex(1), new Complex(0)], [new Complex(0), new Complex(-1)]],
      'H': [[new Complex(1/Math.sqrt(2)), new Complex(1/Math.sqrt(2))], 
            [new Complex(1/Math.sqrt(2)), new Complex(-1/Math.sqrt(2))]],
      'S': [[new Complex(1), new Complex(0)], [new Complex(0), new Complex(0, 1)]],
      'T': [[new Complex(1), new Complex(0)], [new Complex(0), Complex.fromPolar(1, Math.PI/4)]],
    };

    if (gateName === 'RX' && params.length > 0) {
      const theta = params[0];
      const cos = Math.cos(theta / 2);
      const sin = Math.sin(theta / 2);
      return [
        [new Complex(cos), new Complex(0, -sin)],
        [new Complex(0, -sin), new Complex(cos)]
      ];
    }

    if (gateName === 'RY' && params.length > 0) {
      const theta = params[0];
      const cos = Math.cos(theta / 2);
      const sin = Math.sin(theta / 2);
      return [
        [new Complex(cos), new Complex(-sin)],
        [new Complex(sin), new Complex(cos)]
      ];
    }

    if (gateName === 'RZ' && params.length > 0) {
      const theta = params[0];
      return [
        [Complex.fromPolar(1, -theta/2), new Complex(0)],
        [new Complex(0), Complex.fromPolar(1, theta/2)]
      ];
    }

    return gates[gateName] || gates['I'];
  }
}

export class QOSimSimulator {
  constructor(numQubits) {
    if (numQubits < 1 || numQubits > 20) {
      throw new Error('Number of qubits must be between 1 and 20');
    }
    
    this.numQubits = numQubits;
    this.gates = [];
    this.measurements = [];
    this.reset();
  }

  reset() {
    // Initialize |00...0⟩ state
    const stateSize = 2 ** this.numQubits;
    this.stateVector = new Array(stateSize).fill(null).map(() => new Complex(0));
    this.stateVector[0] = new Complex(1); // |00...0⟩
    this.gates = [];
    this.measurements = [];
  }

  addGate(gateName, ...args) {
    if (gateName === 'CNOT' || gateName === 'CX') {
      if (args.length !== 2) {
        throw new Error('CNOT gate requires exactly 2 qubits (control, target)');
      }
      this.gates.push(new QuantumGate('CNOT', args));
    } else if (gateName === 'CCX' || gateName === 'TOFFOLI') {
      if (args.length !== 3) {
        throw new Error('Toffoli gate requires exactly 3 qubits (control1, control2, target)');
      }
      this.gates.push(new QuantumGate('CCX', args));
    } else if (['RX', 'RY', 'RZ'].includes(gateName)) {
      if (args.length !== 2) {
        throw new Error(`${gateName} gate requires a qubit index and angle parameter`);
      }
      const [qubit, angle] = args;
      this.gates.push(new QuantumGate(gateName, qubit, [angle]));
    } else {
      // Single qubit gates
      if (args.length !== 1) {
        throw new Error(`${gateName} gate requires exactly 1 qubit`);
      }
      this.gates.push(new QuantumGate(gateName, args[0]));
    }
  }

  measure(qubit) {
    if (qubit < 0 || qubit >= this.numQubits) {
      throw new Error(`Qubit index ${qubit} out of range`);
    }
    this.measurements.push(qubit);
  }

  applySingleQubitGate(gate, targetQubit) {
    const matrix = QuantumGate.getMatrix(gate.name, gate.params);
    const newStateVector = new Array(this.stateVector.length).fill(null).map(() => new Complex(0));

    for (let state = 0; state < this.stateVector.length; state++) {
      const qubitValue = (state >> targetQubit) & 1;
      const otherBits = state & ~(1 << targetQubit);
      
      // Apply gate matrix
      for (let newQubitValue = 0; newQubitValue < 2; newQubitValue++) {
        const newState = otherBits | (newQubitValue << targetQubit);
        const amplitude = this.stateVector[state].multiply(matrix[newQubitValue][qubitValue]);
        newStateVector[newState] = newStateVector[newState].add(amplitude);
      }
    }

    this.stateVector = newStateVector;
  }

  applyCNOT(controlQubit, targetQubit) {
    const newStateVector = [...this.stateVector];

    for (let state = 0; state < this.stateVector.length; state++) {
      const controlBit = (state >> controlQubit) & 1;
      
      if (controlBit === 1) {
        // Flip target qubit
        const flippedState = state ^ (1 << targetQubit);
        const temp = newStateVector[state];
        newStateVector[state] = newStateVector[flippedState];
        newStateVector[flippedState] = temp;
      }
    }

    this.stateVector = newStateVector;
  }

  applyToffoli(control1, control2, target) {
    const newStateVector = [...this.stateVector];

    for (let state = 0; state < this.stateVector.length; state++) {
      const control1Bit = (state >> control1) & 1;
      const control2Bit = (state >> control2) & 1;
      
      if (control1Bit === 1 && control2Bit === 1) {
        // Flip target qubit
        const flippedState = state ^ (1 << target);
        const temp = newStateVector[state];
        newStateVector[state] = newStateVector[flippedState];
        newStateVector[flippedState] = temp;
      }
    }

    this.stateVector = newStateVector;
  }

  run() {
    for (const gate of this.gates) {
      if (gate.name === 'CNOT') {
        this.applyCNOT(gate.qubits[0], gate.qubits[1]);
      } else if (gate.name === 'CCX') {
        this.applyToffoli(gate.qubits[0], gate.qubits[1], gate.qubits[2]);
      } else {
        this.applySingleQubitGate(gate, gate.qubits[0]);
      }
    }

    // Normalize the state vector
    const norm = Math.sqrt(this.stateVector.reduce((sum, amp) => sum + amp.magnitude() ** 2, 0));
    if (norm > 0) {
      this.stateVector = this.stateVector.map(amp => new Complex(amp.real / norm, amp.imag / norm));
    }
  }

  getStateVector() {
    return this.stateVector.map(amp => ({
      real: amp.real,
      imag: amp.imag,
      magnitude: amp.magnitude(),
      phase: amp.phase()
    }));
  }

  getProbabilities() {
    return this.stateVector.map(amp => amp.magnitude() ** 2);
  }

  getMeasurementProbabilities(qubit) {
    if (qubit < 0 || qubit >= this.numQubits) {
      throw new Error(`Qubit index ${qubit} out of range`);
    }

    let prob0 = 0;
    let prob1 = 0;

    for (let state = 0; state < this.stateVector.length; state++) {
      const qubitValue = (state >> qubit) & 1;
      const probability = this.stateVector[state].magnitude() ** 2;
      
      if (qubitValue === 0) {
        prob0 += probability;
      } else {
        prob1 += probability;
      }
    }

    return { 0: prob0, 1: prob1 };
  }

  getBasisStates() {
    return this.stateVector.map((amp, index) => ({
      state: index.toString(2).padStart(this.numQubits, '0'),
      amplitude: amp,
      probability: amp.magnitude() ** 2
    })).filter(item => item.probability > 1e-10);
  }

  getCircuitDepth() {
    return this.gates.length;
  }

  getGateCount() {
    const counts = {};
    this.gates.forEach(gate => {
      counts[gate.name] = (counts[gate.name] || 0) + 1;
    });
    return counts;
  }
}

export { Complex, QuantumGate };