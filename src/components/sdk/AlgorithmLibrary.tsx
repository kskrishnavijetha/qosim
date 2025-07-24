
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Search, Waves, Key, Heart, Info, Code } from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: Array<{
    type: string;
    qubit: number;
    controlQubit?: number;
    angle?: number;
  }>;
  code: {
    javascript: string;
    python: string;
  };
  applications: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const algorithms: Algorithm[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    description: 'Creates maximally entangled two-qubit states for quantum communication and teleportation protocols.',
    complexity: 'Beginner',
    qubits: 2,
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'CNOT', qubit: 1, controlQubit: 0 }
    ],
    code: {
      javascript: `// Bell State Generator
const bellState = new QOSim.Circuit(2);
bellState.h(0);
bellState.cnot(0, 1);
const result = await bellState.simulate();`,
      python: `# Bell State Generator
from qosim import Circuit
bell_state = Circuit(2)
bell_state.h(0)
bell_state.cnot(0, 1)
result = bell_state.simulate()`
    },
    applications: ['Quantum Communication', 'Quantum Teleportation', 'Quantum Key Distribution'],
    icon: Heart
  },
  {
    id: 'grovers-search',
    name: "Grover's Search Algorithm",
    description: 'Quantum search algorithm that finds marked items in an unsorted database with quadratic speedup.',
    complexity: 'Intermediate',
    qubits: 3,
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'H', qubit: 2 },
      { type: 'X', qubit: 2 },
      { type: 'H', qubit: 2 },
      { type: 'CNOT', qubit: 2, controlQubit: 0 },
      { type: 'CNOT', qubit: 2, controlQubit: 1 },
      { type: 'H', qubit: 2 },
      { type: 'X', qubit: 2 }
    ],
    code: {
      javascript: `// Grover's Search Algorithm
const grover = new QOSim.Circuit(3);
grover.h([0, 1, 2]); // Initialize superposition
grover.oracle([0, 1], 2); // Oracle marks target
grover.diffusion([0, 1, 2]); // Amplitude amplification
const result = await grover.simulate();`,
      python: `# Grover's Search Algorithm
from qosim import Circuit
grover = Circuit(3)
grover.h([0, 1, 2])  # Initialize superposition
grover.oracle([0, 1], 2)  # Oracle marks target
grover.diffusion([0, 1, 2])  # Amplitude amplification
result = grover.simulate()`
    },
    applications: ['Database Search', 'Optimization', 'Cryptanalysis'],
    icon: Search
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform',
    description: 'Transforms quantum states between computational and frequency domains, essential for many quantum algorithms.',
    complexity: 'Advanced',
    qubits: 3,
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'RZ', qubit: 1, angle: Math.PI/2 },
      { type: 'RZ', qubit: 2, angle: Math.PI/4 },
      { type: 'H', qubit: 1 },
      { type: 'RZ', qubit: 2, angle: Math.PI/2 },
      { type: 'H', qubit: 2 }
    ],
    code: {
      javascript: `// Quantum Fourier Transform
const qft = new QOSim.Circuit(3);
qft.qft([0, 1, 2]); // Apply QFT
const result = await qft.simulate();`,
      python: `# Quantum Fourier Transform
from qosim import Circuit
qft = Circuit(3)
qft.qft([0, 1, 2])  # Apply QFT
result = qft.simulate()`
    },
    applications: ['Shor\'s Algorithm', 'Period Finding', 'Phase Estimation'],
    icon: Waves
  },
  {
    id: 'shors-algorithm',
    name: "Shor's Algorithm",
    description: 'Quantum algorithm for integer factorization with exponential speedup over classical methods.',
    complexity: 'Advanced',
    qubits: 5,
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'H', qubit: 2 },
      { type: 'X', qubit: 4 },
      { type: 'CNOT', qubit: 3, controlQubit: 0 },
      { type: 'CNOT', qubit: 4, controlQubit: 1 }
    ],
    code: {
      javascript: `// Shor's Algorithm (simplified)
const shor = new QOSim.Circuit(5);
shor.shor_factorize(15); // Factor number 15
const result = await shor.simulate();`,
      python: `# Shor's Algorithm (simplified)
from qosim import Circuit
shor = Circuit(5)
shor.shor_factorize(15)  # Factor number 15
result = shor.simulate()`
    },
    applications: ['Cryptography', 'Integer Factorization', 'RSA Breaking'],
    icon: Key
  }
];

interface AlgorithmLibraryProps {
  selectedLanguage: 'javascript' | 'python';
  onAlgorithmSelect: (algorithm: Algorithm) => void;
  onSimulate: (code: string) => void;
  isSimulating: boolean;
}

export function AlgorithmLibrary({ 
  selectedLanguage, 
  onAlgorithmSelect, 
  onSimulate, 
  isSimulating 
}: AlgorithmLibraryProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const handleAlgorithmClick = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    onAlgorithmSelect(algorithm);
  };

  const handleRunAlgorithm = (algorithm: Algorithm) => {
    onSimulate(algorithm.code[selectedLanguage]);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-quantum-neon';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2">
        <Card className="quantum-panel neon-border h-full">
          <CardHeader>
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <Code className="h-5 w-5" />
              Pre-built Quantum Algorithms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {algorithms.map((algorithm) => (
                  <Card 
                    key={algorithm.id} 
                    className={`cursor-pointer transition-all hover:neon-border ${
                      selectedAlgorithm?.id === algorithm.id ? 'ring-2 ring-quantum-neon' : ''
                    }`}
                    onClick={() => handleAlgorithmClick(algorithm)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <algorithm.icon className="h-5 w-5 text-quantum-neon" />
                        <CardTitle className="text-lg text-quantum-glow">{algorithm.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getComplexityColor(algorithm.complexity)}>
                          {algorithm.complexity}
                        </Badge>
                        <Badge variant="secondary">
                          {algorithm.qubits} Qubits
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-quantum-particle mb-3">
                        {algorithm.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {algorithm.applications.slice(0, 2).map((app) => (
                          <Badge key={app} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunAlgorithm(algorithm);
                        }}
                        disabled={isSimulating}
                        size="sm"
                        className="w-full neon-border"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Algorithm
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedAlgorithm && (
          <Card className="quantum-panel neon-border h-full">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Info className="h-5 w-5" />
                Algorithm Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-quantum-neon flex items-center gap-2">
                    <selectedAlgorithm.icon className="h-4 w-4" />
                    {selectedAlgorithm.name}
                  </h3>
                  <p className="text-sm text-quantum-particle mt-1">
                    {selectedAlgorithm.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-quantum-glow">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-xs text-quantum-particle">Complexity:</span>
                      <div className={`text-sm font-medium ${getComplexityColor(selectedAlgorithm.complexity)}`}>
                        {selectedAlgorithm.complexity}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-quantum-particle">Qubits:</span>
                      <div className="text-sm font-medium text-quantum-neon">
                        {selectedAlgorithm.qubits}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-quantum-glow">Applications</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedAlgorithm.applications.map((app) => (
                      <Badge key={app} variant="outline" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-quantum-glow">Code Preview</h4>
                  <pre className="bg-quantum-matrix text-quantum-glow text-xs p-3 rounded-md mt-2 overflow-x-auto">
                    {selectedAlgorithm.code[selectedLanguage]}
                  </pre>
                </div>

                <Button
                  onClick={() => handleRunAlgorithm(selectedAlgorithm)}
                  disabled={isSimulating}
                  className="w-full neon-border"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isSimulating ? 'Running...' : 'Run Algorithm'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
