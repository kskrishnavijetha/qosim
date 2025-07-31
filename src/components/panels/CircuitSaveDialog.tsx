
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCircuits } from "@/hooks/useCircuits";
import { useCircuitState } from "@/hooks/useCircuitState";
import { Loader2 } from "lucide-react";

interface CircuitSaveDialogProps {
  onClose: () => void;
}

export function CircuitSaveDialog({ onClose }: CircuitSaveDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const { saveCircuit } = useCircuits();
  const { circuit } = useCircuitState();

  const handleSave = async () => {
    if (!name.trim()) return;

    setSaving(true);
    try {
      await saveCircuit(name.trim(), circuit, description.trim() || undefined, isPublic);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Save Circuit</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="circuit-name">Circuit Name *</Label>
          <Input
            id="circuit-name"
            placeholder="Enter circuit name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="quantum-panel neon-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="circuit-description">Description (optional)</Label>
          <Textarea
            id="circuit-description"
            placeholder="Describe your circuit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="quantum-panel neon-border"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="public-circuit">Make Public</Label>
            <p className="text-xs text-muted-foreground">
              Allow others to view and use this circuit
            </p>
          </div>
          <Switch
            id="public-circuit"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="neon-border"
        >
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Circuit
        </Button>
      </DialogFooter>
    </>
  );
}
