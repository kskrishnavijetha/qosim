
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { CodeEditor } from './CodeEditor';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { ExportTools } from './ExportTools';
import { AICodeAssistant } from './AICodeAssistant';
import { CircuitBuilderIntegration } from './CircuitBuilderIntegration';
import { Code, Cpu, Eye, Download, Bot, ArrowLeftRight } from 'lucide-react';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pythonCode: string;
  javascriptCode: string;
  parameters: {
    name: string;
    type: string;
    default: any;
    description: string;
  }[];
  visualization: {
    type: 'bloch' | 'entanglement' | 'measurement' | 'statevector';
    config: any;
  };
}

export interface QuantumAlgorithmsSDKProps {
  onCircuitGenerated?: (gates: any[]) => void;
  onCodeExported?: (code: string, format: string) => void;
  currentCircuit?: any[];
}

export function QuantumAlgorithmsSDK({ 
  onCircuitGenerated,
  onCodeExported,
  currentCircuit = []
}: QuantumAlgorithmsSDKProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  
  const { toast } = useToast();

  const handleAlgorithmSelect = useCallback((algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setCode(selectedLanguage === 'python' ? algorithm.pythonCode : algorithm.javascriptCode);
    setActiveTab('editor');
  }, [selectedLanguage]);

  const handleLanguageChange = useCallback((language: 'python' | 'javascript') => {
    setSelectedLanguage(language);
    if (selectedAlgorithm) {
      setCode(language === 'python' ? selectedAlgorithm.pythonCode : selectedAlgorithm.javascriptCode);
    }
  }, [selectedAlgorithm]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleExecute = useCallback(async () => {
    if (!code.trim()) {
      toast({
        title: "No Code to Execute",
        description: "Please write or select an algorithm first.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      // Simulate algorithm execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        success: true,
        executionTime: Math.random() * 1000,
        stateVector: Array.from({ length: 8 }, () => ({
          real: Math.random() * 2 - 1,
          imag: Math.random() * 2 - 1
        })),
        measurementProbabilities: Array.from({ length: 8 }, () => Math.random()),
        gates: selectedAlgorithm ? generateGatesFromAlgorithm(selectedAlgorithm) : []
      };

      setSimulationResult(mockResult);
      
      if (onCircuitGenerated && mockResult.gates.length > 0) {
        onCircuitGenerated(mockResult.gates);
      }

      setActiveTab('visualizer');
      
      toast({
        title: "Algorithm Executed Successfully",
        description: `${selectedAlgorithm?.name || 'Custom algorithm'} completed in ${mockResult.executionTime.toFixed(2)}ms`,
      });
    } catch (error) {
      toast({
        title: "Execution Error",
        description: error.message || "Failed to execute algorithm",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  }, [code, selectedAlgorithm, onCircuitGenerated, toast]);

  const handleExport = useCallback(async (format: string) => {
    if (!code.trim()) {
      toast({
        title: "No Code to Export",
        description: "Please write or select an algorithm first.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (onCodeExported) {
        onCodeExported(code, format);
      }
      
      toast({
        title: "Export Successful",
        description: `Algorithm exported in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: error.message || "Failed to export algorithm",
        variant: "destructive",
      });
    }
  }, [code, onCodeExported, toast]);

  const handleCircuitImport = useCallback((circuit: any[]) => {
    if (!circuit || circuit.length === 0) {
      toast({
        title: "No Circuit to Import",
        description: "Please create a circuit in the Circuit Builder first.",
        variant: "destructive",
      });
      return;
    }

    const generatedCode = generateCodeFromCircuit(circuit, selectedLanguage);
    setCode(generatedCode);
    setActiveTab('editor');
    
    toast({
      title: "Circuit Imported Successfully",
      description: `Generated ${selectedLanguage} code from circuit with ${circuit.length} gates`,
    });
  }, [selectedLanguage, toast]);

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-quantum-glow">Quantum Algorithms SDK</h1>
            <p className="text-quantum-neon text-sm mt-1">
              Develop quantum algorithms with Python and JavaScript
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-quantum-particle">
              {selectedLanguage.toUpperCase()}
            </Badge>
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
            >
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="flex-none grid w-full grid-cols-6 bg-quantum-matrix border-b border-quantum-neon/20">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="visualizer" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visualizer
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              Integration
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="library" className="h-full m-0 p-0">
              <AlgorithmLibrary
                onSelectAlgorithm={handleAlgorithmSelect}
                onExecuteAlgorithm={handleExecute}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </TabsContent>

            <TabsContent value="editor" className="h-full m-0 p-0">
              <CodeEditor
                code={code}
                language={selectedLanguage}
                selectedAlgorithm={selectedAlgorithm}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                onExecute={handleExecute}
                isExecuting={isExecuting}
              />
            </TabsContent>

            <TabsContent value="visualizer" className="h-full m-0 p-0">
              <AlgorithmVisualizer
                algorithm={selectedAlgorithm}
                simulationResult={simulationResult}
                isExecuting={isExecuting}
              />
            </TabsContent>

            <TabsContent value="export" className="h-full m-0 p-0">
              <ExportTools
                code={code}
                algorithm={selectedAlgorithm}
                language={selectedLanguage}
                simulationResult={simulationResult}
                onExport={handleExport}
              />
            </TabsContent>

            <TabsContent value="ai" className="h-full m-0 p-0">
              <AICodeAssistant
                currentCode={code}
                selectedAlgorithm={selectedAlgorithm}
                language={selectedLanguage}
                onCodeSuggestion={handleCodeChange}
              />
            </TabsContent>

            <TabsContent value="integration" className="h-full m-0 p-0">
              <CircuitBuilderIntegration
                currentCircuit={currentCircuit}
                selectedAlgorithm={selectedAlgorithm}
                onExportToBuilder={onCircuitGenerated}
                onImportFromBuilder={handleCircuitImport}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function generateGatesFromAlgorithm(algorithm: Algorithm): any[] {
  const gates = [];
  let position = 0;

  switch (algorithm.id) {
    case 'bell-state':
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ },
        { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: position++ }
      );
      break;
    case 'grovers-search':
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ },
        { id: 'h2', type: 'H', qubit: 1, position: position++ },
        { id: 'cz1', type: 'CZ', qubits: [0, 1], position: position++ }
      );
      break;
    case 'qft':
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ },
        { id: 'cp1', type: 'CP', qubits: [0, 1], angle: Math.PI/2, position: position++ },
        { id: 'h2', type: 'H', qubit: 1, position: position++ }
      );
      break;
    default:
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ }
      );
  }

  return gates;
}

function generateCodeFromCircuit(circuit: any[], language: 'python' | 'javascript'): string {
  if (language === 'python') {
    let code = "# Generated from Circuit Builder\nfrom qosim_sdk import QuantumSimulator\n\n";
    code += "# Initialize quantum simulator\n";
    code += `sim = QuantumSimulator(${Math.max(...circuit.map(g => g.qubit || 0)) + 1})\n\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          code += `sim.h(${gate.qubit})\n`;
          break;
        case 'X':
          code += `sim.x(${gate.qubit})\n`;
          break;
        case 'Y':
          code += `sim.y(${gate.qubit})\n`;
          break;
        case 'Z':
          code += `sim.z(${gate.qubit})\n`;
          break;
        case 'CNOT':
          code += `sim.cnot(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
          break;
        case 'RZ':
          code += `sim.rz(${gate.qubit}, ${gate.angle || 0})\n`;
          break;
      }
    });
    
    code += "\n# Run simulation\nresult = sim.run()\nprint(result.state_vector)";
    return code;
  } else {
    let code = "// Generated from Circuit Builder\nimport { QOSimSimulator } from './qosim-core.js';\n\n";
    code += "// Initialize quantum simulator\n";
    code += `const sim = new QOSimSimulator(${Math.max(...circuit.map(g => g.qubit || 0)) + 1});\n\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          code += `sim.addGate("H", ${gate.qubit});\n`;
          break;
        case 'X':
          code += `sim.addGate("X", ${gate.qubit});\n`;
          break;
        case 'Y':
          code += `sim.addGate("Y", ${gate.qubit});\n`;
          break;
        case 'Z':
          code += `sim.addGate("Z", ${gate.qubit});\n`;
          break;
        case 'CNOT':
          code += `sim.addGate("CNOT", ${gate.qubits[0]}, ${gate.qubits[1]});\n`;
          break;
        case 'RZ':
          code += `sim.addGate("RZ", ${gate.qubit}, ${gate.angle || 0});\n`;
          break;
      }
    });
    
    code += "\n// Run simulation\nsim.run();\nconsole.log(sim.getStateVector());";
    return code;
  }
}
