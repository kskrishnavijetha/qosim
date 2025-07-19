import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { CircuitBuilder } from '../circuit/CircuitBuilder';
import { SimulationVisualizer } from '../visualization/SimulationVisualizer';
import { BlochSphere } from '../visualization/BlochSphere';
import { SimulationRunner } from './SimulationRunner';
import { useCircuitState } from '@/hooks/useCircuitState';
import { Zap } from 'lucide-react';
import { FastQuantumSimulator } from '../simulation/FastQuantumSimulator';

export function QuantumAlgorithmsSDK() {
  const [activeTab, setActiveTab] = useState("circuit-builder");
  const { circuit, simulationResult } = useCircuitState();

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
            <ModeToggle />
            <Button variant="secondary">
              <a href="https://github.com/Quantum-Tinkerers/quantum-lab" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 quantum-tabs">
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
          </TabsList>

          <TabsContent value="circuit-builder" className="space-y-6">
            <CircuitBuilder />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <SimulationRunner 
              circuit={circuit}
              onSimulationComplete={(result) => console.log('Simulation Complete:', result)}
              simulationResult={simulationResult}
            />
            {simulationResult && (
              <SimulationVisualizer simulationResult={simulationResult} />
            )}
          </TabsContent>

          <TabsContent value="bloch-sphere">
            <BlochSphere />
          </TabsContent>

          <TabsContent value="fast-simulator" className="space-y-6">
            <FastQuantumSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
