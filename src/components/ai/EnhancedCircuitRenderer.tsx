import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Utility function to get computed CSS custom property value
const getCSSVariableValue = (variable: string): string => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `hsl(${value})` : '#000000';
};

interface CircuitGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

interface EnhancedCircuitRendererProps {
  gates: CircuitGate[];
  numQubits: number;
  width?: number;
  height?: number;
  showTooltips?: boolean;
}

interface GateTooltipInfo {
  x: number;
  y: number;
  width: number;
  height: number;
  gate: CircuitGate;
  explanation: string;
}

const getGateExplanation = (gate: CircuitGate): string => {
  switch (gate.type) {
    case 'H':
      return 'Creates superposition of |0⟩ and |1⟩. Transforms |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2';
    case 'X':
      return 'Pauli-X gate (quantum NOT). Flips qubit states: |0⟩ → |1⟩ and |1⟩ → |0⟩';
    case 'Y':
      return 'Pauli-Y gate. Rotates around Y-axis: |0⟩ → i|1⟩ and |1⟩ → -i|0⟩';
    case 'Z':
      return 'Pauli-Z gate (phase flip). Applies phase: |0⟩ → |0⟩ and |1⟩ → -|1⟩';
    case 'S':
      return 'S gate (phase gate). Applies π/2 phase: |1⟩ → i|1⟩';
    case 'T':
      return 'T gate (π/8 gate). Applies π/4 phase: |1⟩ → e^(iπ/4)|1⟩';
    case 'CNOT':
      return 'Controlled-NOT gate. Creates entanglement: if control is |1⟩, flips target qubit';
    case 'CZ':
      return 'Controlled-Z gate. Applies phase flip when both qubits are |1⟩';
    case 'SWAP':
      return 'Swaps the states of two qubits: |ab⟩ → |ba⟩';
    case 'RX':
      return `Rotation around X-axis by ${(gate.angle || 0).toFixed(2)} radians. Mixes |0⟩ and |1⟩ states`;
    case 'RY':
      return `Rotation around Y-axis by ${(gate.angle || 0).toFixed(2)} radians. Creates superposition with controllable amplitude`;
    case 'RZ':
      return `Rotation around Z-axis by ${(gate.angle || 0).toFixed(2)} radians. Applies relative phase`;
    case 'CCX':
    case 'TOFFOLI':
      return 'Toffoli gate (CCNOT). Flips target qubit only when both control qubits are |1⟩';
    default:
      return `${gate.type} gate - quantum operation on qubit(s)`;
  }
};

export function EnhancedCircuitRenderer({
  gates,
  numQubits,
  width = 600,
  height = 300,
  showTooltips = true
}: EnhancedCircuitRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredGate, setHoveredGate] = useState<GateTooltipInfo | null>(null);
  const [gateRegions, setGateRegions] = useState<GateTooltipInfo[]>([]);

  useEffect(() => {
    if (canvasRef.current && gates.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas
      ctx.fillStyle = getCSSVariableValue('--background');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Circuit drawing parameters
      const startX = 80;
      const startY = 40;
      const wireSpacing = Math.max(40, (height - 80) / Math.max(1, numQubits - 1));
      const gateSpacing = 70;
      const gateSize = 28;
      
      const newGateRegions: GateTooltipInfo[] = [];
      
      // Draw qubit wires
      ctx.strokeStyle = getCSSVariableValue('--foreground');
      ctx.lineWidth = 2;
      
      for (let i = 0; i < numQubits; i++) {
        const y = startY + i * wireSpacing;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(canvas.width - 50, y);
        ctx.stroke();
        
        // Draw qubit labels
        ctx.fillStyle = getCSSVariableValue('--foreground');
        ctx.font = '12px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`q${i}`, startX - 10, y + 4);
      }
      
      // Group gates by position
      const positions = new Map<number, CircuitGate[]>();
      gates.forEach(gate => {
        const pos = gate.position || 0;
        if (!positions.has(pos)) {
          positions.set(pos, []);
        }
        positions.get(pos)!.push(gate);
      });
      
      // Draw gates
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      Array.from(positions.keys()).sort((a, b) => a - b).forEach((position, index) => {
        const gatesAtPosition = positions.get(position)!;
        const x = startX + (index + 1) * gateSpacing;
        
        gatesAtPosition.forEach(gate => {
          if (gate.type === 'CNOT' && gate.qubits && gate.qubits.length >= 2) {
            // Draw CNOT gate
            const controlY = startY + (gate.qubits[0] || 0) * wireSpacing;
            const targetY = startY + (gate.qubits[1] || 1) * wireSpacing;
            
            // Control dot
            ctx.fillStyle = getCSSVariableValue('--primary');
            ctx.beginPath();
            ctx.arc(x, controlY, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Connection line
            ctx.strokeStyle = getCSSVariableValue('--primary');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, controlY);
            ctx.lineTo(x, targetY);
            ctx.stroke();
            
            // Target circle
            ctx.strokeStyle = getCSSVariableValue('--primary');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, targetY, 12, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Target plus
            ctx.beginPath();
            ctx.moveTo(x - 8, targetY);
            ctx.lineTo(x + 8, targetY);
            ctx.moveTo(x, targetY - 8);
            ctx.lineTo(x, targetY + 8);
            ctx.stroke();
            
            // Add to regions for hover
            if (showTooltips) {
              newGateRegions.push({
                x: x - 15,
                y: Math.min(controlY, targetY) - 15,
                width: 30,
                height: Math.abs(targetY - controlY) + 30,
                gate,
                explanation: getGateExplanation(gate)
              });
            }
            
          } else {
            // Single qubit gate
            const qubit = gate.qubit || 0;
            const y = startY + qubit * wireSpacing;
            
            // Gate box with gradient
            const gradient = ctx.createLinearGradient(x - gateSize/2, y - gateSize/2, x + gateSize/2, y + gateSize/2);
            const primaryColor = getCSSVariableValue('--primary');
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(1, primaryColor.replace('hsl(', 'hsla(').replace(')', ', 0.8)'));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x - gateSize/2, y - gateSize/2, gateSize, gateSize);
            
            // Gate border
            ctx.strokeStyle = getCSSVariableValue('--primary-foreground');
            ctx.lineWidth = 1;
            ctx.strokeRect(x - gateSize/2, y - gateSize/2, gateSize, gateSize);
            
            // Gate label
            ctx.fillStyle = getCSSVariableValue('--primary-foreground');
            ctx.fillText(gate.type, x, y);
            
            // Angle annotation for rotation gates
            if (gate.angle && ['RX', 'RY', 'RZ'].includes(gate.type)) {
              ctx.font = '8px monospace';
              ctx.fillStyle = getCSSVariableValue('--muted-foreground');
              ctx.fillText(`${gate.angle.toFixed(2)}`, x, y + gateSize/2 + 12);
              ctx.font = '11px monospace';
            }
            
            // Add to regions for hover
            if (showTooltips) {
              newGateRegions.push({
                x: x - gateSize/2,
                y: y - gateSize/2,
                width: gateSize,
                height: gateSize,
                gate,
                explanation: getGateExplanation(gate)
              });
            }
          }
        });
      });
      
      setGateRegions(newGateRegions);
    }
  }, [gates, numQubits, width, height, showTooltips]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!showTooltips || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const hoveredRegion = gateRegions.find(region => 
      mouseX >= region.x && 
      mouseX <= region.x + region.width && 
      mouseY >= region.y && 
      mouseY <= region.y + region.height
    );

    setHoveredGate(hoveredRegion || null);
  };

  const handleMouseLeave = () => {
    setHoveredGate(null);
  };

  return (
    <div ref={containerRef} className="relative">
      {showTooltips ? (
        <TooltipProvider>
          <Tooltip open={!!hoveredGate}>
            <TooltipTrigger asChild>
              <canvas
                ref={canvasRef}
                className="w-full cursor-pointer"
                style={{ maxWidth: '100%', height: 'auto' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
            </TooltipTrigger>
            {hoveredGate && (
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-semibold text-primary">{hoveredGate.gate.type} Gate</div>
                  <div className="text-sm text-muted-foreground">{hoveredGate.explanation}</div>
                  {hoveredGate.gate.qubits && (
                    <div className="text-xs">
                      Qubits: {hoveredGate.gate.qubits.join(', ')}
                    </div>
                  )}
                  {hoveredGate.gate.qubit !== undefined && (
                    <div className="text-xs">
                      Qubit: {hoveredGate.gate.qubit}
                    </div>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
}