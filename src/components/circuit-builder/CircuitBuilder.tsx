
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { GatePalette } from './GatePalette';
import { CircuitCanvas } from './CircuitCanvas';
import { SimulationPanel } from './SimulationPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { ExportPanel } from './ExportPanel';
import { ImportPanel } from './ImportPanel';
import { AIAssistant } from './AIAssistant';
import { 
  Undo, 
  Redo, 
  Copy, 
  Paste, 
  Save, 
  Share, 
  Zap,
  Bot,
  Users,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function CircuitBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [showAI, setShowAI] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  
  const {
    circuit,
    history,
    dragState,
    simulationResult,
    isSimulating,
    canUndo,
    canRedo,
    selectedGates,
    zoom,
    pan,
    addGate,
    deleteGate,
    moveGate,
    copyGates,
    pasteGates,
    undo,
    redo,
    clearCircuit,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setZoom,
    setPan,
    selectGate,
    deselectAll,
    handleDragStart,
    handleDragEnd,
    exportCircuit,
    importCircuit
  } = useCircuitBuilder();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          case 'y':
            e.preventDefault();
            redo();
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
            // Save circuit
            break;
          case 'a':
            e.preventDefault();
            // Select all gates
            break;
        }
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedGates.forEach(gateId => deleteGate(gateId));
        deselectAll();
      }
      
      if (e.key === 'Escape') {
        deselectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGates, undo, redo, copyGates, pasteGates, deleteGate, deselectAll]);

  const circuitStats = {
    totalGates: circuit.length,
    depth: circuit.length > 0 ? Math.max(...circuit.map(g => g.layer)) + 1 : 0,
    qubits: new Set(circuit.flatMap(g => g.qubits)).size,
    types: new Set(circuit.map(g => g.type)).size
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Toolbar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Quantum Circuit Builder</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{circuitStats.totalGates} Gates</Badge>
              <Badge variant="secondary">Depth: {circuitStats.depth}</Badge>
              <Badge variant="secondary">{circuitStats.qubits} Qubits</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo className="w-4 h-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo className="w-4 h-4 mr-1" />
              Redo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyGates}
              disabled={selectedGates.length === 0}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={pasteGates}
            >
              <Paste className="w-4 h-4 mr-1" />
              Paste
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCollaboration(!showCollaboration)}
            >
              <Users className="w-4 h-4 mr-1" />
              Collaborate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAI(!showAI)}
            >
              <Bot className="w-4 h-4 mr-1" />
              AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Gate Palette */}
        <div className="w-80 border-r border-border">
          <GatePalette onGateSelect={handleDragStart} />
        </div>

        {/* Main Circuit Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <CircuitCanvas
              ref={canvasRef}
              circuit={circuit}
              dragState={dragState}
              selectedGates={selectedGates}
              zoom={zoom}
              pan={pan}
              onGateAdd={addGate}
              onGateSelect={selectGate}
              onGateMove={moveGate}
              onGateDelete={deleteGate}
              onZoomChange={setZoom}
              onPanChange={setPan}
              onDeselectAll={deselectAll}
              onDragEnd={handleDragEnd}
            />
            
            {/* Simulation Controls */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startSimulation}
                disabled={isSimulating}
              >
                <Play className="w-4 h-4 mr-1" />
                Simulate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={pauseSimulation}
                disabled={!isSimulating}
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetSimulation}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Tabs */}
        <div className="w-96 border-l border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="simulate">Simulate</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
              <TabsTrigger value="import">Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="h-full p-4">
              <SimulationPanel 
                circuit={circuit}
                simulationResult={simulationResult}
                isSimulating={isSimulating}
              />
            </TabsContent>
            
            <TabsContent value="simulate" className="h-full p-4">
              <SimulationPanel 
                circuit={circuit}
                simulationResult={simulationResult}
                isSimulating={isSimulating}
              />
            </TabsContent>
            
            <TabsContent value="export" className="h-full p-4">
              <ExportPanel 
                circuit={circuit}
                onExport={exportCircuit}
              />
            </TabsContent>
            
            <TabsContent value="import" className="h-full p-4">
              <ImportPanel 
                onImport={importCircuit}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAI && (
        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-50">
          <AIAssistant 
            circuit={circuit}
            onClose={() => setShowAI(false)}
            onSuggestion={addGate}
          />
        </div>
      )}

      {/* Collaboration Panel */}
      {showCollaboration && (
        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-50">
          <CollaborationPanel 
            circuit={circuit}
            onClose={() => setShowCollaboration(false)}
          />
        </div>
      )}
    </div>
  );
}
