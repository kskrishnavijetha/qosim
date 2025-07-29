# QOSim SDK

A powerful JavaScript SDK for quantum circuit simulation, QASM import/export, and visualization. Build quantum algorithms programmatically with a clean, intuitive API.

## 🚀 Quick Start

```javascript
import { QOSimSimulator } from './src/qosim-core.js';

// Create a Bell state
const sim = new QOSimSimulator(2);
sim.addGate('H', 0);
sim.addGate('CNOT', 0, 1);
sim.run();

console.log(sim.getBasisStates());
// Output: |00⟩: 0.5000, |11⟩: 0.5000
```

## 📦 Core Features

### Quantum Circuit Simulation
- **Statevector simulation** up to 20 qubits
- **All standard gates**: H, X, Y, Z, S, T, CNOT, Toffoli
- **Parametric gates**: RX, RY, RZ with custom angles
- **Measurement simulation** with probabilities

### QASM Support
- **Import** OpenQASM 2.0 files
- **Export** circuits to QASM format
- **Full compatibility** with IBM Qiskit

### Visualization
- **Circuit diagrams** with HTML5 Canvas
- **State vector visualization** with amplitude and phase
- **Embeddable components** for web applications

## 🧪 Running Examples

```bash
# Run example scripts
node examples/bell-state.js        # Bell state creation
node examples/grover-search.js     # Grover's search algorithm
node examples/quantum-fourier-transform.js  # QFT
node examples/error-correction.js  # Quantum error correction
```

## 📖 API Reference

### `QOSimSimulator(numQubits)`
```javascript
const sim = new QOSimSimulator(3); // 3-qubit system

// Single-qubit gates
sim.addGate('H', 0);        // Hadamard
sim.addGate('X', 1);        // Pauli-X
sim.addGate('RX', 0, Math.PI/2);  // X-rotation

// Multi-qubit gates
sim.addGate('CNOT', 0, 1);  // CNOT
sim.addGate('CCX', 0, 1, 2); // Toffoli

// Run and get results
sim.run();
const states = sim.getBasisStates();
const probs = sim.getProbabilities();
```

## 🔄 QASM Integration

```javascript
import { loadQASM, exportQASM } from './src/qosim-qasm.js';

// Import from QASM
const sim = loadQASM(qasmCode);

// Export to QASM
const qasm = exportQASM(sim);
```

## 🎨 Visualization

```javascript
import { CircuitVisualizer, StateVectorVisualizer } from './src/qosim-visualizer.js';

// Circuit diagrams
const circuitViz = new CircuitVisualizer('canvas-container');
circuitViz.render(sim);

// State vector plots
const stateViz = new StateVectorVisualizer('state-container');
stateViz.render(sim);
```
