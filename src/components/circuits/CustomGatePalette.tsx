
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CustomGate } from '@/lib/customGates';

interface CustomGatePaletteProps {
  customGates: CustomGate[];
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
}

export function CustomGatePalette({ customGates, onGateMouseDown }: CustomGatePaletteProps) {
  if (customGates.length === 0) {
    return null;
  }

  return (
    <Card className="quantum-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Custom Gates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {customGates.map((gate) => (
          <Button
            key={gate.id}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-auto p-2"
            onMouseDown={(e) => onGateMouseDown(e, gate.id)}
            style={{
              borderColor: gate.color + '40',
              backgroundColor: gate.color + '10'
            }}
          >
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: gate.color }}
            />
            <div className="flex-1 text-left">
              <div className="font-medium text-xs">{gate.name}</div>
              {gate.description && (
                <div className="text-xs text-muted-foreground truncate">
                  {gate.description}
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {gate.size === 2 ? '1Q' : gate.size === 4 ? '2Q' : '3Q'}
            </Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
