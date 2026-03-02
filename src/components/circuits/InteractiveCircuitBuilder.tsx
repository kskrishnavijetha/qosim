
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { Save, Upload, Download, Play, Pause, RotateCcw, Redo2, Bot, MoreHorizontal, Plus, Info } from 'lucide-react';
import { toast } from 'sonner';

export function InteractiveCircuitBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('design');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [gatePaletteOpen, setGatePaletteOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const {
    circuit, selectedGate, simulationResult, circuitHistory,
    addQubit, removeQubit, addGate, removeGate, moveGate,
    updateGateParams, selectGate, clearSelection, undo, redo,
    clearCircuit, saveCircuit, loadCircuit, simulateCircuit,
    exportCircuit, importCircuit, canUndo, canRedo
  } = useCircuitBuilder();

  const {
    zoomLevel, panOffset, handleZoomIn, handleZoomOut,
    handlePanStart, handlePanMove, handlePanEnd, resetView
  } = useZoomPan(canvasRef);

  useKeyboardShortcuts({
    'ctrl+z': undo, 'ctrl+y': redo, 'ctrl+s': () => saveCircuit(),
    'ctrl+n': clearCircuit, 'delete': () => selectedGate && removeGate(selectedGate.id),
    'escape': clearSelection, 'ctrl+=': handleZoomIn, 'ctrl+-': handleZoomOut,
    'ctrl+0': resetView, 'space': () => setIsSimulating(!isSimulating)
  });

  const handleSimulation = useCallback(async () => {
    if (isSimulating) { setIsSimulating(false); return; }
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
      a.href = url; a.download = `quantum_circuit.${format}`; a.click();
      URL.revokeObjectURL(url);
      toast.success(`Circuit exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed: ' + error);
    }
  }, [exportCircuit]);

  const handleAICircuitGenerated = useCallback((gates: any[]) => {
    const convertedCircuit = { ...circuit, gates: gates.map((gate, index) => ({ ...gate, id: `ai-gate-${index}`, timestamp: Date.now() })) };
    loadCircuit(convertedCircuit);
    toast.success(`Generated circuit with ${gates.length} gates`);
  }, [circuit, loadCircuit]);

  const handleAIAlgorithmGenerated = useCallback((code: string) => {
    console.log('Generated algorithm code:', code);
    toast.success('Algorithm code generated - check console for details');
  }, []);

  const handleAICircuitOptimized = useCallback((gates: any[]) => {
    const optimizedCircuit = { ...circuit, gates: gates.map((gate, index) => ({ ...gate, id: `opt-gate-${index}`, timestamp: Date.now() })) };
    loadCircuit(optimizedCircuit);
    toast.success('Circuit optimized successfully');
  }, [circuit, loadCircuit]);

  const handleAICircuitFixed = useCallback((gates: any[]) => {
    const fixedCircuit = { ...circuit, gates: gates.map((gate, index) => ({ ...gate, id: `fixed-gate-${index}`, timestamp: Date.now() })) };
    loadCircuit(fixedCircuit);
    toast.success('Circuit issues fixed');
  }, [circuit, loadCircuit]);

  const handleShowStateVisualization = useCallback((step: number) => {
    console.log('Showing state visualization for step:', step);
    toast.info(`Visualizing quantum state at step ${step}`);
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar - responsive */}
      <div className="flex items-center justify-between p-2 md:p-4 border-b bg-card gap-2 flex-wrap">
        {/* Primary actions */}
        <div className="flex items-center gap-1 md:gap-2 order-2 md:order-1">
          {/* Simulate - always visible, highest priority */}
          <Button
            variant={isSimulating ? "destructive" : "default"}
            size="sm"
            onClick={handleSimulation}
            disabled={circuit.gates.length === 0}
            className="min-h-[44px] md:min-h-0"
          >
            {isSimulating ? (
              <><Pause className="w-4 h-4 mr-1" />Stop</>
            ) : (
              <><Play className="w-4 h-4 mr-1" />Simulate</>
            )}
          </Button>

          {/* Save - always visible */}
          <Button variant="outline" size="sm" onClick={() => saveCircuit()} className="min-h-[44px] md:min-h-0">
            <Save className="w-4 h-4 md:mr-1" />
            <span className="hidden md:inline">Save</span>
          </Button>

          {/* Undo/Redo - visible on md+ */}
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} className="hidden md:inline-flex">
            <RotateCcw className="w-4 h-4 mr-1" />Undo
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} className="hidden md:inline-flex">
            <Redo2 className="w-4 h-4 mr-1" />Redo
          </Button>

          {/* Overflow menu for mobile - Import/Export/Undo/Redo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-[44px] md:min-h-0 md:hidden">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={undo} disabled={!canUndo}>
                <RotateCcw className="w-4 h-4 mr-2" />Undo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={redo} disabled={!canRedo}>
                <Redo2 className="w-4 h-4 mr-2" />Redo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Upload className="w-4 h-4 mr-2" />Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                <Download className="w-4 h-4 mr-2" />Export
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop-only Import/Export */}
          <Separator orientation="vertical" className="h-8 hidden md:block" />
          <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)} className="hidden md:inline-flex">
            <Upload className="w-4 h-4 mr-1" />Import
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)} className="hidden md:inline-flex">
            <Download className="w-4 h-4 mr-1" />Export
          </Button>
        </div>

        {/* Stats badges */}
        <div className="flex items-center gap-1 md:gap-2 order-1 md:order-2">
          <Badge variant="secondary" className="text-xs">Q: {circuit.qubits.length}</Badge>
          <Badge variant="secondary" className="text-xs">G: {circuit.gates.length}</Badge>
          <Badge variant="secondary" className="text-xs hidden md:inline-flex">Depth: {circuit.depth}</Badge>
        </div>
      </div>

      {/* Main Content - stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Panel - Gate Palette: hidden on mobile, shown in bottom sheet */}
        <div className="hidden md:block w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="ai"><Bot className="w-4 h-4 mr-1" />AI</TabsTrigger>
              <TabsTrigger value="simulate">Sim</TabsTrigger>
              <TabsTrigger value="collab">Collab</TabsTrigger>
            </TabsList>
            <TabsContent value="design" className="p-4">
              <GatePaletteAdvanced
                onGateSelect={addGate}
                onQubitAdd={addQubit}
                selectedGate={selectedGate ? { ...selectedGate, qubits: selectedGate.qubits.map(q => q.toString()) } as any : null}
                circuit={{
                  qubits: circuit.qubits.map((_, i) => ({ id: `q${i}`, name: `q${i}`, index: i })),
                  gates: circuit.gates.map(gate => ({ ...gate, qubits: gate.qubits.map(q => q.toString()), layer: gate.position || 0 })) as any
                }}
              />
            </TabsContent>
            <TabsContent value="ai" className="p-4">
              <UnifiedAIPanel circuit={circuit.gates} onCircuitGenerated={handleAICircuitGenerated} onAlgorithmGenerated={handleAIAlgorithmGenerated} onCircuitOptimized={handleAICircuitOptimized} onCircuitFixed={handleAICircuitFixed} onShowStateVisualization={handleShowStateVisualization} />
            </TabsContent>
            <TabsContent value="simulate" className="p-4">
              <CircuitSimulationPanel circuit={circuit} simulationResult={simulationResult} onSimulate={handleSimulation} isSimulating={isSimulating} />
            </TabsContent>
            <TabsContent value="collab" className="p-4">
              <CircuitCollaborationPanel circuit={circuit} onSave={saveCircuit} onLoad={loadCircuit} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Circuit Canvas */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-x-auto overflow-y-auto touch-pan-x touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
            <CircuitCanvas
              ref={canvasRef}
              circuit={circuit}
              selectedGate={selectedGate}
              simulationResult={simulationResult}
              zoomLevel={zoomLevel}
              panOffset={panOffset}
              onGateAdd={addGate}
              onGateMove={moveGate}
              onGateSelect={(gate) => {
                selectGate(gate);
                // On mobile, open properties sheet when gate is tapped
                if (window.innerWidth < 768 && gate) {
                  setPropertiesOpen(true);
                }
              }}
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

          {/* Mobile floating action buttons */}
          <div className="md:hidden flex items-center gap-2 p-2 border-t bg-card">
            {/* Add Gate - opens bottom sheet */}
            <Sheet open={gatePaletteOpen} onOpenChange={setGatePaletteOpen}>
              <SheetTrigger asChild>
                <Button variant="default" className="flex-1 min-h-[44px]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gate
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] bg-card">
                <SheetHeader>
                  <SheetTitle>Gate Palette</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-8">
                  <GatePaletteAdvanced
                    onGateSelect={addGate}
                    onQubitAdd={addQubit}
                    selectedGate={selectedGate ? { ...selectedGate, qubits: selectedGate.qubits.map(q => q.toString()) } as any : null}
                    circuit={{
                      qubits: circuit.qubits.map((_, i) => ({ id: `q${i}`, name: `q${i}`, index: i })),
                      gates: circuit.gates.map(gate => ({ ...gate, qubits: gate.qubits.map(q => q.toString()), layer: gate.position || 0 })) as any
                    }}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Gate Info - opens bottom sheet */}
            <Sheet open={propertiesOpen} onOpenChange={setPropertiesOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
                  <Info className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[60vh] bg-card">
                <SheetHeader>
                  <SheetTitle>Properties</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-8">
                  <CircuitPropertiesPanel
                    circuit={circuit}
                    selectedGate={selectedGate}
                    onGateUpdate={updateGateParams}
                    onQubitRemove={removeQubit}
                    simulationResult={simulationResult}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Right Panel - Properties: hidden on mobile */}
        <div className="hidden md:block w-80 border-l bg-card overflow-y-auto">
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
      <CircuitExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} circuit={circuit} onExport={handleExport} />
      <CircuitImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} onImport={importCircuit} />
    </div>
  );
}
