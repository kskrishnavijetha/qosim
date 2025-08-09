
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FidelityData {
  time: number;
  idealFidelity: number;
  noisyFidelity: number;
  difference: number;
}

interface FidelityTrackerProps {
  fidelityData: FidelityData[];
  currentTime: number;
}

export function FidelityTracker({ fidelityData, currentTime }: FidelityTrackerProps) {
  const currentFidelity = fidelityData.find(d => Math.abs(d.time - currentTime) < 0.1);
  const finalFidelity = fidelityData[fidelityData.length - 1];
  
  const averageIdealFidelity = fidelityData.reduce((sum, d) => sum + d.idealFidelity, 0) / fidelityData.length;
  const averageNoisyFidelity = fidelityData.reduce((sum, d) => sum + d.noisyFidelity, 0) / fidelityData.length;
  
  const fidelityLoss = averageIdealFidelity - averageNoisyFidelity;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="quantum-panel neon-border rounded p-3 bg-quantum-void">
          <p className="text-quantum-glow">{`Time: ${label}μs`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${(entry.value * 100).toFixed(2)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Quantum Fidelity Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Current Ideal</div>
            <div className="text-lg font-mono text-quantum-glow">
              {((currentFidelity?.idealFidelity || 1) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Current Noisy</div>
            <div className="text-lg font-mono text-quantum-neon">
              {((currentFidelity?.noisyFidelity || 0.8) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Fidelity Loss</div>
            <div className="flex items-center justify-center gap-1">
              {fidelityLoss > 0 ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-green-400" />
              )}
              <span className="text-lg font-mono text-quantum-plasma">
                {(Math.abs(fidelityLoss) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Fidelity Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fidelityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--quantum-matrix) / 0.3)" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--quantum-particle))"
                fontSize={12}
                label={{ value: 'Time (μs)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--quantum-particle))"
                fontSize={12}
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                label={{ value: 'Fidelity', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="idealFidelity" 
                stroke="hsl(var(--quantum-glow))" 
                strokeWidth={2}
                dot={false}
                name="Ideal"
              />
              <Line 
                type="monotone" 
                dataKey="noisyFidelity" 
                stroke="hsl(var(--quantum-neon))" 
                strokeWidth={2}
                dot={false}
                name="Noisy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-quantum-glow">Performance Metrics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="quantum-panel neon-border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-quantum-particle">Average Ideal Fidelity</span>
                <Badge variant="outline" className="text-quantum-glow">
                  {(averageIdealFidelity * 100).toFixed(2)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Average Noisy Fidelity</span>
                <Badge variant="outline" className="text-quantum-neon">
                  {(averageNoisyFidelity * 100).toFixed(2)}%
                </Badge>
              </div>
            </div>
            
            <div className="quantum-panel neon-border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-quantum-particle">Final Fidelity</span>
                <Badge variant="outline" className="text-quantum-plasma">
                  {((finalFidelity?.noisyFidelity || 0) * 100).toFixed(2)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Degradation Rate</span>
                <Badge 
                  variant="outline" 
                  className={fidelityLoss > 0.1 ? "text-red-400" : "text-green-400"}
                >
                  {((fidelityLoss / (fidelityData.length || 1)) * 100).toFixed(3)}%/step
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
