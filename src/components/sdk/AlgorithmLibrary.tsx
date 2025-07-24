
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { 
  Play, 
  Edit, 
  Download, 
  Star, 
  Clock,
  Cpu,
  Zap,
  Shield,
  Search,
  Filter
} from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: Gate[];
  executionTime: string;
  rating: number;
  uses: number;
  tags: string[];
  code: {
    javascript: string;
    python: string;
    qasm: string;
  };
}

const algorithmDatabase: Algorithm[] = [
  {
    id: 'bell-state',
    name: 'Bell State Creation',
    category: 'Fundamentals',
    description: 'Creates maximally entangled two-qubit Bell states (EPR pairs)',
    complexity: 'Basic',
    qubits: 2,
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'cnot1', type: 'CNOT', qubit: 0, position: 1, controlQubit: 0 }
    ],
    executionTime: '< 1ms',
    rating: 4.9,
    uses: 1250,
    tags: ['entanglement', 'epr', 'basic'],
    code: {
      javascript: `const circuit = new QOSimCircuit(2);
circuit.h(0);
circuit.cnot(0, 1);`,
      python: `circuit = QOSimCircuit(2)
circuit.h(0)
circuit.cnot(0, 1)`,
      qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
h q[0];
cx q[0],q[1];`
    }
  },
  {
    id: 'grovers',
    name: "Grover's Search",
    category: 'Search',
    description: 'Quantum search algorithm with quadratic speedup',
    complexity: 'Intermediate',
    qubits: 3,
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'h2', type: 'H', qubit: 1, position: 0 },
      { id: 'h3', type: 'H', qubit: 2, position: 0 },
      { id: 'cz1', type: 'CZ', qubit: 0, position: 1, controlQubit: 0 }
    ],
    executionTime: '2-5ms',
    rating: 4.7,
    uses: 890,
    tags: ['search', 'amplitude-amplification', 'oracle'],
    code: {
      javascript: `const circuit = new QOSimCircuit(3);
// Initialize superposition
circuit.h(0); circuit.h(1); circuit.h(2);
// Oracle and diffusion operator
circuit.cz(0, 1); circuit.cz(1, 2);`,
      python: `circuit = QOSimCircuit(3)
# Initialize superposition
for i in range(3): circuit.h(i)
# Oracle and diffusion
circuit.cz(0, 1); circuit.cz(1, 2)`,
      qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];
h q[0]; h q[1]; h q[2];
cz q[0],q[1]; cz q[1],q[2];`
    }
  }
];

interface AlgorithmLibraryProps {
  searchQuery: string;
  onAlgorithmSelect: (algorithm: Algorithm) => void;
}

export function AlgorithmLibrary({ searchQuery, onAlgorithmSelect }: AlgorithmLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const categories = ['all', ...Array.from(new Set(algorithmDatabase.map(a => a.category)))];
  const complexities = ['all', 'Basic', 'Intermediate', 'Advanced'];

  const filteredAlgorithms = useMemo(() => {
    return algorithmDatabase
      .filter(algorithm => {
        const matchesSearch = algorithm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            algorithm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            algorithm.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || algorithm.category === selectedCategory;
        const matchesComplexity = selectedComplexity === 'all' || algorithm.complexity === selectedComplexity;
        
        return matchesSearch && matchesCategory && matchesComplexity;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rating': return b.rating - a.rating;
          case 'uses': return b.uses - a.uses;
          case 'name': return a.name.localeCompare(b.name);
          case 'complexity': 
            const complexityOrder = { 'Basic': 1, 'Intermediate': 2, 'Advanced': 3 };
            return complexityOrder[a.complexity] - complexityOrder[b.complexity];
          default: return 0;
        }
      });
  }, [searchQuery, selectedCategory, selectedComplexity, sortBy]);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fundamentals': return <Zap className="w-4 h-4" />;
      case 'Search': return <Search className="w-4 h-4" />;
      case 'Cryptography': return <Shield className="w-4 h-4" />;
      case 'Error Correction': return <Shield className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Algorithm Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                {complexities.map(complexity => (
                  <SelectItem key={complexity} value={complexity}>
                    {complexity === 'all' ? 'All Levels' : complexity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="uses">Usage</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="complexity">Complexity</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-quantum-particle flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              {filteredAlgorithms.length} algorithms found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlgorithms.map(algorithm => (
          <Card key={algorithm.id} className="quantum-panel neon-border hover:neon-glow transition-all cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(algorithm.category)}
                  <CardTitle className="text-sm text-quantum-glow">{algorithm.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-quantum-neon">{algorithm.rating}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={`text-xs ${getComplexityColor(algorithm.complexity)} text-white`}>
                  {algorithm.complexity}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {algorithm.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-quantum-particle">{algorithm.description}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-quantum-neon font-mono">{algorithm.qubits}</div>
                  <div className="text-quantum-particle">Qubits</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-energy font-mono">{algorithm.gates.length}</div>
                  <div className="text-quantum-particle">Gates</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-glow font-mono">{algorithm.executionTime}</div>
                  <div className="text-quantum-particle">Time</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onAlgorithmSelect(algorithm)}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Run
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedAlgorithm(algorithm)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Modify
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                {algorithm.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-quantum-particle">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {algorithm.uses} uses
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Algorithm Detail Modal */}
      {selectedAlgorithm && (
        <Card className="fixed inset-4 z-50 bg-quantum-void border-quantum-neon overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-quantum-glow">{selectedAlgorithm.name}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedAlgorithm(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript">
              <TabsList>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="qasm">QASM</TabsTrigger>
              </TabsList>
              <TabsContent value="javascript">
                <pre className="bg-quantum-matrix p-4 rounded text-quantum-neon text-sm overflow-auto">
                  {selectedAlgorithm.code.javascript}
                </pre>
              </TabsContent>
              <TabsContent value="python">
                <pre className="bg-quantum-matrix p-4 rounded text-quantum-neon text-sm overflow-auto">
                  {selectedAlgorithm.code.python}
                </pre>
              </TabsContent>
              <TabsContent value="qasm">
                <pre className="bg-quantum-matrix p-4 rounded text-quantum-neon text-sm overflow-auto">
                  {selectedAlgorithm.code.qasm}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
