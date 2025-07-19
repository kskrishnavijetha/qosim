
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FastQuantumSimulator as Simulator, SimulationConfig, FastSimulationResult, QuantumOperation, NoiseModel } from '@/lib/fastQuantumSimulator';
import { ProbabilityHistogram } from '../visualization/ProbabilityHistogram';
import { QuantumStateHeatmap } from '../visualization/QuantumStateHeatmap';
import { Play, Pause, RotateCcw, Settings, Zap, Clock, MemoryStick, Layers } from 'lucide-react';

export function FastQuantumSimulator() {
  const [config, setConfig] = useState<SimulationConfig>({
    numQubits: 5,
    shots: 1024,
    idealSimulation: true,
    enableRuntimeAnalysis: true
  });
  
  const [noiseModel, setNoiseModel] = useState<NoiseModel>({
    depolarizing: 0.001,
    amplitude_damping: 0.001,
    phase_damping: 0.001,
    bitFlip: 0.001,
    phaseFlip: 0.001
  });
  
  const [operations, setOperations] = useState<QuantumOperation[]>([
    { type: 'H', qubits: [0] },
    { type: 'CNOT', qubits: [0, 1] },
    { type: 'H', qubits: [2] },
    { type: 'CNOT', qubits: [2, 3] }
  ]);
  
  const [result, setResult] = useState<FastSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setProgress(0);
    setError(null);
    
    try {
      const finalConfig = {
        ...config,
        noiseModel: config.idealSimulation ? undefined : noiseModel
      };
      
      const simulator = new Simulator(finalConfig);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const simulationResult = await simulator.simulate(operations);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(simulationResult);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed');
    } finally {
      setIsSimulating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [config, noiseModel, operations, isSimulating]);

  const addOperation = (type: string, qubits: number[], angle?: number) => {
    const newOp: QuantumOperation = { type, qubits, ...(angle !== undefined && { angle }) };
    setOperations(prev => [...prev, newOp]);
  };

  const removeOperation = (index: number) => {
    setOperations(prev => prev.filter((_, i) => i !== index));
  };

  const resetCircuit = () => {
    setOperations([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fast Quantum Simulator</h2>
          <p className="text-muted-foreground">
            High-performance classical quantum simulation up to 30 qubits
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {config.numQubits} qubits
        </Badge>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Simulation Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="qubits">Number of Qubits</Label>
                <Input
                  id="qubits"
                  type="number"
                  min="1"
                  max="30"
                  value={config.numQubits}
                  onChange={(e) => setConfig(prev => ({ ...prev, numQubits: parseInt(e.target.value) || 1 }))}
                />
              </div>
              
              <div>
                <Label htmlFor="shots">Number of Shots</Label>
                <Input
                  id="shots"
                  type="number"
                  min="1"
                  max="1000000"
                  value={config.shots}
                  onChange={(e) => setConfig(prev => ({ ...prev, shots: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            {/* Simulation Mode */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ideal"
                  checked={config.idealSimulation}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, idealSimulation: checked }))}
                />
                <Label htmlFor="ideal">Ideal Simulation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="runtime"
                  checked={config.enableRuntimeAnalysis}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableRuntimeAnalysis: checked }))}
                />
                <Label htmlFor="runtime">Runtime Analysis</Label>
              </div>
            </div>

            {/* Noise Model (when not ideal) */}
            {!config.idealSimulation && (
              <div className="space-y-4">
                <h4 className="font-medium">Noise Parameters</h4>
                
                <div>
                  <Label>Depolarizing: {noiseModel.depolarizing?.toFixed(4)}</Label>
                  <Slider
                    value={[noiseModel.depolarizing || 0]}
                    onValueChange={([value]) => setNoiseModel(prev => ({ ...prev, depolarizing: value }))}
                    max={0.1}
                    step={0.0001}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Amplitude Damping: {noiseModel.amplitude_damping?.toFixed(4)}</Label>
                  <Slider
                    value={[noiseModel.amplitude_damping || 0]}
                    onValueChange={([value]) => setNoiseModel(prev => ({ ...prev, amplitude_damping: value }))}
                    max={0.1}
                    step={0.0001}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Circuit Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Quantum Circuit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quick Add Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addOperation('H', [0])}
              >
                Add H Gate
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addOperation('X', [0])}
              >
                Add X Gate
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addOperation('CNOT', [0, 1])}
              >
                Add CNOT
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => addOperation('RX', [0], Math.PI/4)}
              >
                Add RX(π/4)
              </Button>
            </div>
            
            {/* Operations List */}
            <div className="space-y-2">
              {operations.map((op, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono">
                    {op.type}({op.qubits.join(', ')}{op.angle ? `, ${op.angle.toFixed(3)}` : ''})
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeOperation(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            
            {operations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No operations added. Use the buttons above to build your circuit.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      <div className="flex gap-4">
        <Button 
          onClick={runSimulation}
          disabled={isSimulating || operations.length === 0}
          className="flex-1 h-12"
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
        
        <Button 
          variant="outline" 
          onClick={resetCircuit}
          className="h-12"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Progress Bar */}
      {isSimulating && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Simulation Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <Tabs defaultValue="histogram" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="histogram">Histogram</TabsTrigger>
            <TabsTrigger value="heatmap">State Heatmap</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="amplitudes">Amplitudes</TabsTrigger>
          </TabsList>

          <TabsContent value="histogram">
            <ProbabilityHistogram 
              counts={result.counts}
              totalShots={config.shots}
            />
          </TabsContent>

          <TabsContent value="heatmap">
            <QuantumStateHeatmap 
              stateVector={result.stateVector}
              numQubits={config.numQubits}
            />
          </TabsContent>

          <TabsContent value="metrics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{result.metrics.executionTime.toFixed(2)}ms</div>
                      <p className="text-sm text-muted-foreground">Execution Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold">{result.metrics.memoryUsage.toFixed(2)}MB</div>
                      <p className="text-sm text-muted-foreground">Memory Usage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-8 h-8 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold">{result.metrics.circuitDepth}</div>
                      <p className="text-sm text-muted-foreground">Circuit Depth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold">{result.metrics.gateCount}</div>
                      <p className="text-sm text-muted-foreground">Gate Count</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <div className="text-2xl font-bold">{(result.metrics.fidelity * 100).toFixed(3)}%</div>
                    <p className="text-sm text-muted-foreground">Simulation Fidelity</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <div className="text-2xl font-bold">{(result.metrics.entanglementMeasure * 100).toFixed(2)}%</div>
                    <p className="text-sm text-muted-foreground">Entanglement Measure</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="amplitudes">
            <Card>
              <CardHeader>
                <CardTitle>State Amplitudes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-auto">
                  {result.amplitudes.slice(0, 32).map((amp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-mono">|{amp.state}⟩</span>
                      <div className="text-right text-sm">
                        <div>
                          {amp.amplitude.real.toFixed(4)} + {amp.amplitude.imaginary.toFixed(4)}i
                        </div>
                        <div className="text-muted-foreground">
                          P = {(amp.probability * 100).toFixed(3)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
