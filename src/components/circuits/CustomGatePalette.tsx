
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomGate } from '@/lib/customGates';

interface CustomGatePaletteProps {
  customGates: CustomGate[];
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
  isMobile?: boolean;
}

export function CustomGatePalette({ 
  customGates, 
  onGateMouseDown, 
  onGateTouchStart,
  isMobile = false 
}: CustomGatePaletteProps) {
  const handleGateInteraction = (e: React.MouseEvent | React.TouchEvent, gateType: string) => {
    if ('touches' in e && onGateTouchStart) {
      onGateTouchStart(e, gateType);
    } else if ('button' in e) {
      onGateMouseDown(e, gateType);
    }
  };

  if (customGates.length === 0) return null;

  return (
    <Card className="quantum-panel">
      <CardHeader className="pb-3">
        <CardTitle className={`font-mono text-quantum-glow ${isMobile ? 'text-base' : 'text-lg'}`}>
          Custom Gates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-2 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {customGates.map(gate => (
            <Button
              key={gate.name}
              variant="secondary"
              className={`flex items-center justify-center select-none ${
                isMobile ? 'h-12 text-xs' : 'h-10'
              }`}
              onMouseDown={(e) => handleGateInteraction(e, gate.name)}
              onTouchStart={(e) => handleGateInteraction(e, gate.name)}
              title={`${gate.name} - ${gate.qubits} qubit${gate.qubits > 1 ? 's' : ''}`}
            >
              <span className={isMobile ? 'text-xs' : ''}>{gate.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
