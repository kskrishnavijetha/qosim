
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useCircuits } from "@/hooks/useCircuits";
import { useAuth } from "@/contexts/AuthContext";
import { CircuitSaveDialog } from "./CircuitSaveDialog";
import { CircuitRenameDialog } from "./CircuitRenameDialog";
import { Play, Edit3, Copy, Trash2, Download, Share2, Clock, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function MyCircuitsPanel() {
  const { user } = useAuth();
  const { circuits, loading, deleteCircuit, duplicateCircuit, loadCircuit } = useCircuits();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState<any>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  // Enhanced debugging
  console.log("MyCircuitsPanel - Render started");
  console.log("MyCircuitsPanel - user:", user);
  console.log("MyCircuitsPanel - circuits:", circuits);
  console.log("MyCircuitsPanel - loading:", loading);
  console.log("MyCircuitsPanel - circuits.length:", circuits?.length);

  useEffect(() => {
    console.log("MyCircuitsPanel - useEffect triggered");
    console.log("MyCircuitsPanel - user in useEffect:", user);
    console.log("MyCircuitsPanel - loading in useEffect:", loading);
    console.log("MyCircuitsPanel - circuits in useEffect:", circuits);
  }, [user, loading, circuits]);

  const handleLoadCircuit = async (circuit: any) => {
    console.log("Loading circuit:", circuit);
    const loaded = await loadCircuit(circuit.id);
    if (loaded) {
      toast.success(`Circuit "${circuit.name}" loaded successfully`);
    }
  };

  const handleDeleteCircuit = async (circuitId: string) => {
    const success = await deleteCircuit(circuitId);
    if (success) {
      toast.success("Circuit deleted successfully");
    }
  };

  const handleDuplicateCircuit = async (circuit: any) => {
    await duplicateCircuit(circuit);
  };

  const handleRename = (circuit: any) => {
    setSelectedCircuit(circuit);
    setShowRenameDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show authentication required state
  if (!user) {
    console.log("MyCircuitsPanel - No user, showing auth required");
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your saved circuits
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    console.log("MyCircuitsPanel - Showing loading state");
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-glow mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading circuits...</p>
        </div>
      </div>
    );
  }

  console.log("MyCircuitsPanel - Rendering main content");

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="flex items-center justify-between p-4 border-b border-quantum-matrix">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-quantum-neon" />
          <h2 className="text-lg font-semibold text-quantum-glow">My Circuits</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-quantum-matrix">
            {circuits?.length || 0} circuits
          </Badge>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="neon-border">
                Save New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CircuitSaveDialog onClose={() => setShowSaveDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        {!circuits || circuits.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No circuits yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first quantum circuit and save it here
            </p>
            <Button onClick={() => setShowSaveDialog(true)} className="neon-border">
              Save Current Circuit
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {circuits.map((circuit) => (
              <Card key={circuit.id} className="quantum-panel neon-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{circuit.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {circuit.is_public && (
                        <Badge variant="secondary" className="text-xs">Public</Badge>
                      )}
                      <Badge variant="outline" className="text-xs bg-quantum-matrix">
                        {circuit.circuit_data?.qubits || 0} qubits
                      </Badge>
                    </div>
                  </div>
                  {circuit.description && (
                    <p className="text-sm text-muted-foreground">{circuit.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-muted-foreground">
                          {formatDate(circuit.updated_at)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="neon-border"
                        onClick={() => handleLoadCircuit(circuit)}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="neon-border"
                        onClick={() => handleRename(circuit)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="neon-border"
                        onClick={() => handleDuplicateCircuit(circuit)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="neon-border">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="neon-border">
                        <Download className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="neon-border text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="quantum-panel">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Circuit</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{circuit.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCircuit(circuit.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Circuit Preview */}
                  <div className="bg-quantum-matrix rounded-lg p-3 quantum-panel">
                    <div className="text-xs text-muted-foreground mb-2">Circuit Preview</div>
                    <div className="space-y-2">
                      {Array.from({ length: Math.min(circuit.circuit_data?.qubits || 2, 4) }).map((_, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-6 text-xs font-mono text-quantum-neon">q{i}</div>
                          <div className="flex-1 relative h-4 flex items-center">
                            <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
                            <div className="absolute left-1/4 w-6 h-6 bg-quantum-glow rounded border border-quantum-glow flex items-center justify-center text-xs font-bold text-black">
                              H
                            </div>
                            <div className="absolute left-3/5 w-6 h-6 bg-quantum-neon rounded border border-quantum-neon flex items-center justify-center text-xs font-bold text-black">
                              X
                            </div>
                          </div>
                        </div>
                      ))}
                      {(circuit.circuit_data?.qubits || 0) > 4 && (
                        <div className="text-xs text-muted-foreground text-center">
                          ... and {(circuit.circuit_data?.qubits || 0) - 4} more qubits
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <CircuitRenameDialog 
            circuit={selectedCircuit}
            onClose={() => {
              setShowRenameDialog(false);
              setSelectedCircuit(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
