import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
}

export const GatePalette = memo(function GatePalette({ onGateMouseDown }: GatePaletteProps) {
  const gateTypes = [
    // === 🟩 SINGLE-QUBIT GATES ===
    { type: 'I', name: 'Identity', color: 'bg-slate-400', description: 'Identity gate - no change to qubit state', category: 'Single' },
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Creates superposition - transforms |0⟩ to (|0⟩ + |1⟩)/√2', category: 'Single' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip gate - transforms |0⟩ ↔ |1⟩', category: 'Single' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Y rotation gate - bit and phase flip', category: 'Single' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip gate - applies -1 phase to |1⟩', category: 'Single' },
    { type: 'S', name: 'Phase S', color: 'bg-blue-500', description: 'Phase gate - applies i phase to |1⟩ (π/2)', category: 'Single' },
    { type: 'SDG', name: 'S†', color: 'bg-blue-400', description: 'S dagger - applies -i phase to |1⟩ (-π/2)', category: 'Single' },
    { type: 'T', name: 'T Gate', color: 'bg-cyan-500', description: 'T gate - applies e^(iπ/4) phase to |1⟩', category: 'Single' },
    { type: 'TDG', name: 'T†', color: 'bg-cyan-400', description: 'T dagger - applies e^(-iπ/4) phase to |1⟩', category: 'Single' },
    
    // === 🟦 PARAMETRIC ROTATION GATES ===
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy', description: 'Rotation around X-axis by angle θ', category: 'Parametric' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary', description: 'Rotation around Y-axis by angle θ', category: 'Parametric' },
    { type: 'RZ', name: 'Rotation-Z', color: 'bg-orange-500', description: 'Rotation around Z-axis by angle θ', category: 'Parametric' },
    { type: 'U1', name: 'U1(λ)', color: 'bg-indigo-500', description: 'Single parameter gate U1(λ)', category: 'Parametric' },
    { type: 'U2', name: 'U2(φ,λ)', color: 'bg-indigo-600', description: 'Two parameter gate U2(φ,λ)', category: 'Parametric' },
    { type: 'U3', name: 'U3(θ,φ,λ)', color: 'bg-indigo-700', description: 'Universal 3-parameter gate', category: 'Parametric' },
    
    // === 🟨 MULTI-QUBIT GATES ===
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT - flips target if control is |1⟩', category: 'Multi' },
    { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z - applies Z to target if control is |1⟩', category: 'Multi' },
    { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swaps states of two qubits', category: 'Multi' },
    { type: 'TOFFOLI', name: 'Toffoli', color: 'bg-pink-500', description: 'CCX gate - controlled-controlled-X', category: 'Multi' },
    { type: 'FREDKIN', name: 'Fredkin', color: 'bg-yellow-500', description: 'CSWAP - controlled swap gate', category: 'Multi' },
    
    // === 🟪 SPECIAL/COMPOSITE GATES ===
    { type: 'QFT', name: 'QFT', color: 'bg-violet-600', description: 'Quantum Fourier Transform', category: 'Composite' },
    { type: 'M', name: 'Measure', color: 'bg-destructive', description: 'Measurement gate - collapses superposition', category: 'Special' },
    { type: 'RESET', name: 'Reset', color: 'bg-gray-600', description: 'Reset qubit to |0⟩ state', category: 'Special' },
    { type: 'BARRIER', name: 'Barrier', color: 'bg-amber-500', description: 'Circuit barrier - no operation', category: 'Special' },
  ];

  // Group gates by category
  const groupedGates = gateTypes.reduce((acc, gate) => {
    if (!acc[gate.category]) {
      acc[gate.category] = [];
    }
    acc[gate.category].push(gate);
    return acc;
  }, {} as Record<string, typeof gateTypes>);

  const categoryIcons = {
    'Single': '🟩',
    'Parametric': '🟦', 
    'Multi': '🟨',
    'Composite': '🟪',
    'Special': '⚡'
  };

  const categoryOrder = ['Single', 'Parametric', 'Multi', 'Composite', 'Special'];

  return (
    <div className="w-64 space-y-4 max-h-[600px] overflow-y-auto">
      <h3 className="text-sm font-mono text-quantum-neon mb-4 sticky top-0 bg-background">
        🎛️ Quantum Gate Palette
      </h3>
      
      {categoryOrder.map(category => {
        const gates = groupedGates[category] || [];
        if (gates.length === 0) return null;
        
        return (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              {categoryIcons[category]} {category} Gates
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {gates.map(gate => (
                <Tooltip key={gate.type}>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-12 h-12 ${gate.color} rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in fade-in`}
                      onMouseDown={(e) => onGateMouseDown(e, gate.type)}
                      style={{ animationDelay: `${gateTypes.indexOf(gate) * 50}ms` }}
                    >
                      {gate.type.length > 4 ? gate.type.slice(0, 3) : gate.type}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-semibold text-quantum-glow">{gate.name}</p>
                      <p className="text-xs text-muted-foreground">{gate.description}</p>
                      <div className="text-xs text-quantum-particle border-t pt-1">
                        Category: {category}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});