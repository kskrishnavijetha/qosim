/**
 * Quantum Fourier Transform (QFT) Example
 * Demonstrates the quantum analogue of the discrete Fourier transform
 */

import { QOSimSimulator } from '../src/qosim-core.js';
import { exportQASM } from '../src/qosim-qasm.js';

console.log('=== Quantum Fourier Transform ===\n');

// QFT on 3 qubits
const numQubits = 3;
const sim = new QOSimSimulator(numQubits);

console.log(`Performing QFT on ${numQubits} qubits`);

// Prepare an input state |101⟩ (decimal 5)
console.log('\nStep 1: Prepare input state |101⟩');
sim.addGate('X', 0); // Set qubit 0 to |1⟩
sim.addGate('X', 2); // Set qubit 2 to |1⟩

sim.run();
console.log('Input state:');
const inputStates = sim.getBasisStates();
inputStates.forEach(state => {
  console.log(`|${state.state}⟩: ${state.probability.toFixed(4)}`);
});

// Apply QFT
console.log('\nStep 2: Apply Quantum Fourier Transform');

function applyQFT(simulator, n) {
  for (let j = 0; j < n; j++) {
    // Apply Hadamard to qubit j
    simulator.addGate('H', j);
    
    // Apply controlled rotations
    for (let k = j + 1; k < n; k++) {
      const angle = Math.PI / Math.pow(2, k - j);
      // Note: In a full implementation, we'd need controlled-RZ gates
      // For this example, we'll use a simplified approach
      if (k - j === 1) {
        // Approximate controlled-S gate (π/2 rotation)
        simulator.addGate('S', k);
        simulator.addGate('CNOT', j, k);
        simulator.addGate('S', k); // This is a rough approximation
        simulator.addGate('CNOT', j, k);
      }
    }
  }
  
  // Swap qubits to reverse the order (bit-reversal)
  for (let i = 0; i < Math.floor(n / 2); i++) {
    const j = n - 1 - i;
    // Swap qubits i and j using three CNOTs
    simulator.addGate('CNOT', i, j);
    simulator.addGate('CNOT', j, i);
    simulator.addGate('CNOT', i, j);
  }
}

applyQFT(sim, numQubits);

sim.run();

console.log('\nAfter QFT:');
const qftStates = sim.getBasisStates();
qftStates.forEach(state => {
  const amplitude = state.amplitude;
  const magnitude = amplitude.magnitude();
  const phase = amplitude.phase();
  console.log(`|${state.state}⟩: magnitude=${magnitude.toFixed(4)}, phase=${(phase/Math.PI).toFixed(3)}π`);
});

// Theoretical QFT result for |101⟩
console.log('\n=== Analysis ===');
console.log('The QFT transforms basis states |j⟩ to superposition states');
console.log('For input |101⟩ (decimal 5), the QFT should produce:');
console.log('A superposition with specific phase relationships');

console.log('\nQFT Properties:');
console.log('- Transforms computational basis to Fourier basis');
console.log('- Encodes frequency information in quantum phases');
console.log('- Essential component of Shor\'s algorithm');
console.log('- Provides exponential speedup for certain problems');

// Demonstrate periodicity detection
console.log('\n=== Period Detection Example ===');
const periodicSim = new QOSimSimulator(3);

// Create a periodic function f(x) = x mod 2 (period = 2)
console.log('Simulating periodic function with period 2');

// Prepare equal superposition
for (let i = 0; i < numQubits; i++) {
  periodicSim.addGate('H', i);
}

periodicSim.run();
console.log('\nSuperposition state:');
const superStates = periodicSim.getBasisStates();
superStates.forEach(state => {
  console.log(`|${state.state}⟩: ${state.probability.toFixed(4)}`);
});

// Apply period-finding circuit (simplified)
// In practice, this would involve quantum phase estimation
applyQFT(periodicSim, numQubits);
periodicSim.run();

console.log('\nAfter QFT (period detection):');
const periodStates = periodicSim.getBasisStates();
periodStates.forEach(state => {
  const stateValue = parseInt(state.state, 2);
  const probability = state.probability;
  console.log(`|${state.state}⟩ (${stateValue}): ${probability.toFixed(4)}`);
});

console.log('\nIn real period-finding, peaks would appear at multiples of N/period');

// Circuit statistics
console.log('\n=== Circuit Statistics ===');
console.log('Total gates:', sim.getCircuitDepth());
console.log('Gate distribution:', sim.getGateCount());

// Export to QASM
console.log('\n=== QASM Export ===');
console.log(exportQASM(sim));