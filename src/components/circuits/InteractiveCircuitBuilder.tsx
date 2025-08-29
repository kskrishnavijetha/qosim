import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CircuitGrid } from './CircuitGrid';
import { GatePalette } from './GatePalette';
import { CircuitActions } from './CircuitActions';
import { QuantumStateVisualization } from './QuantumStateVisualization';
import { QuantumResultsPage } from '../QuantumResultsPage';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Play, RotateCcw, Download, Share, Zap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface InteractiveCircuitBuilderProps {
  dragState?: any;
  circuitRef?: React.RefObject<HTMLDivElement>;
  onMouseDown?: (e: React.MouseEvent, gateType: string) => void;
  onTouchStart?: (e: React.TouchEvent, gateType: string) => void;
}

export function InteractiveCircuitBuilder({
  dragState: externalDragState,
  circuitRef: externalCircuitRef,
  onMouseDown: externalOnMouseDown,
  onTouchStart: externalOnTouchStart
}: InteractiveCircuitBuilderProps) {
  const [showResults, setShowResults] = useState(false);
  const [selectedGateType, setSelectedGateType] = useState<string | null>(null);
  
  const {
    circuit,
    addGate,
    removeGate,
    clearCircuit,
    simulateCircuit,
    simulationResult,
    isSimulating,
    undoLastAction,
    canUndo
  } = useCircuitState();

  // Use internal drag drop if external ones aren't provided
  const internalCircuitRef = useRef<HTMLDivElement>(null);
  const {
    dragState: internalDragState,
    circuitRef: _internalCircuitRef,
    handleMouseDown: internalHandleMouseDown,
    handleTouchStart: internalHandleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits: 4,
    gridSize: 100
  });

  // Use external props if provided, otherwise use internal
  const dragState = externalDragState || internalDragState;
  const circuitRef = externalCircuitRef || internalCircuitRef;
  const handleMouseDown = externalOnMouseDown || internalHandleMouseDown;
  const handleTouchStart = externalOnTouchStart || internalHandleTouchStart;

  const handleSimulate = useCallback(async () => {
    if (circuit.length === 0) {
      toast.error('Add some gates to the circuit first');
      return;
    }

    try {
      await simulateCircuit();
      setShowResults(true);
      toast.success('Simulation completed successfully!');
    } catch (error) {
      console.error('Simulation failed:', error);
      toast.error('Simulation failed. Check your circuit configuration.');
    }
  }, [circuit, simulateCircuit]);

  const handleClearCircuit = useCallback(() => {
    clearCircuit();
    setShowResults(false);
    toast.info('Circuit cleared');
  }, [clearCircuit]);

  const handleGateSelect = useCallback((gateType: string) => {
    setSelectedGateType(gateType);
    toast.info(`Selected ${gateType} gate - drag to the circuit`);
  }, []);

  const handleDeleteGate = useCallback((gateId: string) => {
    removeGate(gateId);
    toast.info('Gate removed');
  }, [removeGate]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undoLastAction();
      toast.info('Last action undone');
    }
  }, [canUndo, undoLastAction]);

  if (showResults && simulationResult) {
    return (
      <QuantumResultsPage
        results={simulationResult}
        circuit={circuit}
        onBack={() => setShowResults(false)}
        onRerun={handleSimulate}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Circuit Header */}
      <Card className="mx-4 mt-4 mb-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-quantum-glow" />
                Quantum Circuit Builder
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Gates: {circuit.length}
                </Badge>
                <Badge variant="secondary">
                  Qubits: 4
                </Badge>
                {selectedGateType && (
                  <Badge variant="outline" className="text-quantum-neon">
                    Selected: {selectedGateType}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Undo
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCircuit}
                disabled={circuit.length === 0}
              >
                Clear
              </Button>
              <Button
                onClick={handleSimulate}
                disabled={circuit.length === 0 || isSimulating}
                className="bg-quantum-glow hover:bg-quantum-glow/80"
              >
                {isSimulating ? (
                  <>
                    <Zap className="w-4 h-4 mr-1 animate-pulse" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Circuit Interface */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Gate Palette */}
        <Card className="w-80 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Gate Library</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <GatePalette
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              selectedGate={selectedGateType}
              dragState={dragState}
            />
          </CardContent>
        </Card>

        {/* Center Panel - Circuit Grid */}
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 p-0">
            <CircuitGrid
              circuit={circuit}
              dragState={dragState}
              simulationResult={simulationResult}
              onDeleteGate={handleDeleteGate}
              circuitRef={circuitRef}
              NUM_QUBITS={4}
              GRID_SIZE={100}
            />
          </CardContent>
        </Card>

        {/* Right Panel - Circuit Actions & State */}
        <Card className="w-80 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Circuit Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <CircuitActions
              onUndo={handleUndo}
              onClear={handleClearCircuit}
              onExportJSON={() => console.log('Export JSON')}
              onExportQASM={() => console.log('Export QASM')}
              onShowExportDialog={() => console.log('Show export dialog')}
              canUndo={canUndo}
            />
            
            <Separator />
            
            <QuantumStateVisualization
              simulationResult={simulationResult}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
