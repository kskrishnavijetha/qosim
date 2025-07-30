
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCircuits } from "@/hooks/useCircuits";
import { toast } from "sonner";

interface CircuitSaveDialogProps {
  onClose: () => void;
  circuitData?: any;
}

export function CircuitSaveDialog({ onClose, circuitData }: CircuitSaveDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const { saveCircuit } = useCircuits();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Circuit name is required");
      return;
    }

    setLoading(true);
    try {
      // If no circuit data provided, create a default empty circuit
      const defaultCircuitData = {
        qubits: [],
        gates: [],
        layers: [],
        depth: 0,
        metadata: {
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      await saveCircuit(
        name.trim(),
        circuitData || defaultCircuitData,
        description.trim(),
        isPublic
      );
      onClose();
      toast.success("Circuit saved successfully");
    } catch (error) {
      toast.error("Failed to save circuit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-quantum-glow">Save Circuit</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Circuit Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter circuit name"
            className="quantum-panel neon-border"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter circuit description"
            className="quantum-panel neon-border resize-none"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="public" className="text-sm font-medium">
            Make circuit public
          </Label>
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="neon-border"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || !name.trim()}
          className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
        >
          {loading ? "Saving..." : "Save Circuit"}
        </Button>
      </DialogFooter>
    </>
  );
}
