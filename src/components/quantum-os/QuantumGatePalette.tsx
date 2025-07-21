
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface QuantumGatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
}

const gateCategories = {
  single: {
    title: 'Single-Qubit Gates',
    icon: '🟢',
    gates: [
      { type: 'I', name: 'Identity', color: 'bg-slate-400', description: 'Identity gate - no operation' },
      { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip gate |0⟩ ↔ |1⟩' },
      { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500', description: 'Bit and phase flip' },
      { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip gate' },
      { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Superposition gate' },
      { type: 'S', name: 'Phase S', color: 'bg-blue-500', description: 'π/2 phase gate' },
      { type: 'T', name: 'T Gate', color: 'bg-cyan-500', description: 'π/4 phase gate' },
    ]
  },
  rotation: {
    title: 'Rotation Gates',
    icon: '🔄',
    gates: [
      { type: 'RX', name: 'Rotation X', color: 'bg-quantum-energy', description: 'Rotation around X-axis' },
      { type: 'RY', name: 'Rotation Y', color: 'bg-orange-500', description: 'Rotation around Y-axis' },
      { type: 'RZ', name: 'Rotation Z', color: 'bg-yellow-500', description: 'Rotation around Z-axis' },
      { type: 'U1', name: 'U1 Gate', color: 'bg-pink-500', description: 'Single parameter rotation' },
      { type: 'U2', name: 'U2 Gate', color: 'bg-indigo-500', description: 'Two parameter rotation' },
      { type: 'U3', name: 'U3 Gate', color: 'bg-violet-500', description: 'General single-qubit gate' },
    ]
  },
  multi: {
    title: 'Multi-Qubit Gates',
    icon: '🔗',
    gates: [
      { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT gate' },
      { type: 'CZ', name: 'CZ', color: 'bg-red-500', description: 'Controlled Z gate' },
      { type: 'SWAP', name: 'SWAP', color: 'bg-green-500', description: 'Swap two qubits' },
      { type: 'TOFFOLI', name: 'Toffoli', color: 'bg-emerald-600', description: 'Controlled-controlled NOT' },
      { type: 'FREDKIN', name: 'Fredkin', color: 'bg-teal-600', description: 'Controlled SWAP' },
    ]
  },
  measurement: {
    title: 'Measurement & Special',
    icon: '📊',
    gates: [
      { type: 'M', name: 'Measure', color: 'bg-destructive', description: 'Measurement gate' },
      { type: 'BARRIER', name: 'Barrier', color: 'bg-amber-600', description: 'Circuit barrier' },
      { type: 'RESET', name: 'Reset', color: 'bg-gray-600', description: 'Reset qubit to |0⟩' },
    ]
  }
};

export function QuantumGatePalette({ onGateMouseDown, onGateTouchStart }: QuantumGatePaletteProps) {
  
  const handleGateInteraction = (gateType: string) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if ('touches' in e && onGateTouchStart) {
      onGateTouchStart(e as React.TouchEvent, gateType);
    } else if ('button' in e) {
      onGateMouseDown(e as React.MouseEvent, gateType);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
      {Object.entries(gateCategories).map(([categoryKey, category]) => (
        <div key={categoryKey} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-quantum-glow">
            <span>{category.icon}</span>
            <span>{category.title}</span>
            <Badge variant="outline" className="text-xs">
              {category.gates.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {category.gates.map((gate) => (
              <Tooltip key={gate.type}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative group cursor-pointer rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg quantum-glow select-none",
                      gate.color,
                      "h-12 w-full active:scale-95"
                    )}
                    onMouseDown={(e) => onGateMouseDown(e, gate.type)}
                    onTouchStart={onGateTouchStart ? (e) => onGateTouchStart(e, gate.type) : undefined}
                    style={{ 
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <div className="text-center">
                      <div className="font-bold">{gate.type}</div>
                      {gate.type.length > 3 && (
                        <div className="text-xs opacity-75">{gate.name.split(' ')[0]}</div>
                      )}
                    </div>
                    
                    {/* Drag indicator */}
                    <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </TooltipTrigger>
                
                <TooltipContent side="right" className="max-w-xs quantum-panel neon-border">
                  <div className="space-y-2">
                    <div className="font-semibold text-quantum-glow">{gate.name}</div>
                    <div className="text-xs text-quantum-particle">{gate.description}</div>
                    <div className="text-xs text-quantum-neon border-t border-quantum-matrix pt-2">
                      Drag to circuit to place
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          {categoryKey !== 'measurement' && <Separator className="bg-quantum-matrix" />}
        </div>
      ))}
    </div>
  );
}
