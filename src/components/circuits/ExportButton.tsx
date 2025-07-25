
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { QuantumCircuitExportDialog } from '@/components/dialogs/QuantumCircuitExportDialog';

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

interface ExportButtonProps {
  circuit: Gate[];
  numQubits: number;
  circuitName?: string;
  className?: string;
}

export function ExportButton({ 
  circuit, 
  numQubits, 
  circuitName,
  className = '' 
}: ExportButtonProps) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setExportDialogOpen(true)}
        variant="outline"
        className={`neon-border hover:scale-105 transition-all duration-300 ${className}`}
        disabled={circuit.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        Export Circuit
      </Button>

      <QuantumCircuitExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        circuit={circuit}
        numQubits={numQubits}
        circuitName={circuitName}
      />
    </>
  );
}
