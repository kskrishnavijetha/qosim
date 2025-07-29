
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GatePaletteProps {
  selectedGateType: string | null;
  onGateSelect: (gateType: string) => void;
}

export function GatePalette({ selectedGateType, onGateSelect }: GatePaletteProps) {
  const gates = [
    { type: 'H', name: 'Hadamard', color: 'bg-blue-500', category: 'Single' },
    { type: 'X', name: 'Pauli-X', color: 'bg-red-500', category: 'Single' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-green-500', category: 'Single' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-purple-500', category: 'Single' },
    { type: 'S', name: 'Phase S', color: 'bg-yellow-500', category: 'Single' },
    { type: 'T', name: 'T Gate', color: 'bg-pink-500', category: 'Single' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-orange-500', category: 'Two-Qubit' },
    { type: 'CZ', name: 'Controlled-Z', color: 'bg-teal-500', category: 'Two-Qubit' },
    { type: 'SWAP', name: 'SWAP', color: 'bg-indigo-500', category: 'Two-Qubit' },
  ];

  const categories = ['Single', 'Two-Qubit'];

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <Card key={category} className="bg-black/30 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-cyan-400">{category} Qubit Gates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {gates.filter(gate => gate.category === category).map(gate => (
                <Button
                  key={gate.type}
                  onClick={() => onGateSelect(gate.type)}
                  variant={selectedGateType === gate.type ? 'default' : 'outline'}
                  size="sm"
                  className={`${gate.color} text-white border-white/20 hover:opacity-80`}
                >
                  {gate.type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
