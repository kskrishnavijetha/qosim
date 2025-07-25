
import React, { useState } from 'react';
import { Undo, Download, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportFormatSelector } from "@/components/dialogs/export/ExportFormatSelector";

interface CircuitActionsProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onExportPython: () => void;
  onExportJavaScript: () => void;
  onShowExportDialog: () => void;
  canUndo: boolean;
}

export function CircuitActions({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onExportPython,
  onExportJavaScript,
  onShowExportDialog,
  canUndo
}: CircuitActionsProps) {
  const [showExportSelector, setShowExportSelector] = useState(false);

  const handleExportClick = () => {
    console.log('Export button clicked, opening dialog');
    setShowExportSelector(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    console.log('Dialog open state changed:', open);
    setShowExportSelector(open);
  };

  const handleExportAction = (exportFn: () => void, type: string) => {
    console.log(`${type} export triggered`);
    exportFn();
    setShowExportSelector(false);
  };

  return (
    <>
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
        <Button 
          onClick={handleExportClick} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-blue-50 hover:bg-blue-100 border-blue-300"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button onClick={onShowExportDialog} className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
          <FileDown className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Advanced Export</span>
        </Button>
      </div>

      <ExportFormatSelector
        open={showExportSelector}
        onOpenChange={handleDialogOpenChange}
        onExportJSON={() => handleExportAction(onExportJSON, 'JSON')}
        onExportQASM={() => handleExportAction(onExportQASM, 'QASM')}
        onExportPython={() => handleExportAction(onExportPython, 'Python')}
        onExportJavaScript={() => handleExportAction(onExportJavaScript, 'JavaScript')}
      />
    </>
  );
}
