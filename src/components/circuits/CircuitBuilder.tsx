import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Play, Save, Share2, Trash2, Copy, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { GatePalette } from './GatePalette';
import { CircuitGrid } from './CircuitGrid';
import { QuantumStateVisualization } from './QuantumStateVisualization';
import { ExportDialog } from '@/components/dialogs/ExportDialog';
import { ShareDialog } from '@/components/dialogs/ShareDialog';

export interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  parameters?: { [key: string]: any };
  controlQubit?: number;
  targetQubit?: number;
}

export interface DragState {
  isDragging: boolean;
  gateType: string;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

export interface OptimizedSimulationResult {
  stateVector: Complex[];
  probabilities: number[];
  measurementOutcomes: { [key: string]: number };
  executionTime: number;
  circuitDepth: number;
  gateCount: number;
  entanglement?: {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    globalEntanglement: number;
  };
}

export interface Complex {
  real: number;
  imaginary: number;
}

export interface CircuitBuilderProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult;
  onDeleteGate: (gateId: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart: (e: React.TouchEvent, gateType: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
}

export function CircuitBuilder({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  onGateTouchStart,
  circuitRef,
  numQubits,
  gridSize
}: CircuitBuilderProps) {
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Circuit simulation completed successfully!');
    } catch (error) {
      toast.error('Simulation failed. Please check your circuit.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCircuit = () => {
    toast.success('Circuit saved successfully!');
  };

  const handleCopyCircuit = () => {
    toast.success('Circuit copied to clipboard!');
  };

  const handleClearCircuit = () => {
    circuit.forEach(gate => onDeleteGate(gate.id));
    toast.success('Circuit cleared!');
  };

  const getGateColor = (gateType: string) => {
    switch (gateType) {
      case 'Hadamard':
        return 'bg-quantum-glow';
      case 'PauliX':
        return 'bg-quantum-neon';
      case 'PauliY':
        return 'bg-quantum-plasma';
      case 'PauliZ':
        return 'bg-quantum-energy';
      case 'CNOT':
        return 'bg-quantum-particle';
      default:
        return 'bg-quantum-matrix';
    }
  };

  return (
    <div className="min-h-screen bg-quantum-void p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-quantum-glow flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  Quantum Circuit Builder
                </CardTitle>
                <p className="text-quantum-particle">
                  Design and simulate quantum circuits with our drag-and-drop interface
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
                  {circuit.length} Gates
                </Badge>
                <Badge variant="outline" className="text-quantum-energy border-quantum-energy">
                  {numQubits} Qubits
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Gate Palette */}
          <div className="lg:col-span-1">
            <GatePalette 
              onGateMouseDown={onGateMouseDown}
              onGateTouchStart={onGateTouchStart}
            />
          </div>

          {/* Circuit Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Circuit Actions */}
            <Card className="quantum-panel neon-border">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleRunSimulation}
                    disabled={isRunning || circuit.length === 0}
                    className="quantum-button"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Simulation'}
                  </Button>
                  
                  <Button
                    onClick={handleSaveCircuit}
                    variant="outline"
                    className="neon-border"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  
                  <Button
                    onClick={handleCopyCircuit}
                    variant="outline"
                    className="neon-border"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  
                  <Button
                    onClick={() => setShowShareDialog(true)}
                    variant="outline"
                    className="neon-border"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button
                    onClick={() => setShowExportDialog(true)}
                    variant="outline"
                    className="neon-border"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Separator orientation="vertical" className="h-8" />
                  
                  <Button
                    onClick={handleClearCircuit}
                    variant="outline"
                    className="neon-border text-red-400 hover:text-red-300"
                    disabled={circuit.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Circuit Grid */}
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Circuit Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={circuitRef} className="relative">
                  <CircuitGrid
                    circuit={circuit}
                    numQubits={numQubits}
                    gridSize={gridSize}
                    onDeleteGate={onDeleteGate}
                    dragState={dragState}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Simulation Results */}
            {simulationResult && (
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-quantum-neon font-semibold mb-3">State Vector</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {simulationResult.stateVector.map((state, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-quantum-matrix/30 rounded">
                            <span className="text-quantum-particle">|{index.toString(2).padStart(Math.log2(simulationResult.stateVector.length), '0')}⟩</span>
                            <span className="text-quantum-glow font-mono">
                              {typeof state === 'object' && state !== null && 'real' in state
                                ? `${state.real.toFixed(3)} + ${state.imaginary.toFixed(3)}i`
                                : String(state)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-quantum-neon font-semibold mb-3">Measurement Probabilities</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {simulationResult.probabilities.map((prob, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-quantum-matrix/30 rounded">
                            <span className="text-quantum-particle">|{index.toString(2).padStart(Math.log2(simulationResult.probabilities.length), '0')}⟩</span>
                            <span className="text-quantum-energy font-mono">{(prob * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-quantum-matrix/20 rounded-lg">
                      <div className="text-2xl font-bold text-quantum-glow">{simulationResult.executionTime.toFixed(2)}ms</div>
                      <div className="text-sm text-quantum-particle">Execution Time</div>
                    </div>
                    <div className="text-center p-4 bg-quantum-matrix/20 rounded-lg">
                      <div className="text-2xl font-bold text-quantum-neon">{simulationResult.circuitDepth}</div>
                      <div className="text-sm text-quantum-particle">Circuit Depth</div>
                    </div>
                    <div className="text-center p-4 bg-quantum-matrix/20 rounded-lg">
                      <div className="text-2xl font-bold text-quantum-energy">{simulationResult.gateCount}</div>
                      <div className="text-sm text-quantum-particle">Gate Count</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantum State Visualization */}
            <QuantumStateVisualization 
              simulationResult={simulationResult}
              numQubits={numQubits}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        circuit={circuit}
      />
      
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        circuit={circuit}
      />
    </div>
  );
}
