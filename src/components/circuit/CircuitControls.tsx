
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Undo, 
  Redo, 
  Trash2, 
  Play, 
  Plus, 
  Minus, 
  Zap,
  Keyboard,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface CircuitControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSimulate: () => void;
  onOptimize: () => void;
  onAddQubit: () => void;
  onRemoveQubit: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSimulating: boolean;
  qubitCount: number;
}

export function CircuitControls({
  onUndo,
  onRedo,
  onClear,
  onSimulate,
  onOptimize,
  onAddQubit,
  onRemoveQubit,
  canUndo,
  canRedo,
  isSimulating,
  qubitCount
}: CircuitControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* History Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4 mr-1" />
          Redo
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Qubit Controls */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Qubits:</span>
        <Badge variant="secondary">{qubitCount}</Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={onAddQubit}
          title="Add Qubit"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onRemoveQubit}
          disabled={qubitCount <= 1}
          title="Remove Qubit"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Simulation Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          onClick={onSimulate}
          disabled={isSimulating}
          title="Simulate Circuit (Ctrl+R)"
        >
          <Play className="w-4 h-4 mr-1" />
          {isSimulating ? 'Simulating...' : 'Simulate'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onOptimize}
          title="Optimize Circuit (AI)"
        >
          <Zap className="w-4 h-4 mr-1" />
          Optimize
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Utility Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onClear}
          title="Clear Circuit (Ctrl+Alt+C)"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Keyboard Shortcuts Indicator */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Keyboard className="w-3 h-3" />
        <span>Shortcuts available</span>
      </div>
    </div>
  );
}
