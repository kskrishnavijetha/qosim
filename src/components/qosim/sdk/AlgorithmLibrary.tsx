
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type QuantumAlgorithm } from '@/types/qosim';
import { BookOpen, Code2, Play } from 'lucide-react';

interface AlgorithmLibraryProps {
  onAlgorithmSelect: (algorithm: QuantumAlgorithm) => void;
  selectedLanguage: 'python' | 'javascript';
}

export function AlgorithmLibrary({ onAlgorithmSelect, selectedLanguage }: AlgorithmLibraryProps) {
  const algorithms: QuantumAlgorithm[] = [
    {
      id: 'bell-state',
      name: 'Bell State',
      category: 'Entanglement',
      description: 'Creates a maximally entangled two-qubit state',
      complexity: 'Beginner',
      implementation: {
        python: `# Bell State Creation
from qosim import QuantumCircuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cnot(0, 1)
result = qc.simulate()`,
        javascript: `// Bell State Creation
const qc = new QuantumCircuit(2);
qc.h(0);
qc.cnot(0, 1);
const result = qc.simulate();`
      }
    },
    {
      id: 'grovers',
      name: "Grover's Search",
      category: 'Search',
      description: 'Quantum search algorithm with quadratic speedup',
      complexity: 'Intermediate',
      implementation: {
        python: `# Grover's Algorithm
from qosim import QuantumCircuit
import numpy as np

def grovers_search(n_qubits, marked_state):
    qc = QuantumCircuit(n_qubits)
    # Initialize superposition
    for i in range(n_qubits):
        qc.h(i)
    # Apply Grover iterations
    iterations = int(np.pi/4 * np.sqrt(2**n_qubits))
    for _ in range(iterations):
        # Oracle
        qc.cz(marked_state[0], marked_state[1])
        # Diffusion operator
        for i in range(n_qubits):
            qc.h(i)
            qc.x(i)
        qc.cz(0, 1)
        for i in range(n_qubits):
            qc.x(i)
            qc.h(i)
    return qc`,
        javascript: `// Grover's Algorithm
function groversSearch(nQubits, markedState) {
    const qc = new QuantumCircuit(nQubits);
    // Initialize superposition
    for (let i = 0; i < nQubits; i++) {
        qc.h(i);
    }
    // Apply Grover iterations
    const iterations = Math.floor(Math.PI/4 * Math.sqrt(2**nQubits));
    for (let iter = 0; iter < iterations; iter++) {
        // Oracle
        qc.cz(markedState[0], markedState[1]);
        // Diffusion operator
        for (let i = 0; i < nQubits; i++) {
            qc.h(i);
            qc.x(i);
        }
        qc.cz(0, 1);
        for (let i = 0; i < nQubits; i++) {
            qc.x(i);
            qc.h(i);
        }
    }
    return qc;
}`
      }
    },
    {
      id: 'qft',
      name: 'Quantum Fourier Transform',
      category: 'Transform',
      description: 'Quantum version of discrete Fourier transform',
      complexity: 'Advanced',
      implementation: {
        python: `# Quantum Fourier Transform
from qosim import QuantumCircuit
import numpy as np

def qft(qc, n):
    for i in range(n):
        qc.h(i)
        for j in range(i+1, n):
            angle = 2*np.pi / (2**(j-i+1))
            qc.cp(angle, j, i)
    # Reverse qubit order
    for i in range(n//2):
        qc.swap(i, n-1-i)
    return qc`,
        javascript: `// Quantum Fourier Transform
function qft(qc, n) {
    for (let i = 0; i < n; i++) {
        qc.h(i);
        for (let j = i + 1; j < n; j++) {
            const angle = 2 * Math.PI / (2**(j-i+1));
            qc.cp(angle, j, i);
        }
    }
    // Reverse qubit order
    for (let i = 0; i < Math.floor(n/2); i++) {
        qc.swap(i, n-1-i);
    }
    return qc;
}`
      }
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-400 flex items-center">
        <BookOpen className="w-5 h-5 mr-2" />
        Algorithm Library
      </h3>
      
      <div className="grid gap-4">
        {algorithms.map(algorithm => (
          <Card key={algorithm.id} className="bg-black/30 border-white/10 hover:border-blue-400/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-blue-400">{algorithm.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {algorithm.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      algorithm.complexity === 'Beginner' ? 'text-green-400' :
                      algorithm.complexity === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    {algorithm.complexity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-300">{algorithm.description}</p>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => onAlgorithmSelect(algorithm)}
                  size="sm"
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Load {selectedLanguage}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-slate-400 border-slate-400/30"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
