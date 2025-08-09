
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRight } from 'lucide-react';
import { Connection } from '@/hooks/useHybridSimulation';

interface SignalFlowVisualizationProps {
  signalFlow: {
    activeSignals: Array<{
      id: string;
      from: string;
      to: string;
      progress: number;
      value: boolean | number;
    }>;
  };
  connections: Connection[];
  isRunning: boolean;
  selectedConnection: string | null;
  onConnectionSelect: (connectionId: string) => void;
}

export function SignalFlowVisualization({
  signalFlow,
  connections,
  isRunning,
  selectedConnection,
  onConnectionSelect
}: SignalFlowVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw grid background
    ctx.strokeStyle = 'rgba(64, 224, 208, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw connection lines
    connections.forEach((connection, index) => {
      const y = 50 + index * 40;
      const startX = 50;
      const endX = canvas.width - 50;
      
      // Connection line
      ctx.strokeStyle = connection.id === selectedConnection ? '#40E0D0' : 'rgba(64, 224, 208, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
      
      // Connection labels
      ctx.fillStyle = '#40E0D0';
      ctx.font = '12px monospace';
      ctx.fillText(connection.from, 10, y + 5);
      ctx.fillText(connection.to, endX + 10, y + 5);
    });

    // Draw active signals
    signalFlow.activeSignals.forEach(signal => {
      const connectionIndex = connections.findIndex(c => c.from === signal.from && c.to === signal.to);
      if (connectionIndex === -1) return;
      
      const y = 50 + connectionIndex * 40;
      const startX = 50;
      const endX = canvas.width - 50;
      const currentX = startX + (endX - startX) * signal.progress;
      
      // Signal dot
      const gradient = ctx.createRadialGradient(currentX, y, 0, currentX, y, 8);
      gradient.addColorStop(0, '#00FF41');
      gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentX, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Signal trail
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Math.max(startX, currentX - 20), y);
      ctx.lineTo(currentX, y);
      ctx.stroke();
    });
  }, [signalFlow, connections, selectedConnection]);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Signal Flow Visualization
          <Badge variant="outline" className="text-xs">
            {signalFlow.activeSignals.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Live Canvas */}
          <div className="relative border border-quantum-matrix rounded-lg bg-quantum-void/50 overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-32"
              style={{ display: 'block' }}
            />
          </div>
          
          {/* Connection List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-quantum-neon">
              Active Connections
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {connections.map(connection => (
                <div
                  key={connection.id}
                  className={`flex items-center justify-between text-xs p-2 rounded border cursor-pointer transition-colors ${
                    connection.id === selectedConnection
                      ? 'bg-quantum-glow/20 border-quantum-glow'
                      : 'bg-card/30 border-quantum-matrix hover:border-quantum-neon'
                  }`}
                  onClick={() => onConnectionSelect(connection.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-quantum-particle">
                      {connection.from}
                    </span>
                    <ArrowRight className="w-3 h-3 text-quantum-energy" />
                    <span className="font-mono text-quantum-particle">
                      {connection.to}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      connection.signal?.active ? 'text-quantum-glow' : 'text-quantum-particle'
                    }`}
                  >
                    {connection.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Signal Statistics */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-card/30 rounded">
              <div className="font-mono text-quantum-glow">
                {signalFlow.activeSignals.length}
              </div>
              <div className="text-quantum-particle">Active Signals</div>
            </div>
            <div className="text-center p-2 bg-card/30 rounded">
              <div className="font-mono text-quantum-neon">
                {connections.length}
              </div>
              <div className="text-quantum-particle">Total Connections</div>
            </div>
            <div className="text-center p-2 bg-card/30 rounded">
              <div className="font-mono text-quantum-energy">
                {isRunning ? 'LIVE' : 'IDLE'}
              </div>
              <div className="text-quantum-particle">Status</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
