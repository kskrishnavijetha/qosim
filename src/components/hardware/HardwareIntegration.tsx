import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface HardwareIntegrationProps {
  circuit: Gate[];
  onExecute: (circuit: Gate[], backend: string, shots: number) => Promise<any>;
  isExecuting: boolean;
  lastResult: any;
}

export function HardwareIntegration({ circuit, onExecute, isExecuting, lastResult }: HardwareIntegrationProps) {
  const [backend, setBackend] = useState('qiskit');
  const [shots, setShots] = useState(1024);

  const handleExecute = async () => {
    await onExecute(circuit, backend, shots);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon">Hardware Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="backend">Quantum Backend</Label>
            <Select value={backend} onValueChange={setBackend}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Backend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qiskit">Qiskit</SelectItem>
                <SelectItem value="braket">Braket</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="shots">Number of Shots</Label>
            <Input
              type="number"
              id="shots"
              value={shots}
              onChange={(e) => setShots(parseInt(e.target.value))}
              min="1"
              max="8192"
            />
          </div>
        </div>
        <Button
          onClick={handleExecute}
          disabled={isExecuting || circuit.length === 0}
          className="w-full neon-border"
          variant="outline"
        >
          {isExecuting ? 'Executing...' : 'Execute on Hardware'}
        </Button>

        {lastResult && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-quantum-particle mb-2">Last Result:</h4>
            {lastResult.error ? (
              <div className="text-red-500 text-xs">Error: {lastResult.error}</div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs">Backend: <Badge variant="secondary">{lastResult.backend}</Badge></div>
                <div className="text-xs">Execution Time: <Badge variant="secondary">{lastResult.executionTime}s</Badge></div>
                <div className="text-xs">State Vector Length: <Badge variant="secondary">{lastResult.stateVector?.length}</Badge></div>
                <div className="text-xs">Measurement States: <Badge variant="secondary">{Object.keys(lastResult.measurementProbabilities)?.length}</Badge></div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
