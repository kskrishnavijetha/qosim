
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Save, Download, Upload, Code, Eye, Terminal, Zap } from 'lucide-react';

export function SDKCodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(`// QOSim SDK Example - Bell State
const sdk = new QOSimSDK();
await sdk.initialize();

// Create a 2-qubit circuit
const circuit = sdk.createCircuit('Bell State', 2);

// Add gates
circuit.addGate({ type: 'h', qubit: 0 });
circuit.addGate({ type: 'cnot', controlQubit: 0, qubit: 1 });

// Run simulation
const result = await circuit.simulate();
console.log('State Vector:', result.stateVector);
console.log('Probabilities:', result.probabilities);`);
  
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Starting quantum simulation...\n');
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResults = {
      stateVector: [
        { real: 0.7071, imag: 0.0000 },
        { real: 0.0000, imag: 0.0000 },
        { real: 0.0000, imag: 0.0000 },
        { real: 0.7071, imag: 0.0000 }
      ],
      probabilities: [0.5, 0.0, 0.0, 0.5],
      basisStates: ['00', '01', '10', '11'],
      executionTime: 12.5,
      circuitDepth: 2
    };
    
    setResults(mockResults);
    setOutput(prev => prev + 
      `✅ Simulation completed in ${mockResults.executionTime}ms\n` +
      `📊 State Vector: ${JSON.stringify(mockResults.stateVector, null, 2)}\n` +
      `🎯 Probabilities: ${mockResults.probabilities.map(p => (p * 100).toFixed(1) + '%').join(', ')}\n` +
      `🔄 Circuit Depth: ${mockResults.circuitDepth}\n`
    );
    
    setIsRunning(false);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-circuit.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : 'qasm'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadExample = (example: string) => {
    const examples = {
      'bell-state': `// Bell State Example
const sdk = new QOSimSDK();
await sdk.initialize();

const circuit = sdk.createCircuit('Bell State', 2);
circuit.addGate({ type: 'h', qubit: 0 });
circuit.addGate({ type: 'cnot', controlQubit: 0, qubit: 1 });

const result = await circuit.simulate();
console.log('Bell state created!', result);`,
      
      'grovers': `// Grover's Search Algorithm
const sdk = new QOSimSDK();
await sdk.initialize();

const circuit = sdk.createCircuit('Grovers Search', 3);

// Initialize superposition
for (let i = 0; i < 3; i++) {
  circuit.addGate({ type: 'h', qubit: i });
}

// Oracle (mark |101⟩)
circuit.addGate({ type: 'z', qubit: 0 });
circuit.addGate({ type: 'z', qubit: 2 });

// Diffusion operator
for (let i = 0; i < 3; i++) {
  circuit.addGate({ type: 'h', qubit: i });
  circuit.addGate({ type: 'x', qubit: i });
}

const result = await circuit.simulate();
console.log('Search result:', result);`,
      
      'qft': `// Quantum Fourier Transform
const sdk = new QOSimSDK();
await sdk.initialize();

const circuit = sdk.createCircuit('QFT', 3);

// Apply QFT
for (let i = 0; i < 3; i++) {
  circuit.addGate({ type: 'h', qubit: i });
  
  for (let j = i + 1; j < 3; j++) {
    const angle = Math.PI / Math.pow(2, j - i);
    circuit.addGate({ type: 'rz', qubit: j, angle });
  }
}

const result = await circuit.simulate();
console.log('QFT result:', result);`
    };
    
    setCode(examples[example as keyof typeof examples] || examples['bell-state']);
  };

  return (
    <div className="space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
              <Code className="w-6 h-6" />
              Interactive Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="qasm">QASM</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-quantum-neon">
                SDK v1.0.0
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-quantum-glow">Code Editor</h3>
                <div className="flex gap-2">
                  <Select onValueChange={loadExample}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Load Example" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bell-state">Bell State</SelectItem>
                      <SelectItem value="grovers">Grover's Search</SelectItem>
                      <SelectItem value="qft">QFT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={saveCode}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm bg-quantum-matrix/30 border-quantum-neon/20 min-h-[400px] resize-none"
                placeholder="Enter your quantum code here..."
              />
              
              <div className="flex gap-2">
                <Button onClick={runCode} disabled={isRunning} className="neon-border">
                  {isRunning ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setOutput('')}>
                  <Terminal className="w-4 h-4 mr-2" />
                  Clear Console
                </Button>
                <Button variant="outline" onClick={saveCode}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              <Tabs defaultValue="console" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="console">Console</TabsTrigger>
                  <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="console" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-quantum-glow">Console Output</h3>
                    <Badge variant="outline" className={isRunning ? 'animate-pulse' : ''}>
                      {isRunning ? 'Running' : 'Ready'}
                    </Badge>
                  </div>
                  
                  <ScrollArea className="h-[350px] w-full border border-quantum-neon/20 rounded-lg p-4 bg-quantum-matrix/20 font-mono text-sm">
                    {output || (
                      <div className="text-quantum-particle">
                        Console output will appear here when you run your code...
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="visualization" className="space-y-4">
                  <h3 className="text-lg font-semibold text-quantum-glow">Quantum State Visualization</h3>
                  
                  {results ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {results.stateVector.map((state: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm p-2 bg-quantum-matrix/20 rounded">
                            <span className="text-quantum-neon">
                              |{i.toString(2).padStart(2, '0')}⟩
                            </span>
                            <span className="text-quantum-particle font-mono">
                              {state.real.toFixed(4)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-quantum-glow">Probabilities</h4>
                        {results.probabilities.map((prob: number, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-quantum-neon text-sm w-12">
                              |{i.toString(2).padStart(2, '0')}⟩
                            </span>
                            <div className="flex-1 bg-quantum-matrix/30 rounded-full h-2">
                              <div 
                                className="bg-quantum-glow h-2 rounded-full transition-all duration-300"
                                style={{ width: `${prob * 100}%` }}
                              />
                            </div>
                            <span className="text-quantum-particle text-sm w-12">
                              {(prob * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-quantum-particle">
                      Run your code to see quantum state visualization
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="analysis" className="space-y-4">
                  <h3 className="text-lg font-semibold text-quantum-glow">Circuit Analysis</h3>
                  
                  {results ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-quantum-matrix/20 rounded">
                          <div className="text-quantum-neon text-sm">Execution Time</div>
                          <div className="text-quantum-glow font-mono text-lg">
                            {results.executionTime}ms
                          </div>
                        </div>
                        <div className="p-3 bg-quantum-matrix/20 rounded">
                          <div className="text-quantum-neon text-sm">Circuit Depth</div>
                          <div className="text-quantum-glow font-mono text-lg">
                            {results.circuitDepth}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-quantum-glow">Performance Metrics</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-quantum-neon">State Vector Size:</span>
                            <span className="text-quantum-particle">
                              {results.stateVector.length} amplitudes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-quantum-neon">Memory Usage:</span>
                            <span className="text-quantum-particle">
                              {(results.stateVector.length * 16).toFixed(0)} bytes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-quantum-neon">Simulation Rate:</span>
                            <span className="text-quantum-particle">
                              {(results.circuitDepth / results.executionTime * 1000).toFixed(0)} gates/sec
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-quantum-particle">
                      Run your code to see circuit analysis
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
