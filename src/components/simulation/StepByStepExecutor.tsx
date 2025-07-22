import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface StepByStepExecutorProps {
  circuit: Gate[];
  onStep: () => void;
  onReset: () => void;
  onPause: () => void;
  onResume: () => void;
  isRunning: boolean;
  progress: number;
}

export function StepByStepExecutor({
  circuit,
  onStep,
  onReset,
  onPause,
  onResume,
  isRunning,
  progress
}: StepByStepExecutorProps) {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon">
          Step-by-Step Execution
          <Badge variant="secondary" className="ml-2">
            {circuit.length} gates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <div className="flex items-center justify-between">
          <Button
            onClick={isRunning ? onPause : onResume}
            disabled={circuit.length === 0}
            variant="outline"
            className="neon-border"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button
            onClick={onStep}
            disabled={isRunning || circuit.length === 0}
            variant="outline"
            className="neon-border"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Next Step
          </Button>
          <Button
            onClick={onReset}
            disabled={isRunning || circuit.length === 0}
            variant="outline"
            className="neon-border"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

