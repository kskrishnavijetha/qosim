
import React from 'react';
import { Undo, Download, Trash2, FileDown, Play, Edit, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CircuitActionsProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onShowExportDialog: () => void;
  onPlay?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  canUndo: boolean;
}

export function CircuitActions({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onShowExportDialog,
  onPlay,
  onEdit,
  onCopy,
  onShare,
  onDelete,
  canUndo
}: CircuitActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '200ms' }}>
      {/* Main action buttons */}
      {onPlay && (
        <Button 
          onClick={onPlay} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-quantum-glow/10 hover:bg-quantum-glow/20"
        >
          <Play className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Play</span>
        </Button>
      )}
      
      {onEdit && (
        <Button 
          onClick={onEdit} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-quantum-energy/10 hover:bg-quantum-energy/20"
        >
          <Edit className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      )}
      
      {onCopy && (
        <Button 
          onClick={onCopy} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-quantum-particle/10 hover:bg-quantum-particle/20"
        >
          <Copy className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Copy</span>
        </Button>
      )}
      
      {onShare && (
        <Button 
          onClick={onShare} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 bg-quantum-neon/10 hover:bg-quantum-neon/20"
        >
          <Share2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
      
      {/* Circuit control buttons */}
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
      
      {onDelete && (
        <Button 
          onClick={onDelete} 
          variant="outline" 
          className="neon-border hover:scale-105 transition-all duration-300 border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      )}
      
      {/* Export buttons */}
      <Button 
        onClick={onExportJSON} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300"
      >
        <Download className="w-4 h-4 mr-2" />
        JSON
      </Button>
      
      <Button 
        onClick={onExportQASM} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300"
      >
        <Download className="w-4 h-4 mr-2" />
        QASM
      </Button>
      
      <Button 
        onClick={onShowExportDialog} 
        className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow"
      >
        <FileDown className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Advanced Export</span>
      </Button>
    </div>
  );
}
