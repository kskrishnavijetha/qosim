
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumCircuit, CircuitSimulationResult } from '@/hooks/useCircuitBuilder';
import { Play, Pause, Square, Activity, Zap } from 'lucide-react';

interface CircuitSimulationPanelProps {
  circuit: QuantumCircuit;
  simulationResult: CircuitSimulationResult | null;
  onSimulate: () => Promise<void>;
  isSimulating: boolean;
}

export function CircuitSimulationPanel({ 
  circuit, 
  simulationResult, 
  onSimulate, 
  isSimulating 
}: CircuitSimulationPanelProps) {
  const [activeTab, setActiveTab] = useState('results');

  const renderStateVector = () => {
    if (!simulationResult) return <div className="text-muted-foreground text-sm">No simulation data</div>;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">State Vector</div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {simulationResult.stateVector.map((amplitude, index) => {
            const magnitude = Math.sqrt(amplitude.real ** 2 + amplitude.imag ** 2);
            if (magnitude < 0.001) return null;
            
            const binaryState = index.toString(2).padStart(circuit.qubits.length, '0');
            return (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="font-mono">|{binaryState}⟩</span>
                <span className="text-muted-foreground">
                  {magnitude.toFixed(3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQubitStates = () => {
    if (!simulationResult) return <div className="text-muted-foreground text-sm">No simulation data</div>;

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium">Individual Qubit States</div>
        {simulationResult.qubitStates.map((qubitState, index) => {
          const qubit = circuit.qubits.find(q => q.id === qubitState.qubit);
          return (
            <div key={qubitState.qubit} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{qubit?.name}</span>
                <Badge variant="outline">{qubitState.state}</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Probability</span>
                  <span>{(qubitState.probability * 100).toFixed(1)}%</span>
                </div>
                <Progress value={qubitState.probability * 100} className="h-1" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderEntanglement = () => {
    if (!simulationResult) return <div className="text-muted-foreground text-sm">No simulation data</div>;

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium">Entanglement Analysis</div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Entanglement Strength</span>
            <span className="font-mono">{(simulationResult.entanglement.strength * 100).toFixed(1)}%</span>
          </div>
          <Progress value={simulationResult.entanglement.strength * 100} className="h-2" />
        </div>

        {simulationResult.entanglement.pairs.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm">Entangled Pairs</div>
            <div className="space-y-1">
              {simulationResult.entanglement.pairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="font-mono">
                    {circuit.qubits.find(q => q.id === pair[0])?.name} ↔ {circuit.qubits.find(q => q.id === pair[1])?.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!simulationResult) return <div className="text-muted-foreground text-sm">No simulation data</div>;

    return (
      <div className="space-y-3">
        <div className="text-sm font-medium">Simulation Metrics</div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Fidelity</span>
            <div className="font-mono">{(simulationResult.fidelity * 100).toFixed(2)}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Execution Time</span>
            <div className="font-mono">{simulationResult.executionTime.toFixed(2)}ms</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">Measurement Probabilities</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {simulationResult.measurementProbabilities.map((prob, index) => {
              if (prob < 0.001) return null;
              const binaryState = index.toString(2).padStart(circuit.qubits.length, '0');
              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="font-mono">|{binaryState}⟩</span>
                  <span>{(prob * 100).toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Quantum Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={onSimulate}
              disabled={circuit.gates.length === 0 || isSimulating}
              className="flex-1"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>

          {isSimulating && (
            <div className="space-y-2">
              <Progress value={75} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Calculating state evolution...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {simulationResult && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="states">States</TabsTrigger>
                <TabsTrigger value="entangle">Entangle</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-4">
                {renderStateVector()}
              </TabsContent>
              
              <TabsContent value="states" className="space-y-4">
                {renderQubitStates()}
              </TabsContent>
              
              <TabsContent value="entangle" className="space-y-4">
                {renderEntanglement()}
              </TabsContent>
              
              <TabsContent value="metrics" className="space-y-4">
                {renderMetrics()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
