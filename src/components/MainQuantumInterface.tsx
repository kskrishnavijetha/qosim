
import React, { useState } from 'react';
import { useCircuitState, type Gate } from '@/hooks/useCircuitState';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { QuantumVisualizationPanel } from './QuantumVisualizationPanel';
import { QuantumAICoPilot } from './ai/QuantumAICoPilot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Zap } from 'lucide-react';

export function MainQuantumInterface() {
  const { circuit, simulationResult, setCircuit } = useCircuitState();
  const { executeCircuit, lastResult, isExecuting } = useQuantumBackend();
  const [shots, setShots] = useState(1024);

  // Default values for missing properties
  const numQubits = 5; // Standard 5-qubit system
  const circuitName = 'Quantum Circuit';

  const handleRunSimulation = async () => {
    if (circuit.length === 0) {
      console.warn('No gates to simulate');
      return null;
    }
    
    return await executeCircuit(circuit, 'local', shots);
  };

  const handleExecutePartialCircuit = async (partialGates: Gate[], simulationShots?: number) => {
    return await executeCircuit(partialGates, 'local', simulationShots || shots);
  };

  return (
    <div className="space-y-6">
      {/* Main Interface Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left - Simulation Controls */}
        <div className="col-span-4">
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="space-y-4">
                <Button 
                  onClick={handleRunSimulation}
                  disabled={isExecuting || circuit.length === 0}
                  className="w-full quantum-panel neon-border"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isExecuting ? 'Simulating...' : 'Run Simulation'}
                </Button>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-quantum-particle">Shots:</label>
                  <input
                    type="number"
                    value={shots}
                    onChange={(e) => setShots(Number(e.target.value))}
                    min="1"
                    max="100000"
                    className="flex-1 px-2 py-1 text-sm bg-quantum-matrix border border-quantum-neon rounded"
                  />
                </div>
                
                <div className="text-sm text-quantum-particle">
                  Gates: {circuit.length} | Qubits: {numQubits}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center - AI Co-Pilot */}
        <div className="col-span-4">
          <QuantumAICoPilot
            circuit={circuit}
            result={lastResult}
            onCircuitUpdate={setCircuit}
            onRunSimulation={handleRunSimulation}
            numQubits={numQubits}
            className="h-[600px]"
          />
        </div>

        {/* Right - Visualization */}
        <div className="col-span-4">
          <QuantumVisualizationPanel
            result={lastResult}
            gates={circuit}
            numQubits={numQubits}
            circuitName={circuitName}
            onRerunSimulation={handleRunSimulation}
            onExecutePartialCircuit={handleExecutePartialCircuit}
          />
        </div>
      </div>
    </div>
  );
}
