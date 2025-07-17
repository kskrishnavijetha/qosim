import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Zap, RotateCcw, Activity, Target, Package, Cpu } from 'lucide-react';
import { CustomGatePalette } from './CustomGatePalette';
import { CustomGate } from '@/lib/customGates';

interface GatePaletteProps {
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  customGates?: CustomGate[];
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

export function GatePalette({ onGateMouseDown, customGates = [] }: GatePaletteProps) {
  return (
    <div className="space-y-4">
      {/* Custom Gates */}
      {customGates.length > 0 && (
        <>
          <CustomGatePalette 
            customGates={customGates}
            onGateMouseDown={onGateMouseDown}
          />
          <Separator />
        </>
      )}

      {/* Standard Gates */}
      <Card className="quantum-panel">
        <CardHeader className="pb-3">
          <CardTitle className="text-base lg:text-lg font-mono text-quantum-glow">Gate Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gateCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-bold text-quantum-glow">{category.title}</h4>
              <div className="grid grid-cols-3 gap-2">
                {category.gates.map(gate => (
                  <Button
                    key={gate.type}
                    variant="secondary"
                    className="w-full h-10 flex items-center justify-center"
                    onMouseDown={(e) => onGateMouseDown(e, gate.type)}
                  >
                    {gate.icon && <gate.icon className="w-4 h-4 mr-2" />}
                    {gate.name}
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
