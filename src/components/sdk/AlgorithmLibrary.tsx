
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Search, Shuffle, Key, Link } from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  complexity: string;
  qubits: number;
  gates: any[];
  icon: React.ReactNode;
  category: string;
}

const algorithms: Algorithm[] = [
  {
    id: 'grovers',
    name: "Grover's Search",
    description: "Quantum search algorithm for unsorted databases with quadratic speedup",
    complexity: "O(√N)",
    qubits: 3,
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'h2', type: 'H', qubit: 1, position: 1 },
      { id: 'h3', type: 'H', qubit: 2, position: 2 },
      { id: 'oracle', type: 'Z', qubit: 2, position: 3 },
      { id: 'diffusion1', type: 'H', qubit: 0, position: 4 },
      { id: 'diffusion2', type: 'H', qubit: 1, position: 5 },
      { id: 'diffusion3', type: 'H', qubit: 2, position: 6 },
    ],
    icon: <Search className="w-5 h-5" />,
    category: 'Search'
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform',
    description: 'Quantum version of the discrete Fourier transform',
    complexity: "O(n²)",
    qubits: 3,
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'rz1', type: 'RZ', qubit: 1, angle: Math.PI/2, position: 1 },
      { id: 'rz2', type: 'RZ', qubit: 2, angle: Math.PI/4, position: 2 },
      { id: 'h2', type: 'H', qubit: 1, position: 3 },
      { id: 'rz3', type: 'RZ', qubit: 2, angle: Math.PI/2, position: 4 },
      { id: 'h3', type: 'H', qubit: 2, position: 5 },
    ],
    icon: <Shuffle className="w-5 h-5" />,
    category: 'Transform'
  },
  {
    id: 'shors',
    name: "Shor's Algorithm",
    description: 'Quantum algorithm for integer factorization',
    complexity: "O((log N)³)",
    qubits: 4,
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'h2', type: 'H', qubit: 1, position: 1 },
      { id: 'controlled1', type: 'CNOT', qubits: [0, 2], position: 2 },
      { id: 'controlled2', type: 'CNOT', qubits: [1, 3], position: 3 },
      { id: 'qft1', type: 'H', qubit: 0, position: 4 },
      { id: 'qft2', type: 'H', qubit: 1, position: 5 },
    ],
    icon: <Key className="w-5 h-5" />,
    category: 'Cryptography'
  },
  {
    id: 'bell',
    name: 'Bell States',
    description: 'Maximally entangled two-qubit states',
    complexity: "O(1)",
    qubits: 2,
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: 1 },
    ],
    icon: <Link className="w-5 h-5" />,
    category: 'Entanglement'
  }
];

interface AlgorithmLibraryProps {
  onAlgorithmSelect: (algorithm: Algorithm) => void;
  selectedAlgorithm: string | null;
}

export function AlgorithmLibrary({ onAlgorithmSelect, selectedAlgorithm }: AlgorithmLibraryProps) {
  const categories = [...new Set(algorithms.map(alg => alg.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-quantum-glow">Algorithm Library</h2>
        <Badge variant="outline">
          {algorithms.length} Algorithms Available
        </Badge>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-quantum-neon">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algorithms
              .filter(alg => alg.category === category)
              .map(algorithm => (
                <Card 
                  key={algorithm.id} 
                  className={`quantum-panel cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedAlgorithm === algorithm.id 
                      ? 'neon-border bg-quantum-matrix' 
                      : 'border-quantum-neon/20 hover:border-quantum-neon/40'
                  }`}
                  onClick={() => onAlgorithmSelect(algorithm)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-quantum-glow">
                          {algorithm.icon}
                        </div>
                        <CardTitle className="text-quantum-neon font-mono">
                          {algorithm.name}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {algorithm.qubits}Q
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-quantum-particle mb-3">
                      {algorithm.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {algorithm.complexity}
                      </Badge>
                      <span className="text-xs text-quantum-energy">
                        {algorithm.gates.length} gates
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
