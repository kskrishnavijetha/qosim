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
import { Play, Edit3, Copy, Trash2, Download, Share2, Clock, Zap, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function MyCircuitsPanel() {
  const { user, loading: authLoading } = useAuth();
  const { circuits, loading, error, deleteCircuit, duplicateCircuit, loadCircuit } = useCircuits();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState<any>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  console.log("MyCircuitsPanel - Current state:", {
    user: user?.id,
    authLoading,
    circuits: circuits?.length,
    loading,
    error
  });

  // Filter out duplicate circuits with "Copy" in the name
  const uniqueCircuits = circuits?.filter(circuit => {
    // Keep circuits that don't have "Copy" in the name
    if (!circuit.name.includes('Copy') && !circuit.name.includes('(Copy)')) {
      return true;
    }
    
    // For circuits with "Copy", only keep if there's no original version
    const originalName = circuit.name.replace(/ \(Copy\)$/, '').replace(/ Copy$/, '');
    const hasOriginal = circuits?.some(c => c.name === originalName && c.id !== circuit.id);
    return !hasOriginal;
  }) || [];

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
    // Create a unique name without "Copy" suffix
    const baseName = circuit.name.replace(/ \(Copy\)$/, '').replace(/ Copy$/, '');
    const timestamp = new Date().getTime();
    const newName = `${baseName} - ${timestamp}`;
    
    // Create the duplicate with a unique name
    const duplicatedCircuit = await duplicateCircuit({
      ...circuit,
      name: newName
    });
    
    if (duplicatedCircuit) {
      toast.success(`Circuit duplicated as "${newName}"`);
    }
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

  const getQubitCount = (circuit: any) => {
    if (!circuit.circuit_data) return 0;
    if (typeof circuit.circuit_data.qubits === 'number') return circuit.circuit_data.qubits;
    if (Array.isArray(circuit.circuit_data)) return circuit.circuit_data.length;
    return 2; // default fallback
  };

  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-quantum-void">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-quantum-glow mx-auto mb-4" />
          <p className="text-quantum-glow">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-quantum-void">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-quantum-glow">Authentication Required</h3>
          <p className="text-quantum-particle mb-6">
            Please sign in to view your saved circuits
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="neon-border bg-quantum-matrix hover:bg-quantum-glow"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-quantum-void">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-quantum-glow">Error Loading Circuits</h3>
          <p className="text-quantum-particle mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="neon-border bg-quantum-matrix hover:bg-quantum-glow"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-quantum-void">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-glow mx-auto mb-4"></div>
          <p className="text-quantum-glow">Loading circuits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-quantum-void text-quantum-glow">
      <div className="flex items-center justify-between p-4 border-b border-quantum-matrix">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-quantum-neon" />
          <h2 className="text-lg font-semibold text-quantum-glow">My Circuits</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-quantum-matrix border-quantum-glow text-quantum-glow">
            {uniqueCircuits.length || 0} circuits
          </Badge>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="neon-border">
                Save New
              </Button>
            </DialogTrigger>
            <DialogContent className="quantum-panel">
              <CircuitSaveDialog onClose={() => setShowSaveDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4">
        {!uniqueCircuits || uniqueCircuits.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-quantum-particle mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-quantum-glow">No circuits yet</h3>
            <p className="text-quantum-particle mb-6">
              Create your first quantum circuit and save it here
            </p>
            <Button 
              onClick={() => setShowSaveDialog(true)} 
              className="neon-border bg-quantum-matrix hover:bg-quantum-glow"
            >
              Save Current Circuit
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {uniqueCircuits.map((circuit) => {
              const qubitCount = getQubitCount(circuit);
              
              return (
                <Card key={circuit.id} className="quantum-panel neon-border bg-quantum-matrix/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-mono text-quantum-glow">{circuit.name || 'Untitled Circuit'}</CardTitle>
                      <div className="flex items-center gap-2">
                        {circuit.is_public && (
                          <Badge variant="secondary" className="text-xs bg-quantum-glow text-black">Public</Badge>
                        )}
                        <Badge variant="outline" className="text-xs bg-quantum-matrix border-quantum-glow text-quantum-glow">
                          {qubitCount} qubits
                        </Badge>
                      </div>
                    </div>
                    {circuit.description && (
                      <p className="text-sm text-quantum-particle">{circuit.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-quantum-particle" />
                          <span className="text-quantum-particle">
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
                              <AlertDialogTitle className="text-quantum-glow">Delete Circuit</AlertDialogTitle>
                              <AlertDialogDescription className="text-quantum-particle">
                                Are you sure you want to delete "{circuit.name || 'this circuit'}"? This action cannot be undone.
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

                    <div className="bg-quantum-matrix rounded-lg p-3 border border-quantum-glow/20">
                      <div className="text-xs text-quantum-particle mb-2">Circuit Preview</div>
                      <div className="space-y-2">
                        {Array.from({ length: Math.min(qubitCount, 4) }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-6 text-xs font-mono text-quantum-neon">q{i}</div>
                            <div className="flex-1 relative h-4 flex items-center">
                              <div className="w-full h-0.5 bg-quantum-neon relative"></div>
                              <div className="absolute left-1/4 w-6 h-6 bg-quantum-glow rounded border border-quantum-glow flex items-center justify-center text-xs font-bold text-black">
                                H
                              </div>
                              <div className="absolute left-3/5 w-6 h-6 bg-quantum-neon rounded border border-quantum-neon flex items-center justify-center text-xs font-bold text-black">
                                X
                              </div>
                            </div>
                          </div>
                        ))}
                        {qubitCount > 4 && (
                          <div className="text-xs text-quantum-particle text-center">
                            ... and {qubitCount - 4} more qubits
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="quantum-panel">
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
