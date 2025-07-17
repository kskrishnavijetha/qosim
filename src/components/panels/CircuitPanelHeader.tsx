
import React, { useState } from "react";
import { Undo, Trash2, Download, FileText, Share2, GitFork, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCircuits } from "@/hooks/useCircuits";
import { useCircuitSharing } from "@/hooks/useCircuitSharing";
import { CollaborationDialog } from "@/components/dialogs/CollaborationDialog";
import { ShareDialog } from "@/components/dialogs/ShareDialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  return (
    <>
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-quantum-glow">Quantum Circuit Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {/* Circuit Management */}
            <div className="flex gap-2">
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="neon-border">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent className="quantum-panel border-quantum-glow/30">
                  <DialogHeader>
                    <DialogTitle className="text-quantum-glow">Save Circuit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter circuit name..."
                      value={circuitName}
                      onChange={(e) => setCircuitName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveCircuit()}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveCircuit}
                        className="bg-quantum-glow hover:bg-quantum-glow/80 text-black flex-1"
                      >
                        Save Circuit
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSaveDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showForkDialog} onOpenChange={setShowForkDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="neon-border"
                    disabled={!savedCircuitId}
                  >
                    <GitFork className="w-4 h-4 mr-2" />
                    Fork
                  </Button>
                </DialogTrigger>
                <DialogContent className="quantum-panel border-quantum-glow/30">
                  <DialogHeader>
                    <DialogTitle className="text-quantum-glow">Fork Circuit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter new circuit name (optional)..."
                      value={forkName}
                      onChange={(e) => setForkName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleForkCircuit()}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleForkCircuit}
                        className="bg-quantum-glow hover:bg-quantum-glow/80 text-black flex-1"
                      >
                        Create Fork
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowForkDialog(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Sharing & Collaboration */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="neon-border"
                onClick={handleQuickShare}
                disabled={!savedCircuitId}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button 
                variant="outline" 
                className="neon-border"
                onClick={() => setShowCollaborationDialog(true)}
                disabled={!savedCircuitId}
              >
                <Users className="w-4 h-4 mr-2" />
                Collaborate
              </Button>
            </div>

            {/* Circuit Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={onUndo} 
                disabled={!canUndo}
                variant="outline"
                className="neon-border"
              >
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>

              <Button 
                onClick={onClear} 
                variant="outline" 
                className="neon-border border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Export Options */}
            <div className="flex gap-2">
              <Button onClick={onExportJSON} variant="outline" className="neon-border">
                <FileText className="w-4 h-4 mr-2" />
                JSON
              </Button>

              <Button onClick={onExportQASM} variant="outline" className="neon-border">
                <FileText className="w-4 h-4 mr-2" />
                QASM
              </Button>

              <Button onClick={onShowExportDialog} variant="outline" className="neon-border">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
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
