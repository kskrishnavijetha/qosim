
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, BarChart3, Activity, Download, Clear } from 'lucide-react';

interface SimulationConsoleProps {
  results: any;
  isRunning: boolean;
}

export function SimulationConsole({ results, isRunning }: SimulationConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [results]);

  const formatStateVector = (stateVector: Array<{ real: number; imag: number }>) => {
    return stateVector.map((state, index) => ({
      state: `|${index.toString(2).padStart(3, '0')}⟩`,
      amplitude: `${state.real.toFixed(4)}${state.imag >= 0 ? '+' : ''}${state.imag.toFixed(4)}i`,
      probability: Math.pow(state.real, 2) + Math.pow(state.imag, 2)
    }));
  };

  const downloadResults = () => {
    if (results) {
      const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'simulation-results.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Simulation Console
          </CardTitle>
          <div className="flex items-center gap-2">
            {isRunning && (
              <Badge variant="outline" className="animate-pulse">
                Running
              </Badge>
            )}
            {results && (
              <Button
                onClick={downloadResults}
                variant="outline"
                size="sm"
                className="neon-border"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isRunning ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 animate-pulse text-quantum-neon" />
              <span className="text-quantum-particle">Running simulation...</span>
            </div>
            <Progress value={75} className="w-full" />
            <div className="bg-quantum-matrix p-4 rounded-lg">
              <div className="font-mono text-sm text-quantum-glow">
                <div className="animate-pulse">
                  <div>▶ Initializing quantum simulator...</div>
                  <div>▶ Compiling quantum circuit...</div>
                  <div>▶ Applying quantum gates...</div>
                  <div>▶ Computing state vector...</div>
                  <div>▶ Calculating probabilities...</div>
                </div>
              </div>
            </div>
          </div>
        ) : results ? (
          <Tabs defaultValue="output" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="output" className="space-y-4">
              <ScrollArea className="h-64 w-full">
                <div className="bg-quantum-matrix p-4 rounded-lg">
                  <div className="font-mono text-sm text-quantum-glow whitespace-pre-wrap">
                    {results.output}
                  </div>
                </div>
              </ScrollArea>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-quantum-matrix p-3 rounded-lg">
                  <div className="text-quantum-particle">Circuit Depth</div>
                  <div className="text-quantum-glow font-bold">{results.circuitDepth}</div>
                </div>
                <div className="bg-quantum-matrix p-3 rounded-lg">
                  <div className="text-quantum-particle">Gate Count</div>
                  <div className="text-quantum-glow font-bold">{results.gateCount}</div>
                </div>
                <div className="bg-quantum-matrix p-3 rounded-lg">
                  <div className="text-quantum-particle">Success</div>
                  <div className="text-quantum-neon font-bold">✓</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="visualization" className="space-y-4">
              <div className="bg-quantum-matrix p-4 rounded-lg">
                <h4 className="text-quantum-glow font-medium mb-3">State Vector</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {formatStateVector(results.stateVector).map((state, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-quantum-particle">{state.state}</span>
                        <span className="text-quantum-glow font-mono">{state.amplitude}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-quantum-void rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-quantum-neon"
                              style={{ width: `${state.probability * 100}%` }}
                            />
                          </div>
                          <span className="text-quantum-neon text-xs">
                            {(state.probability * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              <div className="bg-quantum-matrix p-4 rounded-lg">
                <h4 className="text-quantum-glow font-medium mb-3">Measurement Probabilities</h4>
                <div className="grid grid-cols-2 gap-4">
                  {results.probabilities.map((prob: number, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-quantum-particle">
                        |{index.toString(2).padStart(3, '0')}⟩
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-quantum-void rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-quantum-energy"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                        <span className="text-quantum-glow text-sm">
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-quantum-particle">
            <Terminal className="h-12 w-12 mb-4 opacity-50" />
            <p>Run an algorithm to see simulation results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
