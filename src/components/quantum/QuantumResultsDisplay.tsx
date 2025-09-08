
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedBlochSphere } from './EnhancedBlochSphere';
import { Clock, Cpu, Zap, Activity } from 'lucide-react';
import { QuantumBackendResult } from '@/services/quantumBackendService';

interface QuantumResultsDisplayProps {
  result: QuantumBackendResult;
}

export function QuantumResultsDisplay({ result }: QuantumResultsDisplayProps) {
  const [selectedQubit, setSelectedQubit] = useState(0);

  if (result.error) {
    return (
      <Card className="quantum-panel neon-border border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Quantum Execution Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const formatComplex = (amplitude: { real: number; imaginary: number }) => {
    const real = amplitude.real.toFixed(4);
    const imag = Math.abs(amplitude.imaginary).toFixed(4);
    const sign = amplitude.imaginary >= 0 ? '+' : '-';
    return imag === '0.0000' ? real : `${real}${sign}${imag}i`;
  };

  const significantProbabilities = Object.entries(result.measurementProbabilities)
    .filter(([_, prob]) => prob > 0.001)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Execution Summary */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quantum Execution Summary
          </CardTitle>
          <CardDescription>
            Results from {result.backend} quantum backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="quantum-panel neon-border rounded p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-quantum-glow" />
                <span className="text-xs text-quantum-particle">Execution Time</span>
              </div>
              <div className="text-lg font-mono text-quantum-glow">
                {result.executionTime.toFixed(2)}ms
              </div>
            </div>
            
            <div className="quantum-panel neon-border rounded p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-quantum-neon" />
                <span className="text-xs text-quantum-particle">Backend</span>
              </div>
              <Badge variant="outline" className="text-quantum-neon">
                {result.backend.toUpperCase()}
              </Badge>
            </div>
            
            <div className="quantum-panel neon-border rounded p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-quantum-plasma" />
                <span className="text-xs text-quantum-particle">States</span>
              </div>
              <div className="text-lg font-mono text-quantum-plasma">
                {result.stateVector.length}
              </div>
            </div>
            
            <div className="quantum-panel neon-border rounded p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-quantum-particle" />
                <span className="text-xs text-quantum-particle">Job ID</span>
              </div>
              <div className="text-sm font-mono text-quantum-particle truncate">
                {result.jobId || 'Local'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Results */}
      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-4 quantum-panel neon-border">
          <TabsTrigger value="visualization" className="text-quantum-glow">Visualization</TabsTrigger>
          <TabsTrigger value="probabilities" className="text-quantum-neon">Probabilities</TabsTrigger>
          <TabsTrigger value="statevector" className="text-quantum-particle">State Vector</TabsTrigger>
          <TabsTrigger value="qubits" className="text-quantum-plasma">Qubits</TabsTrigger>
        </TabsList>

        {/* Bloch Sphere Visualization */}
        <TabsContent value="visualization">
          <EnhancedBlochSphere
            blochSphereData={result.blochSphereData}
            qubitStates={result.qubitStates}
            selectedQubit={selectedQubit}
            onQubitSelect={setSelectedQubit}
          />
        </TabsContent>

        {/* Measurement Probabilities */}
        <TabsContent value="probabilities">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Measurement Probabilities</CardTitle>
              <CardDescription>
                Probability distribution over computational basis states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {significantProbabilities.map(([state, probability]) => (
                  <div key={state} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-quantum-neon font-mono text-lg">
                          |{state}⟩
                        </span>
                        <span className="text-xs text-quantum-particle">
                          (decimal: {parseInt(state, 2)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-quantum-glow">
                          {(probability * 100).toFixed(2)}%
                        </Badge>
                        {result.counts && (
                          <Badge variant="outline" className="text-quantum-particle">
                            {result.counts[state] || 0} shots
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Progress value={probability * 100} className="h-3" />
                      <div 
                        className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${probability * 100}%`,
                          background: `linear-gradient(90deg, 
                            hsl(var(--quantum-glow) / 0.8), 
                            hsl(var(--quantum-neon) / 0.6), 
                            hsl(var(--quantum-particle) / 0.4)
                          )`,
                          boxShadow: `0 0 10px hsl(var(--quantum-glow) / ${probability})`
                        }}
                      />
                    </div>
                  </div>
                ))}
                
                {significantProbabilities.length === 0 && (
                  <div className="text-center text-quantum-particle py-8">
                    No significant measurement probabilities found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* State Vector */}
        <TabsContent value="statevector">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Quantum State Vector</CardTitle>
              <CardDescription>
                Complex amplitudes for each computational basis state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="quantum-panel neon-border rounded p-4 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {result.stateVector.map((amplitude, index) => {
                    if (amplitude.magnitude < 0.001) return null;
                    
                    const binaryState = index.toString(2).padStart(
                      Math.log2(result.stateVector.length), 
                      '0'
                    );
                    
                    return (
                      <div key={index} className="flex items-center justify-between font-mono text-sm">
                        <span className="text-quantum-neon">
                          |{binaryState}⟩:
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-quantum-glow">
                            {formatComplex(amplitude)}
                          </span>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: `hsl(var(--quantum-matrix) / ${amplitude.magnitude})`,
                              borderColor: 'hsl(var(--quantum-glow))'
                            }}
                          >
                            |{amplitude.magnitude.toFixed(3)}|
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Qubits */}
        <TabsContent value="qubits">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Individual Qubit States</CardTitle>
              <CardDescription>
                Reduced density matrix analysis for each qubit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.qubitStates.map((qubit, index) => (
                  <div key={index} className="quantum-panel neon-border rounded p-4">
                    <div className="text-center mb-3">
                      <div className="text-lg font-mono text-quantum-neon">
                        Qubit {qubit.qubit}
                      </div>
                      <Badge variant="outline" className="text-quantum-glow">
                        {qubit.state}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Amplitude:</span>
                        <span className="text-quantum-neon font-mono">
                          {qubit.amplitude.real.toFixed(4)} + {qubit.amplitude.imag.toFixed(4)}i
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Probability:</span>
                        <Badge variant="outline" className="text-xs">
                          {(qubit.probability * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Phase:</span>
                        <span className="text-quantum-plasma font-mono">
                          {qubit.phase.toFixed(3)} rad
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
