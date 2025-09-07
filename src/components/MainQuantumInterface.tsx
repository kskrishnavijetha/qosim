
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InteractiveCircuitBuilder } from './circuits/InteractiveCircuitBuilder';
import { UnifiedAIPanel } from './ai/UnifiedAIPanel';
import { QuantumAlgorithmsSDKPanel } from './panels/QuantumAlgorithmsSDKPanel';
import { QNNVisualBuilder } from './qnn/QNNVisualBuilder';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Brain, Cpu, Code, Network, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function MainQuantumInterface() {
  console.log('🎯 MainQuantumInterface rendering...');
  
  try {
    const [activeTab, setActiveTab] = useState('circuits');
    const [showAIPanel, setShowAIPanel] = useState(true);
    
    console.log('✅ MainQuantumInterface - State initialized');
    
    // Test the hooks one by one
    let circuit, addGate, removeGate, clearCircuit, simulateCircuit, simulationResult, isSimulating;
    
    try {
      console.log('🔧 MainQuantumInterface - Initializing useCircuitState...');
      const circuitState = useCircuitState();
      ({ circuit, addGate, removeGate, clearCircuit, simulateCircuit, simulationResult, isSimulating } = circuitState);
      console.log('✅ MainQuantumInterface - useCircuitState initialized');
    } catch (error) {
      console.error('❌ MainQuantumInterface - useCircuitState failed:', error);
      throw error;
    }

    let dragState, circuitRef, handleMouseDown, handleTouchStart;
    
    try {
      console.log('🔧 MainQuantumInterface - Initializing useCircuitDragDrop...');
      const dragDropState = useCircuitDragDrop({
        onGateAdd: addGate,
        numQubits: 4,
        gridSize: 100
      });
      ({ dragState, circuitRef, handleMouseDown, handleTouchStart } = dragDropState);
      console.log('✅ MainQuantumInterface - useCircuitDragDrop initialized');
    } catch (error) {
      console.error('❌ MainQuantumInterface - useCircuitDragDrop failed:', error);
      throw error;
    }

    const handleCircuitGenerated = useCallback((gates: any[]) => {
      try {
        clearCircuit();
        gates.forEach(gate => {
          try {
            addGate(gate);
            console.log('Added AI-generated gate:', gate);
          } catch (error) {
            console.warn('Failed to add AI-generated gate:', gate, error);
            toast.error(`Failed to add ${gate.type} gate`);
          }
        });
        toast.success(`Generated circuit with ${gates.length} gates`);
      } catch (error) {
        console.error('❌ MainQuantumInterface - handleCircuitGenerated failed:', error);
      }
    }, [addGate, clearCircuit]);

    const handleAlgorithmGenerated = useCallback((code: string) => {
      console.log('Generated algorithm code:', code);
      toast.success('Algorithm code generated - check console for details');
    }, []);

    const handleCircuitOptimized = useCallback((optimizedGates: any[]) => {
      clearCircuit();
      optimizedGates.forEach(gate => {
        try {
          addGate(gate);
        } catch (error) {
          console.warn('Failed to add optimized gate:', gate, error);
        }
      });
      toast.success('Circuit optimized successfully');
    }, [addGate, clearCircuit]);

    const handleCircuitFixed = useCallback((fixedGates: any[]) => {
      clearCircuit();
      fixedGates.forEach(gate => {
        try {
          addGate(gate);
        } catch (error) {
          console.warn('Failed to add fixed gate:', gate, error);
        }
      });
      toast.success('Circuit debugging completed');
    }, [addGate, clearCircuit]);

    const handleShowStateVisualization = useCallback((step: number) => {
      toast.info(`Showing quantum state at step ${step}`);
    }, []);

    console.log('🎯 MainQuantumInterface - Starting render...');

    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-quantum-glow" />
            <h1 className="text-xl font-mono text-quantum-glow">QOSim Quantum Simulator</h1>
            <Badge variant="secondary">
              Gates: {circuit.length}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIPanel(!showAIPanel)}
            >
              <Brain className="w-4 h-4 mr-1" />
              AI Assistant
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant={isSimulating ? "destructive" : "default"}
              size="sm"
              onClick={simulateCircuit}
              disabled={circuit.length === 0 || isSimulating}
            >
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>
        </div>

        {/* Simplified Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="p-4">
              <Card>
                <CardContent className="p-4">
                  <p>Circuit Builder Loading...</p>
                  <p>Circuit gates: {circuit.length}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('❌ MainQuantumInterface - Render failed:', error);
    throw error;
  }
}
