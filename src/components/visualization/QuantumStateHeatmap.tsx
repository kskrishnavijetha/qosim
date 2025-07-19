
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Complex } from '@/services/complexNumbers';

interface QuantumStateHeatmapProps {
  stateVector: Complex[];
  numQubits: number;
  maxStates?: number;
}

export function QuantumStateHeatmap({ stateVector, numQubits, maxStates = 32 }: QuantumStateHeatmapProps) {
  // Calculate grid dimensions for optimal display
  const gridSize = Math.min(Math.ceil(Math.sqrt(Math.min(stateVector.length, maxStates))), 8);
  const displayStates = Math.min(stateVector.length, maxStates);
  
  // Find max magnitude for normalization
  const maxMagnitude = Math.max(...stateVector.map(amp => amp.magnitude()));
  
  // Generate heatmap data
  const heatmapData = stateVector.slice(0, displayStates).map((amplitude, index) => {
    const magnitude = amplitude.magnitude();
    const phase = amplitude.phase();
    const probability = magnitude ** 2;
    const bitstring = index.toString(2).padStart(numQubits, '0');
    
    return {
      index,
      bitstring,
      magnitude,
      phase,
      probability,
      real: amplitude.real,
      imaginary: amplitude.imaginary,
      normalizedMagnitude: maxMagnitude > 0 ? magnitude / maxMagnitude : 0
    };
  });

  // Color mapping functions
  const getMagnitudeColor = (normalizedMagnitude: number) => {
    const intensity = Math.floor(normalizedMagnitude * 255);
    return `rgb(${Math.floor(intensity * 0.2)}, ${Math.floor(intensity * 0.6)}, ${intensity})`;
  };

  const getPhaseColor = (phase: number) => {
    // Map phase [-π, π] to hue [0, 360]
    const hue = ((phase + Math.PI) / (2 * Math.PI)) * 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const CellTooltip = ({ data }: { data: any }) => (
    <div className="absolute z-10 bg-background border rounded-lg p-3 shadow-lg pointer-events-none">
      <p className="font-mono text-sm font-medium">|{data.bitstring}⟩</p>
      <p className="text-xs text-muted-foreground">State {data.index}</p>
      <div className="mt-2 space-y-1">
        <p className="text-xs">
          <span className="text-muted-foreground">Real:</span> {data.real.toFixed(4)}
        </p>
        <p className="text-xs">
          <span className="text-muted-foreground">Imag:</span> {data.imaginary.toFixed(4)}
        </p>
        <p className="text-xs">
          <span className="text-muted-foreground">|ψ|:</span> {data.magnitude.toFixed(4)}
        </p>
        <p className="text-xs">
          <span className="text-muted-foreground">Phase:</span> {data.phase.toFixed(3)} rad
        </p>
        <p className="text-xs">
          <span className="text-muted-foreground">|ψ|²:</span> {data.probability.toFixed(6)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Magnitude Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Amplitude Magnitudes</span>
            <Badge variant="secondary">{displayStates} states</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {heatmapData.slice(0, gridSize * gridSize).map((data, index) => (
              <div
                key={`mag-${index}`}
                className="relative aspect-square rounded border cursor-pointer group"
                style={{ 
                  backgroundColor: getMagnitudeColor(data.normalizedMagnitude),
                  minWidth: '24px',
                  minHeight: '24px'
                }}
                title={`|${data.bitstring}⟩: ${data.magnitude.toFixed(4)}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] text-white font-mono opacity-80">
                    {data.bitstring}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Low magnitude</span>
            <div className="flex items-center space-x-1">
              <div className="w-8 h-2 bg-gradient-to-r from-blue-900 to-blue-300 rounded"></div>
            </div>
            <span>High magnitude</span>
          </div>
        </CardContent>
      </Card>

      {/* Phase Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Phase Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {heatmapData.slice(0, gridSize * gridSize).map((data, index) => (
              <div
                key={`phase-${index}`}
                className="relative aspect-square rounded border cursor-pointer"
                style={{ 
                  backgroundColor: data.magnitude > 0.001 ? getPhaseColor(data.phase) : '#1f2937',
                  minWidth: '24px',
                  minHeight: '24px',
                  opacity: data.normalizedMagnitude * 0.8 + 0.2
                }}
                title={`|${data.bitstring}⟩: ${data.phase.toFixed(3)} rad`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] text-white font-mono opacity-80">
                    {data.bitstring}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>-π</span>
            <div className="flex items-center space-x-1">
              <div className="w-16 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500 rounded"></div>
            </div>
            <span>π</span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>State Vector Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stateVector.length}
              </div>
              <div className="text-sm text-muted-foreground">Total States</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {heatmapData.filter(d => d.probability > 1e-10).length}
              </div>
              <div className="text-sm text-muted-foreground">Active States</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {maxMagnitude.toFixed(4)}
              </div>
              <div className="text-sm text-muted-foreground">Max Amplitude</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.sqrt(heatmapData.reduce((sum, d) => sum + d.probability ** 2, 0)).toFixed(4)}
              </div>
              <div className="text-sm text-muted-foreground">Purity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
