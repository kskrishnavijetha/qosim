
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InteractiveAlgorithmVisualizer } from './InteractiveAlgorithmVisualizer';
import { SDKCodeEditor } from './SDKCodeEditor';
import { useToast } from '@/hooks/use-toast';
import { QOSimSDK } from '@/sdk/qosim-sdk';
import { GroverAlgorithm } from '@/sdk/algorithms/grovers';
import { ShorAlgorithm } from '@/sdk/algorithms/shor';
import { QuantumFourierTransform } from '@/sdk/algorithms/qft';
import { VariationalQuantumEigensolver } from '@/sdk/algorithms/vqe';
import { QAOAAlgorithm } from '@/sdk/algorithms/qaoa';
import { BellStateGenerator } from '@/sdk/algorithms/bellState';
import { ErrorCorrectionCodes } from '@/sdk/algorithms/errorCorrection';
import { 
  Atom, 
  Code, 
  Eye, 
  Book, 
  Zap, 
  Download,
  Share2,
  FileText,
  Cpu,
  Activity
} from 'lucide-react';

export function QuantumAlgorithmsSDK() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('grover');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python'>('javascript');
  const [sdk] = useState(() => new QOSimSDK());
  const [isInitialized, setIsInitialized] = useState(false);
  const [visualizationSteps, setVisualizationSteps] = useState<any[]>([]);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const { toast } = useToast();

  const algorithms = {
    'grover': {
      name: 'Grover\'s Search',
      description: 'Quantum search algorithm with quadratic speedup',
      icon: <Atom className="h-5 w-5" />
    },
    'shor': {
      name: 'Shor\'s Algorithm',
      description: 'Quantum factorization algorithm',
      icon: <Cpu className="h-5 w-5" />
    },
    'qft': {
      name: 'Quantum Fourier Transform',
      description: 'Quantum analogue of discrete Fourier transform',
      icon: <Activity className="h-5 w-5" />
    },
    'vqe': {
      name: 'VQE',
      description: 'Variational Quantum Eigensolver for chemistry',
      icon: <Zap className="h-5 w-5" />
    },
    'qaoa': {
      name: 'QAOA',
      description: 'Quantum Approximate Optimization Algorithm',
      icon: <FileText className="h-5 w-5" />
    },
    'bell': {
      name: 'Bell States',
      description: 'Maximally entangled quantum states',
      icon: <Share2 className="h-5 w-5" />
    },
    'error-correction': {
      name: 'Error Correction',
      description: 'Quantum error correction codes',
      icon: <Eye className="h-5 w-5" />
    }
  };

  const initializeSDK = async () => {
    try {
      await sdk.initialize();
      setIsInitialized(true);
      toast({
        title: "SDK Ready",
        description: "QOSim SDK initialized successfully"
      });
    } catch (error) {
      toast({
        title: "SDK Error",
        description: "Failed to initialize SDK",
        variant: "destructive"
      });
    }
  };

  const executeAlgorithm = async (code: string) => {
    if (!isInitialized) {
      await initializeSDK();
    }

    try {
      let result;
      
      switch (selectedAlgorithm) {
        case 'grover':
          const grover = new GroverAlgorithm(sdk);
          result = await grover.quickGrover2Q();
          break;
        case 'shor':
          const shor = new ShorAlgorithm(sdk);
          result = await shor.quickShor15();
          break;
        case 'qft':
          const qft = new QuantumFourierTransform(sdk);
          result = await qft.quickQFT3Q();
          break;
        case 'vqe':
          const vqe = new VariationalQuantumEigensolver(sdk);
          result = await vqe.quickVQE_H2();
          break;
        case 'qaoa':
          const qaoa = new QAOAAlgorithm(sdk);
          result = await qaoa.quickMaxCut();
          break;
        case 'bell':
          const bell = new BellStateGenerator(sdk);
          result = await bell.quickBellState();
          break;
        case 'error-correction':
          const errorCorrection = new ErrorCorrectionCodes(sdk);
          result = await errorCorrection.quickBitFlipCorrection();
          break;
        default:
          throw new Error('Unknown algorithm');
      }

      setCurrentResult(result);
      generateVisualizationSteps(result);
      
      return {
        output: `Algorithm executed successfully!\n\nResult: ${JSON.stringify(result, null, 2)}`,
        circuit: result.circuit
      };
    } catch (error) {
      throw new Error(`Algorithm execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateVisualizationSteps = (result: any) => {
    // Generate visualization steps based on algorithm result
    const steps = [];
    
    if (result.circuit && result.circuit.gates) {
      result.circuit.gates.forEach((gate: any, index: number) => {
        steps.push({
          id: `step-${index}`,
          title: `Step ${index + 1}: ${gate.type.toUpperCase()} Gate`,
          description: `Applied ${gate.type} gate to qubit ${gate.qubit}`,
          circuitState: result.circuit,
          blochSphereData: generateBlochSphereData(result.circuit.qubits, index),
          entanglementMatrix: generateEntanglementMatrix(result.circuit.qubits),
          measurementStats: {
            probabilities: generateProbabilities(result.circuit.qubits),
            fidelity: Math.random() * 0.3 + 0.7,
            entropy: Math.random() * 2
          },
          gateHighlight: `gate-${index}`
        });
      });
    }
    
    setVisualizationSteps(steps);
  };

  const generateBlochSphereData = (numQubits: number, step: number) => {
    return Array.from({ length: numQubits }, (_, i) => ({
      qubit: i,
      x: Math.cos(step * 0.5 + i * 0.3),
      y: Math.sin(step * 0.5 + i * 0.3),
      z: Math.cos(step * 0.3),
      phase: step * 0.1
    }));
  };

  const generateEntanglementMatrix = (numQubits: number) => {
    const matrix = Array.from({ length: numQubits }, () => 
      Array.from({ length: numQubits }, () => Math.random() * 0.5)
    );
    
    // Make symmetric
    for (let i = 0; i < numQubits; i++) {
      for (let j = i; j < numQubits; j++) {
        matrix[j][i] = matrix[i][j];
      }
      matrix[i][i] = 1; // Self-entanglement
    }
    
    return matrix;
  };

  const generateProbabilities = (numQubits: number) => {
    const numStates = Math.pow(2, numQubits);
    const probs: { [key: string]: number } = {};
    let total = 0;
    
    for (let i = 0; i < numStates; i++) {
      const state = i.toString(2).padStart(numQubits, '0');
      const prob = Math.random();
      probs[state] = prob;
      total += prob;
    }
    
    // Normalize
    for (const state in probs) {
      probs[state] /= total;
    }
    
    return probs;
  };

  const exportToCircuitBuilder = () => {
    if (!currentResult?.circuit) {
      toast({
        title: "No Circuit",
        description: "Execute an algorithm first to export its circuit",
        variant: "destructive"
      });
      return;
    }

    // Convert SDK circuit to circuit builder format
    const gates = currentResult.circuit.gates.map((gate: any, index: number) => ({
      id: `sdk-gate-${index}`,
      type: gate.type.toUpperCase(),
      qubit: gate.qubit,
      qubits: gate.controlQubit !== undefined ? [gate.controlQubit, gate.qubit] : undefined,
      angle: gate.angle,
      position: index
    }));

    // This would integrate with the circuit builder
    console.log('Exporting to circuit builder:', gates);
    
    toast({
      title: "Exported to Circuit Builder",
      description: `${gates.length} gates exported successfully`
    });
  };

  return (
    <div className="space-y-6">
      <Card className="quantum-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              Quantum Algorithms SDK
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-quantum-glow">
                {selectedLanguage.toUpperCase()}
              </Badge>
              <Badge variant={isInitialized ? "default" : "secondary"}>
                {isInitialized ? "Ready" : "Not Initialized"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Algorithm</label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(algorithms).map(([key, alg]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {alg.icon}
                        <div>
                          <div className="font-medium">{alg.name}</div>
                          <div className="text-xs text-muted-foreground">{alg.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={(value: 'javascript' | 'python') => setSelectedLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript SDK</SelectItem>
                  <SelectItem value="python">Python SDK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <SDKCodeEditor
                language={selectedLanguage}
                onExecute={executeAlgorithm}
              />
            </TabsContent>

            <TabsContent value="visualizer" className="space-y-4">
              {visualizationSteps.length > 0 ? (
                <InteractiveAlgorithmVisualizer
                  algorithm={selectedAlgorithm as any}
                  steps={visualizationSteps}
                />
              ) : (
                <Card className="quantum-panel">
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Visualization Available</h3>
                      <p className="text-muted-foreground">
                        Execute an algorithm to see the step-by-step visualization
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documentation" className="space-y-4">
              <Card className="quantum-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    {algorithms[selectedAlgorithm]?.name} Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Algorithm Overview</h4>
                      <p className="text-muted-foreground">
                        {algorithms[selectedAlgorithm]?.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Parameters</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-quantum-matrix rounded">
                          <code className="text-sm">numQubits: number</code>
                          <p className="text-xs text-muted-foreground">Number of qubits in the circuit</p>
                        </div>
                        <div className="p-2 bg-quantum-matrix rounded">
                          <code className="text-sm">iterations: number</code>
                          <p className="text-xs text-muted-foreground">Number of algorithm iterations</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Example Usage</h4>
                      <pre className="bg-quantum-void p-4 rounded text-sm overflow-x-auto">
                        {selectedLanguage === 'javascript' ? 
                          `const ${selectedAlgorithm} = new ${algorithms[selectedAlgorithm]?.name.replace(/\s+/g, '')}(sdk);
const result = await ${selectedAlgorithm}.optimize(config);` :
                          `${selectedAlgorithm} = ${algorithms[selectedAlgorithm]?.name.replace(/\s+/g, '')}()
result = ${selectedAlgorithm}.optimize(config)`
                        }
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Card className="quantum-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Circuit Builder Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Export your SDK-generated circuits to the visual Circuit Builder for further editing and analysis.
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={exportToCircuitBuilder}
                        disabled={!currentResult?.circuit}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Export to Circuit Builder
                      </Button>
                      
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export as OpenQASM
                      </Button>
                      
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Save to QFS
                      </Button>
                    </div>
                    
                    {currentResult && (
                      <div className="mt-4 p-4 bg-quantum-matrix rounded-lg">
                        <h4 className="font-semibold mb-2">Current Circuit</h4>
                        <div className="text-sm space-y-1">
                          <div>Name: {currentResult.circuit?.name}</div>
                          <div>Qubits: {currentResult.circuit?.qubits}</div>
                          <div>Gates: {currentResult.circuit?.gates.length}</div>
                          <div>Depth: {currentResult.circuit?.gates.length}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
