
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Play, BookOpen, Zap, Shield, Waves, Heart, Cpu } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

export interface AlgorithmLibraryProps {
  onSelectAlgorithm: (algorithm: Algorithm) => void;
  onExecuteAlgorithm: () => void;
  selectedLanguage: 'python' | 'javascript';
  onLanguageChange: (language: 'python' | 'javascript') => void;
}

export function AlgorithmLibrary({ 
  onSelectAlgorithm, 
  onExecuteAlgorithm,
  selectedLanguage,
  onLanguageChange 
}: AlgorithmLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');

  const algorithms: Algorithm[] = useMemo(() => [
    {
      id: 'bell-state',
      name: 'Bell State Generator',
      category: 'Entanglement',
      description: 'Creates maximally entangled two-qubit states for quantum communication',
      complexity: 'beginner',
      pythonCode: `# Bell State Generator
from qosim_sdk import QuantumSimulator

def create_bell_state():
    # Initialize 2-qubit simulator
    sim = QuantumSimulator(2)
    
    # Create Bell state |00⟩ + |11⟩
    sim.h(0)           # Hadamard gate on qubit 0
    sim.cnot(0, 1)     # CNOT gate with control=0, target=1
    
    # Run simulation
    result = sim.run()
    print("Bell State Created!")
    print("State Vector:", result.state_vector)
    print("Entanglement:", result.entanglement)
    
    return result

# Execute
create_bell_state()`,
      javascriptCode: `// Bell State Generator
import { QOSimSimulator } from './qosim-core.js';

function createBellState() {
    // Initialize 2-qubit simulator
    const sim = new QOSimSimulator(2);
    
    // Create Bell state |00⟩ + |11⟩
    sim.addGate("H", 0);           // Hadamard gate on qubit 0
    sim.addGate("CNOT", 0, 1);     // CNOT gate with control=0, target=1
    
    // Run simulation
    sim.run();
    console.log("Bell State Created!");
    console.log("State Vector:", sim.getStateVector());
    console.log("Entanglement:", sim.getEntanglement());
    
    return sim.getResults();
}

// Execute
createBellState();`,
      parameters: [
        { name: 'qubits', type: 'array', default: [0, 1], description: 'Target qubits for entanglement' },
        { name: 'bell_type', type: 'string', default: 'phi+', description: 'Bell state type: phi+, phi-, psi+, psi-' }
      ],
      visualization: {
        type: 'entanglement',
        config: { showBlochSphere: true, showEntanglementMap: true }
      }
    },
    {
      id: 'grovers-search',
      name: "Grover's Search Algorithm",
      category: 'Search',
      description: 'Quantum search algorithm with quadratic speedup over classical search',
      complexity: 'intermediate',
      pythonCode: `# Grover's Search Algorithm
from qosim_sdk import QuantumSimulator
import numpy as np

def grovers_search(target_state=3, num_qubits=2):
    sim = QuantumSimulator(num_qubits)
    
    # Step 1: Initialize superposition
    for i in range(num_qubits):
        sim.h(i)
    
    # Step 2: Apply Grover iteration
    iterations = int(np.pi/4 * np.sqrt(2**num_qubits))
    
    for _ in range(iterations):
        # Oracle: mark target state
        if target_state == 3:  # |11⟩
            sim.cz(0, 1)
        
        # Diffusion operator
        for i in range(num_qubits):
            sim.h(i)
            sim.x(i)
        
        sim.cz(0, 1)
        
        for i in range(num_qubits):
            sim.x(i)
            sim.h(i)
    
    result = sim.run()
    print(f"Grover's Search for state |{target_state:0{num_qubits}b}⟩")
    print("Success probability:", result.probabilities[target_state])
    
    return result

# Execute
grovers_search()`,
      javascriptCode: `// Grover's Search Algorithm
import { QOSimSimulator } from './qosim-core.js';

function groversSearch(targetState = 3, numQubits = 2) {
    const sim = new QOSimSimulator(numQubits);
    
    // Step 1: Initialize superposition
    for (let i = 0; i < numQubits; i++) {
        sim.addGate("H", i);
    }
    
    // Step 2: Apply Grover iteration
    const iterations = Math.floor(Math.PI/4 * Math.sqrt(Math.pow(2, numQubits)));
    
    for (let iter = 0; iter < iterations; iter++) {
        // Oracle: mark target state
        if (targetState === 3) {  // |11⟩
            sim.addGate("CZ", 0, 1);
        }
        
        // Diffusion operator
        for (let i = 0; i < numQubits; i++) {
            sim.addGate("H", i);
            sim.addGate("X", i);
        }
        
        sim.addGate("CZ", 0, 1);
        
        for (let i = 0; i < numQubits; i++) {
            sim.addGate("X", i);
            sim.addGate("H", i);
        }
    }
    
    sim.run();
    console.log(\`Grover's Search for state |\${targetState.toString(2).padStart(numQubits, '0')}⟩\`);
    console.log("Success probability:", sim.getMeasurementProbabilities()[targetState]);
    
    return sim.getResults();
}

// Execute
groversSearch();`,
      parameters: [
        { name: 'target_state', type: 'number', default: 3, description: 'Target state to search for' },
        { name: 'num_qubits', type: 'number', default: 2, description: 'Number of qubits in search space' }
      ],
      visualization: {
        type: 'measurement',
        config: { showProbabilities: true, highlightTarget: true }
      }
    },
    {
      id: 'qft',
      name: 'Quantum Fourier Transform',
      category: 'Transform',
      description: 'Transforms between computational and frequency domains',
      complexity: 'advanced',
      pythonCode: `# Quantum Fourier Transform
from qosim_sdk import QuantumSimulator
import numpy as np

def quantum_fourier_transform(num_qubits=3):
    sim = QuantumSimulator(num_qubits)
    
    # Initialize with |001⟩ state
    sim.x(2)
    
    # Apply QFT
    for i in range(num_qubits):
        sim.h(i)
        
        # Apply controlled rotations
        for j in range(i + 1, num_qubits):
            angle = np.pi / (2 ** (j - i))
            sim.controlled_phase(i, j, angle)
    
    # Swap qubits for correct output order
    for i in range(num_qubits // 2):
        sim.swap(i, num_qubits - 1 - i)
    
    result = sim.run()
    print("QFT Applied!")
    print("Frequency domain representation:")
    print("State Vector:", result.state_vector)
    
    return result

# Execute
quantum_fourier_transform()`,
      javascriptCode: `// Quantum Fourier Transform
import { QOSimSimulator } from './qosim-core.js';

function quantumFourierTransform(numQubits = 3) {
    const sim = new QOSimSimulator(numQubits);
    
    // Initialize with |001⟩ state
    sim.addGate("X", 2);
    
    // Apply QFT
    for (let i = 0; i < numQubits; i++) {
        sim.addGate("H", i);
        
        // Apply controlled rotations
        for (let j = i + 1; j < numQubits; j++) {
            const angle = Math.PI / Math.pow(2, j - i);
            sim.addGate("CP", i, j, angle);
        }
    }
    
    // Swap qubits for correct output order
    for (let i = 0; i < Math.floor(numQubits / 2); i++) {
        sim.addGate("SWAP", i, numQubits - 1 - i);
    }
    
    sim.run();
    console.log("QFT Applied!");
    console.log("Frequency domain representation:");
    console.log("State Vector:", sim.getStateVector());
    
    return sim.getResults();
}

// Execute
quantumFourierTransform();`,
      parameters: [
        { name: 'num_qubits', type: 'number', default: 3, description: 'Number of qubits for QFT' },
        { name: 'input_state', type: 'string', default: '001', description: 'Initial computational state' }
      ],
      visualization: {
        type: 'statevector',
        config: { showPhases: true, showFrequencies: true }
      }
    },
    {
      id: 'shors-algorithm',
      name: "Shor's Algorithm",
      category: 'Cryptography',
      description: 'Quantum algorithm for integer factorization',
      complexity: 'advanced',
      pythonCode: `# Shor's Algorithm (Simplified)
from qosim_sdk import QuantumSimulator
import numpy as np

def shors_algorithm(N=15):
    """Simplified Shor's algorithm for factoring N=15"""
    sim = QuantumSimulator(8)  # Need more qubits for full implementation
    
    # Step 1: Initialize superposition in first register
    for i in range(4):
        sim.h(i)
    
    # Step 2: Quantum modular exponentiation (simplified)
    # This is a simplified oracle for demonstration
    sim.cnot(0, 4)
    sim.cnot(1, 5)
    sim.cnot(2, 6)
    sim.cnot(3, 7)
    
    # Step 3: Apply inverse QFT on first register
    for i in range(4):
        for j in range(i + 1, 4):
            angle = -np.pi / (2 ** (j - i))
            sim.controlled_phase(i, j, angle)
        sim.h(i)
    
    # Swap qubits
    sim.swap(0, 3)
    sim.swap(1, 2)
    
    result = sim.run()
    print(f"Shor's Algorithm for N={N}")
    print("Period finding result:", result.probabilities[:16])
    
    return result

# Execute
shors_algorithm()`,
      javascriptCode: `// Shor's Algorithm (Simplified)
import { QOSimSimulator } from './qosim-core.js';

function shorsAlgorithm(N = 15) {
    // Simplified Shor's algorithm for factoring N=15
    const sim = new QOSimSimulator(8);  // Need more qubits for full implementation
    
    // Step 1: Initialize superposition in first register
    for (let i = 0; i < 4; i++) {
        sim.addGate("H", i);
    }
    
    // Step 2: Quantum modular exponentiation (simplified)
    // This is a simplified oracle for demonstration
    sim.addGate("CNOT", 0, 4);
    sim.addGate("CNOT", 1, 5);
    sim.addGate("CNOT", 2, 6);
    sim.addGate("CNOT", 3, 7);
    
    // Step 3: Apply inverse QFT on first register
    for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
            const angle = -Math.PI / Math.pow(2, j - i);
            sim.addGate("CP", i, j, angle);
        }
        sim.addGate("H", i);
    }
    
    // Swap qubits
    sim.addGate("SWAP", 0, 3);
    sim.addGate("SWAP", 1, 2);
    
    sim.run();
    console.log(\`Shor's Algorithm for N=\${N}\`);
    console.log("Period finding result:", sim.getMeasurementProbabilities().slice(0, 16));
    
    return sim.getResults();
}

// Execute
shorsAlgorithm();`,
      parameters: [
        { name: 'N', type: 'number', default: 15, description: 'Number to factor' },
        { name: 'a', type: 'number', default: 7, description: 'Base for modular exponentiation' }
      ],
      visualization: {
        type: 'measurement',
        config: { showPeriods: true, showFactors: true }
      }
    },
    {
      id: 'vqe',
      name: 'Variational Quantum Eigensolver',
      category: 'Optimization',
      description: 'Hybrid quantum-classical algorithm for finding ground state energies',
      complexity: 'advanced',
      pythonCode: `# Variational Quantum Eigensolver (VQE)
from qosim_sdk import QuantumSimulator
import numpy as np

def vqe_ansatz(sim, params):
    """Parameterized ansatz circuit"""
    # Layer 1: Rotation gates
    for i in range(sim.num_qubits):
        sim.ry(i, params[i])
    
    # Layer 2: Entangling gates
    for i in range(sim.num_qubits - 1):
        sim.cnot(i, i + 1)
    
    # Layer 3: More rotations
    for i in range(sim.num_qubits):
        sim.rz(i, params[i + sim.num_qubits])

def vqe_algorithm(num_qubits=2, iterations=10):
    """VQE main algorithm"""
    # Initialize parameters
    params = np.random.uniform(0, 2*np.pi, 2*num_qubits)
    
    best_energy = float('inf')
    best_params = params.copy()
    
    for iteration in range(iterations):
        sim = QuantumSimulator(num_qubits)
        
        # Apply ansatz
        vqe_ansatz(sim, params)
        
        # Measure energy expectation value
        result = sim.run()
        energy = calculate_energy(result.state_vector)
        
        if energy < best_energy:
            best_energy = energy
            best_params = params.copy()
        
        # Update parameters (simplified gradient descent)
        params += np.random.normal(0, 0.1, len(params))
        
        print(f"Iteration {iteration}: Energy = {energy:.6f}")
    
    print(f"Best energy found: {best_energy:.6f}")
    return best_energy, best_params

def calculate_energy(state_vector):
    """Calculate Hamiltonian expectation value"""
    # Simplified Hamiltonian calculation
    return np.real(np.sum(np.abs(state_vector)**2 * np.arange(len(state_vector))))

# Execute
vqe_algorithm()`,
      javascriptCode: `// Variational Quantum Eigensolver (VQE)
import { QOSimSimulator } from './qosim-core.js';

function vqeAnsatz(sim, params) {
    // Parameterized ansatz circuit
    // Layer 1: Rotation gates
    for (let i = 0; i < sim.numQubits; i++) {
        sim.addGate("RY", i, params[i]);
    }
    
    // Layer 2: Entangling gates
    for (let i = 0; i < sim.numQubits - 1; i++) {
        sim.addGate("CNOT", i, i + 1);
    }
    
    // Layer 3: More rotations
    for (let i = 0; i < sim.numQubits; i++) {
        sim.addGate("RZ", i, params[i + sim.numQubits]);
    }
}

function vqeAlgorithm(numQubits = 2, iterations = 10) {
    // Initialize parameters
    let params = Array.from({length: 2 * numQubits}, () => Math.random() * 2 * Math.PI);
    
    let bestEnergy = Infinity;
    let bestParams = [...params];
    
    for (let iteration = 0; iteration < iterations; iteration++) {
        const sim = new QOSimSimulator(numQubits);
        
        // Apply ansatz
        vqeAnsatz(sim, params);
        
        // Measure energy expectation value
        sim.run();
        const stateVector = sim.getStateVector();
        const energy = calculateEnergy(stateVector);
        
        if (energy < bestEnergy) {
            bestEnergy = energy;
            bestParams = [...params];
        }
        
        // Update parameters (simplified gradient descent)
        params = params.map(p => p + (Math.random() - 0.5) * 0.2);
        
        console.log(\`Iteration \${iteration}: Energy = \${energy.toFixed(6)}\`);
    }
    
    console.log(\`Best energy found: \${bestEnergy.toFixed(6)}\`);
    return { bestEnergy, bestParams };
}

function calculateEnergy(stateVector) {
    // Calculate Hamiltonian expectation value
    return stateVector.reduce((sum, amplitude, index) => {
        return sum + (amplitude.real * amplitude.real + amplitude.imag * amplitude.imag) * index;
    }, 0);
}

// Execute
vqeAlgorithm();`,
      parameters: [
        { name: 'num_qubits', type: 'number', default: 2, description: 'Number of qubits in ansatz' },
        { name: 'iterations', type: 'number', default: 10, description: 'Number of optimization iterations' },
        { name: 'learning_rate', type: 'number', default: 0.1, description: 'Parameter update step size' }
      ],
      visualization: {
        type: 'measurement',
        config: { showEnergyLandscape: true, showConvergence: true }
      }
    },
    {
      id: 'qaoa',
      name: 'Quantum Approximate Optimization Algorithm',
      category: 'Optimization',
      description: 'Hybrid algorithm for combinatorial optimization problems',
      complexity: 'advanced',
      pythonCode: `# Quantum Approximate Optimization Algorithm (QAOA)
from qosim_sdk import QuantumSimulator
import numpy as np

def qaoa_circuit(sim, gamma, beta, problem_graph):
    """QAOA circuit for MaxCut problem"""
    num_qubits = sim.num_qubits
    
    # Initial state: equal superposition
    for i in range(num_qubits):
        sim.h(i)
    
    # Problem Hamiltonian (Cost function)
    for edge in problem_graph:
        i, j = edge
        sim.cnot(i, j)
        sim.rz(j, 2 * gamma)
        sim.cnot(i, j)
    
    # Mixer Hamiltonian
    for i in range(num_qubits):
        sim.rx(i, 2 * beta)

def qaoa_algorithm(problem_graph, p_layers=1):
    """QAOA for MaxCut problem"""
    num_qubits = max(max(edge) for edge in problem_graph) + 1
    
    # Initialize parameters
    gammas = np.random.uniform(0, np.pi, p_layers)
    betas = np.random.uniform(0, np.pi/2, p_layers)
    
    best_cost = -float('inf')
    best_params = (gammas.copy(), betas.copy())
    
    for iteration in range(20):
        sim = QuantumSimulator(num_qubits)
        
        # Apply QAOA layers
        for layer in range(p_layers):
            qaoa_circuit(sim, gammas[layer], betas[layer], problem_graph)
        
        # Measure and calculate cost
        result = sim.run()
        cost = calculate_maxcut_cost(result.probabilities, problem_graph)
        
        if cost > best_cost:
            best_cost = cost
            best_params = (gammas.copy(), betas.copy())
        
        # Update parameters
        gammas += np.random.normal(0, 0.1, p_layers)
        betas += np.random.normal(0, 0.1, p_layers)
        
        print(f"Iteration {iteration}: Cost = {cost:.4f}")
    
    print(f"Best cost: {best_cost:.4f}")
    return best_cost, best_params

def calculate_maxcut_cost(probabilities, problem_graph):
    """Calculate MaxCut cost function"""
    cost = 0
    for i, prob in enumerate(probabilities):
        bitstring = format(i, f'0{len(bin(len(probabilities)-1))-2}b')
        cut_value = sum(int(bitstring[edge[0]]) != int(bitstring[edge[1]]) 
                       for edge in problem_graph)
        cost += prob * cut_value
    return cost

# Execute with example graph
problem_graph = [(0, 1), (1, 2), (2, 3), (3, 0)]
qaoa_algorithm(problem_graph)`,
      javascriptCode: `// Quantum Approximate Optimization Algorithm (QAOA)
import { QOSimSimulator } from './qosim-core.js';

function qaoaCircuit(sim, gamma, beta, problemGraph) {
    // QAOA circuit for MaxCut problem
    const numQubits = sim.numQubits;
    
    // Initial state: equal superposition
    for (let i = 0; i < numQubits; i++) {
        sim.addGate("H", i);
    }
    
    // Problem Hamiltonian (Cost function)
    for (const edge of problemGraph) {
        const [i, j] = edge;
        sim.addGate("CNOT", i, j);
        sim.addGate("RZ", j, 2 * gamma);
        sim.addGate("CNOT", i, j);
    }
    
    // Mixer Hamiltonian
    for (let i = 0; i < numQubits; i++) {
        sim.addGate("RX", i, 2 * beta);
    }
}

function qaoaAlgorithm(problemGraph, pLayers = 1) {
    // QAOA for MaxCut problem
    const numQubits = Math.max(...problemGraph.flat()) + 1;
    
    // Initialize parameters
    let gammas = Array.from({length: pLayers}, () => Math.random() * Math.PI);
    let betas = Array.from({length: pLayers}, () => Math.random() * Math.PI / 2);
    
    let bestCost = -Infinity;
    let bestParams = { gammas: [...gammas], betas: [...betas] };
    
    for (let iteration = 0; iteration < 20; iteration++) {
        const sim = new QOSimSimulator(numQubits);
        
        // Apply QAOA layers
        for (let layer = 0; layer < pLayers; layer++) {
            qaoaCircuit(sim, gammas[layer], betas[layer], problemGraph);
        }
        
        // Measure and calculate cost
        sim.run();
        const probabilities = sim.getMeasurementProbabilities();
        const cost = calculateMaxcutCost(probabilities, problemGraph);
        
        if (cost > bestCost) {
            bestCost = cost;
            bestParams = { gammas: [...gammas], betas: [...betas] };
        }
        
        // Update parameters
        gammas = gammas.map(g => g + (Math.random() - 0.5) * 0.2);
        betas = betas.map(b => b + (Math.random() - 0.5) * 0.2);
        
        console.log(\`Iteration \${iteration}: Cost = \${cost.toFixed(4)}\`);
    }
    
    console.log(\`Best cost: \${bestCost.toFixed(4)}\`);
    return { bestCost, bestParams };
}

function calculateMaxcutCost(probabilities, problemGraph) {
    // Calculate MaxCut cost function
    let cost = 0;
    probabilities.forEach((prob, i) => {
        const bitstring = i.toString(2).padStart(Math.ceil(Math.log2(probabilities.length)), '0');
        const cutValue = problemGraph.reduce((sum, edge) => {
            return sum + (bitstring[edge[0]] !== bitstring[edge[1]] ? 1 : 0);
        }, 0);
        cost += prob * cutValue;
    });
    return cost;
}

// Execute with example graph
const problemGraph = [[0, 1], [1, 2], [2, 3], [3, 0]];
qaoaAlgorithm(problemGraph);`,
      parameters: [
        { name: 'problem_graph', type: 'array', default: [[0,1],[1,2],[2,0]], description: 'Graph edges for MaxCut problem' },
        { name: 'p_layers', type: 'number', default: 1, description: 'Number of QAOA layers' },
        { name: 'iterations', type: 'number', default: 20, description: 'Optimization iterations' }
      ],
      visualization: {
        type: 'measurement',
        config: { showCostFunction: true, showOptimization: true }
      }
    },
    {
      id: 'error-correction',
      name: 'Quantum Error Correction',
      category: 'Error Correction',
      description: 'Protects quantum information from decoherence and errors',
      complexity: 'intermediate',
      pythonCode: `# Quantum Error Correction - 3-Qubit Code
from qosim_sdk import QuantumSimulator
import numpy as np

def encode_logical_qubit(sim, logical_state):
    """Encode logical qubit into 3-qubit code"""
    if logical_state == 1:
        sim.x(0)  # Prepare |1⟩ state
    
    # Encoding: |0⟩ → |000⟩, |1⟩ → |111⟩
    sim.cnot(0, 1)
    sim.cnot(0, 2)

def introduce_error(sim, error_type, qubit):
    """Introduce different types of errors"""
    if error_type == 'bit_flip':
        sim.x(qubit)
    elif error_type == 'phase_flip':
        sim.z(qubit)
    elif error_type == 'both':
        sim.x(qubit)
        sim.z(qubit)

def error_correction_syndrome(sim):
    """Measure error syndrome"""
    # Syndrome measurement for bit-flip errors
    sim.cnot(0, 3)  # Ancilla qubit 3
    sim.cnot(1, 3)
    sim.cnot(1, 4)  # Ancilla qubit 4
    sim.cnot(2, 4)
    
    # Measure ancilla qubits
    result = sim.run()
    return result

def quantum_error_correction():
    """Demonstrate quantum error correction"""
    sim = QuantumSimulator(5)  # 3 data + 2 ancilla qubits
    
    # Step 1: Encode logical |1⟩ state
    encode_logical_qubit(sim, 1)
    
    print("Original encoded state prepared")
    
    # Step 2: Introduce bit-flip error on qubit 1
    introduce_error(sim, 'bit_flip', 1)
    print("Error introduced on qubit 1")
    
    # Step 3: Error detection and correction
    result = error_correction_syndrome(sim)
    
    # Interpret syndrome and correct
    syndrome = result.measurements[-2:]  # Last 2 measurements
    if syndrome == [1, 0]:
        sim.x(0)  # Correct qubit 0
    elif syndrome == [1, 1]:
        sim.x(1)  # Correct qubit 1
    elif syndrome == [0, 1]:
        sim.x(2)  # Correct qubit 2
    
    final_result = sim.run()
    print("Error correction completed")
    print("Final state:", final_result.state_vector)
    
    return final_result

# Execute
quantum_error_correction()`,
      javascriptCode: `// Quantum Error Correction - 3-Qubit Code
import { QOSimSimulator } from './qosim-core.js';

function encodeLogicalQubit(sim, logicalState) {
    // Encode logical qubit into 3-qubit code
    if (logicalState === 1) {
        sim.addGate("X", 0);  // Prepare |1⟩ state
    }
    
    // Encoding: |0⟩ → |000⟩, |1⟩ → |111⟩
    sim.addGate("CNOT", 0, 1);
    sim.addGate("CNOT", 0, 2);
}

function introduceError(sim, errorType, qubit) {
    // Introduce different types of errors
    if (errorType === 'bit_flip') {
        sim.addGate("X", qubit);
    } else if (errorType === 'phase_flip') {
        sim.addGate("Z", qubit);
    } else if (errorType === 'both') {
        sim.addGate("X", qubit);
        sim.addGate("Z", qubit);
    }
}

function errorCorrectionSyndrome(sim) {
    // Measure error syndrome
    // Syndrome measurement for bit-flip errors
    sim.addGate("CNOT", 0, 3);  // Ancilla qubit 3
    sim.addGate("CNOT", 1, 3);
    sim.addGate("CNOT", 1, 4);  // Ancilla qubit 4
    sim.addGate("CNOT", 2, 4);
    
    // Measure ancilla qubits
    sim.run();
    return sim.getResults();
}

function quantumErrorCorrection() {
    // Demonstrate quantum error correction
    const sim = new QOSimSimulator(5);  // 3 data + 2 ancilla qubits
    
    // Step 1: Encode logical |1⟩ state
    encodeLogicalQubit(sim, 1);
    
    console.log("Original encoded state prepared");
    
    // Step 2: Introduce bit-flip error on qubit 1
    introduceError(sim, 'bit_flip', 1);
    console.log("Error introduced on qubit 1");
    
    // Step 3: Error detection and correction
    const result = errorCorrectionSyndrome(sim);
    
    // Interpret syndrome and correct
    const syndrome = result.measurements.slice(-2);  // Last 2 measurements
    if (syndrome[0] === 1 && syndrome[1] === 0) {
        sim.addGate("X", 0);  // Correct qubit 0
    } else if (syndrome[0] === 1 && syndrome[1] === 1) {
        sim.addGate("X", 1);  // Correct qubit 1
    } else if (syndrome[0] === 0 && syndrome[1] === 1) {
        sim.addGate("X", 2);  // Correct qubit 2
    }
    
    sim.run();
    const finalResult = sim.getResults();
    console.log("Error correction completed");
    console.log("Final state:", sim.getStateVector());
    
    return finalResult;
}

// Execute
quantumErrorCorrection();`,
      parameters: [
        { name: 'logical_state', type: 'number', default: 1, description: 'Initial logical state (0 or 1)' },
        { name: 'error_type', type: 'string', default: 'bit_flip', description: 'Type of error to introduce' },
        { name: 'error_qubit', type: 'number', default: 1, description: 'Qubit to introduce error on' }
      ],
      visualization: {
        type: 'measurement',
        config: { showErrorSyndrome: true, showCorrection: true }
      }
    }
  ], []);

  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter(algorithm => {
      const matchesSearch = algorithm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           algorithm.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || algorithm.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'all' || algorithm.complexity === selectedComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });
  }, [algorithms, searchTerm, selectedCategory, selectedComplexity]);

  const categories = useMemo(() => {
    const cats = [...new Set(algorithms.map(a => a.category))];
    return cats.sort();
  }, [algorithms]);

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'intermediate': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'advanced': return <Cpu className="w-4 h-4 text-red-500" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Entanglement': return <Heart className="w-4 h-4 text-quantum-neon" />;
      case 'Search': return <Search className="w-4 h-4 text-quantum-glow" />;
      case 'Transform': return <Waves className="w-4 h-4 text-quantum-particle" />;
      case 'Cryptography': return <Shield className="w-4 h-4 text-quantum-plasma" />;
      case 'Optimization': return <Zap className="w-4 h-4 text-quantum-energy" />;
      case 'Error Correction': return <Shield className="w-4 h-4 text-quantum-matrix" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-quantum-glow">Algorithm Library</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedLanguage === 'python' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('python')}
              className="text-xs"
            >
              Python
            </Button>
            <Button
              variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('javascript')}
              className="text-xs"
            >
              JavaScript
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="quantum-panel neon-border"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="quantum-panel neon-border w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="quantum-panel neon-border">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
            <SelectTrigger className="quantum-panel neon-border w-full sm:w-40">
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent className="quantum-panel neon-border">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlgorithms.map((algorithm) => (
            <Card key={algorithm.id} className="quantum-panel neon-border hover:border-quantum-glow transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(algorithm.category)}
                    <CardTitle className="text-sm text-quantum-glow">{algorithm.name}</CardTitle>
                  </div>
                  {getComplexityIcon(algorithm.complexity)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {algorithm.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {algorithm.complexity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-quantum-particle mb-4 line-clamp-2">
                  {algorithm.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onSelectAlgorithm(algorithm)}
                    size="sm"
                    className="flex-1 bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                  >
                    Load Code
                  </Button>
                  <Button
                    onClick={() => {
                      onSelectAlgorithm(algorithm);
                      setTimeout(onExecuteAlgorithm, 100);
                    }}
                    size="sm"
                    variant="outline"
                    className="border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-quantum-particle mx-auto mb-4" />
            <p className="text-quantum-particle">No algorithms found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
