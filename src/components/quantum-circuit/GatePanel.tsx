
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface GateInfo {
  type: string;
  name: string;
  color: string;
  description: string;
  category: string;
  symbol?: string;
}

const QUANTUM_GATES: GateInfo[] = [
  // Single-qubit gates
  { type: 'H', name: 'Hadamard', color: 'bg-blue-500', description: 'Creates superposition', category: 'Single', symbol: 'H' },
  { type: 'X', name: 'Pauli-X', color: 'bg-red-500', description: 'Bit flip (NOT)', category: 'Single', symbol: 'X' },
  { type: 'Y', name: 'Pauli-Y', color: 'bg-green-500', description: 'Bit and phase flip', category: 'Single', symbol: 'Y' },
  { type: 'Z', name: 'Pauli-Z', color: 'bg-purple-500', description: 'Phase flip', category: 'Single', symbol: 'Z' },
  { type: 'S', name: 'S Gate', color: 'bg-indigo-500', description: 'Phase gate (π/2)', category: 'Single', symbol: 'S' },
  { type: 'T', name: 'T Gate', color: 'bg-pink-500', description: 'π/8 gate', category: 'Single', symbol: 'T' },
  
  // Rotation gates
  { type: 'RX', name: 'Rotation-X', color: 'bg-orange-500', description: 'X-axis rotation', category: 'Rotation', symbol: 'RX' },
  { type: 'RY', name: 'Rotation-Y', color: 'bg-yellow-500', description: 'Y-axis rotation', category: 'Rotation', symbol: 'RY' },
  { type: 'RZ', name: 'Rotation-Z', color: 'bg-teal-500', description: 'Z-axis rotation', category: 'Rotation', symbol: 'RZ' },
  
  // Two-qubit gates
  { type: 'CNOT', name: 'CNOT', color: 'bg-cyan-500', description: 'Controlled NOT', category: 'Two-Qubit', symbol: '⊕' },
  { type: 'CZ', name: 'Controlled-Z', color: 'bg-amber-500', description: 'Controlled Z', category: 'Two-Qubit', symbol: 'CZ' },
  { type: 'SWAP', name: 'SWAP', color: 'bg-emerald-500', description: 'Swap qubits', category: 'Two-Qubit', symbol: '⇄' },
  
  // Measurement
  { type: 'M', name: 'Measure', color: 'bg-gray-500', description: 'Measurement', category: 'Special', symbol: 'M' },
];

const CATEGORY_COLORS = {
  'Single': 'bg-blue-100 text-blue-800',
  'Rotation': 'bg-orange-100 text-orange-800',
  'Two-Qubit': 'bg-green-100 text-green-800',
  'Special': 'bg-gray-100 text-gray-800',
};

interface GatePanelProps {
  onGateDragStart: (gate: GateInfo, e: React.DragEvent) => void;
  onGateTouchStart: (gate: GateInfo, e: React.TouchEvent) => void;
}

export function GatePanel({ onGateDragStart, onGateTouchStart }: GatePanelProps) {
  const groupedGates = QUANTUM_GATES.reduce((acc, gate) => {
    if (!acc[gate.category]) {
      acc[gate.category] = [];
    }
    acc[gate.category].push(gate);
    return acc;
  }, {} as Record<string, GateInfo[]>);

  const categoryOrder = ['Single', 'Rotation', 'Two-Qubit', 'Special'];

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Gate Panel</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4 p-4">
              {categoryOrder.map(category => {
                const gates = groupedGates[category] || [];
                if (gates.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{category}</h3>
                      <Badge variant="outline" className={cn("text-xs", CATEGORY_COLORS[category])}>
                        {gates.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {gates.map(gate => (
                        <div
                          key={gate.type}
                          draggable
                          onDragStart={(e) => onGateDragStart(gate, e)}
                          onTouchStart={(e) => onGateTouchStart(gate, e)}
                          className={cn(
                            "cursor-grab active:cursor-grabbing rounded-lg border-2 border-current p-3 transition-all hover:scale-105 select-none",
                            gate.color,
                            "text-white font-bold text-center"
                          )}
                          title={`${gate.name}: ${gate.description}`}
                        >
                          <div className="text-sm font-bold">
                            {gate.symbol || gate.type}
                          </div>
                          <div className="text-xs mt-1 opacity-90">
                            {gate.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
