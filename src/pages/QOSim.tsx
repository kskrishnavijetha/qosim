
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircuitBuilder } from '@/components/qosim/CircuitBuilder';
import { AlgorithmsSDK } from '@/components/qosim/AlgorithmsSDK';
import { IntegrationLayer } from '@/components/qosim/IntegrationLayer';
import { CollaborationPanel } from '@/components/qosim/CollaborationPanel';
import { AIAssistant } from '@/components/qosim/AIAssistant';
import { useCircuitState } from '@/hooks/qosim/useCircuitState';
import { useQuantumSimulation } from '@/hooks/qosim/useQuantumSimulation';
import { Cpu, Atom, Code2, Users, Bot, Settings } from 'lucide-react';
import { toast } from 'sonner';

export function QOSim() {
  const [activeTab, setActiveTab] = useState('circuit-builder');
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  const {
    circuit,
    addGate,
    removeGate,
    updateGate,
    clearCircuit,
    undoAction,
    redoAction,
    canUndo,
    canRedo,
    saveCircuit,
    loadCircuit,
    exportCircuit,
    importCircuit
  } = useCircuitState();

  const {
    simulationResult,
    isSimulating,
    runSimulation,
    stopSimulation,
    simulationHistory
  } = useQuantumSimulation(circuit);

  useEffect(() => {
    toast.success('QOSim Initialized', {
      description: 'Quantum OS Simulator ready for circuit design and algorithm development'
    });
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.info(`Switched to ${value.replace('-', ' ')} module`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Atom className="w-8 h-8 text-cyan-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  QOSim
                </h1>
              </div>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                Quantum OS Simulator v2.0
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant={isAIOpen ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="text-purple-400 border-purple-400/30"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant={isCollaborationOpen ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsCollaborationOpen(!isCollaborationOpen)}
                className="text-emerald-400 border-emerald-400/30"
              >
                <Users className="w-4 h-4 mr-2" />
                Collaborate
              </Button>
              <Button variant="outline" size="sm" className="text-slate-400 border-slate-400/30">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-cyan-400">Quantum Development Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-black/30">
                    <TabsTrigger 
                      value="circuit-builder" 
                      className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                    >
                      <Cpu className="w-4 h-4 mr-2" />
                      Circuit Builder
                    </TabsTrigger>
                    <TabsTrigger 
                      value="algorithms-sdk" 
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
                    >
                      <Code2 className="w-4 h-4 mr-2" />
                      Algorithms SDK
                    </TabsTrigger>
                    <TabsTrigger 
                      value="integration" 
                      className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
                    >
                      <Atom className="w-4 h-4 mr-2" />
                      Integration
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="circuit-builder" className="mt-0">
                      <CircuitBuilder
                        circuit={circuit}
                        simulationResult={simulationResult}
                        isSimulating={isSimulating}
                        onAddGate={addGate}
                        onRemoveGate={removeGate}
                        onUpdateGate={updateGate}
                        onClearCircuit={clearCircuit}
                        onUndo={undoAction}
                        onRedo={redoAction}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        onRunSimulation={runSimulation}
                        onStopSimulation={stopSimulation}
                        onSaveCircuit={saveCircuit}
                        onLoadCircuit={loadCircuit}
                        onExportCircuit={exportCircuit}
                        onImportCircuit={importCircuit}
                      />
                    </TabsContent>

                    <TabsContent value="algorithms-sdk" className="mt-0">
                      <AlgorithmsSDK
                        circuit={circuit}
                        simulationResult={simulationResult}
                        onCircuitImport={(importedCircuit) => {
                          clearCircuit();
                          importedCircuit.forEach(gate => addGate(gate));
                        }}
                        onRunSimulation={runSimulation}
                      />
                    </TabsContent>

                    <TabsContent value="integration" className="mt-0">
                      <IntegrationLayer
                        circuit={circuit}
                        simulationResult={simulationResult}
                        simulationHistory={simulationHistory}
                        onOptimizeCircuit={(optimizedCircuit) => {
                          clearCircuit();
                          optimizedCircuit.forEach(gate => addGate(gate));
                        }}
                        onSyncToSDK={() => setActiveTab('algorithms-sdk')}
                        onSyncToBuilder={() => setActiveTab('circuit-builder')}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* AI Assistant Panel */}
            {isAIOpen && (
              <Card className="bg-purple-500/10 border-purple-400/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400 flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AIAssistant
                    circuit={circuit}
                    simulationResult={simulationResult}
                    onOptimizationSuggestion={(suggestion) => {
                      toast.info('AI Suggestion', { description: suggestion });
                    }}
                    onCircuitGeneration={(generatedCircuit) => {
                      clearCircuit();
                      generatedCircuit.forEach(gate => addGate(gate));
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Collaboration Panel */}
            {isCollaborationOpen && (
              <Card className="bg-emerald-500/10 border-emerald-400/30 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-emerald-400 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CollaborationPanel
                    circuit={circuit}
                    onVersionControl={(action) => {
                      toast.success('Version Control', { description: `${action} completed` });
                    }}
                    onComment={(comment) => {
                      toast.info('New Comment', { description: comment });
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* System Status */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-400">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Circuit Gates:</span>
                  <span className="text-cyan-400">{circuit.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Simulation:</span>
                  <Badge variant={isSimulating ? 'default' : 'secondary'} className="text-xs">
                    {isSimulating ? 'Running' : 'Ready'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Qubits:</span>
                  <span className="text-purple-400">
                    {simulationResult ? simulationResult.qubits : 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
