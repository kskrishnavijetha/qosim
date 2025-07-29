
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GatePalette } from './circuit/GatePalette';
import { CircuitCanvas } from './circuit/CircuitCanvas';
import { CircuitControls } from './circuit/CircuitControls';
import { StateVisualizer } from './circuit/StateVisualizer';
import { ExportPanel } from './circuit/ExportPanel';
import { CollaborationPanel } from './circuit/CollaborationPanel';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { Activity, Zap, Users, Share2 } from 'lucide-react';

export function QuantumCircuitBuilder() {
  const [activePanel, setActivePanel] = useState<'circuit' | 'visualizer' | 'export' | 'collaboration'>('circuit');
  
  const {
    circuit,
    qubits,
    simulationResult,
    isSimulating,
    addGate,
    removeGate,
    moveGate,
    addQubit,
    removeQubit,
    simulate,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    exportCircuit,
    importCircuit,
    optimizeCircuit
  } = useCircuitBuilder();

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGateDrop = useCallback((gateType: string, qubit: number, position: number) => {
    const newGate = {
      id: `gate_${Date.now()}`,
      type: gateType,
      qubit,
      position,
      parameters: getDefaultParameters(gateType)
    };
    addGate(newGate);
  }, [addGate]);

  const getDefaultParameters = (gateType: string) => {
    switch (gateType) {
      case 'RX':
      case 'RY':
      case 'RZ':
        return { angle: Math.PI / 4 };
      case 'U3':
        return { theta: Math.PI / 2, phi: 0, lambda: Math.PI / 2 };
      default:
        return {};
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Quantum Circuit Builder</h1>
          <Badge variant="secondary" className="ml-2">
            QOSim v1.0
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={activePanel === 'circuit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePanel('circuit')}
          >
            <Activity className="w-4 h-4 mr-1" />
            Circuit
          </Button>
          <Button
            variant={activePanel === 'visualizer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePanel('visualizer')}
          >
            <Zap className="w-4 h-4 mr-1" />
            Visualizer
          </Button>
          <Button
            variant={activePanel === 'export' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePanel('export')}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button
            variant={activePanel === 'collaboration' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePanel('collaboration')}
          >
            <Users className="w-4 h-4 mr-1" />
            Collaborate
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Gate Palette */}
        <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
          <GatePalette onGateSelect={handleGateDrop} />
        </div>

        {/* Center - Circuit Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Circuit Controls */}
          <div className="p-4 border-b">
            <CircuitControls
              onUndo={undo}
              onRedo={redo}
              onClear={clear}
              onSimulate={simulate}
              onOptimize={optimizeCircuit}
              onAddQubit={addQubit}
              onRemoveQubit={removeQubit}
              canUndo={canUndo}
              canRedo={canRedo}
              isSimulating={isSimulating}
              qubitCount={qubits.length}
            />
          </div>

          {/* Circuit Canvas */}
          <div className="flex-1 p-4">
            <CircuitCanvas
              ref={canvasRef}
              circuit={circuit}
              qubits={qubits}
              onGateDrop={handleGateDrop}
              onGateMove={moveGate}
              onGateRemove={removeGate}
              simulationResult={simulationResult}
            />
          </div>
        </div>

        {/* Right Panel - Context Dependent */}
        <div className="w-80 border-l bg-muted/30 overflow-y-auto">
          {activePanel === 'circuit' && (
            <div className="p-4">
              <h3 className="font-semibold mb-4">Circuit Properties</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Qubits:</span>
                  <span className="text-sm font-mono">{qubits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gates:</span>
                  <span className="text-sm font-mono">{circuit.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Depth:</span>
                  <span className="text-sm font-mono">
                    {Math.max(...circuit.map(g => g.position)) + 1 || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'visualizer' && (
            <StateVisualizer 
              simulationResult={simulationResult}
              qubits={qubits}
              isSimulating={isSimulating}
            />
          )}

          {activePanel === 'export' && (
            <ExportPanel
              circuit={circuit}
              qubits={qubits}
              onExport={exportCircuit}
              onImport={importCircuit}
            />
          )}

          {activePanel === 'collaboration' && (
            <CollaborationPanel />
          )}
        </div>
      </div>
    </div>
  );
}
