
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircuitBuilder } from './CircuitBuilder';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { CircuitOptimizer } from './CircuitOptimizer';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Cpu, Eye, Zap, Activity, Settings, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedCircuitEditorProps {
  circuit: Gate[];
  dragState: any;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
  onOptimizedCircuit: (gates: Gate[]) => void;
}

export function EnhancedCircuitEditor({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  onGateTouchStart,
  circuitRef,
  numQubits,
  gridSize,
  onOptimizedCircuit
}: EnhancedCircuitEditorProps) {
  const [activeVisualization, setActiveVisualization] = useState("state");

  // Circuit statistics for user insight
  const circuitStats = {
    totalGates: circuit.length,
    uniqueGateTypes: new Set(circuit.map(g => g.type)).size,
    depth: circuit.length > 0 ? Math.max(...circuit.map(g => g.position)) + 1 : 0,
    qubitsUsed: new Set(circuit.flatMap(g => g.qubit !== undefined ? [g.qubit] : g.qubits || [])).size
  };

  return (
    <div className="space-y-6">
      {/* Circuit Overview Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Quantum Circuit Designer
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
                {circuitStats.totalGates} Gates
              </Badge>
              <Badge variant="secondary" className="bg-quantum-void text-quantum-particle">
                Depth: {circuitStats.depth}
              </Badge>
              <Badge variant="secondary" className="bg-quantum-plasma/20 text-quantum-energy">
                {circuitStats.qubitsUsed}/{numQubits} Qubits
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Circuit Builder - Primary Focus */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Circuit Builder - Takes 2 columns for prominence */}
        <div className="xl:col-span-2">
          <CircuitBuilder
            circuit={circuit}
            dragState={dragState}
            simulationResult={simulationResult}
            onDeleteGate={onDeleteGate}
            onGateMouseDown={onGateMouseDown}
            onGateTouchStart={onGateTouchStart}
            circuitRef={circuitRef}
            numQubits={numQubits}
            gridSize={gridSize}
          />
        </div>

        {/* Live State Visualization - Sidebar */}
        <div className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Quantum State
                {simulationResult && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {simulationResult.mode || 'Classical'}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {simulationResult ? (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-quantum-void rounded p-2 border border-quantum-matrix">
                      <div className="text-muted-foreground">Fidelity</div>
                      <div className="text-quantum-glow font-mono">
                        {(simulationResult.fidelity * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-quantum-void rounded p-2 border border-quantum-matrix">
                      <div className="text-muted-foreground">Time</div>
                      <div className="text-quantum-energy font-mono">
                        {simulationResult.executionTime.toFixed(1)}ms
                      </div>
                    </div>
                  </div>

                  {/* Mini Bloch Spheres */}
                  <div className="grid grid-cols-2 gap-2">
                    {simulationResult.qubitStates.slice(0, 4).map((qubitState, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1">
                        <div className="text-xs font-mono text-quantum-neon">Q{i}</div>
                        <div 
                          className="w-8 h-8 rounded-full border border-quantum-neon flex items-center justify-center text-xs quantum-glow"
                          style={{
                            background: `conic-gradient(from ${qubitState.phase}rad, hsl(var(--quantum-glow)), hsl(var(--quantum-neon)))`
                          }}
                        >
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <div className="text-xs text-center">
                          <div className="text-quantum-glow">{qubitState.state}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Entanglement Indicator */}
                  {simulationResult.entanglement?.totalEntanglement > 0 && (
                    <div className="bg-quantum-matrix rounded p-2 border border-quantum-neon/30">
                      <div className="text-xs text-quantum-particle mb-1">Entanglement</div>
                      <div className="w-full bg-quantum-void rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-quantum-neon to-quantum-energy h-2 rounded-full transition-all duration-300"
                          style={{ width: `${simulationResult.entanglement.totalEntanglement * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-quantum-energy mt-1">
                        {(simulationResult.entanglement.totalEntanglement * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add gates to see live quantum state</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Visualization & Tools */}
      <Tabs value={activeVisualization} onValueChange={setActiveVisualization} className="w-full">
        <TabsList className="grid w-full grid-cols-3 quantum-tabs">
          <TabsTrigger value="state" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Circuit Optimizer
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="state" className="mt-6">
          <QuantumStateVisualizer 
            simulationResult={simulationResult}
            numQubits={numQubits}
          />
        </TabsContent>

        <TabsContent value="optimization" className="mt-6">
          <CircuitOptimizer
            circuit={circuit}
            onOptimizedCircuit={onOptimizedCircuit}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Circuit Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-quantum-particle">Circuit Statistics</div>
                  <div className="bg-quantum-void rounded p-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Total Gates:</span>
                      <span className="text-quantum-neon font-mono">{circuitStats.totalGates}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Gate Types:</span>
                      <span className="text-quantum-particle font-mono">{circuitStats.uniqueGateTypes}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Circuit Depth:</span>
                      <span className="text-quantum-energy font-mono">{circuitStats.depth}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Qubits Used:</span>
                      <span className="text-quantum-glow font-mono">{circuitStats.qubitsUsed}/{numQubits}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-quantum-particle">Performance</div>
                  <div className="bg-quantum-void rounded p-3 space-y-2">
                    {simulationResult && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Execution Time:</span>
                          <span className="text-quantum-energy font-mono">{simulationResult.executionTime.toFixed(2)}ms</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Fidelity:</span>
                          <span className="text-quantum-glow font-mono">{(simulationResult.fidelity * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Mode:</span>
                          <span className="text-quantum-neon font-mono">{simulationResult.mode}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
