
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, Undo, Redo, Download, Upload, Settings, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkspaceToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasActiveCircuit: boolean;
}

export function WorkspaceToolbar({
  onSave,
  onUndo,
  onRedo,
  onExport,
  canUndo,
  canRedo,
  hasActiveCircuit
}: WorkspaceToolbarProps) {
  
  return (
    <div className="flex items-center gap-2">
      {/* File Operations */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        disabled={!hasActiveCircuit}
        className="text-quantum-neon hover:bg-quantum-void"
      >
        <Save className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 bg-quantum-matrix" />

      {/* Edit Operations */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className={cn(
          "text-quantum-neon hover:bg-quantum-void",
          !canUndo && "opacity-50 cursor-not-allowed"
        )}
      >
        <Undo className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onRedo}
        disabled={!canRedo}
        className={cn(
          "text-quantum-neon hover:bg-quantum-void",
          !canRedo && "opacity-50 cursor-not-allowed"
        )}
      >
        <Redo className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 bg-quantum-matrix" />

      {/* Export Operations */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onExport}
        disabled={!hasActiveCircuit}
        className="text-quantum-neon hover:bg-quantum-void"
      >
        <Download className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-quantum-neon hover:bg-quantum-void"
      >
        <Upload className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 bg-quantum-matrix" />

      {/* Settings */}
      <Button
        variant="ghost"
        size="sm"
        className="text-quantum-neon hover:bg-quantum-void"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
}
