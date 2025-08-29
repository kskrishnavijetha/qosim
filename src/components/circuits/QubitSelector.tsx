
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';

interface QubitSelectorProps {
  numQubits: number;
  onQubitCountChange: (count: number) => void;
  maxQubits?: number;
  minQubits?: number;
}

export function QubitSelector({ 
  numQubits, 
  onQubitCountChange, 
  maxQubits = 10, 
  minQubits = 2 
}: QubitSelectorProps) {
  const handleIncrease = () => {
    if (numQubits < maxQubits) {
      onQubitCountChange(numQubits + 1);
    }
  };

  const handleDecrease = () => {
    if (numQubits > minQubits) {
      onQubitCountChange(numQubits - 1);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Qubit Configuration</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              disabled={numQubits <= minQubits}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Badge variant="secondary" className="px-3 py-1">
              {numQubits} Qubits
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrease}
              disabled={numQubits >= maxQubits}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Range: {minQubits}-{maxQubits} qubits
        </div>
      </CardContent>
    </Card>
  );
}
