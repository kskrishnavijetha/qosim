
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QubitState {
  time: number;
  amplitude0: { real: number; imag: number };
  amplitude1: { real: number; imag: number };
  phase: number;
  errorProbability: number;
  coherence: number;
  entangled: boolean;
}

interface QubitTimelineProps {
  qubitData: {
    qubitId: number;
    states: QubitState[];
  }[];
  currentTime: number;
  onTimeSelect: (time: number) => void;
}

export function QubitTimelineVisualization({ qubitData, currentTime, onTimeSelect }: QubitTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ qubit: number; time: number } | null>(null);

  const getStateColor = (state: QubitState) => {
    if (state.entangled) return '#ff6b6b'; // Red for entangled
    const prob0 = Math.pow(state.amplitude0.real, 2) + Math.pow(state.amplitude0.imag, 2);
    if (prob0 > 0.9) return '#4ecdc4'; // Cyan for |0⟩
    if (prob0 < 0.1) return '#45b7d1'; // Blue for |1⟩
    return '#96ceb4'; // Green for superposition
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = 'hsl(var(--quantum-void))';
    ctx.fillRect(0, 0, width, height);

    if (!qubitData.length) return;

    const padding = 40;
    const qubitHeight = (height - padding * 2) / qubitData.length;
    const maxTime = Math.max(...qubitData.flatMap(q => q.states.map(s => s.time)));
    const timeScale = (width - padding * 2) / maxTime;

    // Draw grid lines
    ctx.strokeStyle = 'hsl(var(--quantum-matrix) / 0.3)';
    ctx.lineWidth = 1;
    
    // Vertical time lines
    for (let t = 0; t <= maxTime; t += Math.max(1, Math.floor(maxTime / 10))) {
      const x = padding + t * timeScale;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal qubit lines
    qubitData.forEach((_, index) => {
      const y = padding + (index + 0.5) * qubitHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    });

    // Draw qubit evolution
    qubitData.forEach((qubit, qubitIndex) => {
      const y = padding + (qubitIndex + 0.5) * qubitHeight;
      
      // Draw state points
      qubit.states.forEach((state, stateIndex) => {
        const x = padding + state.time * timeScale;
        const radius = 6 + state.coherence * 4; // Size based on coherence
        
        ctx.fillStyle = getStateColor(state);
        ctx.globalAlpha = 0.3 + state.coherence * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw error probability indicator
        if (state.errorProbability > 0.1) {
          ctx.strokeStyle = '#ff4757';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, radius + 2, 0, 2 * Math.PI);
          ctx.stroke();
        }

        // Connect to next state
        if (stateIndex < qubit.states.length - 1) {
          const nextState = qubit.states[stateIndex + 1];
          const nextX = padding + nextState.time * timeScale;
          
          ctx.strokeStyle = getStateColor(state);
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, y);
          ctx.stroke();
        }
      });
    });

    // Draw current time indicator
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'hsl(var(--quantum-glow))';
    ctx.lineWidth = 3;
    const currentX = padding + currentTime * timeScale;
    ctx.beginPath();
    ctx.moveTo(currentX, padding);
    ctx.lineTo(currentX, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'hsl(var(--quantum-neon))';
    ctx.font = '12px monospace';
    qubitData.forEach((qubit, index) => {
      const y = padding + (index + 0.5) * qubitHeight;
      ctx.fillText(`Q${qubit.qubitId}`, 5, y + 4);
    });

  }, [qubitData, currentTime]);

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const padding = 40;
    const maxTime = Math.max(...qubitData.flatMap(q => q.states.map(s => s.time)));
    const timeScale = (canvas.width - padding * 2) / maxTime;
    
    const clickedTime = (x - padding) / timeScale;
    onTimeSelect(Math.max(0, Math.min(maxTime, clickedTime)));
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Qubit Timeline Evolution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-80 cursor-crosshair"
            onClick={handleCanvasClick}
          />
          <div className="mt-4 flex justify-between text-xs text-quantum-particle">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4ecdc4]"></div>
                <span>|0⟩ State</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#45b7d1]"></div>
                <span>|1⟩ State</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#96ceb4]"></div>
                <span>Superposition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff6b6b]"></div>
                <span>Entangled</span>
              </div>
            </div>
            <div className="text-quantum-glow">
              Current Time: {currentTime.toFixed(2)}μs
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
