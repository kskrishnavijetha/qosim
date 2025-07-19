
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircuitBuilder } from './CircuitBuilder';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { CircuitOptimizer } from './CircuitOptimizer';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Cpu, Eye, Zap } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      {/* Main Circuit Builder */}
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

      {/* Enhanced Features Tabs */}
      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-2 quantum-tabs">
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            State Visualization
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Auto-Optimize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualization">
          <QuantumStateVisualizer 
            simulationResult={simulationResult}
            numQubits={numQubits}
          />
        </TabsContent>

        <TabsContent value="optimization">
          <CircuitOptimizer
            circuit={circuit}
            onOptimizedCircuit={onOptimizedCircuit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
