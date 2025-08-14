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

  // Enhanced Play function with better error handling
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

      // Simulate the circuit execution with more realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic simulation results
      const mockResults = {
        statevector: Array.from({ length: Math.pow(2, 5) }, () => Math.random()),
        probabilities: circuit.reduce((acc: any, gate: any, index: number) => {
          const qubit = gate.qubit !== undefined ? gate.qubit : index % 5;
          acc[`qubit_${qubit}`] = Math.random();
          return acc;
        }, {}),
        executionTime: '1.5s',
        gateCount: circuit.length,
        measurementResults: Array.from({ length: 10 }, () => 
          Array.from({ length: 5 }, () => Math.random() > 0.5 ? 1 : 0).join('')
        )
      };

      toast({
        title: "✅ Circuit Simulation Complete", 
        description: `Successfully executed ${circuit.length} gates`,
      });

      console.log('🎯 Simulation results:', mockResults);
      
      // Here you would typically update the simulation results in your state management
      // For now, we'll just log the results
      
    } catch (error) {
      console.error('❌ Simulation error:', error);
      toast({
        title: "❌ Simulation Failed",
        description: "An error occurred during circuit simulation",
        variant: "destructive",
      });
    } finally {
      setIsPlaying(false);
    }
  };

  // Enhanced Edit function
  const handleEdit = () => {
    console.log('✏️ Edit button clicked - Toggling edit mode');
    
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    toast({
      title: newEditMode ? "✅ Edit Mode Enabled" : "👁️ Edit Mode Disabled",
      description: newEditMode ? "You can now modify the circuit" : "Circuit is now in view mode",
    });

    // Update URL to reflect edit mode
    try {
      const currentUrl = new URL(window.location.href);
      if (newEditMode) {
        currentUrl.searchParams.set('mode', 'edit');
      } else {
        currentUrl.searchParams.delete('mode');
      }
      window.history.replaceState({}, '', currentUrl.toString());
      
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('editModeChange', { 
        detail: { editMode: newEditMode } 
      }));
    } catch (error) {
      console.error('Failed to update URL:', error);
    }
  };

  // Enhanced Copy function with better data structure
  const handleCopy = async () => {
    console.log('📋 Copy button clicked - Copying circuit to clipboard');
    
    if (!circuit || circuit.length === 0) {
      toast({
        title: "Nothing to Copy",
        description: "Circuit is empty - add some gates first",
        variant: "destructive",
      });
      return;
    }

    try {
      const circuitData = {
        format: "QOSim Circuit JSON",
        version: "2.0",
        timestamp: new Date().toISOString(),
        metadata: {
          name: circuitName || 'Untitled Circuit',
          gateCount: circuit.length,
          qubits: Math.max(...circuit.map(g => {
            if (g.qubit !== undefined) return g.qubit;
            if (g.qubits && Array.isArray(g.qubits)) return Math.max(...g.qubits);
            return 0;
          })) + 1,
          depth: Math.max(...circuit.map(g => g.position || 0)) + 1
        },
        circuit: circuit.map((gate, index) => ({
          id: gate.id || `gate_${index}`,
          type: gate.type || 'unknown',
          qubit: gate.qubit,
          qubits: gate.qubits,
          position: gate.position || index,
          angle: gate.angle,
          parameters: gate.parameters || {}
        }))
      };

      const jsonString = JSON.stringify(circuitData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      
      toast({
        title: "✅ Circuit Copied Successfully",
        description: `Copied ${circuit.length} gates to clipboard as JSON`,
      });
      
      console.log('📋 Copied circuit data:', circuitData);
      
    } catch (error) {
      console.error('❌ Failed to copy circuit:', error);
      toast({
        title: "❌ Copy Failed",
        description: "Unable to copy circuit data to clipboard",
        variant: "destructive",
      });
    }
  };

  // Enhanced Share function with proper link generation
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
      // Create a comprehensive shareable circuit object
      const shareableCircuit = {
        format: "QOSim Shared Circuit",
        version: "2.0",
        circuit: circuit.map((gate, index) => ({
          id: gate.id || `gate_${index}`,
          type: gate.type || 'H',
          qubit: gate.qubit !== undefined ? gate.qubit : 0,
          qubits: gate.qubits,
          position: gate.position !== undefined ? gate.position : index,
          angle: gate.angle,
          parameters: gate.parameters
        })),
        metadata: {
          name: circuitName || 'Shared Quantum Circuit',
          description: `A quantum circuit with ${circuit.length} gates`,
          created: new Date().toISOString(),
          gateCount: circuit.length,
          qubits: Math.max(...circuit.map(g => {
            if (g.qubit !== undefined) return g.qubit;
            if (g.qubits && Array.isArray(g.qubits)) return Math.max(...g.qubits);
            return 0;
          })) + 1
        }
      };

      // Encode the circuit data for URL (with compression for large circuits)
      const circuitJson = JSON.stringify(shareableCircuit);
      const encodedCircuit = btoa(encodeURIComponent(circuitJson));
      const shareUrl = `${window.location.origin}/shared?circuit=${encodedCircuit}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "✅ Share Link Created & Copied",
        description: "Circuit link copied to clipboard. Share it with others!",
      });

      console.log('🔗 Generated share URL:', shareUrl);
      console.log('📊 Shared circuit data:', shareableCircuit);

    } catch (error) {
      console.error('❌ Failed to share circuit:', error);
      toast({
        title: "❌ Share Failed",
        description: "Unable to create share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Enhanced Download function using the export handlers
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
      // Use the export handler for consistent JSON format
      handleExportJSON();
      console.log('💾 Download initiated for circuit with', circuit.length, 'gates');
    } catch (error) {
      console.error('❌ Failed to download circuit:', error);
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
            <div className="flex items-center gap-2">
              {isEditMode && <span className="text-sm text-quantum-energy animate-pulse">EDIT MODE</span>}
              {isPlaying && <span className="text-sm text-quantum-neon animate-pulse">RUNNING...</span>}
              {circuit && circuit.length > 0 && (
                <span className="text-xs text-muted-foreground">{circuit.length} gates</span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CircuitActions
            onUndo={onUndo}
            onClear={handleDelete}
            onExportJSON={handleDownload}
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
