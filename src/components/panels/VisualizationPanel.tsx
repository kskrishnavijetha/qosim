
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ChevronRight } from 'lucide-react';

export function VisualizationPanel() {
  return (
    <div className="p-6 space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Quantum Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-quantum-neon">
            Visualize quantum states, entanglement, and circuit behavior with interactive tools.
          </p>
          <Button>
            Start Visualizing <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
