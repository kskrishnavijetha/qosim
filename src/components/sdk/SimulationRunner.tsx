
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { Play, Pause, RotateCcw, Zap, Cloud, Cpu, Activity } from 'lucide-react';

interface SimulationRunnerProps {
  circuit: Gate[];
  simulationResult: OptimizedSimulationResult | null;
  onSimulationComplete: (result: any) => void;
}

export function SimulationRunner({ 
  circuit, 
  simulationResult, 
  onSimulationComplete 
}: SimulationRunnerProps) {
  const [simulationMode, setSimulationMode] = useState<'local' | 'cloud'>('local');
  const [selectedBackend, setSelectedBackend] = useState<'qiskit' | 'qutip' | 'braket'>('qiskit');
  const [shots, setShots] = useState(1024);
  const [isRunning, setIsRunning] = useState(false);
  
  const { executeCircuit, isExecuting, lastResult } = useQuantumBackend();

  const handleRunSimulation = async () => {
    if (circuit.length === 0) return;
    
    setIsRunning(true);
    try {
      const result = await executeCircuit(circuit, selectedBackend, shots);
      if (result) {
        onSimulationComplete(result);
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const backends = [
    { id: 'qiskit', name: 'Qiskit', icon: <Cpu className="w-4 h-4" />, description: 'IBM Quantum simulator' },
    { id: 'qutip', name: 'QuTiP', icon: <Activity className="w-4 h-4" />, description: 'Quantum toolbox in Python' },
    { id: 'braket', name: 'Braket', icon: <Cloud className="w-4 h-4" />, description: 'AWS Quantum computing' }
  ];

  const shotOptions = [256, 512, 1024, 2048, 4096, 8192];

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Quantum Simulation Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Backend Selection */}
            <div>
              <label className="text-sm font-medium text-quantum-particle mb-2 block">
                Quantum Backend
              </label>
              <Select value={selectedBackend} onValueChange={(value: any) => setSelectedBackend(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select backend" />
                </SelectTrigger>
                <SelectContent>
                  {backends.map(backend => (
                    <SelectItem key={backend.id} value={backend.id}>
                      <div className="flex items-center space-x-2">
                        {backend.icon}
                        <div>
                          <div className="font-medium">{backend.name}</div>
                          <div className="text-xs text-muted-foreground">{backend.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shots Configuration */}
            <div>
              <label className="text-sm font-medium text-quantum-particle mb-2 block">
                Measurement Shots
              </label>
              <Select value={shots.toString()} onValueChange={(value) => setShots(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shots" />
                </SelectTrigger>
                <SelectContent>
                  {shotOptions.map(shotCount => (
                    <SelectItem key={shotCount} value={shotCount.toString()}>
                      {shotCount.toLocaleString()} shots
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleRunSimulation}
                disabled={circuit.length === 0 || isRunning || isExecuting}
                className="w-full"
              >
                {isRunning || isExecuting ? (
                  <>
                    <Pause className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Circuit Info */}
          <div className="flex items-center justify-between p-3 bg-quantum-matrix rounded-lg">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-quantum-neon">Circuit:</span>
              <span>{circuit.length} gates</span>
              <span>•</span>
              <span>5 qubits</span>
            </div>
            <Badge variant="outline" className="text-quantum-glow">
              {selectedBackend.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Tabs defaultValue="state-vector" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="state-vector">State Vector</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="bloch-sphere">Bloch Sphere</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="state-vector" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon">Quantum State Vector</CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {lastResult.stateVector.map((amplitude, index) => (
                      <div key={index} className="p-2 bg-quantum-void rounded border">
                        <div className="text-xs text-quantum-neon">
                          |{index.toString(2).padStart(3, '0')}⟩
                        </div>
                        <div className="text-xs text-quantum-particle">
                          {amplitude.real.toFixed(3)}
                          {amplitude.imaginary >= 0 ? '+' : ''}
                          {amplitude.imaginary.toFixed(3)}i
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Execution time: {lastResult.executionTime.toFixed(2)}ms
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Run a simulation to see the state vector
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon">Measurement Results</CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult ? (
                <div className="space-y-3">
                  {Object.entries(lastResult.measurementProbabilities).map(([state, probability]) => (
                    <div key={state} className="flex items-center justify-between p-2 bg-quantum-void rounded">
                      <span className="text-quantum-neon font-mono">|{state}⟩</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-quantum-matrix rounded-full h-2">
                          <div 
                            className="bg-quantum-glow h-2 rounded-full transition-all duration-300"
                            style={{ width: `${typeof probability === 'number' ? probability * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-quantum-particle w-12 text-right">
                          {typeof probability === 'number' ? (probability * 100).toFixed(1) : '0.0'}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Run a simulation to see measurement results
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bloch-sphere" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon">Qubit Bloch Spheres</CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lastResult.qubitStates.map((qubit, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-quantum-neon mb-2">Qubit {index}</div>
                      <div className="w-24 h-24 bg-quantum-matrix rounded-full mx-auto flex items-center justify-center">
                        <div className="w-2 h-2 bg-quantum-glow rounded-full"></div>
                      </div>
                      <div className="text-xs text-quantum-particle mt-2">
                        {qubit.state}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Run a simulation to see Bloch sphere representations
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon">Simulation Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-quantum-void rounded">
                    <div className="text-lg font-mono text-quantum-glow">
                      {lastResult.executionTime.toFixed(2)}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Execution Time</div>
                  </div>
                  <div className="text-center p-3 bg-quantum-void rounded">
                    <div className="text-lg font-mono text-quantum-neon">
                      {lastResult.backend?.toUpperCase() || 'LOCAL'}
                    </div>
                    <div className="text-xs text-muted-foreground">Backend</div>
                  </div>
                  <div className="text-center p-3 bg-quantum-void rounded">
                    <div className="text-lg font-mono text-quantum-energy">
                      {shots}
                    </div>
                    <div className="text-xs text-muted-foreground">Shots</div>
                  </div>
                  <div className="text-center p-3 bg-quantum-void rounded">
                    <div className="text-lg font-mono text-quantum-particle">
                      {lastResult.stateVector.length}
                    </div>
                    <div className="text-xs text-muted-foreground">State Dimensions</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Run a simulation to see statistics
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
