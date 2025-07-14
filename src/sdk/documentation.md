# QOSim JavaScript SDK Documentation

The QOSim JavaScript SDK provides a comprehensive interface for creating, simulating, and managing quantum circuits programmatically. This SDK allows developers to build quantum applications with ease while leveraging the power of the QOSim quantum simulator.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [API Reference](#api-reference)
5. [Examples](#examples)
6. [Advanced Usage](#advanced-usage)
7. [Best Practices](#best-practices)

## Installation & Setup

### Basic Setup

```javascript
import { QOSimSDK, CircuitBuilder } from './sdk/qosim-sdk';

// Initialize the SDK
const sdk = new QOSimSDK({
  defaultQubits: 3,
  autoSave: false,
  simulationMode: 'local'
});

// Initialize (loads QOSim core)
await sdk.initialize();
```

### Configuration Options

```javascript
const sdk = new QOSimSDK({
  autoSave: false,        // Auto-save circuits to database
  defaultQubits: 3,       // Default number of qubits for new circuits
  simulationMode: 'local', // 'local' or 'cloud'
  maxQubits: 20          // Maximum qubits allowed
});
```

## Quick Start

### Create Your First Circuit

```javascript
import { QOSimSDK } from './sdk/qosim-sdk';

async function createBellState() {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  // Create a new circuit
  let circuit = sdk.createCircuit('Bell State', 2, 'Creates an entangled state');
  
  // Add gates
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  
  // Simulate
  const result = await sdk.simulate(circuit);
  
  console.log('Probabilities:', result.probabilities);
  console.log('Basis States:', result.basisStates);
  
  return result;
}
```

### Using Circuit Builder

```javascript
import { CircuitBuilder } from './sdk/qosim-sdk';

async function quickBellState() {
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create Bell state with one line
  const bellCircuit = builder.bellState('Quick Bell');
  const result = await sdk.simulate(bellCircuit);
  
  return result;
}
```

## Core Concepts

### Quantum Gates

The SDK supports various quantum gates:

```javascript
// Single-qubit gates
{ type: 'h', qubit: 0 }                    // Hadamard
{ type: 'x', qubit: 0 }                    // Pauli-X
{ type: 'y', qubit: 0 }                    // Pauli-Y
{ type: 'z', qubit: 0 }                    // Pauli-Z

// Rotation gates
{ type: 'rx', qubit: 0, angle: Math.PI/4 } // X-rotation
{ type: 'ry', qubit: 0, angle: Math.PI/3 } // Y-rotation
{ type: 'rz', qubit: 0, angle: Math.PI/6 } // Z-rotation

// Two-qubit gates
{ type: 'cnot', controlQubit: 0, qubit: 1 } // CNOT
```

### Circuit Structure

```javascript
interface QuantumCircuit {
  id?: string;           // Database ID (if saved)
  name: string;          // Circuit name
  description?: string;  // Circuit description
  gates: QuantumGate[];  // Array of quantum gates
  qubits: number;        // Number of qubits
  metadata?: Record<string, any>; // Additional metadata
}
```

### Simulation Results

```javascript
interface SimulationResult {
  stateVector: Array<{ real: number; imaginary: number }>;
  probabilities: number[];
  basisStates: string[];
  measurements?: Record<string, number>;
  executionTime: number;
  circuitDepth: number;
}
```

## API Reference

### QOSimSDK Class

#### Constructor

```javascript
new QOSimSDK(config?: SDKConfig)
```

#### Methods

##### `initialize(): Promise<void>`
Initializes the SDK and loads the QOSim core engine.

##### `createCircuit(name: string, qubits?: number, description?: string): QuantumCircuit`
Creates a new quantum circuit.

##### `addGate(circuit: QuantumCircuit, gate: QuantumGate): QuantumCircuit`
Adds a quantum gate to a circuit.

##### `simulate(circuit: QuantumCircuit): Promise<SimulationResult>`
Simulates a quantum circuit and returns results.

##### `saveCircuit(circuit: QuantumCircuit): Promise<string>`
Saves a circuit to the database (requires authentication).

##### `loadCircuit(circuitId: string): Promise<QuantumCircuit>`
Loads a circuit from the database.

##### `listCircuits(): Promise<QuantumCircuit[]>`
Lists all user's circuits.

##### `exportCircuit(circuit: QuantumCircuit, format: 'json' | 'qasm' | 'python'): string`
Exports a circuit to various formats.

### CircuitBuilder Class

#### Constructor

```javascript
new CircuitBuilder(sdk: QOSimSDK)
```

#### Methods

##### `bellState(name?: string): QuantumCircuit`
Creates a Bell state circuit.

##### `ghzState(qubits?: number, name?: string): QuantumCircuit`
Creates a GHZ state circuit.

##### `randomGenerator(qubits?: number, name?: string): QuantumCircuit`
Creates a quantum random number generator.

## Examples

### Example 1: Basic Circuit Operations

```javascript
import { QOSimSDK } from './sdk/qosim-sdk';

async function basicOperations() {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  // Create circuit
  let circuit = sdk.createCircuit('Basic Operations', 3);
  
  // Add gates step by step
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  circuit = sdk.addGate(circuit, { type: 'rz', qubit: 2, angle: Math.PI/4 });
  
  // Simulate
  const result = await sdk.simulate(circuit);
  
  console.log('Circuit depth:', result.circuitDepth);
  console.log('Execution time:', result.executionTime, 'ms');
  
  return result;
}
```

### Example 2: Quantum Random Number Generator

```javascript
import { CircuitBuilder } from './sdk/qosim-sdk';

async function quantumRNG() {
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create 4-bit quantum RNG
  const rngCircuit = builder.randomGenerator(4, 'QRNG-4');
  
  // Generate multiple random numbers
  const randomNumbers = [];
  for (let i = 0; i < 10; i++) {
    const result = await sdk.simulate(rngCircuit);
    
    // Sample from probabilities
    const random = Math.random();
    let cumulative = 0;
    let selectedState = '';
    
    for (let j = 0; j < result.probabilities.length; j++) {
      cumulative += result.probabilities[j];
      if (random <= cumulative) {
        selectedState = result.basisStates[j];
        break;
      }
    }
    
    randomNumbers.push(parseInt(selectedState, 2));
  }
  
  console.log('Random numbers:', randomNumbers);
  return randomNumbers;
}
```

### Example 3: Circuit Export and Import

```javascript
async function exportImport() {
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create a circuit
  const circuit = builder.ghzState(3, 'GHZ-3');
  
  // Export to different formats
  const jsonExport = sdk.exportCircuit(circuit, 'json');
  const qasmExport = sdk.exportCircuit(circuit, 'qasm');
  const pythonExport = sdk.exportCircuit(circuit, 'python');
  
  console.log('JSON Export:\n', jsonExport);
  console.log('QASM Export:\n', qasmExport);
  console.log('Python Export:\n', pythonExport);
  
  return { jsonExport, qasmExport, pythonExport };
}
```

### Example 4: Grover's Algorithm

```javascript
async function groversAlgorithm() {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  // Create 2-qubit Grover's algorithm
  let circuit = sdk.createCircuit('Grover-2Q', 2, "Grover's search algorithm");
  
  // Initialize superposition
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
  
  // Oracle for |11⟩
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
  
  // Find most probable state
  const maxProb = Math.max(...result.probabilities);
  const targetState = result.basisStates[result.probabilities.indexOf(maxProb)];
  
  console.log('Target state found:', targetState);
  console.log('Probability:', maxProb);
  
  return result;
}
```

## Advanced Usage

### Error Handling

```javascript
async function robustSimulation() {
  const sdk = new QOSimSDK();
  
  try {
    await sdk.initialize();
    
    let circuit = sdk.createCircuit('Test', 2);
    
    // This will throw an error - invalid qubit index
    try {
      circuit = sdk.addGate(circuit, { type: 'h', qubit: 5 });
    } catch (gateError) {
      console.error('Gate error:', gateError.message);
    }
    
    const result = await sdk.simulate(circuit);
    return result;
    
  } catch (initError) {
    console.error('Initialization failed:', initError.message);
    throw initError;
  }
}
```

### Batch Operations

```javascript
async function batchSimulation() {
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create multiple circuits
  const circuits = [
    builder.bellState('Bell-1'),
    builder.ghzState(3, 'GHZ-3'),
    builder.randomGenerator(2, 'RNG-2')
  ];
  
  // Simulate all circuits
  const results = await Promise.all(
    circuits.map(circuit => sdk.simulate(circuit))
  );
  
  results.forEach((result, index) => {
    console.log(`Circuit ${index + 1} results:`, result.probabilities);
  });
  
  return results;
}
```

### Save and Load Workflow

```javascript
async function saveLoadWorkflow() {
  const sdk = new QOSimSDK({ autoSave: true });
  await sdk.initialize();
  
  // Create and save circuit
  const circuit = builder.bellState('Saved Bell State');
  
  try {
    const circuitId = await sdk.saveCircuit(circuit);
    console.log('Circuit saved with ID:', circuitId);
    
    // Load it back
    const loadedCircuit = await sdk.loadCircuit(circuitId);
    console.log('Circuit loaded:', loadedCircuit.name);
    
    // List all circuits
    const allCircuits = await sdk.listCircuits();
    console.log('Total circuits:', allCircuits.length);
    
    return { circuitId, loadedCircuit, allCircuits };
    
  } catch (error) {
    console.error('Save/Load requires authentication:', error.message);
    return null;
  }
}
```

## Best Practices

### 1. Always Initialize the SDK

```javascript
// ✅ Good
const sdk = new QOSimSDK();
await sdk.initialize();

// ❌ Bad
const sdk = new QOSimSDK();
// Forgetting to initialize will cause simulation errors
```

### 2. Handle Errors Gracefully

```javascript
// ✅ Good
try {
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
} catch (error) {
  console.error('Invalid gate configuration:', error.message);
}

// ❌ Bad
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
// No error handling
```

### 3. Use Circuit Builder for Common Patterns

```javascript
// ✅ Good
const bellCircuit = builder.bellState('Bell State');

// ❌ Less efficient
let circuit = sdk.createCircuit('Bell State', 2);
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
```

### 4. Validate Inputs

```javascript
// ✅ Good
function createCustomCircuit(qubits: number) {
  if (qubits <= 0 || qubits > 20) {
    throw new Error('Invalid number of qubits');
  }
  return sdk.createCircuit('Custom', qubits);
}

// ❌ Bad
function createCustomCircuit(qubits: number) {
  return sdk.createCircuit('Custom', qubits); // No validation
}
```

### 5. Clean Up Resources

```javascript
// ✅ Good - For long-running applications
async function processCircuits(circuits: QuantumCircuit[]) {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  try {
    const results = [];
    for (const circuit of circuits) {
      const result = await sdk.simulate(circuit);
      results.push(result);
    }
    return results;
  } finally {
    // Clean up if needed
    console.log('Processing complete');
  }
}
```

### 6. Use Type Safety

```javascript
// ✅ Good - Type-safe gate creation
const gate: QuantumGate = {
  type: 'h',
  qubit: 0
};

// ✅ Good - Type-safe configuration
const config: SDKConfig = {
  defaultQubits: 3,
  autoSave: false
};
```

## Troubleshooting

### Common Issues

1. **"QOSim core failed to load"**
   - Ensure `qosim-core.js` is available in the public directory
   - Check browser console for network errors

2. **"Authentication required to save circuits"**
   - User must be logged in to save/load circuits
   - Implement authentication flow in your application

3. **"Invalid qubit index"**
   - Qubit indices start from 0
   - Ensure qubit index is less than the total number of qubits

4. **"CNOT gate requires control qubit"**
   - Two-qubit gates need both controlQubit and qubit properties
   - Ensure controlQubit !== qubit

### Performance Tips

1. **Limit Circuit Depth**: Deeper circuits take longer to simulate
2. **Batch Operations**: Process multiple circuits in parallel when possible
3. **Reuse SDK Instance**: Initialize once, use multiple times
4. **Monitor Memory**: Large quantum states consume significant memory

## Next Steps

- Explore the [examples file](./examples.ts) for more detailed code samples
- Check out the [GitHub integration guide](#github-integration) for version control
- Learn about [cloud simulation features](#cloud-features) for larger circuits
- Join our [community Discord](https://discord.gg/quantum) for support and discussions

---

*This documentation is part of the QOSim JavaScript SDK. For the latest updates, visit our [GitHub repository](https://github.com/qosim/sdk).*