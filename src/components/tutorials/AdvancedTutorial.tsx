
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Globe, Code, Rocket, ArrowRight, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AdvancedTutorialProps {
  onProgressUpdate: (progress: number) => void;
}

export function AdvancedTutorial({ onProgressUpdate }: AdvancedTutorialProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps = [
    {
      id: 'sdk-setup',
      title: 'Setting Up QOSim SDK',
      description: 'Install and configure the QOSim SDK in your web application',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Learn how to integrate the QOSim SDK into your web applications for quantum circuit simulation.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Installation</h4>
            <pre className="bg-black text-green-400 p-3 rounded text-sm font-mono">
              npm install @qosim/sdk
            </pre>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Project Structure</h4>
            <div className="text-sm font-mono space-y-1 text-foreground">
              <div>my-quantum-app/</div>
              <div>├── src/</div>
              <div>│   ├── components/</div>
              <div>│   ├── utils/</div>
              <div>│   │   └── quantum.js</div>
              <div>│   └── app.js</div>
              <div>├── package.json</div>
              <div>└── README.md</div>
            </div>
          </div>
        </div>
      ),
      codeExample: `// Basic SDK Initialization
import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

// Initialize SDK with configuration
const sdk = new QOSimSDK({
  autoSave: true,
  defaultQubits: 3,
  simulationMode: 'local',
  maxQubits: 20
});

// Initialize the SDK (loads quantum simulation engine)
await sdk.initialize();

console.log('QOSim SDK initialized successfully!');`,
      completed: false
    },
    {
      id: 'react-integration',
      title: 'React Integration',
      description: 'Build a React component for quantum circuit visualization',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Create interactive React components that leverage the QOSim SDK for real-time quantum simulation.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Component Features</h4>
            <ul className="space-y-1 text-sm text-foreground">
              <li>• Real-time circuit building interface</li>
              <li>• Live probability visualization</li>
              <li>• Interactive gate placement</li>
              <li>• Simulation results display</li>
            </ul>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Best Practices</h4>
            <ul className="space-y-1 text-sm text-foreground">
              <li>• Use React hooks for state management</li>
              <li>• Implement proper error handling</li>
              <li>• Optimize re-renders with useMemo</li>
              <li>• Handle async operations properly</li>
            </ul>
          </div>
        </div>
      ),
      codeExample: `// React Quantum Circuit Component
import React, { useState, useEffect, useMemo } from 'react';
import { QOSimSDK } from '@qosim/sdk';

const QuantumCircuitBuilder = () => {
  const [sdk, setSdk] = useState(null);
  const [circuit, setCircuit] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize SDK on component mount
  useEffect(() => {
    const initSDK = async () => {
      const qosim = new QOSimSDK();
      await qosim.initialize();
      setSdk(qosim);
      
      // Create initial circuit
      const initialCircuit = qosim.createCircuit('My Circuit', 2);
      setCircuit(initialCircuit);
    };
    
    initSDK();
  }, []);

  // Add gate to circuit
  const addGate = async (gateType, qubit, controlQubit = null) => {
    if (!sdk || !circuit) return;

    try {
      const gate = controlQubit !== null 
        ? { type: gateType, controlQubit, qubit }
        : { type: gateType, qubit };
        
      const newCircuit = sdk.addGate(circuit, gate);
      setCircuit(newCircuit);
      
      // Auto-simulate
      await simulateCircuit(newCircuit);
    } catch (error) {
      console.error('Error adding gate:', error);
    }
  };

  // Simulate circuit
  const simulateCircuit = async (circuitToSimulate = circuit) => {
    if (!sdk || !circuitToSimulate) return;

    setLoading(true);
    try {
      const result = await sdk.simulate(circuitToSimulate);
      setResults(result);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized probability bars
  const probabilityBars = useMemo(() => {
    if (!results) return null;

    return results.basisStates.map((state, index) => (
      <div key={state} className="flex items-center gap-2 mb-2">
        <span className="font-mono text-sm w-8">|{state}⟩</span>
        <div className="flex-1 bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: \`\${(results.probabilities[index] * 100).toFixed(1)}%\` }}
          />
        </div>
        <span className="text-sm w-12">
          {(results.probabilities[index] * 100).toFixed(1)}%
        </span>
      </div>
    ));
  }, [results]);

  if (!sdk) return <div>Loading QOSim SDK...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Quantum Circuit Builder</h2>
      
      {/* Gate Palette */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Gates</h3>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => addGate('h', 0)}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            H (Qubit 0)
          </button>
          <button 
            onClick={() => addGate('h', 1)}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            H (Qubit 1)
          </button>
          <button 
            onClick={() => addGate('cnot', 1, 0)}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            CNOT (0→1)
          </button>
          <button 
            onClick={() => addGate('x', 0)}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            X (Qubit 0)
          </button>
        </div>
      </div>

      {/* Circuit Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Circuit</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Gates: {circuit?.gates.length || 0}</p>
          <div className="font-mono text-sm">
            {circuit?.gates.map((gate, index) => (
              <div key={index}>
                {gate.type.toUpperCase()}
                {gate.controlQubit !== undefined ? 
                  \` (Control: \${gate.controlQubit}, Target: \${gate.qubit})\` :
                  \` (Qubit: \${gate.qubit})\`
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Simulation Results</h3>
          <div className="bg-white p-4 rounded-lg border">
            {loading ? (
              <div>Simulating...</div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Execution time: {results.executionTime.toFixed(2)}ms
                </p>
                {probabilityBars}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumCircuitBuilder;`,
      completed: false
    },
    {
      id: 'advanced-features',
      title: 'Advanced SDK Features',
      description: 'Explore circuit export, cloud storage, and optimization',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Leverage advanced SDK features for production quantum applications.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4 bg-card">
              <h4 className="font-semibold mb-2 text-foreground">Circuit Export</h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• QASM format</li>
                <li>• JSON serialization</li>
                <li>• Python/Qiskit</li>
                <li>• Custom formats</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <h4 className="font-semibold mb-2 text-foreground">Cloud Storage</h4>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Save/load circuits</li>
                <li>• User authentication</li>
                <li>• Version control</li>
                <li>• Sharing & collaboration</li>
              </ul>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Performance Optimization</h4>
            <ul className="space-y-1 text-sm text-foreground">
              <li>• Lazy loading for large circuits</li>
              <li>• Web Workers for simulation</li>
              <li>• Circuit compression</li>
              <li>• Caching strategies</li>
            </ul>
          </div>
        </div>
      ),
      codeExample: `// Advanced SDK Features Example
import { QOSimSDK, CircuitBuilder } from '@qosim/sdk';

const sdk = new QOSimSDK({ autoSave: true });
await sdk.initialize();

// 1. Create complex circuit using builder
const builder = new CircuitBuilder(sdk);
const bellState = builder.bellState('Entangled Pair');
const ghzState = builder.ghzState(3, 'GHZ Triple');

// 2. Export circuits to different formats
const qasmCode = sdk.exportCircuit(bellState, 'qasm');
const pythonCode = sdk.exportCircuit(bellState, 'python');
const jsonData = sdk.exportCircuit(bellState, 'json');

console.log('QASM Export:', qasmCode);

// 3. Save to cloud (requires authentication)
try {
  const circuitId = await sdk.saveCircuit(bellState);
  console.log('Circuit saved with ID:', circuitId);
  
  // Load circuit back
  const loadedCircuit = await sdk.loadCircuit(circuitId);
  console.log('Loaded circuit:', loadedCircuit.name);
  
  // List all user circuits
  const allCircuits = await sdk.listCircuits();
  console.log('Total circuits:', allCircuits.length);
} catch (error) {
  console.log('Cloud features require authentication');
}

// 4. Performance optimization with Web Workers
const performHeavySimulation = async (circuit) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/quantum-worker.js');
    
    worker.postMessage({ 
      type: 'SIMULATE_CIRCUIT', 
      circuit: sdk.exportCircuit(circuit, 'json')
    });
    
    worker.onmessage = (e) => {
      if (e.data.type === 'SIMULATION_COMPLETE') {
        resolve(e.data.result);
      } else if (e.data.type === 'SIMULATION_ERROR') {
        reject(new Error(e.data.error));
      }
    };
  });
};

// 5. Batch processing multiple circuits
const batchSimulate = async (circuits) => {
  const results = await Promise.all(
    circuits.map(circuit => sdk.simulate(circuit))
  );
  
  return results.map((result, index) => ({
    circuitName: circuits[index].name,
    executionTime: result.executionTime,
    highestProbability: Math.max(...result.probabilities)
  }));
};`,
      completed: false
    },
    {
      id: 'deployment',
      title: 'Production Deployment',
      description: 'Deploy your quantum web application to production',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Learn best practices for deploying quantum web applications with the QOSim SDK.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Build Optimization</h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li><strong>Code Splitting:</strong> Load quantum features on-demand</li>
              <li><strong>Tree Shaking:</strong> Include only used SDK functions</li>
              <li><strong>Minification:</strong> Compress quantum simulation code</li>
              <li><strong>CDN:</strong> Serve SDK from fast content delivery network</li>
            </ul>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Environment Configuration</h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li><strong>Development:</strong> Full debugging, local simulation</li>
              <li><strong>Staging:</strong> Production-like testing environment</li>
              <li><strong>Production:</strong> Optimized performance, cloud simulation</li>
            </ul>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Monitoring & Analytics</h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li><strong>Performance:</strong> Track simulation execution times</li>
              <li><strong>Usage:</strong> Monitor gate usage patterns</li>
              <li><strong>Errors:</strong> Catch and report quantum simulation errors</li>
              <li><strong>User Behavior:</strong> Understand how users build circuits</li>
            </ul>
          </div>
        </div>
      ),
      codeExample: `// Production Deployment Configuration

// 1. Webpack Configuration for Code Splitting
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        quantum: {
          test: /[\\/]node_modules[\\/]@qosim/,
          name: 'quantum',
          chunks: 'all',
        },
      },
    },
  },
};

// 2. Environment-based SDK Configuration
// src/config/quantum.js
const getQuantumConfig = () => {
  const env = process.env.NODE_ENV;
  
  const configs = {
    development: {
      simulationMode: 'local',
      debugMode: true,
      maxQubits: 10,
      autoSave: false
    },
    production: {
      simulationMode: 'cloud',
      debugMode: false,
      maxQubits: 20,
      autoSave: true,
      apiEndpoint: process.env.REACT_APP_QOSIM_API
    }
  };
  
  return configs[env] || configs.development;
};

// 3. Lazy Loading Quantum Components
// src/components/LazyQuantumBuilder.js
import { lazy, Suspense } from 'react';

const QuantumCircuitBuilder = lazy(() => 
  import('./QuantumCircuitBuilder')
);

const LazyQuantumBuilder = () => (
  <Suspense fallback={<div>Loading Quantum Features...</div>}>
    <QuantumCircuitBuilder />
  </Suspense>
);

// 4. Error Boundary for Quantum Operations
// src/components/QuantumErrorBoundary.js
import React from 'react';

class QuantumErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log quantum-specific errors
    console.error('Quantum Error:', error);
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Analytics/monitoring integration
    window.gtag?.('event', 'quantum_error', {
      error_message: error.message,
      component_stack: errorInfo.componentStack
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Quantum Simulation Error
          </h3>
          <p className="text-red-600 text-sm mb-4">
            Something went wrong with the quantum circuit simulation.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset Quantum State
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 5. Performance Monitoring
// src/utils/quantumAnalytics.js
export const trackQuantumPerformance = async (operation, circuit) => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Track successful operations
    window.gtag?.('event', 'quantum_operation_success', {
      operation_type: operation.name,
      execution_time: duration,
      circuit_gates: circuit?.gates?.length || 0,
      circuit_qubits: circuit?.qubits || 0
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Track failed operations
    window.gtag?.('event', 'quantum_operation_error', {
      operation_type: operation.name,
      error_message: error.message,
      execution_time: duration
    });
    
    throw error;
  }
};`,
      completed: false
    }
  ];

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    
    const progress = Math.round((newCompleted.size / steps.length) * 100);
    onProgressUpdate(progress);
  };

  const progress = Math.round((completedSteps.size / steps.length) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Globe className="h-5 w-5" />
            Advanced: QOSim SDK Integration
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Build production-ready quantum web applications with the QOSim SDK
          </CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm font-medium text-foreground">{completedSteps.size}/{steps.length} completed</span>
          </div>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {steps.map((step, index) => (
          <AccordionItem key={step.id} value={step.id}>
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(step.id);
                    }}
                    className="p-0 h-auto"
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  {step.content}
                  {step.codeExample && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                        <Code className="h-4 w-4" />
                        Code Example
                      </h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border border-border">
                        <code className="text-foreground">{step.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>

      {progress === 100 && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <Rocket className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">Advanced Level Complete! 🚀</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
              You're now ready to build production quantum applications with QOSim SDK!
            </p>
            <div className="flex gap-3 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explore Examples
              </Button>
              <Button variant="outline">
                View API Docs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
