
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Share2, Eye, Lightbulb, Calculator } from 'lucide-react';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { ProbabilityHistogram } from '@/components/visualization/ProbabilityHistogram';
import { QuantumStateHeatmap } from '@/components/visualization/QuantumStateHeatmap';
import { BlochSphereVisualization } from '@/components/quantum/BlochSphereVisualization';
import { StateVectorMatrix } from '@/components/quantum/StateVectorMatrix';
import { BarChart, Circle, Grid, Table } from 'lucide-react';
import { Complex } from '@/services/complexNumbers';

interface QuantumResultsPageProps {
  result: any;
  circuit: Gate[];
  onBack: () => void;
}

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[];
}

export function QuantumResultsPage({ result, circuit, onBack }: QuantumResultsPageProps) {
  // Safely extract result data with fallbacks
  const stateVector = result?.stateVector || result?.state || [];
  const measurements = result?.measurements || result?.counts || {};
  const probabilities = result?.probabilities || [];
  const metadata = result?.metadata || {};
  
  // Calculate mathematical properties with proper type checking
  const calculateEntropy = (): number => {
    if (!Array.isArray(probabilities) || probabilities.length === 0) return 0;
    return -probabilities.reduce((sum: number, p: unknown) => {
      const prob = typeof p === 'number' ? p : Number(p) || 0;
      return prob > 0 ? sum + prob * Math.log2(prob) : sum;
    }, 0);
  };

  const calculateFidelity = (): number => {
    // Calculate fidelity with ideal state (simplified)
    if (!Array.isArray(stateVector) || stateVector.length === 0) return 1;
    const firstAmplitude = stateVector[0];
    if (typeof firstAmplitude === 'object' && firstAmplitude !== null && 'real' in firstAmplitude) {
      return Math.abs(Number(firstAmplitude.real) || 0) ** 2;
    }
    return Math.abs(Number(firstAmplitude) || 0) ** 2;
  };

  const generateAIExplanation = (): string => {
    const numQubits = Math.log2(stateVector.length || 4);
    const dominantState = Object.keys(measurements)[0] || '000';
    const measurementValues = Object.values(measurements).map(v => Number(v) || 0);
    const maxProbability = measurementValues.length > 0 ? Math.max(...measurementValues) : 0;

    return `This ${numQubits}-qubit quantum circuit produced a quantum superposition state. 
    The dominant measurement outcome is |${dominantState}⟩ with probability ${(maxProbability * 100).toFixed(1)}%. 
    The circuit entropy is ${calculateEntropy().toFixed(3)}, indicating ${calculateEntropy() > 1 ? 'high' : 'low'} quantum coherence. 
    The state fidelity is ${calculateFidelity().toFixed(3)}, showing ${calculateFidelity() > 0.9 ? 'excellent' : 'moderate'} circuit performance.`;
  };

  // Calculate total shots for probability histogram
  const totalShots = Object.values(measurements).reduce((sum: number, count) => sum + (Number(count) || 0), 0) || 1024;

  // Generate Bloch sphere data with proper fallback
  const blochSphereData = React.useMemo(() => {
    const numQubits = Math.log2(stateVector.length || 4);
    
    // Default fallback for all qubits in |0⟩ state
    return Array.from({ length: numQubits }, (_, i) => ({
      x: 0,
      y: 0,
      z: 1,
      qubit: i,
      theta: 0,
      phi: 0
    }));
  }, [stateVector]);

  // Prepare qubit states for visualization
  const qubitStates = React.useMemo(() => {
    const numQubits = Math.log2(stateVector.length || 4);
    
    // Generate default qubit states
    return Array.from({ length: numQubits }, (_, i) => ({
      qubit: i,
      state: '|0⟩',
      amplitude: { real: 1, imag: 0 },
      phase: 0,
      probability: 0
    }));
  }, [stateVector]);

  // Calculate purity with proper type checking
  const calculatePurity = (): number => {
    if (!Array.isArray(probabilities) || probabilities.length === 0) return 1;
    return probabilities.reduce((sum: number, p: unknown) => {
      const prob = typeof p === 'number' ? p : Number(p) || 0;
      return sum + prob * prob;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Builder
              </Button>
              <CardTitle className="text-quantum-glow">Quantum Simulation Results</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-quantum-glow">
              Gates: {circuit.length}
            </Badge>
            <Badge variant="outline" className="text-blue-400">
              Qubits: {Math.log2(stateVector.length || 4)}
            </Badge>
            <Badge variant="outline" className="text-green-400">
              Shots: {totalShots}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Visualizations */}
        <div className="col-span-8 space-y-6">
          {/* Bloch Sphere */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Bloch Sphere Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BlochSphereVisualization 
                  blochSphereData={blochSphereData}
                  qubitStates={qubitStates}
                  selectedQubit={0}
                  onQubitSelect={() => {}}
                />
              </div>
            </CardContent>
          </Card>

          {/* Probability Histogram */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-quantum-glow">
                Measurement Probability Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ProbabilityHistogram 
                  counts={measurements}
                  totalShots={totalShots}
                  maxBars={16}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quantum State Heatmap */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-quantum-glow">
                Quantum State Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <QuantumStateHeatmap 
                  stateVector={stateVector}
                  numQubits={Math.log2(stateVector.length || 4)}
                  maxStates={32}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analysis */}
        <div className="col-span-4 space-y-6">
          {/* AI Explanation */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-quantum-particle leading-relaxed">
                {generateAIExplanation()}
              </p>
            </CardContent>
          </Card>

          {/* Mathematical Calculations */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Mathematical Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-quantum-neon mb-2">Quantum Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-quantum-particle">Entropy:</span>
                    <span className="text-quantum-glow">{calculateEntropy().toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-quantum-particle">Fidelity:</span>
                    <span className="text-quantum-glow">{calculateFidelity().toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-quantum-particle">Purity:</span>
                    <span className="text-quantum-glow">{calculatePurity().toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-quantum-neon mb-2">State Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-quantum-particle">Dimension:</span>
                    <span className="text-quantum-glow">{stateVector.length || 4}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-quantum-particle">Non-zero Amplitudes:</span>
                    <span className="text-quantum-glow">
                      {Array.isArray(stateVector) ? stateVector.filter((amp: any) => Math.abs(Number(amp) || 0) > 1e-10).length : 0}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-quantum-neon mb-2">Top Measurements</h4>
                <div className="space-y-1">
                  {Object.entries(measurements)
                    .sort(([,a], [,b]) => Number(b) - Number(a))
                    .slice(0, 5)
                    .map(([state, count]) => {
                      const percentage = ((Number(count) || 0) / totalShots) * 100;
                      return (
                        <div key={state} className="flex justify-between text-xs">
                          <span className="text-quantum-particle font-mono">|{state}⟩</span>
                          <span className="text-quantum-glow">{percentage.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Circuit Summary */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm font-mono text-quantum-glow">
                Circuit Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-quantum-particle">Total Gates:</span>
                  <span className="text-quantum-glow">{circuit.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantum-particle">Circuit Depth:</span>
                  <span className="text-quantum-glow">
                    {circuit.length > 0 
                      ? Math.max(...circuit.map(g => Number(g.position || 0))) 
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantum-particle">Gate Types:</span>
                  <span className="text-quantum-glow">{new Set(circuit.map(g => g.type)).size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
