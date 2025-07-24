
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, BarChart3, Zap } from 'lucide-react';

export function VisualizationPanel() {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Quantum Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Probability
            </Button>
            <Button size="sm" variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Bloch Sphere
            </Button>
          </div>
          <div className="text-sm text-quantum-particle">
            Visualize quantum states and circuit execution
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
