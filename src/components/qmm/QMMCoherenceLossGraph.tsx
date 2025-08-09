
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown } from 'lucide-react';

interface CoherenceData {
  time: number;
  fidelity: number;
  coherence: number;
  t1Decay: number;
  t2Decay: number;
  gateNoise?: number;
}

interface QMMCoherenceLossGraphProps {
  qubitData: {
    qubitId: number;
    coherenceData: CoherenceData[];
  }[];
  selectedQubit: number | null;
  currentTime: number;
  onQubitSelect: (qubitId: number | null) => void;
}

export function QMMCoherenceLossGraph({ 
  qubitData, 
  selectedQubit, 
  currentTime,
  onQubitSelect 
}: QMMCoherenceLossGraphProps) {
  
  const displayData = selectedQubit !== null 
    ? qubitData.filter(q => q.qubitId === selectedQubit)
    : qubitData.slice(0, 3); // Show first 3 qubits if none selected

  const chartData = displayData.length > 0 
    ? displayData[0].coherenceData.map(point => ({
        time: point.time,
        fidelity: point.fidelity * 100,
        coherence: point.coherence * 100,
        t1Decay: point.t1Decay * 100,
        t2Decay: point.t2Decay * 100,
        gateNoise: (point.gateNoise || 0) * 100
      }))
    : [];

  const getQubitColors = (index: number) => {
    const colors = [
      'hsl(var(--quantum-glow))',
      'hsl(var(--quantum-neon))',
      'hsl(var(--quantum-plasma))',
      'hsl(var(--quantum-particle))',
      'hsl(var(--quantum-energy))'
    ];
    return colors[index % colors.length];
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="quantum-panel neon-border rounded p-3 bg-quantum-void">
          <p className="text-quantum-glow">{`Time: ${label}μs`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toFixed(2)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const calculateCoherenceLossRate = (data: CoherenceData[]) => {
    if (data.length < 2) return 0;
    const start = data[0].fidelity;
    const end = data[data.length - 1].fidelity;
    const timeSpan = data[data.length - 1].time - data[0].time;
    return timeSpan > 0 ? ((start - end) / timeSpan) * 100 : 0;
  };

  const detectRapidDecay = (data: CoherenceData[]) => {
    const hotspots: { time: number; severity: string; cause: string }[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const curr = data[i];
      const fidelityDrop = prev.fidelity - curr.fidelity;
      const timeStep = curr.time - prev.time;
      const decayRate = fidelityDrop / timeStep;

      if (decayRate > 0.1) { // Rapid decay threshold
        let cause = 'Unknown decoherence';
        if (curr.gateNoise && curr.gateNoise > 0.05) cause = 'Gate operation noise';
        else if (curr.t1Decay > 0.3) cause = 'T1 relaxation';
        else if (curr.t2Decay > 0.3) cause = 'T2 dephasing';

        hotspots.push({
          time: curr.time,
          severity: decayRate > 0.2 ? 'critical' : 'high',
          cause
        });
      }
    }
    
    return hotspots;
  };

  const lossRate = displayData.length > 0 ? calculateCoherenceLossRate(displayData[0].coherenceData) : 0;
  const hotspots = displayData.length > 0 ? detectRapidDecay(displayData[0].coherenceData) : [];

  return (
    <div className="space-y-4">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Coherence Loss Analysis
            </CardTitle>
            {selectedQubit !== null && (
              <Badge 
                variant="outline" 
                className="text-quantum-neon cursor-pointer hover:bg-quantum-neon/10"
                onClick={() => onQubitSelect(null)}
              >
                Qubit {selectedQubit} (click to show all)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Qubit Selection */}
          <div className="mb-4 flex flex-wrap gap-2">
            {qubitData.map((qubit, index) => (
              <Badge
                key={qubit.qubitId}
                variant={selectedQubit === qubit.qubitId ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedQubit === qubit.qubitId 
                    ? 'bg-quantum-glow text-black' 
                    : 'text-quantum-neon hover:bg-quantum-neon/10'
                }`}
                onClick={() => onQubitSelect(
                  selectedQubit === qubit.qubitId ? null : qubit.qubitId
                )}
              >
                Q{qubit.qubitId}
              </Badge>
            ))}
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                  domain={[0, 100]}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                <Line 
                  type="monotone" 
                  dataKey="fidelity" 
                  stroke="hsl(var(--quantum-glow))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--quantum-glow))', strokeWidth: 2, r: 4 }}
                  name="Fidelity"
                />
                <Line 
                  type="monotone" 
                  dataKey="coherence" 
                  stroke="hsl(var(--quantum-neon))" 
                  strokeWidth={2}
                  dot={false}
                  name="Coherence"
                />
                <Line 
                  type="monotone" 
                  dataKey="t1Decay" 
                  stroke="hsl(var(--quantum-plasma))" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                  name="T1 Decay"
                />
                <Line 
                  type="monotone" 
                  dataKey="t2Decay" 
                  stroke="hsl(var(--quantum-energy))" 
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  dot={false}
                  name="T2 Decay"
                />
                
                {/* Current time indicator */}
                <ReferenceLine 
                  x={currentTime} 
                  stroke="hsl(var(--quantum-glow))" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: "Now", position: "top" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="quantum-panel neon-border rounded p-3">
              <div className="text-sm text-quantum-particle mb-1">Coherence Loss Rate</div>
              <div className="text-lg font-mono text-quantum-glow">
                {lossRate.toFixed(3)}%/μs
              </div>
            </div>
            
            <div className="quantum-panel neon-border rounded p-3">
              <div className="text-sm text-quantum-particle mb-1">Decay Hotspots</div>
              <div className="text-lg font-mono text-quantum-plasma">
                {hotspots.length} detected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotspots Details */}
      {hotspots.length > 0 && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-plasma flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Detected Hotspots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {hotspots.map((hotspot, index) => (
                <div key={index} className="quantum-panel neon-border rounded p-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={
                        hotspot.severity === 'critical' 
                          ? 'bg-red-500 text-white border-0' 
                          : 'bg-orange-500 text-white border-0'
                      }
                    >
                      {hotspot.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-quantum-particle">
                      t = {hotspot.time.toFixed(2)}μs
                    </span>
                  </div>
                  <div className="text-sm text-quantum-neon mt-1">
                    {hotspot.cause}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
