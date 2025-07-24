
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ChevronRight } from 'lucide-react';

export function CircuitBuilderPanel() {
  return (
    <div className="p-6 space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Quantum Circuit Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-quantum-neon">
            Build and design quantum circuits with our intuitive drag-and-drop interface.
          </p>
          <Button>
            Start Building <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
