
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, RotateCcw, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantumGatePaletteProps {
  onGateSelect: (gateType: string) => void;
  selectedGate: string | null;
}

const gateCategories = [
  {
    name: 'Single Qubit',
    gates: [
      { type: 'H', name: 'Hadamard', description: 'Creates superposition', color: 'bg-quantum-glow', icon: '⌘' },
      { type: 'X', name: 'Pauli-X', description: 'Bit flip gate', color: 'bg-quantum-neon', icon: '✕' },
      { type: 'Y', name: 'Pauli-Y', description: 'Bit and phase flip', color: 'bg-quantum-particle', icon: '⟡' },
      { type: 'Z', name: 'Pauli-Z', description: 'Phase flip gate', color: 'bg-quantum-energy', icon: '⟢' },
      { type: 'S', name: 'S Gate', description: 'Phase gate', color: 'bg-blue-500', icon: 'S' },
      { type: 'T', name: 'T Gate', description: 'π/8 gate', color: 'bg-purple-500', icon: 'T' },
    ]
  },
  {
    name: 'Rotation Gates',
    gates: [
      { type: 'RX', name: 'Rotation-X', description: 'Rotation around X-axis', color: 'bg-red-500', icon: '↻' },
      { type: 'RY', name: 'Rotation-Y', description: 'Rotation around Y-axis', color: 'bg-green-500', icon: '↺' },
      { type: 'RZ', name: 'Rotation-Z', description: 'Rotation around Z-axis', color: 'bg-blue-500', icon: '⟲' },
    ]
  },
  {
    name: 'Multi Qubit',
    gates: [
      { type: 'CNOT', name: 'CNOT', description: 'Controlled-X gate', color: 'bg-quantum-plasma', icon: '⊕' },
      { type: 'CZ', name: 'Controlled-Z', description: 'Controlled-Z gate', color: 'bg-orange-500', icon: '⊙' },
      { type: 'SWAP', name: 'SWAP', description: 'Swap two qubits', color: 'bg-cyan-500', icon: '⇄' },
    ]
  },
  {
    name: 'Measurement',
    gates: [
      { type: 'M', name: 'Measure', description: 'Measurement gate', color: 'bg-destructive', icon: '⚡' },
    ]
  }
];

export function QuantumGatePalette({ onGateSelect, selectedGate }: QuantumGatePaletteProps) {
  const handleGateClick = (gateType: string) => {
    onGateSelect(gateType);
  };

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Gate Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {gateCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-sm font-semibold text-quantum-particle mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {category.gates.map((gate) => (
                <div
                  key={gate.type}
                  className={cn(
                    "group cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 hover:scale-105 active:scale-95",
                    selectedGate === gate.type 
                      ? "border-quantum-glow bg-quantum-glow/10 shadow-lg" 
                      : "border-quantum-matrix hover:border-quantum-glow/50 bg-quantum-matrix/20"
                  )}
                  onClick={() => handleGateClick(gate.type)}
                  title={`${gate.name}: ${gate.description}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded border-2 border-current flex items-center justify-center text-xs font-bold text-black transition-colors",
                      gate.color
                    )}>
                      {gate.type}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-mono text-quantum-glow">
                        {gate.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {gate.description}
                      </div>
                    </div>
                  </div>
                  
                  {selectedGate === gate.type && (
                    <Badge className="absolute -top-1 -right-1 bg-quantum-glow text-black text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-quantum-matrix">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <RotateCcw className="w-3 h-3" />
            Click a gate to select, then click on the circuit to place it
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
