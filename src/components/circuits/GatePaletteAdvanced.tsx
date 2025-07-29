
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CircuitGate } from '@/hooks/useCircuitBuilder';
import { Plus, Zap, RotateCcw } from 'lucide-react';

interface GatePaletteAdvancedProps {
  onGateSelect: (gateType: string, qubits: string[], position: { x: number; y: number }) => void;
  onQubitAdd: () => void;
  selectedGate: CircuitGate | null;
}

const singleQubitGates = [
  { type: 'I', name: 'Identity', color: '#95A5A6', description: 'Identity gate' },
  { type: 'H', name: 'Hadamard', color: '#FFD700', description: 'Creates superposition' },
  { type: 'X', name: 'Pauli-X', color: '#FF6B6B', description: 'Bit flip gate' },
  { type: 'Y', name: 'Pauli-Y', color: '#4ECDC4', description: 'Bit and phase flip' },
  { type: 'Z', name: 'Pauli-Z', color: '#45B7D1', description: 'Phase flip gate' },
  { type: 'S', name: 'S Gate', color: '#F7DC6F', description: 'Phase gate (π/2)' },
  { type: 'T', name: 'T Gate', color: '#BB8FCE', description: 'T gate (π/4)' },
  { type: 'S†', name: 'S Dagger', color: '#F39C12', description: 'S conjugate' },
  { type: 'T†', name: 'T Dagger', color: '#8E44AD', description: 'T conjugate' }
];

const parametricGates = [
  { type: 'RX', name: 'Rotation X', color: '#FFEAA7', description: 'X-axis rotation' },
  { type: 'RY', name: 'Rotation Y', color: '#DDA0DD', description: 'Y-axis rotation' },
  { type: 'RZ', name: 'Rotation Z', color: '#98D8C8', description: 'Z-axis rotation' },
  { type: 'U1', name: 'U1 Gate', color: '#AED6F1', description: 'Single parameter' },
  { type: 'U2', name: 'U2 Gate', color: '#F8D7DA', description: 'Two parameters' },
  { type: 'U3', name: 'U3 Gate', color: '#D4EDDA', description: 'Three parameters' }
];

const multiQubitGates = [
  { type: 'CNOT', name: 'CNOT', color: '#96CEB4', description: 'Controlled NOT' },
  { type: 'CZ', name: 'CZ', color: '#FF7675', description: 'Controlled Z' },
  { type: 'SWAP', name: 'SWAP', color: '#85C1E9', description: 'Swap qubits' },
  { type: 'TOFFOLI', name: 'Toffoli', color: '#F8C471', description: 'Controlled-controlled NOT' },
  { type: 'FREDKIN', name: 'Fredkin', color: '#D7BDE2', description: 'Controlled SWAP' },
  { type: 'CRX', name: 'CRX', color: '#FAD7A0', description: 'Controlled RX' },
  { type: 'CRY', name: 'CRY', color: '#A9DFBF', description: 'Controlled RY' },
  { type: 'CRZ', name: 'CRZ', color: '#AED6F1', description: 'Controlled RZ' }
];

const measurementGates = [
  { type: 'M', name: 'Measure', color: '#E74C3C', description: 'Measurement' },
  { type: 'BARRIER', name: 'Barrier', color: '#BDC3C7', description: 'Circuit barrier' },
  { type: 'RESET', name: 'Reset', color: '#E67E22', description: 'Reset qubit' }
];

export function GatePaletteAdvanced({ onGateSelect, onQubitAdd, selectedGate }: GatePaletteAdvancedProps) {
  const [customAngle, setCustomAngle] = useState(Math.PI / 4);
  const [selectedQubits, setSelectedQubits] = useState<string[]>([]);

  const handleGateClick = (gateType: string) => {
    // For now, place gates at default position - canvas will handle positioning
    onGateSelect(gateType, selectedQubits, { x: 200, y: 100 });
  };

  const renderGateGrid = (gates: typeof singleQubitGates) => {
    return (
      <div className="grid grid-cols-3 gap-2">
        {gates.map((gate) => (
          <Button
            key={gate.type}
            variant="outline"
            className="h-16 flex flex-col items-center justify-center p-2"
            onClick={() => handleGateClick(gate.type)}
            style={{ backgroundColor: gate.color + '20' }}
          >
            <div className="text-xs font-bold mb-1">{gate.type}</div>
            <div className="text-xs text-muted-foreground">{gate.name}</div>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Circuit Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onQubitAdd}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Qubit
          </Button>
          
          {selectedGate && (
            <div className="p-2 bg-muted rounded">
              <div className="text-xs font-semibold mb-1">Selected Gate</div>
              <Badge variant="secondary">{selectedGate.type}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="single">Single</TabsTrigger>
          <TabsTrigger value="parametric">Param</TabsTrigger>
          <TabsTrigger value="multi">Multi</TabsTrigger>
          <TabsTrigger value="measure">Measure</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Single-Qubit Gates</CardTitle>
            </CardHeader>
            <CardContent>
              {renderGateGrid(singleQubitGates)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parametric" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Parametric Gates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="angle">Rotation Angle</Label>
                <Input
                  id="angle"
                  type="number"
                  value={customAngle}
                  onChange={(e) => setCustomAngle(parseFloat(e.target.value))}
                  step="0.1"
                  min="0"
                  max={2 * Math.PI}
                />
                <div className="text-xs text-muted-foreground">
                  {(customAngle * 180 / Math.PI).toFixed(1)}°
                </div>
              </div>
              
              {renderGateGrid(parametricGates)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="multi" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Multi-Qubit Gates</CardTitle>
            </CardHeader>
            <CardContent>
              {renderGateGrid(multiQubitGates)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="measure" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Measurement & Control</CardTitle>
            </CardHeader>
            <CardContent>
              {renderGateGrid(measurementGates)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleGateClick('H')}
          >
            <Zap className="w-4 h-4 mr-1" />
            Add Hadamard
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleGateClick('CNOT')}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Add CNOT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
