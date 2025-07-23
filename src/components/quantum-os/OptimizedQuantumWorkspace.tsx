
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Save, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { DragDropProvider } from '@/contexts/DragDropContext';
import { OptimizedGatePalette } from '@/components/circuits/OptimizedGatePalette';
import { OptimizedCircuitCanvas } from '@/components/circuits/OptimizedCircuitCanvas';
import { OptimizedDraggingGate } from '@/components/circuits/OptimizedDraggingGate';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { useCircuitWorkspace, type Gate } from '@/hooks/useCircuitWorkspace';

export function OptimizedQuantumWorkspace() {
  const {
    circuits,
    activeCircuit,
    setActiveCircuit,
    addGateToCircuit,
    removeGateFromCircuit,
    createNewCircuit,
    duplicateCircuit,
    deleteCircuit,
    runCircuit,
    clearCircuit,
    exportCircuit,
    simulationResult,
    isRunning,
    updateCircuitGates
  } = useCircuitWorkspace();

  const handleGateAdd = useCallback((gate: Gate) => {
    if (!activeCircuit) return;
    addGateToCircuit(activeCircuit.id, gate);
  }, [activeCircuit, addGateToCircuit]);

  const handleGateRemove = useCallback((gateId: string) => {
    if (!activeCircuit) return;
    removeGateFromCircuit(activeCircuit.id, gateId);
  }, [activeCircuit, removeGateFromCircuit]);

  const handleRunCircuit = useCallback(async () => {
    if (!activeCircuit) return;
    await runCircuit(activeCircuit.id);
  }, [activeCircuit, runCircuit]);

  const handleClearCircuit = useCallback(() => {
    if (!activeCircuit) return;
    clearCircuit(activeCircuit.id);
  }, [activeCircuit, clearCircuit]);

  const handleSaveCircuit = useCallback(() => {
    if (!activeCircuit) return;
    toast.success(`Circuit "${activeCircuit.name}" saved successfully`);
  }, [activeCircuit]);

  const handleShareCircuit = useCallback(() => {
    if (!activeCircuit) return;
    
    const shareData = {
      title: activeCircuit.name,
      text: `Check out my quantum circuit: ${activeCircuit.name}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Circuit link copied to clipboard');
    }
  }, [activeCircuit]);

  const handleExportCircuit = useCallback(() => {
    if (!activeCircuit) return;
    exportCircuit('qasm');
    toast.success('Circuit exported to QASM format');
  }, [activeCircuit, exportCircuit]);

  return (
    <DragDropProvider>
      <div className="h-full flex flex-col quantum-grid">
        {/* Header */}
        <div className="flex-none p-4 border-b border-quantum-glow/20">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCircuit}
                disabled={isRunning || !activeCircuit}
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
              >
                {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Stop' : 'Run'}
              </Button>
              <Button
                onClick={handleClearCircuit}
                variant="outline"
                disabled={!activeCircuit}
                className="neon-border"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button onClick={handleSaveCircuit} variant="outline" className="neon-border">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleShareCircuit} variant="outline" className="neon-border">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleExportCircuit} variant="outline" className="neon-border">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <Tabs defaultValue="design" className="flex-1 flex flex-col">
            <div className="flex-none px-4 pt-4">
              <TabsList className="quantum-panel">
                <TabsTrigger value="design">Circuit Design</TabsTrigger>
                <TabsTrigger value="simulation">Simulation</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="design" className="flex-1 flex overflow-hidden m-0 p-4 pt-2">
              <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Gate Palette */}
                <div className="flex-none">
                  <OptimizedGatePalette
                    onGateAdd={handleGateAdd}
                    numQubits={activeCircuit?.qubits || 8}
                    gridSize={80}
                  />
                </div>

                {/* Circuit Canvas */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <WorkspaceToolbar
                    circuits={circuits}
                    activeCircuit={activeCircuit}
                    onCircuitSelect={setActiveCircuit}
                    onNewCircuit={createNewCircuit}
                    onDuplicateCircuit={duplicateCircuit}
                    onDeleteCircuit={deleteCircuit}
                  />
                  
                  <div className="flex-1 overflow-hidden">
                    <OptimizedCircuitCanvas
                      circuit={activeCircuit}
                      onGateRemove={handleGateRemove}
                      numQubits={activeCircuit?.qubits || 8}
                      gridSize={80}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="simulation" className="flex-1 overflow-hidden m-0 p-4 pt-2">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {simulationResult ? (
                    <div className="space-y-4">
                      <div className="text-sm font-mono text-quantum-glow">
                        Simulation completed successfully
                      </div>
                      <pre className="bg-quantum-matrix/20 p-4 rounded-lg text-xs overflow-auto">
                        {JSON.stringify(simulationResult, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Run a circuit to see simulation results
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dragging Gate Overlay */}
        <OptimizedDraggingGate />
      </div>
    </DragDropProvider>
  );
}
