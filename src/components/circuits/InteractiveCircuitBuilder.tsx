
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { useCircuitErrorHandling } from '@/hooks/useCircuitErrorHandling';
import { CircuitCanvas } from './CircuitCanvas';
import { GatePalette } from './GatePalette';
import { CircuitActions } from './CircuitActions';
import { SimulationModeSelector } from '@/components/simulation/SimulationModeSelector';
import { QuantumResultsPage } from '../QuantumResultsPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Play, RotateCcw, Save, Download, AlertTriangle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedSimulationMode } from '@/lib/enhancedQuantumSimulationService';

const NUM_QUBITS = 5;
const CIRCUIT_DEPTH = 10;

export function InteractiveCircuitBuilder() {
  const { circuit, addGate, deleteGate, clearCircuit, simulationMode, handleModeChange } = useCircuitState();
  const { executeCircuit, lastResult, isExecuting } = useQuantumBackend();
  const { wrapWithErrorHandling } = useCircuitErrorHandling();
  
  const [localSimulationMode, setLocalSimulationMode] = useState<'statevector' | 'sampling'>('statevector');
  const [shots, setShots] = useState(1024);
  const [showResults, setShowResults] = useState(false);
  const [circuitName, setCircuitName] = useState('My Quantum Circuit');

  const canvasRef = useRef<HTMLDivElement>(null);

  console.log('🔧 InteractiveCircuitBuilder: Rendering with', { 
    circuitLength: circuit.length, 
    lastResult: !!lastResult,
    showResults 
  });

  const handleRunSimulation = wrapWithErrorHandling(async () => {
    if (circuit.length === 0) {
      toast.error('Add some gates to your circuit first!');
      return;
    }

    console.log('🚀 Running simulation with', { mode: localSimulationMode, shots, gates: circuit.length });
    
    const result = await executeCircuit(circuit, 'qiskit', shots);
    if (result) {
      console.log('✅ Simulation completed, showing results page');
      setShowResults(true);
      toast.success('Simulation completed successfully!');
    }
  }, 'Circuit Simulation');

  const handleRerunSimulation = useCallback(async (newShots?: number) => {
    const simulationShots = newShots || shots;
    return await executeCircuit(circuit, 'qiskit', simulationShots);
  }, [executeCircuit, circuit, shots]);

  const handleExecutePartialCircuit = useCallback(async (gates: any[], simulationShots?: number) => {
    return await executeCircuit(gates, 'qiskit', simulationShots || shots);
  }, [executeCircuit, shots]);

  const handleBackToBuilder = () => {
    setShowResults(false);
  };

  const handleSimulationModeChange = useCallback((mode: 'statevector' | 'sampling') => {
    setLocalSimulationMode(mode);
    // Convert to EnhancedSimulationMode for the circuit state hook
    const enhancedMode: EnhancedSimulationMode = mode === 'statevector' ? 'fast' : 'sampling';
    handleModeChange(enhancedMode);
  }, [handleModeChange]);

  // If we have results and showResults is true, show the results page
  if (showResults && lastResult) {
    return (
      <QuantumResultsPage
        result={lastResult}
        gates={circuit}
        numQubits={NUM_QUBITS}
        circuitName={circuitName}
        onRerunSimulation={handleRerunSimulation}
        onExecutePartialCircuit={handleExecutePartialCircuit}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-quantum-void">
      {/* Header */}
      <div className="quantum-panel neon-border border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-quantum-glow">Quantum Circuit Builder</h1>
              <Badge variant="outline" className="text-quantum-neon">
                {NUM_QUBITS} Qubits
              </Badge>
              <Badge variant="outline" className="text-quantum-particle">
                {circuit.length} Gates
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <SimulationModeSelector
                mode={localSimulationMode}
                onModeChange={handleSimulationModeChange}
                shots={shots}
                onShotsChange={setShots}
              />
              
              <Button
                onClick={handleRunSimulation}
                disabled={isExecuting || circuit.length === 0}
                className="quantum-panel neon-border bg-quantum-glow/10 hover:bg-quantum-glow/20"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-quantum-glow border-t-transparent" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Gate Palette */}
        <div className="w-64 bg-quantum-matrix border-r border-quantum-neon overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-quantum-particle mb-4">Gate Palette</h2>
            <GatePalette />
          </div>
        </div>

        {/* Circuit Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 overflow-auto">
            <Card className="quantum-panel neon-border h-full">
              <CardHeader>
                <CardTitle className="text-quantum-glow flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Circuit Design Canvas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div ref={canvasRef} className="h-full">
                  <CircuitCanvas
                    gates={circuit}
                    onAddGate={addGate}
                    onRemoveGate={deleteGate}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Circuit Actions */}
          <div className="border-t border-quantum-neon bg-quantum-matrix p-4">
            <CircuitActions
              onClear={clearCircuit}
              onSave={() => toast.success('Circuit saved!')}
              onLoad={() => toast.info('Load circuit functionality coming soon')}
              onExport={() => toast.info('Export functionality coming soon')}
            />
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-quantum-matrix border-l border-quantum-neon overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-quantum-particle mb-4">Circuit Properties</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-quantum-particle">Qubits:</span>
                  <Badge variant="outline" className="text-quantum-neon">{NUM_QUBITS}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-quantum-particle">Gates:</span>
                  <Badge variant="outline" className="text-quantum-plasma">{circuit.length}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-quantum-particle">Depth:</span>
                  <Badge variant="outline" className="text-quantum-energy">
                    {circuit.length > 0 ? Math.max(...circuit.map(g => g.position || 0)) + 1 : 0}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold text-quantum-particle mb-2">Simulation Settings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-quantum-particle">Mode:</span>
                  <Badge variant="secondary" className="text-xs">{localSimulationMode}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-quantum-particle">Shots:</span>
                  <Badge variant="secondary" className="text-xs">{shots.toLocaleString()}</Badge>
                </div>
              </div>
            </div>

            {circuit.length === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Start building your quantum circuit by dragging gates from the palette to the canvas.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
