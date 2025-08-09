
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Gauge, Clock, Zap, AlertTriangle } from 'lucide-react';

interface PerformanceMetricsPanelProps {
  metrics: {
    quantumGateDepth: number;
    classicalExecutionTime: number;
    totalLatency: number;
    errorRate: number;
    coherenceTime: number;
  };
  isRunning: boolean;
  currentStep: number;
}

export function PerformanceMetricsPanel({
  metrics,
  isRunning,
  currentStep
}: PerformanceMetricsPanelProps) {
  // Generate sample data for charts
  const latencyData = Array.from({ length: 20 }, (_, i) => ({
    step: i * 5,
    latency: Math.random() * 2 + metrics.totalLatency,
    classical: Math.random() * 0.5 + metrics.classicalExecutionTime,
    quantum: Math.random() * 1.5 + 0.5
  }));

  const coherenceData = Array.from({ length: 20 }, (_, i) => ({
    time: i * 5,
    coherence: Math.exp(-i * 0.1) * metrics.coherenceTime,
    threshold: metrics.coherenceTime * 0.7
  }));

  return (
    <div className="space-y-4">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-quantum-glow" />
              <span className="text-sm font-semibold text-quantum-neon">Gate Depth</span>
            </div>
            <div className="text-2xl font-mono text-quantum-glow">
              {metrics.quantumGateDepth}
            </div>
            <div className="text-xs text-quantum-particle">layers</div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-quantum-energy" />
              <span className="text-sm font-semibold text-quantum-neon">Execution Time</span>
            </div>
            <div className="text-2xl font-mono text-quantum-energy">
              {metrics.classicalExecutionTime.toFixed(2)}
            </div>
            <div className="text-xs text-quantum-particle">ms</div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-quantum-neon" />
              <span className="text-sm font-semibold text-quantum-neon">Total Latency</span>
            </div>
            <div className="text-2xl font-mono text-quantum-neon">
              {metrics.totalLatency.toFixed(2)}
            </div>
            <div className="text-xs text-quantum-particle">ms</div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-quantum-neon">Error Rate</span>
            </div>
            <div className="text-2xl font-mono text-red-400">
              {(metrics.errorRate * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-quantum-particle">errors</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow">
              Latency Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3,3" stroke="rgba(64, 224, 208, 0.1)" />
                <XAxis 
                  dataKey="step" 
                  stroke="#40E0D0"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#40E0D0"
                  fontSize={12}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#00FF41"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="classical"
                  stroke="#40E0D0"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="quantum"
                  stroke="#FF6B35"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow">
              Coherence vs Classical Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={coherenceData}>
                <CartesianGrid strokeDasharray="3,3" stroke="rgba(64, 224, 208, 0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#40E0D0"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#40E0D0"
                  fontSize={12}
                />
                <Line
                  type="monotone"
                  dataKey="coherence"
                  stroke="#00FF41"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#FF6B35"
                  strokeWidth={1}
                  strokeDasharray="5,5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Progress Bars */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-quantum-glow">
            Real-time Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-quantum-neon">Classical Processing</span>
              <span className="font-mono text-quantum-particle">
                {(metrics.classicalExecutionTime / 10 * 100).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={metrics.classicalExecutionTime / 10 * 100} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-quantum-neon">Quantum Coherence</span>
              <span className="font-mono text-quantum-particle">
                {((metrics.coherenceTime / 100) * 100).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={(metrics.coherenceTime / 100) * 100} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-quantum-neon">Signal Synchronization</span>
              <span className="font-mono text-quantum-particle">
                {((100 - metrics.totalLatency * 10) || 0).toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={(100 - metrics.totalLatency * 10) || 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
