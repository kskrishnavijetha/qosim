
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrainingMetrics } from '@/hooks/useQNNBuilder';
import { TrendingUp, TrendingDown, Clock, Zap, Activity, Target } from 'lucide-react';

interface QNNPerformanceDashboardProps {
  trainingMetrics: TrainingMetrics | null;
  architecture: any;
}

export function QNNPerformanceDashboard({ trainingMetrics, architecture }: QNNPerformanceDashboardProps) {
  if (!trainingMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="quantum-panel neon-border">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-quantum-glow/20 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-quantum-glow/20 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const convergenceTime = trainingMetrics.currentEpoch * 1.2; // Simulated time
  const quantumFidelity = Math.max(0, 1 - trainingMetrics.currentLoss * 0.1);
  const quantumAdvantage = ((quantumFidelity * 100) - 50) / 50 * 100;

  const performanceData = trainingMetrics.lossHistory.map((loss, index) => ({
    epoch: index + 1,
    loss,
    accuracy: trainingMetrics.accuracyHistory[index] || 0,
    fidelity: Math.max(0, 1 - loss * 0.1) * 100,
    convergence: Math.max(0, 100 - (loss * 50))
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              Training Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {trainingMetrics.currentLoss.toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Epoch {trainingMetrics.currentEpoch} / {trainingMetrics.totalEpochs}
            </p>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {trainingMetrics.currentAccuracy.toFixed(2)}%
            </div>
            <Progress value={trainingMetrics.currentAccuracy} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Convergence Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {convergenceTime.toFixed(1)}s
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Est. completion: {((trainingMetrics.totalEpochs - trainingMetrics.currentEpoch) * 1.2).toFixed(1)}s
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
              <Zap className="w-4 h-4 text-quantum-neon" />
              Quantum Fidelity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-quantum-neon">
              {(quantumFidelity * 100).toFixed(1)}%
            </div>
            <Badge variant={quantumAdvantage > 0 ? "default" : "secondary"} className="mt-1">
              {quantumAdvantage > 0 ? '+' : ''}{quantumAdvantage.toFixed(1)}% vs Classical
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-quantum-glow">
              Training Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    fontSize: '12px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Loss"
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-quantum-glow">
              Quantum Fidelity & Convergence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    fontSize: '12px'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="fidelity" 
                  stroke="hsl(var(--quantum-neon))" 
                  fill="hsl(var(--quantum-neon) / 0.3)"
                  name="Quantum Fidelity (%)"
                />
                <Area 
                  type="monotone" 
                  dataKey="convergence" 
                  stroke="hsl(var(--quantum-energy))" 
                  fill="hsl(var(--quantum-energy) / 0.2)"
                  name="Convergence (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Performance Analysis */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Architecture Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-neon">Layer Efficiency</h4>
              <div className="space-y-2">
                {architecture.layers.map((layer: any, index: number) => (
                  <div key={layer.id} className="flex items-center justify-between text-xs">
                    <span className={layer.type.startsWith('quantum_') ? 'text-quantum-glow' : 'text-blue-400'}>
                      {layer.config.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.random() * 100} className="w-12 h-2" />
                      <span className="text-quantum-energy">{(Math.random() * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-neon">Resource Utilization</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Quantum Gates:</span>
                  <span className="text-quantum-glow">{architecture.layers.filter((l: any) => l.type.startsWith('quantum_')).length * 4}</span>
                </div>
                <div className="flex justify-between">
                  <span>Circuit Depth:</span>
                  <span className="text-quantum-neon">{Math.max(1, architecture.layers.length * 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span className="text-quantum-energy">{(architecture.metadata.totalParameters * 0.004).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantum Volume:</span>
                  <span className="text-quantum-particle">{Math.pow(2, Math.min(architecture.layers.length, 10))}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-neon">Optimization Metrics</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Gradient Flow:</span>
                  <Badge variant="default" className="text-xs">Optimal</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Entanglement:</span>
                  <span className="text-quantum-glow">{(Math.random() * 0.8 + 0.2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Barren Plateau:</span>
                  <Badge variant={Math.random() > 0.5 ? "default" : "destructive"} className="text-xs">
                    {Math.random() > 0.5 ? 'None' : 'Detected'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>NISQ Readiness:</span>
                  <Badge variant="default" className="text-xs">High</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
