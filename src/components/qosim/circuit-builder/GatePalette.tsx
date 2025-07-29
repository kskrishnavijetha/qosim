
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GatePaletteProps {
  onGateSelect: (gate: string) => void;
}

export function GatePalette({ onGateSelect }: GatePaletteProps) {
  const singleQubitGates = [
    { name: 'H', label: 'Hadamard', color: 'bg-blue-500' },
    { name: 'X', label: 'Pauli-X', color: 'bg-red-500' },
    { name: 'Y', label: 'Pauli-Y', color: 'bg-green-500' },
    { name: 'Z', label: 'Pauli-Z', color: 'bg-purple-500' },
    { name: 'S', label: 'S Gate', color: 'bg-yellow-500' },
    { name: 'T', label: 'T Gate', color: 'bg-pink-500' },
  ];

  const multiQubitGates = [
    { name: 'CNOT', label: 'CNOT', color: 'bg-indigo-500' },
    { name: 'CZ', label: 'CZ', color: 'bg-teal-500' },
    { name: 'SWAP', label: 'SWAP', color: 'bg-orange-500' },
    { name: 'TOFFOLI', label: 'Toffoli', color: 'bg-gray-500' },
  ];

  const parameterizedGates = [
    { name: 'RX', label: 'RX(θ)', color: 'bg-cyan-500' },
    { name: 'RY', label: 'RY(θ)', color: 'bg-lime-500' },
    { name: 'RZ', label: 'RZ(θ)', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Single-Qubit Gates</h3>
        <div className="grid grid-cols-2 gap-2">
          {singleQubitGates.map((gate) => (
            <Button
              key={gate.name}
              variant="outline"
              className="h-12 text-xs"
              onClick={() => onGateSelect(gate.name)}
            >
              <div className={`w-6 h-6 rounded ${gate.color} flex items-center justify-center text-white text-xs font-bold mr-2`}>
                {gate.name}
              </div>
              {gate.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Multi-Qubit Gates</h3>
        <div className="grid grid-cols-1 gap-2">
          {multiQubitGates.map((gate) => (
            <Button
              key={gate.name}
              variant="outline"
              className="h-12 text-xs"
              onClick={() => onGateSelect(gate.name)}
            >
              <div className={`w-6 h-6 rounded ${gate.color} flex items-center justify-center text-white text-xs font-bold mr-2`}>
                {gate.name}
              </div>
              {gate.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Parameterized Gates</h3>
        <div className="grid grid-cols-1 gap-2">
          {parameterizedGates.map((gate) => (
            <Button
              key={gate.name}
              variant="outline"
              className="h-12 text-xs"
              onClick={() => onGateSelect(gate.name)}
            >
              <div className={`w-6 h-6 rounded ${gate.color} flex items-center justify-center text-white text-xs font-bold mr-2`}>
                {gate.name}
              </div>
              {gate.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
