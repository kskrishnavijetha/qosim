
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { SimulationResult, Qubit } from '@/hooks/useCircuitBuilder';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Zap, Timer, Target } from 'lucide-react';

interface StateVisualizerProps {
  simulationResult: SimulationResult | null;
  qubits: Qubit[];
  isSimulating: boolean;
}

export function StateVisualizer({ simulationResult, qubits, isSimulating }: StateVisualizerProps) {
  if (isSimulating) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Simulating...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!simulationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            State Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Run simulation to see quantum state</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare probability data for chart
  const probabilityData = simulationResult.probabilities
    .map((prob, index) => ({
      state: `|${index.toString(2).padStart(qubits.length, '0')}⟩`,
      probability: prob * 100,
      index
    }))
    .filter(item => item.probability > 0.1) // Only show significant probabilities
    .sort((a, b) => b.probability - a.probability);

  const getBarColor = (index: number) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Quantum State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulation Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Zap className="w-3 h-3 mr-1" />
                Fidelity
              </div>
              <div className="font-mono text-sm">
                {(simulationResult.fidelity * 100).toFixed(2)}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground">
                <Timer className="w-3 h-3 mr-1" />
                Exec Time
              </div>
              <div className="font-mono text-sm">
                {simulationResult.executionTime.toFixed(1)}ms
              </div>
            </div>
          </div>

          <Separator />

          {/* Individual Qubit States */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground">Individual Qubits</h4>
            {qubits.map((qubit, index) => (
              <div key={qubit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    |q{index}⟩
                  </Badge>
                  <span className="text-xs font-mono">
                    P(|1⟩) = {qubit.state.probability.toFixed(3)}
                  </span>
                </div>
                <Progress 
                  value={qubit.state.probability * 100} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground">
                  Phase: {qubit.state.phase.toFixed(3)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* State Vector Probabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" />
              State Probabilities
            </h4>
            {probabilityData.length > 0 ? (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={probabilityData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <XAxis 
                      dataKey="state" 
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                    />
                    <Bar dataKey="probability">
                      {probabilityData.map((entry, index) => (
                        <Cell key={index} fill={getBarColor(index)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <span className="text-xs">No significant probabilities to display</span>
              </div>
            )}
          </div>

          {/* Top Measurement Outcomes */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">Top States</h4>
            {probabilityData.slice(0, 5).map((item, index) => (
              <div key={item.state} className="flex items-center justify-between text-xs">
                <span className="font-mono">{item.state}</span>
                <Badge variant="outline" className="text-xs">
                  {item.probability.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
