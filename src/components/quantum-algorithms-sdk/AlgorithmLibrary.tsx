
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Code, BookOpen, Zap, Clock, Users } from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  category: 'search' | 'factoring' | 'simulation' | 'optimization' | 'basic' | 'error-correction';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  code: {
    python: string;
    javascript: string;
  };
  qubits: number;
  gates: number;
  executionTime: string;
  applications: string[];
  concepts: string[];
}

const algorithms: Algorithm[] = [
  {
    id: 'bell-state',
    name: 'Bell State',
    category: 'basic',
    difficulty: 'beginner',
    description: 'Creates maximum entanglement between two qubits, demonstrating quantum superposition and entanglement.',
    code: {
      python: `# Bell State Creation
from qiskit import QuantumCircuit, execute, Aer
from qiskit.visualization import plot_histogram

# Create quantum circuit
qc = QuantumCircuit(2, 2)

# Create Bell state |00⟩ + |11⟩
qc.h(0)        # Hadamard on qubit 0
qc.cx(0, 1)    # CNOT with control=0, target=1

# Measure both qubits
qc.measure_all()

# Execute circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts()

print("Bell State Results:", counts)
print("Circuit:", qc.draw())`,
      javascript: `// Bell State Creation
import { QuantumCircuit } from 'qosim-sdk';

// Create quantum circuit
const qc = new QuantumCircuit(2, 2);

// Create Bell state |00⟩ + |11⟩
qc.h(0);        // Hadamard on qubit 0
qc.cnot(0, 1);  // CNOT with control=0, target=1

// Measure both qubits
qc.measureAll();

// Execute circuit
const result = await qc.execute({ shots: 1024 });
console.log('Bell State Results:', result.counts);
console.log('Circuit:', qc.draw());`
    },
    qubits: 2,
    gates: 2,
    executionTime: '< 1ms',
    applications: ['Quantum Communication', 'Quantum Cryptography', 'Quantum Teleportation'],
    concepts: ['Entanglement', 'Superposition', 'Bell States']
  },
  {
    id: 'grovers-search',
    name: "Grover's Search",
    category: 'search',
    difficulty: 'intermediate',
    description: 'Quantum search algorithm that finds marked items in unsorted database with quadratic speedup.',
    code: {
      python: `# Grover's Search Algorithm
import numpy as np
from qiskit import QuantumCircuit, execute, Aer
from qiskit.circuit.library import GroverOperator
from math import pi, sqrt

def grovers_search(n_qubits, marked_items):
    # Number of iterations
    iterations = int(pi/4 * sqrt(2**n_qubits))
    
    # Create quantum circuit
    qc = QuantumCircuit(n_qubits, n_qubits)
    
    # Initialize superposition
    qc.h(range(n_qubits))
    
    # Oracle for marked items
    def oracle(qc, marked):
        for item in marked:
            # Convert item to binary and flip corresponding qubits
            binary = format(item, f'0{n_qubits}b')
            for i, bit in enumerate(binary):
                if bit == '0':
                    qc.x(i)
            
            # Multi-controlled Z gate
            qc.h(n_qubits-1)
            qc.mcx(list(range(n_qubits-1)), n_qubits-1)
            qc.h(n_qubits-1)
            
            # Uncompute
            for i, bit in enumerate(binary):
                if bit == '0':
                    qc.x(i)
    
    # Diffusion operator
    def diffusion(qc):
        qc.h(range(n_qubits))
        qc.x(range(n_qubits))
        qc.h(n_qubits-1)
        qc.mcx(list(range(n_qubits-1)), n_qubits-1)
        qc.h(n_qubits-1)
        qc.x(range(n_qubits))
        qc.h(range(n_qubits))
    
    # Grover iterations
    for _ in range(iterations):
        oracle(qc, marked_items)
        diffusion(qc)
    
    # Measure
    qc.measure_all()
    
    return qc

# Example: Search for item 3 in 4-item database
qc = grovers_search(2, [3])
backend = Aer.get_backend('qasm_simulator')
result = execute(qc, backend, shots=1024).result()
print("Search Results:", result.get_counts())`,
      javascript: `// Grover's Search Algorithm
import { QuantumCircuit } from 'qosim-sdk';

class GroversSearch {
  constructor(nQubits, markedItems) {
    this.nQubits = nQubits;
    this.markedItems = markedItems;
    this.iterations = Math.floor(Math.PI/4 * Math.sqrt(2**nQubits));
  }
  
  createCircuit() {
    const qc = new QuantumCircuit(this.nQubits, this.nQubits);
    
    // Initialize superposition
    for (let i = 0; i < this.nQubits; i++) {
      qc.h(i);
    }
    
    // Grover iterations
    for (let iter = 0; iter < this.iterations; iter++) {
      this.oracle(qc);
      this.diffusion(qc);
    }
    
    qc.measureAll();
    return qc;
  }
  
  oracle(qc) {
    this.markedItems.forEach(item => {
      const binary = item.toString(2).padStart(this.nQubits, '0');
      
      // Flip qubits for 0s
      binary.split('').forEach((bit, i) => {
        if (bit === '0') qc.x(i);
      });
      
      // Multi-controlled Z
      qc.h(this.nQubits - 1);
      qc.mcx(Array.from({length: this.nQubits-1}, (_, i) => i), this.nQubits - 1);
      qc.h(this.nQubits - 1);
      
      // Uncompute
      binary.split('').forEach((bit, i) => {
        if (bit === '0') qc.x(i);
      });
    });
  }
  
  diffusion(qc) {
    // Hadamard all qubits
    for (let i = 0; i < this.nQubits; i++) qc.h(i);
    
    // Flip all qubits
    for (let i = 0; i < this.nQubits; i++) qc.x(i);
    
    // Multi-controlled Z
    qc.h(this.nQubits - 1);
    qc.mcx(Array.from({length: this.nQubits-1}, (_, i) => i), this.nQubits - 1);
    qc.h(this.nQubits - 1);
    
    // Unflip
    for (let i = 0; i < this.nQubits; i++) qc.x(i);
    
    // Hadamard all qubits
    for (let i = 0; i < this.nQubits; i++) qc.h(i);
  }
}

// Example usage
const grover = new GroversSearch(2, [3]);
const circuit = grover.createCircuit();
const result = await circuit.execute({ shots: 1024 });
console.log('Search Results:', result.counts);`
    },
    qubits: 4,
    gates: 20,
    executionTime: '2-5ms',
    applications: ['Database Search', 'Optimization', 'Machine Learning'],
    concepts: ['Amplitude Amplification', 'Oracle Functions', 'Quantum Speedup']
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform',
    category: 'simulation',
    difficulty: 'advanced',
    description: 'Quantum version of discrete Fourier transform, essential for many quantum algorithms.',
    code: {
      python: `# Quantum Fourier Transform
from qiskit import QuantumCircuit
import numpy as np

def qft_rotations(circuit, n):
    """Applies QFT rotations to the first n qubits"""
    if n == 0:
        return circuit
    n -= 1
    circuit.h(n)
    for qubit in range(n):
        circuit.cp(np.pi/2**(n-qubit), qubit, n)
    qft_rotations(circuit, n)

def swap_registers(circuit, n):
    """Reverses the order of qubits"""
    for qubit in range(n//2):
        circuit.swap(qubit, n-qubit-1)
    return circuit

def qft(n_qubits):
    """Creates QFT circuit"""
    qc = QuantumCircuit(n_qubits, n_qubits)
    qft_rotations(qc, n_qubits)
    swap_registers(qc, n_qubits)
    return qc

def inverse_qft(n_qubits):
    """Creates inverse QFT circuit"""
    qc = qft(n_qubits)
    return qc.inverse()

# Example: 3-qubit QFT
n = 3
qc = QuantumCircuit(n, n)

# Prepare initial state (optional)
qc.x(0)  # |001⟩ state

# Apply QFT
qc.compose(qft(n), inplace=True)

# Measure
qc.measure_all()

print("QFT Circuit:")
print(qc.draw())`,
      javascript: `// Quantum Fourier Transform
import { QuantumCircuit } from 'qosim-sdk';

class QFT {
  constructor(nQubits) {
    this.nQubits = nQubits;
  }
  
  createCircuit() {
    const qc = new QuantumCircuit(this.nQubits, this.nQubits);
    
    this.qftRotations(qc, this.nQubits);
    this.swapRegisters(qc, this.nQubits);
    
    return qc;
  }
  
  qftRotations(circuit, n) {
    if (n === 0) return;
    
    const currentQubit = n - 1;
    circuit.h(currentQubit);
    
    for (let qubit = 0; qubit < currentQubit; qubit++) {
      const angle = Math.PI / (2 ** (currentQubit - qubit));
      circuit.cp(angle, qubit, currentQubit);
    }
    
    this.qftRotations(circuit, n - 1);
  }
  
  swapRegisters(circuit, n) {
    for (let i = 0; i < Math.floor(n / 2); i++) {
      circuit.swap(i, n - i - 1);
    }
  }
  
  createInverse() {
    const qc = this.createCircuit();
    return qc.inverse();
  }
}

// Example usage
const qft = new QFT(3);
const circuit = qft.createCircuit();

// Prepare initial state
circuit.x(0);  // |001⟩ state

console.log('QFT Circuit:', circuit.draw());

// Execute
const result = await circuit.execute({ shots: 1024 });
console.log('QFT Results:', result.counts);`
    },
    qubits: 3,
    gates: 12,
    executionTime: '1-3ms',
    applications: ['Quantum Phase Estimation', "Shor's Algorithm", 'Quantum Simulation'],
    concepts: ['Fourier Transform', 'Phase Rotations', 'Quantum Parallelism']
  }
];

interface AlgorithmLibraryProps {
  onSelectAlgorithm: (algorithm: Algorithm) => void;
  onExecuteAlgorithm: (algorithm: Algorithm) => void;
}

export function AlgorithmLibrary({ onSelectAlgorithm, onExecuteAlgorithm }: AlgorithmLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredAlgorithms = algorithms.filter(algorithm => {
    const matchesSearch = algorithm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         algorithm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         algorithm.concepts.some(concept => concept.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || algorithm.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || algorithm.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'search': return <Search className="w-4 h-4" />;
      case 'factoring': return <Zap className="w-4 h-4" />;
      case 'simulation': return <Code className="w-4 h-4" />;
      case 'optimization': return <Clock className="w-4 h-4" />;
      case 'basic': return <BookOpen className="w-4 h-4" />;
      case 'error-correction': return <Users className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quantum-neon w-4 h-4" />
          <Input
            placeholder="Search algorithms, concepts, or applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 quantum-panel neon-border"
          />
        </div>
        
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-quantum-matrix border border-quantum-neon/30 rounded-lg text-quantum-neon text-sm"
          >
            <option value="all">All Categories</option>
            <option value="basic">Basic</option>
            <option value="search">Search</option>
            <option value="factoring">Factoring</option>
            <option value="simulation">Simulation</option>
            <option value="optimization">Optimization</option>
            <option value="error-correction">Error Correction</option>
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-quantum-matrix border border-quantum-neon/30 rounded-lg text-quantum-neon text-sm"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Algorithm Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAlgorithms.map((algorithm) => (
          <Card key={algorithm.id} className="quantum-panel neon-border hover:border-quantum-glow/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(algorithm.category)}
                  <CardTitle className="text-lg text-quantum-glow">{algorithm.name}</CardTitle>
                </div>
                <Badge className={getDifficultyColor(algorithm.difficulty)}>
                  {algorithm.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {algorithm.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-quantum-neon font-mono">{algorithm.qubits}</div>
                  <div className="text-muted-foreground">Qubits</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-neon font-mono">{algorithm.gates}</div>
                  <div className="text-muted-foreground">Gates</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-neon font-mono">{algorithm.executionTime}</div>
                  <div className="text-muted-foreground">Runtime</div>
                </div>
              </div>

              {/* Concepts */}
              <div>
                <h4 className="text-sm font-semibold text-quantum-glow mb-2">Key Concepts</h4>
                <div className="flex flex-wrap gap-1">
                  {algorithm.concepts.map((concept, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-quantum-neon/30">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h4 className="text-sm font-semibold text-quantum-glow mb-2">Applications</h4>
                <div className="flex flex-wrap gap-1">
                  {algorithm.applications.map((app, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-quantum-glow/20 text-quantum-glow">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => onSelectAlgorithm(algorithm)}
                  className="flex-1 bg-quantum-matrix hover:bg-quantum-neon hover:text-black transition-colors"
                  size="sm"
                >
                  <Code className="w-4 h-4 mr-2" />
                  View Code
                </Button>
                <Button
                  onClick={() => onExecuteAlgorithm(algorithm)}
                  className="flex-1 bg-quantum-glow hover:bg-quantum-glow/80 text-black"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-quantum-neon mx-auto mb-4 opacity-50" />
          <p className="text-quantum-neon">No algorithms match your search criteria</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}
