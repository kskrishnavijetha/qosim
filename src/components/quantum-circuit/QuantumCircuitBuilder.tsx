
import React, { useState, useEffect } from 'react';
import { GatePanel } from './GatePanel';
import { CircuitCanvas } from './CircuitCanvas';
import { Toolbar } from './Toolbar';
import { StateViewer } from './StateViewer';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { StepByStepExecutor } from './StepByStepExecutor';
import { useCircuitStore } from '@/store/circuitStore';
import { useQuantumSimulation } from '@/hooks/useQuantumSimulation';
import { useToast } from '@/hooks/use-toast';

interface DragState {
  isDragging: boolean;
  dragData: any;
  dragPosition: { x: number; y: number };
  hoverPosition: { qubit: number; timeStep: number } | null;
}

export function QuantumCircuitBuilder() {
  const { toast } = useToast();
  const { 
    gates,
    numQubits,
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

  const { simulate, simulationResult, isSimulating } = useQuantumSimulation();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragData: null,
    dragPosition: { x: 0, y: 0 },
    hoverPosition: null
  });

  const [executionMode, setExecutionMode] = useState<'full' | 'step'>('full');

  // Run simulation when gates change (full mode)
  useEffect(() => {
    if (executionMode === 'full' && gates.length > 0) {
      simulate(gates, numQubits);
    }
  }, [gates, numQubits, simulate, executionMode]);

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
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) {
      setDragState({
        isDragging: true,
        dragData: gate,
        dragPosition: { x: touch.clientX, y: touch.clientY },
        hoverPosition: null
      });
    }
  };

  const handleStepExecute = (gateIndex: number) => {
    const gatesToExecute = gates.slice(0, gateIndex + 1);
    simulate(gatesToExecute, numQubits);
  };

  const handleReset = () => {
    // Reset to initial state
    simulate([], numQubits);
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
            setDragState({
              isDragging: false,
              dragData: null,
              dragPosition: { x: 0, y: 0 },
              hoverPosition: null
            });
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
        <div className="w-80 flex-shrink-0 space-y-4">
          <GatePanel 
            onGateDragStart={handleGateDragStart}
            onGateTouchStart={handleGateTouchStart}
          />
          
          {/* Execution Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setExecutionMode('full')}
              className={`flex-1 px-3 py-2 text-xs rounded border transition-colors ${
                executionMode === 'full'
                  ? 'bg-quantum-glow text-quantum-void border-quantum-glow'
                  : 'bg-quantum-matrix text-quantum-neon border-quantum-matrix'
              }`}
            >
              Full Mode
            </button>
            <button
              onClick={() => setExecutionMode('step')}
              className={`flex-1 px-3 py-2 text-xs rounded border transition-colors ${
                executionMode === 'step'
                  ? 'bg-quantum-glow text-quantum-void border-quantum-glow'
                  : 'bg-quantum-matrix text-quantum-neon border-quantum-matrix'
              }`}
            >
              Step Mode
            </button>
          </div>

          {/* Step-by-Step Executor */}
          {executionMode === 'step' && (
            <StepByStepExecutor
              onStepExecute={handleStepExecute}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Center - Circuit Canvas */}
        <div className="flex-1 min-w-0">
          <CircuitCanvas 
            dragState={dragState}
            setDragState={setDragState}
          />
        </div>

        {/* Right Panel - State Viewer & Visualization */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
          <StateViewer />
          <QuantumStateVisualizer />
        </div>
      </div>
    </div>
  );
}
