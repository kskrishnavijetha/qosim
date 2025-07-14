import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExportOptions } from './export/ExportOptions';
import { ExportFormatButtons } from './export/ExportFormatButtons';
import { useExportHandlers } from '@/hooks/useExportHandlers';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  label?: string;
  comment?: string;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit: Gate[];
  circuitRef: React.RefObject<HTMLElement>;
  numQubits: number;
}

export function ExportDialog({ 
  open, 
  onOpenChange, 
  circuit, 
  circuitRef,
  numQubits 
}: ExportDialogProps) {
  const [options, setOptions] = useState({
    projectName: 'quantum_circuit'
  });

  const { handleExportJSON, handleExportQASM, handleExportPython } = useExportHandlers(
    circuit, 
    numQubits, 
    options
  );

  const handleProjectNameChange = (name: string) => {
    setOptions(prev => ({ ...prev, projectName: name }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Quantum Circuit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <ExportOptions 
            projectName={options.projectName}
            onProjectNameChange={handleProjectNameChange}
          />

          <ExportFormatButtons
            onExportJSON={handleExportJSON}
            onExportQASM={handleExportQASM}
            onExportPython={handleExportPython}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}