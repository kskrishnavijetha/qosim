
import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOptimizedDragDrop } from '@/hooks/useOptimizedDragDrop';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface OptimizedGatePaletteProps {
  canvasRef: React.RefObject<HTMLElement>;
  onGateAdd: (gate: any) => void;
  numQubits: number;
  gridSize: number;
}

interface GateInfo {
  type: string;
  name: string;
  color: string;
  description: string;
  category: string;
  parameters?: string[];
  complexity?: number;
}

const QUANTUM_GATES: GateInfo[] = [
  // Single-qubit gates
  { type: 'I', name: 'Identity', color: 'bg-slate-500', description: 'Identity gate - no change', category: 'Basic', complexity: 1 },
  { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Creates superposition', category: 'Basic', complexity: 1 },
  { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip (NOT gate)', category: 'Basic', complexity: 1 },
  { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Bit and phase flip', category: 'Basic', complexity: 1 },
  { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip', category: 'Basic', complexity: 1 },
  { type: 'S', name: 'S Gate', color: 'bg-blue-500', description: 'Phase gate (π/2)', category: 'Basic', complexity: 1 },
  { type: 'T', name: 'T Gate', color: 'bg-cyan-500', description: 'π/8 gate', category: 'Basic', complexity: 1 },
  { type: 'SDG', name: 'S†', color: 'bg-blue-600', description: 'S dagger', category: 'Basic', complexity: 1 },
  { type: 'TDG', name: 'T†', color: 'bg-cyan-600', description: 'T dagger', category: 'Basic', complexity: 1 },

  // Rotation gates
  { type: 'RX', name: 'RX', color: 'bg-quantum-energy', description: 'X-axis rotation', category: 'Rotation', parameters: ['θ'], complexity: 2 },
  { type: 'RY', name: 'RY', color: 'bg-secondary', description: 'Y-axis rotation', category: 'Rotation', parameters: ['θ'], complexity: 2 },
  { type: 'RZ', name: 'RZ', color: 'bg-orange-500', description: 'Z-axis rotation', category: 'Rotation', parameters: ['θ'], complexity: 2 },
  { type: 'U1', name: 'U1', color: 'bg-indigo-500', description: 'Single-parameter gate', category: 'Rotation', parameters: ['λ'], complexity: 2 },
  { type: 'U2', name: 'U2', color: 'bg-indigo-600', description: 'Two-parameter gate', category: 'Rotation', parameters: ['φ', 'λ'], complexity: 3 },
  { type: 'U3', name: 'U3', color: 'bg-indigo-700', description: 'Three-parameter gate', category: 'Rotation', parameters: ['θ', 'φ', 'λ'], complexity: 3 },

  // Two-qubit gates
  { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT', category: 'Two-Qubit', complexity: 3 },
  { type: 'CX', name: 'CX', color: 'bg-quantum-plasma', description: 'Controlled X (same as CNOT)', category: 'Two-Qubit', complexity: 3 },
  { type: 'CY', name: 'CY', color: 'bg-pink-500', description: 'Controlled Y', category: 'Two-Qubit', complexity: 3 },
  { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z', category: 'Two-Qubit', complexity: 3 },
  { type: 'CH', name: 'CH', color: 'bg-yellow-500', description: 'Controlled Hadamard', category: 'Two-Qubit', complexity: 3 },
  { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swap qubits', category: 'Two-Qubit', complexity: 3 },
  { type: 'ISWAP', name: 'iSWAP', color: 'bg-green-600', description: 'Imaginary SWAP', category: 'Two-Qubit', complexity: 4 },

  // Three-qubit gates
  { type: 'CCX', name: 'CCX', color: 'bg-red-600', description: 'Toffoli (CCNOT)', category: 'Three-Qubit', complexity: 5 },
  { type: 'CSWAP', name: 'CSWAP', color: 'bg-green-700', description: 'Fredkin gate', category: 'Three-Qubit', complexity: 5 },

  // Special gates
  { type: 'MEASURE', name: 'Measure', color: 'bg-destructive', description: 'Measurement', category: 'Special', complexity: 1 },
  { type: 'RESET', name: 'Reset', color: 'bg-slate-600', description: 'Reset to |0⟩', category: 'Special', complexity: 1 },
  { type: 'BARRIER', name: 'Barrier', color: 'bg-amber-500', description: 'Circuit barrier', category: 'Special', complexity: 0 },
];

const CATEGORY_COLORS = {
  'Basic': 'bg-blue-100 text-blue-800',
  'Rotation': 'bg-purple-100 text-purple-800',
  'Two-Qubit': 'bg-red-100 text-red-800',
  'Three-Qubit': 'bg-orange-100 text-orange-800',
  'Special': 'bg-gray-100 text-gray-800'
};

const CATEGORY_ICONS = {
  'Basic': '🟦',
  'Rotation': '🔄',
  'Two-Qubit': '🔗',
  'Three-Qubit': '🔀',
  'Special': '⚡'
};

export const OptimizedGatePalette = memo(function OptimizedGatePalette({
  canvasRef,
  onGateAdd,
  numQubits,
  gridSize
}: OptimizedGatePaletteProps) {
  const isMobile = useIsMobile();
  const { handleMouseDown, handleTouchStart } = useOptimizedDragDrop({
    onGateAdd,
    numQubits,
    gridSize,
    canvasRef
  });

  // Group gates by category for better organization
  const groupedGates = useMemo(() => {
    return QUANTUM_GATES.reduce((acc, gate) => {
      if (!acc[gate.category]) {
        acc[gate.category] = [];
      }
      acc[gate.category].push(gate);
      return acc;
    }, {} as Record<string, GateInfo[]>);
  }, []);

  const categoryOrder = ['Basic', 'Rotation', 'Two-Qubit', 'Three-Qubit', 'Special'];

  return (
    <Card className="h-full quantum-panel neon-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
          🎛️ Quantum Gates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-full">
          <div className="space-y-6">
            {categoryOrder.map(category => {
              const gates = groupedGates[category] || [];
              if (gates.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_ICONS[category]}</span>
                    <h3 className="font-semibold text-quantum-neon">{category}</h3>
                    <Badge variant="outline" className={cn("text-xs", CATEGORY_COLORS[category])}>
                      {gates.length}
                    </Badge>
                  </div>
                  
                  <div className={cn(
                    "grid gap-2",
                    isMobile ? "grid-cols-3" : "grid-cols-4"
                  )}>
                    {gates.map(gate => (
                      <Tooltip key={gate.type}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              `${gate.color} rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer transition-all duration-200 quantum-glow select-none relative`,
                              isMobile 
                                ? "w-12 h-12 text-[10px] active:scale-95" 
                                : "w-14 h-14 text-xs hover:scale-105"
                            )}
                            onMouseDown={!isMobile ? (e) => handleMouseDown(e, gate.type) : undefined}
                            onTouchStart={isMobile ? (e) => handleTouchStart(e, gate.type) : undefined}
                            style={{ 
                              WebkitTouchCallout: 'none',
                              WebkitUserSelect: 'none',
                              animationDelay: `${QUANTUM_GATES.indexOf(gate) * 20}ms`
                            }}
                          >
                            {gate.type.length > 4 ? gate.type.slice(0, 3) + '.' : gate.type}
                            
                            {/* Complexity indicator */}
                            {gate.complexity && gate.complexity > 3 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                                {gate.complexity}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side={isMobile ? "top" : "right"} className="max-w-xs">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-quantum-glow">{gate.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {gate.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{gate.description}</p>
                            
                            {gate.parameters && (
                              <div className="text-xs">
                                <span className="text-quantum-particle">Parameters: </span>
                                <span className="font-mono">{gate.parameters.join(', ')}</span>
                              </div>
                            )}
                            
                            {gate.complexity && (
                              <div className="text-xs border-t pt-1">
                                <span className="text-quantum-energy">Complexity: </span>
                                <span className="font-mono">{gate.complexity}</span>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});
