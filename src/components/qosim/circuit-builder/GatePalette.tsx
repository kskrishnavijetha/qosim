
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumGate } from '@/hooks/useCircuitBuilder';
import { Zap, RotateCw, Shuffle, Link, Box } from 'lucide-react';

interface GatePaletteProps {
  onGateSelect: (gate: Omit<QuantumGate, 'id'>) => void;
}

export function GatePalette({ onGateSelect }: GatePaletteProps) {
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(Math.PI / 2);

  const singleQubitGates = [
    { type: 'H', name: 'Hadamard', description: 'Creates superposition', icon: '⊞' },
    { type: 'X', name: 'Pauli-X', description: 'Bit flip', icon: '⊗' },
    { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip', icon: '⊙' },
    { type: 'Z', name: 'Pauli-Z', description: 'Phase flip', icon: '⊘' },
    { type: 'T', name: 'T Gate', description: 'π/4 phase', icon: 'T' },
    { type: 'S', name: 'S Gate', description: 'π/2 phase', icon: 'S' },
    { type: 'I', name: 'Identity', description: 'No operation', icon: 'I' }
  ];

  const rotationGates = [
    { type: 'RX', name: 'Rotation-X', description: 'Rotation around X-axis', icon: '↻' },
    { type: 'RY', name: 'Rotation-Y', description: 'Rotation around Y-axis', icon: '↻' },
    { type: 'RZ', name: 'Rotation-Z', description: 'Rotation around Z-axis', icon: '↻' },
    { type: 'U1', name: 'U1 Gate', description: 'Single parameter', icon: 'U₁' },
    { type: 'U2', name: 'U2 Gate', description: 'Two parameters', icon: 'U₂' },
    { type: 'U3', name: 'U3 Gate', description: 'Three parameters', icon: 'U₃' }
  ];

  const multiQubitGates = [
    { type: 'CNOT', name: 'CNOT', description: 'Controlled-NOT', icon: '⊕', qubits: 2 },
    { type: 'CZ', name: 'CZ', description: 'Controlled-Z', icon: '⊘', qubits: 2 },
    { type: 'SWAP', name: 'SWAP', description: 'Swap qubits', icon: '⇄', qubits: 2 },
    { type: 'TOFFOLI', name: 'Toffoli', description: 'Controlled-CNOT', icon: '⊕⊕', qubits: 3 },
    { type: 'FREDKIN', name: 'Fredkin', description: 'Controlled-SWAP', icon: '⇄⇄', qubits: 3 }
  ];

  const compositeGates = [
    { type: 'BELL', name: 'Bell State', description: 'Entangled pair', icon: '🔗' },
    { type: 'GHZ', name: 'GHZ State', description: 'Tripartite entanglement', icon: '🔗³' },
    { type: 'W', name: 'W State', description: 'Symmetric superposition', icon: 'W' },
    { type: 'QFT', name: 'QFT', description: 'Quantum Fourier Transform', icon: 'ℱ' },
    { type: 'IQFT', name: 'Inverse QFT', description: 'Inverse QFT', icon: 'ℱ⁻¹' }
  ];

  const handleGateClick = (gateType: string, requiredQubits: number = 1) => {
    let qubits: number[];
    
    if (requiredQubits === 1) {
      qubits = [selectedQubit];
    } else if (requiredQubits === 2) {
      qubits = [selectedQubit, Math.min(selectedQubit + 1, 4)];
    } else {
      qubits = [selectedQubit, Math.min(selectedQubit + 1, 4), Math.min(selectedQubit + 2, 4)];
    }

    const gate: Omit<QuantumGate, 'id'> = {
      type: gateType,
      qubits,
      layer: selectedLayer,
      position: { x: 60 + selectedLayer * 100, y: 60 + selectedQubit * 80 },
      angle: rotationGates.some(g => g.type === gateType) ? rotationAngle : undefined
    };

    onGateSelect(gate);
  };

  const GateButton = ({ gate, requiredQubits = 1 }: { gate: any; requiredQubits?: number }) => (
    <Button
      variant="outline"
      className="w-full h-16 flex flex-col items-center gap-1 hover:bg-primary/10 transition-colors"
      onClick={() => handleGateClick(gate.type, requiredQubits)}
    >
      <span className="text-lg font-mono">{gate.icon}</span>
      <span className="text-xs">{gate.type}</span>
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Gate Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Gate Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Qubit</Label>
              <Input
                type="number"
                value={selectedQubit}
                onChange={(e) => setSelectedQubit(parseInt(e.target.value) || 0)}
                min={0}
                max={4}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Layer</Label>
              <Input
                type="number"
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(parseInt(e.target.value) || 0)}
                min={0}
                className="h-8"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs">Rotation Angle</Label>
            <Input
              type="number"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(parseFloat(e.target.value) || 0)}
              step={0.1}
              className="h-8"
            />
            <div className="flex gap-1 mt-1">
              {[Math.PI/4, Math.PI/2, Math.PI, 2*Math.PI].map(angle => (
                <Button
                  key={angle}
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 h-6"
                  onClick={() => setRotationAngle(angle)}
                >
                  {angle === Math.PI/4 ? 'π/4' : angle === Math.PI/2 ? 'π/2' : angle === Math.PI ? 'π' : '2π'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gate Categories */}
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single" className="text-xs">Single</TabsTrigger>
          <TabsTrigger value="rotation" className="text-xs">Rotation</TabsTrigger>
          <TabsTrigger value="multi" className="text-xs">Multi</TabsTrigger>
          <TabsTrigger value="composite" className="text-xs">Composite</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {singleQubitGates.map(gate => (
              <GateButton key={gate.type} gate={gate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rotation" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {rotationGates.map(gate => (
              <GateButton key={gate.type} gate={gate} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="multi" className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {multiQubitGates.map(gate => (
              <GateButton key={gate.type} gate={gate} requiredQubits={gate.qubits} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="composite" className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {compositeGates.map(gate => (
              <GateButton key={gate.type} gate={gate} requiredQubits={gate.type === 'BELL' ? 2 : 3} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleGateClick('H')}
          >
            <Box className="w-4 h-4 mr-2" />
            Add Hadamard
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleGateClick('CNOT', 2)}
          >
            <Link className="w-4 h-4 mr-2" />
            Add CNOT
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={() => handleGateClick('BELL', 2)}
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Create Bell State
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
