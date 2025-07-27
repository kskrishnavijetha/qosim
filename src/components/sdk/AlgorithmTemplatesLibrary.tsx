
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Gate } from '@/hooks/useCircuitState';
import { 
  Search, 
  BookOpen, 
  Zap, 
  Shield, 
  Shuffle, 
  Target,
  Calculator,
  Atom,
  Network,
  Brain
} from 'lucide-react';

interface AlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Basic' | 'Search' | 'Arithmetic' | 'Simulation' | 'Optimization' | 'Error Correction';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: Gate[];
  icon: React.ReactNode;
  tags: string[];
}

interface AlgorithmTemplatesLibraryProps {
  onAlgorithmLoad: (algorithmName: string, gates: Gate[]) => void;
  currentCircuit: Gate[];
}

export function AlgorithmTemplatesLibrary({ onAlgorithmLoad, currentCircuit }: AlgorithmTemplatesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<AlgorithmTemplate | null>(null);

  const algorithmTemplates: AlgorithmTemplate[] = [
    {
      id: 'bell-state',
      name: 'Bell State',
      description: 'Create maximally entangled two-qubit states',
      category: 'Basic',
      difficulty: 'Beginner',
      qubits: 2,
      icon: <Network className="w-4 h-4" />,
      tags: ['entanglement', 'basic', 'two-qubit'],
      gates: [
        { id: 'h1', type: 'H', qubit: 0, position: 0 },
        { id: 'cx1', type: 'CNOT', qubits: [0, 1], position: 1 }
      ]
    },
    {
      id: 'grovers-search',
      name: "Grover's Search",
      description: 'Quantum search algorithm for unsorted databases',
      category: 'Search',
      difficulty: 'Intermediate',
      qubits: 3,
      icon: <Search className="w-4 h-4" />,
      tags: ['search', 'amplitude amplification', 'oracle'],
      gates: [
        { id: 'h1', type: 'H', qubit: 0, position: 0 },
        { id: 'h2', type: 'H', qubit: 1, position: 0 },
        { id: 'h3', type: 'H', qubit: 2, position: 0 },
        { id: 'oracle', type: 'Z', qubit: 2, position: 1 },
        { id: 'diff1', type: 'H', qubit: 0, position: 2 },
        { id: 'diff2', type: 'H', qubit: 1, position: 2 }
      ]
    },
    {
      id: 'qft',
      name: 'Quantum Fourier Transform',
      description: 'Quantum analogue of the discrete Fourier transform',
      category: 'Arithmetic',
      difficulty: 'Advanced',
      qubits: 3,
      icon: <Calculator className="w-4 h-4" />,
      tags: ['fourier', 'transform', 'arithmetic'],
      gates: [
        { id: 'h1', type: 'H', qubit: 0, position: 0 },
        { id: 'rz1', type: 'RZ', qubit: 1, position: 1, angle: Math.PI/2 },
        { id: 'h2', type: 'H', qubit: 1, position: 2 },
        { id: 'rz2', type: 'RZ', qubit: 2, position: 3, angle: Math.PI/4 },
        { id: 'h3', type: 'H', qubit: 2, position: 4 }
      ]
    },
    {
      id: 'vqe',
      name: 'Variational Quantum Eigensolver',
      description: 'Hybrid quantum-classical algorithm for finding ground states',
      category: 'Optimization',
      difficulty: 'Advanced',
      qubits: 4,
      icon: <Brain className="w-4 h-4" />,
      tags: ['variational', 'optimization', 'ansatz'],
      gates: [
        { id: 'ry1', type: 'RY', qubit: 0, position: 0, angle: Math.PI/4 },
        { id: 'ry2', type: 'RY', qubit: 1, position: 0, angle: Math.PI/3 },
        { id: 'cx1', type: 'CNOT', qubits: [0, 1], position: 1 },
        { id: 'ry3', type: 'RY', qubit: 2, position: 2, angle: Math.PI/6 },
        { id: 'cx2', type: 'CNOT', qubits: [1, 2], position: 3 }
      ]
    },
    {
      id: 'three-qubit-error',
      name: 'Three-Qubit Error Correction',
      description: 'Simple quantum error correction code',
      category: 'Error Correction',
      difficulty: 'Intermediate',
      qubits: 3,
      icon: <Shield className="w-4 h-4" />,
      tags: ['error correction', 'encoding', 'syndrome'],
      gates: [
        { id: 'cx1', type: 'CNOT', qubits: [0, 1], position: 0 },
        { id: 'cx2', type: 'CNOT', qubits: [0, 2], position: 1 },
        { id: 'x_error', type: 'X', qubit: 1, position: 2 },
        { id: 'cx3', type: 'CNOT', qubits: [0, 1], position: 3 },
        { id: 'cx4', type: 'CNOT', qubits: [0, 2], position: 4 }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Basic', name: 'Basic Circuits', icon: <Atom className="w-4 h-4" /> },
    { id: 'Search', name: 'Search Algorithms', icon: <Search className="w-4 h-4" /> },
    { id: 'Arithmetic', name: 'Arithmetic', icon: <Calculator className="w-4 h-4" /> },
    { id: 'Optimization', name: 'Optimization', icon: <Target className="w-4 h-4" /> },
    { id: 'Error Correction', name: 'Error Correction', icon: <Shield className="w-4 h-4" /> }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? algorithmTemplates
    : algorithmTemplates.filter(template => template.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Selection */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow">Algorithm Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <Card className="quantum-panel neon-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow">
            Available Templates ({filteredTemplates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="p-4 border border-quantum-matrix rounded-lg bg-quantum-void/50 hover:bg-quantum-matrix/20 transition-colors cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {template.icon}
                    <h3 className="font-semibold text-quantum-neon">{template.name}</h3>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getDifficultyColor(template.difficulty)} text-white`}
                  >
                    {template.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-quantum-particle">
                    <span>{template.qubits} qubits</span>
                    <span>{template.gates.length} gates</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAlgorithmLoad(template.name, template.gates);
                    }}
                  >
                    Load
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Details */}
      {selectedTemplate && (
        <Card className="quantum-panel neon-border lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow flex items-center">
              {selectedTemplate.icon}
              <span className="ml-2">{selectedTemplate.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground mb-4">{selectedTemplate.description}</p>
                
                <h4 className="font-semibold mb-2">Properties</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Qubits:</span>
                    <span className="text-quantum-neon">{selectedTemplate.qubits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gates:</span>
                    <span className="text-quantum-neon">{selectedTemplate.gates.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge className={`${getDifficultyColor(selectedTemplate.difficulty)} text-white`}>
                      {selectedTemplate.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Circuit Structure</h4>
                <div className="bg-quantum-matrix rounded-lg p-4 max-h-40 overflow-y-auto">
                  {selectedTemplate.gates.map((gate, index) => (
                    <div key={gate.id} className="flex items-center justify-between py-1 text-sm">
                      <span className="text-quantum-neon">{gate.type}</span>
                      <span className="text-quantum-particle">
                        {gate.qubit !== undefined ? `q${gate.qubit}` : 
                         gate.qubits ? `q${gate.qubits.join(',q')}` : ''}
                      </span>
                      <span className="text-muted-foreground">t={gate.position}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-4"
                  onClick={() => onAlgorithmLoad(selectedTemplate.name, selectedTemplate.gates)}
                >
                  Load {selectedTemplate.name} Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
