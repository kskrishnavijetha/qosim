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
  Atom
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
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              QOSim SDK Documentation
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive documentation for building quantum applications with QOSim SDKs
          </p>
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
                        'Installation',
                        'Quick Start',
                        'Core Concepts',
                        'API Reference',
                        'Examples',
                        'Best Practices',
                        'Error Handling',
                        'Advanced Usage'
                      ].map((item) => (
                        <a
                          key={item}
                          href={`#${item.toLowerCase().replace(' ', '-')}`}
                          className="block py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors"
                        >
                          {item}
                        </a>
                      ))}
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
                        'Installation',
                        'Quick Start',
                        'Circuit Building',
                        'Simulation',
                        'Examples',
                        'NumPy Integration',
                        'Advanced Features'
                      ].map((item) => (
                        <a
                          key={item}
                          href={`#py-${item.toLowerCase().replace(' ', '-')}`}
                          className="block py-2 px-3 rounded-md text-sm hover:bg-muted transition-colors"
                        >
                          {item}
                        </a>
                      ))}
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