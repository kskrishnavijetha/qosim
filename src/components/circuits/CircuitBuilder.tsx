
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GatePalette } from './GatePalette';
import { CircuitGrid } from './CircuitGrid';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface CircuitBuilderProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
}

export function CircuitBuilder({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  onGateTouchStart,
  circuitRef,
  numQubits,
  gridSize
}: CircuitBuilderProps) {
  const isMobile = useIsMobile();
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);

  if (isMobile) {
    return (
      <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '400ms' }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-mono text-quantum-glow">Circuit Designer</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaletteCollapsed(!paletteCollapsed)}
              className="text-quantum-neon"
            >
              {paletteCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-4">
          {/* Collapsible Gate Palette */}
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            paletteCollapsed ? "h-0" : "h-auto"
          )}>
            <div className="border border-quantum-matrix rounded-lg p-3 bg-quantum-matrix/20">
              <GatePalette 
                onGateMouseDown={onGateMouseDown}
                onGateTouchStart={onGateTouchStart}
              />
            </div>
          </div>
          
          {/* Circuit Grid */}
          <div className="min-h-0">
            <CircuitGrid 
              circuit={circuit}
              dragState={dragState}
              simulationResult={simulationResult}
              onDeleteGate={onDeleteGate}
              circuitRef={circuitRef}
              NUM_QUBITS={numQubits}
              GRID_SIZE={Math.max(gridSize * 0.8, 35)} // Smaller grid on mobile
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop/Tablet Layout with Resizable Panels
  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom h-full" style={{ animationDelay: '400ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
      </CardHeader>
      <CardContent className="p-6 h-full">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Gate Palette Panel */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <div className="h-full overflow-auto pr-4">
              <GatePalette 
                onGateMouseDown={onGateMouseDown}
                onGateTouchStart={onGateTouchStart}
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Circuit Grid Panel */}
          <ResizablePanel defaultSize={75}>
            <div className="h-full pl-4">
              <CircuitGrid 
                circuit={circuit}
                dragState={dragState}
                simulationResult={simulationResult}
                onDeleteGate={onDeleteGate}
                circuitRef={circuitRef}
                NUM_QUBITS={numQubits}
                GRID_SIZE={gridSize}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
