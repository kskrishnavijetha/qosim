import React from 'react';
import { Zap } from 'lucide-react';

interface EntanglementStatisticsProps {
  totalEntanglement: number;
  pairsCount: number;
  numQubits: number;
}

export function EntanglementStatistics({ totalEntanglement, pairsCount, numQubits }: EntanglementStatisticsProps) {
  const getEntanglementColor = (strength: number) => {
    if (strength > 0.8) return 'hsl(var(--quantum-glow))';
    if (strength > 0.5) return 'hsl(var(--quantum-neon))';
    return 'hsl(var(--quantum-particle))';
  };

  const maxPossiblePairs = (numQubits * (numQubits - 1)) / 2;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-quantum-particle" />
          <span className="text-sm font-mono text-quantum-particle">Total Entanglement</span>
        </div>
        <div className="text-2xl font-mono text-quantum-glow">
          {totalEntanglement.toFixed(3)}
        </div>
        <div className="w-full bg-quantum-matrix rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, totalEntanglement * 100)}%`,
              background: `linear-gradient(90deg, ${getEntanglementColor(totalEntanglement)}, ${getEntanglementColor(totalEntanglement)}80)`
            }}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-mono text-quantum-particle">Entangled Pairs</div>
        <div className="text-2xl font-mono text-quantum-glow">
          {pairsCount}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          out of {maxPossiblePairs} possible
        </div>
      </div>
    </div>
  );
}