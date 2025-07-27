
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Zap, RotateCcw, Settings } from 'lucide-react';

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart: (e: React.TouchEvent, gateType: string) => void;
}

export function GatePalette({ onGateMouseDown, onGateTouchStart }: GatePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('basic');

  const gateCategories = {
    basic: {
      name: 'Basic Gates',
      gates: [
        { type: 'H', name: 'Hadamard', description: 'Creates superposition', color: 'bg-blue-500' },
        { type: 'X', name: 'Pauli-X', description: 'Bit flip', color: 'bg-red-500' },
        { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip', color: 'bg-green-500' },
        { type: 'Z', name: 'Pauli-Z', description: 'Phase flip', color: 'bg-purple-500' },
        { type: 'I', name: 'Identity', description: 'No operation', color: 'bg-gray-500' },
        { type: 'S', name: 'S Gate', description: 'Phase gate', color: 'bg-teal-500' },
        { type: 'T', name: 'T Gate', description: 'π/8 phase gate', color: 'bg-cyan-500' }
      ]
    },
    rotation: {
      name: 'Rotation Gates',
      gates: [
        { type: 'RX', name: 'Rotation-X', description: 'Rotation around X-axis', color: 'bg-pink-500' },
        { type: 'RY', name: 'Rotation-Y', description: 'Rotation around Y-axis', color: 'bg-yellow-500' },
        { type: 'RZ', name: 'Rotation-Z', description: 'Rotation around Z-axis', color: 'bg-indigo-500' },
        { type: 'U1', name: 'U1 Gate', description: 'Single parameter rotation', color: 'bg-orange-500' },
        { type: 'U2', name: 'U2 Gate', description: 'Two parameter rotation', color: 'bg-lime-500' },
        { type: 'U3', name: 'U3 Gate', description: 'Three parameter rotation', color: 'bg-rose-500' }
      ]
    },
    multi: {
      name: 'Multi-Qubit Gates',
      gates: [
        { type: 'CNOT', name: 'CNOT', description: 'Controlled-NOT', color: 'bg-orange-500' },
        { type: 'CZ', name: 'Controlled-Z', description: 'Controlled-Z', color: 'bg-amber-500' },
        { type: 'SWAP', name: 'SWAP', description: 'Swap qubits', color: 'bg-emerald-500' },
        { type: 'TOFFOLI', name: 'Toffoli', description: 'Controlled-CNOT', color: 'bg-violet-500' },
        { type: 'FREDKIN', name: 'Fredkin', description: 'Controlled-SWAP', color: 'bg-fuchsia-500' }
      ]
    },
    special: {
      name: 'Special Gates',
      gates: [
        { type: 'BELL', name: 'Bell State', description: 'Entangled pair', color: 'bg-blue-600' },
        { type: 'GHZ', name: 'GHZ State', description: 'Three-qubit entanglement', color: 'bg-purple-600' },
        { type: 'QFT', name: 'QFT', description: 'Quantum Fourier Transform', color: 'bg-green-600' },
        { type: 'M', name: 'Measure', description: 'Measurement', color: 'bg-red-600' }
      ]
    }
  };

  const filteredGates = Object.entries(gateCategories).reduce((acc, [key, category]) => {
    const filtered = category.gates.filter(gate => 
      gate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gate.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[key] = { ...category, gates: filtered };
    }
    return acc;
  }, {} as typeof gateCategories);

  const renderGate = (gate: any) => (
    <div
      key={gate.type}
      className={`relative w-full h-16 ${gate.color} rounded-lg flex flex-col items-center justify-center cursor-move hover:scale-105 transition-transform group`}
      onMouseDown={(e) => onGateMouseDown(e, gate.type)}
      onTouchStart={(e) => onGateTouchStart(e, gate.type)}
    >
      <div className="text-white font-bold text-sm">{gate.type}</div>
      <div className="text-white text-xs opacity-80">{gate.name}</div>
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
        {gate.description}
      </div>
    </div>
  );

  return (
    <Card className="quantum-panel neon-border h-fit">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Gate Palette
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quantum-particle w-4 h-4" />
          <Input
            type="text"
            placeholder="Search gates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 quantum-input"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 quantum-tabs">
            <TabsTrigger value="basic" className="quantum-tab">Basic</TabsTrigger>
            <TabsTrigger value="rotation" className="quantum-tab">Rotation</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-2 quantum-tabs">
            <TabsTrigger value="multi" className="quantum-tab">Multi-Qubit</TabsTrigger>
            <TabsTrigger value="special" className="quantum-tab">Special</TabsTrigger>
          </TabsList>

          {Object.entries(filteredGates).map(([key, category]) => (
            <TabsContent key={key} value={key} className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {category.gates.map(renderGate)}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-6 pt-4 border-t border-quantum-neon/20">
          <div className="text-sm text-quantum-particle mb-2">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="neon-border"
              onClick={() => {
                // Create Bell state template
                const bellGates = [
                  { type: 'H', qubit: 0 },
                  { type: 'CNOT', qubits: [0, 1] }
                ];
                console.log('Bell state template:', bellGates);
              }}
            >
              Bell State
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="neon-border"
              onClick={() => {
                // Create superposition template
                const superpositionGates = [
                  { type: 'H', qubit: 0 },
                  { type: 'H', qubit: 1 },
                  { type: 'H', qubit: 2 }
                ];
                console.log('Superposition template:', superpositionGates);
              }}
            >
              Superposition
            </Button>
          </div>
        </div>

        {/* Gate Statistics */}
        <div className="mt-4 pt-4 border-t border-quantum-neon/20">
          <div className="text-sm text-quantum-particle mb-2">Available Gates</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Basic:</span>
              <Badge variant="outline" className="neon-border">
                {gateCategories.basic.gates.length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Rotation:</span>
              <Badge variant="outline" className="neon-border">
                {gateCategories.rotation.gates.length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Multi-Qubit:</span>
              <Badge variant="outline" className="neon-border">
                {gateCategories.multi.gates.length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Special:</span>
              <Badge variant="outline" className="neon-border">
                {gateCategories.special.gates.length}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
