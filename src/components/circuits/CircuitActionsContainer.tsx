
import React from 'react';
import { CircuitActions } from './CircuitActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

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
  circuitName?: string;
}

export function CircuitActionsContainer({
  circuit,
  numQubits,
  onUndo,
  onClear,
  canUndo,
  circuitName = 'quantum_circuit'
}: CircuitActionsContainerProps) {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Circuit Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CircuitActions
          circuit={circuit}
          numQubits={numQubits}
          onUndo={onUndo}
          onClear={onClear}
          canUndo={canUndo}
          circuitName={circuitName}
        />
      </CardContent>
    </Card>
  );
}
