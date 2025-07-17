
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface EntanglingGateSelectorProps {
  selectedGates: string[];
  onToggleGate: (gateType: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
}

const ENTANGLING_GATES = [
  { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT - creates strong 2-qubit entanglement' },
  { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z - phase entanglement between qubits' },
  { type: 'BELL', name: 'Bell', color: 'bg-violet-500', description: 'Creates maximally entangled Bell state' },
  { type: 'GHZ', name: 'GHZ', color: 'bg-violet-400', description: 'Creates 3-qubit GHZ entangled state' },
  { type: 'TOFFOLI', name: 'Toffoli', color: 'bg-pink-500', description: 'Controlled-controlled-X gate' },
];

export function EntanglingGateSelector({ selectedGates, onToggleGate, onGateMouseDown }: EntanglingGateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-mono text-quantum-glow">🔗 Entangling Gates</h4>
        <Badge variant="outline" className="text-xs">
          {selectedGates.length} selected
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {ENTANGLING_GATES.map(gate => {
          const isSelected = selectedGates.includes(gate.type);
          
          return (
            <Tooltip key={gate.type}>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`
                    h-12 transition-all duration-300
                    ${isSelected 
                      ? `${gate.color} text-black font-bold shadow-lg ring-2 ring-quantum-glow ring-opacity-50 animate-pulse` 
                      : 'hover:scale-105 border-quantum-neon/30'
                    }
                  `}
                  onClick={() => onToggleGate(gate.type)}
                  onMouseDown={(e) => onGateMouseDown(e, gate.type)}
                >
                  <div className="text-center">
                    <div className="text-xs font-bold">{gate.name}</div>
                    {isSelected && (
                      <div className="text-xs opacity-80">✓ Added</div>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-quantum-glow">{gate.name} Gate</p>
                  <p className="text-xs">{gate.description}</p>
                  <p className="text-xs text-quantum-particle">
                    {isSelected ? "Click to remove from circuit" : "Required to analyze entanglement. Click to add."}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      
      <div className="text-xs text-muted-foreground">
        💡 Select gates above to add them to your circuit for entanglement analysis
      </div>
    </div>
  );
}
