
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Upload, 
  Download,
  Zap,
  Users,
  Settings
} from 'lucide-react';
import { CircuitCanvas } from './CircuitCanvas';
import { GatePalette } from './GatePalette';
import { SimulationPanel } from './SimulationPanel';
import { ExportImportPanel } from './ExportImportPanel';
import { AIOptimizationPanel } from './AIOptimizationPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { toast } from 'sonner';

export function QuantumCircuitBuilder() {
  const [activePanel, setActivePanel] = useState('simulation');
  const [numQubits, setNumQubits] = useState(5);
  const [gridSize, setGridSize] = useState(60);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const {
    circuit,
    simulationResult,
    addGate,
    deleteGate,
    clearCircuit,
    undo,
    canUndo,
    simulateQuantumState
  } = useCircuitState();

  const {
    dragState,
    circuitRef,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits,
    gridSize
  });

  const handleSimulate = async () => {
    if (circuit.length === 0) {
      toast.error('No gates in circuit', { description: 'Add some gates first' });
      return;
    }
    
    setIsSimulating(true);
    try {
      await simulateQuantumState(circuit);
      toast.success('Simulation completed', { description: 'Circuit simulated successfully' });
    } catch (error) {
      toast.error('Simulation failed', { description: String(error) });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveCircuit = () => {
    const circuitData = {
      name: `Circuit_${Date.now()}`,
      gates: circuit,
      qubits: numQubits,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('qosim_circuit', JSON.stringify(circuitData));
    toast.success('Circuit saved', { description: 'Circuit saved to local storage' });
  };

  return (
    <div className="space-y-6">
      {/* Circuit Builder Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="neon-border">
            {circuit.length} gates
          </Badge>
          <Badge variant="outline" className="neon-border">
            {numQubits} qubits
          </Badge>
          {simulationResult && (
            <Badge variant="outline" className="neon-border text-green-400">
              Simulated
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSimulate}
            disabled={isSimulating || circuit.length === 0}
            className="neon-border"
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? 'Simulating...' : 'Simulate'}
          </Button>
          
          <Button
            onClick={undo}
            disabled={!canUndo}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleSaveCircuit}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Circuit Builder Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Gate Palette */}
        <div className="xl:col-span-1">
          <GatePalette 
            onGateMouseDown={handleMouseDown}
            onGateTouchStart={handleTouchStart}
          />
        </div>

        {/* Circuit Canvas */}
        <div className="xl:col-span-2">
          <CircuitCanvas
            circuit={circuit}
            dragState={dragState}
            simulationResult={simulationResult}
            onDeleteGate={deleteGate}
            circuitRef={circuitRef}
            numQubits={numQubits}
            gridSize={gridSize}
            onNumQubitsChange={setNumQubits}
            onGridSizeChange={setGridSize}
          />
        </div>

        {/* Side Panel */}
        <div className="xl:col-span-1">
          <Tabs value={activePanel} onValueChange={setActivePanel} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 quantum-tabs">
              <TabsTrigger value="simulation" className="quantum-tab">
                <Play className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="optimization" className="quantum-tab">
                <Zap className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="quantum-tab">
                <Users className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="simulation">
              <SimulationPanel 
                simulationResult={simulationResult}
                isSimulating={isSimulating}
                onSimulate={handleSimulate}
              />
            </TabsContent>

            <TabsContent value="optimization">
              <AIOptimizationPanel 
                circuit={circuit}
                onOptimizedCircuit={(optimizedCircuit) => {
                  // Replace current circuit with optimized version
                  clearCircuit();
                  optimizedCircuit.forEach(gate => addGate(gate));
                  toast.success('Circuit optimized', { description: 'AI optimization applied' });
                }}
              />
            </TabsContent>

            <TabsContent value="collaboration">
              <CollaborationPanel 
                circuit={circuit}
                onCircuitUpdate={(updatedCircuit) => {
                  clearCircuit();
                  updatedCircuit.forEach(gate => addGate(gate));
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Export/Import Panel */}
      <ExportImportPanel 
        circuit={circuit}
        simulationResult={simulationResult}
        onImportCircuit={(importedCircuit) => {
          clearCircuit();
          importedCircuit.forEach(gate => addGate(gate));
          toast.success('Circuit imported', { description: 'Circuit loaded successfully' });
        }}
      />
    </div>
  );
}
