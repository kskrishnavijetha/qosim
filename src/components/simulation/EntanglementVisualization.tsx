import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedSimulationResult } from '@/lib/quantumSimulationService';
import { Zap, Link2 } from 'lucide-react';

interface EntanglementVisualizationProps {
  simulationResult: EnhancedSimulationResult | null;
  numQubits: number;
}

export function EntanglementVisualization({ simulationResult, numQubits }: EntanglementVisualizationProps) {
  if (!simulationResult?.entanglement) {
    return null;
  }

  const { entanglement, mode, executionTime, fidelity } = simulationResult;
  const { pairs, totalEntanglement } = entanglement;

  const getEntanglementColor = (strength: number) => {
    if (strength > 0.8) return 'hsl(var(--quantum-glow))';
    if (strength > 0.5) return 'hsl(var(--quantum-neon))';
    return 'hsl(var(--quantum-particle))';
  };

  const renderQubitConnections = () => {
    const qubitPositions = Array.from({ length: numQubits }, (_, i) => ({
      x: 50 + (i * 80),
      y: 50
    }));

    return (
      <div className="relative h-32 bg-quantum-matrix rounded-lg overflow-hidden">
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
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Quantum Entanglement Analysis
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`font-mono ${
            mode === 'cloud' ? 'border-quantum-glow text-quantum-glow' :
            mode === 'accurate' ? 'border-quantum-neon text-quantum-neon' :
            'border-quantum-particle text-quantum-particle'
          }`}>
            {mode.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            {executionTime.toFixed(0)}ms
          </Badge>
          {fidelity && (
            <Badge variant="secondary" className="font-mono text-xs">
              Fidelity: {(fidelity * 100).toFixed(1)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entanglement Visualization */}
        {renderQubitConnections()}
        
        {/* Entanglement Statistics */}
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
              {pairs.length}
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              out of {(numQubits * (numQubits - 1)) / 2} possible
            </div>
          </div>
        </div>
        
        {/* Entanglement Pairs List */}
        {pairs.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
}