
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlochSphere } from '@/components/BlochSphere';
import { Badge } from '@/components/ui/badge';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Eye, Activity } from 'lucide-react';

interface QuantumStateVisualizerProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
}

export function QuantumStateVisualizer({ simulationResult, numQubits }: QuantumStateVisualizerProps) {
  if (!simulationResult) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Quantum State Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Add gates to your circuit to see the quantum state visualization
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Real-time Quantum State
          <Badge variant="secondary" className="ml-2">
            {simulationResult.mode || 'Classical'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bloch Spheres for each qubit */}
        <div>
          <h4 className="text-xs font-semibold text-quantum-particle mb-3">
            Individual Qubit States (Bloch Spheres)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: numQubits }).map((_, i) => {
              const qubitState = simulationResult.qubitStates[i];
              if (!qubitState) return null;

              // Create proper Bloch sphere state with Complex-like objects
              const blochState = {
                amplitude0: { 
                  real: Math.sqrt(Math.max(0, 1 - qubitState.probability)), 
                  imag: 0 
                },
                amplitude1: { 
                  real: Math.sqrt(Math.max(0, qubitState.probability)), 
                  imag: 0 
                },
                probability0: Math.max(0, 1 - qubitState.probability),
                probability1: Math.max(0, qubitState.probability),
                phase: qubitState.phase || 0
              };

              return (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="text-xs font-mono text-quantum-neon">Qubit {i}</div>
                  <BlochSphere qubitState={blochState} size={120} />
                  <div className="text-xs text-center">
                    <div className="text-quantum-glow">{qubitState.state}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Vector Display */}
        <div>
          <h4 className="text-xs font-semibold text-quantum-particle mb-3 flex items-center gap-2">
            <Activity className="w-3 h-3" />
            State Vector Components
          </h4>
          <div className="bg-quantum-matrix rounded-lg p-4 max-h-32 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
              {simulationResult.measurementProbabilities
                .map((prob, i) => ({
                  state: i.toString(2).padStart(numQubits, '0'),
                  probability: prob
                }))
                .filter(item => item.probability > 0.001)
                .map(({ state, probability }) => (
                  <div key={state} className="flex items-center justify-between p-2 bg-quantum-void rounded border border-quantum-matrix">
                    <span className="text-quantum-neon">|{state}⟩</span>
                    <span className="text-quantum-energy">{(probability * 100).toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quantum Metrics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-quantum-void rounded p-3 border border-quantum-matrix">
            <div className="text-muted-foreground">Fidelity</div>
            <div className="text-quantum-glow font-mono text-lg">
              {((simulationResult.fidelity || 1) * 100).toFixed(2)}%
            </div>
          </div>
          <div className="bg-quantum-void rounded p-3 border border-quantum-matrix">
            <div className="text-muted-foreground">Execution Time</div>
            <div className="text-quantum-energy font-mono text-lg">
              {simulationResult.executionTime.toFixed(2)}ms
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
