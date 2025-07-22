import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Folder, Download, Upload, History, Undo, Redo, Settings, Zap } from 'lucide-react';
import { DragDropCircuitBuilder } from './DragDropCircuitBuilder';
import { RealtimeSimulationPanel } from './RealtimeSimulationPanel';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { CircuitExporter } from './CircuitExporter';
import { useCircuitWorkspace } from '@/hooks/useCircuitWorkspace';
import { cn } from '@/lib/utils';

export function QuantumOSWorkspace() {
  const {
    circuits,
    activeCircuitId,
    createNewCircuit,
    selectCircuit,
    deleteCircuit,
    saveCircuit,
    updateCircuitGates,
    undo,
    redo,
    canUndo,
    canRedo,
    exportCircuit
  } = useCircuitWorkspace();

  const [showExporter, setShowExporter] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeCircuit = circuits.find(c => c.id === activeCircuitId);

  const handleCircuitChange = (gates: any[]) => {
    if (activeCircuitId) {
      updateCircuitGates(activeCircuitId, gates);
    }
  };

  return (
    <div className="h-screen bg-quantum-void text-quantum-neon font-mono">
      {/* OS-like Header */}
      <div className="h-12 bg-quantum-matrix border-b border-quantum-neon/20 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-quantum-glow font-bold text-lg">QOSim</div>
          <Badge variant="outline" className="text-xs">Quantum OS Simulator v2.1</Badge>
        </div>
        
        <WorkspaceToolbar
          onSave={() => activeCircuit && saveCircuit(activeCircuit.id)}
          onUndo={undo}
          onRedo={redo}
          onExport={() => setShowExporter(true)}
          canUndo={canUndo}
          canRedo={canRedo}
          hasActiveCircuit={!!activeCircuit}
        />
      </div>

      <div className="flex h-[calc(100vh-48px)]">
        {/* Sidebar - Circuit Manager */}
        <div className={cn(
          "bg-quantum-matrix border-r border-quantum-neon/20 transition-all duration-300",
          sidebarCollapsed ? "w-12" : "w-80"
        )}>
          <div className="p-4 border-b border-quantum-neon/20">
            <div className="flex items-center justify-between mb-4">
              {!sidebarCollapsed && (
                <h3 className="text-quantum-glow font-semibold">Circuit Workspace</h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-quantum-neon hover:bg-quantum-void"
              >
                <Folder className="w-4 h-4" />
              </Button>
            </div>
            
            {!sidebarCollapsed && (
              <Button
                onClick={createNewCircuit}
                className="w-full bg-quantum-plasma hover:bg-quantum-plasma/80 text-quantum-void"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Circuit
              </Button>
            )}
          </div>

          {!sidebarCollapsed && (
            <div className="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              {circuits.map((circuit) => (
                <div
                  key={circuit.id}
                  className={cn(
                    "p-3 mb-2 rounded cursor-pointer transition-all hover:bg-quantum-void/50",
                    activeCircuitId === circuit.id 
                      ? "bg-quantum-void border border-quantum-glow" 
                      : "bg-quantum-matrix/50"
                  )}
                  onClick={() => selectCircuit(circuit.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-quantum-glow">
                        {circuit.name}
                      </div>
                      <div className="text-xs text-quantum-particle">
                        {circuit.gates.length} gates • {circuit.qubits} qubits
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {circuit.modified ? "●" : "○"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex">
          {/* Circuit Builder */}
          <div className="flex-1 flex flex-col">
            {activeCircuit ? (
              <Tabs defaultValue="builder" className="flex-1 flex flex-col">
                <TabsList className="bg-quantum-matrix border-b border-quantum-neon/20 rounded-none h-12 w-full justify-start">
                  <TabsTrigger value="builder" className="data-[state=active]:bg-quantum-void">
                    Circuit Builder
                  </TabsTrigger>
                  <TabsTrigger value="code" className="data-[state=active]:bg-quantum-void">
                    Code View
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-quantum-void">
                    Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="builder" className="flex-1 p-6">
                  <DragDropCircuitBuilder
                    circuit={activeCircuit}
                    onCircuitChange={handleCircuitChange}
                  />
                </TabsContent>

                <TabsContent value="code" className="flex-1 p-6">
                  <Card className="h-full quantum-panel">
                    <CardHeader>
                      <CardTitle className="text-quantum-glow">Generated Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-quantum-void rounded p-4 font-mono text-sm">
                          <div className="text-quantum-particle mb-2"># OpenQASM 2.0</div>
                          <div className="text-quantum-neon">
                            OPENQASM 2.0;<br/>
                            include "qelib1.inc";<br/>
                            qreg q[{activeCircuit.qubits}];<br/>
                            creg c[{activeCircuit.qubits}];<br/>
                            <br/>
                            {activeCircuit.gates.map((gate, i) => (
                              <div key={i} className="text-quantum-glow">
                                {gate.type.toLowerCase()} q[{gate.qubit || (gate.qubits ? gate.qubits[0] : 0)}];
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="flex-1 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    <Card className="quantum-panel">
                      <CardHeader>
                        <CardTitle className="text-quantum-glow">Circuit Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-quantum-void rounded p-3">
                              <div className="text-quantum-particle text-sm">Total Gates</div>
                              <div className="text-2xl font-bold text-quantum-glow">
                                {activeCircuit.gates.length}
                              </div>
                            </div>
                            <div className="bg-quantum-void rounded p-3">
                              <div className="text-quantum-particle text-sm">Circuit Depth</div>
                              <div className="text-2xl font-bold text-quantum-neon">
                                {Math.max(...activeCircuit.gates.map(g => g.position), 0) + 1}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="quantum-panel">
                      <CardHeader>
                        <CardTitle className="text-quantum-glow">Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Zap className="w-12 h-12 mx-auto mb-4 text-quantum-energy" />
                          <div className="text-quantum-particle">
                            Circuit analysis will appear here
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-quantum-matrix/50">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-quantum-void rounded-full flex items-center justify-center">
                    <Plus className="w-12 h-12 text-quantum-glow" />
                  </div>
                  <h3 className="text-xl font-semibold text-quantum-glow mb-2">
                    Welcome to QOSim
                  </h3>
                  <p className="text-quantum-particle mb-6">
                    Create your first quantum circuit to get started
                  </p>
                  <Button
                    onClick={createNewCircuit}
                    className="bg-quantum-plasma hover:bg-quantum-plasma/80 text-quantum-void"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Circuit
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Simulation Panel */}
          {activeCircuit && (
            <div className="w-96 border-l border-quantum-neon/20 bg-quantum-matrix">
              <RealtimeSimulationPanel circuit={activeCircuit} />
            </div>
          )}
        </div>
      </div>

      {/* Circuit Exporter Modal */}
      {showExporter && activeCircuit && (
        <CircuitExporter
          circuit={activeCircuit}
          onClose={() => setShowExporter(false)}
          onExport={exportCircuit}
        />
      )}
    </div>
  );
}
