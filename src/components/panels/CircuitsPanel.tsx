import React, { useState } from "react";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";
import { ExistingCircuitsList } from "@/components/circuits/ExistingCircuitsList";
import { GateSuggestionsPanel } from "@/components/circuits/GateSuggestionsPanel";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { CircuitBuilder } from "@/components/circuits/CircuitBuilder";
import { CircuitActions } from "@/components/circuits/CircuitActions";
import { DraggingGate } from "@/components/circuits/DraggingGate";
import { useCircuitState } from "@/hooks/useCircuitState";
import { useCircuitDragDrop } from "@/hooks/useCircuitDragDrop";

export function CircuitsPanel() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  const {
    circuit,
    simulationResult,
    addGate,
    deleteGate,
    undo,
    clearCircuit,
    generateCircuitData,
    canUndo
  } = useCircuitState();

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

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left">
            <h2 className="text-xl lg:text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h2>
            <p className="text-muted-foreground font-mono text-sm">Drag and drop gates to build quantum circuits</p>
          </div>
          <CircuitActions
            onUndo={undo}
            onClear={clearCircuit}
            onExportJSON={exportToJSON}
            onExportQASM={exportToQASM}
            onShowExportDialog={() => setShowExportDialog(true)}
            canUndo={canUndo}
          />
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Live Quantum State Visualization */}
          <div className="lg:col-span-2">
            <QuantumStateVisualization 
              simulationResult={simulationResult} 
              NUM_QUBITS={NUM_QUBITS} 
            />
          </div>

          {/* AI Suggestions Panel */}
          <div className="lg:col-span-1">
            <GateSuggestionsPanel 
              circuit={circuit}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Existing Circuits */}
        <ExistingCircuitsList />

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