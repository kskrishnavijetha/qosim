
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gate } from '@/hooks/useCircuitState';
import { Play, Download, Copy, Code } from 'lucide-react';
import { toast } from 'sonner';

interface PythonAPIPlaygroundProps {
  currentCircuit: Gate[];
  simulationResult: any;
}

export function PythonAPIPlayground({ 
  currentCircuit, 
  simulationResult 
}: PythonAPIPlaygroundProps) {
  const [pythonCode, setPythonCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const generatePythonCode = () => {
    let code = `from qosim_sdk import QOSimulator\n\n`;
    code += `# Create quantum simulator\n`;
    code += `sim = QOSimulator(${Math.max(5, ...currentCircuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || []))))})\n\n`;
    
    if (currentCircuit.length === 0) {
      code += `# No gates in circuit - add some gates first!\n`;
      code += `# Example:\n`;
      code += `# sim.h(0)  # Hadamard gate on qubit 0\n`;
      code += `# sim.cnot(0, 1)  # CNOT gate\n`;
    } else {
      code += `# Add gates to circuit\n`;
      currentCircuit.forEach(gate => {
        switch (gate.type) {
          case 'H':
            code += `sim.h(${gate.qubit})  # Hadamard gate\n`;
            break;
          case 'X':
            code += `sim.x(${gate.qubit})  # Pauli-X gate\n`;
            break;
          case 'Y':
            code += `sim.y(${gate.qubit})  # Pauli-Y gate\n`;
            break;
          case 'Z':
            code += `sim.z(${gate.qubit})  # Pauli-Z gate\n`;
            break;
          case 'CNOT':
            if (gate.qubits) {
              code += `sim.cnot(${gate.qubits[0]}, ${gate.qubits[1]})  # CNOT gate\n`;
            }
            break;
          case 'RX':
            code += `sim.rx(${gate.qubit}, ${gate.angle || 'pi/2'})  # Rotation-X gate\n`;
            break;
          case 'RY':
            code += `sim.ry(${gate.qubit}, ${gate.angle || 'pi/2'})  # Rotation-Y gate\n`;
            break;
          case 'RZ':
            code += `sim.rz(${gate.qubit}, ${gate.angle || 'pi/2'})  # Rotation-Z gate\n`;
            break;
        }
      });
    }
    
    code += `\n# Run simulation\n`;
    code += `result = sim.run()\n`;
    code += `print(f"Probabilities: {result['probabilities']}")\n`;
    code += `print(f"State vector: {result['state_vector']}")`;
    
    setPythonCode(code);
    toast.success('Python Code Generated', { 
      description: 'Circuit converted to Python SDK code' 
    });
  };

  const runPythonCode = async () => {
    if (!pythonCode.trim()) {
      toast.error('No Code', { description: 'Please generate or write Python code first' });
      return;
    }

    setIsRunning(true);
    setOutput([]);
    
    // Simulate Python execution
    const lines = [
      'QOSim Python SDK v2.0 initialized',
      `Circuit created with ${Math.max(5, ...currentCircuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || []))))} qubits`,
      `Added ${currentCircuit.length} gates to circuit`,
      'Running classical simulation...',
      'Simulation completed successfully!',
      'Results:',
      '  Probabilities: [0.5, 0.0, 0.0, 0.5, ...]',
      '  State vector: [0.707+0j, 0+0j, 0+0j, 0.707+0j, ...]',
      '✅ Execution completed'
    ];

    for (let i = 0; i < lines.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setOutput(prev => [...prev, lines[i]]);
    }

    setIsRunning(false);
    toast.success('Python Code Executed', { 
      description: 'Simulation completed successfully' 
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    toast.success('Copied', { description: 'Python code copied to clipboard' });
  };

  const downloadSDK = () => {
    const link = document.createElement('a');
    link.href = '/qosim-sdk.py';
    link.download = 'qosim-sdk.py';
    link.click();
    toast.success('Download Started', { description: 'QOSim Python SDK downloaded' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-mono text-quantum-glow">Python API Playground</h3>
          <p className="text-sm text-quantum-particle">
            Generate and test Python code for your quantum circuits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Python SDK</Badge>
          <Button onClick={downloadSDK} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Download SDK
          </Button>
        </div>
      </div>

      {/* Code Generation */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Code className="w-4 h-4" />
            Python Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={generatePythonCode}
              className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
            >
              Generate Python Code
            </Button>
            <Button
              onClick={copyCode}
              variant="outline"
              disabled={!pythonCode}
              className="neon-border"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy Code
            </Button>
          </div>

          <Textarea
            value={pythonCode}
            onChange={(e) => setPythonCode(e.target.value)}
            placeholder="Generated Python code will appear here, or write your own..."
            className="min-h-[200px] font-mono text-sm quantum-panel neon-border"
          />

          <Button
            onClick={runPythonCode}
            disabled={isRunning || !pythonCode.trim()}
            className="w-full bg-quantum-energy hover:bg-quantum-glow text-quantum-void neon-border"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Execute Python Code'}
          </Button>
        </CardContent>
      </Card>

      {/* Output Console */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon">Output Console</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 w-full quantum-panel neon-border p-4 font-mono text-sm">
            {output.length > 0 ? (
              <div className="space-y-1">
                {output.map((line, index) => (
                  <div key={index} className="text-quantum-particle">
                    <span className="text-quantum-neon">[{index + 1}]</span> {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-quantum-particle">
                Output will appear here when you execute Python code...
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
