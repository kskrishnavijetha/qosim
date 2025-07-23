
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Pause, RotateCcw, Download, Code, Eye, Activity, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: number;
  runtime: string;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
  code: {
    javascript: string;
    python: string;
    qasm: string;
  };
}

interface AlgorithmRunnerProps {
  algorithm: Algorithm;
  onClose: () => void;
}

export function AlgorithmRunner({ algorithm, onClose }: AlgorithmRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'qasm'>('javascript');
  const [modifiedCode, setModifiedCode] = useState(algorithm.code.javascript);

  useEffect(() => {
    setModifiedCode(algorithm.code[selectedLanguage]);
  }, [selectedLanguage, algorithm.code]);

  const runAlgorithm = async () => {
    setIsRunning(true);
    setResults(null);
    
    // Simulate step-by-step execution
    const steps = Array.from({ length: algorithm.gates }, (_, i) => i);
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Simulate final results
    setResults({
      stateVector: Array.from({ length: Math.pow(2, algorithm.qubits) }, (_, i) => ({
        amplitude: Math.random() * 0.5,
        phase: Math.random() * 2 * Math.PI,
        probability: Math.random()
      })),
      executionTime: parseFloat(algorithm.runtime.replace('~', '').replace('ms', '')),
      measurements: Array.from({ length: algorithm.qubits }, () => Math.random() > 0.5 ? 1 : 0),
      entanglement: Math.random() * 0.8,
      fidelity: 0.95 + Math.random() * 0.05
    });
    
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setResults(null);
  };

  const exportResults = () => {
    if (!results) return;
    
    const exportData = {
      algorithm: algorithm.name,
      results: results,
      timestamp: new Date().toISOString(),
      code: modifiedCode
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithm.id}-results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-quantum-void border-quantum-neon">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-quantum-glow">
            <div className="flex items-center gap-3">
              <span>{algorithm.name}</span>
              <Badge className="bg-quantum-matrix/30 text-quantum-neon">
                {algorithm.category}
              </Badge>
              <Badge variant="outline" className="text-quantum-particle">
                {algorithm.qubits} qubits
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Editor
              </CardTitle>
              <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="qasm">QASM</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Textarea
                value={modifiedCode}
                onChange={(e) => setModifiedCode(e.target.value)}
                className="font-mono text-sm bg-quantum-matrix/30 border-quantum-neon/20 min-h-[300px]"
                placeholder="Enter your quantum code here..."
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={runAlgorithm} disabled={isRunning} className="neon-border">
                  {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
                <Button onClick={resetSimulation} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={exportResults} disabled={!results} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Visualization */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Results Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="execution" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="execution">Execution</TabsTrigger>
                  <TabsTrigger value="states">States</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="execution" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-quantum-neon">Execution Progress</span>
                      <span className="text-quantum-particle">
                        {isRunning ? `Step ${currentStep + 1}/${algorithm.gates}` : 'Ready'}
                      </span>
                    </div>
                    
                    <div className="w-full bg-quantum-matrix/30 rounded-full h-2">
                      <div 
                        className="bg-quantum-glow h-2 rounded-full transition-all duration-200"
                        style={{ width: `${(currentStep / algorithm.gates) * 100}%` }}
                      />
                    </div>
                    
                    {isRunning && (
                      <div className="text-sm text-quantum-neon">
                        Executing gate {currentStep + 1}: {['H', 'X', 'CNOT', 'RY', 'RZ'][currentStep % 5]}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="states" className="space-y-4">
                  <ScrollArea className="h-[300px]">
                    {results ? (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-quantum-glow">State Vector</h4>
                        {results.stateVector.slice(0, 8).map((state: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-quantum-neon">
                              |{i.toString(2).padStart(algorithm.qubits, '0')}⟩
                            </span>
                            <span className="text-quantum-particle">
                              {state.amplitude.toFixed(3)} + {state.phase.toFixed(3)}i
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-quantum-particle">
                        Run the algorithm to see state vector results
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  {results && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-quantum-neon">Execution Time:</span>
                          <span className="text-quantum-particle ml-2">
                            {results.executionTime.toFixed(2)}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-quantum-neon">Fidelity:</span>
                          <span className="text-quantum-particle ml-2">
                            {(results.fidelity * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-quantum-neon">Entanglement:</span>
                          <span className="text-quantum-particle ml-2">
                            {results.entanglement.toFixed(3)}
                          </span>
                        </div>
                        <div>
                          <span className="text-quantum-neon">Measurements:</span>
                          <span className="text-quantum-particle ml-2">
                            {results.measurements.join('')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-quantum-glow">Performance Metrics</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-quantum-matrix/20 rounded">
                            <div className="text-quantum-neon">Gate Count</div>
                            <div className="text-quantum-glow font-mono">{algorithm.gates}</div>
                          </div>
                          <div className="text-center p-2 bg-quantum-matrix/20 rounded">
                            <div className="text-quantum-neon">Depth</div>
                            <div className="text-quantum-glow font-mono">{Math.ceil(algorithm.gates / 2)}</div>
                          </div>
                          <div className="text-center p-2 bg-quantum-matrix/20 rounded">
                            <div className="text-quantum-neon">Success Rate</div>
                            <div className="text-quantum-glow font-mono">
                              {(results.fidelity * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
