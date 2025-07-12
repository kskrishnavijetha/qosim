import React, { useState, useEffect } from "react";
import { CircuitBuilder } from "@/components/circuits/CircuitBuilder";
import { DraggingGate } from "@/components/circuits/DraggingGate";
import { SimulationModeSelector } from "@/components/simulation/SimulationModeSelector";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { useCircuitState } from "@/hooks/useCircuitState";
import { useCircuitDragDrop } from "@/hooks/useCircuitDragDrop";
import { useLearningMode } from "@/hooks/useLearningMode";
import { useTemplateLoader } from "@/hooks/useTemplateLoader";
import { useDeferredQFSLoader } from "@/hooks/useDeferredQFSLoader";
import { CircuitPanelHeader } from "./CircuitPanelHeader";
import { LearningModeSection } from "./LearningModeSection";
import { CircuitVisualizationSection } from "./CircuitVisualizationSection";

export function CircuitsPanel() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  
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

  const NUM_QUBITS = 5;
  const GRID_SIZE = 50;

  const {
    dragState,
    circuitRef,
    handleMouseDown
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

  // Legacy simple exports (kept for quick access)
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
        />

        <LearningModeSection
          isLearningMode={isLearningMode}
          onToggle={() => {
            console.log('🎓 Toggling learning mode. Current state:', isLearningMode);
            console.log('🎓 Available templates:', templates);
            toggleLearningMode();
          }}
          progress={progress}
          currentStep={currentStep}
          onReset={resetTutorial}
          templates={templates}
          onSelectTemplate={selectTemplate}
          onLoadTemplate={handleTemplateLoad}
        />

        {/* Circuit Builder */}
        <CircuitBuilder
          circuit={circuit}
          dragState={dragState}
          simulationResult={simulationResult}
          onDeleteGate={deleteGate}
          onGateMouseDown={handleMouseDown}
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
          numQubits={NUM_QUBITS}
          circuit={circuit}
          onSuggestionClick={handleSuggestionClick}
        />

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