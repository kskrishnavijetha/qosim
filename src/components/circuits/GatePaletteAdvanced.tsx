import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface GateInfo {
  type: string;
  name: string;
  description: string;
  color: string;
}

interface GatePaletteAdvancedProps {
  onGateSelect: (gateType: string, qubits: string[], position: { x: number; y: number }) => void;
  onQubitAdd?: () => void;
  selectedGate?: any;
  onMouseDown?: (e: React.MouseEvent, gateType: string) => void;
  onTouchStart?: (e: React.TouchEvent, gateType: string) => void;
}

export function GatePaletteAdvanced({ 
  onGateSelect, 
  onQubitAdd, 
  selectedGate,
  onMouseDown,
  onTouchStart
}: GatePaletteAdvancedProps) {
  const [gates, setGates] = useState<GateInfo[]>([
    { type: 'H', name: 'Hadamard', description: 'Creates superposition', color: 'bg-purple-600' },
    { type: 'X', name: 'Pauli-X', description: 'Bit-flip', color: 'bg-cyan-500' },
    { type: 'Y', name: 'Pauli-Y', description: 'Bit- and phase-flip', color: 'bg-purple-500' },
    { type: 'Z', name: 'Pauli-Z', description: 'Phase-flip', color: 'bg-purple-700' },
    { type: 'S', name: 'S Gate', description: 'Phase gate', color: 'bg-blue-600' },
    { type: 'T', name: 'T Gate', description: 'π/4 phase gate', color: 'bg-cyan-600' },
    { type: 'RX', name: 'RX', description: 'Rotation around X-axis', color: 'bg-cyan-400' },
    { type: 'RY', name: 'RY', description: 'Rotation around Y-axis', color: 'bg-slate-500' },
    { type: 'RZ', name: 'RZ', description: 'Rotation around Z-axis', color: 'bg-orange-500' },
    { type: 'CNOT', name: 'CNOT', description: 'Controlled-NOT', color: 'bg-purple-500' },
    { type: 'SWAP', name: 'SWAP', description: 'Swaps two qubits', color: 'bg-green-500' },
    { type: 'BARRIER', name: 'Barrier', description: 'Prevents optimization', color: 'bg-amber-500' }
  ]);

  const handleGateClick = useCallback((gateType: string) => {
    // For click events, add to position 0,0 by default
    onGateSelect(gateType, [], { x: 0, y: 0 });
  }, [onGateSelect]);

  const renderGateButton = (gate: GateInfo) => (
    <Button
      key={gate.type}
      variant={selectedGate?.type === gate.type ? "default" : "outline"}
      size="sm"
      className={`justify-start text-left h-auto p-2 ${gate.color} hover:scale-105 transition-all duration-200`}
      onClick={() => handleGateClick(gate.type)}
      onMouseDown={onMouseDown ? (e) => onMouseDown(e, gate.type) : undefined}
      onTouchStart={onTouchStart ? (e) => onTouchStart(e, gate.type) : undefined}
      title={gate.description}
    >
      <div className="flex flex-col items-start w-full">
        <div className="font-mono font-bold text-sm">{gate.type}</div>
        <div className="text-xs opacity-75 truncate w-full">{gate.name}</div>
      </div>
    </Button>
  );

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <h4 className="font-semibold text-sm">Quantum Gates</h4>
        <p className="text-xs text-muted-foreground">
          Drag and drop gates onto the circuit.
        </p>
      </div>

      <div className="grid gap-2 mb-4">
        {gates.map(renderGateButton)}
      </div>

      <div className="mt-auto flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onQubitAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Qubit
        </Button>
      </div>
    </div>
  );
}
