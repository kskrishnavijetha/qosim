import React from "react";

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
}

export function GatePalette({ onGateMouseDown }: GatePaletteProps) {
  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma' },
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary' },
    { type: 'M', name: 'Measure', color: 'bg-destructive' },
  ];

  return (
    <div className="w-48 space-y-2">
      <h3 className="text-sm font-mono text-quantum-neon mb-4">Gate Palette</h3>
      {gateTypes.map(gate => (
        <div
          key={gate.type}
          className={`w-12 h-12 ${gate.color} rounded border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-transform quantum-glow`}
          onMouseDown={(e) => onGateMouseDown(e, gate.type)}
          title={gate.name}
        >
          {gate.type}
        </div>
      ))}
    </div>
  );
}