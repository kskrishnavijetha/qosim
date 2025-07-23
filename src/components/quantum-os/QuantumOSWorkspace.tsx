
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Save, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { QuantumGatePalette } from './QuantumGatePalette';
import { DragDropCircuitBuilder } from './DragDropCircuitBuilder';
import { RealtimeSimulationPanel } from './RealtimeSimulationPanel';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { CircuitExporter } from './CircuitExporter';
import { useCircuitWorkspace, type Gate, type Circuit } from '@/hooks/useCircuitWorkspace';

export function QuantumOSWorkspace() {
  // Access the circuit workspace context
  const {
    circuits,
    activeCircuitId,
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

  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [showExporter, setShowExporter] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGateSelect = (gateType: string) => {
    setSelectedGate(gateType);
  };

  const handleCanvasClick = (x: number, y: number) => {
    if (!selectedGate || !activeCircuit) return;
    
    // Convert screen coordinates to grid position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    
    // Simple grid calculation (adjust based on your grid size)
    const qubit = Math.floor(relativeY / 60); // Assuming 60px per qubit row
    const position = Math.floor(relativeX / 80); // Assuming 80px per position
    
    if (qubit >= 0 && qubit < 8) { // Max 8 qubits
      const newGate: Gate = {
        id: `gate_${Date.now()}`,
        type: selectedGate,
        qubit,
        position
      };
      
      addGateToCircuit(activeCircuit.id, newGate);
      setSelectedGate(null);
    }
  };

  const handleRunCircuit = async () => {
    if (!activeCircuit) return;
    await runCircuit(activeCircuit.id);
  };

  const handleSaveCircuit = () => {
    if (!activeCircuit) return;
    toast.success(`Circuit "${activeCircuit.name}" saved successfully`);
  };

  const handleExportCircuit = () => {
    setShowExporter(true);
  };

  const handleShareCircuit = () => {
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
  };

  const handleCircuitChange = (updatedCircuit: Circuit) => {
    if (!updatedCircuit) return;
    updateCircuitGates(updatedCircuit.id, updatedCircuit.gates);
  };

  return (
    <div className="h-full flex flex-col quantum-grid">
      {/* Header */}
      <div className="flex-none p-4 border-b border-quantum-glow/20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-quantum-glow">Quantum OS Workspace</h1>
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
              onClick={() => activeCircuit && clearCircuit(activeCircuit.id)}
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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs defaultValue="design" className="flex-1 flex flex-col">
          <div className="flex-none px-4 pt-4">
            <TabsList className="quantum-panel">
              <TabsTrigger value="design">Circuit Design</TabsTrigger>
              <TabsTrigger value="simulation">Real-time Simulation</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="design" className="flex-1 flex overflow-hidden m-0 p-4 pt-2">
            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* Gate Palette */}
              <div className="flex-none w-64">
                <QuantumGatePalette
                  onGateSelect={handleGateSelect}
                  selectedGate={selectedGate}
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
                  <DragDropCircuitBuilder
                    circuit={activeCircuit}
                    onCircuitChange={handleCircuitChange}
                    onCanvasClick={handleCanvasClick}
                    ref={canvasRef}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="flex-1 overflow-hidden m-0 p-4 pt-2">
            <RealtimeSimulationPanel
              circuit={activeCircuit}
              simulationResult={simulationResult}
              isRunning={isRunning}
            />
          </TabsContent>

          <TabsContent value="analysis" className="flex-1 overflow-hidden m-0 p-4 pt-2">
            <Card className="h-full quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Circuit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed circuit analysis tools coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Dialog */}
      {showExporter && activeCircuit && (
        <CircuitExporter
          circuit={activeCircuit}
          onClose={() => setShowExporter(false)}
          onExport={(format: string) => {
            exportCircuit(format);
            setShowExporter(false);
          }}
        />
      )}
    </div>
  );
}
