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
  const handlePlay = () => {
    console.log('Play button clicked');
    if (onPlay) {
      onPlay();
    }
  };

  const handleEdit = () => {
    console.log('Edit button clicked');
    if (onEdit) {
      onEdit();
    }
  };

  const handleCopy = () => {
    console.log('Copy button clicked');
    if (onCopy) {
      onCopy();
    }
  };

  const handleShare = () => {
    console.log('Share button clicked');
    if (onShare) {
      onShare();
    }
  };

  const handleDelete = () => {
    console.log('Delete button clicked');
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '200ms' }}>
      {/* Main action buttons */}
      <Button 
        onClick={handlePlay} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300"
      >
        <Play className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Play</span>
      </Button>
      
      <Button 
        onClick={handleEdit} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300"
      >
        <Edit className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Edit</span>
      </Button>
      
      <Button 
        onClick={handleCopy} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300"
      >
        <Copy className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Copy</span>
      </Button>
      
      <Button 
        onClick={handleShare} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300"
      >
        <Share2 className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Share</span>
      </Button>
      
      {/* Existing buttons */}
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
        onClick={handleDelete} 
        variant="outline" 
        className="neon-border hover:scale-105 transition-all duration-300 border-red-500/30 text-red-400 hover:bg-red-500/10"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Delete</span>
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
