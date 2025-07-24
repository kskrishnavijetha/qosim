
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, FileText, Download, ExternalLink } from 'lucide-react';

export function SDKDocumentation() {
  const [activeSection, setActiveSection] = useState('overview');

  const apiMethods = [
    {
      name: 'createCircuit',
      description: 'Create a new quantum circuit',
      syntax: 'sdk.createCircuit(name, qubits)',
      parameters: [
        { name: 'name', type: 'string', description: 'Circuit name' },
        { name: 'qubits', type: 'number', description: 'Number of qubits' }
      ]
    },
    {
      name: 'addGate',
      description: 'Add a quantum gate to the circuit',
      syntax: 'circuit.addGate(type, qubit, ...params)',
      parameters: [
        { name: 'type', type: 'string', description: 'Gate type (H, X, Y, Z, CNOT, RX, RY, RZ)' },
        { name: 'qubit', type: 'number', description: 'Target qubit index' },
        { name: 'params', type: 'any[]', description: 'Gate-specific parameters' }
      ]
    },
    {
      name: 'simulate',
      description: 'Simulate the quantum circuit',
      syntax: 'await sdk.simulate(circuit)',
      parameters: [
        { name: 'circuit', type: 'Circuit', description: 'Circuit to simulate' }
      ]
    },
    {
      name: 'exportToQASM',
      description: 'Export circuit to OpenQASM format',
      syntax: 'sdk.exportToQASM(circuit)',
      parameters: [
        { name: 'circuit', type: 'Circuit', description: 'Circuit to export' }
      ]
    }
  ];

  const examples = [
    {
      title: 'Bell State Creation',
      language: 'javascript',
      code: `const sdk = new QOSimSDK();
const circuit = sdk.createCircuit('Bell State', 2);
circuit.addGate('H', 0);
circuit.addGate('CNOT', 0, 1);
const result = await sdk.simulate(circuit);`
    },
    {
      title: 'Quantum Fourier Transform',
      language: 'python',
      code: `sdk = QOSimSDK()
circuit = sdk.create_circuit('QFT', 3)
circuit.add_gate('H', 0)
circuit.add_gate('RZ', 1, np.pi/2)
circuit.add_gate('RZ', 2, np.pi/4)
result = await sdk.simulate(circuit)`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-quantum-glow">SDK Documentation</h2>
        <Button variant="outline" className="neon-border">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-neon flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                QOSim SDK Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-quantum-glow mb-2">Features</h3>
                <ul className="space-y-2 text-quantum-particle">
                  <li>• Pre-built quantum algorithms (Grover's, QFT, Shor's, Bell States)</li>
                  <li>• Custom algorithm development with intuitive APIs</li>
                  <li>• Real-time access to QOSim's simulation backend</li>
                  <li>• Code generation for JavaScript and Python</li>
                  <li>• OpenQASM export for hardware compatibility</li>
                  <li>• Comprehensive documentation and examples</li>
                </ul>
              </div>
              
              <Separator className="bg-quantum-matrix" />
              
              <div>
                <h3 className="text-lg font-semibold text-quantum-glow mb-2">Installation</h3>
                <div className="space-y-2">
                  <Badge variant="outline">JavaScript</Badge>
                  <pre className="bg-quantum-void p-3 rounded text-quantum-glow font-mono text-sm">
                    npm install @qosim/sdk
                  </pre>
                  <Badge variant="outline">Python</Badge>
                  <pre className="bg-quantum-void p-3 rounded text-quantum-glow font-mono text-sm">
                    pip install qosim-sdk
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-neon flex items-center">
                <Code className="w-5 h-5 mr-2" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {apiMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-quantum-glow font-mono">
                        {method.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        Method
                      </Badge>
                    </div>
                    <p className="text-quantum-particle">{method.description}</p>
                    <pre className="bg-quantum-void p-3 rounded text-quantum-glow font-mono text-sm">
                      {method.syntax}
                    </pre>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-quantum-neon">Parameters:</h4>
                      {method.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-center space-x-4 text-sm">
                          <Badge variant="outline" className="text-xs">
                            {param.type}
                          </Badge>
                          <span className="text-quantum-glow font-mono">{param.name}</span>
                          <span className="text-quantum-particle">{param.description}</span>
                        </div>
                      ))}
                    </div>
                    {index < apiMethods.length - 1 && <Separator className="bg-quantum-matrix" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="space-y-4">
            {examples.map((example, index) => (
              <Card key={index} className="quantum-panel neon-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-quantum-neon">
                      {example.title}
                    </CardTitle>
                    <Badge variant="outline">
                      {example.language}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-quantum-void p-4 rounded text-quantum-glow font-mono text-sm overflow-x-auto">
                    {example.code}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-neon flex items-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                Integration Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-quantum-glow mb-2">Web Integration</h3>
                <pre className="bg-quantum-void p-3 rounded text-quantum-glow font-mono text-sm">
{`import { QOSimSDK } from '@qosim/sdk';

const sdk = new QOSimSDK({
  apiKey: 'your-api-key',
  endpoint: 'https://api.qosim.com'
});

await sdk.initialize();`}
                </pre>
              </div>
              
              <Separator className="bg-quantum-matrix" />
              
              <div>
                <h3 className="text-lg font-semibold text-quantum-glow mb-2">Python Integration</h3>
                <pre className="bg-quantum-void p-3 rounded text-quantum-glow font-mono text-sm">
{`from qosim import QOSimSDK

sdk = QOSimSDK(
    api_key='your-api-key',
    endpoint='https://api.qosim.com'
)

await sdk.initialize()`}
                </pre>
              </div>
              
              <Separator className="bg-quantum-matrix" />
              
              <div>
                <h3 className="text-lg font-semibold text-quantum-glow mb-2">Hardware Integration</h3>
                <ul className="space-y-2 text-quantum-particle">
                  <li>• IBM Quantum Network</li>
                  <li>• Google Quantum AI</li>
                  <li>• Amazon Braket</li>
                  <li>• Rigetti Quantum Cloud Services</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
