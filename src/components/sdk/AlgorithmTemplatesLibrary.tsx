
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gate } from '@/hooks/useCircuitState';
import { Search, BookOpen, Zap, Lock, Cpu, Database, Atom } from 'lucide-react';
import { toast } from 'sonner';

interface AlgorithmTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: Gate[];
  icon: React.ReactNode;
  complexity: string;
  useCase: string;
}

interface AlgorithmTemplatesLibraryProps {
  onAlgorithmLoad: (algorithm: string, gates: Gate[]) => void;
  currentCircuit: Gate[];
}

export function AlgorithmTemplatesLibrary({ 
  onAlgorithmLoad, 
  currentCircuit 
}: AlgorithmTemplatesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const algorithmTemplates: AlgorithmTemplate[] = [
    {
      id: 'grovers',
      name: "Grover's Search",
      category: 'search',
      description: 'Quantum search algorithm that finds marked items in unsorted databases',
      difficulty: 'Intermediate',
      qubits: 3,
      complexity: 'O(√N)',
      useCase: 'Database search, optimization',
      icon: <Search className="w-5 h-5" />,
      gates: [
        { id: 'g1', type: 'H', qubit: 0, position: 0 },
        { id: 'g2', type: 'H', qubit: 1, position: 0 },
        { id: 'g3', type: 'H', qubit: 2, position: 0 },
        { id: 'g4', type: 'Z', qubit: 2, position: 1 },
        { id: 'g5', type: 'CNOT', qubits: [1, 2], position: 2 },
        { id: 'g6', type: 'Z', qubit: 1, position: 3 },
        { id: 'g7', type: 'CNOT', qubits: [1, 2], position: 4 },
        { id: 'g8', type: 'H', qubit: 0, position: 5 },
        { id: 'g9', type: 'H', qubit: 1, position: 5 },
        { id: 'g10', type: 'H', qubit: 2, position: 5 },
      ]
    },
    {
      id: 'shors',
      name: "Shor's Algorithm",
      category: 'cryptography',
      description: 'Quantum algorithm for integer factorization with exponential speedup',
      difficulty: 'Advanced',
      qubits: 5,
      complexity: 'O((log N)³)',
      useCase: 'Cryptography, RSA breaking',
      icon: <Lock className="w-5 h-5" />,
      gates: [
        { id: 's1', type: 'H', qubit: 0, position: 0 },
        { id: 's2', type: 'H', qubit: 1, position: 0 },
        { id: 's3', type: 'X', qubit: 4, position: 1 },
        { id: 's4', type: 'CNOT', qubits: [1, 2], position: 1 },
        { id: 's5', type: 'CNOT', qubits: [0, 3], position: 2 },
        { id: 's6', type: 'RZ', qubit: 2, position: 3, angle: Math.PI/4 },
        { id: 's7', type: 'RZ', qubit: 3, position: 3, angle: Math.PI/2 },
        { id: 's8', type: 'H', qubit: 0, position: 4 },
        { id: 's9', type: 'H', qubit: 1, position: 4 },
        { id: 's10', type: 'M', qubit: 0, position: 5 },
      ]
    },
    {
      id: 'vqe',
      name: 'Variational Quantum Eigensolver (VQE)',
      category: 'optimization',
      description: 'Hybrid quantum-classical algorithm for finding ground state energies',
      difficulty: 'Advanced',
      qubits: 4,
      complexity: 'Poly(n)',
      useCase: 'Chemistry, materials science',
      icon: <Atom className="w-5 h-5" />,
      gates: [
        { id: 'v1', type: 'RY', qubit: 0, position: 0, angle: Math.PI/4 },
        { id: 'v2', type: 'RY', qubit: 1, position: 0, angle: Math.PI/3 },
        { id: 'v3', type: 'CNOT', qubits: [0, 1], position: 1 },
        { id: 'v4', type: 'RY', qubit: 2, position: 1, angle: Math.PI/6 },
        { id: 'v5', type: 'CNOT', qubits: [1, 2], position: 2 },
        { id: 'v6', type: 'RY', qubit: 3, position: 2, angle: Math.PI/8 },
        { id: 'v7', type: 'CNOT', qubits: [2, 3], position: 3 },
        { id: 'v8', type: 'M', qubit: 0, position: 4 },
        { id: 'v9', type: 'M', qubit: 1, position: 4 },
      ]
    },
    {
      id: 'qaoa',
      name: 'Quantum Approximate Optimization (QAOA)',
      category: 'optimization',
      description: 'Variational algorithm for combinatorial optimization problems',
      difficulty: 'Advanced',
      qubits: 4,
      complexity: 'Poly(n)',
      useCase: 'Max-Cut, TSP, portfolio optimization',
      icon: <Zap className="w-5 h-5" />,
      gates: [
        { id: 'q1', type: 'H', qubit: 0, position: 0 },
        { id: 'q2', type: 'H', qubit: 1, position: 0 },
        { id: 'q3', type: 'H', qubit: 2, position: 0 },
        { id: 'q4', type: 'H', qubit: 3, position: 0 },
        { id: 'q5', type: 'RZ', qubit: 0, position: 1, angle: Math.PI/3 },
        { id: 'q6', type: 'RZ', qubit: 1, position: 1, angle: Math.PI/3 },
        { id: 'q7', type: 'CNOT', qubits: [0, 1], position: 2 },
        { id: 'q8', type: 'RZ', qubit: 1, position: 3, angle: Math.PI/6 },
        { id: 'q9', type: 'CNOT', qubits: [0, 1], position: 4 },
      ]
    },
    {
      id: 'qft',
      name: 'Quantum Fourier Transform',
      category: 'transform',
      description: 'Quantum analogue of the discrete Fourier transform',
      difficulty: 'Intermediate',
      qubits: 3,
      complexity: 'O(n²)',
      useCase: 'Phase estimation, Shor\'s algorithm',
      icon: <Database className="w-5 h-5" />,
      gates: [
        { id: 'f1', type: 'H', qubit: 0, position: 0 },
        { id: 'f2', type: 'RZ', qubit: 1, position: 1, angle: Math.PI/2 },
        { id: 'f3', type: 'RZ', qubit: 2, position: 1, angle: Math.PI/4 },
        { id: 'f4', type: 'H', qubit: 1, position: 2 },
        { id: 'f5', type: 'RZ', qubit: 2, position: 3, angle: Math.PI/2 },
        { id: 'f6', type: 'H', qubit: 2, position: 4 },
      ]
    },
    {
      id: 'bell',
      name: 'Bell State Creation',
      category: 'entanglement',
      description: 'Creates maximally entangled two-qubit states',
      difficulty: 'Beginner',
      qubits: 2,
      complexity: 'O(1)',
      useCase: 'Quantum teleportation, superdense coding',
      icon: <Cpu className="w-5 h-5" />,
      gates: [
        { id: 'b1', type: 'H', qubit: 0, position: 0 },
        { id: 'b2', type: 'CNOT', qubits: [0, 1], position: 1 },
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Algorithms' },
    { id: 'search', name: 'Search' },
    { id: 'cryptography', name: 'Cryptography' },
    { id: 'optimization', name: 'Optimization' },
    { id: 'transform', name: 'Transform' },
    { id: 'entanglement', name: 'Entanglement' }
  ];

  const filteredTemplates = algorithmTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoadTemplate = (template: AlgorithmTemplate) => {
    onAlgorithmLoad(template.name, template.gates);
    toast.success('Template Loaded', { 
      description: `${template.name} circuit loaded successfully` 
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono text-quantum-glow">Algorithm Templates Library</h3>
          <p className="text-sm text-quantum-particle">
            Ready-to-use quantum algorithm implementations
          </p>
        </div>
        <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
          {filteredTemplates.length} Templates
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search algorithms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="quantum-panel neon-border"
          />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="quantum-tabs">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="quantum-panel neon-border hover:neon-glow transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.icon}
                  <CardTitle className="text-sm text-quantum-glow">{template.name}</CardTitle>
                </div>
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(template.difficulty)}
                >
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-quantum-particle">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Qubits:</span>
                  <div className="text-quantum-neon font-mono">{template.qubits}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Gates:</span>
                  <div className="text-quantum-neon font-mono">{template.gates.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Complexity:</span>
                  <div className="text-quantum-energy font-mono">{template.complexity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <div className="text-quantum-particle capitalize">{template.category}</div>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground">Use Case:</span>
                <div className="text-xs text-quantum-particle">{template.useCase}</div>
              </div>

              <Button
                onClick={() => handleLoadTemplate(template)}
                className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                size="sm"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Load Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-quantum-particle mb-4" />
          <h3 className="text-lg font-medium text-quantum-glow mb-2">No templates found</h3>
          <p className="text-quantum-particle">Try adjusting your search terms or category filter</p>
        </div>
      )}
    </div>
  );
}
