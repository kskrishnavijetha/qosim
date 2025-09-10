import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { CircuitCanvas } from './CircuitCanvas';
import { GatePaletteAdvanced } from './GatePaletteAdvanced';
import { CircuitPropertiesPanel } from './CircuitPropertiesPanel';
import { CircuitExportDialog } from './CircuitExportDialog';
import { CircuitImportDialog } from './CircuitImportDialog';
import { CircuitSimulationPanel } from './CircuitSimulationPanel';
import { CircuitCollaborationPanel } from './CircuitCollaborationPanel';
import { UnifiedAIPanel } from '../ai/UnifiedAIPanel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useZoomPan } from '@/hooks/useZoomPan';
import { Save, Upload, Download, Play, Pause, RotateCcw, Redo2, Zap, Users, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

export function FixedInteractiveBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('design');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const {
    circuit,
    selectedGate,
    simulationResult,
    circuitHistory,
    addQubit,
    removeQubit,
    addGate,
    removeGate,
    moveGate,
    updateGateParams,
    selectGate,
    clearSelection,
    undo,
    redo,
    clearCircuit,
    saveCircuit,
    loadCircuit,
    simulateCircuit,
    exportCircuit,
    importCircuit,
    canUndo,
    canRedo
  } = useCircuitBuilder();

  const {
    zoomLevel,
    panOffset,
    handleZoomIn,
    handleZoomOut,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    resetView
  } = useZoomPan(canvasRef);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+z': undo,
    'ctrl+y': redo,
    'ctrl+s': () => saveCircuit(),
    'ctrl+n': clearCircuit,
    'delete': () => selectedGate && removeGate(selectedGate.id),
    'escape': clearSelection,
    'ctrl+=': handleZoomIn,
    'ctrl+-': handleZoomOut,
    'ctrl+0': resetView,
    'space': () => setIsSimulating(!isSimulating)
  });

  // Fixed gate adding function compatible with old interface
  const handleGateAdd = useCallback((gateType: string, qubits: string[], position: { x: number; y: number }, controlTarget?: { control: number; target: number }) => {
    const numericQubits = qubits.map(q => parseInt(q));
    const gatePosition = Math.max(0, Math.floor(position.x / 100));
    
    const gateData = {
      id: nanoid(),
      type: gateType,
      qubit: numericQubits[0],
      qubits: numericQubits,
      position: gatePosition,
      params: controlTarget ? { control: controlTarget.control, target: controlTarget.target } : undefined,
      metadata: {
        angle: 0
      }
    };
    
    // Use the correct addGate signature: (gateType, qubits, position, controlTarget)
    addGate(gateType, [gateData.qubit.toString()], { x: position.x, y: position.y }, controlTarget);
    toast.success(`${gateType} gate added`);
  }, [addGate]);

  const handleSimulation = useCallback(async () => {
    if (isSimulating) {
      setIsSimulating(false);
      return;
    }

    setIsSimulating(true);
    try {
      await simulateCircuit();
      toast.success('Circuit simulation completed');
    } catch (error) {
      toast.error('Simulation failed: ' + error);
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
      toast.error('Export failed: ' + error);
    }
  }, [exportCircuit]);

  // AI handlers
  const handleAICircuitGenerated = useCallback((gates: any[]) => {
    const convertedCircuit = {
      ...circuit,
      gates: gates.map((gate, index) => ({
        ...gate,
        id: `ai-gate-${index}`,
        timestamp: Date.now()
      }))
    };
    loadCircuit(convertedCircuit);
    toast.success(`Generated circuit with ${gates.length} gates`);
  }, [circuit, loadCircuit]);

  const handleAIAlgorithmGenerated = useCallback((code: string) => {
    console.log('Generated algorithm code:', code);
    toast.success('Algorithm code generated - check console for details');
  }, []);

  const handleAICircuitOptimized = useCallback((gates: any[]) => {
    const optimizedCircuit = {
      ...circuit,
      gates: gates.map((gate, index) => ({
        ...gate,
        id: `opt-gate-${index}`,
        timestamp: Date.now()
      }))
    };
    loadCircuit(optimizedCircuit);
    toast.success('Circuit optimized successfully');
  }, [circuit, loadCircuit]);

  const handleAICircuitFixed = useCallback((gates: any[]) => {
    const fixedCircuit = {
      ...circuit,
      gates: gates.map((gate, index) => ({
        ...gate,
        id: `fixed-gate-${index}`,
        timestamp: Date.now()
      }))
    };
    loadCircuit(fixedCircuit);
    toast.success('Circuit issues fixed');
  }, [circuit, loadCircuit]);

  const handleShowStateVisualization = useCallback((step: number) => {
    console.log('Showing state visualization for step:', step);
    toast.info(`Visualizing quantum state at step ${step}`);
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4 mr-1" />
            Redo
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveCircuit()}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Qubits: {circuit.qubits.length}
          </Badge>
          <Badge variant="secondary">
            Gates: {circuit.gates.length}
          </Badge>
          <Badge variant="secondary">
            Depth: {circuit.depth}
          </Badge>
          <Separator orientation="vertical" className="h-8" />
          <Button
            variant={isSimulating ? "destructive" : "default"}
            size="sm"
            onClick={handleSimulation}
            disabled={circuit.gates.length === 0}
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="ai">
                <Bot className="w-4 h-4 mr-1" />
                AI
              </TabsTrigger>
              <TabsTrigger value="simulate">Simulate</TabsTrigger>
              <TabsTrigger value="collab">Collab</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="p-4">
              <GatePaletteAdvanced
                onGateSelect={handleGateAdd}
                onQubitAdd={addQubit}
                selectedGate={selectedGate ? {
                  ...selectedGate,
                  qubits: selectedGate.qubits || []
                } as any : null}
                circuit={{
                  qubits: circuit.qubits.map((qubit, i) => ({ 
                    id: qubit.id, 
                    name: qubit.name, 
                    index: i 
                  })),
                  gates: circuit.gates.map(gate => ({
                    ...gate,
                    qubits: gate.qubits || [],
                    layer: gate.layer || 0
                  })) as any
                }}
              />
            </TabsContent>
            
            <TabsContent value="ai" className="p-4">
              <UnifiedAIPanel
                circuit={circuit.gates}
                onCircuitGenerated={handleAICircuitGenerated}
                onAlgorithmGenerated={handleAIAlgorithmGenerated}
                onCircuitOptimized={handleAICircuitOptimized}
                onCircuitFixed={handleAICircuitFixed}
                onShowStateVisualization={handleShowStateVisualization}
              />
            </TabsContent>
            
            <TabsContent value="simulate" className="p-4">
              <CircuitSimulationPanel
                circuit={circuit}
                simulationResult={simulationResult}
                onSimulate={handleSimulation}
                isSimulating={isSimulating}
              />
            </TabsContent>
            
            <TabsContent value="collab" className="p-4">
              <CircuitCollaborationPanel
                circuit={circuit}
                onSave={saveCircuit}
                onLoad={loadCircuit}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Circuit Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <CircuitCanvas
              ref={canvasRef}
              circuit={circuit}
              selectedGate={selectedGate}
              simulationResult={simulationResult}
              zoomLevel={zoomLevel}
              panOffset={panOffset}
              onGateAdd={addGate}
              onGateMove={moveGate}
              onGateSelect={selectGate}
              onGateRemove={removeGate}
              onCanvasClick={clearSelection}
              onPanStart={handlePanStart}
              onPanMove={handlePanMove}
              onPanEnd={handlePanEnd}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetView={resetView}
            />
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 border-l bg-card">
          <CircuitPropertiesPanel
            circuit={circuit}
            selectedGate={selectedGate}
            onGateUpdate={updateGateParams}
            onQubitRemove={removeQubit}
            simulationResult={simulationResult}
          />
        </div>
      </div>

      {/* Dialogs */}
      <CircuitExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        circuit={circuit}
        onExport={handleExport}
      />
      
      <CircuitImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImport={importCircuit}
      />
    </div>
  );
}