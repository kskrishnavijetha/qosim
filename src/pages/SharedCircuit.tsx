import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Eye, Edit, Share2, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircuitGrid } from "@/components/circuits/CircuitGrid";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";
import { useToast } from "@/hooks/use-toast";

export function SharedCircuit() {
  const { fileId } = useParams();
  const [searchParams] = useSearchParams();
  const permission = searchParams.get("permission") || "view";
  const expires = searchParams.get("expires");
  const { toast } = useToast();
  
  const [circuit, setCircuit] = useState({
    id: fileId,
    name: "Bell State Circuit",
    author: "Quantum Developer",
    description: "Creates an entangled Bell state between two qubits",
    created: "2024-01-15 14:30",
    type: "circuit",
    gates: [
      { id: "h1", type: "H", qubit: 0, position: 0 },
      { id: "cx1", type: "CNOT", control: 0, target: 1, position: 1 }
    ]
  });
  
  const [isExpired, setIsExpired] = useState(false);
  const isEditable = permission === "edit";

  useEffect(() => {
    if (expires) {
      const expiryTime = parseInt(expires);
      if (Date.now() > expiryTime) {
        setIsExpired(true);
      }
    }
  }, [expires]);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    });
  };

  const handleDownload = () => {
    const circuitData = JSON.stringify(circuit, null, 2);
    const blob = new Blob([circuitData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuit.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center">
        <Card className="quantum-panel border-red-500/30 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Link Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This shared circuit link has expired and is no longer accessible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quantum-void quantum-grid">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-quantum-glow">{circuit.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>By {circuit.author}</span>
              <span>•</span>
              <span>{circuit.created}</span>
              <Badge variant={isEditable ? "default" : "secondary"}>
                {isEditable ? (
                  <>
                    <Edit className="w-3 h-3 mr-1" />
                    Editable
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Read-Only
                  </>
                )}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {circuit.description && (
          <Card className="quantum-panel neon-border">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">{circuit.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Circuit Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Circuit Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <CircuitGrid
                  circuit={circuit.gates}
                  dragState={{ isDragging: false, gateType: "", dragPosition: { x: 0, y: 0 }, hoverQubit: null, hoverPosition: null }}
                  simulationResult={null}
                  onDeleteGate={() => {}}
                  circuitRef={{ current: null }}
                  NUM_QUBITS={2}
                  GRID_SIZE={60}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Quantum State</CardTitle>
              </CardHeader>
              <CardContent>
                <QuantumStateVisualization
                  simulationResult={null}
                  NUM_QUBITS={2}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Attribution */}
        <div className="text-center text-xs text-muted-foreground border-t border-quantum-glow/20 pt-4">
          <p>Shared from Quantum Circuit Editor • Built with Lovable</p>
        </div>
      </div>
    </div>
  );
}