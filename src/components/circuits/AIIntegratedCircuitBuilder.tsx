import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { CircuitCanvas } from './CircuitCanvas';
import { GatePaletteAdvanced } from './GatePaletteAdvanced';
import { CircuitPropertiesPanel } from './CircuitPropertiesPanel';
import { AICoPilotIntegration } from '../ai/AICoPilotIntegration';
import { CircuitCodeParser } from '@/lib/circuitCodeParser';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useZoomPan } from '@/hooks/useZoomPan';
import { Play, Pause, RotateCcw, Redo2, Save, Bot, Eye, Code2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function AIIntegratedCircuitBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('design');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showCodeSync, setShowCodeSync] = useState(false);
  const [lastAIInsert, setLastAIInsert] = useState<string | null>(null);

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
      toast({
        title: "🎯 Simulation Complete",
        description: "Circuit simulation completed successfully",
      });
    } catch (error) {
      toast({
        title: "❌ Simulation Error", 
        description: `Simulation failed: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  }, [isSimulating, simulateCircuit, toast]);

  // AI Co-Pilot Integration Handler
  const handleAICircuitInsert = useCallback((content: string, framework?: string) => {
    try {
      console.log('🤖 AI Co-Pilot: Inserting circuit from', framework);
      
      // Extract code blocks from the AI response
      const codeBlocks = CircuitCodeParser.extractCodeBlocks(content);
      
      if (codeBlocks.length === 0) {
        codeBlocks.push(content);
      }
      
      let totalGatesAdded = 0;
      let newGates: any[] = [];
      
      // Parse each code block
      for (const codeBlock of codeBlocks) {
        const parseResult = CircuitCodeParser.parseCircuitCode(codeBlock, framework);
        
        if (parseResult.success && parseResult.gates.length > 0) {
          console.log(`🤖 Parsed ${parseResult.gates.length} gates from ${parseResult.framework}`);
          
          // Ensure we have enough qubits
          const maxQubit = Math.max(
            ...parseResult.gates.flatMap(gate => 
              gate.qubits ? gate.qubits : gate.qubit !== undefined ? [gate.qubit] : []
            )
          );
          
          // Add qubits if needed
          while (circuit.qubits.length <= maxQubit) {
            addQubit();
          }
          
          // Convert parsed gates to circuit builder format
          const convertedGates = parseResult.gates.map((gate, index) => {
            const position = {
              x: 200 + (totalGatesAdded + index) * 100, // Space gates horizontally
              y: gate.qubit !== undefined 
                ? gate.qubit * 80 + 80 
                : (gate.qubits ? gate.qubits[0] * 80 + 80 : 80)
            };

            return {
              id: gate.id,
              type: gate.type.toUpperCase(),
              qubits: gate.qubits ? gate.qubits.map(String) : (gate.qubit !== undefined ? [String(gate.qubit)] : ['0']),
              position,
              params: gate.params ? { angle: gate.angle, params: gate.params } : undefined,
              metadata: {
                label: gate.type.toUpperCase(),
                color: getGateColor(gate.type),
                aiGenerated: true,
                framework: parseResult.framework
              },
              timestamp: Date.now()
            };
          });
          
          // Add gates to the circuit
          convertedGates.forEach(gate => {
            addGate(gate.type, gate.qubits, gate.position);
          });
          
          newGates = [...newGates, ...convertedGates];
          totalGatesAdded += parseResult.gates.length;
        }
      }
      
      if (totalGatesAdded > 0) {
        setLastAIInsert(`Added ${totalGatesAdded} ${framework || 'QOSim'} gates`);
        setShowCodeSync(true);
        
        toast({
          title: "🎯 AI Circuit Integrated",
          description: `Successfully added ${totalGatesAdded} gates from ${framework || 'QOSim'} to the visual canvas!`,
        });
        
        // Auto-hide the sync indicator after 3 seconds
        setTimeout(() => setShowCodeSync(false), 3000);
        
        // Auto-run simulation if gates were added
        if (circuit.gates.length > 0) {
          setTimeout(() => handleSimulation(), 500);
        }
      } else {
        toast({
          title: "💡 AI Guidance Received",
          description: "The AI provided quantum circuit guidance. Complex operations may need manual implementation.",
        });
      }
    } catch (error) {
      console.error('🤖 AI Integration Error:', error);
      toast({
        title: "⚠️ Integration Note",
        description: "AI content received. You may need to manually implement complex circuit operations.",
        variant: "default"
      });
    }
  }, [circuit, addQubit, addGate, toast, handleSimulation]);

  // Gate color helper
  const getGateColor = (gateType: string): string => {
    const colors: Record<string, string> = {
      'H': '#3b82f6',    // Blue for Hadamard
      'X': '#ef4444',    // Red for Pauli-X
      'Y': '#f59e0b',    // Yellow for Pauli-Y
      'Z': '#8b5cf6',    // Purple for Pauli-Z
      'CNOT': '#10b981', // Green for CNOT
      'CX': '#10b981',   // Green for CNOT variant
      'RX': '#f97316',   // Orange for rotations
      'RY': '#f97316',
      'RZ': '#f97316',
      'S': '#6366f1',    // Indigo for S gate
      'T': '#ec4899',    // Pink for T gate
    };
    return colors[gateType.toUpperCase()] || '#6b7280';
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Code Sync Indicator */}
      <AnimatePresence>
        {showCodeSync && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-quantum-glow/20 border border-quantum-glow rounded-lg px-4 py-2 flex items-center gap-2 backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-quantum-glow animate-pulse" />
              <Code2 className="w-4 h-4 text-quantum-glow" />
              <span className="text-sm font-medium text-quantum-glow">
                {lastAIInsert} - Code ↔ Visual Sync Active
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveCircuit()}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-quantum-glow">
            <Eye className="w-3 h-3 mr-1" />
            Qubits: {circuit.qubits.length}
          </Badge>
          <Badge variant="secondary" className="text-quantum-energy">
            Gates: {circuit.gates.length}
          </Badge>
          <Badge variant="secondary" className="text-quantum-plasma">
            Depth: {circuit.depth}
          </Badge>
          <Button
            variant={isSimulating ? "destructive" : "default"}
            size="sm"
            onClick={handleSimulation}
            disabled={circuit.gates.length === 0}
            className="ml-2"
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
        {/* Left Panel - Gate Palette & AI */}
        <div className="w-80 border-r bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="design">
                <Eye className="w-4 h-4 mr-1" />
                Design
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Bot className="w-4 h-4 mr-1" />
                AI Co-Pilot
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="p-4">
              <GatePaletteAdvanced
                onGateSelect={(gateType, qubits, position) => addGate(gateType, qubits, position)}
                onQubitAdd={addQubit}
                selectedGate={selectedGate}
              />
            </TabsContent>
            
            <TabsContent value="ai" className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-quantum-glow">
                    <Bot className="w-5 h-5" />
                    AI Circuit Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use natural language to generate quantum circuits. The AI will parse your request and add gates directly to the visual canvas.
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>• "Create a Bell state circuit"</div>
                    <div>• "Add Grover's algorithm for 2 qubits"</div>
                    <div>• "Generate QFT circuit"</div>
                  </div>
                </CardContent>
              </Card>
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

      {/* AI Co-Pilot Integration - Floating Button & Sidebar */}
      <AICoPilotIntegration onInsertToCanvas={handleAICircuitInsert} />
    </div>
  );
}