
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, BarChart3 } from 'lucide-react';

interface SimulationPanelProps {
  result: any;
  isSimulating: boolean;
}

export function SimulationPanel({ result, isSimulating }: SimulationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Simulation Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSimulating ? (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Simulating...</div>
            <Progress value={75} />
          </div>
        ) : result ? (
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium mb-2">State Probabilities</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>|00⟩</span>
                  <Badge variant="secondary">50%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>|11⟩</span>
                  <Badge variant="secondary">50%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Measurement Stats</div>
              <div className="text-xs text-muted-foreground">
                1024 shots completed
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div>No simulation data</div>
            <div className="text-xs">Run simulation to see results</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
