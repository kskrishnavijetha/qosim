
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, Copy, Download, Code } from 'lucide-react';

interface SDKCodeEditorProps {
  onCodeChange: (code: string) => void;
  circuit: any[];
}

export function SDKCodeEditor({ onCodeChange, circuit }: SDKCodeEditorProps) {
  const [activeLanguage, setActiveLanguage] = useState('javascript');
  const [customCode, setCustomCode] = useState('');

  const generateJavaScriptCode = () => {
    return `// QOSim JavaScript SDK - Quantum Circuit
import { QOSimSDK } from '@qosim/sdk';

const sdk = new QOSimSDK();
await sdk.initialize();

// Create a quantum circuit
const circuit = sdk.createCircuit('MyQuantumCircuit', 5);

// Add quantum gates
${circuit.map(gate => {
  switch (gate.type) {
    case 'H':
      return `circuit.addGate('H', ${gate.qubit});`;
    case 'X':
      return `circuit.addGate('X', ${gate.qubit});`;
    case 'Y':
      return `circuit.addGate('Y', ${gate.qubit});`;
    case 'Z':
      return `circuit.addGate('Z', ${gate.qubit});`;
    case 'CNOT':
      return `circuit.addGate('CNOT', ${gate.qubits?.[0] || 0}, ${gate.qubits?.[1] || 1});`;
    case 'RX':
      return `circuit.addGate('RX', ${gate.qubit}, ${gate.angle || 0});`;
    case 'RY':
      return `circuit.addGate('RY', ${gate.qubit}, ${gate.angle || 0});`;
    case 'RZ':
      return `circuit.addGate('RZ', ${gate.qubit}, ${gate.angle || 0});`;
    default:
      return `// Unknown gate: ${gate.type}`;
  }
}).join('\n')}

// Simulate the circuit
const result = await sdk.simulate(circuit);
console.log('Simulation result:', result);

// Export to OpenQASM
const qasm = sdk.exportToQASM(circuit);
console.log('OpenQASM code:', qasm);`;
  };

  const generatePythonCode = () => {
    return `# QOSim Python SDK - Quantum Circuit
from qosim import QOSimSDK
import asyncio

async def main():
    # Initialize SDK
    sdk = QOSimSDK()
    await sdk.initialize()
    
    # Create a quantum circuit
    circuit = sdk.create_circuit('MyQuantumCircuit', 5)
    
    # Add quantum gates
${circuit.map(gate => {
  switch (gate.type) {
    case 'H':
      return `    circuit.add_gate('H', ${gate.qubit})`;
    case 'X':
      return `    circuit.add_gate('X', ${gate.qubit})`;
    case 'Y':
      return `    circuit.add_gate('Y', ${gate.qubit})`;
    case 'Z':
      return `    circuit.add_gate('Z', ${gate.qubit})`;
    case 'CNOT':
      return `    circuit.add_gate('CNOT', ${gate.qubits?.[0] || 0}, ${gate.qubits?.[1] || 1})`;
    case 'RX':
      return `    circuit.add_gate('RX', ${gate.qubit}, ${gate.angle || 0})`;
    case 'RY':
      return `    circuit.add_gate('RY', ${gate.qubit}, ${gate.angle || 0})`;
    case 'RZ':
      return `    circuit.add_gate('RZ', ${gate.qubit}, ${gate.angle || 0})`;
    default:
      return `    # Unknown gate: ${gate.type}`;
  }
}).join('\n')}
    
    # Simulate the circuit
    result = await sdk.simulate(circuit)
    print('Simulation result:', result)
    
    # Export to OpenQASM
    qasm = sdk.export_to_qasm(circuit)
    print('OpenQASM code:', qasm)

if __name__ == "__main__":
    asyncio.run(main())`;
  };

  const handleRunCode = () => {
    const code = activeLanguage === 'javascript' ? generateJavaScriptCode() : generatePythonCode();
    onCodeChange(code);
  };

  const handleCopyCode = () => {
    const code = activeLanguage === 'javascript' ? generateJavaScriptCode() : generatePythonCode();
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const code = activeLanguage === 'javascript' ? generateJavaScriptCode() : generatePythonCode();
    const filename = activeLanguage === 'javascript' ? 'quantum_circuit.js' : 'quantum_circuit.py';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-quantum-glow">SDK Code Editor</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRunCode} className="neon-border">
            <Play className="w-4 h-4 mr-2" />
            Run Code
          </Button>
          <Button onClick={handleCopyCode} variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button onClick={handleDownloadCode} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="python">Python</TabsTrigger>
        </TabsList>

        <TabsContent value="javascript" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-neon flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  JavaScript SDK
                </CardTitle>
                <Badge variant="secondary">
                  {circuit.length} gates
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateJavaScriptCode()}
                readOnly
                className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[400px] resize-none"
                placeholder="Generated JavaScript code will appear here..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-neon flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Python SDK
                </CardTitle>
                <Badge variant="secondary">
                  {circuit.length} gates
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatePythonCode()}
                readOnly
                className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[400px] resize-none"
                placeholder="Generated Python code will appear here..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Custom Code Section */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-neon">Custom Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[200px]"
            placeholder="Write your custom quantum algorithm here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
