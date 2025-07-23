
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';

interface StepByStepExecutorProps {
  onStepExecute: (gateIndex: number) => void;
  onReset: () => void;
}

export function StepByStepExecutor({ onStepExecute, onReset }: StepByStepExecutorProps) {
  const { gates } = useCircuitStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const progress = gates.length > 0 ? (currentStep / gates.length) * 100 : 0;

  const handleStep = useCallback(() => {
    if (currentStep < gates.length) {
      onStepExecute(currentStep);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, gates.length, onStepExecute]);

  const handlePlay = useCallback(() => {
    if (currentStep >= gates.length) return;
    
    setIsPlaying(true);
    const id = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= gates.length - 1) {
          setIsPlaying(false);
          clearInterval(id);
          return prev + 1;
        }
        onStepExecute(prev);
        return prev + 1;
      });
    }, 1000);
    setIntervalId(id);
  }, [currentStep, gates.length, onStepExecute]);

  const handlePause = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPlaying(false);
  }, [intervalId]);

  const handleReset = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPlaying(false);
    setCurrentStep(0);
    onReset();
  }, [intervalId, onReset]);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          Step-by-Step Execution
          <Badge variant="secondary" className="ml-2">
            {currentStep}/{gates.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        
        {/* Current Gate Display */}
        {currentStep < gates.length && (
          <div className="p-2 bg-quantum-matrix/20 rounded text-xs">
            <div className="text-quantum-glow">Next Gate:</div>
            <div className="text-quantum-neon font-mono">
              {gates[currentStep].type} on Qubit {gates[currentStep].qubit} 
              at Time {gates[currentStep].timeStep}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={gates.length === 0 || currentStep >= gates.length}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          
          <Button
            onClick={handleStep}
            disabled={gates.length === 0 || currentStep >= gates.length || isPlaying}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Step
          </Button>
          
          <Button
            onClick={handleReset}
            disabled={gates.length === 0}
            variant="outline"
            size="sm"
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
