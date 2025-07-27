
import React, { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCustomGates } from "@/hooks/useCustomGates";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
}

export const GatePalette = memo(function GatePalette({ 
  onGateMouseDown, 
  onGateTouchStart 
}: GatePaletteProps) {
  const { customGates } = useCustomGates();
  const isMobile = useIsMobile();

  const gateTypes = [
    // Single-qubit gates
    { type: 'I', name: 'Identity', color: 'bg-slate-400', description: 'Identity gate - no change to qubit state', category: 'Single' },
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Creates superposition - transforms |0⟩ to (|0⟩ + |1⟩)/√2', category: 'Single' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip gate - transforms |0⟩ ↔ |1⟩', category: 'Single' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Y rotation gate - bit and phase flip', category: 'Single' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip gate - applies -1 phase to |1⟩', category: 'Single' },
    { type: 'S', name: 'Phase S', color: 'bg-blue-500', description: 'Phase gate - applies i phase to |1⟩ (π/2)', category: 'Single' },
    { type: 'T', name: 'T Gate', color: 'bg-cyan-500', description: 'T gate - applies e^(iπ/4) phase to |1⟩', category: 'Single' },
    
    // Parametric gates
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy', description: 'Rotation around X-axis by angle θ', category: 'Parametric' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary', description: 'Rotation around Y-axis by angle θ', category: 'Parametric' },
    { type: 'RZ', name: 'Rotation-Z', color: 'bg-orange-500', description: 'Rotation around Z-axis by angle θ', category: 'Parametric' },
    
    // Multi-qubit gates
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT - flips target if control is |1⟩', category: 'Multi' },
    { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z - applies Z to target if control is |1⟩', category: 'Multi' },
    { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swaps states of two qubits', category: 'Multi' },
    
    // Special gates
    { type: 'M', name: 'Measure', color: 'bg-destructive', description: 'Measurement gate - collapses superposition', category: 'Special' },
    { type: 'BARRIER', name: 'Barrier', color: 'bg-amber-500', description: 'Circuit barrier - no operation', category: 'Special' },
  ];

  // Add custom gates
  const customGateTypes = customGates.map(gate => ({
    type: gate.id,
    name: gate.name,
    color: 'bg-quantum-particle',
    description: gate.description || 'Custom unitary gate',
    category: 'Custom'
  }));

  const allGateTypes = [...gateTypes, ...customGateTypes];

  // Group gates by category
  const groupedGates = allGateTypes.reduce((acc, gate) => {
    if (!acc[gate.category]) {
      acc[gate.category] = [];
    }
    acc[gate.category].push(gate);
    return acc;
  }, {} as Record<string, typeof allGateTypes>);

  const categoryIcons = {
    'Single': '🟩',
    'Parametric': '🟦', 
    'Multi': '🟨',
    'Special': '⚡',
    'Custom': '🔧'
  };

  const categoryOrder = ['Single', 'Parametric', 'Multi', 'Special', 'Custom'];

  const handleGateInteraction = (gate: typeof gateTypes[0]) => (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && onGateTouchStart) {
      onGateTouchStart(e as React.TouchEvent, gate.type);
    } else if ('button' in e) {
      onGateMouseDown(e as React.MouseEvent, gate.type);
    }
  };

  return (
    <div className={cn(
      "space-y-4 overflow-y-auto",
      isMobile ? "w-full max-h-64" : "w-64 max-h-[600px]"
    )}>
      <h3 className={cn(
        "font-mono text-quantum-neon sticky top-0 bg-background",
        isMobile ? "text-xs mb-2" : "text-sm mb-4"
      )}>
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
            <div className={cn(
              "grid gap-2",
              isMobile ? "grid-cols-4" : "grid-cols-3"
            )}>
              {gates.map(gate => (
                <Tooltip key={gate.type}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        `${gate.color} rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer transition-all duration-300 quantum-glow animate-in fade-in select-none`,
                        isMobile 
                          ? "w-10 h-10 touch-manipulation active:scale-95" 
                          : "w-12 h-12 hover:scale-110"
                      )}
                      onMouseDown={!isMobile ? (e) => onGateMouseDown(e, gate.type) : undefined}
                      onTouchStart={isMobile && onGateTouchStart ? (e) => onGateTouchStart(e, gate.type) : undefined}
                      style={{ 
                        animationDelay: `${allGateTypes.indexOf(gate) * 50}ms`,
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none'
                      }}
                    >
                      {gate.type.length > 4 ? gate.type.slice(0, 3) : gate.type}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side={isMobile ? "top" : "right"} className="max-w-xs">
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
