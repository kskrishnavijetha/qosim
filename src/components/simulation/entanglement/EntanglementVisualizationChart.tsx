import React from 'react';

interface EntanglementPair {
  qubit1: number;
  qubit2: number;
  strength: number;
}

interface EntanglementVisualizationChartProps {
  pairs: EntanglementPair[];
  numQubits: number;
  animationKey: number;
}

export function EntanglementVisualizationChart({ pairs, numQubits, animationKey }: EntanglementVisualizationChartProps) {
  const getEntanglementColor = (strength: number) => {
    if (strength > 0.8) return 'hsl(var(--quantum-glow))';
    if (strength > 0.5) return 'hsl(var(--quantum-neon))';
    return 'hsl(var(--quantum-particle))';
  };

  const qubitPositions = Array.from({ length: numQubits }, (_, i) => ({
    x: 50 + (i * 80),
    y: 50
  }));

  return (
    <div className="relative h-32 bg-quantum-matrix rounded-lg overflow-hidden" key={animationKey}>
      <svg className="absolute inset-0 w-full h-full">
        {/* Draw entanglement connections */}
        {pairs.map((pair, idx) => {
          const pos1 = qubitPositions[pair.qubit1];
          const pos2 = qubitPositions[pair.qubit2];
          const strokeWidth = Math.max(1, pair.strength * 4);
          const opacity = 0.3 + (pair.strength * 0.7);
          
          return (
            <g key={idx}>
              <line
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke={getEntanglementColor(pair.strength)}
                strokeWidth={strokeWidth}
                opacity={opacity}
                className="drop-shadow-lg"
              />
              <circle
                cx={(pos1.x + pos2.x) / 2}
                cy={(pos1.y + pos2.y) / 2}
                r={2}
                fill={getEntanglementColor(pair.strength)}
                opacity={opacity}
                className="animate-pulse"
              />
            </g>
          );
        })}
        
        {/* Draw qubits */}
        {qubitPositions.map((pos, idx) => (
          <g key={idx}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={12}
              fill="hsl(var(--quantum-matrix))"
              stroke="hsl(var(--quantum-neon))"
              strokeWidth="2"
              className="quantum-float"
            />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              className="text-xs font-mono fill-quantum-neon"
            >
              {idx}
            </text>
          </g>
        ))}
      </svg>
      
      {pairs.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-mono">
          No entanglement detected
        </div>
      )}
    </div>
  );
}