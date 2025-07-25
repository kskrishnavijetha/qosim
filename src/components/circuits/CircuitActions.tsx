
import React from 'react';
import { Undo, Trash2, FileText, Code, FileCode, Braces } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CircuitActionsProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onExportPython: () => void;
  onExportJavaScript: () => void;
  canUndo: boolean;
}

export function CircuitActions({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onExportPython,
  onExportJavaScript,
  canUndo
}: CircuitActionsProps) {
  console.log('CircuitActions rendered with handlers:', {
    onExportJSON: typeof onExportJSON,
    onExportQASM: typeof onExportQASM,
    onExportPython: typeof onExportPython,
    onExportJavaScript: typeof onExportJavaScript
  });

  const handleExportJSON = () => {
    console.log('Export JSON button clicked');
    if (onExportJSON) {
      onExportJSON();
    } else {
      console.error('onExportJSON handler is missing');
    }
  };

  const handleExportQASM = () => {
    console.log('Export QASM button clicked');
    if (onExportQASM) {
      onExportQASM();
    } else {
      console.error('onExportQASM handler is missing');
    }
  };

  const handleExportPython = () => {
    console.log('Export Python button clicked');
    if (onExportPython) {
      onExportPython();
    } else {
      console.error('onExportPython handler is missing');
    }
  };

  const handleExportJavaScript = () => {
    console.log('Export JavaScript button clicked');
    if (onExportJavaScript) {
      onExportJavaScript();
    } else {
      console.error('onExportJavaScript handler is missing');
    }
  };

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
        
        <Button onClick={onClear} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Export buttons row */}
      <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '300ms' }}>
        <Button 
          onClick={handleExportJSON} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-blue-500/10 hover:bg-blue-500/20"
          title="Export as JSON"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="text-sm">JSON</span>
        </Button>
        
        <Button 
          onClick={handleExportQASM} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-green-500/10 hover:bg-green-500/20"
          title="Export as OpenQASM"
        >
          <Code className="w-4 h-4 mr-2" />
          <span className="text-sm">QASM</span>
        </Button>
        
        <Button 
          onClick={handleExportPython} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-yellow-500/10 hover:bg-yellow-500/20"
          title="Export as Python"
        >
          <FileCode className="w-4 h-4 mr-2" />
          <span className="text-sm">Python</span>
        </Button>
        
        <Button 
          onClick={handleExportJavaScript} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-purple-500/10 hover:bg-purple-500/20"
          title="Export as JavaScript"
        >
          <Braces className="w-4 h-4 mr-2" />
          <span className="text-sm">JavaScript</span>
        </Button>
      </div>
    </div>
  );
}
