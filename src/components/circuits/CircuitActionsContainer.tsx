
import React from 'react';
import { CircuitActions } from './CircuitActions';
import { useExportHandlers } from '@/hooks/useExportHandlers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

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

interface CircuitActionsContainerProps {
  circuit: Gate[];
  numQubits: number;
  onUndo: () => void;
  onClear: () => void;
  canUndo: boolean;
  projectName?: string;
}

export function CircuitActionsContainer({
  circuit,
  numQubits,
  onUndo,
  onClear,
  canUndo,
  projectName = 'quantum_circuit'
}: CircuitActionsContainerProps) {
  console.log('CircuitActionsContainer rendered with circuit:', circuit);
  
  const { 
    handleExportJSON, 
    handleExportQASM, 
    handleExportPython, 
    handleExportJavaScript 
  } = useExportHandlers(circuit, numQubits, { projectName });

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Download className="w-4 h-4" />
          Circuit Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CircuitActions
          onUndo={onUndo}
          onClear={onClear}
          onExportJSON={handleExportJSON}
          onExportQASM={handleExportQASM}
          onExportPython={handleExportPython}
          onExportJavaScript={handleExportJavaScript}
          canUndo={canUndo}
        />
      </CardContent>
    </Card>
  );
}
