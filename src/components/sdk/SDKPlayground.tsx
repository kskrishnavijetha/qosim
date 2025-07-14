import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Download, Copy, Code, Book, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { QOSimSDK, CircuitBuilder, QuantumCircuit, SimulationResult } from '@/sdk/qosim-sdk';
import { runAllExamples } from '@/sdk/examples';

interface SDKPlaygroundProps {
  className?: string;
}

export function SDKPlayground({ className }: SDKPlaygroundProps) {
  const [sdk] = useState(() => new QOSimSDK());
  const [builder] = useState(() => new CircuitBuilder(sdk));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCircuit, setCurrentCircuit] = useState<QuantumCircuit | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    initializeSDK();
  }, []);

  const initializeSDK = async () => {
    try {
      setIsLoading(true);
      await sdk.initialize();
      setIsInitialized(true);
      addOutput('✅ QOSim SDK initialized successfully');
      toast.success('SDK Ready', { description: 'QOSim SDK is now ready to use' });
    } catch (error) {
      addOutput(`❌ Failed to initialize SDK: ${error}`);
      toast.error('Initialization Failed', { description: 'Could not load QOSim SDK' });
    } finally {
      setIsLoading(false);
    }
  };

  const addOutput = (message: string) => {
    setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const runBellStateExample = async () => {
    if (!isInitialized) return;
    
    try {
      setIsLoading(true);
      addOutput('Creating Bell state circuit...');
      
      const bellCircuit = builder.bellState('SDK Bell State');
      setCurrentCircuit(bellCircuit);
      addOutput(`Circuit created: ${bellCircuit.name} with ${bellCircuit.gates.length} gates`);
      
      const result = await sdk.simulate(bellCircuit);
      setSimulationResult(result);
      addOutput(`Simulation completed in ${result.executionTime.toFixed(2)}ms`);
      addOutput(`Probabilities: [${result.probabilities.map(p => p.toFixed(3)).join(', ')}]`);
      
      toast.success('Bell State Created', { description: 'Successfully simulated Bell state circuit' });
    } catch (error) {
      addOutput(`❌ Error: ${error}`);
      toast.error('Simulation Failed', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const runGHZExample = async () => {
    if (!isInitialized) return;
    
    try {
      setIsLoading(true);
      addOutput('Creating 3-qubit GHZ state...');
      
      const ghzCircuit = builder.ghzState(3, 'SDK GHZ State');
      setCurrentCircuit(ghzCircuit);
      addOutput(`GHZ circuit created with ${ghzCircuit.qubits} qubits`);
      
      const result = await sdk.simulate(ghzCircuit);
      setSimulationResult(result);
      addOutput(`GHZ state simulated successfully`);
      addOutput(`Circuit depth: ${result.circuitDepth}`);
      
      toast.success('GHZ State Created', { description: '3-qubit GHZ state successfully simulated' });
    } catch (error) {
      addOutput(`❌ Error: ${error}`);
      toast.error('Simulation Failed', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const runRandomGenerator = async () => {
    if (!isInitialized) return;
    
    try {
      setIsLoading(true);
      addOutput('Creating quantum random number generator...');
      
      const rngCircuit = builder.randomGenerator(4, 'SDK QRNG');
      setCurrentCircuit(rngCircuit);
      
      const result = await sdk.simulate(rngCircuit);
      setSimulationResult(result);
      
      // Generate random number by sampling
      const random = Math.random();
      let cumulative = 0;
      let selectedState = '';
      
      for (let i = 0; i < result.probabilities.length; i++) {
        cumulative += result.probabilities[i];
        if (random <= cumulative) {
          selectedState = result.basisStates[i];
          break;
        }
      }
      
      const randomNumber = parseInt(selectedState, 2);
      addOutput(`Generated random number: ${randomNumber} (binary: ${selectedState})`);
      
      toast.success('Random Number Generated', { description: `Generated: ${randomNumber}` });
    } catch (error) {
      addOutput(`❌ Error: ${error}`);
      toast.error('Generation Failed', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const runCustomCode = async () => {
    if (!isInitialized || !codeInput.trim()) return;
    
    try {
      setIsLoading(true);
      addOutput('Executing custom code...');
      
      // Create a safe execution context
      const context = {
        sdk,
        builder,
        console: {
          log: (message: any) => addOutput(`📝 ${message}`)
        },
        Math,
        JSON
      };
      
      // Execute the code in a sandboxed way
      const func = new Function(...Object.keys(context), codeInput);
      const result = await func(...Object.values(context));
      
      if (result) {
        addOutput(`✅ Result: ${JSON.stringify(result, null, 2)}`);
      }
      
      toast.success('Code Executed', { description: 'Custom code ran successfully' });
    } catch (error) {
      addOutput(`❌ Execution error: ${error}`);
      toast.error('Execution Failed', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const exportCircuit = (format: 'json' | 'qasm' | 'python') => {
    if (!currentCircuit) {
      toast.error('No Circuit', { description: 'Create a circuit first' });
      return;
    }
    
    try {
      const exported = sdk.exportCircuit(currentCircuit, format);
      navigator.clipboard.writeText(exported);
      toast.success('Exported', { description: `${format.toUpperCase()} copied to clipboard` });
      addOutput(`Circuit exported to ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export Failed', { description: String(error) });
    }
  };

  const runAllSDKExamples = async () => {
    if (!isInitialized) return;
    
    try {
      setIsLoading(true);
      addOutput('Running all SDK examples...');
      clearOutput();
      
      // Redirect console.log to our output
      const originalLog = console.log;
      console.log = (message: any) => addOutput(`📖 ${message}`);
      
      await runAllExamples();
      
      // Restore console.log
      console.log = originalLog;
      
      addOutput('✅ All examples completed successfully!');
      toast.success('Examples Complete', { description: 'All SDK examples ran successfully' });
    } catch (error) {
      addOutput(`❌ Examples failed: ${error}`);
      toast.error('Examples Failed', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                QOSim JavaScript SDK Playground
              </CardTitle>
              <CardDescription>
                Interactive playground for testing the QOSim JavaScript SDK
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isInitialized ? "default" : "secondary"}>
                {isInitialized ? "Ready" : "Loading"}
              </Badge>
              {isLoading && <Zap className="h-4 w-4 animate-pulse text-primary" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="examples" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="custom">Custom Code</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="examples" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={runBellStateExample}
                  disabled={!isInitialized || isLoading}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Bell State</div>
                    <div className="text-xs opacity-80">Entangled qubits</div>
                  </div>
                </Button>

                <Button
                  onClick={runGHZExample}
                  disabled={!isInitialized || isLoading}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">GHZ State</div>
                    <div className="text-xs opacity-80">3-qubit entanglement</div>
                  </div>
                </Button>

                <Button
                  onClick={runRandomGenerator}
                  disabled={!isInitialized || isLoading}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Quantum RNG</div>
                    <div className="text-xs opacity-80">Random numbers</div>
                  </div>
                </Button>

                <Button
                  onClick={runAllSDKExamples}
                  disabled={!isInitialized || isLoading}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Book className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">All Examples</div>
                    <div className="text-xs opacity-80">Run complete suite</div>
                  </div>
                </Button>
              </div>

              {simulationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Simulation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Probabilities</h4>
                        <div className="space-y-1">
                          {simulationResult.basisStates.map((state, index) => (
                            <div key={state} className="flex justify-between text-sm">
                              <span>|{state}⟩</span>
                              <span>{(simulationResult.probabilities[index] * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Circuit Info</h4>
                        <div className="space-y-1 text-sm">
                          <div>Execution Time: {simulationResult.executionTime.toFixed(2)}ms</div>
                          <div>Circuit Depth: {simulationResult.circuitDepth}</div>
                          <div>Qubits: {currentCircuit?.qubits}</div>
                          <div>Gates: {currentCircuit?.gates.length}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom JavaScript Code (SDK context available)
                </label>
                <Textarea
                  placeholder={`// Example: Create and simulate a custom circuit
const circuit = sdk.createCircuit('Custom', 2);
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
const result = await sdk.simulate(circuit);
console.log('Probabilities:', result.probabilities);
return result;`}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              </div>
              <Button
                onClick={runCustomCode}
                disabled={!isInitialized || isLoading || !codeInput.trim()}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Execute Custom Code
              </Button>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              {currentCircuit ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Current Circuit: {currentCircuit.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentCircuit.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={() => exportCircuit('json')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Copy className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">JSON</div>
                        <div className="text-xs opacity-80">Circuit data</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => exportCircuit('qasm')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Copy className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">QASM</div>
                        <div className="text-xs opacity-80">OpenQASM 2.0</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => exportCircuit('python')}
                      variant="outline"
                      className="flex flex-col items-center gap-2 h-auto p-4"
                    >
                      <Copy className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Python</div>
                        <div className="text-xs opacity-80">SDK code</div>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Create a circuit first to enable export options</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h3>Quick Start Guide</h3>
                <p>The QOSim JavaScript SDK provides a simple interface for quantum circuit simulation:</p>
                
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`// Initialize SDK
const sdk = new QOSimSDK();
await sdk.initialize();

// Create circuit
let circuit = sdk.createCircuit('My Circuit', 2);

// Add gates
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });

// Simulate
const result = await sdk.simulate(circuit);
console.log(result.probabilities);`}
                </pre>

                <h4>Available Gates</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><code>h</code> - Hadamard gate</li>
                  <li><code>x, y, z</code> - Pauli gates</li>
                  <li><code>rx, ry, rz</code> - Rotation gates (with angle parameter)</li>
                  <li><code>cnot</code> - Controlled-NOT gate</li>
                </ul>

                <h4>Circuit Builder Helpers</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><code>builder.bellState()</code> - Creates Bell state</li>
                  <li><code>builder.ghzState(qubits)</code> - Creates GHZ state</li>
                  <li><code>builder.randomGenerator(qubits)</code> - Quantum RNG</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Output Console</h4>
              <Button onClick={clearOutput} variant="ghost" size="sm">
                Clear
              </Button>
            </div>
            <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-muted/30">
              <div className="space-y-1 font-mono text-sm">
                {output.length === 0 ? (
                  <div className="text-muted-foreground">No output yet. Run an example to see results.</div>
                ) : (
                  output.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}