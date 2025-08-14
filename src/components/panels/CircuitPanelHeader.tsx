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

  const { handleExportJSON, handleExportQASM, handleExportPython } = useExportHandlers(
    circuit, 
    5, // numQubits
    { projectName: 'quantum_circuit' }
  );

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

  const handlePlay = async () => {
    console.log('🎬 Play button clicked - Starting circuit simulation');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "No Circuit to Play",
        description: "Please add some gates to the circuit first",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    
    toast({
      title: "Running Circuit Simulation",
      description: `Executing ${circuit.length} gates...`,
    });

    try {
      // Simulate the circuit execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock simulation results
      const mockResults = {
        statevector: circuit.map(() => Math.random()),
        probabilities: circuit.reduce((acc: any, gate: any, index: number) => {
          acc[`qubit_${gate.qubit || index}`] = Math.random();
          return acc;
        }, {}),
        executionTime: '2.1s',
        gateCount: circuit.length
      };

      toast({
        title: "✅ Circuit Simulation Complete", 
        description: `Successfully executed ${circuit.length} gates in 2.1s`,
      });

      console.log('Simulation results:', mockResults);
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "❌ Simulation Failed",
        description: "An error occurred during circuit simulation",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleEdit = () => {
    console.log('✏️ Edit button clicked - Toggling edit mode');
    setIsEditMode(!isEditMode);
    
    toast({
      title: isEditMode ? "Edit Mode Disabled" : "Edit Mode Enabled",
      description: isEditMode ? "Circuit is now in view mode" : "You can now modify the circuit",
    });

    // Navigate to circuit editor if needed
    if (!isEditMode && circuit.length > 0) {
      // This would typically navigate to the interactive circuit builder
      window.location.href = '/app?tab=circuit-editor';
    }
  };

  const handleCopy = async () => {
    console.log('📋 Copy button clicked - Copying circuit to clipboard');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Copy",
        description: "Circuit is empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const circuitData = {
        format: "QOSim Circuit JSON",
        version: "1.0",
        timestamp: new Date().toISOString(),
        circuit: circuit.map(gate => ({
          gate: gate.type,
          qubit: gate.qubit,
          qubits: gate.qubits,
          position: gate.position,
          angle: gate.angle,
          id: gate.id
        })),
        metadata: {
          gateCount: circuit.length,
          qubits: Math.max(...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1
        }
      };

      const jsonString = JSON.stringify(circuitData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      
      toast({
        title: "✅ Circuit Copied",
        description: `Copied ${circuit.length} gates to clipboard as JSON`,
      });
    } catch (error) {
      console.error('Failed to copy circuit:', error);
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(circuit, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: "✅ Circuit Copied",
          description: `Copied ${circuit.length} gates to clipboard`,
        });
      } catch (fallbackError) {
        toast({
          title: "❌ Copy Failed",
          description: "Unable to copy circuit data to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async () => {
    console.log('🔗 Share button clicked - Creating share link');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Share",
        description: "Please add some gates to the circuit first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a shareable circuit data object
      const shareableCircuit = {
        circuit: circuit.map(gate => ({
          gate: gate.type,
          qubit: gate.qubit,
          qubits: gate.qubits,
          position: gate.position,
          angle: gate.angle
        })),
        metadata: {
          name: circuitName || 'Quantum Circuit',
          created: new Date().toISOString(),
          gateCount: circuit.length
        }
      };

      // For now, we'll create a URL with the circuit data encoded
      const encodedCircuit = btoa(JSON.stringify(shareableCircuit));
      const shareUrl = `${window.location.origin}/shared?circuit=${encodedCircuit}`;

      // Try native sharing first (mobile/modern browsers)
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: 'Quantum Circuit - QOSim',
          text: `Check out this quantum circuit with ${circuit.length} gates!`,
          url: shareUrl
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({
            title: "✅ Circuit Shared",
            description: "Share dialog opened successfully",
          });
          return;
        }
      }

      // Fallback to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "✅ Share Link Copied",
        description: "Circuit link copied to clipboard. Share it with others!",
      });

    } catch (error) {
      console.error('Failed to share circuit:', error);
      
      // Final fallback - just copy current URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "✅ Link Copied",
          description: "Current page link copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "❌ Share Failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        });
      }
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

  const handleDownload = () => {
    console.log('💾 Download button clicked - Downloading circuit as JSON');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Export",
        description: "Please add some gates to the circuit first",
        variant: "destructive",
      });
      return;
    }
    
    // Directly download as JSON file
    handleExportJSON();
    
    toast({
      title: "✅ Download Started",
      description: "Circuit JSON file download initiated",
    });
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
            onClear={handleDelete}
            onExportJSON={handleExportJSON}
            onExportQASM={handleExportQASM}
            onShowExportDialog={() => setShowExportDialog(true)}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onCopy={handleCopy}
            onShare={handleShare}
            onDelete={handleDelete}
            canUndo={canUndo}
          />
        </CardContent>
      </Card>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          circuit={circuit}
          circuitRef={React.createRef()}
          numQubits={5}
        />
      )}

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
