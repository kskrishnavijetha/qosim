export const sdkExamples = {
  "bell-state": {
    name: "Bell State",
    code: `// Create a Bell State using QOSim SDK
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(2);
sim.addGate("H", 0);     // Apply Hadamard to qubit 0
sim.addGate("CNOT", 0, 1); // Apply CNOT with control=0, target=1

sim.run();
console.log("Final State Vector:", sim.getStateVector());
console.log("Measurement Probabilities:", sim.getMeasurementProbabilities());`,
    description: "Creates an entangled Bell state |00⟩ + |11⟩"
  },
  "grover": {
    name: "Grover's Algorithm",
    code: `// Grover's Search Algorithm
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(2);
// Initialize superposition
sim.addGate("H", 0);
sim.addGate("H", 1);

// Oracle for |11⟩
sim.addGate("CZ", 0, 1);

// Diffusion operator
sim.addGate("H", 0);
sim.addGate("H", 1);
sim.addGate("X", 0);
sim.addGate("X", 1);
sim.addGate("CZ", 0, 1);
sim.addGate("X", 0);
sim.addGate("X", 1);
sim.addGate("H", 0);
sim.addGate("H", 1);

sim.run();
console.log("State Vector:", sim.getStateVector());`,
    description: "Searches for |11⟩ state with quantum advantage"
  },
  "qft": {
    name: "Quantum Fourier Transform",
    code: `// Quantum Fourier Transform
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(3);
// Apply QFT to 3 qubits
sim.addGate("H", 0);
sim.addGate("CP", 0, 1, Math.PI/2);
sim.addGate("CP", 0, 2, Math.PI/4);
sim.addGate("H", 1);
sim.addGate("CP", 1, 2, Math.PI/2);
sim.addGate("H", 2);

// Swap qubits for correct output
sim.addGate("SWAP", 0, 2);

sim.run();
console.log("QFT Result:", sim.getStateVector());`,
    description: "Performs quantum Fourier transform on 3 qubits"
  },
  "error-correction": {
    name: "Error Correction",
    code: `// 3-Qubit Bit-Flip Error Correction
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(3);

// Encode logical |+⟩ state (|000⟩ + |111⟩)/√2
sim.addGate("H", 0);     // Create superposition
sim.addGate("CNOT", 0, 1); // Copy to ancilla qubits
sim.addGate("CNOT", 0, 2);

// Introduce bit-flip error on qubit 1
sim.addGate("X", 1);

// Error detection syndrome
sim.addGate("CNOT", 0, 1);
sim.addGate("CNOT", 0, 2);

sim.run();
console.log("Error Corrected State:", sim.getStateVector());`,
    description: "3-qubit error correction with syndrome detection"
  },
  "qasm": {
    name: "QASM Import/Export",
    code: `// QASM Import/Export Demo
import { QOSimSimulator } from './qosim-core.js';

// Create circuit
const sim = new QOSimSimulator(2);
sim.addGate("H", 0);
sim.addGate("CNOT", 0, 1);

sim.run();
console.log("Bell State Result:", sim.getStateVector());`,
    description: "Demonstrates quantum circuit programming with QASM"
  }
} as const;

export const mockSimulationResults = {
  "bell-state": {
    stateVector: [0.7071, 0, 0, 0.7071],
    probabilities: [0.5, 0, 0, 0.5],
    entanglement: "Qubits 0 and 1 are maximally entangled"
  },
  "grover": {
    stateVector: [0, 0, 0, 1],
    probabilities: [0, 0, 0, 1],
    amplification: "Target state |11⟩ amplified to ~100%"
  },
  "qft": {
    stateVector: [0.3536, 0.3536, 0.3536, 0.3536, 0.3536, 0.3536, 0.3536, 0.3536],
    frequencies: "Uniform frequency distribution achieved"
  },
  "qasm": {
    qasmCode: `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0], q[1];`,
    imported: true
  }
} as const;