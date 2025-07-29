import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DraggingGate } from "@/components/circuits/DraggingGate";
import { SimulationModeSelector } from "@/components/simulation/SimulationModeSelector";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { CollaborationStatus } from "@/components/collaboration/CollaborationStatus";
import { CustomGateManager } from "@/components/gates/CustomGateManager";
import { InteractiveCircuitBuilder } from "@/components/circuits/InteractiveCircuitBuilder";
import { CircuitSDKIntegration } from "@/components/circuits/CircuitSDKIntegration";
import { VisualCodeSyncPanel } from "@/components/circuits/VisualCodeSyncPanel";
import { CollaborativeCircuitEditor } from "@/components/circuits/CollaborativeCircuitEditor";
import { useCircuitState } from "@/hooks/useCircuitState";
import { useCircuitDragDrop } from "@/hooks/useCircuitDragDrop";
import { useLearningMode } from "@/hooks/useLearningMode";
import { useTemplateLoader } from "@/hooks/useTemplateLoader";
import { useDeferredQFSLoader } from "@/hooks/useDeferredQFSLoader";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { useCustomGates } from "@/hooks/useCustomGates";
import { CircuitPanelHeader } from "./CircuitPanelHeader";
import { LearningModeSection } from "./LearningModeSection";
import { CircuitVisualizationSection } from "./CircuitVisualizationSection";
import { Cpu, Zap, Settings, Code2, Users, Bot } from "lucide-react";

export function CircuitsPanel() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);
  const [currentCircuitId, setCurrentCircuitId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'builder' | 'legacy' | 'sdk' | 'collab'>('builder');
  
  const {
    circuit,
    simulationResult,
    simulationMode,
    cloudConfig,
    addGate,
    deleteGate,
    undo,
    clearCircuit,
    generateCircuitData,
    handleModeChange,
    handleCloudConfigChange,
    handleStepModeToggle,
    handleSimulationStep,
    handleSimulationReset,
    handleSimulationPause,
    handleSimulationResume,
    isCloudConfigured,
    canUndo
  } = useCircuitState();

  const {
    isLearningMode,
    currentTemplate,
    currentStep,
    progress,
    templates,
    toggleLearningMode,
    selectTemplate,
    checkStepCompletion,
    completeTemplate,
    resetTutorial
  } = useLearningMode();

  const {
    customGates,
    addCustomGate,
    removeCustomGate,
    getCustomGate,
    isCustomGate
  } = useCustomGates();

  const NUM_QUBITS = 5;
  const GRID_SIZE = 50;

  const {
    dragState,
    circuitRef,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits: NUM_QUBITS,
    gridSize: GRID_SIZE
  });

  const { handleTemplateLoad } = useTemplateLoader({
    addGate,
    clearCircuit,
    completeTemplate
  });

  const { requestLoad, getFile, isLoading, loadedCount } = useDeferredQFSLoader({
    maxConcurrentLoads: 2,
    priorityThreshold: 30000
  });

  const { broadcastChange } = useRealtimeCollaboration(currentCircuitId);

  const handleGateAdd = (gate: any) => {
    addGate(gate);
    if (currentCircuitId) {
      broadcastChange('gate_added', {
        gateType: gate.type,
        qubit: gate.qubit,
        position: gate.position,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleGateDelete = (gateId: string) => {
    const gateToDelete = circuit.find(g => g.id === gateId);
    deleteGate(gateId);
    if (currentCircuitId && gateToDelete) {
      broadcastChange('gate_removed', {
        gateId,
        gateType: gateToDelete.type,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleAlgorithmExecution = (result: any) => {
    setAlgorithmResult(result);
  };

  const exportToJSON = () => {
    const data = generateCircuitData(circuit);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_circuit.json';
    a.click();
  };

  const exportToQASM = () => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${NUM_QUBITS}];\ncreg c[${NUM_QUBITS}];\n\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          break;
        case 'RX':
          qasm += `rx(${gate.angle}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          qasm += `ry(${gate.angle}) q[${gate.qubit}];\n`;
          break;
        case 'M':
          qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
      }
    });
    
    const blob = new Blob([qasm], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_circuit.qasm';
    a.click();
  };

  const handleSuggestionClick = (suggestion: any) => {
    console.log('Suggestion clicked:', suggestion);
  };

  const handleTabChange = (value: string) => {
    setActiveView(value as 'builder' | 'legacy' | 'sdk' | 'collab');
  };

  useEffect(() => {
    if (isLearningMode) {
      checkStepCompletion(circuit);
    }
  }, [circuit, isLearningMode, checkStepCompletion]);

  return (
    <div className="h-full overflow-auto quantum-grid">
      <Tabs value={activeView} onValueChange={handleTabChange} className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="sdk" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              SDK Integration
            </TabsTrigger>
            <TabsTrigger value="collab" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collaborate
            </TabsTrigger>
            <TabsTrigger value="legacy" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Legacy
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-quantum-matrix">
              QOSim v2.0
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="builder" className="flex-1 m-0">
          <InteractiveCircuitBuilder />
        </TabsContent>

        <TabsContent value="sdk" className="flex-1 m-0 p-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-4">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Circuit ↔ SDK Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CircuitSDKIntegration
                    onOptimizedCircuit={(circuit) => {
                      console.log('Optimized circuit received:', circuit);
                    }}
                    onSimulationResult={(result) => {
                      console.log('Simulation result received:', result);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <VisualCodeSyncPanel
                circuit={circuit}
                onCircuitUpdate={(updatedCircuit) => {
                  console.log('Circuit updated from code:', updatedCircuit);
                  // Here you would normally update the circuit state
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="collab" className="flex-1 m-0 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              <Card className="quantum-panel neon-border h-full">
                <CardHeader>
                  <CardTitle className="text-quantum-glow flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Collaborative Circuit Editor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-quantum-particle">
                    <p>Circuit collaboration features will appear here.</p>
                    <p className="text-sm mt-2">Create or join a collaborative session to get started.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <CollaborativeCircuitEditor
                circuitId={currentCircuitId || 'demo-circuit'}
                onCommentAdd={(comment) => {
                  console.log('Comment added:', comment);
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="legacy" className="flex-1 m-0">
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 h-full">
            <CircuitPanelHeader
              onUndo={undo}
              onClear={clearCircuit}
              onExportJSON={exportToJSON}
              onExportQASM={exportToQASM}
              onShowExportDialog={() => setShowExportDialog(true)}
              canUndo={canUndo}
              circuit={circuit}
            />

            <CollaborationStatus circuitId={currentCircuitId} />

            <LearningModeSection
              isLearningMode={isLearningMode}
              onToggle={toggleLearningMode}
              progress={progress}
              currentStep={currentStep}
              onReset={resetTutorial}
              templates={templates}
              onSelectTemplate={selectTemplate}
              onLoadTemplate={handleTemplateLoad}
            />

            <CustomGateManager
              onGateCreated={addCustomGate}
              existingGates={customGates}
            />

            <SimulationModeSelector
              currentMode={simulationMode}
              onModeChange={handleModeChange}
              cloudConfig={cloudConfig}
              onCloudConfigChange={handleCloudConfigChange}
              isCloudConfigured={isCloudConfigured}
            />

            <CircuitVisualizationSection
              simulationResult={simulationResult}
              numQubits={NUM_QUBITS}
              circuit={circuit}
              onSuggestionClick={handleSuggestionClick}
              onStepModeToggle={handleStepModeToggle}
              onSimulationStep={handleSimulationStep}
              onSimulationReset={handleSimulationReset}
              onSimulationPause={handleSimulationPause}
              onSimulationResume={handleSimulationResume}
            />

            {algorithmResult && (
              <Card className="bg-quantum-matrix border-quantum-neon/20">
                <CardHeader>
                  <CardTitle className="text-lg font-mono text-quantum-glow">
                    Algorithm Execution Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Circuit Name:</span>
                      <div className="text-quantum-neon">{algorithmResult.circuit?.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <div className="text-quantum-particle">{algorithmResult.description}</div>
                    </div>
                    {algorithmResult.successProbability && (
                      <div>
                        <span className="text-muted-foreground">Success Probability:</span>
                        <div className="text-quantum-energy">
                          {(algorithmResult.successProbability * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                    {algorithmResult.expectedEntanglement && (
                      <div>
                        <span className="text-muted-foreground">Expected Entanglement:</span>
                        <div className="text-quantum-energy">
                          {(algorithmResult.expectedEntanglement * 100).toFixed(2)}%
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <ExportDialog
              open={showExportDialog}
              onOpenChange={setShowExportDialog}
              circuit={circuit}
              circuitRef={circuitRef}
              numQubits={NUM_QUBITS}
            />

            <DraggingGate dragState={dragState} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
