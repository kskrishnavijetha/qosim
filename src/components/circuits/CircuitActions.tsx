
import React from 'react';
import { Undo, Download, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FunctionDebugger } from "@/components/FunctionDebugger";

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
  const handleUndo = () => {
    console.log('CircuitActions: Undo clicked');
    try {
      onUndo();
    } catch (error) {
      console.error('CircuitActions: Undo failed:', error);
    }
  };

  const handleClear = () => {
    console.log('CircuitActions: Clear clicked');
    try {
      onClear();
    } catch (error) {
      console.error('CircuitActions: Clear failed:', error);
    }
  };

  const handleExportJSON = () => {
    console.log('CircuitActions: Export JSON clicked');
    try {
      onExportJSON();
    } catch (error) {
      console.error('CircuitActions: Export JSON failed:', error);
    }
  };

  const handleExportQASM = () => {
    console.log('CircuitActions: Export QASM clicked');
    try {
      onExportQASM();
    } catch (error) {
      console.error('CircuitActions: Export QASM failed:', error);
    }
  };

  const handleShowExportDialog = () => {
    console.log('CircuitActions: Show export dialog clicked');
    try {
      onShowExportDialog();
    } catch (error) {
      console.error('CircuitActions: Show export dialog failed:', error);
    }
  };

  return (
    <>
      <FunctionDebugger 
        component="CircuitActions" 
        functions={{
          onUndo,
          onClear,
          onExportJSON,
          onExportQASM,
          onShowExportDialog
        }}
      />
      <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '200ms' }}>
        <Button 
          onClick={handleUndo} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300"
          disabled={!canUndo}
        >
          <Undo className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Undo</span>
        </Button>
        <Button onClick={handleClear} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
        <Button onClick={handleExportJSON} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
          <Download className="w-4 h-4 mr-2" />
          JSON
        </Button>
        <Button onClick={handleExportQASM} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
          <Download className="w-4 h-4 mr-2" />
          QASM
        </Button>
        <Button onClick={handleShowExportDialog} className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
          <FileDown className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Advanced Export</span>
        </Button>
      </div>
    </>
  );
}
