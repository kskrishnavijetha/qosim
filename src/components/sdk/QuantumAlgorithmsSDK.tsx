
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { SDKCodeEditor } from './SDKCodeEditor';
import { SimulationConsole } from './SimulationConsole';
import { CircuitExporter } from './CircuitExporter';
import { SDKDocumentation } from './SDKDocumentation';
import { AlgorithmTemplates } from './AlgorithmTemplates';
import { InteractiveCircuitEditor } from './InteractiveCircuitEditor';
import { PythonAPIPlayground } from './PythonAPIPlayground';
import { useCircuitWorkspace } from '@/hooks/useCircuitWorkspace';
import { Code2, BookOpen, Zap, FileText, Download, Play, Settings } from 'lucide-react';

export function QuantumAlgorithmsSDK() {
  const [activeTab, setActiveTab] = useState("algorithms");
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python'>('javascript');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  
  const { circuit, addGate, clearCircuit } = useCircuitWorkspace();

  const handleAlgorithmSelect = (algorithm: any) => {
    // Convert algorithm to circuit gates
    const gates = algorithm.gates.map((gate: any, index: number) => ({
      ...gate,
      id: `${algorithm.name}-${index}`,
      position: index
    }));
    
    clearCircuit();
    gates.forEach(addGate);
  };

  const handleSimulation = async (code: string) => {
    setIsSimulating(true);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock simulation results
    setSimulationResults({
      success: true,
      output: `Algorithm executed successfully!\nExecution time: ${Math.random() * 100 + 50}ms\nState vector computed\nProbabilities calculated`,
      stateVector: Array(8).fill(0).map(() => ({ 
        real: Math.random() * 2 - 1, 
        imag: Math.random() * 2 - 1 
      })),
      probabilities: Array(8).fill(0).map(() => Math.random()).map(x => x / 8),
      circuitDepth: circuit.length,
      gateCount: circuit.length
    });
    
    setIsSimulating(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-quantum-void to-quantum-matrix text-quantum-glow">
      <div className="p-6 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-quantum-glow flex items-center gap-2">
              <Zap className="h-8 w-8" />
              Quantum Algorithms SDK
            </h1>
            <p className="text-quantum-neon mt-2">
              Advanced quantum algorithm development with Python and JavaScript support
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="neon-border">
              QOSim v2.0
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage('javascript')}
                className="neon-border"
              >
                JavaScript
              </Button>
              <Button
                variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage('python')}
                className="neon-border"
              >
                Python
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-7 quantum-panel neon-border">
            <TabsTrigger value="algorithms" className="quantum-tab">
              <Code2 className="h-4 w-4 mr-2" />
              Algorithms
            </TabsTrigger>
            <TabsTrigger value="editor" className="quantum-tab">
              <FileText className="h-4 w-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="circuit" className="quantum-tab">
              <Settings className="h-4 w-4 mr-2" />
              Circuit Builder
            </TabsTrigger>
            <TabsTrigger value="simulation" className="quantum-tab">
              <Play className="h-4 w-4 mr-2" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="export" className="quantum-tab">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="templates" className="quantum-tab">
              <BookOpen className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="docs" className="quantum-tab">
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 h-full">
            <TabsContent value="algorithms" className="h-full">
              <AlgorithmLibrary 
                selectedLanguage={selectedLanguage}
                onAlgorithmSelect={handleAlgorithmSelect}
                onSimulate={handleSimulation}
                isSimulating={isSimulating}
              />
            </TabsContent>

            <TabsContent value="editor" className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <SDKCodeEditor
                  language={selectedLanguage}
                  onRunCode={handleSimulation}
                  isRunning={isSimulating}
                />
                <SimulationConsole
                  results={simulationResults}
                  isRunning={isSimulating}
                />
              </div>
            </TabsContent>

            <TabsContent value="circuit" className="h-full">
              <InteractiveCircuitEditor
                circuit={circuit}
                onCircuitChange={(gates) => {
                  clearCircuit();
                  gates.forEach(addGate);
                }}
              />
            </TabsContent>

            <TabsContent value="simulation" className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2">
                  <SimulationConsole
                    results={simulationResults}
                    isRunning={isSimulating}
                  />
                </div>
                <div>
                  {selectedLanguage === 'python' && (
                    <PythonAPIPlayground circuit={circuit} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="export" className="h-full">
              <CircuitExporter
                circuit={circuit}
                simulationResults={simulationResults}
              />
            </TabsContent>

            <TabsContent value="templates" className="h-full">
              <AlgorithmTemplates
                selectedLanguage={selectedLanguage}
                onTemplateSelect={handleAlgorithmSelect}
                currentCircuit={circuit}
              />
            </TabsContent>

            <TabsContent value="docs" className="h-full">
              <SDKDocumentation selectedLanguage={selectedLanguage} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
