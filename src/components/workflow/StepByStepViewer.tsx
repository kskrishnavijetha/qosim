
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimulationStep, WorkflowState } from '@/hooks/usePostSimulationWorkflow';
import { Play, Pause, SkipBack, SkipForward, Settings } from 'lucide-react';

interface StepByStepViewerProps {
  steps: SimulationStep[];
  workflowState: WorkflowState;
  onPlay: () => void;
  onPause: () => void;
  onSetStep: (step: number) => void;
  onSetSpeed: (speed: number) => void;
  numQubits: number;
}

export function StepByStepViewer({
  steps,
  workflowState,
  onPlay,
  onPause,
  onSetStep,
  onSetSpeed,
  numQubits
}: StepByStepViewerProps) {
  const currentStep = steps[workflowState.currentStep];
  
  if (!currentStep) {
    return (
      <div className="text-center text-quantum-particle py-8">
        No simulation steps available
      </div>
    );
  }

  const significantProbabilities = Object.entries(currentStep.measurementProbabilities)
    .filter(([_, prob]) => prob > 0.001)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Playback Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-neon flex items-center justify-between">
            <span>Step {workflowState.currentStep} of {workflowState.totalSteps - 1}</span>
            <Badge variant="outline" className="text-quantum-glow">
              {currentStep.description}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-quantum-particle">
              <span>Step Progress</span>
              <span>{workflowState.currentStep}/{workflowState.totalSteps - 1}</span>
            </div>
            <Slider
              value={[workflowState.currentStep]}
              onValueChange={([value]) => onSetStep(value)}
              max={workflowState.totalSteps - 1}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetStep(0)}
              disabled={workflowState.currentStep === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetStep(workflowState.currentStep - 1)}
              disabled={workflowState.currentStep === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={workflowState.isPlaying ? onPause : onPlay}
              className="quantum-panel neon-border"
            >
              {workflowState.isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {workflowState.isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetStep(workflowState.currentStep + 1)}
              disabled={workflowState.currentStep >= workflowState.totalSteps - 1}
            >
              Next
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetStep(workflowState.totalSteps - 1)}
              disabled={workflowState.currentStep >= workflowState.totalSteps - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center gap-2 justify-center">
            <Settings className="w-4 h-4 text-quantum-particle" />
            <span className="text-sm text-quantum-particle">Speed:</span>
            <Select 
              value={workflowState.playbackSpeed.toString()} 
              onValueChange={(value) => onSetSpeed(Number(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2000">0.5x</SelectItem>
                <SelectItem value="1000">1x</SelectItem>
                <SelectItem value="500">2x</SelectItem>
                <SelectItem value="250">4x</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gate Information */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Current Gate</CardTitle>
            <CardDescription>Gate being applied at this step</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep.gate ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-quantum-neon font-mono text-lg">
                    {currentStep.gate.type}
                  </Badge>
                  <span className="text-quantum-particle">
                    → Qubit {currentStep.gate.qubit || currentStep.gate.qubits?.join(', ') || 'unknown'}
                  </span>
                </div>
                
                {currentStep.gate.angle && (
                  <div className="text-sm">
                    <span className="text-quantum-particle">Angle: </span>
                    <span className="text-quantum-glow font-mono">
                      {currentStep.gate.angle.toFixed(4)} rad
                    </span>
                  </div>
                )}
                
                {currentStep.gate.params && (
                  <div className="text-sm">
                    <span className="text-quantum-particle">Parameters: </span>
                    <span className="text-quantum-glow font-mono">
                      [{currentStep.gate.params.join(', ')}]
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Badge variant="outline" className="text-quantum-glow">
                  Initial State
                </Badge>
                <p className="text-sm text-quantum-particle mt-2">
                  All qubits in |0⟩ state
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* State Information */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-plasma">Quantum State</CardTitle>
            <CardDescription>Current state after applying gate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-quantum-particle text-sm">Significant States:</span>
                <div className="space-y-2 mt-2">
                  {significantProbabilities.map(([state, prob]) => (
                    <div key={state} className="flex justify-between items-center">
                      <span className="font-mono text-quantum-neon">|{state}⟩</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-quantum-void rounded-full h-1">
                          <div 
                            className="h-1 rounded-full bg-quantum-glow"
                            style={{ width: `${prob * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-quantum-glow w-12 text-right">
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-quantum-particle">
                Total active states: {Object.keys(currentStep.measurementProbabilities).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
