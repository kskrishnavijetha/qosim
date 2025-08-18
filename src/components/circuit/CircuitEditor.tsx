
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircuitCanvas } from '@/components/circuits/CircuitCanvas';
import { GatePalette } from '@/components/circuits/GatePalette';
import { Gate } from '@/hooks/useCircuitState';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useRef } from 'react';

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedGate, setSelectedGate] = useState<any>(null);
  
  const {
    zoomLevel,
    panOffset,
    handleZoomIn,
    handleZoomOut,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    resetView
  } = useZoomPan(canvasRef);

  // Convert moveGate to match CircuitCanvas expected signature
  const handleGateMove = (gateId: string, position: { x: number; y: number }) => {
    // Convert position to time step (assuming x coordinate represents time)
    const timeStep = Math.floor(position.x / 60); // Assuming 60px per time step
    moveGate(gateId, timeStep);
  };

  // Handle gate selection from palette
  const handleGateMouseDown = (e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    const newGate: Gate = {
      id: `${gateType}-${Date.now()}`,
      type: gateType,
      qubit: 0, // Default to first qubit
      position: circuit.length // Add at end
    };
    addGate(newGate);
  };

  const handleGateTouchStart = (e: React.TouchEvent, gateType: string) => {
    e.preventDefault();
    const newGate: Gate = {
      id: `${gateType}-${Date.now()}`,
      type: gateType,
      qubit: 0, // Default to first qubit
      position: circuit.length // Add at end
    };
    addGate(newGate);
  };

  // Handle gate addition from canvas
  const handleGateAdd = (gateType: string, qubits: string[], position: { x: number; y: number }) => {
    const newGate: Gate = {
      id: `${gateType}-${Date.now()}`,
      type: gateType,
      qubit: parseInt(qubits[0]) || 0,
      qubits: qubits.map(q => parseInt(q)),
      position: Math.floor(position.x / 60)
    };
    addGate(newGate);
  };

  // Create a circuit object that matches expected interface
  const circuitData = {
    id: 'current-circuit',
    name: 'Current Circuit',
    qubits: Array(5).fill(0).map((_, i) => ({ 
      id: i.toString(), // Convert to string as required by CircuitQubit type
      label: `q${i}`,
      index: i,
      name: `q${i}`,
      state: 'computational' as const // Use correct literal type
    })), // Fix: create CircuitQubit[] array with all required properties
    gates: circuit.map(gate => ({
      ...gate,
      qubits: gate.qubits?.map(q => q.toString()) || [], // Convert qubit indices from numbers to strings
      position: { x: gate.position * 60, y: (gate.qubit || 0) * 60 }, // Convert position number to coordinate object
      layer: gate.position // Add required layer property using position
    })), // Transform Gate[] to CircuitGate[] by adding layer property and converting position to coordinates
    layers: Array.from({ length: circuit.length || 1 }, (_, i) => ({
      id: `layer-${i}`,
      index: i,
      gates: circuit.filter(gate => gate.position === i).map(gate => ({
        ...gate,
        qubits: gate.qubits?.map(q => q.toString()) || [],
        position: { x: gate.position * 60, y: (gate.qubit || 0) * 60 },
        layer: gate.position
      })),
      barrier: false
    })), // Create proper CircuitLayer[] array
    depth: circuit.length,
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: '1.0.0',
      author: 'Circuit Editor'
    },
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
              <GatePalette 
                onGateMouseDown={handleGateMouseDown}
                onGateTouchStart={handleGateTouchStart}
              />
            </div>
            <div className="lg:col-span-3">
              <CircuitCanvas
                circuit={circuitData}
                selectedGate={selectedGate}
                simulationResult={null}
                zoomLevel={zoomLevel}
                panOffset={panOffset}
                onGateAdd={handleGateAdd}
                onGateMove={handleGateMove}
                onGateSelect={setSelectedGate}
                onGateRemove={removeGate}
                onCanvasClick={() => setSelectedGate(null)}
                onPanStart={handlePanStart}
                onPanMove={handlePanMove}
                onPanEnd={handlePanEnd}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={resetView}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
