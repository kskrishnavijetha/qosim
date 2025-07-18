
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Zap, RotateCcw, Activity, Target, Package, Cpu } from 'lucide-react';
import { CustomGatePalette } from './CustomGatePalette';
import { CustomGate } from '@/lib/customGates';

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
  customGates?: CustomGate[];
  isMobile?: boolean;
}

const gateCategories = [
  {
    title: 'Single Qubit Gates',
    gates: [
      { type: 'H', name: 'Hadamard', icon: Zap },
      { type: 'X', name: 'Pauli-X', icon: RotateCcw },
      { type: 'Z', name: 'Pauli-Z', icon: Activity },
    ]
  },
  {
    title: 'Multi Qubit Gates',
    gates: [
      { type: 'CNOT', name: 'CNOT', icon: Target },
    ]
  },
  {
    title: 'Composite Gates',
    gates: [
      { type: 'BELL', name: 'Bell State', icon: Package },
      { type: 'GHZ', name: 'GHZ State', icon: Cpu },
    ]
  }
];

export function GatePalette({ 
  onGateMouseDown, 
  onGateTouchStart, 
  customGates = [], 
  isMobile = false 
}: GatePaletteProps) {
  const handleGateInteraction = (e: React.MouseEvent | React.TouchEvent, gateType: string) => {
    if ('touches' in e && onGateTouchStart) {
      onGateTouchStart(e, gateType);
    } else if ('button' in e) {
      onGateMouseDown(e, gateType);
    }
  };

  return (
    <div className="space-y-4">
      {/* Custom Gates */}
      {customGates.length > 0 && (
        <>
          <CustomGatePalette 
            customGates={customGates}
            onGateMouseDown={onGateMouseDown}
            onGateTouchStart={onGateTouchStart}
            isMobile={isMobile}
          />
          <Separator />
        </>
      )}

      {/* Standard Gates */}
      <Card className="quantum-panel">
        <CardHeader className="pb-3">
          <CardTitle className={`font-mono text-quantum-glow ${isMobile ? 'text-base' : 'text-lg'}`}>
            Gate Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gateCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-bold text-quantum-glow">{category.title}</h4>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {category.gates.map(gate => (
                  <Button
                    key={gate.type}
                    variant="secondary"
                    className={`flex items-center justify-center select-none ${
                      isMobile ? 'h-12 text-xs' : 'h-10'
                    }`}
                    onMouseDown={(e) => handleGateInteraction(e, gate.type)}
                    onTouchStart={(e) => handleGateInteraction(e, gate.type)}
                  >
                    {gate.icon && <gate.icon className={`mr-2 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />}
                    <span className={isMobile ? 'text-xs' : ''}>{gate.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
