
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Heart, Waves, Shield, Zap, Calculator, Atom } from 'lucide-react';

interface AlgorithmInfo {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  pythonCode: string;
  javascriptCode: string;
  qubits: number;
  gates: number;
}

const algorithms: AlgorithmInfo[] = [
  {
    id: 'grover',
    name: "Grover's Search",
    icon: Search,
    category: 'Search',
    difficulty: 'intermediate',
    description: 'Quantum search algorithm with quadratic speedup',
    qubits: 2,
    gates: 8,
    pythonCode: `# Grover's Search Algorithm
from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(2)
sim.h(0)  # Initialize superposition
sim.h(1)
sim.cz(0, 1)  # Oracle for |11⟩
# Diffusion operator
sim.h(0); sim.h(1)
sim.x(0); sim.x(1)
sim.cz(0, 1)
sim.x(0); sim.x(1)
sim.h(0); sim.h(1)
result = sim.run()`,
    javascriptCode: `// Grover's Search Algorithm
await sdk.initialize();
let circuit = sdk.createCircuit('Grover Search', 2);
// Initialize superposition
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
// Oracle for |11⟩
circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 0, qubit: 1 });
// Diffusion operator
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 0, qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
const result = await sdk.simulate(circuit);`
  },
  {
    id: 'bell-states',
    name: 'Bell States',
    icon: Heart,
    category: 'Entanglement',
    difficulty: 'beginner',
    description: 'Create maximally entangled two-qubit states',
    qubits: 2,
    gates: 2,
    pythonCode: `# Bell State Generator
from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(2)
sim.h(0)      # Create superposition
sim.cnot(0, 1)  # Create entanglement
result = sim.run()`,
    javascriptCode: `// Bell State Generator
await sdk.initialize();
let circuit = sdk.createCircuit('Bell State', 2);
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
const result = await sdk.simulate(circuit);`
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform',
    icon: Waves,
    category: 'Transform',
    difficulty: 'advanced',
    description: 'Transform between computational and frequency domains',
    qubits: 3,
    gates: 6,
    pythonCode: `# Quantum Fourier Transform
from qosim_sdk import QuantumSimulator
import numpy as np

sim = QuantumSimulator(3)
# Apply QFT
sim.h(0)
sim.controlled_phase(0, 1, np.pi/2)
sim.controlled_phase(0, 2, np.pi/4)
sim.h(1)
sim.controlled_phase(1, 2, np.pi/2)
sim.h(2)
sim.swap(0, 2)  # Reverse order
result = sim.run()`,
    javascriptCode: `// Quantum Fourier Transform
await sdk.initialize();
let circuit = sdk.createCircuit('QFT', 3);
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'rz', qubit: 1, angle: Math.PI/2, controlQubit: 0 });
circuit = sdk.addGate(circuit, { type: 'rz', qubit: 2, angle: Math.PI/4, controlQubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'rz', qubit: 2, angle: Math.PI/2, controlQubit: 1 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 2 });
const result = await sdk.simulate(circuit);`
  },
  {
    id: 'error-correction',
    name: 'Error Correction',
    icon: Shield,
    category: 'Protection',
    difficulty: 'advanced',
    description: 'Protect quantum information from decoherence',
    qubits: 3,
    gates: 4,
    pythonCode: `# 3-Qubit Error Correction
from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(3)
sim.h(0)      # Logical |+⟩ state
sim.cnot(0, 1)  # Encode
sim.cnot(0, 2)
sim.x(1)      # Introduce error
# Syndrome measurement & correction
sim.cnot(0, 1)
sim.cnot(0, 2)
result = sim.run()`,
    javascriptCode: `// 3-Qubit Error Correction
await sdk.initialize();
let circuit = sdk.createCircuit('Error Correction', 3);
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 2 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 }); // Error
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 2 });
const result = await sdk.simulate(circuit);`
  },
  {
    id: 'vqe',
    name: 'VQE (Variational Quantum Eigensolver)',
    icon: Calculator,
    category: 'Optimization',
    difficulty: 'advanced',
    description: 'Find ground state energies using hybrid algorithms',
    qubits: 2,
    gates: 6,
    pythonCode: `# VQE Implementation
from qosim_sdk import QuantumSimulator
import numpy as np

def vqe_circuit(theta):
    sim = QuantumSimulator(2)
    sim.ry(0, theta[0])
    sim.ry(1, theta[1])
    sim.cnot(0, 1)
    return sim.run()

# Optimize parameters
theta = [np.pi/4, np.pi/4]
result = vqe_circuit(theta)`,
    javascriptCode: `// VQE Implementation
await sdk.initialize();

function vqeCircuit(theta) {
    let circuit = sdk.createCircuit('VQE', 2);
    circuit = sdk.addGate(circuit, { type: 'ry', qubit: 0, angle: theta[0] });
    circuit = sdk.addGate(circuit, { type: 'ry', qubit: 1, angle: theta[1] });
    circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
    return sdk.simulate(circuit);
}

const theta = [Math.PI/4, Math.PI/4];
const result = await vqeCircuit(theta);`
  },
  {
    id: 'qaoa',
    name: 'QAOA',
    icon: Zap,
    category: 'Optimization',
    difficulty: 'advanced',
    description: 'Quantum Approximate Optimization Algorithm',
    qubits: 2,
    gates: 8,
    pythonCode: `# QAOA Implementation
from qosim_sdk import QuantumSimulator
import numpy as np

sim = QuantumSimulator(2)
# Initialize superposition
sim.h(0); sim.h(1)
# Problem Hamiltonian
sim.rz(0, 0.5)
sim.rz(1, 0.5)
sim.rzz(0, 1, 1.0)  # Interaction
# Mixer Hamiltonian
sim.rx(0, 0.5)
sim.rx(1, 0.5)
result = sim.run()`,
    javascriptCode: `// QAOA Implementation
await sdk.initialize();
let circuit = sdk.createCircuit('QAOA', 2);
// Initialize superposition
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
// Problem Hamiltonian
circuit = sdk.addGate(circuit, { type: 'rz', qubit: 0, angle: 0.5 });
circuit = sdk.addGate(circuit, { type: 'rz', qubit: 1, angle: 0.5 });
// Interaction term (simplified)
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'rz', qubit: 1, angle: 1.0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
// Mixer Hamiltonian
circuit = sdk.addGate(circuit, { type: 'rx', qubit: 0, angle: 0.5 });
circuit = sdk.addGate(circuit, { type: 'rx', qubit: 1, angle: 0.5 });
const result = await sdk.simulate(circuit);`
  }
];

interface AlgorithmLibraryProps {
  selectedAlgorithm: string;
  onAlgorithmSelect: (id: string) => void;
  language: 'python' | 'javascript';
  onCodeGenerated: (code: string) => void;
}

export function AlgorithmLibrary({
  selectedAlgorithm,
  onAlgorithmSelect,
  language,
  onCodeGenerated
}: AlgorithmLibraryProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const categories = Array.from(new Set(algorithms.map(a => a.category)));
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredAlgorithms = algorithms.filter(algo => 
    (categoryFilter === 'all' || algo.category === categoryFilter) &&
    (difficultyFilter === 'all' || algo.difficulty === difficultyFilter)
  );

  useEffect(() => {
    const algorithm = algorithms.find(a => a.id === selectedAlgorithm);
    if (algorithm) {
      const code = language === 'python' ? algorithm.pythonCode : algorithm.javascriptCode;
      onCodeGenerated(code);
    }
  }, [selectedAlgorithm, language, onCodeGenerated]);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Atom className="w-5 h-5" />
          Algorithm Library
        </CardTitle>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 quantum-panel neon-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="quantum-panel neon-border">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-32 quantum-panel neon-border">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="quantum-panel neon-border">
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(diff => (
                <SelectItem key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {filteredAlgorithms.map(algorithm => {
              const Icon = algorithm.icon;
              const isSelected = selectedAlgorithm === algorithm.id;
              
              return (
                <Button
                  key={algorithm.id}
                  variant={isSelected ? "default" : "ghost"}
                  className={`w-full p-4 h-auto justify-start text-left ${
                    isSelected ? 'bg-quantum-matrix neon-border' : 'hover:bg-quantum-matrix/50'
                  }`}
                  onClick={() => onAlgorithmSelect(algorithm.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Icon className="w-5 h-5 mt-0.5 text-quantum-neon" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{algorithm.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            algorithm.difficulty === 'beginner' ? 'text-green-400' :
                            algorithm.difficulty === 'intermediate' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}
                        >
                          {algorithm.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {algorithm.description}
                      </p>
                      <div className="flex gap-2 text-xs text-quantum-particle">
                        <span>{algorithm.qubits} qubits</span>
                        <span>•</span>
                        <span>{algorithm.gates} gates</span>
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
