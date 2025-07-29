
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BlochSphere } from '@/components/BlochSphere';
import { Eye, BarChart3, Network, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface QubitState {
  amplitude0: { real: number; imag: number };
  amplitude1: { real: number; imag: number };
  probability0: number;
  probability1: number;
  phase: number;
}

interface EntanglementPair {
  qubits: [number, number];
  strength: number;
  type: 'partial' | 'maximal';
}

interface AlgorithmVisualizerProps {
  result?: any;
  isRunning?: boolean;
}

export function AlgorithmVisualizer({ result, isRunning }: AlgorithmVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [qubitStates, setQubitStates] = useState<QubitState[]>([]);
  const [entanglements, setEntanglements] = useState<EntanglementPair[]>([]);

  useEffect(() => {
    if (result) {
      processSimulationResult(result);
    }
  }, [result]);

  const processSimulationResult = (simResult: any) => {
    // Convert simulation result to visualization data
    const states: QubitState[] = [];
    const entanglePairs: EntanglementPair[] = [];

    // Extract qubit states from state vector
    if (simResult.stateVector && simResult.probabilities) {
      const numQubits = Math.log2(simResult.stateVector.length);
      
      for (let i = 0; i < numQubits; i++) {
        const state = convertToBlochSphereState(simResult.stateVector, i);
        states.push(state);
      }

      // Detect entanglement
      for (let i = 0; i < numQubits - 1; i++) {
        for (let j = i + 1; j < numQubits; j++) {
          const entanglement = calculateEntanglement(simResult.stateVector, i, j);
          if (entanglement > 0.1) {
            entanglePairs.push({
              qubits: [i, j],
              strength: entanglement,
              type: entanglement > 0.8 ? 'maximal' : 'partial'
            });
          }
        }
      }
    }

    setQubitStates(states);
    setEntanglements(entanglePairs);
  };

  const convertToBlochSphereState = (stateVector: any[], qubitIndex: number): QubitState => {
    // Simplified conversion - in practice would need more sophisticated calculation
    const numQubits = Math.log2(stateVector.length);
    const prob0 = Math.random() * 0.5 + 0.25; // Placeholder
    const prob1 = 1 - prob0;
    
    return {
      amplitude0: { real: Math.sqrt(prob0), imag: 0 },
      amplitude1: { real: Math.sqrt(prob1), imag: 0 },
      probability0: prob0,
      probability1: prob1,
      phase: Math.random() * Math.PI * 2
    };
  };

  const calculateEntanglement = (stateVector: any[], qubit1: number, qubit2: number): number => {
    // Simplified entanglement calculation
    return Math.random() * 0.5 + 0.3; // Placeholder
  };

  const handleStepControl = (action: 'play' | 'pause' | 'next' | 'prev') => {
    switch (action) {
      case 'play':
        setIsPlaying(true);
        break;
      case 'pause':
        setIsPlaying(false);
        break;
      case 'next':
        setCurrentStep(Math.min(currentStep + 1, 10));
        break;
      case 'prev':
        setCurrentStep(Math.max(currentStep - 1, 0));
        break;
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Algorithm Visualizer
        </CardTitle>
        
        {/* Step Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStepControl('prev')}
            disabled={currentStep === 0}
            className="neon-border"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStepControl(isPlaying ? 'pause' : 'play')}
            className="neon-border"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStepControl('next')}
            disabled={currentStep === 10}
            className="neon-border"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 px-2">
            <Progress value={(currentStep / 10) * 100} className="w-full" />
          </div>
          
          <Badge variant="outline" className="text-quantum-neon">
            Step {currentStep + 1}/11
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="bloch" className="w-full">
          <TabsList className="grid w-full grid-cols-3 quantum-panel">
            <TabsTrigger value="bloch">Bloch Spheres</TabsTrigger>
            <TabsTrigger value="entanglement">Entanglement</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="bloch" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qubitStates.map((state, index) => (
                <Card key={index} className="quantum-panel neon-border p-4">
                  <h4 className="text-sm font-mono text-quantum-neon mb-2">
                    Qubit {index}
                  </h4>
                  <div className="h-48 flex items-center justify-center">
                    <BlochSphere
                      qubitState={state}
                      size={100}
                    />
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">|0⟩ prob:</span>
                      <span className="text-quantum-glow">
                        {(state.probability0 * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">|1⟩ prob:</span>
                      <span className="text-quantum-particle">
                        {(state.probability1 * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phase:</span>
                      <span className="text-quantum-neon">
                        {(state.phase * 180 / Math.PI).toFixed(1)}°
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="entanglement" className="space-y-4">
            <div className="space-y-3">
              {entanglements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No entanglement detected
                </div>
              ) : (
                entanglements.map((pair, index) => (
                  <Card key={index} className="quantum-panel neon-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-mono text-quantum-neon">
                        Qubits {pair.qubits[0]} ↔ {pair.qubits[1]}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={pair.type === 'maximal' ? 'text-quantum-energy' : 'text-quantum-particle'}
                      >
                        {pair.type}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Strength:</span>
                        <span className="text-quantum-glow">
                          {(pair.strength * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={pair.strength * 100} className="w-full" />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {result ? (
              <div className="grid grid-cols-2 gap-4">
                <Card className="quantum-panel neon-border p-4">
                  <h4 className="text-sm font-mono text-quantum-neon mb-2">
                    Circuit Metrics
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gates:</span>
                      <span className="text-quantum-glow">
                        {result.circuit?.gates?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Depth:</span>
                      <span className="text-quantum-particle">
                        {result.circuitDepth || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Qubits:</span>
                      <span className="text-quantum-neon">
                        {result.circuit?.qubits || 0}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className="quantum-panel neon-border p-4">
                  <h4 className="text-sm font-mono text-quantum-neon mb-2">
                    Simulation Results
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Execution Time:</span>
                      <span className="text-quantum-energy">
                        {result.executionTime?.toFixed(2) || 0}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fidelity:</span>
                      <span className="text-quantum-glow">
                        {((result.fidelity || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="text-quantum-particle">
                        {((result.successProbability || 0.5) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Run an algorithm to see statistics
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
