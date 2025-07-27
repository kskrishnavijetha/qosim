
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Zap, Target, TrendingUp, Eye, RotateCw } from 'lucide-react';

interface SimulationPanelProps {
  result: OptimizedSimulationResult | null;
}

export function SimulationPanel({ result }: SimulationPanelProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    if (result) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              No Simulation Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add gates to your circuit and click "Simulate" to see results.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const probabilityData = result.measurementProbabilities.map((prob, index) => ({
    state: `|${index.toString(2).padStart(3, '0')}⟩`,
    probability: prob * 100,
    amplitude: Math.sqrt(prob)
  })).filter(item => item.probability > 0.01);

  const qubitData = result.qubitStates.map((qubit, index) => ({
    qubit: `Q${index}`,
    probability: qubit.probability * 100,
    coherence: qubit.coherence || 95 + Math.random() * 5
  }));

  const entanglementData = result.entanglement?.pairs.map((pair, index) => ({
    name: `Q${pair.qubit1}-Q${pair.qubit2}`,
    strength: pair.strength * 100,
    color: `hsl(${index * 60}, 70%, 60%)`
  })) || [];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="states" className="text-xs">States</TabsTrigger>
          <TabsTrigger value="qubits" className="text-xs">Qubits</TabsTrigger>
          <TabsTrigger value="entanglement" className="text-xs">Entanglement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Simulation Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-mono text-primary">
                    {result.executionTime.toFixed(1)}ms
                  </div>
                  <div className="text-xs text-muted-foreground">Execution Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono text-primary">
                    {(result.fidelity * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Fidelity</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mode: {result.mode}</span>
                  <Badge variant="outline">{result.stateVector.length} states</Badge>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Entanglement:</span>
                  <span className="font-mono">
                    {result.entanglement?.totalEntanglement.toFixed(3) || '0.000'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1">Quantum Coherence</div>
                <Progress value={result.fidelity * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                State Probabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={probabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Probability']} />
                  <Bar dataKey="probability" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">State Vector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {result.stateVector.map((amplitude, index) => {
                  const prob = Math.abs(amplitude.real * amplitude.real + amplitude.imag * amplitude.imag);
                  const binaryState = index.toString(2).padStart(3, '0');
                  
                  if (prob < 0.001) return null;
                  
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-mono">|{binaryState}⟩</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">
                          {amplitude.real.toFixed(3)} + {amplitude.imag.toFixed(3)}i
                        </span>
                        <div className="w-16 bg-muted rounded">
                          <div 
                            className="h-2 bg-primary rounded" 
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qubits" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Qubit States
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.qubitStates.map((qubit, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm">Qubit {index}</span>
                      <Badge variant="outline">{qubit.state}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Probability:</span>
                        <span className="font-mono">{(qubit.probability * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={qubit.probability * 100} className="h-1" />
                      
                      <div className="flex justify-between text-xs">
                        <span>Phase:</span>
                        <span className="font-mono">{(qubit.phase * 180 / Math.PI).toFixed(1)}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entanglement" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Entanglement Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entanglementData.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-xl font-mono text-primary">
                      {(result.entanglement?.totalEntanglement || 0).toFixed(3)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Entanglement</div>
                  </div>
                  
                  <div className="space-y-2">
                    {entanglementData.map((pair, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-mono">{pair.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded">
                            <div 
                              className="h-2 rounded" 
                              style={{ 
                                width: `${pair.strength}%`,
                                backgroundColor: pair.color 
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono w-12">
                            {pair.strength.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  No entanglement detected
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
