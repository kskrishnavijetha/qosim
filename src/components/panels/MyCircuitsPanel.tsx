
import { useState } from "react";
import { Plus, Search, Grid, List, Edit2, Trash2, Play, Copy, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useCircuits } from "@/hooks/useCircuits";
import { CircuitRenameDialog } from "./CircuitRenameDialog";
import { CircuitSaveDialog } from "./CircuitSaveDialog";
import { toast } from "sonner";

export function MyCircuitsPanel() {
  const { circuits, loading, deleteCircuit, duplicateCircuit } = useCircuits();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCircuit, setSelectedCircuit] = useState<any>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const filteredCircuits = circuits.filter(circuit =>
    circuit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circuit.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (circuitId: string) => {
    if (window.confirm("Are you sure you want to delete this circuit?")) {
      await deleteCircuit(circuitId);
    }
  };

  const handleDuplicate = async (circuit: any) => {
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

  const getCircuitStats = (circuitData: any) => {
    if (!circuitData) return { qubits: 0, gates: 0, depth: 0 };
    return {
      qubits: circuitData.qubits?.length || 0,
      gates: circuitData.gates?.length || 0,
      depth: circuitData.depth || 0
    };
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quantum-glow mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading circuits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">My Circuits</h2>
            <p className="text-muted-foreground font-mono">
              {circuits.length} circuit{circuits.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="neon-border"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  New Circuit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CircuitSaveDialog onClose={() => setShowSaveDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search circuits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 quantum-panel neon-border"
          />
        </div>

        {/* Empty State */}
        {filteredCircuits.length === 0 && !loading && (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? "No circuits found" : "No circuits yet"}
                </h3>
                <p className="text-sm mb-4">
                  {searchQuery 
                    ? "Try adjusting your search terms"
                    : "Create your first quantum circuit to get started"
                  }
                </p>
                {!searchQuery && (
                  <Button 
                    onClick={() => setShowSaveDialog(true)}
                    className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Circuit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Circuits Display */}
        {filteredCircuits.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
            {filteredCircuits.map((circuit) => {
              const stats = getCircuitStats(circuit.circuit_data);
              return (
                <Card key={circuit.id} className="quantum-panel neon-border hover:border-quantum-glow/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-mono truncate">{circuit.name}</CardTitle>
                        {circuit.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {circuit.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRename(circuit)}
                          className="h-8 w-8 p-0 hover:bg-quantum-glow/20"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(circuit.id)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Circuit Stats */}
                      <div className="flex gap-4 text-sm font-mono">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Qubits:</span>
                          <Badge variant="outline" className="text-quantum-neon border-quantum-neon/30">
                            {stats.qubits}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Gates:</span>
                          <Badge variant="outline" className="text-quantum-glow border-quantum-glow/30">
                            {stats.gates}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Depth:</span>
                          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                            {stats.depth}
                          </Badge>
                        </div>
                      </div>

                      {/* Circuit Preview */}
                      <div className="bg-quantum-matrix rounded-lg p-3 quantum-panel">
                        <div className="text-xs text-muted-foreground mb-2">Circuit Preview</div>
                        <div className="space-y-2">
                          {Array.from({ length: Math.min(stats.qubits, 3) }).map((_, i) => (
                            <div key={i} className="flex items-center">
                              <span className="w-6 text-xs font-mono text-quantum-neon">q{i}</span>
                              <div className="flex-1 relative h-4 flex items-center">
                                <div className="w-full h-0.5 bg-quantum-neon/50"></div>
                                <div className="absolute left-1/4 w-4 h-4 bg-quantum-glow rounded border border-quantum-glow flex items-center justify-center text-xs font-bold text-black">
                                  H
                                </div>
                                <div className="absolute right-1/4 w-2 h-2 bg-quantum-particle rounded-full"></div>
                              </div>
                            </div>
                          ))}
                          {stats.qubits > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{stats.qubits - 3} more qubits
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="text-xs text-muted-foreground">
                        <div>Created: {formatDate(circuit.created_at)}</div>
                        <div>Modified: {formatDate(circuit.updated_at)}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 neon-border">
                          <Play className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicate(circuit)}
                          className="neon-border"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="neon-border">
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Rename Dialog */}
        {selectedCircuit && (
          <CircuitRenameDialog
            open={showRenameDialog}
            onOpenChange={setShowRenameDialog}
            circuit={selectedCircuit}
          />
        )}
      </div>
    </div>
  );
}
