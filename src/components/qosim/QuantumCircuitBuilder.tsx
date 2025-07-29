
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CircuitCanvas } from './circuit-builder/CircuitCanvas';
import { GatePalette } from './circuit-builder/GatePalette';
import { SimulationPanel } from './circuit-builder/SimulationPanel';
import { ExportPanel } from './circuit-builder/ExportPanel';
import { Play, Save, Share, Undo, Redo, Zap } from 'lucide-react';

interface QuantumCircuitBuilderProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
}

export function QuantumCircuitBuilder({ sharedData, onDataUpdate }: QuantumCircuitBuilderProps) {
  const [circuit, setCircuit] = useState({ gates: [], qubits: 5 });
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Simulate quantum circuit
    setTimeout(() => {
      setSimulationResult({
        probabilities: [0.5, 0, 0, 0.5],
        stateVector: [0.707, 0, 0, 0.707],
        measurementStats: { '00': 512, '11': 512 }
      });
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Gate Palette */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Gate Palette</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GatePalette onGateSelect={(gate) => console.log('Gate selected:', gate)} />
          </CardContent>
        </Card>
      </div>

      {/* Circuit Canvas */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Circuit Designer</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Redo className="w-4 h-4" />
                </Button>
                <Button onClick={handleSimulate} disabled={isSimulating}>
                  <Play className="w-4 h-4 mr-2" />
                  {isSimulating ? 'Simulating...' : 'Simulate'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CircuitCanvas 
              circuit={circuit}
              onCircuitChange={setCircuit}
            />
          </CardContent>
        </Card>
      </div>

      {/* Simulation & Export */}
      <div className="lg:col-span-1 space-y-6">
        <SimulationPanel 
          result={simulationResult}
          isSimulating={isSimulating}
        />
        <ExportPanel 
          circuit={circuit}
          onExport={(format) => console.log('Export:', format)}
        />
      </div>
    </div>
  );
}
