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
}

export function CircuitPanelHeader({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onShowExportDialog,
  canUndo,
  circuit = []
}: CircuitPanelHeaderProps) {
  const [showCollaborationDialog, setShowCollaborationDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showForkDialog, setShowForkDialog] = useState(false);
  const [circuitName, setCircuitName] = useState("");
  const [forkName, setForkName] = useState("");
  const [savedCircuitId, setSavedCircuitId] = useState<string | null>(null);

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

  const handleQuickShare = async () => {
    if (!savedCircuitId) {
      toast({
        title: "Save Required",
        description: "Please save the circuit before sharing",
        variant: "destructive",
      });
      return;
    }

    const result = await createShareLink(savedCircuitId, 'view');
    if (result?.shareUrl) {
      navigator.clipboard.writeText(result.shareUrl);
      toast({
        title: "Share link copied!",
        description: "Link copied to clipboard",
      });
    }
  };

  const handlePlay = () => {
    console.log('Playing circuit simulation...');
    toast({
      title: "Circuit Simulation",
      description: "Running quantum circuit simulation...",
    });
  };

  const handleEdit = () => {
    console.log('Entering edit mode...');
    toast({
      title: "Edit Mode",
      description: "Circuit is now in edit mode",
    });
  };

  const handleCopy = async () => {
    try {
      const circuitData = JSON.stringify(circuit, null, 2);
      await navigator.clipboard.writeText(circuitData);
      toast({
        title: "Circuit Copied",
        description: "Circuit data copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy circuit data",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (circuit.length === 0) {
      toast({
        title: "Nothing to Delete",
        description: "Circuit is already empty",
      });
      return;
    }
    
    onClear();
    toast({
      title: "Circuit Deleted",
      description: "All gates have been removed from the circuit",
    });
  };

  return (
    <>
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-quantum-glow">Quantum Circuit Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <CircuitActions
            onUndo={onUndo}
            onClear={onClear}
            onExportJSON={onExportJSON}
            onExportQASM={onExportQASM}
            onShowExportDialog={onShowExportDialog}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onCopy={handleCopy}
            onShare={handleQuickShare}
            onDelete={handleDelete}
            canUndo={canUndo}
          />
        </CardContent>
      </Card>

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
