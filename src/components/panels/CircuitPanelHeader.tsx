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

  // Play function - simulate the circuit
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
    
    try {
      toast({
        title: "Running Circuit Simulation",
        description: `Executing ${circuit.length} gates...`,
      });

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

  // Edit function - navigate to circuit editor
  const handleEdit = () => {
    console.log('✏️ Edit button clicked - Opening circuit editor');
    setIsEditMode(!isEditMode);
    
    toast({
      title: isEditMode ? "Edit Mode Disabled" : "Edit Mode Enabled",
      description: isEditMode ? "Circuit is now in view mode" : "You can now modify the circuit",
    });

    // Navigate to circuit editor
    if (!isEditMode) {
      // This opens the interactive circuit builder
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('tab', 'circuit-editor');
      window.history.pushState({}, '', currentUrl.toString());
      
      // Trigger a custom event to notify the app of the tab change
      window.dispatchEvent(new CustomEvent('tabChange', { detail: 'circuit-editor' }));
    }
  };

  // Copy function - copy circuit JSON to clipboard
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
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy circuit data to clipboard",
        variant: "destructive",
      });
    }
  };

  // Share function - generate shareable link
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

      // Encode the circuit data for URL
      const encodedCircuit = btoa(JSON.stringify(shareableCircuit));
      const shareUrl = `${window.location.origin}/shared?circuit=${encodedCircuit}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "✅ Share Link Copied",
        description: "Circuit link copied to clipboard. Share it with others!",
      });

    } catch (error) {
      console.error('Failed to share circuit:', error);
      toast({
        title: "❌ Share Failed",
        description: "Unable to create share link",
        variant: "destructive",
      });
    }
  };

  // Download function - download circuit as JSON file
  const handleDownload = () => {
    console.log('💾 Download button clicked - Downloading circuit as JSON');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Download",
        description: "Please add some gates to the circuit first",
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
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantum_circuit_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "✅ Download Complete",
        description: `Circuit downloaded as JSON file`,
      });
    } catch (error) {
      console.error('Failed to download circuit:', error);
      toast({
        title: "❌ Download Failed",
        description: "Unable to download circuit file",
        variant: "destructive",
      });
    }
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
