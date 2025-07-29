
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { GatePalette } from './circuit/GatePalette';
import { QuantumCanvas } from './circuit/QuantumCanvas';
import { CircuitControls } from './circuit/CircuitControls';
import { SimulationPanel } from './circuit/SimulationPanel';
import { ExportDialog } from './circuit/ExportDialog';
import { ImportDialog } from './circuit/ImportDialog';
import { type QuantumGate, type QuantumCircuit, type QuantumSimulationResult } from '@/types/qosim';
import { Play, Square, Save, Upload, Download, Undo, Redo, Trash2, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitBuilderProps {
  circuit: QuantumGate[];
  simulationResult: QuantumSimulationResult | null;
  isSimulating: boolean;
  onAddGate: (gate: QuantumGate) => void;
  onRemoveGate: (gateId: string) => void;
  onUpdateGate: (gateId: string, updates: Partial<QuantumGate>) => void;
  onClearCircuit: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onRunSimulation: () => Promise<void>;
  onStopSimulation: () => void;
  onSaveCircuit: (name: string) => Promise<void>;
  onLoadCircuit: (circuitId: string) => Promise<void>;
  onExportCircuit: (format: string) => Promise<string>;
  onImportCircuit: (data: string, format: string) => Promise<void>;
}

export function CircuitBuilder({
  circuit,
  simulationResult,
  isSimulating,
  onAddGate,
  onRemoveGate,
  onUpdateGate,
  onClearCircuit,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRunSimulation,
  onStopSimulation,
  onSaveCircuit,
  onLoadCircuit,
  onExportCircuit,
  onImportCircuit
}: CircuitBuilderProps) {
  const [selectedGateType, setSelectedGateType] = useState<string | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGateSelect = useCallback((gateType: string) => {
    setSelectedGateType(gateType);
    toast.info(`Selected ${gateType} gate`, {
      description: 'Click on the circuit to place the gate'
    });
  }, []);

  const handleCanvasClick = useCallback((position: { x: number; y: number }) => {
    if (selectedGateType) {
      const newGate: QuantumGate = {
        id: `gate_${Date.now()}`,
        type: selectedGateType as any,
        qubits: [Math.floor(position.y / 60)], // Assuming 60px per qubit line
        position: { x: position.x, y: position.y },
        metadata: {
          timestamp: Date.now()
        }
      };

      onAddGate(newGate);
      setSelectedGateType(null);
      toast.success(`Added ${selectedGateType} gate`);
    }
  }, [selectedGateType, onAddGate]);

  const handleSaveCircuit = async () => {
    const name = prompt('Enter circuit name:');
    if (name) {
      await onSaveCircuit(name);
      toast.success('Circuit saved successfully');
    }
  };

  const handleRunSimulation = async () => {
    if (circuit.length === 0) {
      toast.error('Cannot simulate empty circuit');
      return;
    }
    
    await onRunSimulation();
    toast.success('Simulation completed');
  };

  const circuitDepth = circuit.reduce((max, gate) => Math.max(max, gate.position.x), 0);
  const qubitCount = circuit.reduce((max, gate) => Math.max(max, ...gate.qubits), 0) + 1;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-cyan-400">Quantum Circuit Builder</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Gates: {circuit.length}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Qubits: {qubitCount}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Depth: {circuitDepth}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="text-slate-400 border-slate-400/30"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="text-slate-400 border-slate-400/30"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExportDialogOpen(true)}
            className="text-emerald-400 border-emerald-400/30"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportDialogOpen(true)}
            className="text-yellow-400 border-yellow-400/30"
          >
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveCircuit}
            className="text-blue-400 border-blue-400/30"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gate Palette */}
        <div className="lg:col-span-1">
          <Card className="bg-black/30 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-cyan-400">Gate Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <GatePalette
                selectedGateType={selectedGateType}
                onGateSelect={handleGateSelect}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-2">
          <Card className="bg-black/30 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-cyan-400 flex items-center justify-between">
                Circuit Canvas
                <CircuitControls
                  zoom={zoom}
                  onZoomChange={setZoom}
                  onPanChange={setPan}
                  onClear={onClearCircuit}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuantumCanvas
                ref={canvasRef}
                circuit={circuit}
                selectedGateType={selectedGateType}
                zoom={zoom}
                pan={pan}
                onCanvasClick={handleCanvasClick}
                onGateSelect={(gateId) => {
                  // Handle gate selection for editing
                }}
                onGateRemove={onRemoveGate}
                onGateUpdate={onUpdateGate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Simulation Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-black/30 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-purple-400">Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleRunSimulation}
                    disabled={isSimulating || circuit.length === 0}
                    className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-400/30"
                  >
                    {isSimulating ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                  
                  {isSimulating && (
                    <Button
                      onClick={onStopSimulation}
                      variant="outline"
                      size="sm"
                      className="w-full text-red-400 border-red-400/30"
                    >
                      Stop Simulation
                    </Button>
                  )}
                </div>
                
                <SimulationPanel
                  result={simulationResult}
                  isSimulating={isSimulating}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={onExportCircuit}
        circuit={circuit}
      />

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={onImportCircuit}
      />
    </div>
  );
}
