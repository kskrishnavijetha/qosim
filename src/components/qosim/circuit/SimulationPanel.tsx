
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { type QuantumSimulationResult } from '@/types/qosim';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface SimulationPanelProps {
  result: QuantumSimulationResult | null;
  isSimulating: boolean;
}

export function SimulationPanel({ result, isSimulating }: SimulationPanelProps) {
  if (isSimulating) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-purple-400 text-sm mb-2">Running Simulation...</p>
          <Progress value={75} className="w-full" />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center text-slate-400 text-sm">
        No simulation results yet
      </div>
    );
  }

  const chartData = Object.entries(result.measurementResults).map(([state, probability]) => ({
    state,
    probability: probability * 100
  }));

  return (
    <div className="space-y-4">
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400">Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Qubits:</span>
              <span className="text-white">{result.qubits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Fidelity:</span>
              <Badge variant="outline" className="text-xs">
                {(result.fidelity * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400">Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '150px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="state" className="text-xs" />
                <YAxis className="text-xs" />
                <Bar dataKey="probability" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
