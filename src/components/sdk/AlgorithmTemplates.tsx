
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Search, Filter } from 'lucide-react';

interface AlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  gates: any[];
  parameters?: any[];
}

const templates: AlgorithmTemplate[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    description: 'Creates maximally entangled two-qubit states',
    category: 'Entanglement',
    difficulty: 'Beginner',
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: 1 }
    ]
  },
  {
    id: 'grovers-2bit',
    name: 'Grover\'s 2-Bit Search',
    description: 'Quantum search algorithm for 2-qubit systems',
    category: 'Search',
    difficulty: 'Intermediate',
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'h2', type: 'H', qubit: 1, position: 1 },
      { id: 'oracle', type: 'Z', qubit: 1, position: 2 },
      { id: 'h3', type: 'H', qubit: 0, position: 3 },
      { id: 'h4', type: 'H', qubit: 1, position: 4 }
    ]
  },
  {
    id: 'qft-3bit',
    name: 'Quantum Fourier Transform (3-bit)',
    description: 'QFT implementation for 3-qubit systems',
    category: 'Transform',
    difficulty: 'Advanced',
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'rz1', type: 'RZ', qubit: 1, angle: Math.PI/2, position: 1 },
      { id: 'rz2', type: 'RZ', qubit: 2, angle: Math.PI/4, position: 2 },
      { id: 'h2', type: 'H', qubit: 1, position: 3 },
      { id: 'rz3', type: 'RZ', qubit: 2, angle: Math.PI/2, position: 4 },
      { id: 'h3', type: 'H', qubit: 2, position: 5 }
    ]
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    description: 'Determines if a function is constant or balanced',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    gates: [
      { id: 'x1', type: 'X', qubit: 1, position: 0 },
      { id: 'h1', type: 'H', qubit: 0, position: 1 },
      { id: 'h2', type: 'H', qubit: 1, position: 2 },
      { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: 3 },
      { id: 'h3', type: 'H', qubit: 0, position: 4 }
    ]
  },
  {
    id: 'superdense-coding',
    name: 'Superdense Coding',
    description: 'Send 2 classical bits using 1 qubit',
    category: 'Communication',
    difficulty: 'Beginner',
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: 1 },
      { id: 'x1', type: 'X', qubit: 0, position: 2 },
      { id: 'z1', type: 'Z', qubit: 0, position: 3 }
    ]
  },
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    description: 'Teleport a qubit state using entanglement',
    category: 'Communication',
    difficulty: 'Advanced',
    gates: [
      { id: 'h1', type: 'H', qubit: 1, position: 0 },
      { id: 'cnot1', type: 'CNOT', qubits: [1, 2], position: 1 },
      { id: 'cnot2', type: 'CNOT', qubits: [0, 1], position: 2 },
      { id: 'h2', type: 'H', qubit: 0, position: 3 }
    ]
  }
];

interface AlgorithmTemplatesProps {
  onTemplateLoad: (template: AlgorithmTemplate) => void;
}

export function AlgorithmTemplates({ onTemplateLoad }: AlgorithmTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', ...new Set(templates.map(t => t.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-quantum-glow">Algorithm Templates</h2>
        <Badge variant="outline">
          {filteredTemplates.length} Templates
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-neon flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="text-quantum-particle">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-quantum-particle" />
                <Input
                  id="search"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-quantum-void border-quantum-matrix"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category" className="text-quantum-particle">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-quantum-void border border-quantum-matrix rounded text-quantum-glow"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="difficulty" className="text-quantum-particle">Difficulty</Label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 bg-quantum-void border border-quantum-matrix rounded text-quantum-glow"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card 
            key={template.id} 
            className="quantum-panel cursor-pointer transition-all duration-300 hover:scale-105 hover:neon-border"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-neon font-mono text-sm">
                  {template.name}
                </CardTitle>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-quantum-particle">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                <span className="text-xs text-quantum-energy">
                  {template.gates.length} gates
                </span>
              </div>
              
              <Button 
                onClick={() => onTemplateLoad(template)}
                className="w-full neon-border"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Load Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="quantum-panel neon-border">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-quantum-particle mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-quantum-glow mb-2">
              No Templates Found
            </h3>
            <p className="text-quantum-particle">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
