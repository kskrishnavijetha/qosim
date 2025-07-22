import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface CircuitValidatorProps {
  circuit: Gate[];
}

export function CircuitValidator({ circuit }: CircuitValidatorProps) {
  const hasInvalidGates = circuit.some(gate => !gate.type || gate.type.trim() === '');
  const hasDuplicatePositions = (() => {
    const positions = new Set<string>();
    for (const gate of circuit) {
      const key = gate.qubit !== undefined ? `${gate.qubit}-${gate.position}` : `pos-${gate.position}`;
      if (positions.has(key)) {
        return true;
      }
      positions.add(key);
    }
    return false;
  })();

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Info className="w-4 h-4" />
          Circuit Validator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {circuit.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Add gates to your circuit to validate
          </div>
        )}

        {hasInvalidGates && (
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span>Some gates have invalid or missing types.</span>
          </div>
        )}

        {hasDuplicatePositions && (
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertTriangle className="w-5 h-5" />
            <span>Multiple gates occupy the same qubit and position.</span>
          </div>
        )}

        {!hasInvalidGates && !hasDuplicatePositions && circuit.length > 0 && (
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-5 h-5" />
            <span>All gates are valid and properly positioned.</span>
          </div>
        )}

        <div className="mt-4">
          <Badge variant="secondary" className="mr-2">
            Total Gates: {circuit.length}
          </Badge>
          <Badge variant="secondary">
            Qubits Used: {Array.from(new Set(circuit.flatMap(g => g.qubits ?? (g.qubit !== undefined ? [g.qubit] : [])))).length}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
