
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Eye, Zap, Activity, BarChart3 } from 'lucide-react';
import { Algorithm, SDKExecutionResult } from './QuantumAlgorithmsSDK';

interface AlgorithmVisualizerProps {
  result: SDKExecutionResult | null;
  algorithm: Algorithm | null;
}

export function AlgorithmVisualizer({ result, algorithm }: AlgorithmVisualizerProps) {
  const stateData = useMemo(() => {
    if (!result) return null;
    
    return result.stateVector.map((amplitude, index) => ({
      state: `|${index.toString(2).padStart(Math.log2(result.stateVector.length), '0')}⟩`,
      amplitude: Math.sqrt(amplitude.real * amplitude.real + amplitude.imag * amplitude.imag),
      probability: Math.pow(Math.sqrt(amplitude.real * amplitude.real + amplitude.imag * amplitude.imag), 2),
      phase: Math.atan2(amplitude.imag, amplitude.real) * 180 / Math.PI
    }));
  }, [result]);

  const entanglementVisualization = useMemo(() => {
    if (!result?.entanglement) return null;
    
    return {
      pairs: result.entanglement.pairs,
      strength: result.entanglement.strength,
      isEntangled: result.entanglement.strength > 0.1
    };
  }, [result]);

  if (!result || !algorithm) {
    return (
      <Card className="h-full quantum-panel neon-border">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <Eye className="w-16 h-16 mx-auto text-quantum-particle/50 mb-4" />
            <p className="text-quantum-particle">Execute an algorithm to see visualization results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Execution Summary */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Execution Results: {algorithm.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-quantum-neon">{result.executionTime.toFixed(1)}ms</div>
              <div className="text-xs text-quantum-particle">Execution Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-quantum-energy">{result.circuitDepth}</div>
              <div className="text-xs text-quantum-particle">Circuit Depth</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-quantum-glow">{(result.fidelity * 100).toFixed(1)}%</div>
              <div className="text-xs text-quantum-particle">Fidelity</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-quantum-matrix">
                {Object.values(result.gateCount).reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-xs text-quantum-particle">Total Gates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Visualization */}
      <Card className="flex-1 quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Quantum State Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <Tabs defaultValue="states" className="flex-1 flex flex-col">
            <TabsList className="w-fit">
              <TabsTrigger value="states">State Vector</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="entanglement">Entanglement</TabsTrigger>
              <TabsTrigger value="gates">Gate Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="states" className="flex-1 mt-4">
              <div className="space-y-3 h-full overflow-y-auto">
                {stateData?.map((state, index) => (
                  <div key={index} className="bg-quantum-void rounded-lg border border-quantum-matrix p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-quantum-glow">{state.state}</span>
                      <Badge variant="outline" className="text-quantum-neon">
                        {(state.probability * 100).toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-quantum-particle mb-1">
                          <span>Amplitude</span>
                          <span>{state.amplitude.toFixed(4)}</span>
                        </div>
                        <Progress 
                          value={state.amplitude * 100} 
                          className="h-2 bg-quantum-matrix"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-quantum-particle mb-1">
                          <span>Phase</span>
                          <span>{state.phase.toFixed(1)}°</span>
                        </div>
                        <div className="w-full bg-quantum-matrix rounded-full h-2 relative">
                          <div 
                            className="h-2 bg-quantum-energy rounded-full transition-all"
                            style={{ width: `${Math.abs(state.phase) / 180 * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="measurements" className="flex-1 mt-4">
              <div className="space-y-4 h-full overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.measurementProbabilities.map((prob, index) => (
                    <Card key={index} className="quantum-panel border-quantum-matrix">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-quantum-glow">
                            |{index.toString(2).padStart(Math.log2(result.measurementProbabilities.length), '0')}⟩
                          </span>
                          <span className="text-quantum-neon font-semibold">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={prob * 100} 
                          className="h-3"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="entanglement" className="flex-1 mt-4">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-quantum-energy mb-2">
                    {(entanglementVisualization?.strength || 0 * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-quantum-particle">Entanglement Strength</div>
                  <Badge 
                    variant={entanglementVisualization?.isEntangled ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {entanglementVisualization?.isEntangled ? "Entangled" : "Separable"}
                  </Badge>
                </div>

                {entanglementVisualization?.pairs && entanglementVisualization.pairs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-quantum-neon mb-3">Entangled Qubit Pairs</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {entanglementVisualization.pairs.map((pair, index) => (
                        <div key={index} className="bg-quantum-void rounded-lg border border-quantum-matrix p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-quantum-glow">
                              Qubit {pair[0]} ↔ Qubit {pair[1]}
                            </span>
                            <div className="w-24 bg-quantum-matrix rounded-full h-2">
                              <div 
                                className="h-2 bg-quantum-energy rounded-full transition-all"
                                style={{ width: `${entanglementVisualization.strength * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="gates" className="flex-1 mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(result.gateCount).map(([gate, count]) => (
                    <Card key={gate} className="quantum-panel border-quantum-matrix">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-quantum-neon mb-1">{count}</div>
                        <div className="text-sm text-quantum-particle">{gate} Gates</div>
                        <Progress 
                          value={(count / Math.max(...Object.values(result.gateCount))) * 100} 
                          className="mt-2 h-2"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
