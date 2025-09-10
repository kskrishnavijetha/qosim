import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedInteractiveBuilder } from '@/components/circuits/EnhancedInteractiveBuilder';
import { QuantumAccuracyTester } from '@/components/testing/QuantumAccuracyTester';
import { LiveQuantumVisualizer } from '@/components/visualization/LiveQuantumVisualizer';
import { 
  Atom, 
  Zap, 
  TestTube, 
  Eye, 
  Settings, 
  BookOpen, 
  Download,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EnhancedQOSimPage() {
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="min-h-screen bg-quantum-void text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/app">
              <Button variant="ghost" className="text-quantum-neon hover:text-quantum-glow">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main App
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-quantum-blue border-quantum-blue">
                Enhanced QOSim v2.0
              </Badge>
              <Badge variant="outline" className="text-quantum-green border-quantum-green">
                Up to 50 Qubits
              </Badge>
            </div>
          </div>
          
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-3xl font-mono text-quantum-glow flex items-center gap-3">
                <Atom className="w-8 h-8" />
                Enhanced QOSim Platform
              </CardTitle>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="text-quantum-blue">
                  <Zap className="w-3 h-3 mr-1" />
                  Drag & Drop Builder
                </Badge>
                <Badge variant="outline" className="text-quantum-purple">
                  <Eye className="w-3 h-3 mr-1" />
                  Live Visualization
                </Badge>
                <Badge variant="outline" className="text-quantum-green">
                  <TestTube className="w-3 h-3 mr-1" />
                  Accuracy Testing
                </Badge>
                <Badge variant="outline" className="text-quantum-orange">
                  <Download className="w-3 h-3 mr-1" />
                  Multi-Format Export
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                Build, validate, and simulate quantum circuits with enhanced accuracy, 
                scalability up to 50 qubits, and comprehensive testing harness.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-quantum-dark/50 border border-quantum-blue/30">
            <TabsTrigger 
              value="builder" 
              className="text-quantum-text data-[state=active]:bg-quantum-blue data-[state=active]:text-quantum-void"
            >
              <Zap className="w-4 h-4 mr-2" />
              Circuit Builder
            </TabsTrigger>
            <TabsTrigger 
              value="testing" 
              className="text-quantum-text data-[state=active]:bg-quantum-purple data-[state=active]:text-quantum-void"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Accuracy Testing
            </TabsTrigger>
            <TabsTrigger 
              value="visualization" 
              className="text-quantum-text data-[state=active]:bg-quantum-green data-[state=active]:text-quantum-void"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualization
            </TabsTrigger>
            <TabsTrigger 
              value="documentation" 
              className="text-quantum-text data-[state=active]:bg-quantum-orange data-[state=active]:text-quantum-void"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="mt-6">
            <div className="h-[calc(100vh-200px)]">
              <EnhancedInteractiveBuilder
                initialQubits={5}
                showAdvancedFeatures={true}
                enableDragDrop={true}
                enableLiveVisualization={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-blue">
                    <TestTube className="w-5 h-5" />
                    Test Suite
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive accuracy validation against known quantum states and Qiskit compatibility.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Hadamard Gate Testing</Badge>
                    <Badge variant="outline">CNOT Gate Validation</Badge>
                    <Badge variant="outline">Bell State Creation</Badge>
                    <Badge variant="outline">Multi-Qubit Circuits</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-purple">
                    <Zap className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scalability testing and performance benchmarks for large quantum circuits.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">Up to 50 Qubits</Badge>
                    <Badge variant="outline">Sparse Optimization</Badge>
                    <Badge variant="outline">Memory Efficiency</Badge>
                    <Badge variant="outline">Execution Speed</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-green">
                    <Download className="w-5 h-5" />
                    Export Testing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Validate export formats and ensure compatibility with external quantum frameworks.
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline">OpenQASM 2.0</Badge>
                    <Badge variant="outline">Qiskit Python</Badge>
                    <Badge variant="outline">JSON Schema</Badge>
                    <Badge variant="outline">JavaScript SDK</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <QuantumAccuracyTester />
          </TabsContent>
          
          <TabsContent value="visualization" className="mt-6">
            <div className="grid gap-6">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-glow">
                    <Eye className="w-5 h-5" />
                    Live Quantum State Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Real-time visualization of quantum states, probability distributions, 
                    and entanglement patterns during circuit simulation.
                  </p>
                </CardContent>
              </Card>
              
              <LiveQuantumVisualizer
                simulationResult={null}
                isSimulating={false}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="documentation" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-orange">
                    <BookOpen className="w-5 h-5" />
                    Enhanced Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-quantum-blue mb-2">✨ New in v2.0</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Drag & drop circuit builder with visual feedback</li>
                      <li>• Real-time circuit validation and error detection</li>
                      <li>• Enhanced Hadamard gate with correct H = (1/√2)[[1,1],[1,-1]]</li>
                      <li>• CNOT gate with proper control/target selection</li>
                      <li>• Scalability up to 50 qubits with sparse optimization</li>
                      <li>• Live quantum state visualization</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-quantum-purple mb-2">🧪 Testing & Validation</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Automated test suite with pass/fail reporting</li>
                      <li>• State vector accuracy validation</li>
                      <li>• Bell state and entanglement verification</li>
                      <li>• Export format compatibility testing</li>
                      <li>• Performance benchmarking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-green">
                    <Settings className="w-5 h-5" />
                    Usage Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-quantum-blue mb-2">🏗️ Building Circuits</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Drag gates from palette to canvas</li>
                      <li>• Right-click gates for context menu options</li>
                      <li>• Use gate selectors for multi-qubit operations</li>
                      <li>• Real-time validation shows errors instantly</li>
                      <li>• Undo/redo support for circuit modifications</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-quantum-purple mb-2">📊 Export Options</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• OpenQASM 2.0: cx q[control],q[target];</li>
                      <li>• Qiskit Python: qc.cx(control, target)</li>
                      <li>• JSON: Complete circuit representation</li>
                      <li>• JavaScript: qc.cnot(control, target)</li>
                      <li>• All formats validated for compatibility</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}