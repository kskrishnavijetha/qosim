
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Settings, 
  BarChart3, 
  Activity,
  Cpu,
  Clock
} from 'lucide-react';

export function FastQuantumSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [qubits, setQubits] = useState(3);
  const [algorithm, setAlgorithm] = useState('bell-state');
  const [shots, setShots] = useState(1024);
  const [results, setResults] = useState<any>(null);

  const algorithms = [
    { id: 'bell-state', name: 'Bell State', qubits: 2 },
    { id: 'grovers', name: "Grover's Search", qubits: 3 },
    { id: 'qft', name: 'Quantum Fourier Transform', qubits: 3 },
    { id: 'random', name: 'Random Circuit', qubits: 4 },
    { id: 'entanglement', name: 'Entanglement Chain', qubits: 5 }
  ];

  const handleRunSimulation = async () => {
    setIsRunning(true);
    
    // Simulate quantum computation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results
    const mockResults = {
      stateVector: generateMockStateVector(qubits),
      measurements: generateMockMeasurements(qubits, shots),
      executionTime: Math.random() * 100 + 50,
      fidelity: 0.95 + Math.random() * 0.05
    };
    
    setResults(mockResults);
    setIsRunning(false);
  };

  const generateMockStateVector = (numQubits: number) => {
    const size = Math.pow(2, numQubits);
    const stateVector = [];
    for (let i = 0; i < size; i++) {
      stateVector.push({
        real: (Math.random() - 0.5) * 2,
        imag: (Math.random() - 0.5) * 2
      });
    }
    return stateVector;
  };

  const generateMockMeasurements = (numQubits: number, shotCount: number) => {
    const measurements: Record<string, number> = {};
    for (let i = 0; i < Math.pow(2, numQubits); i++) {
      const state = i.toString(2).padStart(numQubits, '0');
      measurements[state] = Math.floor(Math.random() * shotCount / 4);
    }
    return measurements;
  };

  return (
    <div className="space-y-6">
      {/* Simulator Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Fast Quantum Simulator
            <Badge variant="secondary" className="ml-2">BETA</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Algorithm Selection */}
            <div>
              <Label className="text-quantum-particle">Algorithm</Label>
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map(alg => (
                    <SelectItem key={alg.id} value={alg.id}>
                      {alg.name} ({alg.qubits}Q)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Qubits */}
            <div>
              <Label className="text-quantum-particle">Qubits</Label>
              <Input
                type="number"
                value={qubits}
                onChange={(e) => setQubits(parseInt(e.target.value))}
                min={2}
                max={10}
              />
            </div>

            {/* Shots */}
            <div>
              <Label className="text-quantum-particle">Shots</Label>
              <Select value={shots.toString()} onValueChange={(value) => setShots(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="256">256</SelectItem>
                  <SelectItem value="512">512</SelectItem>
                  <SelectItem value="1024">1024</SelectItem>
                  <SelectItem value="2048">2048</SelectItem>
                  <SelectItem value="4096">4096</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-lg font-mono text-quantum-glow">
                {results?.executionTime.toFixed(1) || '0.0'}ms
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center">
                <Clock className="w-3 h-3 mr-1" />
                Execution Time
              </div>
            </div>
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-lg font-mono text-quantum-neon">
                {results?.fidelity.toFixed(3) || '1.000'}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center">
                <Activity className="w-3 h-3 mr-1" />
                Fidelity
              </div>
            </div>
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-lg font-mono text-quantum-energy">
                {Math.pow(2, qubits)}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center">
                <Cpu className="w-3 h-3 mr-1" />
                State Space
              </div>
            </div>
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-lg font-mono text-quantum-particle">
                {shots}
              </div>
              <div className="text-xs text-muted-foreground flex items-center justify-center">
                <BarChart3 className="w-3 h-3 mr-1" />
                Shots
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="measurements" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
                <TabsTrigger value="state-vector">State Vector</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="measurements" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.measurements).map(([state, count]) => (
                    <div key={state} className="flex items-center justify-between p-3 bg-quantum-void rounded">
                      <span className="font-mono text-quantum-neon">|{state}⟩</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-quantum-matrix rounded-full h-2">
                          <div 
                            className="bg-quantum-glow h-2 rounded-full"
                            style={{ width: `${((count as number) / shots) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-quantum-particle w-12 text-right">
                          {String(count)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="state-vector" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {results.stateVector.map((amplitude: any, index: number) => (
                    <div key={index} className="p-2 bg-quantum-void rounded border text-center">
                      <div className="text-xs text-quantum-neon">
                        |{index.toString(2).padStart(qubits, '0')}⟩
                      </div>
                      <div className="text-xs text-quantum-particle">
                        {amplitude.real.toFixed(3)}
                        {amplitude.imag >= 0 ? '+' : ''}
                        {amplitude.imag.toFixed(3)}i
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-quantum-void rounded">
                    <div className="text-xl font-mono text-quantum-glow">
                      {results.executionTime.toFixed(2)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                  </div>
                  <div className="text-center p-4 bg-quantum-void rounded">
                    <div className="text-xl font-mono text-quantum-neon">
                      {(results.executionTime / shots * 1000).toFixed(1)}μs
                    </div>
                    <div className="text-sm text-muted-foreground">Per Shot</div>
                  </div>
                  <div className="text-center p-4 bg-quantum-void rounded">
                    <div className="text-xl font-mono text-quantum-energy">
                      {results.fidelity.toFixed(4)}
                    </div>
                    <div className="text-sm text-muted-foreground">Fidelity</div>
                  </div>
                  <div className="text-center p-4 bg-quantum-void rounded">
                    <div className="text-xl font-mono text-quantum-particle">
                      {Math.pow(2, qubits)}
                    </div>
                    <div className="text-sm text-muted-foreground">Dimensions</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
