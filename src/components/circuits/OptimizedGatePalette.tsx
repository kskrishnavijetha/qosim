
import React, { memo, useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useOptimizedDragDrop } from '@/hooks/useOptimizedDragDrop';

interface OptimizedGatePaletteProps {
  onGateAdd: (gate: any) => void;
  numQubits: number;
  gridSize: number;
}

const GATE_CATEGORIES = {
  'Single Qubit': [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Creates superposition' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip gate' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Y rotation gate' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip gate' },
    { type: 'S', name: 'S Gate', color: 'bg-blue-500', description: 'Phase gate (π/2)' },
    { type: 'T', name: 'T Gate', color: 'bg-cyan-500', description: 'T gate (π/4)' },
  ],
  'Rotation': [
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy', description: 'X-axis rotation' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary', description: 'Y-axis rotation' },
    { type: 'RZ', name: 'Rotation-Z', color: 'bg-orange-500', description: 'Z-axis rotation' },
  ],
  'Multi-Qubit': [
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT' },
    { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z' },
    { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swap qubits' },
  ],
  'Measurement': [
    { type: 'M', name: 'Measure', color: 'bg-destructive', description: 'Measurement gate' },
  ]
};

const GateButton = memo(({ gate, onDragStart }: { gate: any; onDragStart: (e: any, type: string) => void }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        className={cn(
          `${gate.color} rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer transition-all duration-200 quantum-glow select-none`,
          'w-12 h-12 hover:scale-105 active:scale-95'
        )}
        onMouseDown={(e) => onDragStart(e, gate.type)}
        onTouchStart={(e) => onDragStart(e, gate.type)}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none'
        }}
      >
        {gate.type.length > 4 ? gate.type.slice(0, 3) : gate.type}
      </div>
    </TooltipTrigger>
    <TooltipContent side="right" className="max-w-xs">
      <div className="space-y-1">
        <p className="font-semibold text-quantum-glow">{gate.name}</p>
        <p className="text-xs text-muted-foreground">{gate.description}</p>
      </div>
    </TooltipContent>
  </Tooltip>
));

GateButton.displayName = 'GateButton';

export const OptimizedGatePalette = memo(function OptimizedGatePalette({ 
  onGateAdd, 
  numQubits, 
  gridSize 
}: OptimizedGatePaletteProps) {
  const { handleStart } = useOptimizedDragDrop({ onGateAdd, numQubits, gridSize });

  const categoryEntries = useMemo(() => Object.entries(GATE_CATEGORIES), []);

  return (
    <div className="space-y-4 w-64 max-h-[600px] overflow-y-auto">
      <h3 className="text-sm font-mono text-quantum-neon mb-4">
        🎛️ Quantum Gate Palette
      </h3>
      
      {categoryEntries.map(([category, gates]) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground">
            {category} Gates
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {gates.map(gate => (
              <GateButton
                key={gate.type}
                gate={gate}
                onDragStart={handleStart}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
