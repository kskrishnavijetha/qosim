
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { EntanglementEmptyState } from './entanglement/EntanglementEmptyState';
import { EntanglementHeader } from './entanglement/EntanglementHeader';
import { EntanglementVisualizationChart } from './entanglement/EntanglementVisualizationChart';
import { EntanglementStatistics } from './entanglement/EntanglementStatistics';
import { EntanglementPairsList } from './entanglement/EntanglementPairsList';

interface EntanglementVisualizationProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
}

export function EntanglementVisualization({ simulationResult, numQubits }: EntanglementVisualizationProps) {
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [animationKey, setAnimationKey] = useState<number>(0);

  useEffect(() => {
    console.log('🎯🔍 EntanglementVisualization: Processing simulation result', { 
      hasResult: !!simulationResult,
      hasEntanglement: !!simulationResult?.entanglement,
      timestamp: Date.now()
    });
    
    if (simulationResult?.entanglement) {
      const { entanglement } = simulationResult;
      console.log('🎯🔍 EntanglementVisualization: Entanglement data found', {
        pairs: entanglement.pairs,
        totalEntanglement: entanglement.totalEntanglement,
        threads: entanglement.entanglementThreads
      });
      
      setLastUpdate(Date.now());
      setAnimationKey(prev => prev + 1);
    }
  }, [simulationResult]);

  if (!simulationResult) {
    return <EntanglementEmptyState />;
  }

  // Check for entanglement with proper validation
  const hasEntanglement = simulationResult.entanglement && 
    simulationResult.entanglement.pairs && 
    simulationResult.entanglement.pairs.length > 0 &&
    simulationResult.entanglement.totalEntanglement > 0.001;

  if (!hasEntanglement) {
    return (
      <Card className="quantum-panel neon-border">
        <EntanglementHeader 
          lastUpdate={lastUpdate}
          mode={simulationResult.mode}
          executionTime={simulationResult.executionTime}
          fidelity={simulationResult.fidelity}
        />
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl opacity-20">⚛️</div>
            <div>
              <p className="font-mono text-lg text-muted-foreground">No quantum entanglement detected</p>
              <p className="text-sm mt-2 text-muted-foreground">
                Add entangling gates to create quantum correlations:
              </p>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">CNOT</span>
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">CZ</span>
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">Bell State</span>
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">GHZ State</span>
              </div>
            </div>
            
            {simulationResult.entanglement && (
              <div className="mt-4 text-xs text-quantum-particle">
                Total entanglement: {(simulationResult.entanglement.totalEntanglement * 100).toFixed(3)}%
                {simulationResult.entanglement.pairs.length > 0 && (
                  <div className="mt-1">
                    Weak pairs detected: {simulationResult.entanglement.pairs.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { entanglement, mode, executionTime, fidelity } = simulationResult;
  const { pairs, totalEntanglement, entanglementThreads } = entanglement;

  console.log('🎯🔍 EntanglementVisualization: Rendering with entanglement', {
    pairsCount: pairs.length,
    totalEntanglement,
    threadsCount: entanglementThreads?.length || 0
  });

  return (
    <Card className="quantum-panel neon-border">
      <EntanglementHeader 
        lastUpdate={lastUpdate}
        mode={mode}
        executionTime={executionTime}
        fidelity={fidelity}
      />
      <CardContent className="space-y-4">
        <EntanglementVisualizationChart 
          pairs={pairs}
          numQubits={numQubits}
          animationKey={animationKey}
        />
        
        <EntanglementStatistics 
          totalEntanglement={totalEntanglement}
          pairsCount={pairs.length}
          numQubits={numQubits}
        />
        
        <EntanglementPairsList pairs={pairs} />
        
        {entanglementThreads && entanglementThreads.length > 0 && (
          <div className="quantum-panel neon-border rounded p-3">
            <h4 className="text-quantum-glow text-sm font-mono mb-2">Multi-Qubit Entanglement</h4>
            <div className="space-y-2">
              {entanglementThreads.map((thread, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-quantum-neon">
                    Qubits {thread.qubits.join(', ')}
                  </span>
                  <span className="text-quantum-particle">
                    {(thread.strength * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
