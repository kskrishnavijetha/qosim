import React from 'react';

interface EntanglementPair {
  qubit1: number;
  qubit2: number;
  strength: number;
}

interface EntanglementPairsListProps {
  pairs: EntanglementPair[];
}

export function EntanglementPairsList({ pairs }: EntanglementPairsListProps) {
  const getEntanglementColor = (strength: number) => {
    if (strength > 0.8) return 'hsl(var(--quantum-glow))';
    if (strength > 0.5) return 'hsl(var(--quantum-neon))';
    return 'hsl(var(--quantum-particle))';
  };

  if (pairs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-mono text-quantum-particle">Detected Entanglements</div>
      <div className="grid grid-cols-1 gap-2">
        {pairs.map((pair, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-2 bg-quantum-matrix rounded text-xs font-mono"
          >
            <span className="text-quantum-neon">
              Qubit {pair.qubit1} ↔ Qubit {pair.qubit2}
            </span>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getEntanglementColor(pair.strength) }}
              />
              <span className="text-muted-foreground">
                {(pair.strength * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}