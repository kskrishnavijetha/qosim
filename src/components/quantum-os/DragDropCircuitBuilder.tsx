
import React, { forwardRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Use types from the workspace hook to ensure consistency
import type { 
  Gate, 
  Circuit 
} from '@/hooks/useCircuitWorkspace';

interface DragDropCircuitBuilderProps {
  circuit?: Circuit | null;
  onCircuitChange: (circuit: Circuit) => void;
  onCanvasClick?: (x: number, y: number) => void;
  className?: string;
}

export const DragDropCircuitBuilder = forwardRef<HTMLDivElement, DragDropCircuitBuilderProps>(
  ({ circuit, onCircuitChange, onCanvasClick, className }, ref) => {
    
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (onCanvasClick) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        onCanvasClick(x, y);
      }
    }, [onCanvasClick]);

    const handleRemoveGate = (gateId: string) => {
      if (!circuit) return;
      
      const updatedCircuit: Circuit = {
        ...circuit,
        gates: circuit.gates.filter(gate => gate.id !== gateId)
      };
      
      onCircuitChange(updatedCircuit);
    };

    const renderGate = (gate: Gate) => {
      // Calculate position based on gate properties
      const x = (gate.position || 0) * 80 + 100; // 80px spacing + 100px offset
      const y = (gate.qubit || 0) * 60 + 50; // 60px spacing + 50px offset

      return (
        <div
          key={gate.id}
          className="absolute group"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className={cn(
              "w-12 h-8 rounded border-2 border-quantum-glow bg-quantum-matrix/20",
              "flex items-center justify-center text-xs font-mono text-quantum-glow",
              "hover:bg-quantum-glow/10 transition-colors cursor-pointer"
            )}>
              {gate.type.toUpperCase()}
            </div>
            
            {/* Remove button - appears on hover */}
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveGate(gate.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      );
    };

    const renderQubitLines = () => {
      const lines = [];
      for (let i = 0; i < 8; i++) {
        const y = i * 60 + 50;
        lines.push(
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-quantum-glow/30"
            style={{ top: `${y}px` }}
          />
        );
        lines.push(
          <div
            key={`label-${i}`}
            className="absolute left-4 text-sm font-mono text-quantum-glow/70"
            style={{ top: `${y - 10}px` }}
          >
            q[{i}]
          </div>
        );
      }
      return lines;
    };

    if (!circuit) {
      return (
        <Card className="h-full quantum-panel neon-border">
          <CardContent className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No circuit selected</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={cn("h-full quantum-panel neon-border", className)}>
        <CardContent className="h-full p-0 relative overflow-auto">
          <div
            ref={ref}
            className="h-full min-h-[500px] relative cursor-crosshair"
            onClick={handleCanvasClick}
          >
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(123, 255, 178, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(123, 255, 178, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '80px 60px'
                }}
              />
            </div>

            {/* Qubit lines and labels */}
            {renderQubitLines()}

            {/* Gates */}
            {circuit.gates.map(renderGate)}

            {/* Circuit info */}
            <div className="absolute top-4 right-4 text-sm font-mono text-quantum-glow/70">
              {circuit.name} - {circuit.gates.length} gates
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

DragDropCircuitBuilder.displayName = 'DragDropCircuitBuilder';
