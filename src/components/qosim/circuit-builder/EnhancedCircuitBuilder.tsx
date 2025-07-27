
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Undo, 
  Redo, 
  Copy, 
  Clipboard, 
  Save, 
  Download,
  Upload,
  Zap,
  Eye,
  Settings,
  Lightbulb,
  Share2
} from 'lucide-react';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { CircuitCanvas } from './CircuitCanvas';
import { GatePalette } from './GatePalette';
import { SimulationPanel } from './SimulationPanel';
import { ExportImportPanel } from './ExportImportPanel';
import { AIOptimizationPanel } from './AIOptimizationPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { toast } from 'sonner';

export function EnhancedCircuitBuilder() {
  const {
    circuit,
    simulationResult,
    isSimulating,
    selectedGates,
    zoom,
    pan,
    canUndo,
    canRedo,
    addGate,
    deleteGate,
    moveGate,
    copyGates,
    pasteGates,
    undo,
    redo,
    clearCircuit,
    selectGate,
    deselectAll,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setZoom,
    setPan,
    exportCircuit,
    importCircuit
  } = useCircuitBuilder();

  const [activePanel, setActivePanel] = useState<'simulation' | 'export' | 'ai' | 'collaboration'>('simulation');
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [numQubits, setNumQubits] = useState(5);
  const [circuitDepth, setCircuitDepth] = useState(10);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, [setZoom]);

  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'c':
          e.preventDefault();
          copyGates();
          break;
        case 'v':
          e.preventDefault();
          pasteGates();
          break;
        case 's':
          e.preventDefault();
          exportCircuit('json');
          break;
        case 'r':
          e.preventDefault();
          startSimulation();
          break;
      }
    }
    
    if (e.key === 'Delete' || e.key === 'Backspace') {
      selectedGates.forEach(gateId => deleteGate(gateId));
    }
    
    if (e.key === 'Escape') {
      deselectAll();
    }
  }, [undo, redo, copyGates, pasteGates, exportCircuit, startSimulation, selectedGates, deleteGate, deselectAll]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [handleKeyboardShortcuts]);

  const sidebarPanels = [
    { id: 'simulation', label: 'Simulation', icon: Play },
    { id: 'export', label: 'Export/Import', icon: Download },
    { id: 'ai', label: 'AI Assistant', icon: Lightbulb },
    { id: 'collaboration', label: 'Collaborate', icon: Share2 }
  ];

  return (
    <div className="flex h-[800px] bg-background rounded-lg overflow-hidden">
      {/* Left Sidebar - Gate Palette */}
      <div className="w-64 border-r bg-card/50">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Gate Palette</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Qubits:</label>
              <Select value={numQubits.toString()} onValueChange={(v) => setNumQubits(parseInt(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Depth:</label>
              <Select value={circuitDepth.toString()} onValueChange={(v) => setCircuitDepth(parseInt(v))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="p-4">
          <GatePalette onGateSelect={addGate} />
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-card/30 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={undo} disabled={!canUndo}>
                  <Undo className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={redo} disabled={!canRedo}>
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={copyGates} disabled={selectedGates.length === 0}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={pasteGates}>
                  <Clipboard className="w-4 h-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-1">
                <Button 
                  size="sm" 
                  variant={isSimulating ? "destructive" : "default"}
                  onClick={isSimulating ? pauseSimulation : startSimulation}
                >
                  {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isSimulating ? 'Pause' : 'Simulate'}
                </Button>
                <Button size="sm" variant="outline" onClick={resetSimulation}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Zoom:</span>
                <Slider
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-20"
                />
                <span className="text-sm font-mono w-10">{Math.round(zoom * 100)}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">{circuit.length} gates</Badge>
                <Badge variant="outline">{selectedGates.length} selected</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative" ref={canvasRef}>
          <CircuitCanvas
            circuit={circuit}
            selectedGates={selectedGates}
            zoom={zoom}
            pan={pan}
            showGrid={showGrid}
            snapToGrid={snapToGrid}
            numQubits={numQubits}
            circuitDepth={circuitDepth}
            onGateSelect={selectGate}
            onGateMove={moveGate}
            onGateDelete={deleteGate}
            onPanChange={setPan}
          />
        </div>

        {/* Status Bar */}
        <div className="border-t bg-card/30 p-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</span>
              <span>Circuit: {circuit.length} gates, {numQubits} qubits</span>
              {simulationResult && (
                <span className="text-green-600">
                  Simulation: {simulationResult.executionTime}ms
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span>Ctrl+Z: Undo</span>
              <span>Ctrl+C: Copy</span>
              <span>Ctrl+V: Paste</span>
              <span>Del: Delete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Contextual Panels */}
      <div className="w-80 border-l bg-card/50">
        <div className="border-b">
          <div className="grid grid-cols-2 gap-1 p-2">
            {sidebarPanels.map(panel => {
              const Icon = panel.icon;
              return (
                <Button
                  key={panel.id}
                  variant={activePanel === panel.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActivePanel(panel.id as any)}
                  className="justify-start gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {panel.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
          {activePanel === 'simulation' && <SimulationPanel result={simulationResult} />}
          {activePanel === 'export' && <ExportImportPanel onExport={exportCircuit} onImport={importCircuit} />}
          {activePanel === 'ai' && <AIOptimizationPanel circuit={circuit} onOptimize={addGate} />}
          {activePanel === 'collaboration' && <CollaborationPanel />}
        </div>
      </div>
    </div>
  );
}
