
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { SDKCodeEditor } from './SDKCodeEditor';
import { SimulationConsole } from './SimulationConsole';
import { SDKDocumentation } from './SDKDocumentation';
import { AlgorithmTemplates } from './AlgorithmTemplates';
import { useCircuitState } from '@/hooks/useCircuitState';
import { Code, Play, FileText, BookOpen, Zap, Download } from 'lucide-react';

export function QuantumAlgorithmsSDK() {
  const [activeTab, setActiveTab] = useState("algorithms");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const { circuit, simulationResult, addGate, clearCircuit } = useCircuitState();

  const handleAlgorithmSelect = (algorithm: any) => {
    setSelectedAlgorithm(algorithm.id);
    // Load algorithm into circuit
    clearCircuit();
    algorithm.gates.forEach((gate: any) => {
      addGate({
        ...gate,
        id: `${algorithm.id}-${gate.id}-${Date.now()}`
      });
    });
  };

  const handleRunSimulation = async () => {
    setSimulationRunning(true);
    // Simulate running the algorithm
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCodeOutput(`Algorithm executed successfully!\nResult: ${JSON.stringify(simulationResult, null, 2)}`);
    setSimulationRunning(false);
  };

  const handleExportOpenQASM = () => {
    const qasm = generateOpenQASM(circuit);
    const blob = new Blob([qasm], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_circuit.qasm';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateOpenQASM = (circuit: any[]) => {
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
    qasm += 'qreg q[5];\ncreg c[5];\n\n';
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'Y':
          qasm += `y q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length >= 2) {
            qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          }
          break;
        case 'RX':
          qasm += `rx(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          qasm += `ry(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'RZ':
          qasm += `rz(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
      }
    });
    
    qasm += '\nmeasure q -> c;\n';
    return qasm;
  };

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-quantum-glow">
              Quantum Algorithms SDK
            </h1>
            <p className="text-sm text-quantum-particle">
              Pre-built algorithms, custom development, and real-time simulation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleRunSimulation} 
              disabled={simulationRunning}
              className="neon-border"
            >
              <Play className="w-4 h-4 mr-2" />
              {simulationRunning ? 'Running...' : 'Run Algorithm'}
            </Button>
            <Button 
              onClick={handleExportOpenQASM}
              variant="outline"
              className="neon-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export QASM
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">
                  Gates: {circuit.length}
                </Badge>
                <Badge variant="outline">
                  Qubits: 5
                </Badge>
                {selectedAlgorithm && (
                  <Badge className="bg-quantum-matrix text-quantum-glow">
                    Algorithm: {selectedAlgorithm}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs font-mono">Simulation Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 quantum-tabs">
            <TabsTrigger value="algorithms" className="quantum-tab">
              <Zap className="w-4 h-4 mr-2" />
              Algorithms
            </TabsTrigger>
            <TabsTrigger value="editor" className="quantum-tab">
              <Code className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="simulation" className="quantum-tab">
              <Play className="w-4 h-4 mr-2" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="templates" className="quantum-tab">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="docs" className="quantum-tab">
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="space-y-6">
            <AlgorithmLibrary 
              onAlgorithmSelect={handleAlgorithmSelect}
              selectedAlgorithm={selectedAlgorithm}
            />
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <SDKCodeEditor 
              onCodeChange={setCodeOutput}
              circuit={circuit}
            />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <SimulationConsole 
              circuit={circuit}
              simulationResult={simulationResult}
              isRunning={simulationRunning}
              output={codeOutput}
            />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <AlgorithmTemplates 
              onTemplateLoad={handleAlgorithmSelect}
            />
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <SDKDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
