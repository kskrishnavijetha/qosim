import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { Gate } from "@/hooks/useCircuitWorkspace";

interface GateParameterInputProps {
  gate: Gate;
  onUpdateGate: (updatedGate: Gate) => void;
}

export function GateParameterInput({ gate, onUpdateGate }: GateParameterInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localAngle, setLocalAngle] = useState(gate.angle?.toString() || "0.785"); // π/4 default
  const [localParams, setLocalParams] = useState(
    gate.params ? gate.params.map(p => p.toString()) : []
  );

  const needsParameters = () => {
    const parametricGates = ['RX', 'RY', 'RZ', 'U1', 'U2', 'U3'];
    return parametricGates.includes(gate.type);
  };

  const getParameterLabels = () => {
    switch (gate.type) {
      case 'RX':
      case 'RY':
      case 'RZ':
      case 'U1':
        return ['θ (angle)'];
      case 'U2':
        return ['φ (phi)', 'λ (lambda)'];
      case 'U3':
        return ['θ (theta)', 'φ (phi)', 'λ (lambda)'];
      default:
        return [];
    }
  };

  const handleSave = () => {
    const updatedGate = { ...gate };
    
    if (['RX', 'RY', 'RZ', 'U1'].includes(gate.type)) {
      updatedGate.angle = parseFloat(localAngle) || 0;
    } else if (['U2', 'U3'].includes(gate.type)) {
      updatedGate.params = localParams.map(p => parseFloat(p) || 0);
    }
    
    onUpdateGate(updatedGate);
    setIsOpen(false);
  };

  const formatAngleDisplay = (angle?: number) => {
    if (angle === undefined) return '';
    const normalized = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (Math.abs(normalized - Math.PI/4) < 0.01) return 'π/4';
    if (Math.abs(normalized - Math.PI/2) < 0.01) return 'π/2';
    if (Math.abs(normalized - Math.PI) < 0.01) return 'π';
    if (Math.abs(normalized - 3*Math.PI/2) < 0.01) return '3π/2';
    if (Math.abs(normalized - 2*Math.PI) < 0.01) return '2π';
    return normalized.toFixed(3);
  };

  if (!needsParameters()) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          className="absolute -top-6 -right-6 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-quantum-glow">⚙️</span>
            Configure {gate.type} Gate Parameters
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {gate.type === 'U1' || ['RX', 'RY', 'RZ'].includes(gate.type) ? (
            <div className="space-y-2">
              <Label htmlFor="angle">Angle (radians)</Label>
              <Input
                id="angle"
                type="number"
                step="0.1"
                value={localAngle}
                onChange={(e) => setLocalAngle(e.target.value)}
                placeholder="Enter angle in radians"
              />
              <div className="text-xs text-muted-foreground">
                Current: {formatAngleDisplay(gate.angle)} | Common: π/4≈0.785, π/2≈1.571, π≈3.142
              </div>
            </div>
          ) : (
            getParameterLabels().map((label, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`param-${index}`}>{label}</Label>
                <Input
                  id={`param-${index}`}
                  type="number"
                  step="0.1"
                  value={localParams[index] || "0"}
                  onChange={(e) => {
                    const newParams = [...localParams];
                    newParams[index] = e.target.value;
                    setLocalParams(newParams);
                  }}
                  placeholder={`Enter ${label.split(' ')[0]}`}
                />
              </div>
            ))
          )}
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Apply Parameters
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Gate Info:</strong> {getGateDescription(gate.type)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getGateDescription(gateType: string): string {
  switch (gateType) {
    case 'RX': return 'Rotation around X-axis. Controls qubit spin around X.';
    case 'RY': return 'Rotation around Y-axis. Controls qubit spin around Y.';
    case 'RZ': return 'Rotation around Z-axis. Applies phase rotation.';
    case 'U1': return 'Single-parameter gate: U1(λ) applies phase λ to |1⟩.';
    case 'U2': return 'Two-parameter gate: U2(φ,λ) = RZ(λ)RY(π/2)RZ(φ).';
    case 'U3': return 'Universal gate: U3(θ,φ,λ) can represent any single-qubit operation.';
    default: return 'Parametric quantum gate.';
  }
}
