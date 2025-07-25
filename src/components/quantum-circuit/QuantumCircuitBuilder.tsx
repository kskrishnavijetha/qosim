
import React, { useState, useEffect } from 'react';
import { GatePanel } from './GatePanel';
import { CircuitCanvas } from './CircuitCanvas';
import { Toolbar } from './Toolbar';
import { StateViewer } from './StateViewer';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { OptimizationPanel } from '@/components/optimization/OptimizationPanel';
import { useCircuitStore } from '@/store/circuitStore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Activity, Zap, Atom, Brain } from 'lucide-react';

interface DragState {
  isDragging: boolean;
  dragData: any;
  dragPosition: { x: number; y: number };
  hoverPosition: { qubit: number; timeStep: number } | null;
}

export function QuantumCircuitBuilder() {
  const { toast } = useToast();
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    selectedGate,
    removeGate,
    copyGate,
    pasteGate,
    clearCircuit,
    gates,
    numQubits,
    updateGates
  } = useCircuitStore();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragData: null,
    dragPosition: { x: 0, y: 0 },
    hoverPosition: null
  });

  // Touch drag handling
  const [touchDragState, setTouchDragState] = useState<{
    isDragging: boolean;
    gateData: any;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    gateData: null,
    offset: { x: 0, y: 0 }
  });

  const handleGateDragStart = (gate: any, e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(gate));
    setDragState({
      isDragging: true,
      dragData: gate,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverPosition: null
    });
  };

  const handleGateTouchStart = (gate: any, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    
    setTouchDragState({
      isDragging: true,
      gateData: gate,
      offset: {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    });

    e.preventDefault();
  };

  const handleOptimizedCircuit = (optimizedGates: any[]) => {
    updateGates(optimizedGates);
    toast({
      title: "Circuit optimized",
      description: "AI optimization has been applied to your circuit",
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

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
            if (selectedGate) {
              copyGate(selectedGate);
              toast({
                title: "Gate copied",
                description: `${selectedGate.type} gate copied to clipboard`,
              });
            }
            break;
          case 'v':
            e.preventDefault();
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            if (selectedGate) {
              removeGate(selectedGate.id);
              toast({
                title: "Gate deleted",
                description: `${selectedGate.type} gate removed`,
              });
            }
            break;
          case 'Escape':
            e.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGate, undo, redo, copyGate, removeGate, toast]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex-shrink-0 p-4">
        <Toolbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4 p-4 pt-0 min-h-0">
        {/* Top Section - Circuit Builder */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Left Panel - Gates */}
          <div className="w-80 flex-shrink-0">
            <GatePanel 
              onGateDragStart={handleGateDragStart}
              onGateTouchStart={handleGateTouchStart}
            />
          </div>

          {/* Center - Circuit Canvas */}
          <div className="flex-1 min-w-0">
            <CircuitCanvas 
              dragState={dragState}
              setDragState={setDragState}
            />
          </div>

          {/* Right Panel - State Viewer & AI Optimization */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <StateViewer />
            <OptimizationPanel 
              circuit={gates}
              onOptimizedCircuit={handleOptimizedCircuit}
            />
          </div>
        </div>

        {/* Dedicated Quantum Visualization Section */}
        <div className="flex-shrink-0">
          <Card className="quantum-panel neon-border bg-gradient-to-r from-quantum-void/30 to-quantum-matrix/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-quantum-glow flex items-center gap-3">
                <Atom className="w-6 h-6" />
                Quantum State Visualization Center
                <Badge variant="outline" className="text-quantum-neon animate-pulse">
                  REAL-TIME
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {gates.length} gates | {numQubits} qubits
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="bloch-spheres" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="bloch-spheres" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Bloch Spheres
                  </TabsTrigger>
                  <TabsTrigger value="amplitudes" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Amplitudes
                  </TabsTrigger>
                  <TabsTrigger value="step-by-step" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Step-by-Step
                  </TabsTrigger>
                  <TabsTrigger value="entanglement" className="flex items-center gap-2">
                    <Atom className="w-4 h-4" />
                    Entanglement
                  </TabsTrigger>
                  <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="bloch-spheres" className="space-y-4">
                  <div className="h-96 overflow-auto">
                    <QuantumStateVisualizer />
                  </div>
                </TabsContent>
                
                <TabsContent value="amplitudes" className="space-y-4">
                  <div className="h-96 overflow-auto">
                    <QuantumStateVisualizer />
                  </div>
                </TabsContent>
                
                <TabsContent value="step-by-step" className="space-y-4">
                  <div className="h-96 overflow-auto">
                    <QuantumStateVisualizer />
                  </div>
                </TabsContent>
                
                <TabsContent value="entanglement" className="space-y-4">
                  <div className="h-96 overflow-auto">
                    <QuantumStateVisualizer />
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-analysis" className="space-y-4">
                  <div className="h-96 overflow-auto">
                    <OptimizationPanel 
                      circuit={gates}
                      onOptimizedCircuit={handleOptimizedCircuit}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
