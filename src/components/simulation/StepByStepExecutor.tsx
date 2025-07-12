import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Clock } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult, SimulationStepData } from '@/lib/quantumSimulatorOptimized';

interface StepByStepExecutorProps {
  circuit: Gate[];
  simulationResult: OptimizedSimulationResult | null;
  onStepModeToggle: (enabled: boolean) => void;
  onSimulationStep: () => SimulationStepData | null;
  onSimulationReset: () => void;
  onSimulationPause: () => void;
  onSimulationResume: () => void;
}

export function StepByStepExecutor({
  circuit,
  simulationResult,
  onStepModeToggle,
  onSimulationStep,
  onSimulationReset,
  onSimulationPause,
  onSimulationResume
}: StepByStepExecutorProps) {
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState([500]); // milliseconds
  const [stepData, setStepData] = useState<SimulationStepData | null>(null);

  const handleStepModeToggle = useCallback(() => {
    const newStepMode = !isStepMode;
    setIsStepMode(newStepMode);
    onStepModeToggle(newStepMode);
    
    if (!newStepMode) {
      setCurrentStep(0);
      setStepData(null);
      setIsPlaying(false);
    }
  }, [isStepMode, onStepModeToggle]);

  const handleStep = useCallback(() => {
    const stepResult = onSimulationStep();
    if (stepResult) {
      setStepData(stepResult);
      setCurrentStep(prev => prev + 1);
    }
    return stepResult;
  }, [onSimulationStep]);

  const handleReset = useCallback(() => {
    onSimulationReset();
    setCurrentStep(0);
    setStepData(null);
    setIsPlaying(false);
  }, [onSimulationReset]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      onSimulationPause();
    } else {
      setIsPlaying(true);
      onSimulationResume();
      
      // Auto-step execution
      const autoStep = () => {
        if (isPlaying) {
          const result = handleStep();
          if (result) {
            setTimeout(autoStep, playbackSpeed[0]);
          } else {
            setIsPlaying(false);
          }
        }
      };
      setTimeout(autoStep, playbackSpeed[0]);
    }
  }, [isPlaying, handleStep, playbackSpeed, onSimulationPause, onSimulationResume]);

  const progress = circuit.length > 0 ? (currentStep / circuit.length) * 100 : 0;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Clock className="w-5 h-5" />
          Step-by-Step Execution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={isStepMode ? "default" : "outline"}
            onClick={handleStepModeToggle}
            className="flex-1"
          >
            {isStepMode ? 'Exit Step Mode' : 'Enter Step Mode'}
          </Button>
          {isStepMode && (
            <Badge variant="secondary" className="quantum-glow">
              Step Mode Active
            </Badge>
          )}
        </div>

        {isStepMode && (
          <>
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {currentStep} / {circuit.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="quantum-progress" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (currentStep > 0) {
                    setCurrentStep(prev => prev - 1);
                  }
                }}
                disabled={currentStep === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                onClick={handlePlayPause}
                className="flex-1"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleStep}
                disabled={currentStep >= circuit.length}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Playback Speed: {playbackSpeed[0]}ms
              </label>
              <Slider
                value={playbackSpeed}
                onValueChange={setPlaybackSpeed}
                min={100}
                max={2000}
                step={100}
                className="quantum-slider"
              />
            </div>

            {/* Current Step Info */}
            {stepData && (
              <Card className="bg-quantum-dark/50 border-quantum-blue/30">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">Current Step:</h4>
                  <div className="space-y-1 text-sm">
                    <div>Gate: <Badge variant="outline">{stepData.gate.type}</Badge></div>
                    <div>Target: Qubit {stepData.gate.qubit ?? stepData.gate.qubits?.join(', ')}</div>
                    {stepData.gate.angle && (
                      <div>Angle: {(stepData.gate.angle * 180 / Math.PI).toFixed(2)}°</div>
                    )}
                    <div>Execution Time: {stepData.timestamp.toFixed(2)}ms</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* State Vector Display (Optional) */}
            {simulationResult && simulationResult.stepResults && (
              <Card className="bg-quantum-dark/30 border-quantum-purple/30">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">State Vector:</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs font-mono max-h-32 overflow-y-auto">
                    {simulationResult.stateVector.slice(0, 8).map((amplitude, i) => (
                      <div key={i} className="flex justify-between">
                        <span>|{i.toString(2).padStart(3, '0')}⟩:</span>
                        <span className="text-quantum-glow">
                          {amplitude.real.toFixed(3)}{amplitude.imag >= 0 ? '+' : ''}{amplitude.imag.toFixed(3)}i
                        </span>
                      </div>
                    ))}
                    {simulationResult.stateVector.length > 8 && (
                      <div className="col-span-2 text-center text-gray-500">
                        ... and {simulationResult.stateVector.length - 8} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}