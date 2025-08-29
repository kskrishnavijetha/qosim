
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
import { Play, Square, RotateCcw, Settings } from 'lucide-react';

interface InteractiveCircuitBuilderProps {
  dragState?: any;
  circuitRef?: React.RefObject<HTMLDivElement>;
  onMouseDown?: (e: React.MouseEvent, gateType: string) => void;
  onTouchStart?: (e: React.TouchEvent, gateType: string) => void;
}

export function InteractiveCircuitBuilder({
  dragState,
  circuitRef,
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

  const [showResults, setShowResults] = useState(false);
  const [selectedGateType, setSelectedGateType] = useState('');

  const handleMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    setSelectedGateType(gateType);
    if (onMouseDown) {
      onMouseDown(e, gateType);
    }
  }, [onMouseDown]);

  const handleTouchStart = useCallback((e: React.TouchEvent, gateType: string) => {
    setSelectedGateType(gateType);
    if (onTouchStart) {
      onTouchStart(e, gateType);
    }
  }, [onTouchStart]);

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
            <GatePalette />
          </CardContent>
        </Card>

        {/* Circuit Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Quantum Circuit
              <Badge variant="outline" className="text-xs">
                4 Qubits
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div ref={circuitRef} className="h-full min-h-[400px] relative">
              <CircuitCanvas
                circuit={circuit}
                onGateClick={(gateId) => removeGate(gateId)}
                dragState={dragState}
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
            <CircuitActions
              onClearCircuit={clearCircuit}
              onSimulate={handleSimulate}
              isSimulating={isSimulating}
            />
            
            <Separator />
            
            <QuantumStateVisualization
              simulationResult={simulationResult}
              NUM_QUBITS={4}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
