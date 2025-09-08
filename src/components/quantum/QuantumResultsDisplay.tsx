
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { EnhancedBlochSphere } from './EnhancedBlochSphere';
import { ProbabilityHistogram } from '@/components/visualization/ProbabilityHistogram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Circle, Activity } from 'lucide-react';

interface QuantumResultsDisplayProps {
  result: QuantumBackendResult | null;
  numQubits?: number;
}

export function QuantumResultsDisplay({ result, numQubits = 5 }: QuantumResultsDisplayProps) {
  if (!result) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quantum Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Run a quantum simulation to see results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for visualizations with proper type conversions
  const counts = result.counts || {};
  const totalShots = Object.values(counts).reduce((sum, count) => sum + count, 0) || 1024;

  // Convert bloch sphere data to include required theta and phi properties
  const blochSphereData = result.blochSphereData.map(data => ({
    ...data,
    theta: data.theta || Math.acos(data.z),
    phi: data.phi || Math.atan2(data.y, data.x)
  }));

  // Convert qubit states to match expected format
  const qubitStates = result.qubitStates.map(state => ({
    qubit: state.qubit,
    state: state.state,
    amplitude: {
      real: state.amplitude.real,
      imag: state.amplitude.imaginary
    },
    probability: state.probability,
    phase: state.phase
  }));

  return (
    <div className="space-y-6">
      {/* Quick Summary Cards */}
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
              {result.backend.toUpperCase()}
            </div>
            <div className="text-sm text-quantum-particle">Backend</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Tabs */}
      <Tabs defaultValue="histogram" className="w-full">
        <TabsList className="grid w-full grid-cols-2 quantum-panel neon-border">
          <TabsTrigger value="histogram" className="text-quantum-glow">
            <BarChart className="w-4 h-4 mr-2" />
            Measurement Results
          </TabsTrigger>
          <TabsTrigger value="bloch" className="text-quantum-neon">
            <Circle className="w-4 h-4 mr-2" />
            Bloch Spheres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="histogram">
          <ProbabilityHistogram
            counts={counts}
            totalShots={totalShots}
            maxBars={16}
          />
        </TabsContent>

        <TabsContent value="bloch">
          <EnhancedBlochSphere
            blochSphereData={blochSphereData}
            qubitStates={qubitStates}
            selectedQubit={0}
            onQubitSelect={() => {}}
          />
        </TabsContent>
      </Tabs>

      {/* Status Information */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-energy flex items-center gap-2">
            <Badge variant="outline" className="text-quantum-glow">
              Job ID: {result.jobId}
            </Badge>
            <Badge variant="outline" className="text-quantum-neon">
              Backend: {result.backend}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.error ? (
            <div className="text-red-400 font-mono text-sm">
              Error: {result.error}
            </div>
          ) : (
            <div className="text-quantum-particle text-sm">
              Simulation completed successfully in {result.executionTime.toFixed(2)}ms
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
