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
    if (simulationResult?.entanglement) {
      console.log('🎯 EntanglementVisualization: simulationResult updated in real-time', {
        mode: simulationResult.mode,
        entanglement: simulationResult.entanglement,
        numPairs: simulationResult.entanglement.pairs.length,
        totalEntanglement: simulationResult.entanglement.totalEntanglement
      });
      setLastUpdate(Date.now());
      setAnimationKey(prev => prev + 1); // Force re-animation
    } else {
      console.log('🎯 EntanglementVisualization: No entanglement data available', { simulationResult });
    }
  }, [simulationResult]);

  if (!simulationResult?.entanglement) {
    return <EntanglementEmptyState />;
  }

  const { entanglement, mode, executionTime, fidelity } = simulationResult;
  const { pairs, totalEntanglement } = entanglement;

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