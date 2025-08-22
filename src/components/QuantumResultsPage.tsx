
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumVisualizationPanel } from './QuantumVisualizationPanel';
import { SimulationResults } from './workflow/SimulationResults';
import { CircuitExplanationPanel } from './workflow/CircuitExplanationPanel';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { Gate } from '@/hooks/useCircuitState';
import { ArrowLeft, Calculator, Eye, Bot, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuantumResultsPageProps {
  result: QuantumBackendResult;
  gates: Gate[];
  numQubits: number;
  circuitName: string;
  onRerunSimulation: () => Promise<QuantumBackendResult | null>;
  onExecutePartialCircuit: (gates: Gate[], shots?: number) => Promise<QuantumBackendResult | null>;
}

export function QuantumResultsPage({
  result,
  gates,
  numQubits,
  circuitName,
  onRerunSimulation,
  onExecutePartialCircuit
}: QuantumResultsPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate mathematical results
  const totalShots = Object.values(result.counts || {}).reduce((sum, count) => sum + count, 0) || 1024;
  const activeStates = Object.keys(result.measurementProbabilities).length;
  const maxProbability = Math.max(...Object.values(result.measurementProbabilities));
  const entropy = -Object.values(result.measurementProbabilities)
    .filter(p => p > 0)
    .reduce((sum, p) => sum + p * Math.log2(p), 0);

  // Calculate fidelity from state vector if available
  const calculateFidelity = () => {
    if (result.stateVector && result.stateVector.length > 0) {
      const norm = Math.sqrt(result.stateVector.reduce((sum, amp) => 
        sum + amp.real * amp.real + amp.imaginary * amp.imaginary, 0
      ));
      return norm;
    }
    return 1.0; // Default fidelity
  };

  const fidelity = calculateFidelity();

  return (
    <div className="min-h-screen bg-quantum-void">
      {/* Header */}
      <div className="quantum-panel neon-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/app')}
                className="quantum-panel neon-border"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Builder
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-quantum-glow">Simulation Results</h1>
                <p className="text-quantum-particle">{circuitName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-quantum-neon">
                {result.backend.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-quantum-plasma">
                {numQubits} Qubits
              </Badge>
              <Badge variant="outline" className="text-quantum-energy">
                {gates.length} Gates
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-quantum-glow">
                {result.executionTime.toFixed(1)}ms
              </div>
              <div className="text-sm text-quantum-particle">Execution Time</div>
            </CardContent>
          </Card>
          
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-quantum-neon">
                {activeStates}
              </div>
              <div className="text-sm text-quantum-particle">Active States</div>
            </CardContent>
          </Card>
          
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-quantum-plasma">
                {(maxProbability * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-quantum-particle">Max Probability</div>
            </CardContent>
          </Card>
          
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-quantum-energy">
                {entropy.toFixed(2)}
              </div>
              <div className="text-sm text-quantum-particle">Entropy (bits)</div>
            </CardContent>
          </Card>
          
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-quantum-glow">
                {totalShots.toLocaleString()}
              </div>
              <div className="text-sm text-quantum-particle">Total Shots</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 quantum-panel neon-border">
            <TabsTrigger value="overview" className="text-quantum-glow">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="visualization" className="text-quantum-neon">
              <BarChart className="w-4 h-4 mr-2" />
              Visualization
            </TabsTrigger>
            <TabsTrigger value="ai-explanation" className="text-quantum-particle">
              <Bot className="w-4 h-4 mr-2" />
              AI Explanation
            </TabsTrigger>
            <TabsTrigger value="mathematics" className="text-quantum-plasma">
              <Calculator className="w-4 h-4 mr-2" />
              Mathematics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SimulationResults
              result={result}
              showAdvanced={true}
              numQubits={numQubits}
            />
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <QuantumVisualizationPanel
              result={result}
              gates={gates}
              numQubits={numQubits}
              circuitName={circuitName}
              onRerunSimulation={onRerunSimulation}
              onExecutePartialCircuit={onExecutePartialCircuit}
            />
          </TabsContent>

          <TabsContent value="ai-explanation" className="space-y-6">
            <CircuitExplanationPanel
              gates={gates}
              result={result}
              numQubits={numQubits}
              isVisible={activeTab === 'ai-explanation'}
            />
          </TabsContent>

          <TabsContent value="mathematics" className="space-y-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-plasma flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Mathematical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* State Vector Mathematics */}
                <div>
                  <h3 className="text-lg font-semibold text-quantum-glow mb-4">State Vector Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-quantum-matrix border-quantum-neon">
                      <CardContent className="p-4">
                        <div className="text-sm text-quantum-particle">Vector Norm</div>
                        <div className="text-xl font-mono text-quantum-neon">
                          {Math.sqrt(result.stateVector.reduce((sum, amp) => 
                            sum + amp.real * amp.real + amp.imaginary * amp.imaginary, 0
                          )).toFixed(6)}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-quantum-matrix border-quantum-plasma">
                      <CardContent className="p-4">
                        <div className="text-sm text-quantum-particle">Fidelity</div>
                        <div className="text-xl font-mono text-quantum-plasma">
                          {(fidelity * 100).toFixed(3)}%
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-quantum-matrix border-quantum-energy">
                      <CardContent className="p-4">
                        <div className="text-sm text-quantum-particle">Entanglement</div>
                        <div className="text-xl font-mono text-quantum-energy">
                          {result.entanglement?.totalEntanglement ? 
                            (result.entanglement.totalEntanglement * 100).toFixed(2) + '%' : 
                            '0.00%'
                          }
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Probability Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-quantum-glow mb-4">Probability Distribution</h3>
                  <div className="bg-quantum-matrix rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
                      {Object.entries(result.measurementProbabilities)
                        .filter(([_, prob]) => prob > 0.001)
                        .sort(([_, a], [__, b]) => b - a)
                        .map(([state, probability]) => (
                          <div key={state} className="flex items-center justify-between p-2 bg-quantum-void rounded border border-quantum-neon">
                            <span className="text-quantum-neon">|{state}⟩</span>
                            <span className="text-quantum-energy">{probability.toFixed(6)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Shannon Entropy Calculation */}
                <div>
                  <h3 className="text-lg font-semibold text-quantum-glow mb-4">Information Theory</h3>
                  <div className="bg-quantum-matrix rounded-lg p-4">
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Shannon Entropy:</span>
                        <span className="text-quantum-neon">H = -{entropy.toFixed(4)} bits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Max Entropy:</span>
                        <span className="text-quantum-plasma">{Math.log2(Math.pow(2, numQubits)).toFixed(4)} bits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Relative Entropy:</span>
                        <span className="text-quantum-energy">{(entropy / numQubits * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Measurement Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-quantum-glow mb-4">Measurement Statistics</h3>
                  <div className="bg-quantum-matrix rounded-lg p-4">
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Total Measurements:</span>
                        <span className="text-quantum-neon">{totalShots.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Unique Outcomes:</span>
                        <span className="text-quantum-plasma">{activeStates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-quantum-particle">Statistical Accuracy:</span>
                        <span className="text-quantum-energy">±{(1.96 / Math.sqrt(totalShots) * 100).toFixed(3)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
