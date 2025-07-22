
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Undo, Redo, Download, Upload, Settings, Plus, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Circuit } from '@/hooks/useCircuitWorkspace';

interface WorkspaceToolbarProps {
  circuits: Circuit[];
  activeCircuit: Circuit | null;
  onCircuitSelect: (circuit: Circuit) => void;
  onNewCircuit: () => void;
  onDuplicateCircuit: (circuitId: string) => void;
  onDeleteCircuit: (circuitId: string) => void;
}

export function WorkspaceToolbar({
  circuits,
  activeCircuit,
  onCircuitSelect,
  onNewCircuit,
  onDuplicateCircuit,
  onDeleteCircuit
}: WorkspaceToolbarProps) {
  
  return (
    <div className="flex items-center gap-4 p-2 border-b border-quantum-matrix bg-quantum-void/50">
      {/* Circuit Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-quantum-neon">Circuit:</span>
        <Select
          value={activeCircuit?.id || ''}
          onValueChange={(circuitId) => {
            const circuit = circuits.find(c => c.id === circuitId);
            if (circuit) onCircuitSelect(circuit);
          }}
        >
          <SelectTrigger className="w-40 bg-quantum-matrix border-quantum-glow/30">
            <SelectValue placeholder="Select circuit" />
          </SelectTrigger>
          <SelectContent className="quantum-panel neon-border">
            {circuits.map((circuit) => (
              <SelectItem key={circuit.id} value={circuit.id}>
                {circuit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-6 bg-quantum-matrix" />

      {/* Circuit Operations */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewCircuit}
          className="text-quantum-neon hover:bg-quantum-void"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => activeCircuit && onDuplicateCircuit(activeCircuit.id)}
          disabled={!activeCircuit}
          className="text-quantum-neon hover:bg-quantum-void"
        >
          <Copy className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => activeCircuit && onDeleteCircuit(activeCircuit.id)}
          disabled={!activeCircuit}
          className="text-quantum-neon hover:bg-quantum-void"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
