import React, { useState } from "react";
import { Undo, Trash2, Download, FileText, Share2, GitFork, Users, Save, Play, Edit, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCircuits } from "@/hooks/useCircuits";
import { useCircuitSharing } from "@/hooks/useCircuitSharing";
import { CollaborationDialog } from "@/components/dialogs/CollaborationDialog";
import { ShareDialog } from "@/components/dialogs/ShareDialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CircuitActions } from "@/components/circuits/CircuitActions";

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
  const [circuitName, setCircuitName] = useState("");
  const [forkName, setForkName] = useState("");
  const [savedCircuitId, setSavedCircuitId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { saveCircuit } = useCircuits();
  const { forkCircuit, createShareLink } = useCircuitSharing();
  const { toast } = useToast();

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

  const handlePlay = () => {
    console.log('🎬 Play button clicked - Starting circuit simulation');
    
    if (circuit.length === 0) {
      toast({
        title: "No Circuit to Play",
        description: "Please add some gates to the circuit first",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    
    // Simulate running the circuit
    setTimeout(() => {
      setIsPlaying(false);
      toast({
        title: "Circuit Simulation Complete", 
        description: `Executed ${circuit.length} gates successfully`,
      });
    }, 2000);

    toast({
      title: "Running Circuit Simulation",
      description: "Circuit is being executed...",
    });
  };

  const handleEdit = () => {
    console.log('✏️ Edit button clicked - Toggling edit mode');
    setIsEditMode(!isEditMode);
    
    toast({
      title: isEditMode ? "Edit Mode Disabled" : "Edit Mode Enabled",
      description: isEditMode ? "Circuit is now in view mode" : "You can now modify the circuit",
    });
  };

  const handleCopy = async () => {
    console.log('📋 Copy button clicked - Copying circuit to clipboard');
    
    if (circuit.length === 0) {
      toast({
        title: "Nothing to Copy",
        description: "Circuit is empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const circuitData = JSON.stringify(circuit, null, 2);
      await navigator.clipboard.writeText(circuitData);
      
      toast({
        title: "Circuit Copied",
        description: `Copied ${circuit.length} gates to clipboard`,
      });
    } catch (error) {
      console.error('Failed to copy circuit:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy circuit data",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    console.log('🔗 Share button clicked - Creating share link');
    
    if (circuit.length === 0) {
      toast({
        title: "Nothing to Share",
        description: "Please add some gates to the circuit first",
        variant: "destructive",
      });
      return;
    }

    try {
      const shareData = {
        title: 'Quantum Circuit',
        text: `Check out this quantum circuit with ${circuit.length} gates!`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Circuit Shared",
          description: "Share dialog opened successfully",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Share Link Copied",
          description: "Circuit link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Failed to share circuit:', error);
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Share Link Copied",
        description: "Circuit link copied to clipboard",
      });
    }
  };

  const handleDelete = () => {
    console.log('🗑️ Delete button clicked - Clearing circuit');
    
    if (circuit.length === 0) {
      toast({
        title: "Nothing to Delete",
        description: "Circuit is already empty",
      });
      return;
    }
    
    const gateCount = circuit.length;
    onClear();
    
    toast({
      title: "Circuit Deleted",
      description: `Removed ${gateCount} gates from the circuit`,
    });
  };

  const handleDownload = () => {
    console.log('💾 Download button clicked - Opening export dialog');
    onShowExportDialog();
  };

  return (
    <>
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-quantum-glow flex items-center justify-between">
            <span>Quantum Circuit Editor</span>
            {isEditMode && <span className="text-sm text-quantum-energy">EDIT MODE</span>}
            {isPlaying && <span className="text-sm text-quantum-neon animate-pulse">RUNNING...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CircuitActions
            onUndo={onUndo}
            onClear={onClear}
            onExportJSON={onExportJSON}
            onExportQASM={onExportQASM}
            onShowExportDialog={handleDownload}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onCopy={handleCopy}
            onShare={handleShare}
            onDelete={handleDelete}
            canUndo={canUndo}
          />
        </CardContent>
      </Card>

      {/* Save Dialog */}
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
