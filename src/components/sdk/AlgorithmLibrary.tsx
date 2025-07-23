
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Edit, Download, Star, Clock, Users, Zap } from 'lucide-react';
import { AlgorithmCard } from './AlgorithmCard';
import { AlgorithmRunner } from './AlgorithmRunner';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: number;
  runtime: string;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
  code: {
    javascript: string;
    python: string;
    qasm: string;
  };
}

const algorithms: Algorithm[] = [
  {
    id: 'bell-state',
    name: "Bell State Generator",
    description: "Creates maximally entangled Bell states (Φ+, Φ-, Ψ+, Ψ-)",
    category: 'Entanglement',
    difficulty: 'Beginner',
    qubits: 2,
    gates: 2,
    runtime: '~1ms',
    rating: 4.9,
    downloads: 15420,
    author: 'QOSim Team',
    tags: ['entanglement', 'basic', 'tutorial'],
    code: {
      javascript: `// Bell State Generator
const sdk = new QOSimSDK();
const circuit = sdk.createCircuit(2);
circuit.h(0);
circuit.cnot(0, 1);
const result = await circuit.run();`,
      python: `# Bell State Generator
from qosim import QOSimSDK
sdk = QOSimSDK()
circuit = sdk.create_circuit(2)
circuit.h(0)
circuit.cnot(0, 1)
result = circuit.run()`,
      qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;`
    }
  },
  {
    id: 'grovers-search',
    name: "Grover's Search Algorithm",
    description: "Quantum search algorithm with quadratic speedup",
    category: 'Search',
    difficulty: 'Intermediate',
    qubits: 3,
    gates: 12,
    runtime: '~5ms',
    rating: 4.8,
    downloads: 8950,
    author: 'Alice Quantum',
    tags: ['search', 'amplitude-amplification', 'oracle'],
    code: {
      javascript: `// Grover's Search
const sdk = new QOSimSDK();
const circuit = sdk.grovers(3, [5]); // Search for |101⟩
const result = await circuit.run();`,
      python: `# Grover's Search
from qosim import QOSimSDK
sdk = QOSimSDK()
circuit = sdk.grovers(3, [5])  # Search for |101⟩
result = circuit.run()`,
      qasm: `// Grover's Search QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];
creg c[3];
h q[0]; h q[1]; h q[2];
// Oracle and diffusion operations...`
    }
  },
  {
    id: 'qft',
    name: "Quantum Fourier Transform",
    description: "Efficient quantum analogue of discrete Fourier transform",
    category: 'Transform',
    difficulty: 'Advanced',
    qubits: 4,
    gates: 20,
    runtime: '~8ms',
    rating: 4.7,
    downloads: 6780,
    author: 'Bob Algorithms',
    tags: ['fourier', 'transform', 'phase-estimation'],
    code: {
      javascript: `// Quantum Fourier Transform
const sdk = new QOSimSDK();
const circuit = sdk.qft(4);
const result = await circuit.run();`,
      python: `# Quantum Fourier Transform
from qosim import QOSimSDK
sdk = QOSimSDK()
circuit = sdk.qft(4)
result = circuit.run()`,
      qasm: `// QFT QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[4];
creg c[4];
// QFT implementation...`
    }
  },
  {
    id: 'vqe',
    name: "Variational Quantum Eigensolver",
    description: "Hybrid algorithm for finding ground state energies",
    category: 'Optimization',
    difficulty: 'Advanced',
    qubits: 4,
    gates: 35,
    runtime: '~50ms',
    rating: 4.6,
    downloads: 3420,
    author: 'Carol Hybrid',
    tags: ['vqe', 'optimization', 'hybrid', 'chemistry'],
    code: {
      javascript: `// VQE Implementation
const sdk = new QOSimSDK();
const vqe = sdk.vqe({
  ansatz: 'UCCSD',
  optimizer: 'COBYLA',
  molecule: 'H2'
});
const result = await vqe.run();`,
      python: `# VQE Implementation
from qosim import QOSimSDK
sdk = QOSimSDK()
vqe = sdk.vqe(ansatz='UCCSD', optimizer='COBYLA', molecule='H2')
result = vqe.run()`,
      qasm: `// VQE QASM (parameterized)
OPENQASM 2.0;
include "qelib1.inc";
qreg q[4];
creg c[4];
// Parameterized ansatz...`
    }
  },
  {
    id: 'shors',
    name: "Shor's Factoring Algorithm",
    description: "Quantum algorithm for integer factorization",
    category: 'Cryptography',
    difficulty: 'Advanced',
    qubits: 8,
    gates: 150,
    runtime: '~200ms',
    rating: 4.9,
    downloads: 2100,
    author: 'Dave Crypto',
    tags: ['factoring', 'cryptography', 'period-finding'],
    code: {
      javascript: `// Shor's Algorithm
const sdk = new QOSimSDK();
const circuit = sdk.shors(15); // Factor 15
const result = await circuit.run();`,
      python: `# Shor's Algorithm
from qosim import QOSimSDK
sdk = QOSimSDK()
circuit = sdk.shors(15)  # Factor 15
result = circuit.run()`,
      qasm: `// Shor's Algorithm QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[8];
creg c[8];
// Period finding circuit...`
    }
  },
  {
    id: 'qaoa',
    name: "Quantum Approximate Optimization",
    description: "Hybrid algorithm for combinatorial optimization",
    category: 'Optimization',
    difficulty: 'Advanced',
    qubits: 6,
    gates: 42,
    runtime: '~80ms',
    rating: 4.5,
    downloads: 1890,
    author: 'Eve Optimizer',
    tags: ['qaoa', 'optimization', 'maxcut', 'hybrid'],
    code: {
      javascript: `// QAOA Implementation
const sdk = new QOSimSDK();
const qaoa = sdk.qaoa({
  problem: 'MaxCut',
  graph: [[0,1], [1,2], [2,0]],
  layers: 3
});
const result = await qaoa.run();`,
      python: `# QAOA Implementation
from qosim import QOSimSDK
sdk = QOSimSDK()
qaoa = sdk.qaoa(problem='MaxCut', graph=[[0,1], [1,2], [2,0]], layers=3)
result = qaoa.run()`,
      qasm: `// QAOA QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[6];
creg c[6];
// QAOA circuit...`
    }
  },
  {
    id: 'error-correction',
    name: "3-Qubit Error Correction",
    description: "Basic quantum error correction code",
    category: 'Error Correction',
    difficulty: 'Intermediate',
    qubits: 5,
    gates: 18,
    runtime: '~12ms',
    rating: 4.4,
    downloads: 5670,
    author: 'Frank Correction',
    tags: ['error-correction', 'syndrome', 'stabilizer'],
    code: {
      javascript: `// 3-Qubit Error Correction
const sdk = new QOSimSDK();
const circuit = sdk.errorCorrection({
  code: 'bit-flip',
  qubits: 5
});
const result = await circuit.run();`,
      python: `# 3-Qubit Error Correction
from qosim import QOSimSDK
sdk = QOSimSDK()
circuit = sdk.error_correction(code='bit-flip', qubits=5)
result = circuit.run()`,
      qasm: `// Error Correction QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[5];
creg c[5];
// Error correction circuit...`
    }
  }
];

interface AlgorithmLibraryProps {
  searchQuery: string;
}

export function AlgorithmLibrary({ searchQuery }: AlgorithmLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const categories = ['All', 'Entanglement', 'Search', 'Transform', 'Optimization', 'Cryptography', 'Error Correction'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredAlgorithms = algorithms.filter(algo => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || algo.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedAlgorithms = filteredAlgorithms.sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Algorithm Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-quantum-neon mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-quantum-neon mb-2">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-quantum-neon mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="w-full neon-border">
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAlgorithms.map(algorithm => (
          <AlgorithmCard
            key={algorithm.id}
            algorithm={algorithm}
            onRun={() => setSelectedAlgorithm(algorithm)}
            onModify={() => setSelectedAlgorithm(algorithm)}
            onExport={() => {}}
          />
        ))}
      </div>

      {/* Algorithm Runner Modal */}
      {selectedAlgorithm && (
        <AlgorithmRunner
          algorithm={selectedAlgorithm}
          onClose={() => setSelectedAlgorithm(null)}
        />
      )}
    </div>
  );
}
