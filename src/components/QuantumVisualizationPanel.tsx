
import React from 'react';
import { PostSimulationWorkflow } from './workflow/PostSimulationWorkflow';
import { EntanglementVisualization } from './simulation/EntanglementVisualization';
import { EnhancedEntanglementVisualization } from './simulation/EnhancedEntanglementVisualization';
import { QuantumStateVisualization } from './circuits/QuantumStateVisualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Activity, Link2, BarChart, Zap, Eye } from 'lucide-react';

interface QuantumVisualizationPanelProps {
  result: QuantumBackendResult | null;
  gates: Gate[];
  numQubits: number;
  circuitName: string;
  onRerunSimulation: () => Promise<QuantumBackendResult | null>;
  onExecutePartialCircuit: (gates: Gate[], shots?: number) => Promise<QuantumBackendResult | null>;
}

export function QuantumVisualizationPanel({
  result,
  gates,
  numQubits,
  circuitName,
  onRerunSimulation,
  onExecutePartialCircuit
}: QuantumVisualizationPanelProps) {
  if (!result) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quantum Visualization Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Run a quantum simulation to see visualization results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert QuantumBackendResult to OptimizedSimulationResult for entanglement visualization
  const optimizedResult: OptimizedSimulationResult = {
    stateVector: result.stateVector.map(amp => ({ 
      real: amp.real, 
      imag: amp.imaginary 
    })),
    measurementProbabilities: Object.entries(result.measurementProbabilities).map(([state, prob]) => prob),
    qubitStates: result.qubitStates.map(qubit => ({
      qubit: qubit.qubit,
      state: qubit.state,
      amplitude: {
        real: qubit.amplitude.real,
        imag: qubit.amplitude.imaginary
      },
      phase: qubit.phase,
      probability: qubit.probability
    })),
    mode: 'accurate',
    executionTime: result.executionTime,
    fidelity: 1.0,
    // Enhanced entanglement calculation
    entanglement: result.entanglement || {
      pairs: [],
      totalEntanglement: 0,
      entanglementThreads: []
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="state" className="w-full">
        <TabsList className="grid w-full grid-cols-4 quantum-panel neon-border">
          <TabsTrigger value="state" className="text-quantum-glow">
            <Eye className="w-4 h-4 mr-2" />
            State & AI
          </TabsTrigger>
          <TabsTrigger value="workflow" className="text-quantum-glow">
            <BarChart className="w-4 h-4 mr-2" />
            Full Analysis
          </TabsTrigger>
          <TabsTrigger value="entanglement" className="text-quantum-neon">
            <Link2 className="w-4 h-4 mr-2" />
            Entanglement
          </TabsTrigger>
          <TabsTrigger value="enhanced" className="text-quantum-particle">
            <Zap className="w-4 h-4 mr-2" />
            Enhanced View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="state">
          <QuantumStateVisualization
            simulationResult={optimizedResult}
            NUM_QUBITS={numQubits}
            backendResult={result}
            gates={gates}
          />
        </TabsContent>

        <TabsContent value="workflow">
          <PostSimulationWorkflow
            result={result}
            gates={gates}
            numQubits={numQubits}
            circuitName={circuitName}
            onRerunSimulation={onRerunSimulation}
            onExecutePartialCircuit={onExecutePartialCircuit}
          />
        </TabsContent>

        <TabsContent value="entanglement">
          <EntanglementVisualization
            simulationResult={optimizedResult}
            numQubits={numQubits}
            circuit={gates}
          />
        </TabsContent>

        <TabsContent value="enhanced">
          <EnhancedEntanglementVisualization
            simulationResult={optimizedResult}
            numQubits={numQubits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
