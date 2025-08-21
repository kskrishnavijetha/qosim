
import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GatePaletteProps {
  onGateSelect: (gateType: string, position: { x: number; y: number }) => void;
}

export const GatePalette = memo(function GatePalette({ onGateSelect }: GatePaletteProps) {
  const singleQubitGates = [
    { type: 'I', name: 'Identity', color: 'bg-slate-500', description: 'Identity gate - no change to qubit state' },
    { type: 'H', name: 'Hadamard', color: 'bg-purple-600', description: 'Creates superposition - transforms |0⟩ to (|0⟩ + |1⟩)/√2' },
    { type: 'X', name: 'Pauli-X', color: 'bg-cyan-500', description: 'Bit flip gate - transforms |0⟩ ↔ |1⟩' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Y rotation gate - bit and phase flip' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-purple-700', description: 'Phase flip gate - applies -1 phase to |1⟩' },
    { type: 'S', name: 'Phase S', color: 'bg-blue-600', description: 'Phase gate - applies i phase to |1⟩ (π/2)' },
    { type: 'Sdg', name: 'S Dagger', color: 'bg-blue-500', description: 'S† gate - inverse of S gate (-π/2)' },
    { type: 'T', name: 'T Gate', color: 'bg-cyan-600', description: 'T gate - applies e^(iπ/4) phase to |1⟩' },
    { type: 'Tdg', name: 'T Dagger', color: 'bg-cyan-500', description: 'T† gate - inverse of T gate (-π/8)' },
  ];

  const parametricGates = [
    { type: 'RX', name: 'Rotation-X', color: 'bg-cyan-400', description: 'Rotation around X-axis by angle θ' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-slate-500', description: 'Rotation around Y-axis by angle θ' },
    { type: 'RZ', name: 'Rotation-Z', color: 'bg-orange-500', description: 'Rotation around Z-axis by angle θ' },
    { type: 'Phase', name: 'Phase Gate', color: 'bg-indigo-500', description: 'Phase gate with arbitrary angle' },
    { type: 'U1', name: 'U1 Gate', color: 'bg-emerald-500', description: 'Single-parameter unitary gate' },
    { type: 'U2', name: 'U2 Gate', color: 'bg-emerald-600', description: 'Two-parameter unitary gate' },
    { type: 'U3', name: 'U3 Gate', color: 'bg-emerald-700', description: 'Three-parameter unitary gate' },
  ];

  const multiQubitGates = [
    { type: 'CNOT', name: 'CNOT', color: 'bg-purple-500', description: 'Controlled NOT - flips target if control is |1⟩' },
    { type: 'CX', name: 'CX', color: 'bg-purple-500', description: 'Controlled X gate (same as CNOT)' },
    { type: 'CY', name: 'CY', color: 'bg-purple-400', description: 'Controlled Y gate' },
    { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z - applies Z to target if control is |1⟩' },
    { type: 'CH', name: 'CH', color: 'bg-pink-500', description: 'Controlled Hadamard gate' },
    { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swaps states of two qubits' },
    { type: 'iSWAP', name: 'iSWAP', color: 'bg-green-400', description: 'Imaginary SWAP gate' },
  ];

  const controlledRotationGates = [
    { type: 'CRX', name: 'CRX', color: 'bg-teal-500', description: 'Controlled rotation X' },
    { type: 'CRY', name: 'CRY', color: 'bg-teal-600', description: 'Controlled rotation Y' },
    { type: 'CRZ', name: 'CRZ', color: 'bg-teal-700', description: 'Controlled rotation Z' },
    { type: 'CU1', name: 'CU1', color: 'bg-violet-500', description: 'Controlled U1 gate' },
    { type: 'CU3', name: 'CU3', color: 'bg-violet-600', description: 'Controlled U3 gate' },
  ];

  const multiQubitRotationGates = [
    { type: 'RXX', name: 'RXX', color: 'bg-amber-500', description: 'Two-qubit XX rotation' },
    { type: 'RYY', name: 'RYY', color: 'bg-amber-600', description: 'Two-qubit YY rotation' },
    { type: 'RZZ', name: 'RZZ', color: 'bg-amber-700', description: 'Two-qubit ZZ rotation' },
  ];

  const multiControlledGates = [
    { type: 'CCX', name: 'Toffoli', color: 'bg-rose-500', description: 'Controlled-controlled X (Toffoli gate)' },
    { type: 'CSWAP', name: 'Fredkin', color: 'bg-rose-600', description: 'Controlled SWAP (Fredkin gate)' },
  ];

  const specialGates = [
    { type: 'M', name: 'Measure', color: 'bg-red-600', description: 'Measurement gate - collapses superposition' },
    { type: 'RESET', name: 'Reset', color: 'bg-orange-600', description: 'Reset qubit to |0⟩ state' },
    { type: 'BARRIER', name: 'Barrier', color: 'bg-amber-500', description: 'Circuit barrier - no operation' },
  ];

  const handleGateClick = (gateType: string) => {
    onGateSelect(gateType, { x: 100, y: 100 });
  };

  const renderGateSection = (title: string, gates: typeof singleQubitGates, titleColor: string = 'text-muted-foreground') => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", gates[0]?.color)} />
        <h4 className={cn("text-xs font-semibold", titleColor)}>{title}</h4>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {gates.map(gate => (
          <Tooltip key={gate.type}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-12 flex flex-col items-center justify-center p-2 border-2 transition-all hover:scale-105",
                  gate.color.replace('bg-', 'border-'),
                  "hover:shadow-lg"
                )}
                onClick={() => handleGateClick(gate.type)}
              >
                <div className="text-xs font-bold text-foreground">
                  {gate.type === 'BARRIER' ? 'BAR' : gate.type}
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold text-primary">{gate.name}</p>
                <p className="text-xs text-muted-foreground">{gate.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      <div className="sticky top-0 bg-background border-b border-border pb-2">
        <h3 className="font-mono text-sm text-foreground flex items-center gap-2">
          🎛️ Quantum Gate Library
          <Badge variant="secondary" className="text-xs">
            Complete Set
          </Badge>
        </h3>
      </div>
      
      {renderGateSection("Single Qubit Gates", singleQubitGates)}
      {renderGateSection("Parametric Gates", parametricGates, "text-blue-400")}
      {renderGateSection("Two Qubit Gates", multiQubitGates, "text-green-400")}
      {renderGateSection("Controlled Rotations", controlledRotationGates, "text-teal-400")}
      {renderGateSection("Multi-Qubit Rotations", multiQubitRotationGates, "text-amber-400")}
      {renderGateSection("Multi-Controlled", multiControlledGates, "text-rose-400")}
      {renderGateSection("Special Operations", specialGates, "text-red-400")}
    </div>
  );
});
