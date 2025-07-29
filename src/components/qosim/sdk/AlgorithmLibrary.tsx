
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
      category: 'basic',
      description: 'Creates a maximally entangled two-qubit state',
      complexity: 'beginner',
      parameters: [],
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
const result = qc.simulate();`,
        qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;`
      },
      visualization: {
        steps: []
      }
    },
    {
      id: 'grovers',
      name: "Grover's Search",
      category: 'search',
      description: 'Quantum search algorithm with quadratic speedup',
      complexity: 'intermediate',
      parameters: [],
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
}`,
        qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
h q[1];
cz q[0],q[1];
h q[0];
h q[1];
measure q -> c;`
      },
      visualization: {
        steps: []
      }
    },
    {
      id: 'qft',
      name: 'Quantum Fourier Transform',
      category: 'simulation',
      description: 'Quantum version of discrete Fourier transform',
      complexity: 'advanced',
      parameters: [],
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
}`,
        qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];
creg c[3];
h q[0];
cp(pi/2) q[1],q[0];
cp(pi/4) q[2],q[0];
h q[1];
cp(pi/2) q[2],q[1];
h q[2];
swap q[0],q[2];
measure q -> c;`
      },
      visualization: {
        steps: []
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
                      algorithm.complexity === 'beginner' ? 'text-green-400' :
                      algorithm.complexity === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
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
