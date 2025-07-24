
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface EntanglingGateSelectorProps {
  selectedGates: string[];
  onToggleGate: (gateType: string) => void;
  entanglingGates: string[];
  hasEntanglingGates: boolean;
}

export function EntanglingGateSelector({
  selectedGates,
  onToggleGate,
  entanglingGates,
  hasEntanglingGates
}: EntanglingGateSelectorProps) {
  const gateColors: Record<string, string> = {
    'CNOT': 'bg-quantum-plasma',
    'CZ': 'bg-red-500',
    'BELL': 'bg-violet-500',
    'GHZ': 'bg-violet-400',
    'TOFFOLI': 'bg-pink-500'
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-mono text-quantum-glow">Entangling Gates</h4>
          {hasEntanglingGates && (
            <Badge variant="outline" className="text-xs text-quantum-particle">
              Active
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {entanglingGates.map(gate => {
            const isSelected = selectedGates.includes(gate);
            const isInCircuit = hasEntanglingGates; // Simplified for demo
            
            return (
              <Tooltip key={gate}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleGate(gate)}
                    className={`
                      relative transition-all duration-300
                      ${isSelected ? 'ring-2 ring-quantum-glow shadow-lg' : ''}
                      ${isInCircuit ? 'border-quantum-neon' : 'border-muted'}
                      hover:scale-105 hover:shadow-md
                    `}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${gateColors[gate] || 'bg-gray-400'}`} />
                    {gate}
                    {isInCircuit && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-particle rounded-full animate-pulse" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-semibold">{gate} Gate</p>
                    <p>Required to analyze entanglement. Click to add.</p>
                    {isInCircuit && <p className="text-quantum-particle">✓ Present in circuit</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
