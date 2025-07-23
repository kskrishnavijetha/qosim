
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCircuitStore } from '@/store/circuitStore';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  Copy, 
  Paste, 
  Settings,
  Keyboard,
  Play,
  Pause,
  Square
} from 'lucide-react';

export function Toolbar() {
  const { 
    gates,
    selectedGate,
    clipboard,
    undo,
    redo,
    canUndo,
    canRedo,
    clearCircuit,
    copyGate,
    removeGate
  } = useCircuitStore();

  const handleCopy = () => {
    if (selectedGate) {
      copyGate(selectedGate);
    }
  };

  const handleDelete = () => {
    if (selectedGate) {
      removeGate(selectedGate.id);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* History Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Edit Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!selectedGate}
              title="Copy (Ctrl+C)"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!clipboard}
              title="Paste (Ctrl+V)"
            >
              <Paste className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={!selectedGate}
              title="Delete (Del)"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Circuit Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCircuit}
              title="Clear Circuit"
            >
              <Square className="w-4 h-4" />
              Clear
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Simulation Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              title="Run Simulation"
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="Pause Simulation"
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Status */}
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline">
              Gates: {gates.length}
            </Badge>
            {selectedGate && (
              <Badge variant="default">
                Selected: {selectedGate.type} (q{selectedGate.qubit}, t{selectedGate.timeStep})
              </Badge>
            )}
            {clipboard && (
              <Badge variant="secondary">
                Clipboard: {clipboard.type}
              </Badge>
            )}
          </div>

          {/* Settings */}
          <Button variant="outline" size="sm" title="Settings">
            <Settings className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" title="Keyboard Shortcuts">
            <Keyboard className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
