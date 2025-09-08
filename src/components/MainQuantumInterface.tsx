
import React, { useState } from 'react';
import { useCircuitState, type Gate } from '@/hooks/useCircuitState';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { QuantumVisualizationPanel } from './QuantumVisualizationPanel';
import { AICoPilotIntegration } from './ai/AICoPilotIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MainQuantumInterface() {
  const { circuit, simulationResult, addGate } = useCircuitState();
  const { executeCircuit, lastResult, isExecuting } = useQuantumBackend();
  const { toast } = useToast();
  const [shots, setShots] = useState(1024);

  // Default values for missing properties
  const numQubits = 5; // Standard 5-qubit system
  const circuitName = 'Quantum Circuit';

  const handleInsertFromAI = (content: string) => {
    // Parse AI content and insert into circuit
    try {
      // Simple QASM parsing (you can enhance this)
      const lines = content.split('\n');
      let gateCount = 0;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('h ')) {
          // Hadamard gate
          const qubitMatch = trimmedLine.match(/h q\[(\d+)\]/);
          if (qubitMatch) {
            const qubit = parseInt(qubitMatch[1]);
            addGate({ 
              type: 'h', 
              qubits: [qubit], 
              id: `ai-gate-${Date.now()}-${gateCount++}`,
              position: gateCount
            });
          }
        } else if (trimmedLine.startsWith('cx ')) {
          // CNOT gate
          const qubitMatch = trimmedLine.match(/cx q\[(\d+)\],q\[(\d+)\]/);
          if (qubitMatch) {
            const control = parseInt(qubitMatch[1]);
            const target = parseInt(qubitMatch[2]);
            addGate({ 
              type: 'cnot', 
              qubits: [control, target], 
              id: `ai-gate-${Date.now()}-${gateCount++}`,
              position: gateCount
            });
          }
        }
      }
      
      if (gateCount > 0) {
        toast({
          title: "AI Circuit Inserted",
          description: `Added ${gateCount} gates from AI Co-Pilot to your circuit.`,
        });
      } else {
        toast({
          title: "Circuit Generated",
          description: "AI Co-Pilot provided quantum circuit guidance.",
        });
      }
    } catch (error) {
      toast({
        title: "Insert Note",
        description: "AI content has been noted. Manual implementation may be needed for complex circuits.",
        variant: "default",
      });
    }
  };

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
    <div className="space-y-6 relative">
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
              disabled={isExecuting || circuit.length === 0}
              className="quantum-panel neon-border"
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
                className="w-20 px-2 py-1 text-sm bg-quantum-matrix border border-quantum-neon rounded"
              />
            </div>
            
            <div className="text-sm text-quantum-particle">
              Gates: {circuit.length} | Qubits: {numQubits}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Results */}
      <QuantumVisualizationPanel
        result={lastResult}
        gates={circuit}
        numQubits={numQubits}
        circuitName={circuitName}
        onRerunSimulation={handleRunSimulation}
        onExecutePartialCircuit={handleExecutePartialCircuit}
      />

      {/* AI Co-Pilot Integration */}
      <AICoPilotIntegration onInsertToCanvas={handleInsertFromAI} />
    </div>
  );
}
