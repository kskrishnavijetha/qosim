
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Cpu, Code, GitBranch, Zap, BookOpen, Users, Settings } from 'lucide-react';
import { QuantumCircuitBuilder } from './qosim/QuantumCircuitBuilder';
import { QuantumAlgorithmsSDK } from './qosim/QuantumAlgorithmsSDK';
import { IntegrationLayer } from './qosim/IntegrationLayer';

export function QOSim() {
  const [activeModule, setActiveModule] = useState('circuit-builder');
  const [systemStats, setSystemStats] = useState({
    qubits: '20/20',
    circuits: 42,
    algorithms: 15,
    collaborators: 3
  });

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon">
      {/* QOSim Header */}
      <div className="border-b border-quantum-neon/20 bg-quantum-matrix/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-8 w-8 text-quantum-glow" />
                <div>
                  <h1 className="text-2xl font-bold font-mono text-quantum-glow">
                    Quantum OS Simulator
                  </h1>
                  <p className="text-sm text-quantum-particle">v2.1.0 - Browser-based Quantum Development Environment</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-quantum-energy/20 text-quantum-energy border-quantum-energy/30">
                Online
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-quantum-particle">Qubits: {systemStats.qubits}</span>
                </div>
                <div className="text-quantum-particle">Circuits: {systemStats.circuits}</div>
                <div className="text-quantum-particle">Active: {systemStats.collaborators}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main QOSim Interface */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 quantum-tabs bg-quantum-matrix/30">
            <TabsTrigger value="circuit-builder" className="quantum-tab">
              <Cpu className="w-4 h-4 mr-2" />
              Circuit Builder
            </TabsTrigger>
            <TabsTrigger value="algorithms-sdk" className="quantum-tab">
              <Code className="w-4 h-4 mr-2" />
              Algorithms SDK
            </TabsTrigger>
            <TabsTrigger value="integration" className="quantum-tab">
              <GitBranch className="w-4 h-4 mr-2" />
              Integration Layer
            </TabsTrigger>
          </TabsList>

          {/* Module Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Circuit Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-quantum-particle">
                  Visual circuit design with drag-and-drop interface, real-time simulation, and multi-format export
                </p>
              </CardContent>
            </Card>

            <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Algorithms SDK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-quantum-particle">
                  Python & JavaScript APIs with pre-built algorithms, interactive playground, and AI-powered suggestions
                </p>
              </CardContent>
            </Card>

            <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-quantum-particle">
                  Seamless sync between modules with unified simulation engine and real-time collaboration
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Module Content */}
          <TabsContent value="circuit-builder" className="space-y-4">
            <QuantumCircuitBuilder />
          </TabsContent>

          <TabsContent value="algorithms-sdk" className="space-y-4">
            <QuantumAlgorithmsSDK />
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <IntegrationLayer />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer Status */}
      <div className="border-t border-quantum-neon/20 bg-quantum-matrix/20 mt-12">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-quantum-particle">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-quantum-energy" />
                <span>Simulation Engine: Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-quantum-glow" />
                <span>QFS: Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-quantum-neon" />
                <span>Education Mode: Available</span>
              </div>
            </div>
            <div className="text-quantum-particle">
              QOSim © 2024 - Quantum Tinkerers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
