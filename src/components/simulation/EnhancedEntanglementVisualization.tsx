import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { cn } from '@/lib/utils';
import { Zap, Link } from 'lucide-react';

interface EnhancedEntanglementVisualizationProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
}

export function EnhancedEntanglementVisualization({
  simulationResult,
  numQubits
}: EnhancedEntanglementVisualizationProps) {
  const entanglementData = useMemo(() => {
    if (!simulationResult) return null;
    
    const { entanglement } = simulationResult;
    const maxStrength = Math.max(...entanglement.pairs.map(p => p.strength), 0.1);
    
    return {
      ...entanglement,
      normalizedPairs: entanglement.pairs.map(pair => ({
        ...pair,
        normalizedStrength: pair.strength / maxStrength
      }))
    };
  }, [simulationResult]);

  const renderQubitNode = (qubitIndex: number) => {
    const isEntangled = entanglementData?.pairs.some(
      pair => pair.qubit1 === qubitIndex || pair.qubit2 === qubitIndex
    );
    
    return (
      <div
        key={qubitIndex}
        className={cn(
          "relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono transition-all duration-300",
          isEntangled 
            ? "border-quantum-glow bg-quantum-glow/20 text-quantum-glow quantum-glow animate-pulse" 
            : "border-quantum-particle bg-quantum-particle/10 text-quantum-particle"
        )}
        style={{
          left: `${qubitIndex * 60}px`,
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        {qubitIndex}
        {isEntangled && (
          <div className="absolute inset-0 rounded-full bg-quantum-glow/20 animate-ping" />
        )}
      </div>
    );
  };

  const renderEntanglementThread = (pair: any, index: number) => {
    const { qubit1, qubit2, normalizedStrength } = pair;
    const x1 = qubit1 * 60 + 16; // Center of qubit1 node
    const x2 = qubit2 * 60 + 16; // Center of qubit2 node
    const y1 = 50; // Center vertically
    const y2 = 50;
    
    // Calculate curve for visual appeal
    const midX = (x1 + x2) / 2;
    const midY = y1 - 20 - (normalizedStrength * 30); // Curve height based on strength
    
    const pathData = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
    
    return (
      <g key={`thread-${index}`}>
        {/* Glow effect */}
        <path
          d={pathData}
          stroke="url(#entanglementGradient)"
          strokeWidth={Math.max(2, normalizedStrength * 6)}
          fill="none"
          opacity={0.3}
          filter="url(#glow)"
        />
        
        {/* Main thread */}
        <path
          d={pathData}
          stroke="url(#entanglementGradient)"
          strokeWidth={Math.max(1, normalizedStrength * 3)}
          fill="none"
          opacity={0.8}
          className="animate-pulse"
          style={{
            animationDuration: `${2 - normalizedStrength}s`
          }}
        />
        
        {/* Animated particles */}
        <circle
          r={2}
          fill="var(--quantum-glow)"
          opacity={0.8}
        >
          <animateMotion
            dur={`${3 - normalizedStrength * 2}s`}
            repeatCount="indefinite"
            path={pathData}
          />
        </circle>
        
        <circle
          r={1.5}
          fill="var(--quantum-neon)"
          opacity={0.6}
        >
          <animateMotion
            dur={`${3 - normalizedStrength * 2}s`}
            repeatCount="indefinite"
            path={pathData}
            begin="0.5s"
          />
        </circle>
      </g>
    );
  };

  const renderMultiQubitThread = (thread: any, index: number) => {
    if (thread.qubits.length < 3) return null;
    
    const centerX = thread.qubits.reduce((sum: number, q: number) => sum + q * 60, 0) / thread.qubits.length + 16;
    const centerY = 50;
    
    return (
      <g key={`multi-thread-${index}`}>
        {thread.qubits.map((qubit: number) => {
          const x = qubit * 60 + 16;
          const y = 50;
          
          return (
            <line
              key={`multi-line-${qubit}`}
              x1={x}
              y1={y}
              x2={centerX}
              y2={centerY}
              stroke="var(--quantum-plasma)"
              strokeWidth={Math.max(1, thread.strength * 4)}
              opacity={0.6}
              strokeDasharray="2,2"
              className="animate-pulse"
            />
          );
        })}
        
        {/* Central node */}
        <circle
          cx={centerX}
          cy={centerY}
          r={4}
          fill="var(--quantum-plasma)"
          opacity={0.8}
          className="animate-pulse"
        />
      </g>
    );
  };

  if (!entanglementData || entanglementData.pairs.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Link className="w-5 h-5" />
            Entanglement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-mono">No entanglement detected</p>
            <p className="text-sm mt-2">Add CNOT, Toffoli, or other multi-qubit gates to create entanglement</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Link className="w-5 h-5" />
            Entanglement Analysis
          </CardTitle>
          <Badge 
            variant="outline" 
            className="border-quantum-glow text-quantum-glow font-mono"
          >
            {(entanglementData.totalEntanglement * 100).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Entanglement Visualization */}
        <div className="relative h-32 border rounded-lg bg-quantum-matrix/10 overflow-hidden">
          <svg 
            width="100%" 
            height="100%" 
            className="absolute inset-0"
          >
            <defs>
              {/* Gradient for entanglement threads */}
              <linearGradient id="entanglementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--quantum-glow)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="var(--quantum-neon)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--quantum-glow)" stopOpacity="0.8" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Render entanglement threads */}
            {entanglementData.normalizedPairs.map((pair, index) => 
              renderEntanglementThread(pair, index)
            )}
            
            {/* Render multi-qubit threads */}
            {entanglementData.entanglementThreads.map((thread, index) => 
              renderMultiQubitThread(thread, index)
            )}
          </svg>
          
          {/* Qubit nodes */}
          <div className="relative h-full">
            {Array.from({ length: numQubits }).map((_, index) => 
              renderQubitNode(index)
            )}
          </div>
        </div>
        
        {/* Entanglement Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-quantum-matrix/20">
            <div className="text-xs text-muted-foreground mb-1">Total Strength</div>
            <div className="text-lg font-mono text-quantum-glow">
              {(entanglementData.totalEntanglement * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-quantum-matrix/20">
            <div className="text-xs text-muted-foreground mb-1">Entangled Pairs</div>
            <div className="text-lg font-mono text-quantum-neon">
              {entanglementData.pairs.length}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-quantum-matrix/20">
            <div className="text-xs text-muted-foreground mb-1">Multi-Qubit</div>
            <div className="text-lg font-mono text-quantum-plasma">
              {entanglementData.entanglementThreads.length}
            </div>
          </div>
        </div>
        
        {/* Entanglement Details */}
        {entanglementData.pairs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-quantum-neon">Entangled Pairs:</h4>
            <div className="space-y-1">
              {entanglementData.pairs.map((pair, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-quantum-matrix/10 text-xs font-mono"
                >
                  <span className="text-quantum-particle">
                    Q{pair.qubit1} ↔ Q{pair.qubit2}
                  </span>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-quantum-glow text-quantum-glow"
                  >
                    {(pair.strength * 100).toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}