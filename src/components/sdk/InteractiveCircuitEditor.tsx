
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { EnhancedCircuitEditor } from '@/components/circuits/EnhancedCircuitEditor';
import { Gate } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Trash2, Undo, Settings, Zap, Activity } from 'lucide-react';

interface InteractiveCircuitEditorProps {
  circuit: Gate[];
  onCircuitChange: (gates: Gate[]) => void;
  selectedAlgorithm?: string | null;
}

export function InteractiveCircuitEditor({ 
  circuit, 
  onCircuitChange, 
  selectedAlgorithm 
}: InteractiveCircuitEditorProps) {
  const [numQubits, setNumQubits] = useState(5);
  const [gridSize, setGridSize] = useState(50);
  const [history, setHistory] = useState<Gate[][]>([[]]);
  const [showConfig, setShowConfig] = useState(false);
  const circuitRef = useRef<HTMLDivElement>(null);

  const {
    dragState,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: (gate: Gate) => {
      const newCircuit = [...circuit, gate];
      onCircuitChange(newCircuit);
      setHistory(prev => [...prev, newCircuit]);
    },
    numQubits,
    gridSize
  });

  const handleDeleteGate = (gateId: string) => {
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    onCircuitChange(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousCircuit = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      onCircuitChange(previousCircuit);
    }
  };

  const handleClear = () => {
    onCircuitChange([]);
    setHistory([[]]);
  };

  const handleOptimizedCircuit = (optimizedGates: Gate[]) => {
    onCircuitChange(optimizedGates);
    setHistory(prev => [...prev, optimizedGates]);
  };

  return (
    <div className="space-y-6">
      {/* Compact Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Interactive Editor
          </h3>
          {selectedAlgorithm && (
            <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
              {selectedAlgorithm} Template
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowConfig(!showConfig)}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <Settings className="w-4 h-4 mr-1" />
            Config
          </Button>
          <Button
            onClick={handleUndo}
            disabled={history.length <= 1}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <Undo className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="neon-border text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Collapsible Circuit Configuration */}
      {showConfig && (
        <Card className="quantum-panel neon-border animate-in slide-in-from-top">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Quick Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-quantum-particle">Qubits: {numQubits}</Label>
                <Slider
                  value={[numQubits]}
                  onValueChange={(value) => setNumQubits(value[0])}
                  min={2}
                  max={10}
                  step={1}
                  className="quantum-slider"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-quantum-particle">Grid: {gridSize}px</Label>
                <Slider
                  value={[gridSize]}
                  onValueChange={(value) => setGridSize(value[0])}
                  min={30}
                  max={80}
                  step={5}
                  className="quantum-slider"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Circuit Editor with improved layout */}
      <EnhancedCircuitEditor
        circuit={circuit}
        dragState={dragState}
        simulationResult={null} // Will be connected to actual simulation
        onDeleteGate={handleDeleteGate}
        onGateMouseDown={handleMouseDown}
        onGateTouchStart={handleTouchStart}
        circuitRef={circuitRef}
        numQubits={numQubits}
        gridSize={gridSize}
        onOptimizedCircuit={handleOptimizedCircuit}
      />
    </div>
  );
}
