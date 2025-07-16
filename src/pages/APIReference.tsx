
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Code, Book, Zap, Shield, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function APIReference() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard');
  };

  const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'javascript' }) => (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QOSim SDK API Reference
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Complete reference for the QOSim JavaScript & Python SDKs
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="default">v1.0.0</Badge>
            <Badge variant="outline">JavaScript</Badge>
            <Badge variant="outline">Python</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="core">Core API</TabsTrigger>
            <TabsTrigger value="circuits">Circuits</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="errors">Error Handling</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Quick start guide for the QOSim SDK
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Installation</h3>
                  <CodeBlock code={`// JavaScript/TypeScript
npm install @qosim/sdk

# Python
pip install qosim-sdk`} language="bash" />

                  <h3 className="text-lg font-semibold">Basic Usage</h3>
                  <CodeBlock code={`import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

// Initialize SDK
const sdk = new QOSimSDK({
  autoSave: true,
  defaultQubits: 3,
  simulationMode: 'local'
});

// Initialize and create circuit
await sdk.initialize();
const circuit = sdk.createCircuit('My First Circuit', 2);

// Add gates
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });

// Simulate
const result = await sdk.simulate(circuit);
console.log(result.probabilities);`} />

                  <h3 className="text-lg font-semibold">Base URL</h3>
                  <p className="text-sm text-muted-foreground">
                    The QOSim SDK communicates with the following endpoints:
                  </p>
                  <CodeBlock code={`// Production
https://api.qosim.com/v1

// Staging
https://staging-api.qosim.com/v1`} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SDK Configuration Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={`interface SDKConfig {
  autoSave?: boolean;        // Auto-save circuits (default: false)
  defaultQubits?: number;    // Default qubit count (default: 3)
  simulationMode?: 'local' | 'cloud'; // Simulation backend
  maxQubits?: number;        // Maximum qubits allowed (default: 20)
}`} language="typescript" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Authentication */}
          <TabsContent value="auth">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    How to authenticate with the QOSim API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    QOSim uses Supabase authentication. Users must be authenticated to save/load circuits.
                  </p>

                  <h3 className="text-lg font-semibold">Check Authentication Status</h3>
                  <CodeBlock code={`// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  throw new Error('Authentication required');
}`} />

                  <h3 className="text-lg font-semibold">Login</h3>
                  <CodeBlock code={`// Email/Password login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// OAuth login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github'
});`} />

                  <h3 className="text-lg font-semibold">Logout</h3>
                  <CodeBlock code={`const { error } = await supabase.auth.signOut();`} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Core API */}
          <TabsContent value="core">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Core API Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">QOSimSDK Constructor</h3>
                    <CodeBlock code={`const sdk = new QOSimSDK(config?: SDKConfig)`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Creates a new SDK instance with optional configuration.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">initialize()</h3>
                    <CodeBlock code={`await sdk.initialize(): Promise<void>`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Initializes the SDK and loads the QOSim core simulation engine.
                    </p>
                    <div className="mt-2">
                      <Badge variant="destructive">Required</Badge>
                      <span className="text-sm text-muted-foreground ml-2">Must be called before using other methods</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">createCircuit()</h3>
                    <CodeBlock code={`sdk.createCircuit(
  name: string,
  qubits?: number,
  description?: string
): QuantumCircuit`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Creates a new quantum circuit with the specified parameters.
                    </p>
                    <div className="mt-2">
                      <h4 className="font-medium">Parameters:</h4>
                      <ul className="text-sm text-muted-foreground ml-4 mt-1">
                        <li><code>name</code> - Circuit name (required)</li>
                        <li><code>qubits</code> - Number of qubits (optional, default from config)</li>
                        <li><code>description</code> - Circuit description (optional)</li>
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">addGate()</h3>
                    <CodeBlock code={`sdk.addGate(
  circuit: QuantumCircuit,
  gate: QuantumGate
): QuantumCircuit`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Adds a quantum gate to the circuit and returns the updated circuit.
                    </p>
                    <div className="mt-2">
                      <h4 className="font-medium">Gate Types:</h4>
                      <CodeBlock code={`// Single-qubit gates
{ type: 'h', qubit: 0 }           // Hadamard
{ type: 'x', qubit: 0 }           // Pauli-X
{ type: 'y', qubit: 0 }           // Pauli-Y
{ type: 'z', qubit: 0 }           // Pauli-Z

// Rotation gates
{ type: 'rx', qubit: 0, angle: Math.PI/2 }
{ type: 'ry', qubit: 0, angle: Math.PI/4 }
{ type: 'rz', qubit: 0, angle: Math.PI/3 }

// Two-qubit gates
{ type: 'cnot', controlQubit: 0, qubit: 1 }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Circuits */}
          <TabsContent value="circuits">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Circuit Management</CardTitle>
                  <CardDescription>
                    Create, modify, and manage quantum circuits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Circuit Builder Helpers</h3>
                    <CodeBlock code={`const builder = new CircuitBuilder(sdk);

// Create Bell state
const bellCircuit = builder.bellState('My Bell State');

// Create GHZ state
const ghzCircuit = builder.ghzState(3, 'Three-qubit GHZ');

// Create quantum random number generator
const rngCircuit = builder.randomGenerator(4, 'QRNG');`} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Circuit Export</h3>
                    <CodeBlock code={`// Export to different formats
const jsonExport = sdk.exportCircuit(circuit, 'json');
const qasmExport = sdk.exportCircuit(circuit, 'qasm');
const pythonExport = sdk.exportCircuit(circuit, 'python');

// Example QASM output
/*
OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
cx q[0],q[1];

measure q -> c;
*/`} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Data Types</h3>
                    <CodeBlock code={`interface QuantumCircuit {
  id?: string;
  name: string;
  description?: string;
  gates: QuantumGate[];
  qubits: number;
  metadata?: Record<string, any>;
}

interface QuantumGate {
  type: string;
  qubit: number;
  controlQubit?: number;
  angle?: number;
  parameters?: Record<string, any>;
}`} language="typescript" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Simulation */}
          <TabsContent value="simulation">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quantum Simulation
                  </CardTitle>
                  <CardDescription>
                    Execute quantum circuits and analyze results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">simulate()</h3>
                    <CodeBlock code={`const result = await sdk.simulate(circuit): Promise<SimulationResult>`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Executes the quantum circuit and returns comprehensive results.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Simulation Result</h3>
                    <CodeBlock code={`interface SimulationResult {
  stateVector: Array<{ real: number; imaginary: number }>;
  probabilities: number[];
  basisStates: string[];
  measurements?: Record<string, number>;
  executionTime: number;
  circuitDepth: number;
}`} language="typescript" />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Example Usage</h3>
                    <CodeBlock code={`// Create and simulate Bell state
const circuit = builder.bellState();
const result = await sdk.simulate(circuit);

console.log('Execution time:', result.executionTime, 'ms');
console.log('Circuit depth:', result.circuitDepth);

// Analyze probabilities
result.basisStates.forEach((state, index) => {
  const probability = result.probabilities[index];
  if (probability > 0.001) { // Show states with >0.1% probability
    console.log(\`|\${state}⟩: \${(probability * 100).toFixed(2)}%\`);
  }
});

// Access state vector
result.stateVector.forEach((amplitude, index) => {
  const state = index.toString(2).padStart(circuit.qubits, '0');
  console.log(\`|\${state}⟩: \${amplitude.real.toFixed(4)} + \${amplitude.imaginary.toFixed(4)}i\`);
});`} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Storage */}
          <TabsContent value="storage">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Circuit Storage</CardTitle>
                  <CardDescription>
                    Save, load, and manage circuits in the cloud
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">saveCircuit()</h3>
                    <CodeBlock code={`const circuitId = await sdk.saveCircuit(circuit): Promise<string>`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Saves the circuit to the database and returns the circuit ID.
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline">Requires Authentication</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">loadCircuit()</h3>
                    <CodeBlock code={`const circuit = await sdk.loadCircuit(circuitId: string): Promise<QuantumCircuit>`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Loads a circuit from the database by ID.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">listCircuits()</h3>
                    <CodeBlock code={`const circuits = await sdk.listCircuits(): Promise<QuantumCircuit[]>`} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Returns all circuits owned by the authenticated user.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Complete Example</h3>
                    <CodeBlock code={`// Create and save a circuit
const circuit = sdk.createCircuit('Quantum Teleportation', 3);
// ... add gates ...

try {
  const circuitId = await sdk.saveCircuit(circuit);
  console.log('Circuit saved with ID:', circuitId);
  
  // Load it back
  const loadedCircuit = await sdk.loadCircuit(circuitId);
  console.log('Loaded circuit:', loadedCircuit.name);
  
  // List all user circuits
  const allCircuits = await sdk.listCircuits();
  console.log('Total circuits:', allCircuits.length);
  
} catch (error) {
  console.error('Storage operation failed:', error);
}`} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Error Handling */}
          <TabsContent value="errors">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Error Handling</CardTitle>
                  <CardDescription>
                    Common errors and how to handle them
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Common Error Types</h3>
                    <CodeBlock code={`// Initialization errors
try {
  await sdk.initialize();
} catch (error) {
  console.error('SDK initialization failed:', error.message);
  // Handle: Check if QOSim core is available
}

// Gate validation errors
try {
  circuit = sdk.addGate(circuit, { type: 'cnot', qubit: 5 }); // Invalid qubit
} catch (error) {
  console.error('Gate validation failed:', error.message);
  // Handle: Check qubit indices and gate requirements
}

// Simulation errors
try {
  const result = await sdk.simulate(circuit);
} catch (error) {
  console.error('Simulation failed:', error.message);
  // Handle: Check circuit validity and simulator state
}`} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Authentication Errors</h3>
                    <CodeBlock code={`// Storage operations without authentication
try {
  await sdk.saveCircuit(circuit);
} catch (error) {
  if (error.message.includes('Authentication required')) {
    // Redirect to login or show auth prompt
    console.log('Please log in to save circuits');
  }
}`} />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Error Response Format</h3>
                    <CodeBlock code={`interface QOSimError extends Error {
  name: string;
  message: string;
  code?: string;
  details?: any;
}

// Example error responses:
{
  name: 'ValidationError',
  message: 'Invalid qubit index: 5. Must be between 0 and 2',
  code: 'INVALID_QUBIT_INDEX'
}

{
  name: 'SimulationError', 
  message: 'Simulation failed: Circuit too large',
  code: 'CIRCUIT_TOO_LARGE',
  details: { maxQubits: 20, requestedQubits: 25 }
}`} language="typescript" />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">1</Badge>
                        <p>Always wrap SDK operations in try-catch blocks</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">2</Badge>
                        <p>Check authentication status before storage operations</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">3</Badge>
                        <p>Validate circuit parameters before simulation</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">4</Badge>
                        <p>Handle network errors gracefully for cloud operations</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5">5</Badge>
                        <p>Provide user-friendly error messages in your UI</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>QOSim SDK v1.0.0</span>
            <Separator orientation="vertical" className="h-4" />
            <a href="/docs" className="flex items-center gap-1 hover:text-primary">
              <Book className="h-4 w-4" />
              Documentation
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a href="https://github.com/qosim/sdk" className="flex items-center gap-1 hover:text-primary">
              <ExternalLink className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
