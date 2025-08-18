import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Code, Wand2 } from 'lucide-react';
import { SDKPlayground } from '../sdk/SDKPlayground';

export function SDKDemoPanel() {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Code className="w-5 h-5" />
          QOSim SDK Demo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Explore the QOSim SDK with live examples and a quantum playground
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="examples" className="w-full">
          <TabsList className="grid w-full grid-cols-2 quantum-tabs">
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Examples
            </TabsTrigger>
            <TabsTrigger value="playground" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Playground
            </TabsTrigger>
          </TabsList>

          <TabsContent value="examples" className="space-y-4">
            <div>
              <h3 className="font-mono text-blue-400 font-semibold mb-2">Bell State Example</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Create and simulate a Bell state circuit using the QOSim SDK.
              </p>
              <SDKPlayground
                code={`// Bell State Example
import { QOSimSDK } from '@qosim/sdk';

// Initialize the SDK
const sdk = new QOSimSDK();

// Create a Bell state circuit
const circuit = sdk.createCircuit();
circuit.addGate('h', 0);      // Add Hadamard gate
circuit.addGate('cnot', 0, 1); // Add CNOT gate

// Run simulation
const result = await sdk.simulate(circuit);
console.log('Bell state probabilities:', result.probabilities);`}
                onChange={(newCode) => {
                  console.log('Code updated:', newCode);
                }}
              />
            </div>
          </TabsContent>

        <TabsContent value="playground" className="space-y-4">
          <SDKPlayground 
            code={`// Welcome to QOSim SDK Playground
import { QOSimSDK } from '@qosim/sdk';

// Initialize the SDK
const sdk = new QOSimSDK();

// Create a simple Bell state circuit
const circuit = sdk.createCircuit();
circuit.addGate('h', 0);      // Add Hadamard gate
circuit.addGate('cnot', 0, 1); // Add CNOT gate

// Run simulation
const result = await sdk.simulate(circuit);
console.log('Bell state probabilities:', result.probabilities);`}
            onChange={(newCode) => {
              console.log('Code updated:', newCode);
            }}
          />
        </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
