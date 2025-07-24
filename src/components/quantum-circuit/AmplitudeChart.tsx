
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AmplitudeChartProps {
  stateVector: Array<{ real: number; imag: number }>;
  measurementProbabilities: number[];
  numQubits: number;
}

export function AmplitudeChart({ stateVector, measurementProbabilities, numQubits }: AmplitudeChartProps) {
  const chartData = stateVector.map((amplitude, index) => {
    const binaryState = index.toString(2).padStart(numQubits, '0');
    const probability = measurementProbabilities[index] || 0;
    const magnitude = Math.sqrt(amplitude.real * amplitude.real + amplitude.imag * amplitude.imag);
    const phase = Math.atan2(amplitude.imag, amplitude.real);
    
    return {
      state: `|${binaryState}⟩`,
      probability: probability * 100,
      magnitude,
      phase: phase * (180 / Math.PI),
      real: amplitude.real,
      imaginary: amplitude.imag
    };
  }).filter(item => item.probability > 0.1); // Only show significant amplitudes

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-quantum-void border border-quantum-matrix rounded p-3 text-xs">
          <p className="text-quantum-neon font-mono">{label}</p>
          <p className="text-quantum-glow">
            Probability: {data.probability.toFixed(2)}%
          </p>
          <p className="text-quantum-particle">
            Magnitude: {data.magnitude.toFixed(4)}
          </p>
          <p className="text-quantum-energy">
            Phase: {data.phase.toFixed(1)}°
          </p>
          <p className="text-muted-foreground">
            Real: {data.real.toFixed(4)}
          </p>
          <p className="text-muted-foreground">
            Imag: {data.imaginary.toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <TooltipProvider>
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center justify-between">
            State Vector Amplitudes
            <Badge variant="secondary">
              {chartData.length} states
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-6">
              {/* Probability Distribution */}
              <div>
                <h4 className="text-xs text-quantum-particle mb-3">Measurement Probabilities</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--quantum-matrix))" />
                    <XAxis 
                      dataKey="state" 
                      tick={{ fill: 'hsl(var(--quantum-neon))', fontSize: 10 }}
                      stroke="hsl(var(--quantum-neon))"
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--quantum-particle))', fontSize: 10 }}
                      stroke="hsl(var(--quantum-particle))"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="probability" 
                      fill="hsl(var(--quantum-glow))"
                      stroke="hsl(var(--quantum-neon))"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Amplitude Magnitude */}
              <div>
                <h4 className="text-xs text-quantum-particle mb-3">Amplitude Magnitudes</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--quantum-matrix))" />
                    <XAxis 
                      dataKey="state" 
                      tick={{ fill: 'hsl(var(--quantum-neon))', fontSize: 10 }}
                      stroke="hsl(var(--quantum-neon))"
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--quantum-particle))', fontSize: 10 }}
                      stroke="hsl(var(--quantum-particle))"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="magnitude" 
                      fill="hsl(var(--quantum-particle))"
                      stroke="hsl(var(--quantum-neon))"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* State Vector Table */}
              <div className="bg-quantum-matrix rounded-lg p-4 max-h-32 overflow-y-auto">
                <h4 className="text-xs text-quantum-glow mb-2">State Vector Components</h4>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  <div className="text-quantum-neon">State</div>
                  <div className="text-quantum-particle">Real</div>
                  <div className="text-quantum-energy">Imag</div>
                  <div className="text-quantum-glow">Prob</div>
                  {chartData.map((item) => (
                    <React.Fragment key={item.state}>
                      <div className="text-quantum-neon">{item.state}</div>
                      <div className="text-quantum-particle">{item.real.toFixed(4)}</div>
                      <div className="text-quantum-energy">{item.imaginary.toFixed(4)}</div>
                      <div className="text-quantum-glow">{item.probability.toFixed(1)}%</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Add gates to your circuit to see amplitude visualization
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
