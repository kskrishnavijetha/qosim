
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCircuitStore } from '@/store/circuitStore';

export function StateViewer() {
  const { gates, selectedGate, numQubits, numTimeSteps } = useCircuitStore();

  const getGatesByQubit = () => {
    const gatesByQubit: Record<number, typeof gates> = {};
    for (let i = 0; i < numQubits; i++) {
      gatesByQubit[i] = gates.filter(gate => gate.qubit === i).sort((a, b) => a.timeStep - b.timeStep);
    }
    return gatesByQubit;
  };

  const getGatesByTimeStep = () => {
    const gatesByTimeStep: Record<number, typeof gates> = {};
    for (let i = 0; i < numTimeSteps; i++) {
      gatesByTimeStep[i] = gates.filter(gate => gate.timeStep === i).sort((a, b) => (a.qubit || 0) - (b.qubit || 0));
    }
    return gatesByTimeStep;
  };

  const gatesByQubit = getGatesByQubit();
  const gatesByTimeStep = getGatesByTimeStep();

  return (
    <div className="space-y-4">
      {/* Circuit Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Circuit Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Gates</div>
              <div className="text-2xl font-bold">{gates.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Circuit Depth</div>
              <div className="text-2xl font-bold">
                {gates.length > 0 ? Math.max(...gates.map(g => g.timeStep)) + 1 : 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Qubits Used</div>
              <div className="text-2xl font-bold">
                {gates.length > 0 ? new Set(gates.map(g => g.qubit)).size : 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gate Types</div>
              <div className="text-2xl font-bold">
                {new Set(gates.map(g => g.type)).size}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Gate Info */}
      {selectedGate && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Selected Gate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant="default">{selectedGate.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Qubit:</span>
                <span className="font-mono">q{selectedGate.qubit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time Step:</span>
                <span className="font-mono">t{selectedGate.timeStep}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{selectedGate.id.slice(-8)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gates by Qubit */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Gates by Qubit</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {Object.entries(gatesByQubit).map(([qubit, qubitGates]) => (
                <div key={qubit} className="flex items-center gap-2">
                  <div className="w-8 text-sm font-mono text-muted-foreground">q{qubit}:</div>
                  <div className="flex gap-1 flex-wrap">
                    {qubitGates.map(gate => (
                      <Badge 
                        key={gate.id} 
                        variant={selectedGate?.id === gate.id ? "default" : "outline"}
                        className="text-xs"
                      >
                        {gate.type}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Gate Types Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Gate Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {Object.entries(
                gates.reduce((acc, gate) => {
                  acc[gate.type] = (acc[gate.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).sort(([,a], [,b]) => (b as number) - (a as number)).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <Badge variant="outline">{type}</Badge>
                  <span className="text-sm font-mono">{count}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
