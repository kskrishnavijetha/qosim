
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, BarChart3, Atom } from 'lucide-react';

interface SimulationResult {
  stateVector: Array<{ real: number; imag: number }>;
  measurementProbabilities: number[];
  qubitStates: Array<{
    state: string;
    amplitude: { real: number; imag: number };
    phase: number;
    probability: number;
  }>;
  executionTime: number;
  fidelity: number;
}

interface SimulationPanelProps {
  simulationResult: SimulationResult | null;
  onSimulate: () => void;
  isSimulating: boolean;
  numQubits: number;
}

export function SimulationPanel({ 
  simulationResult, 
  onSimulate, 
  isSimulating, 
  numQubits 
}: SimulationPanelProps) {
  const renderBlochSphere = (qubitIndex: number) => {
    const qubitState = simulationResult?.qubitStates[qubitIndex];
    if (!qubitState) return null;

    const { amplitude, phase, probability } = qubitState;
    const theta = 2 * Math.acos(Math.abs(amplitude.real));
    const phi = phase;
    
    return (
      <div key={qubitIndex} className="flex flex-col items-center space-y-2">
        <div className="text-xs font-mono text-muted-foreground">q{qubitIndex}</div>
        <div 
          className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center relative"
          style={{
            background: `conic-gradient(from ${phi}rad, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))`,
            transform: `rotateX(${theta}rad)`,
          }}
        >
          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
        </div>
        <div className="text-xs text-center">
          <div className="font-mono">{qubitState.state}</div>
          <div className="text-muted-foreground">P: {probability.toFixed(3)}</div>
        </div>
      </div>
    );
  };

  const renderHistogram = () => {
    if (!simulationResult) return null;

    const maxProb = Math.max(...simulationResult.measurementProbabilities);
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Measurement Probabilities
        </h4>
        <div className="space-y-1">
          {simulationResult.measurementProbabilities
            .map((prob, i) => ({
              state: i.toString(2).padStart(numQubits, '0'),
              probability: prob
            }))
            .filter(item => item.probability > 0.001)
            .map(({ state, probability }) => (
              <div key={state} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono">|{state}⟩</span>
                  <span>{(probability * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(probability / maxProb) * 100} 
                  className="h-2"
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Atom className="w-4 h-4" />
            Quantum Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onSimulate}
            disabled={isSimulating}
            className="w-full"
            variant={isSimulating ? "secondary" : "default"}
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

          {simulationResult && (
            <>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground">Fidelity</div>
                  <div className="font-mono">
                    {(simulationResult.fidelity * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="bg-muted rounded p-2">
                  <div className="text-muted-foreground">Time</div>
                  <div className="font-mono">
                    {simulationResult.executionTime.toFixed(2)}ms
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Atom className="w-4 h-4" />
                  Qubit States (Bloch Spheres)
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: numQubits }).map((_, i) => renderBlochSphere(i))}
                </div>
              </div>

              {renderHistogram()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
