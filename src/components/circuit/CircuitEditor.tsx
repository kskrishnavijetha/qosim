
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircuitCanvas } from '@/components/circuits/CircuitCanvas';
import { GatePalette } from '@/components/circuits/GatePalette';
import { Gate } from '@/hooks/useCircuitState';

interface CircuitEditorProps {
  circuit: Gate[];
  addGate: (gate: Gate) => void;
  removeGate: (gateId: string) => void;
  moveGate: (gateId: string, newPosition: number) => void;
  clearCircuit: () => void;
  loadExampleCircuit: (type: string) => void;
}

export function CircuitEditor({
  circuit,
  addGate,
  removeGate,
  moveGate,
  clearCircuit,
  loadExampleCircuit
}: CircuitEditorProps) {
  // Convert moveGate to match CircuitCanvas expected signature
  const handleGateMove = (gateId: string, position: { x: number; y: number }) => {
    // Convert position to time step (assuming x coordinate represents time)
    const timeStep = Math.floor(position.x / 60); // Assuming 60px per time step
    moveGate(gateId, timeStep);
  };

  // Create a circuit object that matches expected interface
  const circuitData = {
    id: 'current-circuit',
    name: 'Current Circuit',
    qubits: 5,
    gates: circuit,
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false
  };

  return (
    <div className="space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Circuit Editor</CardTitle>
          <div className="flex gap-2">
            <Button onClick={clearCircuit} variant="outline" size="sm">
              Clear Circuit
            </Button>
            <Button onClick={() => loadExampleCircuit('bell')} variant="outline" size="sm">
              Load Bell State
            </Button>
            <Button onClick={() => loadExampleCircuit('ghz')} variant="outline" size="sm">
              Load GHZ State
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <GatePalette onGateAdd={addGate} />
            </div>
            <div className="lg:col-span-3">
              <CircuitCanvas
                circuit={circuitData}
                onGateRemove={removeGate}
                onGateMove={handleGateMove}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
