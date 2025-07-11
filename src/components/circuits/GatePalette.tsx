import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
}

export const GatePalette = memo(function GatePalette({ onGateMouseDown }: GatePaletteProps) {
  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Creates superposition - transforms |0⟩ to (|0⟩ + |1⟩)/√2' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip gate - transforms |0⟩ ↔ |1⟩' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip gate - applies -1 phase to |1⟩' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT - flips target if control is |1⟩' },
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy', description: 'Rotation around X-axis by angle θ' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary', description: 'Rotation around Y-axis by angle θ' },
    { type: 'M', name: 'Measure', color: 'bg-destructive', description: 'Measurement gate - collapses superposition' },
  ];

  return (
    <div className="w-52 space-y-3">
      <h3 className="text-sm font-mono text-quantum-neon mb-4">Gate Palette</h3>
      <div className="grid grid-cols-2 gap-3">
        {gateTypes.map(gate => (
          <Tooltip key={gate.type}>
            <TooltipTrigger asChild>
              <div
                className={`w-12 h-12 ${gate.color} rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in fade-in`}
                onMouseDown={(e) => onGateMouseDown(e, gate.type)}
                style={{ animationDelay: `${gateTypes.indexOf(gate) * 100}ms` }}
              >
                {gate.type}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-semibold text-quantum-glow">{gate.name}</p>
                <p className="text-xs text-muted-foreground">{gate.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
});