/**
 * Grover's Search Algorithm Example
 * Searches for a marked item in an unsorted database
 */

import { QOSimSimulator } from '../src/qosim-core.js';
import { exportQASM } from '../src/qosim-qasm.js';

console.log('=== Grover\'s Search Algorithm ===\n');

// For 2 qubits, we can search 4 items (00, 01, 10, 11)
// Let's search for item "11" (index 3)
const numQubits = 2;
const targetItem = 3; // Binary: 11

const sim = new QOSimSimulator(numQubits);

console.log(`Searching for item |${targetItem.toString(2).padStart(numQubits, '0')}⟩ in database of ${2**numQubits} items`);

// Step 1: Initialize superposition (equal amplitude for all states)
console.log('\nStep 1: Initialize uniform superposition');
for (let i = 0; i < numQubits; i++) {
  sim.addGate('H', i);
}

sim.run();
console.log('After initialization:');
const initialStates = sim.getBasisStates();
initialStates.forEach(state => {
  console.log(`|${state.state}⟩: ${state.probability.toFixed(4)}`);
});

// For 2 qubits, optimal number of iterations is π/4 * sqrt(N) ≈ 1
const numIterations = 1;

console.log(`\nStep 2: Apply ${numIterations} Grover iteration(s)`);

for (let iter = 0; iter < numIterations; iter++) {
  console.log(`\n--- Iteration ${iter + 1} ---`);
  
  // Oracle: flip the amplitude of the target item
  // For item "11", we apply Z gates controlled by both qubits being 1
  // This is equivalent to a phase flip on |11⟩
  if (targetItem === 3) { // 11 in binary
    // Phase flip |11⟩: apply controlled-Z with both controls
    sim.addGate('H', 1);    // Convert X to Z basis
    sim.addGate('CCX', 0, 1, 1); // This is actually a controlled-Z
    sim.addGate('H', 1);    // Convert back
    // Note: This is a simplified oracle for demonstration
  }
  
  // Diffusion operator (inversion about average)
  // Apply H to all qubits
  for (let i = 0; i < numQubits; i++) {
    sim.addGate('H', i);
  }
  
  // Apply X to all qubits
  for (let i = 0; i < numQubits; i++) {
    sim.addGate('X', i);
  }
  
  // Multi-controlled Z (phase flip |11...1⟩)
  sim.addGate('H', numQubits - 1);
  if (numQubits === 2) {
    sim.addGate('CNOT', 0, 1);
  }
  sim.addGate('H', numQubits - 1);
  
  // Apply X to all qubits (undo)
  for (let i = 0; i < numQubits; i++) {
    sim.addGate('X', i);
  }
  
  // Apply H to all qubits (undo)
  for (let i = 0; i < numQubits; i++) {
    sim.addGate('H', i);
  }
  
  // Run and check intermediate result
  sim.run();
  const iterStates = sim.getBasisStates();
  console.log('After iteration:');
  iterStates.forEach(state => {
    const isTarget = parseInt(state.state, 2) === targetItem;
    const marker = isTarget ? ' ← TARGET' : '';
    console.log(`|${state.state}⟩: ${state.probability.toFixed(4)}${marker}`);
  });
}

console.log('\n=== Final Results ===');
const finalStates = sim.getBasisStates();
const targetState = finalStates.find(s => parseInt(s.state, 2) === targetItem);

console.log('\nFinal probabilities:');
finalStates.forEach(state => {
  const isTarget = parseInt(state.state, 2) === targetItem;
  const marker = isTarget ? ' ← TARGET' : '';
  console.log(`|${state.state}⟩: ${state.probability.toFixed(4)}${marker}`);
});

if (targetState) {
  console.log(`\nSuccess! Target item |${targetState.state}⟩ has probability: ${targetState.probability.toFixed(4)}`);
  console.log(`Amplitude amplification: ${Math.sqrt(targetState.probability / 0.25).toFixed(2)}x`);
} else {
  console.log('\nTarget item not found with significant probability');
}

console.log('\nGrover\'s algorithm provides quadratic speedup over classical search');
console.log('Classical: O(N) comparisons, Quantum: O(√N) operations');

// Export to QASM
console.log('\n=== QASM Export ===');
console.log(exportQASM(sim));