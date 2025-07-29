
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from './sdk/CodeEditor';
import { AlgorithmLibrary } from './sdk/AlgorithmLibrary';
import { AlgorithmVisualizer } from './sdk/AlgorithmVisualizer';
import { DocumentationPanel } from './sdk/DocumentationPanel';
import { InteractivePlayground } from './sdk/InteractivePlayground';
import { type QuantumGate, type QuantumSimulationResult, type QuantumAlgorithm } from '@/types/qosim';
import { Code2, BookOpen, Play, Zap, FileText, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AlgorithmsSDKProps {
  circuit: QuantumGate[];
  simulationResult: QuantumSimulationResult | null;
  onCircuitImport: (circuit: QuantumGate[]) => void;
  onRunSimulation: () => Promise<void>;
}

export function AlgorithmsSDK({
  circuit,
  simulationResult,
  onCircuitImport,
  onRunSimulation
}: AlgorithmsSDKProps) {
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'javascript'>('python');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<QuantumAlgorithm | null>(null);
  const [code, setCode] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);
  const editorRef = useRef<any>(null);

  const handleAlgorithmSelect = (algorithm: QuantumAlgorithm) => {
    setSelectedAlgorithm(algorithm);
    setCode(algorithm.implementation[activeLanguage]);
    toast.success(`Loaded ${algorithm.name} algorithm`);
  };

  const handleCodeExecution = async () => {
    setIsExecuting(true);
    setExecutionOutput(['Executing code...']);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setExecutionOutput([
        'Code executed successfully!',
        'Quantum circuit created with 3 qubits',
        'Applied Hadamard gates to create superposition',
        'Applied CNOT gates for entanglement',
        'Measurement probabilities calculated',
        'Results: |000⟩: 50%, |111⟩: 50%'
      ]);
      
      toast.success('Code executed successfully');
    } catch (error) {
      setExecutionOutput([
        'Error executing code:',
        error instanceof Error ? error.message : 'Unknown error'
      ]);
      toast.error('Code execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCircuitToCode = () => {
    if (circuit.length === 0) {
      toast.error('No circuit to convert');
      return;
    }

    let generatedCode = '';
    if (activeLanguage === 'python') {
      generatedCode = `# Generated from Circuit Builder
from qosim import QuantumCircuit, Simulator

# Create quantum circuit
qc = QuantumCircuit(${Math.max(...circuit.map(g => Math.max(...g.qubits))) + 1})

# Add gates
${circuit.map(gate => {
  switch (gate.type) {
    case 'H': return `qc.h(${gate.qubits[0]})  # Hadamard gate`;
    case 'X': return `qc.x(${gate.qubits[0]})  # Pauli-X gate`;
    case 'CNOT': return `qc.cnot(${gate.qubits[0]}, ${gate.qubits[1]})  # CNOT gate`;
    default: return `# ${gate.type} gate on qubits ${gate.qubits.join(', ')}`;
  }
}).join('\n')}

# Run simulation
sim = Simulator()
result = sim.run(qc)
print(result.get_counts())`;
    } else {
      generatedCode = `// Generated from Circuit Builder
import { QuantumCircuit, Simulator } from 'qosim-js';

// Create quantum circuit
const qc = new QuantumCircuit(${Math.max(...circuit.map(g => Math.max(...g.qubits))) + 1});

// Add gates
${circuit.map(gate => {
  switch (gate.type) {
    case 'H': return `qc.h(${gate.qubits[0]});  // Hadamard gate`;
    case 'X': return `qc.x(${gate.qubits[0]});  // Pauli-X gate`;
    case 'CNOT': return `qc.cnot(${gate.qubits[0]}, ${gate.qubits[1]});  // CNOT gate`;
    default: return `// ${gate.type} gate on qubits ${gate.qubits.join(', ')}`;
  }
}).join('\n')}

// Run simulation
const sim = new Simulator();
const result = sim.run(qc);
console.log(result.getCounts());`;
    }

    setCode(generatedCode);
    toast.success('Circuit converted to code');
  };

  const handleCodeToCircuit = () => {
    // Parse code and extract gate operations
    const lines = code.split('\n');
    const gates: QuantumGate[] = [];
    let gateId = 0;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Python patterns
      if (trimmed.includes('.h(')) {
        const qubit = parseInt(trimmed.match(/\.h\((\d+)\)/)?.[1] || '0');
        gates.push({
          id: `gate_${gateId++}`,
          type: 'H',
          qubits: [qubit],
          position: { x: gateId * 60, y: qubit * 60 },
          metadata: { timestamp: Date.now() }
        });
      } else if (trimmed.includes('.x(')) {
        const qubit = parseInt(trimmed.match(/\.x\((\d+)\)/)?.[1] || '0');
        gates.push({
          id: `gate_${gateId++}`,
          type: 'X',
          qubits: [qubit],
          position: { x: gateId * 60, y: qubit * 60 },
          metadata: { timestamp: Date.now() }
        });
      } else if (trimmed.includes('.cnot(')) {
        const match = trimmed.match(/\.cnot\((\d+),\s*(\d+)\)/);
        if (match) {
          gates.push({
            id: `gate_${gateId++}`,
            type: 'CNOT',
            qubits: [parseInt(match[1]), parseInt(match[2])],
            position: { x: gateId * 60, y: parseInt(match[1]) * 60 },
            metadata: { timestamp: Date.now() }
          });
        }
      }
    });

    if (gates.length > 0) {
      onCircuitImport(gates);
      toast.success(`Imported ${gates.length} gates from code`);
    } else {
      toast.error('No recognizable gate patterns found in code');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-purple-400">Quantum Algorithms SDK</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Language: {activeLanguage}
            </Badge>
            {selectedAlgorithm && (
              <Badge variant="outline" className="text-xs">
                {selectedAlgorithm.name}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCircuitToCode}
            className="text-cyan-400 border-cyan-400/30"
          >
            <Download className="w-4 h-4 mr-1" />
            Circuit → Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCodeToCircuit}
            className="text-emerald-400 border-emerald-400/30"
          >
            <Upload className="w-4 h-4 mr-1" />
            Code → Circuit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/30">
          <TabsTrigger value="editor" className="data-[state=active]:bg-purple-500/20">
            <Code2 className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="library" className="data-[state=active]:bg-blue-500/20">
            <BookOpen className="w-4 h-4 mr-2" />
            Library
          </TabsTrigger>
          <TabsTrigger value="playground" className="data-[state=active]:bg-emerald-500/20">
            <Play className="w-4 h-4 mr-2" />
            Playground
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="data-[state=active]:bg-cyan-500/20">
            <Zap className="w-4 h-4 mr-2" />
            Visualizer
          </TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:bg-yellow-500/20">
            <FileText className="w-4 h-4 mr-2" />
            Docs
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="editor" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-black/30 border-white/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-purple-400">Code Editor</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={activeLanguage === 'python' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveLanguage('python')}
                        >
                          Python
                        </Button>
                        <Button
                          variant={activeLanguage === 'javascript' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveLanguage('javascript')}
                        >
                          JavaScript
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CodeEditor
                      ref={editorRef}
                      language={activeLanguage}
                      value={code}
                      onChange={setCode}
                      onExecute={handleCodeExecution}
                      isExecuting={isExecuting}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-black/30 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-emerald-400">Output Console</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/50 rounded-lg p-3 min-h-[300px] font-mono text-sm">
                      {executionOutput.map((line, index) => (
                        <div key={index} className="text-emerald-400">
                          {line}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="mt-0">
            <AlgorithmLibrary
              onAlgorithmSelect={handleAlgorithmSelect}
              selectedLanguage={activeLanguage}
            />
          </TabsContent>

          <TabsContent value="playground" className="mt-0">
            <InteractivePlayground
              language={activeLanguage}
              onCodeGenerated={setCode}
            />
          </TabsContent>

          <TabsContent value="visualizer" className="mt-0">
            <AlgorithmVisualizer
              algorithm={selectedAlgorithm}
              simulationResult={simulationResult}
            />
          </TabsContent>

          <TabsContent value="docs" className="mt-0">
            <DocumentationPanel
              language={activeLanguage}
              selectedAlgorithm={selectedAlgorithm}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
