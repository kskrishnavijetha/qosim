
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InteractiveCircuitBuilder } from "@/components/circuits/InteractiveCircuitBuilder";
import { useCircuitState } from "@/hooks/useCircuitState";
import { useRealtimeCollaboration } from "@/hooks/useRealtimeCollaboration";
import { Zap, Settings } from "lucide-react";

export function CircuitsPanel() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentCircuitId, setCurrentCircuitId] = useState<string | null>(null);
  
  const {
    circuit,
    addGate,
    deleteGate
  } = useCircuitState();

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

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-quantum-neon" />
          <h2 className="text-lg font-semibold text-quantum-glow">Circuit Builder</h2>
        </div>
        
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

      <div className="flex-1">
        <InteractiveCircuitBuilder />
      </div>
    </div>
  );
}
