
import React, { useState, useEffect } from 'react';
import { GatePanel } from './GatePanel';
import { CircuitCanvas } from './CircuitCanvas';
import { Toolbar } from './Toolbar';
import { StateViewer } from './StateViewer';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { useCircuitStore } from '@/store/circuitStore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    clearCircuit
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
      <div className="flex-1 flex gap-4 p-4 pt-0 min-h-0">
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

        {/* Right Panel - State Viewer and Visualization */}
        <div className="w-80 flex-shrink-0">
          <Tabs defaultValue="state" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="state">Circuit State</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="state" className="h-full">
              <StateViewer />
            </TabsContent>
            
            <TabsContent value="visualization" className="h-full">
              <QuantumStateVisualizer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
