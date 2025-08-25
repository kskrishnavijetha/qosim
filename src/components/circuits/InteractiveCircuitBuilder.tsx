
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCircuitState } from '@/hooks/useCircuitState';
import { GatePalette } from './GatePalette';
import { CircuitCanvas } from './CircuitCanvas';
import { CircuitActions } from './CircuitActions';
import { Play, Zap, Settings, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuantumResultsPage } from '../QuantumResultsPage';

export function InteractiveCircuitBuilder() {
  const {
    circuit,
    addGate,
    deleteGate,
    clearCircuit,
    simulateQuantumState,
    simulationResult,
    isSimulating,
    numQubits,
    setNumQubits,
    simulationMode,
    setSimulationMode,
    undo,
    canUndo
  } = useCircuitState();

  const [showResults, setShowResults] = useState(false);
  const [selectedGate, setSelectedGate] = useState(null);
  const [shots, setShots] = useState(1024);
  const navigate = useNavigate();

  // Convert circuit simulation mode to the mode expected by the UI
  const handleModeChange = (mode: string) => {
    if (mode === 'statevector' || mode === 'sampling') {
      // Convert to EnhancedSimulationMode
      const enhancedMode = mode === 'statevector' ? 'fast' : 'accurate';
      setSimulationMode(enhancedMode);
    }
  };

  const handleGateSelect = (gate: any) => {
    setSelectedGate(gate);
  };

  const handleAddGate = (newGate: any) => {
    try {
      addGate(newGate);
    } catch (error) {
      console.error('Error adding gate:', error);
    }
  };

  const handleSimulate = async () => {
    try {
      console.log('Starting simulation with circuit:', circuit);
      await simulateQuantumState(circuit);
      
      if (simulationResult) {
        setShowResults(true);
        console.log('Simulation completed, showing results');
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  };

  const handleGateMouseDown = (e: React.MouseEvent, gateType: string) => {
    console.log('Gate mouse down:', gateType);
    // Handle gate drag start
  };

  const handleGateTouchStart = (e: React.TouchEvent, gateType: string) => {
    console.log('Gate touch start:', gateType);
    // Handle gate touch start
  };

  if (showResults && simulationResult) {
    return (
      <QuantumResultsPage
        result={simulationResult}
        circuit={circuit}
        onBack={() => setShowResults(false)}
      />
    );
  }

  // Convert OptimizedSimulationResult to proper format for CircuitCanvas
  const convertedSimulationResult = simulationResult ? {
    stateVector: simulationResult.stateVector || [],
    measurementProbabilities: simulationResult.measurementProbabilities || [],
    qubitStates: simulationResult.qubitStates?.map(state => ({
      ...state,
      qubit: state.qubit.toString()
    })) || [],
    entanglement: simulationResult.entanglement ? {
      pairs: simulationResult.entanglement.pairs.map(pair => [
        pair.qubit1.toString(),
        pair.qubit2.toString()
      ]) as string[][],
      strength: simulationResult.entanglement.totalEntanglement || 0
    } : { pairs: [] as string[][], strength: 0 },
    executionTime: simulationResult.executionTime || 0,
    fidelity: simulationResult.fidelity || 1,
    counts: {},
    blochSphereData: [],
    error: simulationResult.error
  } : null;

  // Convert circuit to quantum circuit format with required properties including state and layer
  const quantumCircuit = {
    id: `circuit-${Date.now()}`,
    name: "Interactive Circuit",
    qubits: Array.from({ length: numQubits }, (_, i) => ({
      id: `q${i}`,
      name: `q${i}`,
      index: i,
      state: 'computational' as const // Use the correct enum value
    })),
    gates: circuit.map((gate, index) => ({
      ...gate,
      qubits: gate.qubits ? gate.qubits.map(q => q.toString()) : gate.qubit !== undefined ? [gate.qubit.toString()] : ['0'], // Convert numbers to strings
      position: { x: (gate.position || index) * 60, y: 0 }, // Convert number to coordinate object
      layer: gate.position || index // Add required layer property
    })),
    metadata: {},
    created: new Date(),
    updated: new Date(),
    layers: circuit.length > 0 ? Math.max(...circuit.map(g => Number(g.position || 0))) + 1 : 0,
    depth: circuit.length > 0 ? Math.max(...circuit.map(g => Number(g.position || 0))) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Interactive Circuit Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-quantum-particle">Qubits:</label>
                <Select value={numQubits.toString()} onValueChange={(value) => setNumQubits(Number(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-quantum-particle">Mode:</label>
                <Select value={simulationMode === 'fast' ? 'statevector' : 'sampling'} onValueChange={handleModeChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="statevector">State Vector</SelectItem>
                    <SelectItem value="sampling">Sampling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-quantum-glow">
                Gates: {circuit.length}
              </Badge>
              <Button
                onClick={handleSimulate}
                disabled={isSimulating || circuit.length === 0}
                className="quantum-panel neon-border"
              >
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Simulate'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Gate Palette */}
        <div className="col-span-3">
          <GatePalette 
            onGateMouseDown={handleGateMouseDown}
            onGateTouchStart={handleGateTouchStart}
          />
        </div>

        {/* Circuit Canvas */}
        <div className="col-span-6">
          <CircuitCanvas 
            circuit={quantumCircuit}
            selectedGate={selectedGate}
            simulationResult={convertedSimulationResult}
            zoomLevel={1}
            panOffset={{ x: 0, y: 0 }}
            onGateAdd={handleAddGate}
            onGateRemove={deleteGate}
            onGateSelect={handleGateSelect}
            onPositionChange={() => {}}
            onDrop={() => {}}
            onDragOver={() => {}}
            onMouseDown={() => {}}
            onMouseMove={() => {}}
            onMouseUp={() => {}}
            onWheel={() => {}}
            numQubits={numQubits}
          />
        </div>

        {/* Circuit Actions */}
        <div className="col-span-3">
          <CircuitActions
            onClear={clearCircuit}
            onUndo={undo}
            onExportJSON={() => {}}
            onExportQASM={() => {}}
            onShowExportDialog={() => {}}
            canUndo={canUndo}
          />
        </div>
      </div>

      {/* Status Bar */}
      <Card className="quantum-panel neon-border">
        <CardContent className="py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-quantum-particle">
                Circuit Depth: {circuit.length > 0 
                  ? Math.max(...circuit.map(g => Number(g.position || 0))) 
                  : 0}
              </span>
              <span className="text-quantum-particle">
                Total Gates: {circuit.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-quantum-neon" />
              <span className="text-quantum-particle">
                Drag gates from palette to circuit
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
