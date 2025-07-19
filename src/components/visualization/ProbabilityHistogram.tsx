
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProbabilityHistogramProps {
  counts: Record<string, number>;
  totalShots: number;
  maxBars?: number;
}

export function ProbabilityHistogram({ counts, totalShots, maxBars = 16 }: ProbabilityHistogramProps) {
  // Convert counts to probability data
  const data = Object.entries(counts)
    .map(([state, count]) => ({
      state,
      count,
      probability: count / totalShots,
      percentage: (count / totalShots) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxBars);

  // Generate colors for bars
  const getBarColor = (index: number) => {
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-mono text-sm font-medium">|{label}⟩</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Count:</span> {data.count}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Probability:</span> {data.probability.toFixed(4)}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Percentage:</span> {data.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Measurement Probabilities</span>
          <Badge variant="secondary">
            {Object.keys(counts).length} states, {totalShots} shots
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="state" 
                tick={{ fontSize: 12, fontFamily: 'monospace' }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Max Probability</div>
            <div className="font-mono text-sm">
              {data.length > 0 ? (data[0].probability * 100).toFixed(2) + '%' : '0%'}
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Entropy</div>
            <div className="font-mono text-sm">
              {(-data.reduce((sum, d) => sum + (d.probability > 0 ? d.probability * Math.log2(d.probability) : 0), 0)).toFixed(3)}
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Active States</div>
            <div className="font-mono text-sm">{Object.keys(counts).length}</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-sm text-muted-foreground">Total Shots</div>
            <div className="font-mono text-sm">{totalShots.toLocaleString()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
