
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  Download, 
  BookOpen,
  Settings,
  Zap,
  FileText,
  Terminal
} from 'lucide-react';
import { SDKDemoPanel } from '@/components/panels/SDKDemoPanel';
import { InteractiveCircuitEditor } from '@/components/sdk/InteractiveCircuitEditor';
import { useCircuitState } from '@/hooks/useCircuitState';

export function QuantumSDKWorkspace() {
  const [activeLanguage, setActiveLanguage] = useState<'javascript' | 'python'>('javascript');
  const [activeView, setActiveView] = useState('editor');
  const { circuit, addGate, deleteGate, clearCircuit } = useCircuitState();

  const handleCircuitChange = (newCircuit: any[]) => {
    clearCircuit();
    newCircuit.forEach(gate => addGate(gate));
  };

  const algorithmTemplates = {
    javascript: {
      'bell-state': {
        name: 'Bell State',
        description: 'Create entangled qubits',
        code: `// Bell State Circuit
const sdk = new QOSimSDK();
await sdk.initialize();

let circuit = sdk.createCircuit('Bell State', 2);
circuit = sdk.addGate(circuit, {type: 'h', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'cnot', controlQubit: 0, qubit: 1});

const result = await sdk.simulate(circuit);
console.log('Bell state probabilities:', result.probabilities);`
      },
      'grover': {
        name: 'Grover\'s Search',
        description: 'Quantum search algorithm',
        code: `// Grover's Search Algorithm
const sdk = new QOSimSDK();
await sdk.initialize();

let circuit = sdk.createCircuit('Grover Search', 2);

// Initialize superposition
circuit = sdk.addGate(circuit, {type: 'h', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'h', qubit: 1});

// Oracle (mark |11⟩)
circuit = sdk.addGate(circuit, {type: 'cz', controlQubit: 0, qubit: 1});

// Diffusion operator
circuit = sdk.addGate(circuit, {type: 'h', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'h', qubit: 1});
circuit = sdk.addGate(circuit, {type: 'x', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'x', qubit: 1});
circuit = sdk.addGate(circuit, {type: 'cz', controlQubit: 0, qubit: 1});
circuit = sdk.addGate(circuit, {type: 'x', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'x', qubit: 1});
circuit = sdk.addGate(circuit, {type: 'h', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'h', qubit: 1});

const result = await sdk.simulate(circuit);
console.log('Grover result:', result.probabilities);`
      },
      'qft': {
        name: 'Quantum Fourier Transform',
        description: 'QFT implementation',
        code: `// Quantum Fourier Transform
const sdk = new QOSimSDK();
await sdk.initialize();

let circuit = sdk.createCircuit('QFT', 3);

// QFT on 3 qubits
circuit = sdk.addGate(circuit, {type: 'h', qubit: 0});
circuit = sdk.addGate(circuit, {type: 'rz', qubit: 1, angle: Math.PI/2});
circuit = sdk.addGate(circuit, {type: 'h', qubit: 1});
circuit = sdk.addGate(circuit, {type: 'rz', qubit: 2, angle: Math.PI/4});
circuit = sdk.addGate(circuit, {type: 'rz', qubit: 2, angle: Math.PI/2});
circuit = sdk.addGate(circuit, {type: 'h', qubit: 2});

// Swap for correct output order
circuit = sdk.addGate(circuit, {type: 'swap', controlQubit: 0, qubit: 2});

const result = await sdk.simulate(circuit);
console.log('QFT result:', result.probabilities);`
      }
    },
    python: {
      'bell-state': {
        name: 'Bell State',
        description: 'Create entangled qubits',
        code: `# Bell State Circuit
from qosim_sdk import QOSimSDK

sdk = QOSimSDK()
await sdk.initialize()

circuit = sdk.create_circuit('Bell State', 2)
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 0, 'qubit': 1})

result = await sdk.simulate(circuit)
print('Bell state probabilities:', result['probabilities'])`
      },
      'grover': {
        name: 'Grover\'s Search',
        description: 'Quantum search algorithm',
        code: `# Grover's Search Algorithm
from qosim_sdk import QOSimSDK

sdk = QOSimSDK()
await sdk.initialize()

circuit = sdk.create_circuit('Grover Search', 2)

# Initialize superposition
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 1})

# Oracle (mark |11⟩)
circuit = sdk.add_gate(circuit, {'type': 'cz', 'control_qubit': 0, 'qubit': 1})

# Diffusion operator
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 1})
circuit = sdk.add_gate(circuit, {'type': 'x', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'x', 'qubit': 1})
circuit = sdk.add_gate(circuit, {'type': 'cz', 'control_qubit': 0, 'qubit': 1})
circuit = sdk.add_gate(circuit, {'type': 'x', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'x', 'qubit': 1})
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 1})

result = await sdk.simulate(circuit)
print('Grover result:', result['probabilities'])`
      },
      'qft': {
        name: 'Quantum Fourier Transform',
        description: 'QFT implementation',
        code: `# Quantum Fourier Transform
from qosim_sdk import QOSimSDK
import math

sdk = QOSimSDK()
await sdk.initialize()

circuit = sdk.create_circuit('QFT', 3)

# QFT on 3 qubits
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
circuit = sdk.add_gate(circuit, {'type': 'rz', 'qubit': 1, 'angle': math.pi/2})
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 1})
circuit = sdk.add_gate(circuit, {'type': 'rz', 'qubit': 2, 'angle': math.pi/4})
circuit = sdk.add_gate(circuit, {'type': 'rz', 'qubit': 2, 'angle': math.pi/2})
circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 2})

# Swap for correct output order
circuit = sdk.add_gate(circuit, {'type': 'swap', 'control_qubit': 0, 'qubit': 2})

result = await sdk.simulate(circuit)
print('QFT result:', result['probabilities'])`
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* SDK Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Quantum Algorithms SDK</h2>
          <p className="text-quantum-particle">
            Develop quantum algorithms with Python & JavaScript
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="neon-border">
            {activeLanguage === 'javascript' ? 'JavaScript' : 'Python'} SDK
          </Badge>
          <Button
            onClick={() => setActiveLanguage(activeLanguage === 'javascript' ? 'python' : 'javascript')}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            Switch to {activeLanguage === 'javascript' ? 'Python' : 'JavaScript'}
          </Button>
        </div>
      </div>

      {/* SDK Interface */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="editor" className="quantum-tab">
            <Code className="w-4 h-4 mr-2" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="interactive" className="quantum-tab">
            <Zap className="w-4 h-4 mr-2" />
            Interactive
          </TabsTrigger>
          <TabsTrigger value="docs" className="quantum-tab">
            <BookOpen className="w-4 h-4 mr-2" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="examples" className="quantum-tab">
            <FileText className="w-4 h-4 mr-2" />
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <SDKDemoPanel defaultSDK={activeLanguage} />
        </TabsContent>

        <TabsContent value="interactive" className="space-y-4">
          <InteractiveCircuitEditor
            circuit={circuit}
            onCircuitChange={handleCircuitChange}
            selectedAlgorithm={null}
          />
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">
                  {activeLanguage === 'javascript' ? 'JavaScript' : 'Python'} SDK Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-quantum-neon">Installation</h4>
                  <div className="bg-quantum-matrix/50 p-3 rounded font-mono text-xs">
                    {activeLanguage === 'javascript' ? (
                      'npm install qosim-sdk'
                    ) : (
                      'pip install qosim-sdk'
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-quantum-neon">Basic Usage</h4>
                  <div className="bg-quantum-matrix/50 p-3 rounded font-mono text-xs">
                    {activeLanguage === 'javascript' ? (
                      `import { QOSimSDK } from 'qosim-sdk';
const sdk = new QOSimSDK();
await sdk.initialize();`
                    ) : (
                      `from qosim_sdk import QOSimSDK
sdk = QOSimSDK()
await sdk.initialize()`
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-quantum-neon">Key Features</h4>
                  <ul className="text-sm text-quantum-particle space-y-1">
                    <li>• Real-time quantum simulation</li>
                    <li>• 20+ quantum gates</li>
                    <li>• Multi-qubit operations</li>
                    <li>• Circuit optimization</li>
                    <li>• Hardware integration</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">API Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-quantum-neon">Core Methods</h4>
                  <div className="space-y-1 text-sm">
                    <div className="bg-quantum-matrix/30 p-2 rounded">
                      <code className="text-quantum-energy">createCircuit(name, qubits)</code>
                      <p className="text-quantum-particle text-xs">Create a new quantum circuit</p>
                    </div>
                    <div className="bg-quantum-matrix/30 p-2 rounded">
                      <code className="text-quantum-energy">addGate(circuit, gate)</code>
                      <p className="text-quantum-particle text-xs">Add a quantum gate to circuit</p>
                    </div>
                    <div className="bg-quantum-matrix/30 p-2 rounded">
                      <code className="text-quantum-energy">simulate(circuit)</code>
                      <p className="text-quantum-particle text-xs">Run quantum simulation</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-quantum-neon">Gate Types</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <Badge variant="outline" className="neon-border">H</Badge>
                    <Badge variant="outline" className="neon-border">X</Badge>
                    <Badge variant="outline" className="neon-border">Y</Badge>
                    <Badge variant="outline" className="neon-border">Z</Badge>
                    <Badge variant="outline" className="neon-border">CNOT</Badge>
                    <Badge variant="outline" className="neon-border">RX</Badge>
                    <Badge variant="outline" className="neon-border">RY</Badge>
                    <Badge variant="outline" className="neon-border">RZ</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(algorithmTemplates[activeLanguage]).map(([key, template]) => (
              <Card key={key} className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow text-lg">
                    {template.name}
                  </CardTitle>
                  <p className="text-quantum-particle text-sm">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-quantum-matrix/50 p-3 rounded mb-4">
                    <pre className="text-xs text-quantum-neon overflow-x-auto">
                      {template.code}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="neon-border flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(template.code);
                        console.log('Code copied to clipboard');
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="neon-border"
                      onClick={() => {
                        navigator.clipboard.writeText(template.code);
                        console.log('Code copied to clipboard');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
