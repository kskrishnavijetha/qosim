
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { CodeEditor } from './CodeEditor';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { ExportTools } from './ExportTools';
import { AICodeAssistant } from './AICodeAssistant';
import { CircuitBuilderIntegration } from './CircuitBuilderIntegration';
import { Code2, Zap, Eye, Share, Bot, Link } from 'lucide-react';
import { toast } from 'sonner';

export interface Algorithm {
  id: string;
  name: string;
  category: 'search' | 'cryptography' | 'optimization' | 'quantum-ml' | 'error-correction';
  description: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pythonCode: string;
  javascriptCode: string;
  qubits: number;
  depth: number;
  gates: string[];
  visualization?: {
    blochSpheres: boolean;
    entanglementMap: boolean;
    measurementStats: boolean;
  };
}

export interface SDKExecutionResult {
  algorithm: Algorithm;
  language: 'python' | 'javascript';
  executionTime: number;
  stateVector: { real: number; imag: number }[];
  measurementProbabilities: number[];
  entanglement: {
    pairs: number[][];
    strength: number;
  };
  circuitDepth: number;
  gateCount: { [key: string]: number };
  fidelity: number;
}

interface QuantumAlgorithmsSDKProps {
  onCircuitExport?: (circuit: any) => void;
  onCircuitImport?: (circuit: any) => void;
  currentCircuit?: any;
  collaborationEnabled?: boolean;
}

export function QuantumAlgorithmsSDK({ 
  onCircuitExport,
  onCircuitImport,
  currentCircuit,
  collaborationEnabled = false
}: QuantumAlgorithmsSDKProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript'>('python');
  const [executionResult, setExecutionResult] = useState<SDKExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [activeTab, setActiveTab] = useState('library');

  const handleAlgorithmSelect = useCallback((algorithm: any) => {
    // Convert the algorithm format from AlgorithmLibrary to our SDK format
    const sdkAlgorithm: Algorithm = {
      id: algorithm.id,
      name: algorithm.name,
      category: algorithm.category === 'basic' ? 'search' : algorithm.category,
      description: algorithm.description,
      complexity: algorithm.difficulty,
      pythonCode: algorithm.code.python,
      javascriptCode: algorithm.code.javascript,
      qubits: algorithm.qubits,
      depth: algorithm.gates,
      gates: ['H', 'CNOT'], // Default gates based on algorithm
      visualization: {
        blochSpheres: true,
        entanglementMap: true,
        measurementStats: true
      }
    };
    
    setSelectedAlgorithm(sdkAlgorithm);
    const code = selectedLanguage === 'python' ? sdkAlgorithm.pythonCode : sdkAlgorithm.javascriptCode;
    setCustomCode(code);
    setActiveTab('editor');
  }, [selectedLanguage]);

  const handleAlgorithmExecute = useCallback(async (algorithm: any) => {
    handleAlgorithmSelect(algorithm);
    
    // Auto-execute the algorithm
    setTimeout(() => {
      handleCodeExecution(selectedLanguage === 'python' ? algorithm.code.python : algorithm.code.javascript);
    }, 100);
  }, [selectedLanguage]);

  const handleLanguageChange = useCallback((language: 'python' | 'javascript') => {
    setSelectedLanguage(language);
    if (selectedAlgorithm) {
      const code = language === 'python' ? selectedAlgorithm.pythonCode : selectedAlgorithm.javascriptCode;
      setCustomCode(code);
    }
  }, [selectedAlgorithm]);

  const handleCodeExecution = useCallback(async (code: string) => {
    if (isExecuting || !selectedAlgorithm) return;

    setIsExecuting(true);
    try {
      // Simulate SDK execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult: SDKExecutionResult = {
        algorithm: selectedAlgorithm,
        language: selectedLanguage,
        executionTime: Math.random() * 1000 + 500,
        stateVector: Array.from({ length: Math.pow(2, selectedAlgorithm.qubits) }, () => ({
          real: Math.random() - 0.5,
          imag: Math.random() - 0.5
        })),
        measurementProbabilities: Array.from({ length: Math.pow(2, selectedAlgorithm.qubits) }, () => Math.random()),
        entanglement: {
          pairs: [[0, 1], [2, 3]],
          strength: Math.random()
        },
        circuitDepth: selectedAlgorithm.depth,
        gateCount: selectedAlgorithm.gates.reduce((acc, gate) => {
          acc[gate] = (acc[gate] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }),
        fidelity: 0.95 + Math.random() * 0.05
      };

      setExecutionResult(mockResult);
      setActiveTab('visualizer');
      
      toast.success(`${selectedAlgorithm.name} executed successfully in ${mockResult.executionTime.toFixed(1)}ms`);
      
    } catch (error) {
      toast.error('Algorithm execution failed');
      console.error('SDK execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, selectedAlgorithm, selectedLanguage]);

  const handleCircuitExport = useCallback(() => {
    if (selectedAlgorithm && onCircuitExport) {
      const circuitData = {
        name: selectedAlgorithm.name,
        algorithm: selectedAlgorithm,
        code: customCode,
        language: selectedLanguage,
        result: executionResult
      };
      onCircuitExport(circuitData);
      toast.success('Algorithm exported to Circuit Builder');
    }
  }, [selectedAlgorithm, customCode, selectedLanguage, executionResult, onCircuitExport]);

  const handleCircuitImport = useCallback(() => {
    if (currentCircuit && onCircuitImport) {
      onCircuitImport(currentCircuit);
      toast.success('Circuit imported from Circuit Builder');
    }
  }, [currentCircuit, onCircuitImport]);

  const handleOptimizeCircuit = useCallback(async (gates: any[]) => {
    // Mock optimization - reduce gates by ~20%
    const optimizedGates = gates.slice(0, Math.max(1, Math.floor(gates.length * 0.8)));
    await new Promise(resolve => setTimeout(resolve, 1000));
    return optimizedGates;
  }, []);

  return (
    <div className="h-full flex flex-col bg-quantum-void p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-quantum-glow">Quantum Algorithms SDK</h1>
          <p className="text-quantum-neon text-sm">Pre-built quantum algorithms with AI-powered development tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-quantum-particle">
            SDK v2.0
          </Badge>
          {collaborationEnabled && (
            <Badge variant="secondary" className="text-quantum-energy">
              Collaborative
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 bg-quantum-matrix">
          <TabsTrigger value="library" className="text-xs">
            <Code2 className="w-4 h-4 mr-1" />
            Library
          </TabsTrigger>
          <TabsTrigger value="editor" className="text-xs">
            <Zap className="w-4 h-4 mr-1" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="text-xs">
            <Eye className="w-4 h-4 mr-1" />
            Visualizer
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs">
            <Share className="w-4 h-4 mr-1" />
            Export
          </TabsTrigger>
          <TabsTrigger value="ai-assistant" className="text-xs">
            <Bot className="w-4 h-4 mr-1" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="integration" className="text-xs">
            <Link className="w-4 h-4 mr-1" />
            Integration
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-4">
          <TabsContent value="library" className="h-full m-0">
            <AlgorithmLibrary
              onSelectAlgorithm={handleAlgorithmSelect}
              onExecuteAlgorithm={handleAlgorithmExecute}
            />
          </TabsContent>

          <TabsContent value="editor" className="h-full m-0">
            <CodeEditor
              algorithm={selectedAlgorithm}
              language={selectedLanguage}
              code={customCode}
              onCodeChange={setCustomCode}
              onExecute={handleCodeExecution}
              isExecuting={isExecuting}
            />
          </TabsContent>

          <TabsContent value="visualizer" className="h-full m-0">
            <AlgorithmVisualizer
              result={executionResult}
              algorithm={selectedAlgorithm}
            />
          </TabsContent>

          <TabsContent value="export" className="h-full m-0">
            <ExportTools
              algorithm={selectedAlgorithm}
              code={customCode}
              language={selectedLanguage}
              result={executionResult}
            />
          </TabsContent>

          <TabsContent value="ai-assistant" className="h-full m-0">
            <AICodeAssistant
              onCodeGenerated={setCustomCode}
              currentAlgorithm={selectedAlgorithm}
              language={selectedLanguage}
            />
          </TabsContent>

          <TabsContent value="integration" className="h-full m-0">
            <CircuitBuilderIntegration
              onExportToBuilder={handleCircuitExport}
              onImportFromBuilder={handleCircuitImport}
              currentCircuit={currentCircuit || []}
              onOptimizeCircuit={handleOptimizeCircuit}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
