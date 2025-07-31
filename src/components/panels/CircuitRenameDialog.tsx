
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCircuits } from "@/hooks/useCircuits";
import { Loader2 } from "lucide-react";
import type { Circuit } from "@/hooks/useCircuits";

interface CircuitRenameDialogProps {
  circuit: Circuit | null;
  onClose: () => void;
}

export function CircuitRenameDialog({ circuit, onClose }: CircuitRenameDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { updateCircuit } = useCircuits();

  useEffect(() => {
    if (circuit) {
      setName(circuit.name);
      setDescription(circuit.description || "");
      setIsPublic(circuit.is_public);
    }
  }, [circuit]);

  const handleUpdate = async () => {
    if (!circuit || !name.trim()) return;

    setUpdating(true);
    try {
      await updateCircuit(circuit.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
      });
      onClose();
    } finally {
      setUpdating(false);
    }
  };

  if (!circuit) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Circuit</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-circuit-name">Circuit Name *</Label>
          <Input
            id="edit-circuit-name"
            placeholder="Enter circuit name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="quantum-panel neon-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-circuit-description">Description (optional)</Label>
          <Textarea
            id="edit-circuit-description"
            placeholder="Describe your circuit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="quantum-panel neon-border"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="edit-public-circuit">Make Public</Label>
            <p className="text-xs text-muted-foreground">
              Allow others to view and use this circuit
            </p>
          </div>
          <Switch
            id="edit-public-circuit"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={updating}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpdate}
          disabled={!name.trim() || updating}
          className="neon-border"
        >
          {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Circuit
        </Button>
      </DialogFooter>
    </>
  );
}
