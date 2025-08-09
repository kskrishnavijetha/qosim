
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QubitTimelineState {
  time: number;
  amplitude0: { real: number; imag: number };
  amplitude1: { real: number; imag: number };
  fidelity: number;
  coherence: number;
  t1Decay: number;
  t2Decay: number;
  entangled: boolean;
  gateOperation?: string;
}

interface QMMDynamicTimelineProps {
  qubitData: {
    qubitId: number;
    states: QubitTimelineState[];
  }[];
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onTimeSelect: (time: number) => void;
  educationalMode?: boolean;
}

export function QMMDynamicTimeline({ 
  qubitData, 
  currentTime, 
  isPlaying, 
  onPlay, 
  onPause, 
  onReset,
  onTimeSelect,
  educationalMode = false 
}: QMMDynamicTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ qubit: number; time: number; state: QubitTimelineState } | null>(null);
  const [selectedQubit, setSelectedQubit] = useState<number | null>(null);

  const getFidelityColor = (fidelity: number) => {
    if (fidelity > 0.9) return '#00ff88'; // High fidelity - green
    if (fidelity > 0.7) return '#88ff00'; // Medium-high - yellow-green
    if (fidelity > 0.5) return '#ffff00'; // Medium - yellow
    if (fidelity > 0.3) return '#ff8800'; // Low - orange
    return '#ff0000'; // Critical - red
  };

  const getStateSymbol = (state: QubitTimelineState) => {
    const prob0 = Math.pow(state.amplitude0.real, 2) + Math.pow(state.amplitude0.imag, 2);
    if (state.entangled) return 'ENT';
    if (prob0 > 0.9) return '|0⟩';
    if (prob0 < 0.1) return '|1⟩';
    return '|ψ⟩'; // Superposition
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !qubitData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth * 2; // Retina display
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const padding = 60;
    const trackHeight = (height / 2 - padding * 2) / qubitData.length;
    const maxTime = Math.max(...qubitData.flatMap(q => q.states.map(s => s.time)));
    const timeScale = (width / 2 - padding * 2) / maxTime;

    // Clear with quantum void background
    ctx.fillStyle = 'hsl(var(--quantum-void))';
    ctx.fillRect(0, 0, width / 2, height / 2);

    // Draw grid and time markers
    ctx.strokeStyle = 'hsl(var(--quantum-matrix) / 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical time lines
    for (let t = 0; t <= maxTime; t += Math.max(0.5, maxTime / 20)) {
      const x = padding + t * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height / 2 - padding);
      ctx.stroke();
      
      // Time labels
      ctx.fillStyle = 'hsl(var(--quantum-particle))';
      ctx.font = '10px monospace';
      ctx.fillText(`${t.toFixed(1)}μs`, x - 15, height / 2 - 10);
    }

    // Draw qubit tracks with heatmap
    qubitData.forEach((qubit, qubitIndex) => {
      const y = padding + (qubitIndex + 0.5) * trackHeight;
      
      // Draw track background
      ctx.strokeStyle = 'hsl(var(--quantum-matrix) / 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width / 2 - padding, y);
      ctx.stroke();

      // Draw qubit label
      ctx.fillStyle = selectedQubit === qubitIndex ? 'hsl(var(--quantum-glow))' : 'hsl(var(--quantum-neon))';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Q${qubit.qubitId}`, 5, y + 4);

      // Draw states as connected segments with heatmap
      qubit.states.forEach((state, stateIndex) => {
        const x = padding + state.time * timeScale;
        const nextState = qubit.states[stateIndex + 1];
        
        if (nextState) {
          const nextX = padding + nextState.time * timeScale;
          
          // Draw heatmap segment
          const gradient = ctx.createLinearGradient(x, 0, nextX, 0);
          gradient.addColorStop(0, getFidelityColor(state.fidelity));
          gradient.addColorStop(1, getFidelityColor(nextState.fidelity));
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, y);
          ctx.stroke();
        }

        // Draw state markers
        ctx.fillStyle = getFidelityColor(state.fidelity);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Add state symbol
        ctx.fillStyle = 'white';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(getStateSymbol(state), x, y + 2);
        ctx.textAlign = 'left';

        // Highlight current time frame
        if (Math.abs(state.time - currentTime) < 0.05) {
          ctx.strokeStyle = 'hsl(var(--quantum-glow))';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Gate operation markers
        if (state.gateOperation && Math.abs(state.time - currentTime) < 0.1) {
          ctx.fillStyle = 'hsl(var(--quantum-plasma))';
          ctx.font = '10px monospace';
          ctx.fillText(state.gateOperation, x + 15, y - 15);
        }
      });
    });

    // Draw current time indicator
    const currentX = padding + currentTime * timeScale;
    ctx.strokeStyle = 'hsl(var(--quantum-glow))';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(currentX, padding);
    ctx.lineTo(currentX, height / 2 - padding);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [qubitData, currentTime, selectedQubit]);

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const padding = 60;
    const trackHeight = (canvas.offsetHeight - padding * 2) / qubitData.length;
    const maxTime = Math.max(...qubitData.flatMap(q => q.states.map(s => s.time)));
    const timeScale = (canvas.offsetWidth - padding * 2) / maxTime;

    // Check if clicking on a qubit track
    const clickedQubit = Math.floor((y - padding) / trackHeight);
    if (clickedQubit >= 0 && clickedQubit < qubitData.length) {
      setSelectedQubit(selectedQubit === clickedQubit ? null : clickedQubit);
    }

    // Update time based on click position
    const clickedTime = (x - padding) / timeScale;
    if (clickedTime >= 0 && clickedTime <= maxTime) {
      onTimeSelect(clickedTime);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const padding = 60;
    const trackHeight = (canvas.offsetHeight - padding * 2) / qubitData.length;
    const maxTime = Math.max(...qubitData.flatMap(q => q.states.map(s => s.time)));
    const timeScale = (canvas.offsetWidth - padding * 2) / maxTime;

    // Find hovered point
    const hoveredQubit = Math.floor((y - padding) / trackHeight);
    const hoveredTime = (x - padding) / timeScale;

    if (hoveredQubit >= 0 && hoveredQubit < qubitData.length && hoveredTime >= 0) {
      const qubit = qubitData[hoveredQubit];
      const closestState = qubit.states.reduce((closest, state) => 
        Math.abs(state.time - hoveredTime) < Math.abs(closest.time - hoveredTime) ? state : closest
      );

      if (Math.abs(closestState.time - hoveredTime) < 0.2) {
        setHoveredPoint({
          qubit: hoveredQubit,
          time: closestState.time,
          state: closestState
        });
        return;
      }
    }
    setHoveredPoint(null);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            Dynamic Qubit Timeline
            {educationalMode && <Badge variant="outline" className="text-quantum-neon">Educational Mode</Badge>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-80 cursor-crosshair border border-quantum-matrix rounded"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
          />
          
          {/* Tooltip */}
          {hoveredPoint && (
            <div 
              className="absolute z-10 bg-quantum-dark border border-quantum-neon rounded-lg p-3 pointer-events-none"
              style={{
                left: '50%',
                top: '10px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-quantum-glow font-mono text-sm">
                Qubit {hoveredPoint.qubit} @ {hoveredPoint.time.toFixed(2)}μs
              </div>
              <div className="text-quantum-neon text-xs mt-1">
                State: {getStateSymbol(hoveredPoint.state)}
              </div>
              <div className="text-quantum-particle text-xs">
                Fidelity: {(hoveredPoint.state.fidelity * 100).toFixed(1)}%
              </div>
              <div className="text-quantum-particle text-xs">
                Coherence: {(hoveredPoint.state.coherence * 100).toFixed(1)}%
              </div>
              {hoveredPoint.state.gateOperation && (
                <div className="text-quantum-plasma text-xs">
                  Gate: {hoveredPoint.state.gateOperation}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-quantum-particle">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{backgroundColor: '#00ff88'}}></div>
              <span>High Fidelity (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{backgroundColor: '#ffff00'}}></div>
              <span>Medium Fidelity (50-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{backgroundColor: '#ff0000'}}></div>
              <span>Low Fidelity (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-quantum-glow">|0⟩ |1⟩ |ψ⟩ ENT</span>
              <span>State Markers</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
