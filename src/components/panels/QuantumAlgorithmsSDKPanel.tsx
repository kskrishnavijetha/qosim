
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Eye, 
  BookOpen, 
  Zap, 
  ArrowRightLeft,
  Download,
  Share,
  GitBranch
} from 'lucide-react';
import { SDKCodeEditor } from '../sdk/SDKCodeEditor';
import { AlgorithmVisualizer } from '../algorithms/AlgorithmVisualizer';
import { CircuitSDKBridge } from '../integration/CircuitSDKBridge';
import QOSimSDK, { QuantumCircuit } from '@/sdk/qosim-sdk';
import { BellStateGenerator } from '@/sdk/algorithms/bellState';
import { GroverAlgorithm } from '@/sdk/algorithms/grovers';
import { QuantumFourierTransform } from '@/sdk/algorithms/qft';
import { ErrorCorrectionCodes } from '@/sdk/algorithms/errorCorrection';
import { useCircuitState } from '@/hooks/useCircuitState';
import { toast } from 'sonner';

export function QuantumAlgorithmsSDKPanel() {
  const [activeTab, setActiveTab] = useState('algorithms');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python'>('javascript');
  const [currentCircuit, setCurrentCircuit] = useState<QuantumCircuit | null>(null);
  const [visualizationStep, setVisualizationStep] = useState(0);
  const [sdk] = useState(() => new QOSimSDK({ debug: true }));
  
  const { circuit: visualCircuit, addGate, clearCircuit } = useCircuitState();

  // Pre-built algorithm examples
  const algorithms = {
    'bell-states': {
      name: 'Bell States',
      description: 'Create maximally entangled two-qubit states',
      category: 'Entanglement',
      difficulty: 'Beginner',
      execute: async () => {
        const generator = new BellStateGenerator(sdk);
        return await generator.quickBellState();
      }
    },
    'grovers': {
      name: "Grover's Search",
      description: 'Quantum search algorithm for unsorted databases',
      category: 'Search',
      difficulty: 'Intermediate',
      execute: async () => {
        const grover = new GroverAlgorithm(sdk);
        return await grover.quickGrover2Q();
      }
    },
    'qft': {
      name: 'Quantum Fourier Transform',
      description: 'Transform between time and frequency domains',
      category: 'Transform',
      difficulty: 'Advanced',
      execute: async () => {
        const qft = new QuantumFourierTransform(sdk);
        return await qft.quickQFT3Q();
      }
    },
    'error-correction': {
      name: 'Quantum Error Correction',
      description: 'Protect quantum information from decoherence',
      category: 'Error Correction',
      difficulty: 'Advanced',
      execute: async () => {
        const errorCorrection = new ErrorCorrectionCodes(sdk);
        return await errorCorrection.quickBitFlipCorrection();
      }
    }
  };

  const handleRunAlgorithm = async (algorithmKey: string) => {
    try {
      toast.info(`Running ${algorithms[algorithmKey as keyof typeof algorithms].name}...`);
      
      const result = await algorithms[algorithmKey as keyof typeof algorithms].execute();
      setCurrentCircuit(result.circuit);
      
      toast.success(`${algorithms[algorithmKey as keyof typeof algorithms].name} executed successfully!`);
    } catch (error) {
      toast.error(`Failed to run ${algorithms[algorithmKey as keyof typeof algorithms].name}: ${error.message}`);
    }
  };

  const handleCircuitGenerated = (circuit: QuantumCircuit) => {
    setCurrentCircuit(circuit);
  };

  const handleVisualCircuitChange = (gates: any[]) => {
    clearCircuit();
    gates.forEach(gate => addGate(gate));
  };

  const exportToQFS = async () => {
    if (currentCircuit) {
      const exportData = {
        circuit: currentCircuit,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentCircuit.name.replace(/\s+/g, '_')}_qfs_export.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Circuit exported to QFS format!');
    }
  };

  return (
    <div className="flex flex-col h-full bg-quantum-void p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-quantum-glow quantum-float">
            Quantum Algorithms SDK
          </h1>
          <p className="text-quantum-neon font-mono mt-2">
            Advanced quantum algorithm development and visualization platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="neon-border text-quantum-glow">
            SDK v1.0.0
          </Badge>
          <Badge variant="outline" className="neon-border text-quantum-glow">
            {selectedLanguage === 'javascript' ? 'JavaScript' : 'Python'}
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="quantum-panel neon-border">
          <TabsTrigger value="algorithms" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Pre-built Algorithms
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Algorithm Visualizer
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Circuit Integration
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Documentation
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-6">
          <TabsContent value="algorithms" className="h-full">
            <div className="space-y-6">
              {/* Language Selector */}
              <Card className="quantum-panel neon-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-quantum-glow">Algorithm Library</h3>
                      <p className="text-quantum-particle text-sm">
                        Pre-built implementations of key quantum algorithms
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-quantum-neon">Language:</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as 'javascript' | 'python')}
                        className="px-3 py-2 bg-quantum-void border border-quantum-matrix rounded text-quantum-glow"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(algorithms).map(([key, algorithm]) => (
                  <Card key={key} className="quantum-panel neon-border hover:bg-quantum-matrix transition-colors">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-quantum-glow">{algorithm.name}</span>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{algorithm.category}</Badge>
                          <Badge 
                            variant={algorithm.difficulty === 'Beginner' ? 'default' : 
                                   algorithm.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}
                          >
                            {algorithm.difficulty}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-quantum-particle text-sm mb-4">
                        {algorithm.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRunAlgorithm(key)}
                          className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Run Algorithm
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('editor')}
                          className="neon-border"
                        >
                          <Code className="w-4 h-4 mr-2" />
                          View Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="h-full">
            <SDKCodeEditor
              language={selectedLanguage}
              onCircuitGenerated={handleCircuitGenerated}
            />
          </TabsContent>

          <TabsContent value="visualizer" className="h-full">
            {currentCircuit ? (
              <AlgorithmVisualizer
                algorithm={currentCircuit.name}
                circuit={currentCircuit}
                onStepChange={setVisualizationStep}
              />
            ) : (
              <Card className="quantum-panel neon-border">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 mx-auto mb-4 text-quantum-particle opacity-50" />
                    <h3 className="text-lg font-semibold text-quantum-glow mb-2">
                      No Circuit Selected
                    </h3>
                    <p className="text-quantum-particle mb-4">
                      Run an algorithm or create a circuit in the editor to visualize its execution
                    </p>
                    <Button 
                      onClick={() => setActiveTab('algorithms')}
                      className="neon-border"
                    >
                      Browse Algorithms
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="integration" className="h-full">
            <CircuitSDKBridge
              visualCircuit={visualCircuit}
              onVisualCircuitChange={handleVisualCircuitChange}
              onSDKCircuitGenerated={handleCircuitGenerated}
            />
          </TabsContent>

          <TabsContent value="documentation" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-quantum-particle mb-2">1. Choose Your Language</h4>
                      <p className="text-quantum-neon">
                        Select between JavaScript and Python implementations of quantum algorithms.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-quantum-particle mb-2">2. Run Pre-built Algorithms</h4>
                      <p className="text-quantum-neon">
                        Execute Bell states, Grover's search, QFT, and error correction algorithms with one click.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-quantum-particle mb-2">3. Visualize Execution</h4>
                      <p className="text-quantum-neon">
                        Watch algorithms run step-by-step with Bloch spheres and entanglement visualization.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-quantum-particle mb-2">4. Export & Share</h4>
                      <p className="text-quantum-neon">
                        Export to OpenQASM, share via QFS, or integrate with the visual Circuit Builder.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">API Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm font-mono">
                    <div className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                      <div className="text-quantum-glow mb-1">QOSimSDK.createCircuit(name, qubits)</div>
                      <div className="text-quantum-particle">Create a new quantum circuit</div>
                    </div>
                    <div className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                      <div className="text-quantum-glow mb-1">sdk.h(circuit, qubit)</div>
                      <div className="text-quantum-particle">Apply Hadamard gate</div>
                    </div>
                    <div className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                      <div className="text-quantum-glow mb-1">sdk.cnot(circuit, control, target)</div>
                      <div className="text-quantum-particle">Apply CNOT gate</div>
                    </div>
                    <div className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                      <div className="text-quantum-glow mb-1">sdk.simulate(circuit, shots)</div>
                      <div className="text-quantum-particle">Execute circuit simulation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Actions */}
      {currentCircuit && (
        <Card className="quantum-panel neon-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="neon-border">
                  {currentCircuit.name}
                </Badge>
                <Badge variant="secondary">
                  {currentCircuit.qubits} qubits
                </Badge>
                <Badge variant="secondary">
                  {currentCircuit.gates.length} gates
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToQFS} className="neon-border">
                  <Download className="w-4 h-4 mr-2" />
                  Export to QFS
                </Button>
                <Button variant="outline" className="neon-border">
                  <Share className="w-4 h-4 mr-2" />
                  Share Circuit
                </Button>
                <Button variant="outline" className="neon-border">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Version Control
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
