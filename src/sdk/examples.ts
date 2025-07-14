/**
 * QOSim SDK Examples
 * Comprehensive examples showing how to use the QOSim JavaScript SDK
 */

import { QOSimSDK, CircuitBuilder, QuantumCircuit } from './qosim-sdk';

/**
 * Example 1: Basic Circuit Creation and Simulation
 */
export async function basicExample() {
  console.log('=== Basic Circuit Example ===');
  
  // Initialize SDK
  const sdk = new QOSimSDK({
    defaultQubits: 2,
    autoSave: false
  });
  
  await sdk.initialize();
  
  // Create a simple circuit
  let circuit = sdk.createCircuit('My First Circuit', 2, 'A simple H-gate followed by CNOT');
  
  // Add gates
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  
  // Simulate
  const result = await sdk.simulate(circuit);
  
  console.log('Circuit:', circuit);
  console.log('Simulation Result:', result);
  console.log('Probabilities:', result.probabilities);
  
  return { circuit, result };
}

/**
 * Example 2: Bell State Creation using Circuit Builder
 */
export async function bellStateExample() {
  console.log('=== Bell State Example ===');
  
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create Bell state using builder
  const bellCircuit = builder.bellState('Bell State Demo');
  
  // Simulate
  const result = await sdk.simulate(bellCircuit);
  
  console.log('Bell State Circuit:', bellCircuit);
  console.log('State Vector:', result.stateVector);
  console.log('Basis States:', result.basisStates);
  console.log('Probabilities:', result.probabilities);
  
  return { bellCircuit, result };
}

/**
 * Example 3: Quantum Random Number Generator
 */
export async function randomGeneratorExample() {
  console.log('=== Quantum Random Generator Example ===');
  
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create random generator with 4 qubits
  const randomCircuit = builder.randomGenerator(4, 'Quantum RNG');
  
  // Simulate multiple times to see randomness
  const results = [];
  for (let i = 0; i < 5; i++) {
    const result = await sdk.simulate(randomCircuit);
    
    // Simulate measurement by sampling from probabilities
    const measurement = sampleFromProbabilities(result.probabilities, result.basisStates);
    results.push(measurement);
    
    console.log(`Run ${i + 1}: Measured state ${measurement}`);
  }
  
  console.log('All measurements:', results);
  return { randomCircuit, results };
}

/**
 * Example 4: Advanced Circuit with Rotation Gates
 */
export async function rotationExample() {
  console.log('=== Rotation Gates Example ===');
  
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  // Create circuit with rotation gates
  let circuit = sdk.createCircuit('Rotation Demo', 2, 'Demonstrates X, Y, Z rotations');
  
  // Add rotation gates
  circuit = sdk.addGate(circuit, { type: 'rx', qubit: 0, angle: Math.PI / 4 });
  circuit = sdk.addGate(circuit, { type: 'ry', qubit: 1, angle: Math.PI / 3 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'rz', qubit: 0, angle: Math.PI / 6 });
  
  const result = await sdk.simulate(circuit);
  
  console.log('Rotation Circuit:', circuit);
  console.log('Final State Vector:', result.stateVector);
  console.log('Execution Time:', result.executionTime, 'ms');
  
  return { circuit, result };
}

/**
 * Example 5: Circuit Export and Import
 */
export async function exportImportExample() {
  console.log('=== Export/Import Example ===');
  
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create a GHZ state
  const ghzCircuit = builder.ghzState(3, 'GHZ-3');
  
  // Export to different formats
  const jsonExport = sdk.exportCircuit(ghzCircuit, 'json');
  const qasmExport = sdk.exportCircuit(ghzCircuit, 'qasm');
  const pythonExport = sdk.exportCircuit(ghzCircuit, 'python');
  
  console.log('=== JSON Export ===');
  console.log(jsonExport);
  
  console.log('\n=== QASM Export ===');
  console.log(qasmExport);
  
  console.log('\n=== Python Export ===');
  console.log(pythonExport);
  
  return {
    circuit: ghzCircuit,
    exports: { json: jsonExport, qasm: qasmExport, python: pythonExport }
  };
}

/**
 * Example 6: Save and Load Circuits (requires authentication)
 */
export async function saveLoadExample() {
  console.log('=== Save/Load Example ===');
  
  const sdk = new QOSimSDK({ autoSave: true });
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  try {
    // Create and save a circuit
    const circuit = builder.bellState('Saved Bell State');
    const circuitId = await sdk.saveCircuit(circuit);
    
    console.log('Saved circuit with ID:', circuitId);
    
    // Load the circuit back
    const loadedCircuit = await sdk.loadCircuit(circuitId);
    console.log('Loaded circuit:', loadedCircuit);
    
    // List all circuits
    const allCircuits = await sdk.listCircuits();
    console.log('All circuits:', allCircuits.map(c => ({ id: c.id, name: c.name })));
    
    return { circuitId, loadedCircuit, allCircuits };
  } catch (error) {
    console.error('Save/Load requires authentication:', error);
    return { error: 'Authentication required for save/load operations' };
  }
}

/**
 * Example 7: Complex Algorithm - Grover's Search
 */
export async function groverExample() {
  console.log('=== Grover\'s Algorithm Example ===');
  
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  // Simple 2-qubit Grover's algorithm searching for |11⟩
  let circuit = sdk.createCircuit('Grover-2Q', 2, "Grover's algorithm for 2 qubits");
  
  // Initialize superposition
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
  
  // Oracle: flip phase of |11⟩
  circuit = sdk.addGate(circuit, { type: 'z', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'z', qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'z', qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  
  // Diffusion operator
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'z', qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
  
  const result = await sdk.simulate(circuit);
  
  console.log('Grover Circuit:', circuit);
  console.log('Final probabilities:', result.probabilities);
  console.log('Most likely state:', result.basisStates[result.probabilities.indexOf(Math.max(...result.probabilities))]);
  
  return { circuit, result };
}

/**
 * Helper function to sample from probability distribution
 */
function sampleFromProbabilities(probabilities: number[], states: string[]): string {
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (random <= cumulative) {
      return states[i];
    }
  }
  
  return states[states.length - 1];
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Running QOSim SDK Examples...\n');
  
  try {
    await basicExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await bellStateExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await randomGeneratorExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await rotationExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await exportImportExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await saveLoadExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await groverExample();
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}