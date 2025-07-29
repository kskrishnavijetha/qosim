
/**
 * QOSim SDK Examples
 * Comprehensive examples demonstrating SDK capabilities
 */

import QOSimSDK, { CircuitBuilder, QuantumCircuit } from './qosim-sdk';

/**
 * Example 1: Basic Bell State Creation and Simulation
 */
export async function basicBellStateExample() {
  console.log('=== Basic Bell State Example ===');
  
  const sdk = new QOSimSDK({
    backend: 'local',
    debug: true
  });

  await sdk.initialize();
  
  // Create Bell state circuit
  let circuit = sdk.createCircuit('Bell State', 2, 'Maximally entangled two-qubit state');
  circuit = sdk.h(circuit, 0);
  circuit = sdk.cnot(circuit, 0, 1);
  
  console.log('Circuit created:', circuit.name);
  console.log('Gates:', circuit.gates.length);
  
  // Simulate the circuit
  const result = await sdk.simulate(circuit, 1024);
  console.log('Measurement probabilities:', Object.keys(result.measurementProbabilities).map(state => 
    `|${state}⟩: ${(result.probabilities[0] * 100).toFixed(1)}%`
  ).join(', '));
  
  return { circuit, result };
}

/**
 * Example 2: Multi-Qubit GHZ State with Circuit Builder
 */
export async function ghzStateExample() {
  console.log('\n=== GHZ State Example ===');
  
  const sdk = new QOSimSDK({ debug: true });
  await sdk.initialize();
  
  const builder = new CircuitBuilder(sdk);
  const circuit = builder.ghzState(3, 'GHZ State Example');
  
  const result = await sdk.simulate(circuit);
  console.log('GHZ state created with', circuit.gates.length, 'gates');
  console.log('Basis states:', result.basisStates.join(', '));
  console.log('Probabilities:', result.probabilities.map(p => `${(p * 100).toFixed(1)}%`).join(', '));
  
  return { circuit, result };
}

/**
 * Example 3: Quantum Random Number Generator
 */
export async function quantumRandomGeneratorExample() {
  console.log('\n=== Quantum Random Generator Example ===');
  
  const sdk = new QOSimSDK({ debug: true });
  await sdk.initialize();
  
  const builder = new CircuitBuilder(sdk);
  const circuit = builder.randomGenerator(4, 'QRNG 4-bit');
  
  const result = await sdk.simulate(circuit);
  
  // Generate random number by sampling
  const randomIndex = Math.floor(Math.random() * result.probabilities.length);
  const randomState = result.basisStates[randomIndex];
  const randomNumber = parseInt(randomState, 2);
  
  console.log(`Generated random number: ${randomNumber} (binary: ${randomState})`);
  console.log(`From ${result.basisStates.length} possible states with equal probabilities`);
  
  return { circuit, result, randomNumber };
}

/**
 * Example 4: Advanced Circuit Export
 */
export async function circuitExportExample() {
  console.log('\n=== Circuit Export Example ===');
  
  const sdk = new QOSimSDK({ debug: true });
  await sdk.initialize();
  
  // Create a more complex circuit
  let circuit = sdk.createCircuit('Export Demo', 3, 'Demonstration of export capabilities');
  circuit = sdk.h(circuit, 0);
  circuit = sdk.cnot(circuit, 0, 1);
  circuit = sdk.cnot(circuit, 1, 2);
  circuit = sdk.rz(circuit, 2, Math.PI / 4);
  
  // Export to different formats
  const jsonExport = sdk.exportCircuit(circuit, 'json');
  const qasmExport = sdk.exportCircuit(circuit, 'qasm');
  const pythonExport = sdk.exportCircuit(circuit, 'python');
  
  console.log('Circuit exported to JSON, QASM, and Python formats');
  console.log('JSON length:', jsonExport.length, 'characters');
  console.log('QASM length:', qasmExport.length, 'characters');
  console.log('Python length:', pythonExport.length, 'characters');
  
  return { circuit, jsonExport, qasmExport, pythonExport };
}

/**
 * Example 5: Circuit Management and Persistence
 */
export async function circuitManagementExample() {
  console.log('\n=== Circuit Management Example ===');
  
  const sdk = new QOSimSDK({
    backend: 'local',
    debug: true
  });

  await sdk.initialize();
  
  // Create multiple circuits
  const bellCircuit = new CircuitBuilder(sdk).bellState('Bell State');
  
  console.log('Circuit management example completed');
  console.log('Bell circuit:', bellCircuit.name);
  
  return { bellCircuit };
}

/**
 * Example 6: Advanced Algorithm Patterns
 */
export async function advancedAlgorithmExample() {
  console.log('\n=== Advanced Algorithm Example ===');
  
  const sdk = new QOSimSDK({ debug: true });
  await sdk.initialize();
  
  // Create a quantum algorithm that demonstrates interference
  let circuit = sdk.createCircuit('Interference Demo', 3, 'Quantum interference pattern');
  
  // Create superposition
  circuit = sdk.h(circuit, 0);
  circuit = sdk.h(circuit, 1);
  circuit = sdk.h(circuit, 2);
  
  // Add some phase rotations
  circuit = sdk.rz(circuit, 0, Math.PI / 3);
  circuit = sdk.rz(circuit, 1, Math.PI / 4);
  
  // Create entanglement
  circuit = sdk.cnot(circuit, 0, 1);
  circuit = sdk.cnot(circuit, 1, 2);
  
  const result = await sdk.simulate(circuit);
  
  console.log('Advanced algorithm simulated');
  console.log('Circuit depth:', result.circuitDepth);
  console.log('Execution time:', result.executionTime.toFixed(2), 'ms');
  
  // Analyze probability distribution
  const maxProb = Math.max(...result.probabilities);
  const minProb = Math.min(...result.probabilities.filter(p => p > 0));
  const avgProb = result.probabilities.reduce((a, b) => a + b, 0) / result.probabilities.length;
  
  console.log('Probability analysis:');
  console.log(`  Max: ${(maxProb * 100).toFixed(2)}%`);
  console.log(`  Min: ${(minProb * 100).toFixed(2)}%`);
  console.log(`  Avg: ${(avgProb * 100).toFixed(2)}%`);
  
  return { circuit, result, analysis: { maxProb, minProb, avgProb } };
}

/**
 * Run all examples in sequence
 */
export async function runAllExamples() {
  console.log('🚀 Running all QOSim SDK examples...\n');
  
  try {
    await basicBellStateExample();
    await ghzStateExample();
    await quantumRandomGeneratorExample();
    await circuitExportExample();
    await circuitManagementExample();
    await advancedAlgorithmExample();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    throw error;
  }
}
