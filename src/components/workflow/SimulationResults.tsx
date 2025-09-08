
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { ProbabilityHistogram } from '@/components/visualization/ProbabilityHistogram';
import { QuantumStateHeatmap } from '@/components/visualization/QuantumStateHeatmap';
import { EnhancedBlochSphere } from '@/components/quantum/EnhancedBlochSphere';
import { StateVectorMatrix } from '@/components/quantum/StateVectorMatrix';
import { BarChart, Circle, Grid, Table } from 'lucide-react';
import { Complex } from '@/services/complexNumbers';

interface SimulationResultsProps {
  result: QuantumBackendResult;
  showAdvanced: boolean;
  numQubits: number;
}

export function SimulationResults({ result, showAdvanced, numQubits }: SimulationResultsProps) {
  // Convert counts to proper format for histogram
  const counts = result.counts || {};
  const totalShots = Object.values(counts).reduce((sum, count) => sum + count, 0) || 1024;

  // Convert state vector for heatmap
  const stateVectorComplex = result.stateVector.map(amp => 
    new Complex(amp.real, amp.imaginary)
  );

  // Convert state vector for StateVectorMatrix component (fix property name mismatch)
  const stateVectorForMatrix = result.stateVector.map(amp => ({
    real: amp.real,
    imag: amp.imaginary, // Convert 'imaginary' to 'imag'
    magnitude: amp.magnitude,
    phase: amp.phase
  }));

  // Prepare basis states for matrix visualization with correct property names
  const basisStates = Object.entries(result.measurementProbabilities).map(([state, prob]) => ({
    state,
    amplitude: { real: Math.sqrt(prob), imag: 0 },
    probability: prob
  }));

  // Convert Bloch sphere data to include theta and phi if missing
  const blochSphereData = result.blochSphereData.map(data => ({
    ...data,
    theta: data.theta || Math.acos(data.z),
    phi: data.phi || Math.atan2(data.y, data.x)
  }));

  // Convert qubit states to match expected format
  const qubitStates = result.qubitStates.map(state => ({
    ...state,
    amplitude: {
      real: state.amplitude.real,
      imag: state.amplitude.imag
    }
  }));

  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-glow">
              {Object.keys(result.measurementProbabilities).length}
            </div>
            <div className="text-sm text-quantum-particle">Active States</div>
          </CardContent>
        </Card>
        
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-neon">
              {result.executionTime.toFixed(1)}ms
            </div>
            <div className="text-sm text-quantum-particle">Execution Time</div>
          </CardContent>
        </Card>
        
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-plasma">
              {totalShots.toLocaleString()}
            </div>
            <div className="text-sm text-quantum-particle">Total Shots</div>
          </CardContent>
        </Card>
        
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-energy">
              {result.entanglement?.totalEntanglement ? 
                (result.entanglement.totalEntanglement * 100).toFixed(1) + '%' : 
                '0%'
              }
            </div>
            <div className="text-sm text-quantum-particle">Entanglement</div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Tabs */}
      <Tabs defaultValue="histogram" className="w-full">
        <TabsList className="grid grid-cols-4 quantum-panel neon-border">
          <TabsTrigger value="histogram" className="text-quantum-glow">
            <BarChart className="w-4 h-4 mr-2" />
            Histogram
          </TabsTrigger>
          <TabsTrigger value="bloch" className="text-quantum-neon">
            <Circle className="w-4 h-4 mr-2" />
            Bloch Spheres
          </TabsTrigger>
          {showAdvanced && (
            <TabsTrigger value="heatmap" className="text-quantum-particle">
              <Grid className="w-4 h-4 mr-2" />
              Heatmap
            </TabsTrigger>
          )}
          {showAdvanced && (
            <TabsTrigger value="statevector" className="text-quantum-plasma">
              <Table className="w-4 h-4 mr-2" />
              State Vector
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="histogram" className="space-y-4">
          <ProbabilityHistogram
            counts={counts}
            totalShots={totalShots}
            maxBars={16}
          />
        </TabsContent>

        <TabsContent value="bloch" className="space-y-4">
          <EnhancedBlochSphere
            blochSphereData={blochSphereData}
            qubitStates={qubitStates}
            selectedQubit={0}
            onQubitSelect={() => {}}
          />
        </TabsContent>

        {showAdvanced && (
          <TabsContent value="heatmap" className="space-y-4">
            <QuantumStateHeatmap
              stateVector={stateVectorComplex}
              numQubits={numQubits}
              maxStates={64}
            />
          </TabsContent>
        )}

        {showAdvanced && (
          <TabsContent value="statevector" className="space-y-4">
            <StateVectorMatrix
              stateVector={stateVectorForMatrix}
              probabilities={Object.values(result.measurementProbabilities)}
              basisStates={basisStates}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Entanglement Analysis */}
      {result.entanglement && result.entanglement.pairs.length > 0 && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-energy">Entanglement Analysis</CardTitle>
            <CardDescription>
              Detected quantum entanglement between qubit pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.entanglement.pairs.map((pair, index) => (
                <div key={index} className="quantum-panel neon-border rounded p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-quantum-neon">
                      Q{pair.qubit1} ↔ Q{pair.qubit2}
                    </span>
                    <span className="text-quantum-energy font-bold">
                      {(pair.strength * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-quantum-void rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-quantum-glow to-quantum-energy"
                      style={{ width: `${pair.strength * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
