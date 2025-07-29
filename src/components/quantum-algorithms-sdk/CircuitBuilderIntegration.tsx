
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftRight, Upload, Download, Zap, Eye, Settings } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

export interface CircuitBuilderIntegrationProps {
  currentCircuit: any[];
  selectedAlgorithm: Algorithm | null;
  onExportToBuilder: (gates: any[]) => void;
  onImportFromBuilder: (circuit: any[]) => void;
}

export function CircuitBuilderIntegration({
  currentCircuit,
  selectedAlgorithm,
  onExportToBuilder,
  onImportFromBuilder
}: CircuitBuilderIntegrationProps) {
  const [syncMode, setSyncMode] = useState<'manual' | 'auto'>('manual');
  const [optimizeOnSync, setOptimizeOnSync] = useState(true);
  const [preserveParameters, setPreserveParameters] = useState(true);
  const { toast } = useToast();

  const handleExportToBuilder = () => {
    if (!selectedAlgorithm) {
      toast({
        title: "No Algorithm Selected",
        description: "Please select an algorithm to export to the Circuit Builder.",
        variant: "destructive",
      });
      return;
    }

    const gates = generateGatesFromAlgorithm(selectedAlgorithm);
    
    if (optimizeOnSync) {
      // Apply optimization
      const optimizedGates = optimizeGateSequence(gates);
      onExportToBuilder(optimizedGates);
    } else {
      onExportToBuilder(gates);
    }

    toast({
      title: "Exported to Circuit Builder",
      description: `${selectedAlgorithm.name} circuit exported with ${gates.length} gates.`,
    });
  };

  const handleImportFromBuilder = () => {
    if (!currentCircuit || currentCircuit.length === 0) {
      toast({
        title: "No Circuit to Import",
        description: "Please create a circuit in the Circuit Builder first.",
        variant: "destructive",
      });
      return;
    }

    onImportFromBuilder(currentCircuit);
    
    toast({
      title: "Imported from Circuit Builder",
      description: `Circuit with ${currentCircuit.length} gates imported successfully.`,
    });
  };

  const handleOptimizeCircuit = () => {
    if (!currentCircuit || currentCircuit.length === 0) {
      toast({
        title: "No Circuit to Optimize",
        description: "Please create a circuit first.",
        variant: "destructive",
      });
      return;
    }

    const optimized = optimizeGateSequence(currentCircuit);
    onExportToBuilder(optimized);
    
    toast({
      title: "Circuit Optimized",
      description: `Circuit optimized from ${currentCircuit.length} to ${optimized.length} gates.`,
    });
  };

  const getCircuitPreview = () => {
    if (!currentCircuit || currentCircuit.length === 0) {
      return 'No circuit loaded';
    }

    return currentCircuit.map((gate, index) => {
      if (gate.qubits && gate.qubits.length > 1) {
        return `${gate.type}(${gate.qubits.join(',')})`;
      }
      return `${gate.type}(${gate.qubit})`;
    }).join(' → ');
  };

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-quantum-glow" />
            <h2 className="text-lg font-semibold text-quantum-glow">Circuit Builder Integration</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-quantum-particle">
              {syncMode === 'auto' ? 'Auto Sync' : 'Manual Sync'}
            </Badge>
            <Button
              onClick={() => setSyncMode(syncMode === 'auto' ? 'manual' : 'auto')}
              size="sm"
              variant="outline"
              className="border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
            >
              <Settings className="w-4 h-4 mr-2" />
              {syncMode === 'auto' ? 'Auto' : 'Manual'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="sync" className="h-full flex flex-col">
          <TabsList className="flex-none grid w-full grid-cols-3 bg-quantum-matrix border-b border-quantum-neon/20">
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4" />
              Sync
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="quantum-panel neon-border">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Export to Circuit Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-quantum-void rounded-lg">
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Current Algorithm</h4>
                        {selectedAlgorithm ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-quantum-neon">{selectedAlgorithm.name}</span>
                              <Badge variant="outline" className="text-quantum-particle">
                                {selectedAlgorithm.complexity}
                              </Badge>
                            </div>
                            <div className="text-xs text-quantum-particle">
                              {selectedAlgorithm.description}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-quantum-particle">
                            No algorithm selected
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={handleExportToBuilder}
                          disabled={!selectedAlgorithm}
                          className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export to Builder
                        </Button>
                        
                        <Button
                          onClick={handleOptimizeCircuit}
                          disabled={!selectedAlgorithm}
                          variant="outline"
                          className="w-full border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Optimize & Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="quantum-panel neon-border">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Import from Circuit Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-quantum-void rounded-lg">
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Current Circuit</h4>
                        <div className="text-sm text-quantum-neon">
                          {currentCircuit && currentCircuit.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span>Gates: {currentCircuit.length}</span>
                                <Badge variant="outline" className="text-quantum-particle">
                                  {Math.max(...currentCircuit.map(g => g.qubit || 0)) + 1} qubits
                                </Badge>
                              </div>
                              <div className="text-xs text-quantum-particle">
                                {getCircuitPreview()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-quantum-particle">
                              No circuit in builder
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={handleImportFromBuilder}
                          disabled={!currentCircuit || currentCircuit.length === 0}
                          className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Import from Builder
                        </Button>
                        
                        <Button
                          onClick={() => {
                            handleImportFromBuilder();
                            handleOptimizeCircuit();
                          }}
                          disabled={!currentCircuit || currentCircuit.length === 0}
                          variant="outline"
                          className="w-full border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Import & Optimize
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Circuit Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Original Circuit</h4>
                        <div className="bg-quantum-void rounded-lg p-4 h-32 overflow-y-auto">
                          {currentCircuit && currentCircuit.length > 0 ? (
                            <div className="space-y-1">
                              {currentCircuit.map((gate, index) => (
                                <div key={index} className="text-xs font-mono text-quantum-neon">
                                  {index + 1}. {gate.type}({gate.qubit || gate.qubits?.join(',') || 'N/A'})
                                  {gate.angle && ` [${gate.angle.toFixed(3)}]`}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-quantum-particle text-center py-8">
                              No circuit loaded
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-quantum-glow mb-2">Optimized Preview</h4>
                        <div className="bg-quantum-void rounded-lg p-4 h-32 overflow-y-auto">
                          {currentCircuit && currentCircuit.length > 0 ? (
                            <div className="space-y-1">
                              {optimizeGateSequence(currentCircuit).map((gate, index) => (
                                <div key={index} className="text-xs font-mono text-quantum-energy">
                                  {index + 1}. {gate.type}({gate.qubit || gate.qubits?.join(',') || 'N/A'})
                                  {gate.angle && ` [${gate.angle.toFixed(3)}]`}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-quantum-particle text-center py-8">
                              No circuit to optimize
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-quantum-matrix rounded-lg">
                      <h4 className="text-sm font-semibold text-quantum-glow mb-2">Optimization Summary</h4>
                      {currentCircuit && currentCircuit.length > 0 ? (
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-quantum-particle">Original Gates:</span>
                            <span className="text-quantum-neon">{currentCircuit.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-quantum-particle">Optimized Gates:</span>
                            <span className="text-quantum-energy">{optimizeGateSequence(currentCircuit).length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-quantum-particle">Reduction:</span>
                            <span className="text-quantum-glow">
                              {((currentCircuit.length - optimizeGateSequence(currentCircuit).length) / currentCircuit.length * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-quantum-particle text-xs">No circuit to analyze</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Integration Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-quantum-glow mb-3">Sync Options</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={optimizeOnSync}
                            onChange={(e) => setOptimizeOnSync(e.target.checked)}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Optimize circuits during sync</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={preserveParameters}
                            onChange={(e) => setPreserveParameters(e.target.checked)}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Preserve gate parameters</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-quantum-glow mb-3">Real-time Collaboration</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={false}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Enable real-time sync</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Show inline comments</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-quantum-glow mb-3">Learning Mode</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Maintain tutorial context</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={false}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Auto-generate explanations</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function generateGatesFromAlgorithm(algorithm: Algorithm): any[] {
  const gates = [];
  let position = 0;

  switch (algorithm.id) {
    case 'bell-state':
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ },
        { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: position++ }
      );
      break;
    case 'grovers-search':
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ },
        { id: 'h2', type: 'H', qubit: 1, position: position++ },
        { id: 'cz1', type: 'CZ', qubits: [0, 1], position: position++ },
        { id: 'h3', type: 'H', qubit: 0, position: position++ },
        { id: 'h4', type: 'H', qubit: 1, position: position++ },
        { id: 'x1', type: 'X', qubit: 0, position: position++ },
        { id: 'x2', type: 'X', qubit: 1, position: position++ },
        { id: 'cz2', type: 'CZ', qubits: [0, 1], position: position++ },
        { id: 'x3', type: 'X', qubit: 0, position: position++ },
        { id: 'x4', type: 'X', qubit: 1, position: position++ },
        { id: 'h5', type: 'H', qubit: 0, position: position++ },
        { id: 'h6', type: 'H', qubit: 1, position: position++ }
      );
      break;
    case 'qft':
      gates.push(
        { id: 'x1', type: 'X', qubit: 2, position: position++ },
        { id: 'h1', type: 'H', qubit: 0, position: position++ },
        { id: 'cp1', type: 'CP', qubits: [0, 1], angle: Math.PI/2, position: position++ },
        { id: 'cp2', type: 'CP', qubits: [0, 2], angle: Math.PI/4, position: position++ },
        { id: 'h2', type: 'H', qubit: 1, position: position++ },
        { id: 'cp3', type: 'CP', qubits: [1, 2], angle: Math.PI/2, position: position++ },
        { id: 'h3', type: 'H', qubit: 2, position: position++ },
        { id: 'swap1', type: 'SWAP', qubits: [0, 2], position: position++ }
      );
      break;
    default:
      gates.push(
        { id: 'h1', type: 'H', qubit: 0, position: position++ }
      );
  }

  return gates;
}

function optimizeGateSequence(gates: any[]): any[] {
  // Simple optimization: remove redundant gates
  const optimized = [];
  const gateHistory = new Map();
  
  for (const gate of gates) {
    const key = `${gate.type}-${gate.qubit || gate.qubits?.join(',')}`;
    
    // Remove consecutive identical gates (except rotations)
    if (gate.type === 'H' || gate.type === 'X' || gate.type === 'Y' || gate.type === 'Z') {
      if (gateHistory.get(key) === gate.type) {
        // Remove this gate (it cancels the previous one)
        optimized.pop();
        gateHistory.delete(key);
        continue;
      }
    }
    
    optimized.push(gate);
    gateHistory.set(key, gate.type);
  }
  
  return optimized;
}
