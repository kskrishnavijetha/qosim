
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { GatePalette } from './GatePalette';
import { CircuitCanvas } from './CircuitCanvas';
import { CircuitActions } from './CircuitActions';
import { QuantumStateVisualization } from './QuantumStateVisualization';
import { QuantumResultsPage } from '@/components/QuantumResultsPage';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Play, Square, RotateCcw, Settings } from 'lucide-react';

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
    canUndo
  } = useCircuitState();

  // Use the drag drop hook
  const { dragState, circuitRef, handleMouseDown, handleTouchStart } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits: 5,
    gridSize: 100
  });

  const [showResults, setShowResults] = useState(false);
  const [selectedGateType, setSelectedGateType] = useState('');

  // Use external handlers if provided, otherwise use internal ones
  const finalHandleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    setSelectedGateType(gateType);
    if (onMouseDown) {
      onMouseDown(e, gateType);
    } else {
      handleMouseDown(e, gateType);
    }
  }, [onMouseDown, handleMouseDown]);

  const finalHandleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    setSelectedGateType(gateType);
    if (onTouchStart) {
      onTouchStart(e, gateType);
    } else {
      handleTouchStart(e, gateType);
    }
  }, [onTouchStart, handleTouchStart]);

  const handleSimulate = useCallback(async () => {
    try {
      await simulateCircuit();
      if (simulationResult) {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  }, [simulateCircuit, simulationResult]);

  const handleBackToBuilder = useCallback(() => {
    setShowResults(false);
  }, []);

  const handleRerun = useCallback(async () => {
    await handleSimulate();
  }, [handleSimulate]);

  // Dummy handlers for CircuitActions
  const handleExportJSON = () => {
    console.log('Export JSON clicked');
  };

  const handleExportQASM = () => {
    console.log('Export QASM clicked');
  };

  const handleShowExportDialog = () => {
    console.log('Show export dialog clicked');
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

  const getGateColor = (gateType: string) => {
    const colors: Record<string, string> = {
      'H': '#8B5CF6',
      'X': '#06B6D4',
      'Y': '#A855F7',
      'Z': '#7C3AED',
      'CNOT': '#A855F7',
      'RX': '#06B6D4',
      'RY': '#64748B',
      'RZ': '#F97316'
    };
    return colors[gateType] || '#64748B';
  };

  // Convert Gate[] to QuantumCircuit for CircuitCanvas
  const maxDepth = Math.max(1, ...circuit.map(g => g.position + 1));
  
  // Create circuit layers
  const circuitLayers = Array.from({ length: maxDepth }, (_, index) => ({
    id: `layer-${index}`,
    index,
    gates: circuit
      .filter(gate => gate.position === index)
      .map(gate => ({
        id: gate.id,
        type: gate.type,
        qubits: gate.qubits ? gate.qubits.map(q => `q${q}`) : (gate.qubit !== undefined ? [`q${gate.qubit}`] : []),
        position: { x: gate.position * 100, y: (gate.qubit || 0) * 80 },
        layer: gate.position,
        params: gate.angle ? { angle: gate.angle } : undefined,
        metadata: {
          label: gate.type,
          color: getGateColor(gate.type)
        }
      })),
    barrier: false
  }));

  const quantumCircuit = {
    id: 'current-circuit',
    name: 'Current Circuit',
    qubits: Array.from({ length: 5 }, (_, i) => ({
      id: `q${i}`,
      name: `q${i}`,
      state: 'computational' as const,
      index: i
    })),
    gates: circuit.map(gate => ({
      id: gate.id,
      type: gate.type,
      qubits: gate.qubits ? gate.qubits.map(q => `q${q}`) : (gate.qubit !== undefined ? [`q${gate.qubit}`] : []),
      position: { x: gate.position * 100, y: (gate.qubit || 0) * 80 },
      params: gate.angle ? { angle: gate.angle } : undefined,
      layer: gate.position,
      metadata: {
        label: gate.type,
        color: getGateColor(gate.type)
      }
    })),
    layers: circuitLayers,
    depth: maxDepth,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'Interactive circuit',
    metadata: {
      version: '1.0',
      creator: 'Interactive Builder',
      tags: ['interactive']
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Circuit Builder Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Interactive Circuit Builder</h2>
          <Badge variant="secondary">
            Gates: {circuit.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
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
        {/* Gate Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gate Palette</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <GatePalette 
              onGateMouseDown={finalHandleMouseDown}
              onGateTouchStart={finalHandleTouchStart}
            />
          </CardContent>
        </Card>

        {/* Circuit Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Quantum Circuit
              <Badge variant="outline" className="text-xs">
                5 Qubits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div ref={externalCircuitRef || circuitRef} className="h-full min-h-[400px] relative">
              <CircuitCanvas
                circuit={quantumCircuit}
                selectedGate={null}
                simulationResult={null}
                zoomLevel={1}
                panOffset={{ x: 0, y: 0 }}
                onGateAdd={() => {}}
                onGateMove={() => {}}
                onGateSelect={() => {}}
                onGateRemove={removeGate}
                onCanvasClick={() => {}}
                onPanStart={() => {}}
                onPanMove={() => {}}
                onPanEnd={() => {}}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onResetView={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSimulate}
              disabled={isSimulating || circuit.length === 0}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Simulate'}
            </Button>
            
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
              NUM_QUBITS={5}
              gates={circuit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
