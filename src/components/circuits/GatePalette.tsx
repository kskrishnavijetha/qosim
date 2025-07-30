
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

  const singleQubitGates = [
    { type: 'I', name: 'Identity', color: 'bg-slate-500', description: 'Identity gate - no change to qubit state' },
    { type: 'H', name: 'Hadamard', color: 'bg-purple-600', description: 'Creates superposition - transforms |0⟩ to (|0⟩ + |1⟩)/√2' },
    { type: 'X', name: 'Pauli-X', color: 'bg-cyan-500', description: 'Bit flip gate - transforms |0⟩ ↔ |1⟩' },
    { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Y rotation gate - bit and phase flip' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-purple-700', description: 'Phase flip gate - applies -1 phase to |1⟩' },
    { type: 'S', name: 'Phase S', color: 'bg-blue-600', description: 'Phase gate - applies i phase to |1⟩ (π/2)' },
    { type: 'T', name: 'T Gate', color: 'bg-cyan-600', description: 'T gate - applies e^(iπ/4) phase to |1⟩' },
  ];

  const parametricGates = [
    { type: 'RX', name: 'Rotation-X', color: 'bg-cyan-400', description: 'Rotation around X-axis by angle θ' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-slate-500', description: 'Rotation around Y-axis by angle θ' },
    { type: 'RZ', name: 'Rotation-Z', color: 'bg-orange-500', description: 'Rotation around Z-axis by angle θ' },
  ];

  const multiQubitGates = [
    { type: 'CNOT', name: 'CNOT', color: 'bg-purple-500', description: 'Controlled NOT - flips target if control is |1⟩' },
    { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z - applies Z to target if control is |1⟩' },
    { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swaps states of two qubits' },
  ];

  const specialGates = [
    { type: 'M', name: 'Measure', color: 'bg-red-600', description: 'Measurement gate - collapses superposition' },
    { type: 'BARRIER', name: 'Barrier', color: 'bg-amber-500', description: 'Circuit barrier - no operation' },
  ];

  const handleMouseDown = (e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    e.stopPropagation();
    onGateMouseDown(e, gateType);
  };

  const handleTouchStart = (e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onGateTouchStart) {
      onGateTouchStart(e, gateType);
    }
  };

  const renderGateSection = (title: string, gates: typeof singleQubitGates, titleColor: string = 'text-muted-foreground') => (
    <div className="space-y-3">
      <h4 className={cn("text-xs font-semibold flex items-center gap-1", titleColor)}>
        ■ {title}
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
                  `${gate.color} rounded-lg border-2 border-transparent flex items-center justify-center font-bold text-white cursor-pointer transition-all duration-200 select-none shadow-md`,
                  isMobile 
                    ? "w-12 h-12 text-xs touch-manipulation active:scale-95" 
                    : "w-14 h-14 text-sm hover:scale-105 hover:shadow-lg"
                )}
                onMouseDown={(e) => handleMouseDown(e, gate.type)}
                onTouchStart={(e) => handleTouchStart(e, gate.type)}
                style={{ 
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  touchAction: 'none'
                }}
              >
                {gate.type === 'BARRIER' ? 'BAR' : gate.type}
              </div>
            </TooltipTrigger>
            <TooltipContent side={isMobile ? "top" : "right"} className="max-w-xs">
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

  return (
    <div className={cn(
      "bg-background border border-border rounded-lg p-4 space-y-6 overflow-y-auto",
      isMobile ? "w-full max-h-80" : "w-64 max-h-[600px]"
    )}>
      <h3 className={cn(
        "font-mono text-foreground sticky top-0 bg-background border-b border-border pb-2",
        isMobile ? "text-sm" : "text-base"
      )}>
        🎛️ Quantum Gates
      </h3>
      
      {renderGateSection("Single Qubit Gates", singleQubitGates)}
      {renderGateSection("Parametric Gates", parametricGates, "text-blue-400")}
      {renderGateSection("Multi Gates", multiQubitGates, "text-green-400")}
      {renderGateSection("Special Gates", specialGates, "text-yellow-400")}
    </div>
  );
});
