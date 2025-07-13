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
      simulationResult 
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
          pairs: simulationResult.entanglement.pairs,
          threads: simulationResult.entanglement.entanglementThreads
        });
        setLastUpdate(Date.now());
        setAnimationKey(prev => prev + 1); // Force re-animation
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

  // Show even if no entanglement but simulation exists
  if (!simulationResult) {
    return <EntanglementEmptyState />;
  }

  // If no entanglement data, show empty state with simulation info
  if (!simulationResult.entanglement || simulationResult.entanglement.pairs.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <EntanglementHeader 
          lastUpdate={lastUpdate}
          mode={simulationResult.mode}
          executionTime={simulationResult.executionTime}
          fidelity={simulationResult.fidelity}
        />
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p className="font-mono">No entanglement detected</p>
            <p className="text-sm mt-2">Try adding gates like CNOT, CZ, or Toffoli to create entanglement</p>
          </div>
        </CardContent>
      </Card>
    );
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