import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEnhancedCircuitBuilder } from '@/hooks/useEnhancedCircuitBuilder';
import { EnhancedDragDropBuilder } from './EnhancedDragDropBuilder';
import { LiveQuantumVisualizer } from '../visualization/LiveQuantumVisualizer';
import { GatePaletteAdvanced } from './GatePaletteAdvanced';
import { CircuitValidator } from '../simulation/CircuitValidator';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Redo2, 
  Trash2, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedInteractiveBuilderProps {
  initialQubits?: number;
  showAdvancedFeatures?: boolean;
  enableDragDrop?: boolean;
  enableLiveVisualization?: boolean;
}

export function EnhancedInteractiveBuilder({
  initialQubits = 5,
  showAdvancedFeatures = true,
  enableDragDrop = true,
  enableLiveVisualization = true
}: EnhancedInteractiveBuilderProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('design');
  const [showSettings, setShowSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState<'openqasm' | 'json' | 'javascript'>('openqasm');

  const {
    circuit,
    selectedGate,
    simulationResult,
    isSimulating,
    validationErrors,
    canUndo,
    canRedo,
    addGate,
    removeGate,
    updateGate,
    moveGate,
    setQubitCount,
    selectGate,
    clearSelection,
    simulateCircuit,
    exportCircuit,
    importCircuit,
    undo,
    redo,
    clearCircuit,
    saveCircuit,
    validateCircuit
  } = useEnhancedCircuitBuilder(initialQubits);

  // Convert enhanced gates to drag-drop format
  const dragDropGates = circuit.gates.map(gate => ({
    ...gate,
    x: 100 + gate.position * 60,
    y: 60 + (gate.qubits[0] || 0) * 80,
    isSelected: selectedGate?.id === gate.id,
    isDragging: false
  }));

  const handleGateAdd = useCallback((gateType: string, qubits: string[], position: { x: number; y: number }, controlTarget?: { control: number; target: number }) => {
    const numericQubits = qubits.map(q => parseInt(q));
    const options: any = {
      position: Math.floor(position.x / 60)
    };
    
    if (controlTarget) {
      options.control = controlTarget.control;
      options.target = controlTarget.target;
    }
    
    addGate(gateType, numericQubits, options);
  }, [addGate]);

  const handleGateMove = useCallback((gateId: string, newPosition: number, newQubits?: number[]) => {
    moveGate(gateId, newPosition, newQubits);
  }, [moveGate]);

  const handleGatesChange = useCallback((gates: any[]) => {
    // Update all gates from drag-drop component
    gates.forEach(gate => {
      const originalGate = circuit.gates.find(g => g.id === gate.id);
      if (originalGate) {
        if (gate.x !== originalGate.position * 60 + 100 || 
            gate.y !== (originalGate.qubits[0] || 0) * 80 + 60) {
          const newPosition = Math.round((gate.x - 100) / 60);
          const newQubit = Math.round((gate.y - 60) / 80);
          moveGate(gate.id, newPosition, [newQubit]);
        }
      }
    });
  }, [circuit.gates, moveGate]);

  const circuitData = {
    qubits: Array(circuit.qubits).fill(null).map((_, i) => ({ 
      id: `q${i}`, 
      name: `q${i}`, 
      index: i 
    })), 
    gates: circuit.gates
  };

  const handleSimulation = useCallback(async () => {
    if (isSimulating) {
      // Stop simulation (if implemented)
      return;
    }

    try {
      await simulateCircuit();
      setActiveTab('visualization'); // Switch to results tab
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  }, [isSimulating, simulateCircuit]);

  const handleExport = useCallback(async () => {
    try {
      const exportData = await exportCircuit(exportFormat);
      const blob = new Blob([exportData], { 
        type: exportFormat === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${circuit.name.replace(/\s+/g, '_').toLowerCase()}.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Circuit exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [exportCircuit, exportFormat, circuit.name]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const format = file.name.endsWith('.json') ? 'json' : 'openqasm';
      await importCircuit(text, format);
    } catch (error) {
      toast.error('Import failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    // Reset input
    event.target.value = '';
  }, [importCircuit]);

  // Memoize validation status to avoid unnecessary re-calculations
  const validationStatus = useMemo(() => ({
    isValid: validationErrors.length === 0 || validationErrors.every(e => e.severity === 'warning'),
    errors: validationErrors.filter(e => e.severity === 'error'),
    warnings: validationErrors.filter(e => e.severity === 'warning')
  }), [validationErrors]);
  
  const hasErrors = validationStatus.errors.length > 0;
  const hasWarnings = validationStatus.warnings.length > 0;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Enhanced Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            className="transition-colors"
          >
            <Redo2 className="w-4 h-4 mr-1" />
            Redo
          </Button>
          <Separator orientation="vertical" className="h-8" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveCircuit()}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json,.qasm"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Import
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="px-2 py-1 text-xs bg-background border border-border rounded"
            >
              <option value="openqasm">OpenQASM</option>
              <option value="json">JSON</option>
              <option value="javascript">JavaScript</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearCircuit}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Circuit Info */}
          <Badge variant="outline">
            Qubits: {circuit.qubits}
          </Badge>
          <Badge variant="outline">
            Gates: {circuit.gates.length}
          </Badge>
          <Badge variant="outline">
            Depth: {Math.max(...circuit.gates.map(g => g.position), 0) + 1}
          </Badge>
          
          {/* Validation Status */}
          {hasErrors && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Errors
            </Badge>
          )}
          {hasWarnings && !hasErrors && (
            <Badge variant="secondary">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Warnings
            </Badge>
          )}
          {validationStatus.isValid && (
            <Badge variant="default">
              <CheckCircle className="w-3 h-3 mr-1" />
              Valid
            </Badge>
          )}
          
          <Separator orientation="vertical" className="h-8" />
          
          {/* Simulation Button */}
          <Button
            variant={isSimulating ? "destructive" : validationStatus.isValid ? "default" : "secondary"}
            size="sm"
            onClick={handleSimulation}
            disabled={circuit.gates.length === 0}
            className="min-w-24"
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Simulate
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Validation Errors/Warnings */}
      {(hasErrors || hasWarnings) && (
        <div className="p-2 border-b">
          {validationErrors.slice(0, 3).map((error, index) => (
            <Alert 
              key={index} 
              variant={error.severity === 'error' ? 'destructive' : 'default'}
              className="mb-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {error.message}
              </AlertDescription>
            </Alert>
          ))}
          {validationErrors.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{validationErrors.length - 3} more issues
            </p>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Design Tools */}
        <div className="w-80 border-r bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">
                <Zap className="w-4 h-4 mr-1" />
                Design
              </TabsTrigger>
              <TabsTrigger value="validation">
                <CheckCircle className="w-4 h-4 mr-1" />
                Validate
              </TabsTrigger>
              <TabsTrigger value="visualization">
                <Eye className="w-4 h-4 mr-1" />
                Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Gate Palette</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-xs">Qubits:</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={circuit.qubits}
                      onChange={(e) => setQubitCount(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 text-xs bg-background border border-border rounded"
                    />
                  </div>
                </div>
                
                <GatePaletteAdvanced
                  onGateSelect={handleGateAdd}
                  onQubitAdd={() => setQubitCount(circuit.qubits + 1)}
                  selectedGate={selectedGate}
                  circuit={circuitData}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="validation" className="p-4">
              <CircuitValidator
                circuit={circuit.gates}
                numQubits={circuit.qubits}
              />
            </TabsContent>
            
            <TabsContent value="visualization" className="p-0">
              {enableLiveVisualization && (
                <LiveQuantumVisualizer
                  simulationResult={simulationResult}
                  isSimulating={isSimulating}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Circuit Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {enableDragDrop ? (
              <EnhancedDragDropBuilder
                numQubits={circuit.qubits}
                gates={dragDropGates}
                onGatesChange={handleGatesChange}
                onGateSelect={(gate) => selectGate(gate)}
                selectedGate={dragDropGates.find(g => g.id === selectedGate?.id) || null}
                gridSize={60}
                showGrid={true}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Classic circuit builder would go here</p>
                  <p className="text-sm">Enable drag-drop for enhanced experience</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties & Info */}
        <div className="w-80 border-l bg-card p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Circuit Properties</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Name:</span>
                <input
                  type="text"
                  value={circuit.name}
                  onChange={(e) => updateGate(circuit.id, { ...circuit as any, name: e.target.value })}
                  className="w-32 px-2 py-1 bg-background border border-border rounded text-xs"
                />
              </div>
              <div className="flex justify-between">
                <span>Qubits:</span>
                <Badge variant="outline">{circuit.qubits}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Gates:</span>
                <Badge variant="outline">{circuit.gates.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Shots:</span>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={circuit.shots}
                  onChange={(e) => updateGate(circuit.id, { ...circuit as any, shots: parseInt(e.target.value) || 1024 })}
                  className="w-20 px-2 py-1 bg-background border border-border rounded text-xs"
                />
              </div>
            </div>
          </div>

          {selectedGate && (
            <div>
              <h4 className="font-medium mb-2">Selected Gate</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="outline">{selectedGate.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Qubits:</span>
                  <Badge variant="outline">{selectedGate.qubits.join(', ')}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Position:</span>
                  <Badge variant="outline">{selectedGate.position}</Badge>
                </div>
                {selectedGate.angle !== undefined && (
                  <div className="flex justify-between items-center">
                    <span>Angle:</span>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedGate.angle}
                      onChange={(e) => updateGate(selectedGate.id, { angle: parseFloat(e.target.value) })}
                      className="w-20 px-2 py-1 bg-background border border-border rounded text-xs"
                    />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeGate(selectedGate.id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove Gate
                </Button>
              </div>
            </div>
          )}

          {simulationResult && (
            <div>
              <h4 className="font-medium mb-2">Simulation Results</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Execution Time:</span>
                  <Badge variant="outline">{simulationResult.executionTime.toFixed(1)}ms</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Fidelity:</span>
                  <Badge variant="outline">{simulationResult.fidelity.toFixed(4)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Memory Used:</span>
                  <Badge variant="outline">{simulationResult.memoryUsed.toFixed(1)}MB</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Entanglement:</span>
                  <Badge variant="outline">
                    {(simulationResult.entanglement.totalEntanglement * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {showAdvancedFeatures && (
            <div>
              <h4 className="font-medium mb-2">Advanced</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Noise Models
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimization
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Step-by-Step
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}