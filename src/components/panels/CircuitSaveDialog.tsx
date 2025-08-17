
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCircuits } from "@/hooks/useCircuits";
import { useCircuitState } from "@/hooks/useCircuitState";
import { CircuitPrivacyWarning } from "@/components/security/CircuitPrivacyWarning";
import { Loader2 } from "lucide-react";

interface CircuitSaveDialogProps {
  onClose: () => void;
}

export function CircuitSaveDialog({ onClose }: CircuitSaveDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState<'private' | 'authenticated_only' | 'public'>('private');
  const [saving, setSaving] = useState(false);
  const { saveCircuit } = useCircuits();
  const { circuit } = useCircuitState();

  const handleSave = async () => {
    if (!name.trim()) return;

    setSaving(true);
    try {
      await saveCircuit(name.trim(), circuit, description.trim() || undefined, privacyLevel);
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

        <div className="space-y-3">
          <Label>Privacy Settings</Label>
          <CircuitPrivacyWarning 
            privacyLevel={privacyLevel}
            onPrivacyChange={setPrivacyLevel}
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
