
import React, { forwardRef } from 'react';
import { type QuantumGate } from '@/types/qosim';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantumCanvasProps {
  circuit: QuantumGate[];
  selectedGateType: string | null;
  zoom: number;
  pan: { x: number; y: number };
  onCanvasClick: (position: { x: number; y: number }) => void;
  onGateSelect: (gateId: string) => void;
  onGateRemove: (gateId: string) => void;
  onGateUpdate: (gateId: string, updates: Partial<QuantumGate>) => void;
}

export const QuantumCanvas = forwardRef<HTMLDivElement, QuantumCanvasProps>(
  ({ circuit, selectedGateType, zoom, pan, onCanvasClick, onGateSelect, onGateRemove, onGateUpdate }, ref) => {
    const numQubits = 4;
    const qubitLines = Array.from({ length: numQubits }, (_, i) => i);

    const handleCanvasClick = (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onCanvasClick({ x, y });
    };

    return (
      <div
        ref={ref}
        className="relative bg-black/50 border border-white/10 rounded-lg overflow-hidden"
        style={{ height: '400px', transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
        onClick={handleCanvasClick}
      >
        {/* Qubit Lines */}
        {qubitLines.map(qubit => (
          <div
            key={qubit}
            className="absolute border-t border-cyan-400/50"
            style={{
              top: `${80 + qubit * 60}px`,
              left: '40px',
              right: '40px',
              height: '1px'
            }}
          >
            <span className="absolute -left-8 -top-3 text-sm text-cyan-400">
              q{qubit}
            </span>
          </div>
        ))}

        {/* Gates */}
        {circuit.map(gate => (
          <div
            key={gate.id}
            className="absolute group"
            style={{
              left: `${gate.position.x}px`,
              top: `${gate.position.y + 70}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="w-12 h-8 bg-blue-600 border border-white/20 rounded flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-blue-500">
                {gate.type}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onGateRemove(gate.id);
                }}
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {/* Selection Hint */}
        {selectedGateType && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            Click to place {selectedGateType} gate
          </div>
        )}
      </div>
    );
  }
);

QuantumCanvas.displayName = 'QuantumCanvas';
