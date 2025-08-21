
import React, { useState } from 'react';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { QuantumVisualizationPanel } from './QuantumVisualizationPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Zap } from 'lucide-react';

export function MainQuantumInterface() {
  const { gates, numQubits, circuitName } = useCircuitState();
  const { simulateCircuit, result, isSimulating } = useQuantumBackend();
  const [shots, setShots] = useState(1024);

  const handleRunSimulation = async () => {
    if (gates.length === 0) {
      console.warn('No gates to simulate');
      return null;
    }
    
    return await simulateCircuit(gates, numQubits, shots);
  };

  const handleExecutePartialCircuit = async (partialGates: Gate[], simulationShots?: number) => {
    return await simulateCircuit(partialGates, numQubits, simulationShots || shots);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quantum Circuit Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleRunSimulation}
              disabled={isSimulating || gates.length === 0}
              className="quantum-panel neon-border"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-quantum-particle">Shots:</label>
              <input
                type="number"
                value={shots}
                onChange={(e) => setShots(Number(e.target.value))}
                min="1"
                max="100000"
                className="w-20 px-2 py-1 text-sm bg-quantum-matrix border border-quantum-neon rounded"
              />
            </div>
            
            <div className="text-sm text-quantum-particle">
              Gates: {gates.length} | Qubits: {numQubits}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Results */}
      <QuantumVisualizationPanel
        result={result}
        gates={gates}
        numQubits={numQubits}
        circuitName={circuitName}
        onRerunSimulation={handleRunSimulation}
        onExecutePartialCircuit={handleExecutePartialCircuit}
      />
    </div>
  );
}
