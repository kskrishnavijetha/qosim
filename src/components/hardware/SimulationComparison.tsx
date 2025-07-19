
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Computer, Cpu, TrendingUp, Clock } from 'lucide-react';

interface SimulationComparisonProps {
  simulationResult: {
    counts: Record<string, number>;
    executionTime: number;
    fidelity: number;
    shots: number;
  };
  hardwareResult: {
    counts: Record<string, number>;
    executionTime: number;
    queueTime: number;
    shots: number;
  };
  jobInfo: {
    name: string;
    backend: string;
    submittedAt: Date;
    completedAt: Date;
  };
}

export function SimulationComparison({ simulationResult, hardwareResult, jobInfo }: SimulationComparisonProps) {
  // Combine results for comparison
  const combinedData = () => {
    const allStates = new Set([
      ...Object.keys(simulationResult.counts),
      ...Object.keys(hardwareResult.counts)
    ]);

    return Array.from(allStates).map(state => ({
      state,
      simulation: (simulationResult.counts[state] || 0) / simulationResult.shots,
      hardware: (hardwareResult.counts[state] || 0) / hardwareResult.shots,
      simCount: simulationResult.counts[state] || 0,
      hwCount: hardwareResult.counts[state] || 0
    })).sort((a, b) => b.hardware - a.hardware);
  };

  const data = combinedData();

  // Calculate fidelity between simulation and hardware
  const calculateFidelity = () => {
    let fidelity = 0;
    const allStates = new Set([...Object.keys(simulationResult.counts), ...Object.keys(hardwareResult.counts)]);
    
    for (const state of allStates) {
      const simProb = (simulationResult.counts[state] || 0) / simulationResult.shots;
      const hwProb = (hardwareResult.counts[state] || 0) / hardwareResult.shots;
      fidelity += Math.sqrt(simProb * hwProb);
    }
    
    return Math.min(fidelity, 1) * 100;
  };

  const fidelity = calculateFidelity();

  // Calculate statistical measures
  const calculateKLDivergence = () => {
    let kl = 0;
    for (const item of data) {
      if (item.simulation > 0 && item.hardware > 0) {
        kl += item.hardware * Math.log(item.hardware / item.simulation);
      }
    }
    return kl;
  };

  const klDivergence = calculateKLDivergence();

  // Performance metrics
  const performanceData = [
    {
      metric: 'Execution Time',
      simulation: simulationResult.executionTime,
      hardware: hardwareResult.executionTime,
      unit: 'ms'
    },
    {
      metric: 'Queue Time',
      simulation: 0,
      hardware: hardwareResult.queueTime,
      unit: 'ms'
    },
    {
      metric: 'Total Time',
      simulation: simulationResult.executionTime,
      hardware: hardwareResult.executionTime + hardwareResult.queueTime,
      unit: 'ms'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-quantum-matrix border border-quantum-neon/20 p-3 rounded shadow-lg">
          <p className="font-mono text-quantum-neon">{`State: |${label}⟩`}</p>
          <p className="text-blue-400">{`Simulation: ${(payload[0].value * 100).toFixed(2)}%`}</p>
          <p className="text-orange-400">{`Hardware: ${(payload[1].value * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Simulation vs Hardware Comparison
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Computer className="w-4 h-4" />
              <span>Job: {jobInfo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Backend: {jobInfo.backend}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Completed: {jobInfo.completedAt.toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-quantum-glow mb-2">
                {fidelity.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Quantum Fidelity</div>
              <Progress value={fidelity} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-quantum-energy mb-2">
                {klDivergence.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">KL Divergence</div>
              <div className="text-xs text-muted-foreground mt-1">
                {klDivergence < 0.1 ? 'Excellent' : klDivergence < 0.5 ? 'Good' : 'Fair'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-quantum-particle mb-2">
                {hardwareResult.shots.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Shots</div>
              <div className="text-xs text-muted-foreground mt-1">
                {simulationResult.shots === hardwareResult.shots ? 'Matched' : 'Different'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison */}
      <Tabs defaultValue="probability" className="w-full">
        <TabsList className="grid w-full grid-cols-3 quantum-tabs">
          <TabsTrigger value="probability">Probability Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
        </TabsList>

        <TabsContent value="probability" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon">Probability Distribution Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="state" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="simulation" fill="#3B82F6" name="Simulation" />
                    <Bar dataKey="hardware" fill="#F59E0B" name="Hardware" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-sm text-quantum-neon">Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.metric}</span>
                      <div className="flex gap-4">
                        <span className="text-blue-400">
                          Sim: {item.simulation.toLocaleString()}{item.unit}
                        </span>
                        <span className="text-orange-400">
                          HW: {item.hardware.toLocaleString()}{item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-500/20 h-2 rounded" style={{ 
                        width: `${Math.min(item.simulation / Math.max(item.simulation, item.hardware) * 100, 100)}%` 
                      }} />
                      <div className="bg-orange-500/20 h-2 rounded" style={{ 
                        width: `${Math.min(item.hardware / Math.max(item.simulation, item.hardware) * 100, 100)}%` 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
                  <Computer className="w-4 h-4" />
                  Simulation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(simulationResult.counts)
                    .sort(([,a], [,b]) => b - a)
                    .map(([state, count]) => (
                      <div key={state} className="flex justify-between text-sm">
                        <span className="font-mono text-quantum-neon">|{state}⟩</span>
                        <div className="flex gap-4">
                          <span className="text-quantum-particle">{count}</span>
                          <span className="text-blue-400">
                            {((count / simulationResult.shots) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Hardware Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(hardwareResult.counts)
                    .sort(([,a], [,b]) => b - a)
                    .map(([state, count]) => (
                      <div key={state} className="flex justify-between text-sm">
                        <span className="font-mono text-quantum-neon">|{state}⟩</span>
                        <div className="flex gap-4">
                          <span className="text-quantum-particle">{count}</span>
                          <span className="text-orange-400">
                            {((count / hardwareResult.shots) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
