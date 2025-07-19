
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Gate } from '@/hooks/useCircuitState';
import { Play, Pause, RotateCcw, Zap, BarChart3, Cpu, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface SimulationRunnerProps {
  circuit: Gate[];
  onSimulationComplete: (result: any) => void;
  simulationResult: any;
}

export function SimulationRunner({ 
  circuit, 
  onSimulationComplete, 
  simulationResult 
}: SimulationRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationMode, setSimulationMode] = useState('local');
  const [shots, setShots] = useState(1024);
  const [progress, setProgress] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

  const simulationModes = [
    { id: 'local', name: 'Local Classical', description: 'Fast local simulation' },
    { id: 'statevector', name: 'State Vector', description: 'Full quantum state simulation' },
    { id: 'qasm', name: 'QASM Simulator', description: 'Shot-based simulation' },
    { id: 'noisy', name: 'Noisy Simulation', description: 'Include quantum noise models' }
  ];

  const runSimulation = async () => {
    if (circuit.length === 0) {
      toast.error('No Circuit', { description: 'Please add gates to the circuit first' });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    const startTime = performance.now();

    toast.info('Simulation Started', { 
      description: `Running ${simulationMode} simulation with ${shots} shots` 
    });

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mock simulation result
      const endTime = performance.now();
      const executionTimeMs = endTime - startTime;
      setExecutionTime(executionTimeMs);

      const result = {
        stateVector: generateMockStateVector(circuit),
        probabilities: generateMockProbabilities(circuit),
        measurements: generateMockMeasurements(shots),
        executionTime: executionTimeMs,
        shots,
        mode: simulationMode,
        gateCount: circuit.length,
        circuitDepth: Math.max(...circuit.map(g => g.position)) + 1,
        fidelity: 0.95 + Math.random() * 0.05
      };

      onSimulationComplete(result);
      toast.success('Simulation Complete', { 
        description: `Finished in ${executionTimeMs.toFixed(1)}ms` 
      });

    } catch (error) {
      toast.error('Simulation Failed', { 
        description: 'An error occurred during simulation' 
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const generateMockStateVector = (gates: Gate[]) => {
    const numQubits = Math.max(5, ...gates.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;
    const stateSize = 2 ** numQubits;
    const stateVector = [];
    
    for (let i = 0; i < stateSize; i++) {
      const amplitude = Math.random() * 0.5;
      const phase = Math.random() * 2 * Math.PI;
      stateVector.push({
        real: amplitude * Math.cos(phase),
        imag: amplitude * Math.sin(phase),
        magnitude: amplitude,
        phase
      });
    }
    
    return stateVector;
  };

  const generateMockProbabilities = (gates: Gate[]) => {
    const numQubits = Math.max(5, ...gates.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;
    const stateSize = 2 ** numQubits;
    const probabilities = [];
    let sum = 0;
    
    for (let i = 0; i < stateSize; i++) {
      const prob = Math.random();
      probabilities.push(prob);
      sum += prob;
    }
    
    // Normalize
    return probabilities.map(p => p / sum);
  };

  const generateMockMeasurements = (shotCount: number) => {
    const results: { [state: string]: number } = {};
    
    for (let i = 0; i < shotCount; i++) {
      const state = Math.floor(Math.random() * 32).toString(2).padStart(5, '0');
      results[state] = (results[state] || 0) + 1;
    }
    
    return results;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono text-quantum-glow">Classical Simulation Backend</h3>
          <p className="text-sm text-quantum-particle">
            Run quantum circuits on classical hardware
          </p>
        </div>
        <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
          {circuit.length} Gates
        </Badge>
      </div>

      {/* Simulation Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Simulation Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-quantum-particle mb-2 block">Backend</label>
              <Select value={simulationMode} onValueChange={setSimulationMode}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  {simulationModes.map(mode => (
                    <SelectItem key={mode.id} value={mode.id}>
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-quantum-particle mb-2 block">Shots</label>
              <Select value={shots.toString()} onValueChange={(value) => setShots(parseInt(value))}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="100">100 shots</SelectItem>
                  <SelectItem value="1024">1,024 shots</SelectItem>
                  <SelectItem value="4096">4,096 shots</SelectItem>
                  <SelectItem value="8192">8,192 shots</SelectItem>
                  <SelectItem value="65536">65,536 shots</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={runSimulation}
                disabled={isRunning || circuit.length === 0}
                className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
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

          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-quantum-particle">Simulation Progress</span>
                <span className="text-quantum-neon">{progress}%</span>
              </div>
              <Progress value={progress} className="quantum-progress" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {simulationResult && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="quantum-tabs">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
                <TabsTrigger value="statevector">State Vector</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="quantum-panel neon-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Execution Time</div>
                    <div className="text-lg font-mono text-quantum-energy flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      {simulationResult.executionTime?.toFixed(1)}ms
                    </div>
                  </div>
                  <div className="quantum-panel neon-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Fidelity</div>
                    <div className="text-lg font-mono text-quantum-glow">
                      {(simulationResult.fidelity * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div className="quantum-panel neon-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Circuit Depth</div>
                    <div className="text-lg font-mono text-quantum-neon">
                      {simulationResult.circuitDepth}
                    </div>
                  </div>
                  <div className="quantum-panel neon-border p-3 text-center">
                    <div className="text-xs text-muted-foreground">Gate Count</div>
                    <div className="text-lg font-mono text-quantum-particle">
                      {simulationResult.gateCount}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="measurements" className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-auto">
                  {Object.entries(simulationResult.measurements || {}).slice(0, 10).map(([state, count]) => (
                    <div key={state} className="flex items-center justify-between p-2 quantum-panel neon-border">
                      <span className="font-mono text-quantum-neon">|{state}⟩</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-quantum-particle">{count} shots</span>
                        <div className="w-24 bg-quantum-matrix rounded-full h-2">
                          <div 
                            className="bg-quantum-glow h-2 rounded-full"
                            style={{ width: `${(count as number / shots) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-quantum-energy">
                          {((count as number / shots) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="statevector" className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-auto">
                  {simulationResult.stateVector?.slice(0, 16).map((state: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 quantum-panel neon-border">
                      <span className="font-mono text-quantum-neon">
                        |{index.toString(2).padStart(5, '0')}⟩
                      </span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-quantum-particle">
                          {state.real.toFixed(3)} + {state.imag.toFixed(3)}i
                        </span>
                        <span className="text-quantum-energy">
                          |ψ|² = {(state.magnitude ** 2).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
