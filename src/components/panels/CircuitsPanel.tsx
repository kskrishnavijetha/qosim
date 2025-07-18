import React, { useState, useEffect } from "react";
import { CircuitBuilder } from "@/components/circuits/CircuitBuilder";
import { DraggingGate } from "@/components/circuits/DraggingGate";
import { SimulationModeSelector } from "@/components/simulation/SimulationModeSelector";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { QuantumAlgorithmsPanel } from "@/components/algorithms/QuantumAlgorithmsPanel";
import { CollaborationStatus } from "@/components/collaboration/CollaborationStatus";
import { CustomGateManager } from "@/components/gates/CustomGateManager";
import { MobileSimulationControls } from "@/components/mobile/MobileSimulationControls";
import { useCircuitState } from "@/hooks/useCircuitState";
import { useCircuitDragDrop } from "@/hooks/useCircuitDragDrop";
import { useLearningMode } from "@/hooks/useLearningMode";
import { useTemplateLoader } from "@/hooks/useTemplateLoader";
import { useDeferredQFSLoader } from "@/hooks/useDeferredQFSLoader";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { CircuitPanelHeader } from "./CircuitPanelHeader";
import { LearningModeSection } from "./LearningModeSection";
import { CircuitVisualizationSection } from "./CircuitVisualizationSection";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CircuitsPanel() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);
  const [currentCircuitId, setCurrentCircuitId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [sectionsOpen, setSectionsOpen] = useState({
    learning: false,
    customGates: false,
    algorithms: false,
    visualization: true
  });
  
  const {
    circuit,
    simulationResult,
    simulationMode,
    cloudConfig,
    customGates,
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
    canUndo,
    addCustomGate,
    deleteCustomGate
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

  const NUM_QUBITS = 5;
  const GRID_SIZE = isMobile ? 40 : 50;

  // Enhanced gate addition with collaboration broadcasting
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

  const {
    dragState,
    circuitRef,
    handleMouseDown
  } = useCircuitDragDrop({
    onGateAdd: handleGateAdd,
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

  // Enhanced gate deletion with collaboration broadcasting
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

  // Handle algorithm-generated circuits
  const handleAlgorithmCircuit = (gates: any[]) => {
    clearCircuit();
    gates.forEach(gate => handleGateAdd(gate));
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

  // Check tutorial progress when circuit changes
  useEffect(() => {
    if (isLearningMode) {
      checkStepCompletion(circuit);
    }
  }, [circuit, isLearningMode, checkStepCompletion]);

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (isMobile) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto quantum-grid">
          <div className="p-3 space-y-4">
            {/* Main Circuit Builder */}
            <CircuitBuilder
              circuit={circuit}
              dragState={dragState}
              simulationResult={simulationResult}
              onDeleteGate={handleGateDelete}
              onGateMouseDown={handleMouseDown}
              onGateAdd={handleGateAdd}
              circuitRef={circuitRef}
              numQubits={NUM_QUBITS}
              gridSize={GRID_SIZE}
              customGates={customGates}
            />

            {/* Collapsible Sections */}
            <Collapsible open={sectionsOpen.learning} onOpenChange={() => toggleSection('learning')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Learning Mode
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
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
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={sectionsOpen.customGates} onOpenChange={() => toggleSection('customGates')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Custom Gates
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CustomGateManager
                  onGateCreated={addCustomGate}
                  onGateDeleted={deleteCustomGate}
                  customGates={customGates}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={sectionsOpen.algorithms} onOpenChange={() => toggleSection('algorithms')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Quantum Algorithms
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <QuantumAlgorithmsPanel
                  onCircuitGenerated={handleAlgorithmCircuit}
                  onAlgorithmExecuted={handleAlgorithmExecution}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={sectionsOpen.visualization} onOpenChange={() => toggleSection('visualization')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  Visualization & Results
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
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
              </CollapsibleContent>
            </Collapsible>

            {algorithmResult && (
              <div className="mt-4 p-4 bg-quantum-matrix rounded-lg border border-quantum-neon/20">
                <h3 className="text-lg font-mono text-quantum-glow mb-3">Algorithm Result</h3>
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
                      <div className="text-quantum-energy">{(algorithmResult.successProbability * 100).toFixed(2)}%</div>
                    </div>
                  )}
                  {algorithmResult.expectedEntanglement && (
                    <div>
                      <span className="text-muted-foreground">Expected Entanglement:</span>
                      <div className="text-quantum-energy">{(algorithmResult.expectedEntanglement * 100).toFixed(2)}%</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <MobileSimulationControls
          onUndo={undo}
          onClear={clearCircuit}
          onExportJSON={exportToJSON}
          onExportQASM={exportToQASM}
          canUndo={canUndo}
          simulationMode={simulationMode}
          onModeChange={handleModeChange}
          cloudConfig={cloudConfig}
          onCloudConfigChange={handleCloudConfigChange}
          isCloudConfigured={isCloudConfigured}
        />

        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          circuit={circuit}
          circuitRef={circuitRef}
          numQubits={NUM_QUBITS}
        />

        <DraggingGate dragState={dragState} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
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
          onGateDeleted={deleteCustomGate}
          customGates={customGates}
        />

        <Separator />

        <QuantumAlgorithmsPanel
          onCircuitGenerated={handleAlgorithmCircuit}
          onAlgorithmExecuted={handleAlgorithmExecution}
        />

        <CircuitBuilder
          circuit={circuit}
          dragState={dragState}
          simulationResult={simulationResult}
          onDeleteGate={handleGateDelete}
          onGateMouseDown={handleMouseDown}
          onGateAdd={handleGateAdd}
          circuitRef={circuitRef}
          numQubits={NUM_QUBITS}
          gridSize={GRID_SIZE}
          customGates={customGates}
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

        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          circuit={circuit}
          circuitRef={circuitRef}
          numQubits={NUM_QUBITS}
        />

        <DraggingGate dragState={dragState} />

        {algorithmResult && (
          <div className="mt-4 p-4 bg-quantum-matrix rounded-lg border border-quantum-neon/20">
            <h3 className="text-lg font-mono text-quantum-glow mb-3">Algorithm Execution Result</h3>
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
                  <div className="text-quantum-energy">{(algorithmResult.successProbability * 100).toFixed(2)}%</div>
                </div>
              )}
              {algorithmResult.expectedEntanglement && (
                <div>
                  <span className="text-muted-foreground">Expected Entanglement:</span>
                  <div className="text-quantum-energy">{(algorithmResult.expectedEntanglement * 100).toFixed(2)}%</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
