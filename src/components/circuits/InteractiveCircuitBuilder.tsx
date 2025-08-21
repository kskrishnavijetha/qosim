
import React, { useState, useRef, useCallback, useEffect } from 'react';
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

// Types for AI integration compatibility
interface AIGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[];
}

export function InteractiveCircuitBuilder() {
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

  // Convert CircuitGate[] to AIGate[] for AI integration
  const convertCircuitToAIFormat = useCallback((circuitGates: any[]) => {
    return circuitGates.map((gate): AIGate => ({
      id: gate.id,
      type: gate.type,
      qubit: gate.qubits && gate.qubits.length > 0 ? 
        circuit.qubits.findIndex(q => q.id === gate.qubits[0]) : 
        undefined,
      qubits: gate.qubits ? 
        gate.qubits.map((qId: string) => circuit.qubits.findIndex(q => q.id === qId)) : 
        undefined,
      position: gate.layer || 0,
      angle: gate.params?.angle,
      params: gate.params ? Object.values(gate.params) : undefined
    }));
  }, [circuit]);

  // Convert AIGate[] back to circuit format
  const convertAIToCircuitFormat = useCallback((aiGates: AIGate[]) => {
    return aiGates.map((gate, index) => ({
      ...gate,
      id: gate.id || `ai-gate-${index}`,
      qubits: gate.qubits ? 
        gate.qubits.map(qIndex => circuit.qubits[qIndex]?.id).filter(Boolean) : 
        gate.qubit !== undefined ? [circuit.qubits[gate.qubit]?.id].filter(Boolean) : [],
      layer: gate.position || 0,
      position: { x: (gate.position || 0) * 100, y: (gate.qubit || 0) * 60 + 50 },
      params: gate.params ? { angle: gate.angle, ...gate.params } : gate.angle ? { angle: gate.angle } : {},
      metadata: {
        label: gate.type,
        color: getGateColor(gate.type)
      }
    }));
  }, [circuit]);

  // AI handlers with proper type conversion
  const handleAICircuitGenerated = useCallback((gates: AIGate[]) => {
    const convertedGates = convertAIToCircuitFormat(gates);
    const newCircuit = {
      ...circuit,
      gates: convertedGates
    };
    loadCircuit(newCircuit);
    toast.success(`Generated circuit with ${gates.length} gates`);
  }, [circuit, loadCircuit, convertAIToCircuitFormat]);

  const handleAIAlgorithmGenerated = useCallback((code: string) => {
    console.log('Generated algorithm code:', code);
    toast.success('Algorithm code generated - check console for details');
  }, []);

  const handleAICircuitOptimized = useCallback((gates: AIGate[]) => {
    const convertedGates = convertAIToCircuitFormat(gates);
    const optimizedCircuit = {
      ...circuit,
      gates: convertedGates
    };
    loadCircuit(optimizedCircuit);
    toast.success('Circuit optimized successfully');
  }, [circuit, loadCircuit, convertAIToCircuitFormat]);

  const handleAICircuitFixed = useCallback((gates: AIGate[]) => {
    const convertedGates = convertAIToCircuitFormat(gates);
    const fixedCircuit = {
      ...circuit,
      gates: convertedGates
    };
    loadCircuit(fixedCircuit);
    toast.success('Circuit issues fixed');
  }, [circuit, loadCircuit, convertAIToCircuitFormat]);

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
                onGateSelect={addGate}
                onQubitAdd={addQubit}
                selectedGate={selectedGate}
              />
            </TabsContent>
            
            <TabsContent value="ai" className="p-4">
              <UnifiedAIPanel
                circuit={convertCircuitToAIFormat(circuit.gates)}
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

// Helper function for gate colors (moved from useCircuitBuilder to avoid duplication)
function getGateColor(gateType: string): string {
  const colors: { [key: string]: string } = {
    'H': '#FFD700',
    'X': '#FF6B6B',
    'Y': '#4ECDC4',
    'Z': '#45B7D1',
    'CNOT': '#96CEB4',
    'RX': '#FFEAA7',
    'RY': '#DDA0DD',
    'RZ': '#98D8C8',
    'S': '#F7DC6F',
    'T': '#BB8FCE',
    'SWAP': '#85C1E9',
    'TOFFOLI': '#F8C471'
  };
  return colors[gateType] || '#BDC3C7';
}
