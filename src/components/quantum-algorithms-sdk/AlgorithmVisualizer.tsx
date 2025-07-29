
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Eye, Activity, Zap, BarChart3, Sphere, Network } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

export interface AlgorithmVisualizerProps {
  algorithm: Algorithm | null;
  simulationResult: any;
  isExecuting: boolean;
}

export function AlgorithmVisualizer({ 
  algorithm, 
  simulationResult, 
  isExecuting 
}: AlgorithmVisualizerProps) {
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (simulationResult && !isAnimating) {
      setIsAnimating(true);
      let step = 0;
      const interval = setInterval(() => {
        setAnimationStep(step++);
        if (step >= 10) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [simulationResult, isAnimating]);

  const blochSphereData = useMemo(() => {
    if (!simulationResult?.stateVector) return [];
    
    return simulationResult.stateVector.map((amplitude: any, index: number) => ({
      x: amplitude.real * Math.cos(index * Math.PI / 4),
      y: amplitude.imag * Math.sin(index * Math.PI / 4),
      z: (amplitude.real * amplitude.real + amplitude.imag * amplitude.imag) * 2 - 1,
      probability: amplitude.real * amplitude.real + amplitude.imag * amplitude.imag
    }));
  }, [simulationResult]);

  const entanglementData = useMemo(() => {
    if (!simulationResult?.stateVector) return [];
    
    const entanglements = [];
    for (let i = 0; i < Math.min(4, simulationResult.stateVector.length); i++) {
      for (let j = i + 1; j < Math.min(4, simulationResult.stateVector.length); j++) {
        const correlation = Math.abs(simulationResult.stateVector[i].real * simulationResult.stateVector[j].real);
        if (correlation > 0.1) {
          entanglements.push({
            qubit1: i,
            qubit2: j,
            strength: correlation,
            type: correlation > 0.5 ? 'strong' : 'weak'
          });
        }
      }
    }
    return entanglements;
  }, [simulationResult]);

  const measurementStats = useMemo(() => {
    if (!simulationResult?.measurementProbabilities) return [];
    
    return simulationResult.measurementProbabilities.map((prob: number, index: number) => ({
      state: index.toString(2).padStart(3, '0'),
      probability: prob,
      percentage: (prob * 100).toFixed(2)
    })).filter((stat: any) => stat.probability > 0.01);
  }, [simulationResult]);

  if (!algorithm) {
    return (
      <div className="flex items-center justify-center h-full bg-quantum-void">
        <div className="text-center">
          <Eye className="w-16 h-16 text-quantum-particle mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-quantum-glow mb-2">Algorithm Visualizer</h3>
          <p className="text-quantum-particle">Select and execute an algorithm to see its visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-quantum-glow" />
            <h2 className="text-lg font-semibold text-quantum-glow">Algorithm Visualizer</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-quantum-particle">
              {algorithm.name}
            </Badge>
            {isExecuting && (
              <Badge variant="outline" className="text-quantum-energy animate-pulse">
                Executing
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="bloch" className="h-full flex flex-col">
          <TabsList className="flex-none grid w-full grid-cols-4 bg-quantum-matrix border-b border-quantum-neon/20">
            <TabsTrigger value="bloch" className="flex items-center gap-2">
              <Sphere className="w-4 h-4" />
              Bloch Sphere
            </TabsTrigger>
            <TabsTrigger value="entanglement" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Entanglement
            </TabsTrigger>
            <TabsTrigger value="measurement" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Measurement
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Step-by-Step
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bloch" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Bloch Sphere Visualization</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-quantum-void rounded-lg p-4 flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Bloch Sphere Visualization */}
                        <div className="absolute inset-0 rounded-full border-2 border-quantum-neon/30">
                          {blochSphereData.map((point, index) => (
                            <div
                              key={index}
                              className={`absolute w-3 h-3 rounded-full ${
                                index === selectedQubit ? 'bg-quantum-glow' : 'bg-quantum-neon'
                              } animate-pulse`}
                              style={{
                                left: `${50 + point.x * 40}%`,
                                top: `${50 - point.y * 40}%`,
                                transform: 'translate(-50%, -50%)',
                                opacity: point.probability
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Axes */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-quantum-particle/50" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-0.5 h-full bg-quantum-particle/50" />
                        </div>
                        
                        {/* Labels */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-quantum-particle text-xs">
                          |0⟩
                        </div>
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-quantum-particle text-xs">
                          |1⟩
                        </div>
                        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-quantum-particle text-xs">
                          |-⟩
                        </div>
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-quantum-particle text-xs">
                          |+⟩
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Qubit States</h4>
                        <div className="space-y-2">
                          {blochSphereData.slice(0, 4).map((point, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded cursor-pointer transition-colors ${
                                index === selectedQubit 
                                  ? 'bg-quantum-glow text-quantum-void' 
                                  : 'bg-quantum-matrix text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void'
                              }`}
                              onClick={() => setSelectedQubit(index)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-mono">Qubit {index}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(point.probability * 100).toFixed(1)}%
                                </Badge>
                              </div>
                              <div className="text-xs mt-1">
                                x: {point.x.toFixed(3)}, y: {point.y.toFixed(3)}, z: {point.z.toFixed(3)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entanglement" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Entanglement Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-quantum-void rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-quantum-glow mb-4">Entanglement Map</h4>
                      <div className="relative w-full h-48">
                        {/* Qubit nodes */}
                        {[0, 1, 2, 3].map((qubit) => (
                          <div
                            key={qubit}
                            className="absolute w-8 h-8 rounded-full bg-quantum-neon flex items-center justify-center text-quantum-void text-xs font-bold"
                            style={{
                              left: `${25 + (qubit % 2) * 50}%`,
                              top: `${25 + Math.floor(qubit / 2) * 50}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            {qubit}
                          </div>
                        ))}
                        
                        {/* Entanglement connections */}
                        {entanglementData.map((ent, index) => (
                          <svg
                            key={index}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                          >
                            <line
                              x1={`${25 + (ent.qubit1 % 2) * 50}%`}
                              y1={`${25 + Math.floor(ent.qubit1 / 2) * 50}%`}
                              x2={`${25 + (ent.qubit2 % 2) * 50}%`}
                              y2={`${25 + Math.floor(ent.qubit2 / 2) * 50}%`}
                              stroke={ent.type === 'strong' ? '#00ff41' : '#0066ff'}
                              strokeWidth={ent.strength * 4}
                              className="animate-pulse"
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Entanglement Pairs</h4>
                        <div className="space-y-2">
                          {entanglementData.length > 0 ? (
                            entanglementData.map((ent, index) => (
                              <div key={index} className="p-2 bg-quantum-matrix rounded">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-mono text-quantum-neon">
                                    Q{ent.qubit1} ↔ Q{ent.qubit2}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={ent.type === 'strong' ? 'text-quantum-glow' : 'text-quantum-particle'}
                                  >
                                    {ent.type}
                                  </Badge>
                                </div>
                                <div className="mt-1">
                                  <div className="text-xs text-quantum-particle">
                                    Strength: {(ent.strength * 100).toFixed(1)}%
                                  </div>
                                  <Progress value={ent.strength * 100} className="mt-1 h-1" />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-quantum-particle text-center py-4">
                              No entanglement detected
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="measurement" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Measurement Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Probability Distribution</h4>
                        <div className="space-y-2">
                          {measurementStats.map((stat, index) => (
                            <div key={index} className="p-2 bg-quantum-matrix rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-mono text-quantum-neon">
                                  |{stat.state}⟩
                                </span>
                                <Badge variant="outline" className="text-quantum-glow">
                                  {stat.percentage}%
                                </Badge>
                              </div>
                              <Progress value={stat.probability * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Measurement Chart</h4>
                        <div className="bg-quantum-void rounded-lg p-4 h-48">
                          <div className="flex items-end justify-center h-full space-x-2">
                            {measurementStats.map((stat, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div
                                  className="bg-quantum-glow rounded-t"
                                  style={{
                                    width: '20px',
                                    height: `${stat.probability * 150}px`,
                                    minHeight: '2px'
                                  }}
                                />
                                <div className="text-xs text-quantum-particle mt-1">
                                  |{stat.state}⟩
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Step-by-Step Execution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setIsAnimating(!isAnimating)}
                        className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                      >
                        {isAnimating ? 'Pause' : 'Play'} Animation
                      </Button>
                      <Badge variant="outline" className="text-quantum-particle">
                        Step {animationStep + 1}/10
                      </Badge>
                    </div>
                    
                    <div className="bg-quantum-void rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-quantum-glow mb-2">Algorithm Steps</h4>
                      <div className="space-y-2">
                        {getAlgorithmSteps(algorithm).map((step, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded transition-colors ${
                              index <= animationStep
                                ? 'bg-quantum-glow text-quantum-void'
                                : 'bg-quantum-matrix text-quantum-particle'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-quantum-neon flex items-center justify-center text-quantum-void text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-sm">{step}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getAlgorithmSteps(algorithm: Algorithm): string[] {
  switch (algorithm.id) {
    case 'bell-state':
      return [
        'Initialize qubits in |00⟩ state',
        'Apply Hadamard gate to qubit 0',
        'Apply CNOT gate with control=0, target=1',
        'Measure final entangled state',
        'Verify maximum entanglement'
      ];
    case 'grovers-search':
      return [
        'Initialize qubits in superposition',
        'Apply oracle to mark target state',
        'Apply diffusion operator',
        'Repeat Grover iteration',
        'Measure with high probability of success'
      ];
    case 'qft':
      return [
        'Initialize input state',
        'Apply Hadamard gates',
        'Apply controlled rotation gates',
        'Swap qubits for correct order',
        'Output frequency domain representation'
      ];
    default:
      return [
        'Initialize quantum state',
        'Apply quantum gates',
        'Perform measurements',
        'Analyze results'
      ];
  }
}
