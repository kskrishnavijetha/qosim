
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { HardwareJob } from '@/services/quantumHardwareService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ResultComparisonProps {
  simulationResult?: any;
  hardwareJobs: HardwareJob[];
}

export function ResultComparison({ simulationResult, hardwareJobs }: ResultComparisonProps) {
  const [selectedJob, setSelectedJob] = useState<HardwareJob | null>(
    hardwareJobs.length > 0 ? hardwareJobs[0] : null
  );

  const prepareComparisonData = () => {
    if (!simulationResult || !selectedJob?.results) return null;

    const simCounts = simulationResult.counts || simulationResult.measurementProbabilities || {};
    const hwCounts = selectedJob.results.counts || {};

    // Get all unique states
    const allStates = new Set([...Object.keys(simCounts), ...Object.keys(hwCounts)]);
    
    const comparisonData = Array.from(allStates).map(state => {
      const simValue = simCounts[state] || 0;
      const hwValue = hwCounts[state] || 0;
      const simProb = typeof simValue === 'number' ? simValue / (selectedJob?.shots || 1024) : simValue;
      const hwProb = hwValue / (selectedJob?.shots || 1024);
      
      return {
        state,
        simulation: typeof simProb === 'number' ? simProb * 100 : simProb * 100,
        hardware: hwProb * 100,
        difference: Math.abs((typeof simProb === 'number' ? simProb : 0) * 100 - hwProb * 100)
      };
    }).sort((a, b) => b.hardware - a.hardware);

    return comparisonData;
  };

  const calculateFidelity = () => {
    const data = prepareComparisonData();
    if (!data || data.length === 0) return 0;

    // Calculate quantum state fidelity (simplified)
    const fidelity = data.reduce((sum, item) => {
      const simProb = item.simulation / 100;
      const hwProb = item.hardware / 100;
      return sum + Math.sqrt(simProb * hwProb);
    }, 0);

    return Math.pow(fidelity, 2) * 100;
  };

  const getErrorAnalysis = () => {
    if (!selectedJob?.results) return null;

    const fidelity = selectedJob.results.fidelity || calculateFidelity() / 100;
    const errorRate = selectedJob.results.errorRate || 0;

    return {
      fidelity: fidelity * 100,
      errorRate: errorRate * 100,
      coherenceTime: 95, // Mock coherence time
      gateErrors: {
        singleQubit: 0.05,
        twoQubit: 0.15,
        measurement: 0.02
      }
    };
  };

  const comparisonData = prepareComparisonData();
  const errorAnalysis = getErrorAnalysis();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono text-quantum-glow">Results Comparison</h3>
        
        {hardwareJobs.length > 0 && (
          <Select
            value={selectedJob?.id || ''}
            onValueChange={(jobId) => {
              const job = hardwareJobs.find(j => j.id === jobId);
              setSelectedJob(job || null);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select hardware job to compare" />
            </SelectTrigger>
            <SelectContent>
              {hardwareJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.name} ({job.device})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!simulationResult || !selectedJob ? (
        <Card className="quantum-panel">
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-mono text-muted-foreground mb-2">No Comparison Available</h4>
            <p className="text-sm text-muted-foreground">
              {!simulationResult ? 'Run a simulation first, then execute on hardware to compare results' : 
               'Execute your circuit on hardware to see comparison with simulation results'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Comparison Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="quantum-panel">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-quantum-glow" />
                  <span className="font-mono text-quantum-glow">Fidelity</span>
                </div>
                <div className="text-2xl font-mono text-quantum-neon">
                  {errorAnalysis ? `${errorAnalysis.fidelity.toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {errorAnalysis && errorAnalysis.fidelity > 90 ? 'Excellent' : 
                   errorAnalysis && errorAnalysis.fidelity > 80 ? 'Good' : 'Needs Improvement'}
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-panel">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-quantum-energy" />
                  <span className="font-mono text-quantum-energy">Error Rate</span>
                </div>
                <div className="text-2xl font-mono text-quantum-particle">
                  {errorAnalysis ? `${errorAnalysis.errorRate.toFixed(2)}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Hardware noise impact
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-panel">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-quantum-particle" />
                  <span className="font-mono text-quantum-particle">Match Score</span>
                </div>
                <div className="text-2xl font-mono text-quantum-glow">
                  {comparisonData ? `${(100 - comparisonData.reduce((sum, item) => sum + item.difference, 0) / comparisonData.length).toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Sim vs Hardware
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison */}
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="grid w-full grid-cols-3 quantum-tabs">
              <TabsTrigger value="distribution">State Distribution</TabsTrigger>
              <TabsTrigger value="errors">Error Analysis</TabsTrigger>
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="distribution" className="space-y-4">
              <Card className="quantum-panel">
                <CardHeader>
                  <CardTitle className="text-base font-mono text-quantum-neon">
                    Measurement Results Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comparisonData && (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis 
                            dataKey="state" 
                            stroke="#64ffda"
                            fontSize={12}
                            fontFamily="monospace"
                          />
                          <YAxis 
                            stroke="#64ffda"
                            fontSize={12}
                            fontFamily="monospace"
                            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#0a0a0a',
                              border: '1px solid #64ffda',
                              borderRadius: '8px',
                              fontFamily: 'monospace'
                            }}
                          />
                          <Bar dataKey="simulation" fill="#64ffda" name="Simulation" opacity={0.8} />
                          <Bar dataKey="hardware" fill="#ff6b6b" name="Hardware" opacity={0.8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="errors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="quantum-panel">
                  <CardHeader>
                    <CardTitle className="text-base font-mono text-quantum-neon">
                      Gate Error Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {errorAnalysis && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Single-Qubit Gates</span>
                          <Badge variant="outline" className="text-quantum-particle">
                            {errorAnalysis.gateErrors.singleQubit}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Two-Qubit Gates</span>
                          <Badge variant="outline" className="text-quantum-energy">
                            {errorAnalysis.gateErrors.twoQubit}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Measurement</span>
                          <Badge variant="outline" className="text-quantum-glow">
                            {errorAnalysis.gateErrors.measurement}%
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="quantum-panel">
                  <CardHeader>
                    <CardTitle className="text-base font-mono text-quantum-neon">
                      Noise Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Decoherence</span>
                      <Badge variant="outline" className="text-quantum-particle">
                        Primary
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Crosstalk</span>
                      <Badge variant="outline" className="text-quantum-energy">
                        Moderate
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Control Errors</span>
                      <Badge variant="outline" className="text-quantum-glow">
                        Low
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="quantum-panel">
                  <CardHeader>
                    <CardTitle className="text-base font-mono text-quantum-neon">
                      Execution Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Simulation Time</div>
                        <div className="font-mono text-quantum-particle">
                          {simulationResult.executionTime ? `${simulationResult.executionTime.toFixed(2)}ms` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Hardware Time</div>
                        <div className="font-mono text-quantum-energy">
                          {selectedJob.results?.executionTime ? `${selectedJob.results.executionTime.toFixed(0)}ms` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Queue Time</div>
                        <div className="font-mono text-quantum-glow">
                          {selectedJob.startedAt && selectedJob.submittedAt ? 
                            `${Math.round((selectedJob.startedAt.getTime() - selectedJob.submittedAt.getTime()) / 1000)}s` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Cost</div>
                        <div className="font-mono text-quantum-neon">
                          ${selectedJob.cost.actual?.toFixed(3) || selectedJob.cost.estimated.toFixed(3)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="quantum-panel">
                  <CardHeader>
                    <CardTitle className="text-base font-mono text-quantum-neon">
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div className="text-sm">
                        <div className="text-quantum-neon">Error Mitigation</div>
                        <div className="text-muted-foreground">Apply readout error correction</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <div className="text-quantum-neon">Circuit Optimization</div>
                        <div className="text-muted-foreground">Reduce two-qubit gate count</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div className="text-sm">
                        <div className="text-quantum-neon">Device Selection</div>
                        <div className="text-muted-foreground">Consider lower-noise devices</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
