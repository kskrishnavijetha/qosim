import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface SimulationRunnerProps {
  circuit: Gate[];
  isRunning: boolean;
  progress: number;
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function SimulationRunner({
  circuit,
  isRunning,
  progress,
  onRun,
  onStop,
  onClear
}: SimulationRunnerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Simulation Runner</CardTitle>
        <Button variant="ghost" size="sm" onClick={toggleExpand}>
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <>
            <div className="text-sm text-muted-foreground">
              {circuit.length} gates in the circuit
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="w-1/3 mr-2"
                disabled={isRunning}
                onClick={onRun}
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-1/3 ml-2"
                onClick={onClear}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Click "Expand" to view simulation options.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

