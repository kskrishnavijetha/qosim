import React from 'react';
import { Undo, Download, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CircuitActionsProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onShowExportDialog: () => void;
  canUndo: boolean;
}

export function CircuitActions({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onShowExportDialog,
  canUndo
}: CircuitActionsProps) {
  return (
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
      <Button onClick={onClear} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
        <Trash2 className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Clear</span>
      </Button>
      <Button onClick={onExportJSON} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
        <Download className="w-4 h-4 mr-2" />
        JSON
      </Button>
      <Button onClick={onExportQASM} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
        <Download className="w-4 h-4 mr-2" />
        QASM
      </Button>
      <Button onClick={onShowExportDialog} className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
        <FileDown className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Advanced Export</span>
      </Button>
    </div>
  );
}