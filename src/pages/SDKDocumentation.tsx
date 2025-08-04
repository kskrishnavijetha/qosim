import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Download, Code, Book, BookOpen, ExternalLink, Zap, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SDKDocumentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/app">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QOSim SDK Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Build quantum applications with our comprehensive JavaScript and Python SDKs
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="default">JavaScript</Badge>
            <Badge variant="outline">Python</Badge>
            <Badge variant="secondary">v1.0.0</Badge>
          </div>
          
          {/* Quick Links */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/docs/api">
              <Button variant="outline" className="gap-2">
                <Book className="h-4 w-4" />
                API Reference
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download SDK
            </Button>
            <Button variant="ghost" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    JavaScript SDK
                  </CardTitle>
                  <CardDescription>
                    Full-featured SDK for web applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• TypeScript support</li>
                    <li>• Real-time simulation</li>
                    <li>• Circuit visualization</li>
                    <li>• Cloud storage integration</li>
                  </ul>
                  <div className="mt-4">
                    <Link to="/docs/api">
                      <Button size="sm" className="w-full">
                        View API Reference
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Python SDK
                  </CardTitle>
                  <CardDescription>
                    Scientific computing and research
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• NumPy integration</li>
                    <li>• Jupyter notebook support</li>
                    <li>• Advanced algorithms</li>
                    <li>• Research tools</li>
                  </ul>
                  <div className="mt-4">
                    <Link to="/python-sdk">
                      <Button size="sm" variant="outline" className="w-full">
                        Python Documentation
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Enterprise Features
                  </CardTitle>
                  <CardDescription>
                    Advanced capabilities for teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Team collaboration</li>
                    <li>• Advanced security</li>
                    <li>• Priority support</li>
                    <li>• Custom integrations</li>
                  </ul>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Core Features</CardTitle>
                <CardDescription>
                  What you can build with QOSim SDK
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Quantum Circuit Simulation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      High-performance statevector simulation supporting up to 20 qubits locally
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Multiple Export Formats
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Export circuits to QASM, JSON, Python, or integrate with other quantum frameworks
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Secure Cloud Storage
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Save and share circuits with built-in authentication and access control
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Rich Documentation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive guides, examples, and API reference for every feature
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Start */}
          <TabsContent value="quickstart">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Guide</CardTitle>
                  <CardDescription>
                    Get started with the QOSim SDK in minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Installation</h3>
                  <p className="text-sm text-muted-foreground">
                    Install the QOSim SDK using npm or yarn:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="language-bash">
                      npm install @qosim/sdk
                    </code>
                  </pre>

                  <h3 className="text-lg font-semibold">Basic Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a simple quantum circuit and simulate it:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="language-javascript">
                      {`import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

// Initialize SDK
const sdk = new QOSimSDK();
await sdk.initialize();

// Create circuit
let circuit = sdk.createCircuit('My First Circuit', 2);

// Add gates
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });

// Simulate
const result = await sdk.simulate(circuit);
console.log(result.probabilities);`}
                    </code>
                  </pre>

                  <h3 className="text-lg font-semibold">Explore Examples</h3>
                  <p className="text-sm text-muted-foreground">
                    Check out the examples tab for more advanced use cases.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Bell State</CardTitle>
                  <CardDescription>
                    Create a Bell state circuit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A Bell state is a maximally entangled state of two qubits.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="language-javascript">
                      {`import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

// Initialize SDK
const sdk = new QOSimSDK();
await sdk.initialize();

// Create Bell state circuit
const builder = new CircuitBuilder(sdk);
const circuit = builder.bellState();

// Simulate
const result = await sdk.simulate(circuit);
console.log(result.probabilities);`}
                    </code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GHZ State</CardTitle>
                  <CardDescription>
                    Create a GHZ state circuit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A GHZ state is a multi-qubit entangled state.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="language-javascript">
                      {`import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

// Initialize SDK
const sdk = new QOSimSDK();
await sdk.initialize();

// Create GHZ state circuit
const builder = new CircuitBuilder(sdk);
const circuit = builder.ghzState(3);

// Simulate
const result = await sdk.simulate(circuit);
console.log(result.probabilities);`}
                    </code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quantum RNG</CardTitle>
                  <CardDescription>
                    Create a quantum random number generator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate random numbers using quantum superposition.
                  </p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code className="language-javascript">
                      {`import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

// Initialize SDK
const sdk = new QOSimSDK();
await sdk.initialize();

// Create quantum random number generator
const builder = new CircuitBuilder(sdk);
const circuit = builder.randomGenerator(4);

// Simulate
const result = await sdk.simulate(circuit);
console.log(result.probabilities);`}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Guides */}
          <TabsContent value="guides">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Circuit Design</CardTitle>
                  <CardDescription>
                    Best practices for designing quantum circuits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Qubit Allocation</h3>
                  <p className="text-sm text-muted-foreground">
                    Allocate qubits based on the complexity of your algorithm.
                  </p>

                  <h3 className="text-lg font-semibold">Gate Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose appropriate gates for your desired operations.
                  </p>

                  <h3 className="text-lg font-semibold">Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimize your circuit for minimal depth and gate count.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Simulation Techniques</CardTitle>
                  <CardDescription>
                    Tips for efficient quantum simulation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Statevector Simulation</h3>
                  <p className="text-sm text-muted-foreground">
                    Use statevector simulation for small circuits.
                  </p>

                  <h3 className="text-lg font-semibold">Cloud Simulation</h3>
                  <p className="text-sm text-muted-foreground">
                    Leverage cloud resources for larger circuits.
                  </p>

                  <h3 className="text-lg font-semibold">Error Mitigation</h3>
                  <p className="text-sm text-muted-foreground">
                    Implement error mitigation techniques for noisy simulations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation & References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h3 className="font-semibold">API Documentation</h3>
                      <div className="space-y-2">
                        <Link to="/docs/api" className="flex items-center gap-2 text-sm hover:text-primary">
                          <Book className="h-4 w-4" />
                          Complete API Reference
                        </Link>
                        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                          <Code className="h-4 w-4" />
                          TypeScript Types
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                          OpenAPI Spec
                        </a>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold">Community & Support</h3>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                          GitHub Repository
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                          Discord Community
                        </a>
                        <a href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                          Stack Overflow
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Downloads & Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Download className="h-6 w-6" />
                      <div>
                        <div className="font-semibold">JavaScript SDK</div>
                        <div className="text-xs text-muted-foreground">npm package</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Download className="h-6 w-6" />
                      <div>
                        <div className="font-semibold">Python SDK</div>
                        <div className="text-xs text-muted-foreground">pip package</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                      <Download className="h-6 w-6" />
                      <div>
                        <div className="font-semibold">PDF Guide</div>
                        <div className="text-xs text-muted-foreground">Complete manual</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Version Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Version</span>
                      <Badge variant="default">1.0.0</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Release Date</span>
                      <span className="text-sm text-muted-foreground">January 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Compatibility</span>
                      <span className="text-sm text-muted-foreground">Node.js 16+, Python 3.8+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
