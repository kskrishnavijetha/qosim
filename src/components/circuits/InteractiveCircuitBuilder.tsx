
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { GatePalette } from './GatePalette';
import { CircuitGrid } from './CircuitGrid';
import { CircuitActions } from './CircuitActions';
import { QuantumStateVisualization } from './QuantumStateVisualization';
import { QuantumResultsPage } from '@/components/QuantumResultsPage';
import { QubitSelector } from './QubitSelector';
import { ExportDialog } from '@/components/dialogs/ExportDialog';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Play, Square, RotateCcw, Settings, Download } from 'lucide-react';

interface InteractiveCircuitBuilderProps {
  dragState?: any;
  circuitRef?: React.RefObject<HTMLDivElement>;
  onMouseDown?: (e: React.MouseEvent, gateType: string) => void;
  onTouchStart?: (e: React.TouchEvent, gateType: string) => void;
}

export function InteractiveCircuitBuilder({
  dragState: externalDragState,
  circuitRef: externalCircuitRef,
  onMouseDown,
  onTouchStart
}: InteractiveCircuitBuilderProps) {
  const {
    circuit,
    addGate,
    removeGate,
    clearCircuit,
    simulateCircuit,
    simulationResult,
    isSimulating,
    undoLastAction,
    canUndo,
    numQubits,
    setNumQubits
  } = useCircuitState();

  // Use the drag drop hook with dynamic qubit count
  const { dragState, circuitRef, handleMouseDown, handleTouchStart } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits,
    gridSize: 100
  });

  const [showResults, setShowResults] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedGateType, setSelectedGateType] = useState('');

  // Use external handlers if provided, otherwise use internal ones
  const finalHandleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    console.log('🎯 Mouse down on gate:', gateType);
    setSelectedGateType(gateType);
    if (onMouseDown) {
      onMouseDown(e, gateType);
    } else {
      handleMouseDown(e, gateType);
    }
  }, [onMouseDown, handleMouseDown]);

  const finalHandleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    console.log('🎯 Touch start on gate:', gateType);
    setSelectedGateType(gateType);
    if (onTouchStart) {
      onTouchStart(e, gateType);
    } else {
      handleTouchStart(e, gateType);
    }
  }, [onTouchStart, handleTouchStart]);

  const handleSimulate = useCallback(async () => {
    console.log('🔄 Starting simulation with', circuit.length, 'gates');
    try {
      await simulateCircuit();
      console.log('✅ Simulation completed, result:', simulationResult);
      if (simulationResult) {
        setShowResults(true);
      }
    } catch (error) {
      console.error('❌ Simulation failed:', error);
    }
  }, [simulateCircuit, simulationResult]);

  const handleBackToBuilder = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleRerun = useCallback(async () => {
    await handleSimulate();
  }, [handleSimulate]);

  const handleQubitCountChange = useCallback((count: number) => {
    console.log('🔢 Changing qubit count to:', count);
    setNumQubits(count);
    // Clear circuit when changing qubit count to avoid invalid states
    clearCircuit();
  }, [setNumQubits, clearCircuit]);

  // Export handlers
  const handleExportJSON = () => {
    setShowExportDialog(true);
  };

  const handleExportQASM = () => {
    setShowExportDialog(true);
  };

  const handleShowExportDialog = () => {
    setShowExportDialog(true);
  };

  if (showResults && simulationResult) {
    return (
      <QuantumResultsPage
        results={simulationResult}
        circuit={circuit}
        onBack={handleBackToBuilder}
        onRerun={handleRerun}
      />
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Circuit Builder Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Interactive Circuit Builder</h2>
          <Badge variant="secondary">
            Gates: {circuit.length}
          </Badge>
          <Badge variant="outline">
            Depth: {Math.max(1, ...circuit.map(g => g.position + 1))}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowExportDialog}
            disabled={circuit.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={undoLastAction}
            disabled={!canUndo}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCircuit}
            disabled={circuit.length === 0}
          >
            <Square className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Gate Palette & Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Controls & Gates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Qubit Selector */}
            <QubitSelector
              numQubits={numQubits}
              onQubitCountChange={handleQubitCountChange}
              maxQubits={10}
              minQubits={2}
            />
            
            <Separator />
            
            {/* Simulation Button */}
            <Button
              onClick={handleSimulate}
              disabled={isSimulating || circuit.length === 0}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Simulate'}
            </Button>
            
            <Separator />
            
            {/* Gate Palette */}
            <div className="flex-1 overflow-y-auto max-h-96">
              <GatePalette 
                onGateMouseDown={finalHandleMouseDown}
                onGateTouchStart={finalHandleTouchStart}
              />
            </div>
          </CardContent>
        </Card>

        {/* Circuit Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Quantum Circuit
              <Badge variant="outline" className="text-xs">
                {numQubits} Qubits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full min-h-[400px] relative">
              <CircuitGrid
                circuit={circuit}
                dragState={externalDragState || dragState}
                simulationResult={simulationResult}
                onDeleteGate={removeGate}
                circuitRef={externalCircuitRef || circuitRef}
                NUM_QUBITS={numQubits}
                GRID_SIZE={100}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CircuitActions
              onUndo={undoLastAction}
              onClear={clearCircuit}
              onExportJSON={handleExportJSON}
              onExportQASM={handleExportQASM}
              onShowExportDialog={handleShowExportDialog}
              canUndo={canUndo}
            />
            
            <Separator />
            
            <QuantumStateVisualization
              simulationResult={simulationResult}
              NUM_QUBITS={numQubits}
              gates={circuit}
            />
          </CardContent>
        </Card>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        circuit={circuit}
        circuitRef={externalCircuitRef || circuitRef}
        numQubits={numQubits}
      />
    </div>
  );
}
