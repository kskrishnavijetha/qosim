
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumAlgorithmsSDK } from '@/components/algorithms/QuantumAlgorithmsSDK';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { Atom } from 'lucide-react';

interface QuantumAlgorithmsSDKPanelProps {
  className?: string;
}

export function QuantumAlgorithmsSDKPanel({ className }: QuantumAlgorithmsSDKPanelProps) {
  const {
    circuit: visualCircuit,
    addGate,
    simulateCircuit,
    loadCircuit
  } = useCircuitBuilder();

  const [lastAlgorithmResult, setLastAlgorithmResult] = useState<any>(null);

  const handleCircuitGenerated = useCallback((gates: any[]) => {
    // Convert SDK gates to visual circuit gates
    gates.forEach(gate => {
      try {
        if (gate.qubits && gate.qubits.length > 1) {
          // Multi-qubit gate
          addGate(gate.type, gate.qubits, { x: gate.position * 100, y: gate.qubits[1] * 60 });
        } else {
          // Single-qubit gate  
          addGate(gate.type, [gate.qubit?.toString() || '0'], { x: gate.position * 100, y: (gate.qubit || 0) * 60 });
        }
      } catch (error) {
        console.warn('Failed to add gate to visual circuit:', gate, error);
      }
    });
  }, [addGate]);

  const handleAlgorithmExecuted = useCallback((result: any) => {
    setLastAlgorithmResult(result);
  }, []);

  const handleVisualCircuitChange = useCallback((newCircuit: any) => {
    if (newCircuit) {
      loadCircuit(newCircuit);
    }
  }, [loadCircuit]);

  return (
    <Card className={`quantum-panel neon-border ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-mono text-quantum-glow flex items-center gap-2">
          <Atom className="w-6 h-6" />
          Quantum Algorithms SDK
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sdk" className="w-full">
          <TabsList className="grid w-full grid-cols-2 quantum-panel mb-4">
            <TabsTrigger value="sdk">SDK Development</TabsTrigger>
            <TabsTrigger value="integration">Circuit Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sdk" className="space-y-4">
            <QuantumAlgorithmsSDK
              onCircuitGenerated={handleCircuitGenerated}
              onAlgorithmExecuted={handleAlgorithmExecuted}
              visualCircuit={visualCircuit}
              onVisualCircuitChange={handleVisualCircuitChange}
            />
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4">
            <div className="text-center py-8 space-y-4">
              <div className="text-quantum-neon">
                Circuit Builder Integration Active
              </div>
              <div className="text-sm text-muted-foreground">
                Switch to SDK Development tab to create algorithms and see them appear in the Circuit Builder
              </div>
              {lastAlgorithmResult && (
                <div className="p-4 bg-quantum-matrix/30 rounded-lg border border-quantum-neon/20">
                  <div className="text-xs text-quantum-particle">
                    Last Generated: {lastAlgorithmResult.circuit?.name || 'Algorithm Circuit'}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
