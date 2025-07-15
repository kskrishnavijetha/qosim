import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Download, 
  FileText, 
  Book, 
  ExternalLink,
  Copy,
  CheckCircle,
  Zap,
  Cpu,
  Database,
  Atom,
  Globe,
  Github,
  Play,
  Settings,
  Terminal,
  Monitor,
  BookOpen,
  Star,
  Target,
  Layers,
  Shield,
  Gauge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SDKDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({
      description: "Code copied to clipboard!",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code, id)}
          className="text-muted-foreground hover:text-foreground"
        >
          {copiedCode === id ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              QOSim SDK Documentation
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive documentation for building quantum applications with QOSim SDKs
          </p>
          
          {/* Download Resources Section */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Download className="w-5 h-5" />
                Download Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/qosim-core.js" download>
                    <Cpu className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">QOSim Core</div>
                      <div className="text-xs text-muted-foreground">Core simulation engine</div>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/qosim-visualizer.js" download>
                    <Monitor className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">Visualizer</div>
                      <div className="text-xs text-muted-foreground">Circuit visualization</div>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/qosim-qasm.js" download>
                    <Code className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">QASM Parser</div>
                      <div className="text-xs text-muted-foreground">OpenQASM support</div>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/qosim-sdk.py" download>
                    <Zap className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">Python SDK</div>
                      <div className="text-xs text-muted-foreground">Complete Python library</div>
                    </div>
                  </a>
                </Button>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/qosim-getting-started.pdf" download>
                    <BookOpen className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">Getting Started Guide</div>
                      <div className="text-xs text-muted-foreground">PDF tutorial</div>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/qosim-tutorials.pdf" download>
                    <FileText className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">Advanced Tutorials</div>
                      <div className="text-xs text-muted-foreground">PDF documentation</div>
                    </div>
                  </a>
                </Button>
                <Button variant="outline" asChild className="h-auto p-4 flex-col gap-2">
                  <a href="/examples/" target="_blank">
                    <Github className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium">Example Circuits</div>
                      <div className="text-xs text-muted-foreground">Sample code</div>
                    </div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SDK Selection Tabs */}
        <Tabs defaultValue="javascript" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="javascript" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              JavaScript
            </TabsTrigger>
            <TabsTrigger value="python" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Python
            </TabsTrigger>
          </TabsList>

          {/* JavaScript SDK Documentation */}
          <TabsContent value="javascript" className="space-y-8">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Navigation Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                     <nav className="space-y-2">
                       {[
                         { name: 'Installation', icon: Download },
                         { name: 'Quick Start', icon: Play },
                         { name: 'Core Concepts', icon: Atom },
                         { name: 'API Reference', icon: Book },
                         { name: 'Examples', icon: FileText },
                         { name: 'Best Practices', icon: Star },
                         { name: 'Error Handling', icon: Shield },
                         { name: 'Advanced Usage', icon: Settings },
                         { name: 'Performance', icon: Gauge },
                         { name: 'Deployment', icon: Globe }
                       ].map((item) => {
                         const Icon = item.icon;
                         return (
                           <a
                             key={item.name}
                             href={`#${item.name.toLowerCase().replace(' ', '-')}`}
                             className="flex items-center gap-2 py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors"
                           >
                             <Icon className="w-4 h-4" />
                             {item.name}
                           </a>
                         );
                       })}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Installation */}
                <Card id="installation">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Installation & Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Download SDK Files</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" asChild>
                          <a href="/qosim-core.js" download>
                            <Download className="w-4 h-4 mr-2" />
                            qosim-core.js
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="/qosim-visualizer.js" download>
                            <Download className="w-4 h-4 mr-2" />
                            qosim-visualizer.js
                          </a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="/qosim-qasm.js" download>
                            <Download className="w-4 h-4 mr-2" />
                            qosim-qasm.js
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Basic Setup</h3>
                      <CodeBlock
                        id="js-setup"
                        language="javascript"
                        code={`import { QOSimSDK, CircuitBuilder } from './sdk/qosim-sdk';

// Initialize the SDK
const sdk = new QOSimSDK({
  defaultQubits: 3,
  autoSave: false,
  simulationMode: 'local'
});

// Initialize (loads QOSim core)
await sdk.initialize();`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Start */}
                <Card id="quick-start">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Create Your First Circuit</h3>
                      <CodeBlock
                        id="js-bell-state"
                        language="javascript"
                        code={`async function createBellState() {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  // Create a new circuit
  let circuit = sdk.createCircuit('Bell State', 2, 'Creates an entangled state');
  
  // Add gates
  circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
  circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
  
  // Simulate
  const result = await sdk.simulate(circuit);
  
  console.log('Probabilities:', result.probabilities);
  console.log('Basis States:', result.basisStates);
  
  return result;
}`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Core Concepts */}
                <Card id="core-concepts">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Atom className="w-5 h-5" />
                      Core Concepts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Quantum Gates</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>• Single-qubit: H, X, Y, Z, S, T</div>
                          <div>• Rotation: RX, RY, RZ</div>
                          <div>• Multi-qubit: CNOT, CCX, CZ</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Circuit Structure</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>• Gates array</div>
                          <div>• Qubit count</div>
                          <div>• Metadata</div>
                        </div>
                      </div>
                    </div>
                    
                    <CodeBlock
                      id="js-gate-examples"
                      language="javascript"
                      code={`// Single-qubit gates
{ type: 'h', qubit: 0 }                    // Hadamard
{ type: 'x', qubit: 0 }                    // Pauli-X
{ type: 'rx', qubit: 0, angle: Math.PI/4 } // X-rotation

// Two-qubit gates
{ type: 'cnot', controlQubit: 0, qubit: 1 } // CNOT`}
                    />
                  </CardContent>
                </Card>

                {/* API Reference */}
                <Card id="api-reference">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="w-5 h-5" />
                      API Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">QOSimSDK Class</h3>
                      <div className="space-y-4">
                        {[
                          {
                            method: 'initialize()',
                            description: 'Initializes the SDK and loads the QOSim core engine',
                            returns: 'Promise<void>'
                          },
                          {
                            method: 'createCircuit(name, qubits?, description?)',
                            description: 'Creates a new quantum circuit',
                            returns: 'QuantumCircuit'
                          },
                          {
                            method: 'addGate(circuit, gate)',
                            description: 'Adds a quantum gate to a circuit',
                            returns: 'QuantumCircuit'
                          },
                          {
                            method: 'simulate(circuit)',
                            description: 'Simulates a quantum circuit',
                            returns: 'Promise<SimulationResult>'
                          }
                        ].map((api, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                {api.method}
                              </code>
                              <Badge variant="outline">{api.returns}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{api.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Examples */}
                <Card id="examples">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Quantum Random Number Generator</h3>
                      <CodeBlock
                        id="js-qrng"
                        language="javascript"
                        code={`async function quantumRNG() {
  const sdk = new QOSimSDK();
  const builder = new CircuitBuilder(sdk);
  
  await sdk.initialize();
  
  // Create 4-bit quantum RNG
  const rngCircuit = builder.randomGenerator(4, 'QRNG-4');
  
  // Generate random number
  const result = await sdk.simulate(rngCircuit);
  
  // Sample from probabilities
  const random = Math.random();
  let cumulative = 0;
  let selectedState = '';
  
  for (let j = 0; j < result.probabilities.length; j++) {
    cumulative += result.probabilities[j];
    if (random <= cumulative) {
      selectedState = result.basisStates[j];
      break;
    }
  }
  
  return parseInt(selectedState, 2);
}`}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Quantum Fourier Transform</h3>
                      <CodeBlock
                        id="js-qft"
                        language="javascript"
                        code={`async function quantumFourierTransform() {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  let circuit = sdk.createCircuit('QFT', 3, 'Quantum Fourier Transform');
  
  // Apply QFT algorithm
  for (let j = 0; j < 3; j++) {
    circuit = sdk.addGate(circuit, { type: 'h', qubit: j });
    
    for (let k = j + 1; k < 3; k++) {
      const angle = Math.PI / Math.pow(2, k - j);
      circuit = sdk.addGate(circuit, { 
        type: 'cp', 
        controlQubit: k, 
        qubit: j, 
        angle: angle 
      });
    }
  }
  
  // Swap qubits for correct output order
  circuit = sdk.addGate(circuit, { type: 'swap', qubit1: 0, qubit2: 2 });
  
  return await sdk.simulate(circuit);
}`}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Grover's Search Algorithm</h3>
                      <CodeBlock
                        id="js-grover"
                        language="javascript"
                        code={`async function groversSearch(searchItem = '10') {
  const sdk = new QOSimSDK();
  await sdk.initialize();
  
  const n = searchItem.length;
  let circuit = sdk.createCircuit('Grover Search', n, \`Search for \${searchItem}\`);
  
  // Initialize superposition
  for (let i = 0; i < n; i++) {
    circuit = sdk.addGate(circuit, { type: 'h', qubit: i });
  }
  
  // Number of iterations
  const iterations = Math.floor(Math.PI / 4 * Math.sqrt(Math.pow(2, n)));
  
  for (let iter = 0; iter < iterations; iter++) {
    // Oracle for searchItem
    if (searchItem === '10') {
      circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
      circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 1, qubit: 0 });
      circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
    }
    
    // Diffusion operator
    for (let i = 0; i < n; i++) {
      circuit = sdk.addGate(circuit, { type: 'h', qubit: i });
      circuit = sdk.addGate(circuit, { type: 'x', qubit: i });
    }
    
    circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 1, qubit: 0 });
    
    for (let i = 0; i < n; i++) {
      circuit = sdk.addGate(circuit, { type: 'x', qubit: i });
      circuit = sdk.addGate(circuit, { type: 'h', qubit: i });
    }
  }
  
  return await sdk.simulate(circuit);
}`}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Best Practices */}
                <Card id="best-practices">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-600">✓ Do</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Always initialize SDK before use</li>
                          <li>• Use try-catch for error handling</li>
                          <li>• Validate circuit before simulation</li>
                          <li>• Limit qubit count for performance</li>
                          <li>• Use appropriate gate names</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-red-600">✗ Don't</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Exceed system memory limits</li>
                          <li>• Use undefined gate types</li>
                          <li>• Ignore simulation errors</li>
                          <li>• Create overly deep circuits</li>
                          <li>• Skip input validation</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Error Handling */}
                <Card id="error-handling">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Error Handling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CodeBlock
                      id="js-error-handling"
                      language="javascript"
                      code={`async function robustQuantumSimulation() {
  try {
    const sdk = new QOSimSDK();
    await sdk.initialize();
    
    // Validate circuit before simulation
    if (!sdk.validateCircuit(circuit)) {
      throw new Error('Invalid circuit structure');
    }
    
    // Check qubit limits
    if (circuit.qubits > 20) {
      console.warn('High qubit count may cause performance issues');
    }
    
    const result = await sdk.simulate(circuit);
    return result;
    
  } catch (error) {
    if (error.name === 'MemoryError') {
      console.error('Insufficient memory for simulation');
      // Try with reduced precision or fewer qubits
    } else if (error.name === 'ValidationError') {
      console.error('Circuit validation failed:', error.message);
    } else {
      console.error('Simulation error:', error);
    }
    
    return null;
  }
}`}
                    />
                  </CardContent>
                </Card>
                
                {/* Performance */}
                <Card id="performance">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5" />
                      Performance Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Circuit Optimization</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Minimize circuit depth</li>
                          <li>• Use gate decomposition</li>
                          <li>• Apply gate fusion when possible</li>
                          <li>• Remove redundant gates</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Memory Management</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Monitor memory usage</li>
                          <li>• Use sparse representations</li>
                          <li>• Clear unused circuits</li>
                          <li>• Batch simulations efficiently</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Deployment */}
                <Card id="deployment">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Deployment Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Web Deployment</h3>
                      <CodeBlock
                        id="js-web-deploy"
                        language="html"
                        code={`<!DOCTYPE html>
<html>
<head>
    <title>QOSim App</title>
    <script src="./qosim-core.js"></script>
    <script src="./qosim-sdk.js"></script>
</head>
<body>
    <script>
        async function initApp() {
            const sdk = new QOSimSDK();
            await sdk.initialize();
            // Your quantum application code here
        }
        
        initApp();
    </script>
</body>
</html>`}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Node.js Deployment</h3>
                      <CodeBlock
                        id="js-node-deploy"
                        language="javascript"
                        code={`// server.js
const express = require('express');
const QOSimSDK = require('./qosim-sdk');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/simulate', async (req, res) => {
  try {
    const sdk = new QOSimSDK();
    await sdk.initialize();
    
    const result = await sdk.simulate(req.body.circuit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(\`QOSim server running on port \${port}\`);
});`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Python SDK Documentation */}
          <TabsContent value="python" className="space-y-8">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Navigation Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                     <nav className="space-y-2">
                       {[
                         { name: 'Installation', icon: Download },
                         { name: 'Quick Start', icon: Play },
                         { name: 'Circuit Building', icon: Layers },
                         { name: 'Simulation', icon: Cpu },
                         { name: 'Examples', icon: FileText },
                         { name: 'NumPy Integration', icon: Database },
                         { name: 'Advanced Features', icon: Settings },
                         { name: 'Plotting & Visualization', icon: Monitor },
                         { name: 'Error Handling', icon: Shield }
                       ].map((item) => {
                         const Icon = item.icon;
                         return (
                           <a
                             key={item.name}
                             href={`#py-${item.name.toLowerCase().replace(' ', '-').replace('&', '')}`}
                             className="flex items-center gap-2 py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors"
                           >
                             <Icon className="w-4 h-4" />
                             {item.name}
                           </a>
                         );
                       })}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
                {/* Installation */}
                <Card id="py-installation">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Installation & Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Download Python SDK</h3>
                      <Button variant="outline" asChild>
                        <a href="/qosim-sdk.py" download>
                          <Download className="w-4 h-4 mr-2" />
                          Download qosim-sdk.py
                        </a>
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Installation</h3>
                      <CodeBlock
                        id="py-install"
                        language="bash"
                        code={`# Install dependencies
pip install numpy scipy matplotlib

# Import the SDK
from qosim_sdk import QOSimSDK, CircuitBuilder`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Start */}
                <Card id="py-quick-start">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Create Your First Circuit</h3>
                      <CodeBlock
                        id="py-bell-state"
                        language="python"
                        code={`from qosim_sdk import QOSimSDK, CircuitBuilder
import numpy as np

def create_bell_state():
    # Initialize SDK
    sdk = QOSimSDK(default_qubits=2)
    
    # Create circuit
    circuit = sdk.create_circuit('Bell State', 2, 'Creates an entangled state')
    
    # Add gates
    circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
    circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 0, 'qubit': 1})
    
    # Simulate
    result = sdk.simulate(circuit)
    
    print('Probabilities:', result['probabilities'])
    print('Basis States:', result['basis_states'])
    
    return result`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Circuit Building */}
                <Card id="py-circuit-building">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      Circuit Building
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CodeBlock
                      id="py-gates"
                      language="python"
                      code={`# Single-qubit gates
sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})  # Hadamard
sdk.add_gate(circuit, {'type': 'x', 'qubit': 0})  # Pauli-X
sdk.add_gate(circuit, {'type': 'rx', 'qubit': 0, 'angle': np.pi/4})  # X-rotation

# Two-qubit gates
sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 0, 'qubit': 1})  # CNOT

# Measurement
sdk.add_measurement(circuit, qubit=0, classical_bit=0)`}
                    />
                  </CardContent>
                </Card>

                {/* Simulation */}
                <Card id="py-simulation">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      Simulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Advanced Simulation Options</h3>
                      <CodeBlock
                        id="py-simulation"
                        language="python"
                        code={`# Advanced simulation with options
result = sdk.simulate(circuit, {
    'shots': 1000,
    'precision': 'double',
    'noise_model': None,
    'optimize': True
})

# Batch simulation
circuits = [circuit1, circuit2, circuit3]
results = sdk.simulate_batch(circuits)

# Statevector simulation
statevector = sdk.get_statevector(circuit)
print('Statevector shape:', statevector.shape)`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Examples */}
                <Card id="py-examples">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Quantum Teleportation</h3>
                      <CodeBlock
                        id="py-teleportation"
                        language="python"
                        code={`def quantum_teleportation():
    sdk = QOSimSDK(default_qubits=3)
    circuit = sdk.create_circuit('Quantum Teleportation', 3)
    
    # Prepare state to teleport (|+> state)
    circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
    
    # Create Bell pair between qubits 1 and 2
    circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 1})
    circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 1, 'qubit': 2})
    
    # Bell measurement on qubits 0 and 1
    circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 0, 'qubit': 1})
    circuit = sdk.add_gate(circuit, {'type': 'h', 'qubit': 0})
    
    # Measure qubits 0 and 1
    circuit = sdk.add_measurement(circuit, 0, 0)
    circuit = sdk.add_measurement(circuit, 1, 1)
    
    # Apply corrections based on measurements
    circuit = sdk.add_gate(circuit, {'type': 'cx', 'control_bit': 1, 'qubit': 2})
    circuit = sdk.add_gate(circuit, {'type': 'cz', 'control_bit': 0, 'qubit': 2})
    
    return sdk.simulate(circuit)`}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Variational Quantum Eigensolver (VQE)</h3>
                      <CodeBlock
                        id="py-vqe"
                        language="python"
                        code={`import numpy as np
from scipy.optimize import minimize

def vqe_h2_molecule():
    sdk = QOSimSDK(default_qubits=4)
    
    def ansatz_circuit(theta):
        circuit = sdk.create_circuit('VQE Ansatz', 4)
        
        # Initial state preparation
        circuit = sdk.add_gate(circuit, {'type': 'x', 'qubit': 0})
        circuit = sdk.add_gate(circuit, {'type': 'x', 'qubit': 1})
        
        # Parameterized ansatz
        circuit = sdk.add_gate(circuit, {'type': 'ry', 'qubit': 0, 'angle': theta[0]})
        circuit = sdk.add_gate(circuit, {'type': 'ry', 'qubit': 1, 'angle': theta[1]})
        circuit = sdk.add_gate(circuit, {'type': 'ry', 'qubit': 2, 'angle': theta[2]})
        circuit = sdk.add_gate(circuit, {'type': 'ry', 'qubit': 3, 'angle': theta[3]})
        
        # Entangling gates
        circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 0, 'qubit': 1})
        circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 1, 'qubit': 2})
        circuit = sdk.add_gate(circuit, {'type': 'cnot', 'control_qubit': 2, 'qubit': 3})
        
        return circuit
    
    def expectation_value(theta):
        circuit = ansatz_circuit(theta)
        result = sdk.simulate(circuit)
        # Calculate energy expectation value
        energy = calculate_h2_energy(result['statevector'])
        return energy
    
    # Optimize parameters
    initial_theta = np.random.uniform(0, 2*np.pi, 4)
    result = minimize(expectation_value, initial_theta, method='COBYLA')
    
    return result.x, result.fun`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* NumPy Integration */}
                <Card id="py-numpy-integration">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      NumPy Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">State Vector Analysis</h3>
                      <CodeBlock
                        id="py-numpy"
                        language="python"
                        code={`import numpy as np
import matplotlib.pyplot as plt

def analyze_state_vector(result):
    # Get state vector as NumPy array
    state_vector = np.array(result['state_vector'])
    
    # Calculate amplitudes and phases
    amplitudes = np.abs(state_vector)
    phases = np.angle(state_vector)
    
    # Entanglement measures
    def entropy_of_entanglement(state, subsystem_size):
        # Reshape state for partial trace
        n_qubits = int(np.log2(len(state)))
        state_matrix = state.reshape([2] * n_qubits)
        
        # Calculate reduced density matrix (simplified)
        rho = np.outer(state, np.conj(state))
        eigenvals = np.linalg.eigvals(rho)
        eigenvals = eigenvals[eigenvals > 1e-12]  # Remove numerical zeros
        
        return -np.sum(eigenvals * np.log2(eigenvals))
    
    # Visualize
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    
    # Amplitude plot
    ax1.bar(range(len(amplitudes)), amplitudes)
    ax1.set_title('State Amplitudes')
    ax1.set_xlabel('Basis State')
    ax1.set_ylabel('Amplitude')
    
    # Phase plot
    ax2.bar(range(len(phases)), phases)
    ax2.set_title('State Phases')
    ax2.set_xlabel('Basis State')
    ax2.set_ylabel('Phase (radians)')
    
    plt.tight_layout()
    plt.show()
    
    return amplitudes, phases`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced Features */}
                <Card id="py-advanced-features">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Advanced Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Custom Gate Definitions</h3>
                      <CodeBlock
                        id="py-custom-gates"
                        language="python"
                        code={`# Define custom unitary gate
import numpy as np

# Custom controlled-Y gate
def custom_cy_gate():
    cy_matrix = np.array([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, -1j],
        [0, 0, 1j, 0]
    ])
    return cy_matrix

# Register custom gate
sdk.register_custom_gate('cy', custom_cy_gate())

# Use in circuit
circuit = sdk.add_gate(circuit, {
    'type': 'cy', 
    'control_qubit': 0, 
    'qubit': 1
})`}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Noise Modeling</h3>
                      <CodeBlock
                        id="py-noise"
                        language="python"
                        code={`# Define noise model
noise_model = {
    'depolarizing': 0.01,  # 1% depolarizing noise
    'dephasing': 0.005,    # 0.5% dephasing noise
    'amplitude_damping': 0.002  # 0.2% amplitude damping
}

# Simulate with noise
result = sdk.simulate(circuit, noise_model=noise_model)

# Custom noise channel
def custom_amplitude_damping(gamma):
    def kraus_operators():
        E0 = np.array([[1, 0], [0, np.sqrt(1-gamma)]])
        E1 = np.array([[0, np.sqrt(gamma)], [0, 0]])
        return [E0, E1]
    return kraus_operators

sdk.add_noise_channel('custom_ad', custom_amplitude_damping)`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Plotting & Visualization */}
                <Card id="py-plotting-visualization">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Plotting & Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Circuit Visualization</h3>
                      <CodeBlock
                        id="py-plotting"
                        language="python"
                        code={`import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def plot_bloch_sphere(state_vector):
    """Plot qubit state on Bloch sphere"""
    # Extract single qubit from state
    qubit_state = state_vector[:2]  # First qubit
    
    # Calculate Bloch vector
    x = 2 * np.real(np.conj(qubit_state[0]) * qubit_state[1])
    y = 2 * np.imag(np.conj(qubit_state[0]) * qubit_state[1])
    z = np.abs(qubit_state[0])**2 - np.abs(qubit_state[1])**2
    
    # Create 3D plot
    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    
    # Draw sphere
    u, v = np.mgrid[0:2*np.pi:20j, 0:np.pi:10j]
    x_sphere = np.cos(u)*np.sin(v)
    y_sphere = np.sin(u)*np.sin(v)
    z_sphere = np.cos(v)
    ax.plot_wireframe(x_sphere, y_sphere, z_sphere, alpha=0.1)
    
    # Plot state vector
    ax.quiver(0, 0, 0, x, y, z, color='red', arrow_length_ratio=0.1)
    
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    ax.set_title('Qubit State on Bloch Sphere')
    
    plt.show()

def plot_circuit_diagram(circuit):
    """Visualize quantum circuit"""
    sdk.visualize_circuit(circuit, style='matplotlib')
    plt.show()

def plot_measurement_histogram(results):
    """Plot measurement results"""
    counts = results['counts']
    states = list(counts.keys())
    probabilities = list(counts.values())
    
    plt.figure(figsize=(10, 6))
    plt.bar(states, probabilities)
    plt.xlabel('Measurement Outcome')
    plt.ylabel('Probability')
    plt.title('Measurement Results')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()`}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Error Handling */}
                <Card id="py-error-handling">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Error Handling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CodeBlock
                      id="py-error-handling"
                      language="python"
                      code={`import logging
from qosim_sdk.exceptions import *

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def robust_quantum_simulation(circuit):
    try:
        # Validate circuit
        if not sdk.validate_circuit(circuit):
            raise CircuitValidationError("Invalid circuit structure")
        
        # Check resource limits
        if circuit.num_qubits > 20:
            logger.warning("High qubit count may cause memory issues")
            
        # Estimate memory requirements
        memory_req = sdk.estimate_memory(circuit)
        if memory_req > sdk.get_available_memory():
            raise InsufficientMemoryError(f"Requires {memory_req}MB, only {sdk.get_available_memory()}MB available")
        
        # Run simulation
        result = sdk.simulate(circuit)
        logger.info(f"Simulation completed successfully")
        return result
        
    except CircuitValidationError as e:
        logger.error(f"Circuit validation failed: {e}")
        return None
        
    except InsufficientMemoryError as e:
        logger.error(f"Memory error: {e}")
        # Try with reduced precision
        logger.info("Retrying with reduced precision...")
        try:
            result = sdk.simulate(circuit, precision='single')
            return result
        except Exception as retry_error:
            logger.error(f"Retry failed: {retry_error}")
            return None
            
    except QuantumSimulationError as e:
        logger.error(f"Simulation error: {e}")
        return None
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return None
        
    finally:
        # Cleanup resources
        sdk.cleanup()`}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" asChild>
                <a href="/qosim-getting-started.pdf" target="_blank">
                  <FileText className="w-4 h-4 mr-2" />
                  Getting Started
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/qosim-tutorials.pdf" target="_blank">
                  <FileText className="w-4 h-4 mr-2" />
                  Tutorials
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  API Reference
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#" target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Examples Repository
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SDKDocumentation;