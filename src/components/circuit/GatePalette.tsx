
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GateType {
  id: string;
  name: string;
  symbol: string;
  category: 'single' | 'multi' | 'parametric' | 'measurement';
  description: string;
  color: string;
}

interface GatePaletteProps {
  onGateSelect: (gateType: string, qubit: number, position: number) => void;
}

const GATE_TYPES: GateType[] = [
  // Single-qubit gates
  { id: 'I', name: 'Identity', symbol: 'I', category: 'single', description: 'Identity gate (no operation)', color: 'bg-gray-500' },
  { id: 'X', name: 'Pauli-X', symbol: 'X', category: 'single', description: 'Bit flip gate', color: 'bg-red-500' },
  { id: 'Y', name: 'Pauli-Y', symbol: 'Y', category: 'single', description: 'Bit and phase flip gate', color: 'bg-yellow-500' },
  { id: 'Z', name: 'Pauli-Z', symbol: 'Z', category: 'single', description: 'Phase flip gate', color: 'bg-blue-500' },
  { id: 'H', name: 'Hadamard', symbol: 'H', category: 'single', description: 'Creates superposition', color: 'bg-green-500' },
  { id: 'S', name: 'Phase', symbol: 'S', category: 'single', description: 'Phase gate (π/2)', color: 'bg-purple-500' },
  { id: 'T', name: 'T Gate', symbol: 'T', category: 'single', description: 'T gate (π/4)', color: 'bg-indigo-500' },
  
  // Multi-qubit gates
  { id: 'CNOT', name: 'CNOT', symbol: 'CX', category: 'multi', description: 'Controlled NOT gate', color: 'bg-orange-500' },
  { id: 'CZ', name: 'Controlled-Z', symbol: 'CZ', category: 'multi', description: 'Controlled Z gate', color: 'bg-teal-500' },
  { id: 'SWAP', name: 'SWAP', symbol: '⨯', category: 'multi', description: 'Swap two qubits', color: 'bg-pink-500' },
  { id: 'TOFFOLI', name: 'Toffoli', symbol: 'CCX', category: 'multi', description: 'Controlled-controlled-X', color: 'bg-cyan-500' },
  
  // Parametric gates
  { id: 'RX', name: 'Rotation X', symbol: 'RX', category: 'parametric', description: 'Rotation around X-axis', color: 'bg-red-600' },
  { id: 'RY', name: 'Rotation Y', symbol: 'RY', category: 'parametric', description: 'Rotation around Y-axis', color: 'bg-green-600' },
  { id: 'RZ', name: 'Rotation Z', symbol: 'RZ', category: 'parametric', description: 'Rotation around Z-axis', color: 'bg-blue-600' },
  { id: 'U3', name: 'Universal', symbol: 'U3', category: 'parametric', description: 'Universal single-qubit gate', color: 'bg-purple-600' },
  
  // Measurement
  { id: 'MEASURE', name: 'Measure', symbol: 'M', category: 'measurement', description: 'Measurement gate', color: 'bg-black' },
];

const CATEGORIES = {
  single: 'Single-Qubit Gates',
  multi: 'Multi-Qubit Gates', 
  parametric: 'Parametric Gates',
  measurement: 'Measurement'
};

export function GatePalette({ onGateSelect }: GatePaletteProps) {
  const handleDragStart = (e: React.DragEvent, gateType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ gateType }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const groupedGates = GATE_TYPES.reduce((acc, gate) => {
    if (!acc[gate.category]) {
      acc[gate.category] = [];
    }
    acc[gate.category].push(gate);
    return acc;
  }, {} as Record<string, GateType[]>);

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Gate Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(groupedGates).map(([category, gates]) => (
            <div key={category}>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                {CATEGORIES[category as keyof typeof CATEGORIES]}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {gates.map((gate) => (
                  <Tooltip key={gate.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-12 w-full p-0 cursor-grab active:cursor-grabbing ${gate.color} text-white border-none hover:opacity-80`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, gate.id)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold">{gate.symbol}</span>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-center">
                        <p className="font-semibold">{gate.name}</p>
                        <p className="text-xs text-muted-foreground">{gate.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              {category !== 'measurement' && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
