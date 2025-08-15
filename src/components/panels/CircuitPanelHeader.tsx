import React, { useState } from "react";
import { Undo, Trash2, Download, FileText, Share2, GitFork, Users, Save, Play, Edit, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCircuits } from "@/hooks/useCircuits";
import { useCircuitSharing } from "@/hooks/useCircuitSharing";
import { CollaborationDialog } from "@/components/dialogs/CollaborationDialog";
import { ShareDialog } from "@/components/dialogs/ShareDialog";
import { ExportDialog } from "@/components/dialogs/ExportDialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CircuitActions } from "@/components/circuits/CircuitActions";
import { useExportHandlers } from "@/hooks/useExportHandlers";
import { useQuantumBackend } from "@/hooks/useQuantumBackend";

interface CircuitPanelHeaderProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onShowExportDialog: () => void;
  canUndo: boolean;
  circuit?: any[];
  simulationResult?: any;
}

export function CircuitPanelHeader({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onShowExportDialog,
  canUndo,
  circuit = [],
  simulationResult
}: CircuitPanelHeaderProps) {
  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showForkDialog, setShowForkDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [circuitName, setCircuitName] = useState("");
  const [forkName, setForkName] = useState("");
  const [savedCircuitId, setSavedCircuitId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { saveCircuit } = useCircuits();
  const { forkCircuit, createShareLink } = useCircuitSharing();
  const { toast } = useToast();
  const { executeCircuit, isExecuting } = useQuantumBackend();

  const { handleExportJSON, handleExportQASM, handleExportPython } = useExportHandlers(
    circuit, 
    5, // numQubits
    { projectName: 'quantum_circuit' }
  );

  const handlePlay = async () => {
    console.log('🎬 Play button clicked - Starting circuit simulation');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Empty Circuit",
        description: "Add some quantum gates to run the simulation",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    
    try {
      toast({
        title: "🚀 Running Simulation",
        description: `Executing circuit with ${circuit.length} gates...`,
      });

      // Convert circuit format for quantum backend
      const quantumGates = circuit.map(gate => ({
        id: gate.id,
        type: gate.type || 'H',
        qubit: gate.qubit !== undefined ? gate.qubit : 0,
        qubits: gate.qubits || [],
        position: gate.position !== undefined ? gate.position : 0,
        angle: gate.angle
      }));

      // Execute the circuit using the quantum backend
      const result = await executeCircuit(quantumGates, 'local', 1024);
      
      if (result && !result.error) {
        toast({
          title: "✅ Simulation Complete", 
          description: `Circuit executed successfully in ${result.executionTime?.toFixed(2)}ms`,
        });

        // Dispatch simulation results to update visualization components
        window.dispatchEvent(new CustomEvent('simulationComplete', { 
          detail: {
            stateVector: result.stateVector,
            measurementProbabilities: result.measurementProbabilities,
            qubitStates: result.qubitStates,
            blochSphereData: result.blochSphereData,
            executionTime: result.executionTime,
            backend: result.backend,
            entanglement: result.entanglement
          }
        }));

        console.log('✅ Simulation completed successfully:', result);
      } else {
        throw new Error(result?.error || 'Simulation failed');
      }

    } catch (error) {
      console.error('❌ Simulation error:', error);
      toast({
        title: "❌ Simulation Failed",
        description: error instanceof Error ? error.message : "Circuit simulation encountered an error",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleShare = async () => {
    console.log('🔗 Share button clicked - Creating shareable link');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Share",
        description: "Add some gates to the circuit before sharing",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create comprehensive circuit data for sharing
      const shareData = {
        version: "2.0",
        format: "QOSim Circuit",
        timestamp: new Date().toISOString(),
        circuit: {
          name: circuitName || 'Shared Quantum Circuit',
          gates: circuit.map((gate, index) => ({
            id: gate.id || `gate_${index}`,
            type: gate.type || 'H',
            qubit: gate.qubit !== undefined ? gate.qubit : 0,
            qubits: gate.qubits || [],
            position: gate.position !== undefined ? gate.position : index,
            angle: gate.angle,
            params: gate.params || {}
          })),
          metadata: {
            gateCount: circuit.length,
            qubits: 5,
            depth: Math.max(...circuit.map(g => g.position || 0), 0) + 1
          }
        }
      };

      // Encode circuit data for URL
      const circuitJson = JSON.stringify(shareData);
      const encodedData = btoa(encodeURIComponent(circuitJson));
      const shareUrl = `${window.location.origin}/shared?data=${encodedData}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "🔗 Share Link Created",
        description: "Link copied to clipboard! Share it with others to collaborate.",
      });

      console.log('🔗 Share URL generated:', shareUrl);

    } catch (error) {
      console.error('❌ Share failed:', error);
      toast({
        title: "❌ Share Failed",
        description: "Could not create share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    console.log('💾 Download button clicked - Downloading circuit');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Download",
        description: "Add some gates to the circuit before downloading",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use the existing export handler for JSON download
      handleExportJSON();
      
      toast({
        title: "💾 Download Started",
        description: `Downloading circuit with ${circuit.length} gates as JSON`,
      });

    } catch (error) {
      console.error('❌ Download failed:', error);
      toast({
        title: "❌ Download Failed",
        description: "Could not download circuit file",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Copy",
        description: "Add some gates to copy circuit data",
        variant: "destructive",
      });
      return;
    }

    try {
      const circuitData = {
        gates: circuit.length,
        data: circuit.map(g => `${g.type}(q${g.qubit})`).join(', ')
      };
      
      await navigator.clipboard.writeText(JSON.stringify(circuitData, null, 2));
      
      toast({
        title: "📋 Circuit Copied",
        description: "Circuit data copied to clipboard",
      });

    } catch (error) {
      toast({
        title: "❌ Copy Failed",
        description: "Could not copy circuit data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    toast({
      title: newEditMode ? "✏️ Edit Mode ON" : "👁️ Edit Mode OFF",
      description: newEditMode ? "You can now modify the circuit" : "Circuit is in view mode",
    });
  };

  const handleSaveCircuit = async () => {
    if (!circuitName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a circuit name",
        variant: "destructive",
      });
      return;
    }

    const circuitData = circuit.map(gate => ({
      gate: gate.type,
      qubit: gate.qubit,
      qubits: gate.qubits,
      time: gate.position,
      angle: gate.angle
    }));

    const savedCircuit = await saveCircuit(circuitName, circuitData);
    if (savedCircuit) {
      setSavedCircuitId(savedCircuit.id);
      setShowSaveDialog(false);
      setCircuitName("");
      toast({
        title: "Circuit saved!",
        description: `"${circuitName}" has been saved to your circuits`,
      });
    }
  };

  const handleForkCircuit = async () => {
    if (!savedCircuitId) {
      toast({
        title: "Error",
        description: "Please save the circuit first before forking",
        variant: "destructive",
      });
      return;
    }

    const forkedCircuit = await forkCircuit(savedCircuitId, forkName || undefined);
    if (forkedCircuit) {
      setShowForkDialog(false);
      setForkName("");
      toast({
        title: "Circuit forked!",
        description: `Created "${forkedCircuit.name}"`,
      });
    }
  };

  const handleDelete = () => {
    console.log('🗑️ Delete button clicked - Clearing circuit');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Delete",
        description: "Circuit is already empty",
      });
      return;
    }
    
    const gateCount = circuit.length;
    onClear();
    
    toast({
      title: "✅ Circuit Cleared",
      description: `Removed ${gateCount} gates from the circuit`,
    });
  };

  return (
    <>
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-quantum-glow flex items-center justify-between">
            <span>Quantum Circuit Editor</span>
            <div className="flex items-center gap-2">
              {isEditMode && <span className="text-sm text-quantum-energy animate-pulse">EDIT MODE</span>}
              {(isPlaying || isExecuting) && <span className="text-sm text-quantum-neon animate-pulse">RUNNING...</span>}
              {circuit && circuit.length > 0 && (
                <span className="text-xs text-muted-foreground">{circuit.length} gates</span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CircuitActions
            onUndo={onUndo}
            onClear={onClear}
            onExportJSON={handleDownload}
            onExportQASM={handleExportQASM}
            onShowExportDialog={() => setShowExportDialog(true)}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onCopy={handleCopy}
            onShare={handleShare}
            onDelete={onClear}
            canUndo={canUndo}
          />
        </CardContent>
      </Card>

      {showExportDialog && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          circuit={circuit}
          circuitRef={React.createRef()}
          numQubits={5}
        />
      )}

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Circuit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter circuit name"
              value={circuitName}
              onChange={(e) => setCircuitName(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveCircuit} className="flex-1">
                Save Circuit
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {savedCircuitId && (
        <>
          <CollaborationDialog
            open={showCollaborationDialog}
            onOpenChange={setShowCollaborationDialog}
            circuitId={savedCircuitId}
            circuitName={circuitName || "Untitled Circuit"}
          />

          <ShareDialog
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            file={{
              id: savedCircuitId,
              name: circuitName || "Untitled Circuit",
              type: "circuit"
            }}
          />
        </>
      )}
    </>
  );
}
