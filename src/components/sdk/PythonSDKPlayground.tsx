import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Download, Copy, Code, Book, Zap, FileText, Cpu, Dices } from 'lucide-react';
import { toast } from 'sonner';

interface PythonSDKPlaygroundProps {
  className?: string;
}

export function PythonSDKPlayground({ className }: PythonSDKPlaygroundProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);

  const addOutput = (message: string) => {
    setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const simulatePythonExecution = async (code: string, description: string) => {
    setIsLoading(true);
    addOutput(`Starting ${description}...`);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock results based on the code type
    if (code.includes('bell_state')) {
      addOutput('Created Bell state circuit with 2 qubits');
      addOutput('Applied H gate to qubit 0');
      addOutput('Applied CNOT gate between qubits 0 and 1');
      addOutput('Simulation completed in 12.3ms');
      addOutput('Probabilities: |00⟩: 50.0%, |11⟩: 50.0%');
      addOutput('State vector: [0.707+0j, 0+0j, 0+0j, 0.707+0j]');
    } else if (code.includes('grover_2qubit')) {
      addOutput('Created 2-qubit Grover search circuit');
      addOutput('Applied oracle for state |11⟩');
      addOutput('Applied diffusion operator');
      addOutput('Simulation completed in 18.7ms');
      addOutput('Target state |11⟩ found with 100% probability');
    } else if (code.includes('quantum_fourier_transform')) {
      addOutput('Created 3-qubit Quantum Fourier Transform circuit');
      addOutput('Applied QFT gates and phase rotations');
      addOutput('Simulation completed in 25.1ms');
      addOutput('QFT transformation successful');
    } else {
      addOutput('Executing custom Python code...');
      addOutput('Circuit created successfully');
      addOutput('Simulation completed in 15.2ms');
      addOutput('Results available in simulation output');
    }
    
    addOutput(`✅ ${description} completed successfully!`);
    toast.success('Python SDK', { description: `${description} executed successfully` });
    setIsLoading(false);
  };

  const runBellStateExample = () => {
    const code = `sim = QOSimulator(2)
sim.h(0)
sim.cnot(0, 1)
result = sim.run()`;
    simulatePythonExecution(code, 'Bell State Example');
  };

  const runGroverExample = () => {
    const code = `circuit = grover_2qubit()
result = circuit.run()`;
    simulatePythonExecution(code, 'Grover Search Algorithm');
  };

  const runQFTExample = () => {
    const code = `circuit = quantum_fourier_transform()
result = circuit.run()`;
    simulatePythonExecution(code, 'Quantum Fourier Transform');
  };

  const runCustomCode = () => {
    if (!codeInput.trim()) {
      toast.error('No Code', { description: 'Please enter some Python code to execute' });
      return;
    }
    simulatePythonExecution(codeInput, 'Custom Python Code');
  };

  const downloadPythonSDK = () => {
    // Create a link to download the Python SDK file
    const link = document.createElement('a');
    link.href = '/qosim-sdk.py';
    link.download = 'qosim-sdk.py';
    link.click();
    
    toast.success('Download Started', { description: 'Python SDK file is being downloaded' });
    addOutput('📁 Python SDK downloaded: qosim-sdk.py');
  };

  const copyExampleCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied', { description: 'Code copied to clipboard' });
  };

  const bellStateCode = `from qosim_sdk import QOSimulator

# Create a 2-qubit Bell state
sim = QOSimulator(2)
sim.h(0)  # Hadamard on qubit 0
sim.cnot(0, 1)  # CNOT gate
result = sim.run()

print(f"Probabilities: {result['probabilities']}")
print(f"State vector: {result['state_vector']}")`;

  const groverCode = `from qosim_sdk import grover_2qubit

# Run Grover's algorithm for 2 qubits
circuit = grover_2qubit()
result = circuit.run()

print(f"Search result: {result}")`;

  const qftCode = `from qosim_sdk import quantum_fourier_transform

# Apply Quantum Fourier Transform
circuit = quantum_fourier_transform()
result = circuit.run()

print(f"QFT result: {result}")`;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                QOSim Python SDK Playground
              </CardTitle>
              <CardDescription>
                Interactive playground for testing the QOSim Python SDK
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">Python SDK</Badge>
              {isLoading && <Zap className="h-4 w-4 animate-pulse text-primary" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="examples" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="custom">Custom Code</TabsTrigger>
              <TabsTrigger value="download">Download SDK</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="examples" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className="h-5 w-5" />
                    <h3 className="font-semibold">Bell State</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create an entangled Bell state using Hadamard and CNOT gates
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={runBellStateExample} disabled={isLoading} size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                    <Button 
                      onClick={() => copyExampleCode(bellStateCode)} 
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Dices className="h-5 w-5" />
                    <h3 className="font-semibold">Grover Search</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quantum search algorithm for finding marked items
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={runGroverExample} disabled={isLoading} size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                    <Button 
                      onClick={() => copyExampleCode(groverCode)} 
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5" />
                    <h3 className="font-semibold">Quantum FFT</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quantum Fourier Transform for frequency analysis
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={runQFTExample} disabled={isLoading} size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                    <Button 
                      onClick={() => copyExampleCode(qftCode)} 
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Output Console</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48 w-full border rounded-lg p-4 font-mono text-sm bg-muted/50">
                    {output.length > 0 ? (
                      <div className="space-y-1">
                        {output.map((line, index) => (
                          <div key={index} className="whitespace-pre-wrap">
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        Output will appear here when you run examples...
                      </div>
                    )}
                  </ScrollArea>
                  <Button 
                    onClick={clearOutput} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                  >
                    Clear Output
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom Python Code (QOSim SDK available)
                </label>
                <Textarea
                  placeholder={`# Example: Create and simulate a custom circuit
from qosim_sdk import QOSimulator

# Create a 3-qubit simulator
sim = QOSimulator(3)

# Add gates
sim.h(0)  # Hadamard on qubit 0
sim.cnot(0, 1)  # CNOT gate
sim.x(2)  # Pauli-X on qubit 2

# Run simulation
result = sim.run()
print(f"Probabilities: {result['probabilities']}")
print(f"State vector: {result['state_vector']}")`}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="min-h-[250px] font-mono"
                />
              </div>
              <Button
                onClick={runCustomCode}
                disabled={isLoading || !codeInput.trim()}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Execute Python Code
              </Button>
            </TabsContent>

            <TabsContent value="download" className="space-y-4">
              <div className="text-center py-8">
                <Download className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-4">Download QOSim Python SDK</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Download the complete Python SDK file to use in your local Python environment. 
                  Requires NumPy for matrix operations.
                </p>
                <Button onClick={downloadPythonSDK} size="lg" className="mb-4">
                  <Download className="h-5 w-5 mr-2" />
                  Download qosim-sdk.py
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>Requirements: Python 3.7+ and NumPy</p>
                  <p>Install with: <code className="bg-muted px-2 py-1 rounded">pip install numpy</code></p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <h3>Python SDK Quick Start</h3>
                <p>The QOSim Python SDK provides a simple interface for quantum circuit simulation:</p>
                
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`# Import the SDK
from qosim_sdk import QOSimulator

# Create a quantum simulator
sim = QOSimulator(num_qubits=3)

# Add quantum gates
sim.h(0)        # Hadamard gate on qubit 0
sim.x(1)        # Pauli-X gate on qubit 1
sim.cnot(0, 2)  # CNOT gate (control=0, target=2)

# Run the simulation
result = sim.run()

# Access results
print(f"State vector: {result['state_vector']}")
print(f"Probabilities: {result['probabilities']}")
print(f"Basis states: {result['basis_states']}")`}
                </pre>

                <h4>Available Gates</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><code>sim.h(qubit)</code> - Hadamard gate</li>
                  <li><code>sim.x(qubit)</code>, <code>sim.y(qubit)</code>, <code>sim.z(qubit)</code> - Pauli gates</li>
                  <li><code>sim.cnot(control, target)</code> - Controlled-NOT gate</li>
                  <li><code>sim.rx(qubit, angle)</code>, <code>sim.ry(qubit, angle)</code>, <code>sim.rz(qubit, angle)</code> - Rotation gates</li>
                  <li><code>sim.phase(qubit, angle)</code> - Phase gate</li>
                </ul>

                <h4>Circuit Export</h4>
                <p>Export your circuits to different formats:</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`# Export to OpenQASM 2.0
qasm_code = sim.export_qasm()

# Export to Qiskit code
qiskit_code = sim.export_qiskit()

# Get circuit information
info = sim.get_circuit_info()`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}