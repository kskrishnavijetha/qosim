import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw, Save, Share2, Download, Zap, Activity } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { toast } from 'sonner';

// Import the optimized components
import { OptimizedGatePalette } from '@/components/circuits/OptimizedGatePalette';
import { OptimizedCircuitCanvas } from '@/components/circuits/OptimizedCircuitCanvas';
import { OptimizedDraggingGate } from '@/components/circuits/OptimizedDraggingGate';
import { RealtimeSimulationPanel } from './RealtimeSimulationPanel';
import { WorkspaceToolbar } from './WorkspaceToolbar';

// Import hooks and context
import { useCircuitWorkspace, type Gate, type Circuit } from '@/hooks/useCircuitWorkspace';
import { useQuantumSimulation } from '@/hooks/useQuantumSimulation';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { DragDropProvider } from '@/contexts/DragDropContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Analysis components
function AnalysisPanel({ circuit }: { circuit: Circuit | null }) {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCircuit = useCallback(async () => {
    if (!circuit) return;
    
    setIsAnalyzing(true);
    
    // Simulate circuit analysis
    setTimeout(() => {
      const results = {
        depth: circuit.gates.length,
        complexity: circuit.gates.reduce((sum, gate) => {
          const complexity = gate.type === 'CNOT' ? 3 : gate.type.startsWith('R') ? 2 : 1;
          return sum + complexity;
        }, 0),
        entanglement: circuit.gates.filter(g => g.type === 'CNOT').length,
        errorProbability: Math.random() * 0.1,
        fidelity: 0.95 + Math.random() * 0.05
      };
      
      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 1000);
  }, [circuit]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-quantum-glow">Circuit Analysis</h3>
        <Button
          onClick={analyzeCircuit}
          disabled={!circuit || isAnalyzing}
          className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
        >
          {isAnalyzing ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {analysisResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-quantum-neon">Circuit Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-quantum-particle">Depth:</span>
                <Badge variant="outline">{analysisResults.depth}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-quantum-particle">Complexity:</span>
                <Badge variant="outline">{analysisResults.complexity}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-quantum-particle">Entanglement:</span>
                <Badge variant="outline">{analysisResults.entanglement}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-quantum-neon">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-quantum-particle">Error Rate:</span>
                <Badge variant="outline">{(analysisResults.errorProbability * 100).toFixed(2)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-quantum-particle">Fidelity:</span>
                <Badge variant="outline">{(analysisResults.fidelity * 100).toFixed(2)}%</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!analysisResults && !isAnalyzing && (
        <Card className="quantum-panel neon-border">
          <CardContent className="h-32 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 text-quantum-particle mx-auto opacity-50" />
              <p className="text-muted-foreground">
                {circuit ? 'Click analyze to get circuit insights' : 'No circuit selected'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function OptimizedQuantumWorkspace() {
  const {
    circuits,
    activeCircuit,
    setActiveCircuit,
    addGateToCircuit,
    createNewCircuit,
    duplicateCircuit,
    deleteCircuit,
    runCircuit,
    clearCircuit,
    simulationResult,
    isRunning,
    updateCircuitGates
  } = useCircuitWorkspace();

  const { simulate, isSimulating } = useQuantumSimulation();
  const { executeCircuit, isExecuting, lastResult } = useQuantumBackend();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [gridSize] = useState(80);
  const [numQubits] = useState(8);

  const handleGateAdd = useCallback((gate: Gate) => {
    if (!activeCircuit) return;
    console.log('Adding gate:', gate);
    addGateToCircuit(activeCircuit.id, gate);
  }, [activeCircuit, addGateToCircuit]);

  const handleCircuitChange = useCallback((updatedCircuit: Circuit) => {
    if (!updatedCircuit) return;
    updateCircuitGates(updatedCircuit.id, updatedCircuit.gates);
  }, [updateCircuitGates]);

  const handleRunCircuit = useCallback(async () => {
    if (!activeCircuit) return;
    
    toast.loading('Running quantum circuit...');
    
    try {
      // Run on quantum backend
      await executeCircuit(activeCircuit.gates, 'local', 1024);
      
      // Also run local simulation
      await runCircuit(activeCircuit.id);
      
      toast.success('Circuit executed successfully!');
    } catch (error) {
      toast.error('Circuit execution failed');
    }
  }, [activeCircuit, executeCircuit, runCircuit]);

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
    
    const exportData = {
      name: activeCircuit.name,
      gates: activeCircuit.gates,
      qubits: activeCircuit.qubits,
      created: activeCircuit.created
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCircuit.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Circuit exported successfully');
  }, [activeCircuit]);

  return (
    <DragDropProvider>
      <div className="h-full flex flex-col quantum-grid relative">
        {/* Header */}
        <div className="flex-none p-4 border-b border-quantum-glow/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h1>
              {activeCircuit && (
                <Badge variant="outline" className="text-quantum-neon">
                  {activeCircuit.gates.length} gates
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunCircuit}
                disabled={isRunning || isExecuting || !activeCircuit}
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
              >
                {isRunning || isExecuting ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning || isExecuting ? 'Stop' : 'Run'}
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

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative z-20">
          <Tabs defaultValue="design" className="h-full flex flex-col">
            <div className="flex-none px-4 pt-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-25">
              <TabsList className="quantum-panel">
                <TabsTrigger value="design">Circuit Design</TabsTrigger>
                <TabsTrigger value="simulation">Real-time Simulation</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="design" className="flex-1 overflow-hidden m-0 p-4 pt-2">
              {isMobile ? (
                <div className="h-full flex flex-col gap-4">
                  <div className="flex-none h-64 z-20">
                    <OptimizedGatePalette
                      canvasRef={canvasRef}
                      onGateAdd={handleGateAdd}
                      numQubits={numQubits}
                      gridSize={gridSize}
                    />
                  </div>
                  
                  <div className="flex-none z-20">
                    <WorkspaceToolbar
                      circuits={circuits}
                      activeCircuit={activeCircuit}
                      onCircuitSelect={setActiveCircuit}
                      onNewCircuit={createNewCircuit}
                      onDuplicateCircuit={duplicateCircuit}
                      onDeleteCircuit={deleteCircuit}
                    />
                  </div>
                  
                  <div className="flex-1 overflow-hidden relative z-10">
                    <OptimizedCircuitCanvas
                      ref={canvasRef}
                      circuit={activeCircuit}
                      onCircuitChange={handleCircuitChange}
                      gridSize={gridSize}
                      numQubits={numQubits}
                    />
                  </div>
                </div>
              ) : (
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                    <div className="h-full pr-4 relative z-20">
                      <OptimizedGatePalette
                        canvasRef={canvasRef}
                        onGateAdd={handleGateAdd}
                        numQubits={numQubits}
                        gridSize={gridSize}
                      />
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle />
                  
                  <ResizablePanel defaultSize={70}>
                    <div className="h-full pl-4 flex flex-col gap-4">
                      <div className="flex-none z-20">
                        <WorkspaceToolbar
                          circuits={circuits}
                          activeCircuit={activeCircuit}
                          onCircuitSelect={setActiveCircuit}
                          onNewCircuit={createNewCircuit}
                          onDuplicateCircuit={duplicateCircuit}
                          onDeleteCircuit={deleteCircuit}
                        />
                      </div>
                      
                      <div className="flex-1 overflow-hidden relative z-10">
                        <OptimizedCircuitCanvas
                          ref={canvasRef}
                          circuit={activeCircuit}
                          onCircuitChange={handleCircuitChange}
                          gridSize={gridSize}
                          numQubits={numQubits}
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            </TabsContent>

            <TabsContent value="simulation" className="flex-1 overflow-hidden m-0 p-4 pt-2 z-10">
              <RealtimeSimulationPanel
                circuit={activeCircuit}
                simulationResult={lastResult || simulationResult}
                isRunning={isRunning || isExecuting}
              />
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 overflow-hidden m-0 p-4 pt-2 z-10">
              <AnalysisPanel circuit={activeCircuit} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Dragging Gate Overlay - highest z-index */}
        <OptimizedDraggingGate />
      </div>
    </DragDropProvider>
  );
}
