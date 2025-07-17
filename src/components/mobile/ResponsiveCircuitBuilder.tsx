
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Menu, Palette } from 'lucide-react';
import { GatePalette } from '../circuits/GatePalette';
import { CircuitGrid } from '../circuits/CircuitGrid';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { CustomGate } from '@/lib/customGates';
import { useIsMobile } from '@/hooks/use-mobile';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface ResponsiveCircuitBuilderProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart: (e: React.TouchEvent, gateType: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
  customGates?: CustomGate[];
}

export function ResponsiveCircuitBuilder({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  onGateTouchStart,
  circuitRef,
  numQubits,
  gridSize,
  customGates = []
}: ResponsiveCircuitBuilderProps) {
  const isMobile = useIsMobile();
  const [paletteOpen, setPaletteOpen] = React.useState(false);

  if (isMobile) {
    return (
      <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
            <Drawer open={paletteOpen} onOpenChange={setPaletteOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Gates
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[70vh]">
                <DrawerHeader>
                  <DrawerTitle>Quantum Gates</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 overflow-y-auto">
                  <GatePalette 
                    onGateMouseDown={onGateMouseDown}
                    onGateTouchStart={onGateTouchStart}
                    customGates={customGates}
                    isMobile={true}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="w-full overflow-x-auto">
            <CircuitGrid 
              circuit={circuit}
              dragState={dragState}
              simulationResult={simulationResult}
              onDeleteGate={onDeleteGate}
              circuitRef={circuitRef}
              NUM_QUBITS={numQubits}
              GRID_SIZE={Math.max(gridSize * 0.8, 35)}
              isMobile={true}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tablet layout
  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mb-4">
              Gate Palette
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-6">
            <GatePalette 
              onGateMouseDown={onGateMouseDown}
              onGateTouchStart={onGateTouchStart}
              customGates={customGates}
              isMobile={false}
            />
          </CollapsibleContent>
        </Collapsible>
        
        <div className="w-full overflow-x-auto">
          <CircuitGrid 
            circuit={circuit}
            dragState={dragState}
            simulationResult={simulationResult}
            onDeleteGate={onDeleteGate}
            circuitRef={circuitRef}
            NUM_QUBITS={numQubits}
            GRID_SIZE={gridSize}
            isMobile={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
