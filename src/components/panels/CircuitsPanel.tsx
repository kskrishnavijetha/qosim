
import React, { useState, useEffect } from "react";
import { CircuitBuilder } from "@/components/circuits/CircuitBuilder";
import { DraggingGate } from "@/components/circuits/DraggingGate";
import { SimulationModeSelector } from "@/components/simulation/SimulationModeSelector";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { QuantumAlgorithmsPanel } from "@/components/algorithms/QuantumAlgorithmsPanel";
import { CollaborationStatus } from "@/components/collaboration/CollaborationStatus";
import { CustomGateManager } from "@/components/gates/CustomGateManager";
import { AlgorithmTemplatesLibrary } from "@/components/sdk/AlgorithmTemplatesLibrary";
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

export function CircuitsPanel() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);
  const [currentCircuitId, setCurrentCircuitId] = useState<string | null>(null);
  
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

  // Handle algorithm template loading with correct interface
  const handleAlgorithmTemplateLoad = (template: any) => {
    clearCircuit();
    template.gates.forEach((gate: any) => handleGateAdd(gate));
    setAlgorithmResult({
      circuit: { name: template.name, gates: template.gates },
      description: `${template.name} algorithm template loaded`,
      templateLoaded: true
    });
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

        {/* Collaboration Status */}
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

        {/* Algorithm Templates Library */}
        <AlgorithmTemplatesLibrary
          onTemplateSelect={handleAlgorithmTemplateLoad}
          currentCircuit={circuit}
        />

        {/* Custom Gate Manager */}
        <CustomGateManager
          onGateCreated={addCustomGate}
          existingGates={customGates}
        />

        {/* Quantum Algorithms Panel */}
        <QuantumAlgorithmsPanel
          onCircuitGenerated={handleAlgorithmCircuit}
          onAlgorithmExecuted={handleAlgorithmExecution}
        />

        {/* Circuit Builder */}
        <CircuitBuilder
          circuit={circuit}
          dragState={dragState}
          simulationResult={simulationResult}
          onDeleteGate={handleGateDelete}
          onGateMouseDown={handleMouseDown}
          onGateTouchStart={handleTouchStart}
          circuitRef={circuitRef}
          numQubits={NUM_QUBITS}
          gridSize={GRID_SIZE}
        />

        {/* Simulation Mode Selector */}
        <SimulationModeSelector
          currentMode={simulationMode}
          onModeChange={handleModeChange}
          cloudConfig={cloudConfig}
          onCloudConfigChange={handleCloudConfigChange}
          isCloudConfigured={isCloudConfigured}
        />

        <CircuitVisualizationSection
          simulationResult={simulationResult}
        />

        {/* Algorithm Results Display */}
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

        {/* Export Dialog */}
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          circuit={circuit}
          circuitRef={circuitRef}
          numQubits={NUM_QUBITS}
        />

        {/* Dragging Gate */}
        <DraggingGate dragState={dragState} />
      </div>
    </div>
  );
}
