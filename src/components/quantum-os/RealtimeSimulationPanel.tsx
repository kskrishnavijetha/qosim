
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Zap, Eye, BarChart3 } from 'lucide-react';
import { useQuantumSimulation } from '@/hooks/useQuantumSimulation';

interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  angle?: number;
  controlQubit?: number;
}

interface Circuit {
  id: string;
  name: string;
  gates: Gate[];
  qubits: number;
  modified: boolean;
}

interface RealtimeSimulationPanelProps {
  circuit: Circuit;
}

export function RealtimeSimulationPanel({ circuit }: RealtimeSimulationPanelProps) {
  const { simulationResult, isSimulating, simulate } = useQuantumSimulation();
  const [autoSimulate, setAutoSimulate] = useState(true);

  useEffect(() => {
    if (autoSimulate && circuit.gates.length > 0) {
      simulate(circuit.gates, circuit.qubits);
    }
  }, [circuit.gates, circuit.qubits, autoSimulate, simulate]);

  const BlochSphere = ({ qubit, state }: { qubit: number; state: any }) => {
    const { x, y, z } = state?.blochCoordinates || { x: 0, y: 0, z: 1 };
    
    return (
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 rounded-full border border-quantum-neon/30 bg-gradient-radial from-quantum-void to-quantum-matrix"></div>
        <div 
          className="absolute w-2 h-2 bg-quantum-glow rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-glow"
          style={{
            left: `${50 + x * 30}%`,
            top: `${50 - z * 30}%`,
          }}
        />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-quantum-particle">
          q{qubit}
        </div>
      </div>
    );
  };

  const ProbabilityBar = ({ state, probability }: { state: string; probability: number }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-16 text-xs font-mono text-quantum-neon">|{state}⟩</div>
      <div className="flex-1 h-4 bg-quantum-void rounded overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-quantum-glow to-quantum-energy transition-all duration-300"
          style={{ width: `${probability * 100}%` }}
        />
      </div>
      <div className="w-16 text-xs text-quantum-particle text-right">
        {(probability * 100).toFixed(1)}%
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-quantum-glow">Real-time Simulation</h3>
          <div className="flex items-center gap-2">
            {isSimulating && (
              <div className="w-2 h-2 bg-quantum-energy rounded-full animate-pulse"></div>
            )}
            <Badge variant="outline" className="text-xs">
              {circuit.qubits} qubits
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-quantum-particle">
          <Activity className="w-3 h-3" />
          <span>{circuit.gates.length} gates</span>
          <span>•</span>
          <span>Auto-sim: {autoSimulate ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="state" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-quantum-matrix m-2">
            <TabsTrigger value="state" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              State
            </TabsTrigger>
            <TabsTrigger value="bloch" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Bloch
            </TabsTrigger>
            <TabsTrigger value="probs" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" />
              Probs
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="state" className="p-4 space-y-4">
              {simulationResult ? (
                <>
                  <Card className="quantum-panel">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-quantum-glow">Quantum State</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs font-mono text-quantum-neon break-all">
                        {simulationResult.stateVector.slice(0, 4).map((amp, i) => (
                          <div key={i} className="mb-1">
                            |{i.toString(2).padStart(circuit.qubits, '0')}⟩: {amp.real.toFixed(3)}
                            {amp.imag >= 0 ? '+' : ''}{amp.imag.toFixed(3)}i
                          </div>
                        ))}
                        {simulationResult.stateVector.length > 4 && (
                          <div className="text-quantum-particle">... and {simulationResult.stateVector.length - 4} more</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="quantum-panel">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-quantum-glow">Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-quantum-particle">Fidelity:</span>
                        <span className="text-quantum-glow font-mono">
                          {((simulationResult.fidelity || 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-quantum-particle">Execution:</span>
                        <span className="text-quantum-energy font-mono">
                          {(simulationResult.executionTime || 0).toFixed(1)}ms
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-8 text-quantum-particle">
                  <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add gates to see simulation</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bloch" className="p-4">
              {simulationResult ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: Math.min(circuit.qubits, 4) }).map((_, i) => (
                      <BlochSphere
                        key={i}
                        qubit={i}
                        state={simulationResult.qubitStates?.[i]}
                      />
                    ))}
                  </div>
                  {circuit.qubits > 4 && (
                    <div className="text-center text-xs text-quantum-particle">
                      Showing first 4 qubits
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-quantum-particle">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Bloch spheres will appear here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="probs" className="p-4">
              {simulationResult?.measurementProbabilities ? (
                <div className="space-y-2">
                  {simulationResult.measurementProbabilities
                    .map((prob, i) => ({
                      state: i.toString(2).padStart(circuit.qubits, '0'),
                      probability: prob
                    }))
                    .filter(item => item.probability > 0.001)
                    .slice(0, 8)
                    .map(({ state, probability }) => (
                      <ProbabilityBar
                        key={state}
                        state={state}
                        probability={probability}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-quantum-particle">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Probabilities will appear here</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
