
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCircuits } from "@/hooks/useCircuits";
import { toast } from "sonner";

interface CircuitRenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit: any;
}

export function CircuitRenameDialog({ open, onOpenChange, circuit }: CircuitRenameDialogProps) {
  const [name, setName] = useState(circuit?.name || "");
  const [description, setDescription] = useState(circuit?.description || "");
  const [loading, setLoading] = useState(false);
  const { updateCircuit } = useCircuits();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Circuit name is required");
      return;
    }

    setLoading(true);
    try {
      await updateCircuit(circuit.id, {
        name: name.trim(),
        description: description.trim()
      });
      onOpenChange(false);
      toast.success("Circuit updated successfully");
    } catch (error) {
      toast.error("Failed to update circuit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow">Rename Circuit</DialogTitle>
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
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
