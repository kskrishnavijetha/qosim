
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
  const [activeTab, setActiveTab] = useState('circuits');
  const [showAIPanel, setShowAIPanel] = useState(true);
  
  const {
    circuit,
    addGate,
    removeGate,
    clearCircuit,
    simulateCircuit,
    simulationResult,
    isSimulating
  } = useCircuitState();

  const {
    dragState,
    circuitRef,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits: 4,
    gridSize: 100
  });

  const handleCircuitGenerated = useCallback((gates: any[]) => {
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Assistant */}
        {showAIPanel && (
          <div className="w-80 border-r bg-card overflow-y-auto">
            <UnifiedAIPanel
              circuit={circuit}
              onCircuitGenerated={handleCircuitGenerated}
              onAlgorithmGenerated={handleAlgorithmGenerated}
              onCircuitOptimized={handleCircuitOptimized}
              onCircuitFixed={handleCircuitFixed}
              onShowStateVisualization={handleShowStateVisualization}
            />
          </div>
        )}

        {/* Center Panel - Main Interface */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="circuits">
                <Cpu className="w-4 h-4 mr-1" />
                Circuit Builder
              </TabsTrigger>
              <TabsTrigger value="algorithms">
                <Code className="w-4 h-4 mr-1" />
                Algorithms SDK
              </TabsTrigger>
              <TabsTrigger value="qnn">
                <Network className="w-4 h-4 mr-1" />
                QNN Builder
              </TabsTrigger>
              <TabsTrigger value="learning">
                <Brain className="w-4 h-4 mr-1" />
                Learning Mode
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="circuits" className="flex-1 p-4">
              <InteractiveCircuitBuilder
                dragState={dragState}
                circuitRef={circuitRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              />
            </TabsContent>
            
            <TabsContent value="algorithms" className="flex-1 p-4">
              <QuantumAlgorithmsSDKPanel />
            </TabsContent>
            
            <TabsContent value="qnn" className="flex-1 p-4">
              <QNNVisualBuilder />
            </TabsContent>
            
            <TabsContent value="learning" className="flex-1 p-4">
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-quantum-neon opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Learning Mode</h3>
                  <p className="text-muted-foreground">
                    Interactive tutorials and guided learning experiences coming soon!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
