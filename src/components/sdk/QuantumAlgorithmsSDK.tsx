
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CircuitBuilder } from '../circuits/CircuitBuilder';
import { BlochSphere } from '../BlochSphere';
import { SimulationRunner } from './SimulationRunner';
import { CircuitExporter } from './CircuitExporter';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Zap, FileText } from 'lucide-react';
import { FastQuantumSimulator } from '../simulation/FastQuantumSimulator';

export function QuantumAlgorithmsSDK() {
  const [activeTab, setActiveTab] = useState("circuit-builder");
  const { circuit, simulationResult, addGate, deleteGate } = useCircuitState();

  const NUM_QUBITS = 5;
  const GRID_SIZE = 50;

  const {
    dragState,
    circuitRef,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits: NUM_QUBITS,
    gridSize: GRID_SIZE
  });

  // Generate a default qubit state for Bloch sphere visualization
  const defaultQubitState = {
    amplitude0: { real: 1, imag: 0 },
    amplitude1: { real: 0, imag: 0 },
    probability0: 1,
    probability1: 0,
    phase: 0
  };

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-quantum-glow">
              Quantum Algorithms SDK
            </h1>
            <p className="text-sm text-quantum-particle">
              Explore, build, and simulate quantum circuits
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="secondary">
              <a href="https://github.com/Quantum-Tinkerers/quantum-lab" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 quantum-tabs">
            <TabsTrigger value="circuit-builder" className="quantum-tab">
              Circuit Builder
            </TabsTrigger>
            <TabsTrigger value="simulation" className="quantum-tab">
              Simulation
            </TabsTrigger>
            <TabsTrigger value="bloch-sphere" className="quantum-tab">
              Bloch Sphere
            </TabsTrigger>
            <TabsTrigger value="fast-simulator" className="quantum-tab">
              <Zap className="w-4 h-4 mr-2" />
              Fast Simulator
            </TabsTrigger>
            <TabsTrigger value="export" className="quantum-tab">
              <FileText className="w-4 h-4 mr-2" />
              Export & Hardware
            </TabsTrigger>
          </TabsList>

          <TabsContent value="circuit-builder" className="space-y-6">
            <CircuitBuilder
              circuit={circuit}
              dragState={dragState}
              simulationResult={simulationResult}
              onDeleteGate={deleteGate}
              onGateMouseDown={handleMouseDown}
              onGateTouchStart={handleTouchStart}
              circuitRef={circuitRef}
              numQubits={NUM_QUBITS}
              gridSize={GRID_SIZE}
            />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <SimulationRunner 
              circuit={circuit}
              onSimulationComplete={(result) => console.log('Simulation Complete:', result)}
              simulationResult={simulationResult}
            />
          </TabsContent>

          <TabsContent value="bloch-sphere">
            <BlochSphere 
              qubitState={defaultQubitState}
              size={400}
            />
          </TabsContent>

          <TabsContent value="fast-simulator" className="space-y-6">
            <FastQuantumSimulator />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <CircuitExporter
              circuit={circuit}
              simulationResult={simulationResult}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
