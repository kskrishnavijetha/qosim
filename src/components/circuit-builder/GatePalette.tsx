
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GatePaletteProps {
  onGateSelect: (gateType: string, position: { x: number; y: number }) => void;
}

interface GateDefinition {
  type: string;
  name: string;
  description: string;
  category: 'single' | 'multi' | 'rotation' | 'measurement' | 'special';
  qubits: number;
  parameters?: string[];
  matrix?: string;
  color: string;
}

const gateDefinitions: GateDefinition[] = [
  // Single-qubit gates
  {
    type: 'H',
    name: 'Hadamard',
    description: 'Creates superposition - transforms |0⟩ to (|0⟩ + |1⟩)/√2',
    category: 'single',
    qubits: 1,
    matrix: '1/√2 * [[1, 1], [1, -1]]',
    color: 'bg-blue-500'
  },
  {
    type: 'X',
    name: 'Pauli-X',
    description: 'Bit flip gate - transforms |0⟩ ↔ |1⟩',
    category: 'single',
    qubits: 1,
    matrix: '[[0, 1], [1, 0]]',
    color: 'bg-red-500'
  },
  {
    type: 'Y',
    name: 'Pauli-Y',
    description: 'Y rotation gate - bit and phase flip',
    category: 'single',
    qubits: 1,
    matrix: '[[0, -i], [i, 0]]',
    color: 'bg-green-500'
  },
  {
    type: 'Z',
    name: 'Pauli-Z',
    description: 'Phase flip gate - applies -1 phase to |1⟩',
    category: 'single',
    qubits: 1,
    matrix: '[[1, 0], [0, -1]]',
    color: 'bg-purple-500'
  },
  {
    type: 'S',
    name: 'Phase S',
    description: 'Phase gate - applies i phase to |1⟩ (π/2)',
    category: 'single',
    qubits: 1,
    matrix: '[[1, 0], [0, i]]',
    color: 'bg-cyan-500'
  },
  {
    type: 'T',
    name: 'T Gate',
    description: 'T gate - applies e^(iπ/4) phase to |1⟩',
    category: 'single',
    qubits: 1,
    matrix: '[[1, 0], [0, e^(iπ/4)]]',
    color: 'bg-orange-500'
  },
  {
    type: 'I',
    name: 'Identity',
    description: 'Identity gate - no change to qubit state',
    category: 'single',
    qubits: 1,
    matrix: '[[1, 0], [0, 1]]',
    color: 'bg-gray-500'
  },
  
  // Multi-qubit gates
  {
    type: 'CNOT',
    name: 'CNOT',
    description: 'Controlled NOT - flips target if control is |1⟩',
    category: 'multi',
    qubits: 2,
    color: 'bg-indigo-500'
  },
  {
    type: 'CZ',
    name: 'Controlled-Z',
    description: 'Controlled Z - applies Z to target if control is |1⟩',
    category: 'multi',
    qubits: 2,
    color: 'bg-pink-500'
  },
  {
    type: 'SWAP',
    name: 'SWAP',
    description: 'Swaps states of two qubits',
    category: 'multi',
    qubits: 2,
    color: 'bg-teal-500'
  },
  {
    type: 'TOFFOLI',
    name: 'Toffoli',
    description: 'Controlled-Controlled-NOT (CCX) gate',
    category: 'multi',
    qubits: 3,
    color: 'bg-amber-500'
  },
  {
    type: 'FREDKIN',
    name: 'Fredkin',
    description: 'Controlled-SWAP (CSWAP) gate',
    category: 'multi',
    qubits: 3,
    color: 'bg-emerald-500'
  },
  
  // Rotation gates
  {
    type: 'RX',
    name: 'Rotation-X',
    description: 'Rotation around X-axis by angle θ',
    category: 'rotation',
    qubits: 1,
    parameters: ['θ'],
    color: 'bg-red-400'
  },
  {
    type: 'RY',
    name: 'Rotation-Y',
    description: 'Rotation around Y-axis by angle θ',
    category: 'rotation',
    qubits: 1,
    parameters: ['θ'],
    color: 'bg-green-400'
  },
  {
    type: 'RZ',
    name: 'Rotation-Z',
    description: 'Rotation around Z-axis by angle θ',
    category: 'rotation',
    qubits: 1,
    parameters: ['θ'],
    color: 'bg-blue-400'
  },
  {
    type: 'U1',
    name: 'U1 Gate',
    description: 'Single-parameter unitary gate',
    category: 'rotation',
    qubits: 1,
    parameters: ['λ'],
    color: 'bg-violet-400'
  },
  {
    type: 'U2',
    name: 'U2 Gate',
    description: 'Two-parameter unitary gate',
    category: 'rotation',
    qubits: 1,
    parameters: ['φ', 'λ'],
    color: 'bg-indigo-400'
  },
  {
    type: 'U3',
    name: 'U3 Gate',
    description: 'Three-parameter unitary gate',
    category: 'rotation',
    qubits: 1,
    parameters: ['θ', 'φ', 'λ'],
    color: 'bg-purple-400'
  },
  
  // Measurement
  {
    type: 'MEASURE',
    name: 'Measurement',
    description: 'Measurement gate - collapses superposition',
    category: 'measurement',
    qubits: 1,
    color: 'bg-red-600'
  },
  {
    type: 'RESET',
    name: 'Reset',
    description: 'Reset qubit to |0⟩ state',
    category: 'measurement',
    qubits: 1,
    color: 'bg-gray-600'
  },
  
  // Special gates
  {
    type: 'BARRIER',
    name: 'Barrier',
    description: 'Circuit barrier - prevents optimization across',
    category: 'special',
    qubits: 0,
    color: 'bg-yellow-500'
  },
  {
    type: 'QFT',
    name: 'Quantum Fourier Transform',
    description: 'Quantum Fourier Transform for n qubits',
    category: 'special',
    qubits: 3,
    color: 'bg-slate-500'
  }
];

export function GatePalette({ onGateSelect }: GatePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGates = gateDefinitions.filter(gate => {
    const matchesSearch = gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gate.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gate.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || gate.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Gates', count: gateDefinitions.length },
    { id: 'single', name: 'Single Qubit', count: gateDefinitions.filter(g => g.category === 'single').length },
    { id: 'multi', name: 'Multi Qubit', count: gateDefinitions.filter(g => g.category === 'multi').length },
    { id: 'rotation', name: 'Rotation', count: gateDefinitions.filter(g => g.category === 'rotation').length },
    { id: 'measurement', name: 'Measurement', count: gateDefinitions.filter(g => g.category === 'measurement').length },
    { id: 'special', name: 'Special', count: gateDefinitions.filter(g => g.category === 'special').length }
  ];

  const handleDragStart = (e: React.DragEvent, gate: GateDefinition) => {
    e.dataTransfer.setData('gate-type', gate.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleGateClick = (gate: GateDefinition) => {
    onGateSelect(gate.type, { x: 0, y: 0 });
  };

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            Gate Palette
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search gates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="single">Single</TabsTrigger>
              <TabsTrigger value="multi">Multi</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </Tabs>
          
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid grid-cols-2 gap-2">
              {filteredGates.map((gate) => (
                <Tooltip key={gate.type}>
                  <TooltipTrigger asChild>
                    <div
                      className={`${gate.color} text-white p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, gate)}
                      onClick={() => handleGateClick(gate)}
                    >
                      <div className="font-bold text-sm">{gate.type}</div>
                      <div className="text-xs opacity-90">{gate.name}</div>
                      <div className="text-xs mt-1">
                        {gate.qubits > 0 && `${gate.qubits}Q`}
                        {gate.parameters && ` (${gate.parameters.join(', ')})`}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-2">
                      <div className="font-semibold">{gate.name}</div>
                      <div className="text-sm">{gate.description}</div>
                      {gate.matrix && (
                        <div className="text-xs font-mono bg-muted p-1 rounded">
                          {gate.matrix}
                        </div>
                      )}
                      <div className="text-xs">
                        <Badge variant="outline">{gate.category}</Badge>
                        {gate.qubits > 0 && (
                          <Badge variant="outline" className="ml-1">
                            {gate.qubits} qubit{gate.qubits > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
