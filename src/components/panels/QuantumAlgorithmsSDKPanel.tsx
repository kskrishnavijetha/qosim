
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Code2, 
  Play, 
  Eye,
  Download,
  BookOpen,
  Zap,
  GitBranch,
  Palette,
  Brain,
  Settings,
  FileText,
  Share2
} from 'lucide-react';
import { SDKCodeEditor } from '@/components/sdk/SDKCodeEditor';
import { AlgorithmVisualizer } from '@/components/algorithms/AlgorithmVisualizer';
import { CircuitSDKBridge } from '@/components/integration/CircuitSDKBridge';

const algorithmCategories = [
  {
    name: "Search Algorithms",
    icon: <Zap className="h-4 w-4" />,
    algorithms: [
      { name: "Grover's Search", description: "Quantum database search", complexity: "O(√N)" },
      { name: "Amplitude Amplification", description: "Generalized amplitude amplification", complexity: "O(√N)" }
    ]
  },
  {
    name: "Factoring & Cryptography",
    icon: <Brain className="h-4 w-4" />,
    algorithms: [
      { name: "Shor's Algorithm", description: "Integer factorization", complexity: "O(log³N)" },
      { name: "Discrete Logarithm", description: "Quantum discrete log", complexity: "O(log³N)" }
    ]
  },
  {
    name: "Optimization",
    icon: <Settings className="h-4 w-4" />,
    algorithms: [
      { name: "QAOA", description: "Quantum Approximate Optimization", complexity: "O(poly(n))" },
      { name: "VQE", description: "Variational Quantum Eigensolver", complexity: "O(poly(n))" }
    ]
  },
  {
    name: "Simulation",
    icon: <Palette className="h-4 w-4" />,
    algorithms: [
      { name: "Bell States", description: "Quantum entanglement preparation", complexity: "O(1)" },
      { name: "QFT", description: "Quantum Fourier Transform", complexity: "O(log²N)" },
      { name: "Error Correction", description: "Quantum error correction codes", complexity: "O(n)" }
    ]
  }
];

export function QuantumAlgorithmsSDKPanel() {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-none border-b p-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Quantum Algorithms SDK</h2>
          <Badge variant="secondary">v1.0.0</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive quantum algorithms with Python & JavaScript support
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-7 m-4">
          <TabsTrigger value="library" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            Library
          </TabsTrigger>
          <TabsTrigger value="editor" className="text-xs">
            <Code2 className="h-3 w-3 mr-1" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Visualizer
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            Export
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI
          </TabsTrigger>
          <TabsTrigger value="integration" className="text-xs">
            <GitBranch className="h-3 w-3 mr-1" />
            Integration
          </TabsTrigger>
          <TabsTrigger value="docs" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Docs
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="library" className="h-full m-0">
            <div className="h-full p-4">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  {algorithmCategories.map((category) => (
                    <Card key={category.name}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          {category.icon}
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          {category.algorithms.map((algorithm) => (
                            <div
                              key={algorithm.name}
                              className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => setSelectedAlgorithm(algorithm.name)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-sm">{algorithm.name}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {algorithm.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {algorithm.complexity}
                                  </Badge>
                                  <Button size="sm" variant="ghost">
                                    <Play className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="h-full m-0">
            <SDKCodeEditor />
          </TabsContent>

          <TabsContent value="visualizer" className="h-full m-0">
            <div className="h-full p-4">
              <ScrollArea className="h-full">
                <AlgorithmVisualizer />
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="export" className="h-full m-0">
            <div className="h-full p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Export Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Python Script
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          JavaScript
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          QASM
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Qiskit
                        </Button>
                      </div>
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Share via QFS</h4>
                        <Button variant="outline" className="w-full justify-start">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Circuit & Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="h-full m-0">
            <div className="h-full p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Assistant
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Describe what you want to build and I'll generate the quantum algorithm for you.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Button variant="outline" className="justify-start">
                            "Create a quantum search algorithm"
                          </Button>
                          <Button variant="outline" className="justify-start">
                            "Optimize my circuit for fewer gates"
                          </Button>
                          <Button variant="outline" className="justify-start">
                            "Explain Bell state preparation"
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="h-full m-0">
            <CircuitSDKBridge />
          </TabsContent>

          <TabsContent value="docs" className="h-full m-0">
            <div className="h-full p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>SDK Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          <Button variant="outline" className="justify-start">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Getting Started Guide
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Code2 className="h-4 w-4 mr-2" />
                            API Reference
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <FileText className="h-4 w-4 mr-2" />
                            Example Scripts
                          </Button>
                          <Button variant="outline" className="justify-start">
                            <Brain className="h-4 w-4 mr-2" />
                            Algorithm Tutorials
                          </Button>
                        </div>
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Quick Examples</h4>
                          <div className="bg-muted rounded-lg p-3">
                            <pre className="text-xs">
                              <code>{`// Create Bell State
const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(2);
circuit.h(0);
circuit.cnot(0, 1);
const result = await circuit.simulate();`}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
