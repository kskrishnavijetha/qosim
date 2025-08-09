
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Thermometer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DecoherenceData {
  time: number;
  qubit: number;
  t1Decay: number;
  t2Decay: number;
  temperature: number;
  noiseLevel: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface DecoherenceHotspotProps {
  decoherenceData: DecoherenceData[];
  temperatureProfile?: number[];
  noiseProfile?: number[];
}

export function DecoherenceHotspotDetector({ 
  decoherenceData, 
  temperatureProfile = [],
  noiseProfile = []
}: DecoherenceHotspotProps) {
  
  const hotspots = useMemo(() => {
    return decoherenceData
      .filter(d => d.severity === 'high' || d.severity === 'critical')
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
  }, [decoherenceData]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'UNKNOWN';
    }
  };

  const averageTemperature = temperatureProfile.length > 0 
    ? temperatureProfile.reduce((a, b) => a + b, 0) / temperatureProfile.length 
    : 0;

  const averageNoise = noiseProfile.length > 0
    ? noiseProfile.reduce((a, b) => a + b, 0) / noiseProfile.length
    : 0;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Decoherence Hotspot Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Environmental Conditions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="quantum-panel neon-border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">Temperature</span>
            </div>
            <div className="text-lg font-mono text-quantum-glow">
              {averageTemperature.toFixed(2)}K
            </div>
            <Progress value={Math.min(100, (averageTemperature / 0.1) * 100)} className="mt-2" />
          </div>
          
          <div className="quantum-panel neon-border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-quantum-plasma" />
              <span className="text-sm text-quantum-particle">Noise Level</span>
            </div>
            <div className="text-lg font-mono text-quantum-plasma">
              {(averageNoise * 100).toFixed(1)}%
            </div>
            <Progress value={averageNoise * 100} className="mt-2" />
          </div>
        </div>

        {/* Hotspots List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-quantum-glow">Active Hotspots</h4>
          
          {hotspots.length === 0 ? (
            <div className="text-center py-6 text-quantum-particle">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No critical decoherence hotspots detected</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {hotspots.map((hotspot, index) => (
                <div 
                  key={index}
                  className="quantum-panel neon-border rounded p-3 hover:bg-quantum-matrix/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getSeverityColor(hotspot.severity)} text-white border-0`}
                      >
                        {getSeverityText(hotspot.severity)}
                      </Badge>
                      <span className="text-sm font-mono text-quantum-neon">
                        Q{hotspot.qubit}
                      </span>
                    </div>
                    <span className="text-xs text-quantum-particle">
                      t = {hotspot.time.toFixed(2)}μs
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-quantum-particle">T1 Decay:</span>
                      <div className="text-quantum-glow font-mono">
                        {(hotspot.t1Decay * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-quantum-particle">T2 Decay:</span>
                      <div className="text-quantum-neon font-mono">
                        {(hotspot.t2Decay * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-quantum-particle">
                      Temp: {hotspot.temperature.toFixed(3)}K
                    </span>
                    <span className="text-quantum-particle">
                      Noise: {(hotspot.noiseLevel * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="quantum-panel neon-border rounded p-3">
          <h5 className="text-sm font-medium text-quantum-glow mb-2">Decoherence Statistics</h5>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {['critical', 'high', 'medium', 'low'].map(severity => {
              const count = decoherenceData.filter(d => d.severity === severity).length;
              return (
                <div key={severity} className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${getSeverityColor(severity)}`}></div>
                  <div className="text-quantum-particle capitalize">{severity}</div>
                  <div className="text-quantum-neon font-mono">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
