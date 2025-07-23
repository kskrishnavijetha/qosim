
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StateVectorItem {
  index: number;
  amplitude: { real: number; imag: number };
  probability: number;
  state: string;
}

interface AmplitudeChartProps {
  stateVector: StateVectorItem[];
}

export function AmplitudeChart({ stateVector }: AmplitudeChartProps) {
  const chartData = stateVector
    .filter(item => item.probability > 0.001)
    .map(item => ({
      state: `|${item.state}⟩`,
      realAmplitude: item.amplitude.real,
      imagAmplitude: item.amplitude.imag,
      probability: item.probability
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-quantum-void border border-quantum-matrix rounded p-2 text-xs">
          <p className="text-quantum-glow">{label}</p>
          <p className="text-quantum-neon">
            Real: {payload[0].value.toFixed(4)}
          </p>
          <p className="text-quantum-particle">
            Imag: {payload[1].value.toFixed(4)}
          </p>
          <p className="text-quantum-energy">
            Probability: {(payload[0].payload.probability * 100).toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--quantum-matrix))" />
          <XAxis 
            dataKey="state" 
            stroke="hsl(var(--quantum-particle))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--quantum-particle))"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="realAmplitude" 
            fill="hsl(var(--quantum-glow))"
            name="Real Amplitude"
            opacity={0.8}
          />
          <Bar 
            dataKey="imagAmplitude" 
            fill="hsl(var(--quantum-neon))"
            name="Imaginary Amplitude"
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
