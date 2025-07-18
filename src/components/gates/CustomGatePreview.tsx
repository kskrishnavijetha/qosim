
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomGate, formatComplexNumber } from '@/lib/customGates';

interface CustomGatePreviewProps {
  gate: CustomGate;
  compact?: boolean;
}

export function CustomGatePreview({ gate, compact = false }: CustomGatePreviewProps) {
  const cellSize = compact ? 'text-xs p-1' : 'text-sm p-2';
  const matrixSize = gate.matrix.length;

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" style={{ backgroundColor: gate.color + '20', borderColor: gate.color }}>
            {gate.name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {matrixSize === 2 ? '1-qubit' : matrixSize === 4 ? '2-qubit' : '3-qubit'} gate
          </span>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-2">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
            {gate.matrix.map((row, i) =>
              row.map((value, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`border rounded text-center font-mono ${cellSize} bg-muted/30`}
                  title={`Matrix[${i}][${j}] = ${formatComplexNumber(value)}`}
                >
                  {formatComplexNumber(value, compact)}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {!compact && (
        <div className="text-xs text-muted-foreground">
          <div>Created: {new Date(gate.createdAt).toLocaleDateString()}</div>
          {gate.description && <div>Description: {gate.description}</div>}
        </div>
      )}
    </div>
  );
}
