
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OutputGraphicalFormat } from './output/OutputGraphicalFormat';
import { OutputMatrixFormat } from './output/OutputMatrixFormat';
import { OutputSimulationLogs } from './output/OutputSimulationLogs';
import { type OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';

interface SimulatorOutputProps {
  simulationResult: OptimizedSimulationResult | null;
}

export function SimulatorOutput({ simulationResult }: SimulatorOutputProps) {
  if (!simulationResult) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Simulation Output</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No simulation results yet. Add gates to your circuit and run a simulation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Simulation Output</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graphical" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="graphical">Graphical</TabsTrigger>
            <TabsTrigger value="matrix">Matrix</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="graphical">
            <OutputGraphicalFormat simulationResult={simulationResult} />
          </TabsContent>
          
          <TabsContent value="matrix">
            <OutputMatrixFormat simulationResult={simulationResult} />
          </TabsContent>
          
          <TabsContent value="logs">
            <OutputSimulationLogs simulationResult={simulationResult} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
