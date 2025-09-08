
import React, { useState } from 'react';
import { useCircuitState, type Gate } from '@/hooks/useCircuitState';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { QuantumVisualizationPanel } from './QuantumVisualizationPanel';
import { AICoPilotIntegration } from './ai/AICoPilotIntegration';
import { CircuitCodeParser } from '@/lib/circuitCodeParser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Zap, CircuitBoard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MainQuantumInterface() {
  const { circuit, simulationResult, addGate } = useCircuitState();
  const { executeCircuit, lastResult, isExecuting } = useQuantumBackend();
  const { toast } = useToast();
  const [shots, setShots] = useState(1024);

  // Default values for missing properties
  const numQubits = 5; // Standard 5-qubit system
  const circuitName = 'Quantum Circuit';

  const handleInsertFromAI = (content: string, framework?: string) => {
    try {
      console.log('🤖 AI Co-Pilot: Inserting circuit code from framework:', framework);
      console.log('🤖 Content received:', content);
      
      // Extract code blocks from the AI response
      const codeBlocks = CircuitCodeParser.extractCodeBlocks(content);
      
      if (codeBlocks.length === 0) {
        // Fallback: try to parse the entire content as code
        codeBlocks.push(content);
      }
      
      let totalGatesAdded = 0;
      let lastFramework = framework || 'QOSim';
      
      // Parse each code block
      for (const codeBlock of codeBlocks) {
        const parseResult = CircuitCodeParser.parseCircuitCode(codeBlock, framework);
        
        if (parseResult.success && parseResult.gates.length > 0) {
          console.log(`🤖 Successfully parsed ${parseResult.gates.length} gates from ${parseResult.framework}`);
          
          // Add each gate to the circuit
          for (const gate of parseResult.gates) {
            addGate(gate);
          }
          
          totalGatesAdded += parseResult.gates.length;
          lastFramework = parseResult.framework;
        } else if (parseResult.error) {
          console.warn('🤖 Parse error:', parseResult.error);
        }
      }
      
      // Show appropriate toast message
      if (totalGatesAdded > 0) {
        toast({
          title: "🎯 Circuit Inserted Successfully",
          description: `Added ${totalGatesAdded} ${lastFramework} gates to your quantum circuit. The visual canvas has been updated.`,
        });
      } else {
        // Fallback: show the AI guidance even if we couldn't parse gates
        toast({
          title: "💡 AI Guidance Provided",
          description: "The AI Co-Pilot has provided quantum circuit guidance. You may need to implement complex operations manually.",
        });
      }
    } catch (error) {
      console.error('🤖 AI Co-Pilot insertion error:', error);
      toast({
        title: "⚠️ Insertion Note",
        description: "AI content received. Complex circuits may require manual implementation in the visual editor.",
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
            
            <div className="text-sm text-sidebar-foreground/70 flex items-center gap-2">
              Gates: {circuit.length} | Qubits: {numQubits}
              {circuit.length > 0 && (
                <div className="flex items-center gap-1 text-quantum-glow">
                  <div className="w-2 h-2 rounded-full bg-quantum-glow animate-pulse" />
                  <span className="text-xs">Live</span>
                </div>
              )}
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
