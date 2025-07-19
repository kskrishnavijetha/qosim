
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { InteractiveCircuitEditor } from './InteractiveCircuitEditor';
import { AlgorithmTemplatesLibrary } from './AlgorithmTemplatesLibrary';
import { PythonAPIPlayground } from './PythonAPIPlayground';
import { SimulationRunner } from './SimulationRunner';
import { CircuitExporter } from './CircuitExporter';
import { Gate } from '@/hooks/useCircuitState';
import { Cpu, Code, BookOpen, Play, Download, Zap } from 'lucide-react';

interface QuantumAlgorithmsSDKProps {
  className?: string;
}

export function QuantumAlgorithmsSDK({ className }: QuantumAlgorithmsSDKProps) {
  const [currentCircuit, setCurrentCircuit] = useState<Gate[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  const handleCircuitChange = (gates: Gate[]) => {
    setCurrentCircuit(gates);
  };

  const handleAlgorithmLoad = (algorithm: string, gates: Gate[]) => {
    setSelectedAlgorithm(algorithm);
    setCurrentCircuit(gates);
  };

  const handleSimulationComplete = (result: any) => {
    setSimulationResult(result);
  };

  return (
    <div className={className}>
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-quantum-glow font-mono">
              <Zap className="h-6 w-6" />
              Quantum Algorithms SDK
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="default">v2.0</Badge>
              <Badge variant="secondary">Production Ready</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="editor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 quantum-tabs">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Circuit Editor
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="simulation" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Simulation
              </TabsTrigger>
              <TabsTrigger value="python" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Python API
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="docs" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Docs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <InteractiveCircuitEditor
                circuit={currentCircuit}
                onCircuitChange={handleCircuitChange}
                selectedAlgorithm={selectedAlgorithm}
              />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <AlgorithmTemplatesLibrary
                onAlgorithmLoad={handleAlgorithmLoad}
                currentCircuit={currentCircuit}
              />
            </TabsContent>

            <TabsContent value="simulation" className="space-y-4">
              <SimulationRunner
                circuit={currentCircuit}
                onSimulationComplete={handleSimulationComplete}
                simulationResult={simulationResult}
              />
            </TabsContent>

            <TabsContent value="python" className="space-y-4">
              <PythonAPIPlayground
                currentCircuit={currentCircuit}
                simulationResult={simulationResult}
              />
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <CircuitExporter
                circuit={currentCircuit}
                simulationResult={simulationResult}
              />
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <div className="prose prose-sm max-w-none text-quantum-particle">
                <h3 className="text-quantum-glow">Quantum Algorithms SDK Documentation</h3>
                <p>
                  The QOSim Quantum Algorithms SDK provides a comprehensive toolkit for quantum algorithm
                  development, simulation, and deployment.
                </p>
                
                <h4 className="text-quantum-neon">Key Features</h4>
                <ul>
                  <li>Interactive visual circuit editor with drag-and-drop interface</li>
                  <li>Pre-built algorithm templates (Grover's, Shor's, VQE, QAOA, etc.)</li>
                  <li>Classical simulation backend with state vector visualization</li>
                  <li>Python API for programmatic circuit construction</li>
                  <li>Export to OpenQASM, Qiskit, and Cirq formats</li>
                  <li>Real-time simulation and debugging tools</li>
                </ul>

                <h4 className="text-quantum-neon">Getting Started</h4>
                <ol>
                  <li>Choose a template from the Templates tab or build from scratch</li>
                  <li>Use the Circuit Editor to modify and optimize your circuit</li>
                  <li>Run simulations to test your algorithm</li>
                  <li>Export your circuit for use in other quantum frameworks</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
