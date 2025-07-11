import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { CircuitGrid } from "@/components/circuits/CircuitGrid";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";

export function EmbedCircuit() {
  const { fileId } = useParams();
  const [searchParams] = useSearchParams();
  const permission = searchParams.get("permission") || "view";
  
  const [circuit] = useState({
    id: fileId,
    name: "Bell State Circuit",
    gates: [
      { id: "h1", type: "H", qubit: 0, position: 0 },
      { id: "cx1", type: "CNOT", control: 0, target: 1, position: 1 }
    ]
  });
  
  const isEditable = permission === "edit";

  return (
    <div className="h-screen bg-quantum-void quantum-grid overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 border-b border-quantum-glow/20 bg-quantum-matrix/20">
          <div className="text-sm font-mono text-quantum-glow">{circuit.name}</div>
          <div className="text-xs text-muted-foreground">
            {isEditable ? "Interactive" : "View Only"}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Circuit */}
          <div className="flex-1 p-4">
            <div className="h-full border border-quantum-glow/30 rounded-lg bg-quantum-void/50 overflow-auto">
              <CircuitGrid
                circuit={circuit.gates}
                dragState={{ isDragging: false, gateType: "", dragPosition: { x: 0, y: 0 }, hoverQubit: null, hoverPosition: null }}
                simulationResult={null}
                onDeleteGate={() => {}}
                circuitRef={{ current: null }}
                NUM_QUBITS={2}
                GRID_SIZE={40}
              />
            </div>
          </div>
          
          {/* State Visualization */}
          <div className="w-64 p-4 border-l border-quantum-glow/20">
            <div className="h-full border border-quantum-glow/30 rounded-lg bg-quantum-void/50 overflow-auto">
              <div className="p-3">
                <div className="text-xs font-mono text-quantum-glow mb-3">State</div>
                <QuantumStateVisualization
                  simulationResult={null}
                  NUM_QUBITS={2}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-2 border-t border-quantum-glow/20 bg-quantum-matrix/20">
          <div className="text-xs text-center text-muted-foreground">
            Quantum Circuit Editor
          </div>
        </div>
      </div>
    </div>
  );
}