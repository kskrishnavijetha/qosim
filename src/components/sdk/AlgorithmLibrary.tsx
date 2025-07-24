
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, Edit, Download, Star, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  language: 'javascript' | 'python' | 'both';
  code: {
    javascript?: string;
    python?: string;
  };
}

const ALGORITHMS: Algorithm[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    description: 'Create maximally entangled two-qubit states |Φ+⟩, |Φ-⟩, |Ψ+⟩, |Ψ-⟩',
    category: 'Entanglement',
    difficulty: 'Beginner',
    qubits: 2,
    gates: 2,
    runtime: '< 1ms',
    rating: 4.9,
    language: 'both',
    code: {
      javascript: `// Bell State Generator
const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(2);

// Create |Φ+⟩ = (|00⟩ + |11⟩)/√2
circuit.h(0);        // Hadamard on qubit 0
circuit.cnot(0, 1);  // CNOT with control=0, target=1

const result = await circuit.simulate();
console.log('Bell state created:', result.statevector);`,
      python: `# Bell State Generator
from qosim import QOSimSDK

qosim = QOSimSDK()
circuit = qosim.create_circuit(2)

# Create |Φ+⟩ = (|00⟩ + |11⟩)/√2
circuit.h(0)        # Hadamard on qubit 0
circuit.cnot(0, 1)  # CNOT with control=0, target=1

result = circuit.simulate()
print(f"Bell state created: {result.statevector}")`
    }
  },
  {
    id: 'grovers-search',
    name: "Grover's Search Algorithm",
    description: 'Quantum search algorithm with quadratic speedup for unstructured databases',
    category: 'Search',
    difficulty: 'Intermediate',
    qubits: 3,
    gates: 12,
    runtime: '~5ms',
    rating: 4.7,
    language: 'both',
    code: {
      javascript: `// Grover's Search Algorithm
const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(3);

// Initialize superposition
circuit.h([0, 1, 2]);

// Oracle: mark |101⟩ state
circuit.x(1);  // Flip qubit 1
circuit.ccz(0, 2, 1);  // Multi-controlled Z
circuit.x(1);  // Flip back

// Diffusion operator
circuit.h([0, 1, 2]);
circuit.x([0, 1, 2]);
circuit.ccz(0, 1, 2);
circuit.x([0, 1, 2]);
circuit.h([0, 1, 2]);

const result = await circuit.simulate();
console.log('Search result:', result.probabilities);`,
      python: `# Grover's Search Algorithm
from qosim import QOSimSDK

qosim = QOSimSDK()
circuit = qosim.create_circuit(3)

# Initialize superposition
circuit.h([0, 1, 2])

# Oracle: mark |101⟩ state
circuit.x(1)  # Flip qubit 1
circuit.ccz(0, 2, 1)  # Multi-controlled Z
circuit.x(1)  # Flip back

# Diffusion operator
circuit.h([0, 1, 2])
circuit.x([0, 1, 2])
circuit.ccz(0, 1, 2)
circuit.x([0, 1, 2])
circuit.h([0, 1, 2])

result = circuit.simulate()
print(f"Search result: {result.probabilities}")`
    }
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform',
    description: 'Convert between computational and frequency basis using QFT',
    category: 'Transform',
    difficulty: 'Advanced',
    qubits: 4,
    gates: 18,
    runtime: '~8ms',
    rating: 4.8,
    language: 'both',
    code: {
      javascript: `// Quantum Fourier Transform
const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(4);

// QFT on 4 qubits
for (let i = 0; i < 4; i++) {
  circuit.h(i);
  
  for (let j = i + 1; j < 4; j++) {
    const angle = Math.PI / Math.pow(2, j - i);
    circuit.cp(angle, i, j);  // Controlled phase
  }
}

// Reverse qubit order
for (let i = 0; i < 2; i++) {
  circuit.swap(i, 3 - i);
}

const result = await circuit.simulate();
console.log('QFT result:', result.statevector);`,
      python: `# Quantum Fourier Transform
from qosim import QOSimSDK
import math

qosim = QOSimSDK()
circuit = qosim.create_circuit(4)

# QFT on 4 qubits
for i in range(4):
    circuit.h(i)
    
    for j in range(i + 1, 4):
        angle = math.pi / (2 ** (j - i))
        circuit.cp(angle, i, j)  # Controlled phase

# Reverse qubit order
for i in range(2):
    circuit.swap(i, 3 - i)

result = circuit.simulate()
print(f"QFT result: {result.statevector}")`
    }
  },
  {
    id: 'shors-algorithm',
    name: "Shor's Factoring Algorithm",
    description: 'Quantum algorithm for integer factorization with exponential speedup',
    category: 'Cryptography',
    difficulty: 'Advanced',
    qubits: 8,
    gates: 45,
    runtime: '~25ms',
    rating: 4.6,
    language: 'both',
    code: {
      javascript: `// Shor's Algorithm (simplified)
const qosim = new QOSimSDK();

async function shorsAlgorithm(N = 15) {
  const circuit = qosim.createCircuit(8);
  
  // Phase estimation setup
  circuit.h([0, 1, 2, 3]);  // Control qubits
  circuit.x(4);  // |1⟩ in work register
  
  // Modular exponentiation (simplified)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < Math.pow(2, i); j++) {
      circuit.controlled_multiply(i, 4, 7, N);
    }
  }
  
  // Inverse QFT on control qubits
  circuit.iqft([0, 1, 2, 3]);
  
  const result = await circuit.simulate();
  return result.measurements;
}

const factors = await shorsAlgorithm(15);
console.log('Potential factors:', factors);`,
      python: `# Shor's Algorithm (simplified)
from qosim import QOSimSDK

def shors_algorithm(N=15):
    qosim = QOSimSDK()
    circuit = qosim.create_circuit(8)
    
    # Phase estimation setup
    circuit.h([0, 1, 2, 3])  # Control qubits
    circuit.x(4)  # |1⟩ in work register
    
    # Modular exponentiation (simplified)
    for i in range(4):
        for j in range(2**i):
            circuit.controlled_multiply(i, 4, 7, N)
    
    # Inverse QFT on control qubits
    circuit.iqft([0, 1, 2, 3])
    
    result = circuit.simulate()
    return result.measurements

factors = shors_algorithm(15)
print(f"Potential factors: {factors}")`
    }
  }
];

interface AlgorithmLibraryProps {
  selectedLanguage: 'javascript' | 'python';
  workspace: any;
}

export function AlgorithmLibrary({ selectedLanguage, workspace }: AlgorithmLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const { toast } = useToast();

  const categories = ['all', ...Array.from(new Set(ALGORITHMS.map(alg => alg.category)))];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredAlgorithms = ALGORITHMS.filter(algorithm => {
    const matchesSearch = algorithm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algorithm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || algorithm.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || algorithm.difficulty === selectedDifficulty;
    const matchesLanguage = algorithm.language === 'both' || algorithm.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
  });

  const handleRunAlgorithm = async (algorithm: Algorithm) => {
    try {
      toast({
        title: "Running Algorithm",
        description: `Executing ${algorithm.name}...`,
      });
      
      // Simulate algorithm execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Algorithm Completed",
        description: `${algorithm.name} executed successfully in ${algorithm.runtime}`,
      });
    } catch (error) {
      toast({
        title: "Execution Error",
        description: "Failed to run algorithm",
        variant: "destructive",
      });
    }
  };

  const handleEditAlgorithm = (algorithm: Algorithm) => {
    toast({
      title: "Opening Editor",
      description: `Loading ${algorithm.name} in code editor...`,
    });
  };

  const handleDownloadAlgorithm = (algorithm: Algorithm) => {
    const code = algorithm.code[selectedLanguage] || '';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithm.id}.${selectedLanguage === 'javascript' ? 'js' : 'py'}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `${algorithm.name} code downloaded`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Algorithm Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-quantum-particle" />
              <Input
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 quantum-panel neon-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 quantum-panel neon-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-48 quantum-panel neon-border">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAlgorithms.map(algorithm => (
          <Card key={algorithm.id} className="quantum-panel neon-border hover:neon-glow transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-quantum-glow">{algorithm.name}</CardTitle>
                  <p className="text-sm text-quantum-particle mt-1">{algorithm.description}</p>
                </div>
                <div className="flex items-center gap-1 text-quantum-energy">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{algorithm.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{algorithm.category}</Badge>
                <Badge variant={algorithm.difficulty === 'Beginner' ? 'default' : 
                              algorithm.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                  {algorithm.difficulty}
                </Badge>
                <Badge variant="outline" className="text-quantum-particle">
                  {algorithm.qubits} qubits
                </Badge>
                <Badge variant="outline" className="text-quantum-particle">
                  {algorithm.gates} gates
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-quantum-particle mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Runtime: {algorithm.runtime}</span>
                </div>
                <span className="capitalize">{selectedLanguage}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 neon-border"
                  onClick={() => handleRunAlgorithm(algorithm)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="neon-border"
                  onClick={() => handleEditAlgorithm(algorithm)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="neon-border"
                  onClick={() => handleDownloadAlgorithm(algorithm)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlgorithms.length === 0 && (
        <Card className="quantum-panel neon-border">
          <CardContent className="text-center py-12">
            <p className="text-quantum-particle">No algorithms found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4 neon-border"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
