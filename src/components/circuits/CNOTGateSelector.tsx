import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Circle, Target } from 'lucide-react';

interface CNOTGateSelectorProps {
  qubits: { id: string; name: string; index: number }[];
  onCNOTAdd: (control: number, target: number) => void;
  onClose?: () => void;
}

export function CNOTGateSelector({ qubits, onCNOTAdd, onClose }: CNOTGateSelectorProps) {
  const [controlQubit, setControlQubit] = useState<number | null>(null);
  const [targetQubit, setTargetQubit] = useState<number | null>(null);

  const handleAddCNOT = () => {
    if (controlQubit !== null && targetQubit !== null && controlQubit !== targetQubit) {
      onCNOTAdd(controlQubit, targetQubit);
      setControlQubit(null);
      setTargetQubit(null);
      onClose?.();
    }
  };

  const isValid = controlQubit !== null && targetQubit !== null && controlQubit !== targetQubit;

  return (
    <Card className="w-80">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">CX</span>
          </div>
          CNOT Gate Configuration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-primary" fill="currentColor" />
              <span className="text-sm font-medium">Control Qubit</span>
            </div>
            <Select
              value={controlQubit?.toString() || ''}
              onValueChange={(value) => setControlQubit(parseInt(value))}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {qubits.map((qubit) => (
                  <SelectItem 
                    key={qubit.id} 
                    value={qubit.index.toString()}
                    disabled={targetQubit === qubit.index}
                  >
                    {qubit.name} (q{qubit.index})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">Target Qubit</span>
            </div>
            <Select
              value={targetQubit?.toString() || ''}
              onValueChange={(value) => setTargetQubit(parseInt(value))}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {qubits.map((qubit) => (
                  <SelectItem 
                    key={qubit.id} 
                    value={qubit.index.toString()}
                    disabled={controlQubit === qubit.index}
                  >
                    {qubit.name} (q{qubit.index})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {controlQubit !== null && targetQubit !== null && (
          <div className="flex items-center justify-center py-2 bg-muted rounded-lg">
            <Badge variant="outline" className="mr-2">
              q{controlQubit}
            </Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
            <Badge variant="destructive">
              q{targetQubit}
            </Badge>
          </div>
        )}

        <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
          <strong>CNOT Operation:</strong> When control qubit is |1⟩, flips the target qubit. 
          When control is |0⟩, target remains unchanged.
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAddCNOT}
            disabled={!isValid}
            size="sm"
            className="flex-1"
          >
            Add CNOT Gate
          </Button>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}