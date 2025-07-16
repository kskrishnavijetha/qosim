
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

  // Real-time updates when simulation result changes
  useEffect(() => {
    console.log('🎯🔍 EntanglementVisualization: simulationResult received', { 
      hasResult: !!simulationResult,
      hasEntanglement: !!simulationResult?.entanglement,
      resultType: typeof simulationResult,
      timestamp: Date.now()
    });
    
    if (simulationResult) {
      console.log('🎯🔍 EntanglementVisualization: Simulation result details', {
        mode: simulationResult.mode,
        executionTime: simulationResult.executionTime,
        fidelity: simulationResult.fidelity,
        hasEntanglement: !!simulationResult.entanglement,
        entanglementData: simulationResult.entanglement
      });
      
      if (simulationResult.entanglement) {
        console.log('🎯🔍 EntanglementVisualization: Processing entanglement data', {
          mode: simulationResult.mode,
          entanglement: simulationResult.entanglement,
          numPairs: simulationResult.entanglement.pairs?.length || 0,
          totalEntanglement: simulationResult.entanglement.totalEntanglement,
          pairs: simulationResult.entanglement.pairs.map(p => `Q${p.qubit1}-Q${p.qubit2}: ${(p.strength * 100).toFixed(1)}%`),
          threads: simulationResult.entanglement.entanglementThreads
        });
        
        // Update state and trigger animation
        setLastUpdate(Date.now());
        setAnimationKey(prev => prev + 1);
        
        // Additional logging for debugging
        if (simulationResult.entanglement.pairs.length === 0) {
          console.log('🎯🔍 EntanglementVisualization: ⚠️ No entangled pairs found despite having entanglement object');
          console.log('🎯🔍 State vector sample:', simulationResult.stateVector?.slice(0, 8));
          console.log('🎯🔍 Measurement probabilities:', simulationResult.measurementProbabilities?.slice(0, 8));
        }
      } else {
        console.log('🎯🔍 EntanglementVisualization: No entanglement data available', { 
          hasEntanglement: !!simulationResult?.entanglement,
          entanglementValue: simulationResult?.entanglement
        });
      }
    } else {
      console.log('🎯🔍 EntanglementVisualization: No simulation result');
    }
  }, [simulationResult]);

  // Show empty state if no simulation result
  if (!simulationResult) {
    console.log('🎯🔍 EntanglementVisualization: Rendering empty state (no simulation result)');
    return <EntanglementEmptyState />;
  }

  // Enhanced check for entanglement
  const hasEntanglement = simulationResult.entanglement && 
    simulationResult.entanglement.pairs && 
    simulationResult.entanglement.pairs.length > 0;
    
  console.log('🎯🔍 EntanglementVisualization: Entanglement check', {
    hasEntanglement,
    entanglementObject: !!simulationResult.entanglement,
    pairsArray: !!simulationResult.entanglement?.pairs,
    pairsLength: simulationResult.entanglement?.pairs?.length || 0,
    totalEntanglement: simulationResult.entanglement?.totalEntanglement || 0
  });

  // If no entanglement detected, show informative message
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
                Try adding entangling gates like:
              </p>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">CNOT</span>
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">CZ</span>
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">Toffoli</span>
                <span className="px-3 py-1 bg-quantum-matrix/20 rounded font-mono text-xs border border-quantum-neon/30">SWAP</span>
              </div>
            </div>
            
            {/* Debug information for development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-muted-foreground">Debug Info</summary>
                <pre className="text-xs mt-2 p-2 bg-quantum-void/20 rounded overflow-auto">
                  {JSON.stringify({
                    hasEntanglementObject: !!simulationResult.entanglement,
                    totalEntanglement: simulationResult.entanglement?.totalEntanglement,
                    pairsCount: simulationResult.entanglement?.pairs?.length,
                    stateVectorNorm: simulationResult.stateVector?.reduce((sum, amp) => 
                      sum + (amp.real * amp.real + amp.imag * amp.imag), 0
                    ).toFixed(6)
                  }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { entanglement, mode, executionTime, fidelity } = simulationResult;
  const { pairs, totalEntanglement } = entanglement;

  console.log('🎯🔍 EntanglementVisualization: Rendering entanglement visualization with', {
    pairsCount: pairs.length,
    totalEntanglement,
    animationKey
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
      </CardContent>
    </Card>
  );
}
