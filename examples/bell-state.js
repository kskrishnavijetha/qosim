/**
 * Bell State Example
 * Creates and simulates a Bell state (maximally entangled 2-qubit state)
 */

import { QOSimSimulator } from '../src/qosim-core.js';
import { exportQASM } from '../src/qosim-qasm.js';

console.log('=== Bell State Example ===\n');

// Create a 2-qubit quantum simulator
const sim = new QOSimSimulator(2);

// Create Bell state: |00⟩ + |11⟩ (normalized)
sim.addGate('H', 0);     // Put qubit 0 in superposition
sim.addGate('CNOT', 0, 1); // Entangle qubit 1 with qubit 0

// Run the simulation
sim.run();

// Display results
console.log('Circuit depth:', sim.getCircuitDepth());
console.log('Gate count:', sim.getGateCount());
console.log('\nFinal state vector:');

const stateVector = sim.getStateVector();
stateVector.forEach((amplitude, index) => {
  const binaryState = index.toString(2).padStart(2, '0');
  const magnitude = amplitude.magnitude;
  const phase = amplitude.phase;
  
  if (magnitude > 1e-10) {
    console.log(`|${binaryState}⟩: ${magnitude.toFixed(4)} * e^(i*${(phase/Math.PI).toFixed(3)}π)`);
  }
});

console.log('\nBasis states with non-zero amplitudes:');
const basisStates = sim.getBasisStates();
basisStates.forEach(state => {
  console.log(`|${state.state}⟩: probability = ${state.probability.toFixed(4)}`);
});

console.log('\nMeasurement probabilities:');
console.log('Qubit 0:', sim.getMeasurementProbabilities(0));
console.log('Qubit 1:', sim.getMeasurementProbabilities(1));

console.log('\nExpected result: Equal probability (0.5) for |00⟩ and |11⟩ states');
console.log('This demonstrates quantum entanglement - measuring one qubit determines the other');

// Export to QASM
console.log('\n=== QASM Export ===');
console.log(exportQASM(sim));