
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, Upload, Download, Play, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { GatePalette } from './GatePalette';
import { CircuitCanvas } from './CircuitCanvas';
import { ExportDialog } from '../dialogs/ExportDialog';
import { SimulationPanel } from './SimulationPanel';
import { useQuantumCircuitBuilder } from '@/hooks/useQuantumCircuitBuilder';
import { toast } from 'sonner';

export interface QuantumGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[];
  label?: string;
}

export function QuantumCircuitBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const {
    circuit,
    numQubits,
    selectedGate,
    simulationResult,
    addGate,
    removeGate,
    moveGate,
    selectGate,
    clearSelection,
    addQubit,
    removeQubit,
    clearCircuit,
    simulateCircuit,
    exportCircuit,
    importCircuit,
    saveCircuit,
    loadCircuit,
    canUndo,
    undo,
    redo
  } = useQuantumCircuitBuilder();

  const handleSimulation = useCallback(async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    try {
      await simulateCircuit();
      toast.success('Circuit simulation completed');
    } catch (error) {
      toast.error('Simulation failed: ' + (error as Error).message);
    } finally {
      setIsSimulating(false);
    }
  }, [isSimulating, simulateCircuit]);

  const handleExport = useCallback(async (format: string) => {
    try {
      const exportData = await exportCircuit(format);
      const blob = new Blob([exportData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantum_circuit.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Circuit exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed: ' + (error as Error).message);
    }
  }, [exportCircuit]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={redo}>
            <RotateCcw className="w-4 h-4 mr-1 scale-x-[-1]" />
            Redo
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button variant="outline" size="sm" onClick={saveCircuit}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={loadCircuit}>
            <Upload className="w-4 h-4 mr-1" />
            Load
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">Qubits: {numQubits}</Badge>
          <Badge variant="secondary">Gates: {circuit.length}</Badge>
          <Badge variant="secondary">
            Depth: {circuit.length > 0 ? Math.max(...circuit.map(g => g.position)) + 1 : 0}
          </Badge>
          <Separator orientation="vertical" className="h-8" />
          <Button
            variant={isSimulating ? "destructive" : "default"}
            size="sm"
            onClick={handleSimulation}
            disabled={circuit.length === 0}
          >
            {isSimulating ? (
              <>
                <Trash2 className="w-4 h-4 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Simulate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Gate Palette */}
        <div className="w-80 border-r bg-card">
          <Tabs defaultValue="gates" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gates">Gates</TabsTrigger>
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gates" className="p-4 h-full">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addQubit} className="flex-1">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Qubit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => numQubits > 1 && removeQubit(numQubits - 1)}
                    disabled={numQubits <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <GatePalette onGateSelect={addGate} />
              </div>
            </TabsContent>
            
            <TabsContent value="simulation" className="p-4 h-full">
              <SimulationPanel 
                simulationResult={simulationResult}
                onSimulate={handleSimulation}
                isSimulating={isSimulating}
                numQubits={numQubits}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Circuit Canvas */}
        <div className="flex-1 flex flex-col">
          <CircuitCanvas
            ref={canvasRef}
            circuit={circuit}
            numQubits={numQubits}
            selectedGate={selectedGate}
            onGateAdd={addGate}
            onGateMove={moveGate}
            onGateSelect={selectGate}
            onGateRemove={removeGate}
            onCanvasClick={clearSelection}
          />
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l bg-card p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Circuit Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedGate ? (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Selected Gate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="secondary">{selectedGate.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Position:</span>
                      <span className="text-sm">{selectedGate.position}</span>
                    </div>
                    {selectedGate.angle && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Angle:</span>
                        <span className="text-sm">{selectedGate.angle.toFixed(3)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Select a gate to view its properties
                </div>
              )}
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={clearCircuit}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Circuit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        circuit={circuit}
        circuitRef={canvasRef}
        numQubits={numQubits}
      />
    </div>
  );
}
