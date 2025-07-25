
import React from 'react';
import { Undo, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportButton } from './ExportButton';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  label?: string;
  comment?: string;
}

interface CircuitActionsProps {
  circuit: Gate[];
  numQubits: number;
  onUndo: () => void;
  onClear: () => void;
  canUndo: boolean;
  circuitName?: string;
}

export function CircuitActions({
  circuit,
  numQubits,
  onUndo,
  onClear,
  canUndo,
  circuitName = 'quantum_circuit'
}: CircuitActionsProps) {
  return (
    <div className="space-y-3">
      {/* Main action buttons row */}
      <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '200ms' }}>
        <Button 
          onClick={onUndo} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300"
          disabled={!canUndo}
        >
          <Undo className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Undo</span>
        </Button>
        
        <Button 
          onClick={onClear} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Export button row */}
      <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '300ms' }}>
        <ExportButton 
          circuit={circuit}
          numQubits={numQubits}
          circuitName={circuitName}
          className="bg-quantum-plasma/10 hover:bg-quantum-plasma/20 text-quantum-glow"
        />
      </div>
    </div>
  );
}
