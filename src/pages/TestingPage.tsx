
import React, { useState } from 'react';
import { AppFunctionsTester } from '@/components/testing/AppFunctionsTester';
import { HadamardGateValidator } from '@/components/testing/HadamardGateValidator';
import { CNOTGateValidator } from '@/components/testing/CNOTGateValidator';
import { QuantumAccuracyTester } from '@/components/testing/QuantumAccuracyTester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TestTube, Zap, Target, BeakerIcon, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState("system");

  return (
    <div className="min-h-screen bg-quantum-void text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/app">
            <Button variant="ghost" className="mb-4 text-quantum-neon hover:text-quantum-glow">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
          
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-2xl font-mono text-quantum-glow flex items-center gap-2">
                <TestTube className="w-6 h-6" />
                QOSim Testing Suite
              </CardTitle>
              <p className="text-muted-foreground">
                Comprehensive testing of system functionality and quantum gate implementations
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-quantum-dark">
                  <TabsTrigger value="accuracy" className="text-quantum-text data-[state=active]:bg-quantum-neon data-[state=active]:text-quantum-void">
                    <BeakerIcon className="w-4 h-4 mr-2" />
                    Accuracy Tests
                  </TabsTrigger>
                  <TabsTrigger value="system" className="text-quantum-text data-[state=active]:bg-quantum-neon data-[state=active]:text-quantum-void">
                    <TestTube className="w-4 h-4 mr-2" />
                    System Tests
                  </TabsTrigger>
                  <TabsTrigger value="hadamard" className="text-quantum-text data-[state=active]:bg-quantum-neon data-[state=active]:text-quantum-void">
                    <Zap className="w-4 h-4 mr-2" />
                    Hadamard Gate
                  </TabsTrigger>
                  <TabsTrigger value="cnot" className="text-quantum-text data-[state=active]:bg-quantum-neon data-[state=active]:text-quantum-void">
                    <Target className="w-4 h-4 mr-2" />
                    CNOT Gate
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="accuracy" className="mt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Quantum State Validation</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• State vector accuracy testing</li>
                        <li>• Bell state creation validation</li>
                        <li>• Multi-qubit entanglement verification</li>
                        <li>• Probability distribution validation</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Gate Implementation Tests</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Hadamard gate matrix validation</li>
                        <li>• CNOT gate truth table testing</li>
                        <li>• Rotation gate parameter accuracy</li>
                        <li>• Pauli gate transformations</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Performance Metrics</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Execution time benchmarks</li>
                        <li>• Memory usage optimization</li>
                        <li>• Fidelity measurements</li>
                        <li>• Scalability testing (up to 50 qubits)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Export Validation</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• OpenQASM 2.0 compatibility</li>
                        <li>• Qiskit format validation</li>
                        <li>• JSON circuit representation</li>
                        <li>• JavaScript SDK compliance</li>
                      </ul>
                    </div>
                  </div>
                  <QuantumAccuracyTester />
                </TabsContent>
                
                <TabsContent value="system" className="mt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Authentication Tests</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• User session validation</li>
                        <li>• Token persistence</li>
                        <li>• Auth state management</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Collaboration Tests</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Real-time connections</li>
                        <li>• Database accessibility</li>
                        <li>• Multi-user features</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">Backend Tests</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Quantum simulation APIs</li>
                        <li>• Local backend execution</li>
                        <li>• Result processing</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-quantum-neon">System Tests</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• File operations</li>
                        <li>• Mobile responsiveness</li>
                        <li>• Touch interactions</li>
                      </ul>
                    </div>
                  </div>
                  <AppFunctionsTester />
                </TabsContent>
                
                <TabsContent value="hadamard" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-quantum-neon">Hadamard Gate Testing</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Matrix [[1, 1], [1, -1]] / √2 validation</li>
                          <li>• |0⟩ → (|0⟩ + |1⟩)/√2 transformation</li>
                          <li>• |1⟩ → (|0⟩ - |1⟩)/√2 transformation</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-quantum-neon">Export Format Validation</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• OpenQASM: h q[n];</li>
                          <li>• Qiskit: qc.h(n)</li>
                          <li>• JSON: correct matrix representation</li>
                        </ul>
                      </div>
                    </div>
                    <HadamardGateValidator />
                  </div>
                </TabsContent>
                
                <TabsContent value="cnot" className="mt-6">
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-quantum-neon">CNOT Gate Testing</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Control/target qubit selection</li>
                          <li>• Truth table validation</li>
                          <li>• Entanglement creation testing</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-quantum-neon">Export Syntax Validation</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• OpenQASM: cx q[control],q[target];</li>
                          <li>• Qiskit: qc.cx(control, target)</li>
                          <li>• JavaScript: qc.cnot(control, target)</li>
                        </ul>
                      </div>
                    </div>
                    <CNOTGateValidator />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
