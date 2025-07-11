import React from 'react';
import { CircuitActions } from '@/components/circuits/CircuitActions';

interface CircuitPanelHeaderProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onShowExportDialog: () => void;
  canUndo: boolean;
}

export function CircuitPanelHeader({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  onShowExportDialog,
  canUndo
}: CircuitPanelHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="animate-in fade-in slide-in-from-left">
        <h2 className="text-xl lg:text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h2>
        <p className="text-muted-foreground font-mono text-sm">Drag and drop gates to build quantum circuits</p>
      </div>
      <CircuitActions
        onUndo={onUndo}
        onClear={onClear}
        onExportJSON={onExportJSON}
        onExportQASM={onExportQASM}
        onShowExportDialog={onShowExportDialog}
        canUndo={canUndo}
      />
    </div>
  );
}