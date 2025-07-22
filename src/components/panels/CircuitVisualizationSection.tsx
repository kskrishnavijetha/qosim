import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuantumStateVisualizer } from '@/components/circuits/QuantumStateVisualizer';
import { type OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface CircuitVisualizationSectionProps {
  simulationResult: OptimizedSimulationResult | null;
}

export function CircuitVisualizationSection({ simulationResult }: CircuitVisualizationSectionProps) {
  if (!simulationResult) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon">Quantum State Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Run a simulation to visualize the quantum state
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center justify-between">
          Quantum State Visualization
          <Badge variant="secondary">
            Fidelity: {(simulationResult.fidelity * 100).toFixed(1)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QuantumStateVisualizer simulationResult={simulationResult} />
      </CardContent>
    </Card>
  );
}

