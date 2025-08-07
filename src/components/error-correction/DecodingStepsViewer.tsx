
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Activity, Play, Pause, SkipForward, CheckCircle, AlertTriangle } from 'lucide-react';

interface DecodingStepsViewerProps {
  results: any;
  currentTimeStep: number;
}

export function DecodingStepsViewer({ results, currentTimeStep }: DecodingStepsViewerProps) {
  const [selectedStep, setSelectedStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStepData = results?.timeSteps?.[selectedStep];
  
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-neon flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Decoding Steps
        </CardTitle>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="neon-border"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStep(prev => Math.min(prev + 1, (results?.timeSteps?.length || 1) - 1))}
              className="neon-border"
            >
              <SkipForward className="w-3 h-3" />
            </Button>
          </div>
          
          <Badge variant="outline" className="text-quantum-glow">
            Step {selectedStep + 1}/{results?.timeSteps?.length || 0}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Step Selection */}
        <div className="space-y-2">
          <Progress value={((selectedStep + 1) / (results?.timeSteps?.length || 1)) * 100} className="w-full" />
          <div className="flex gap-1 overflow-x-auto">
            {results?.timeSteps?.map((_, index: number) => (
              <Button
                key={index}
                variant={index === selectedStep ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStep(index)}
                className="flex-shrink-0 w-8 h-8 p-0 text-xs"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Current Step Details */}
        {currentStepData && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground">Errors Detected</div>
                <div className="text-quantum-energy font-mono text-lg">
                  {currentStepData.errors?.length || 0}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Corrections Applied</div>
                <div className="text-quantum-glow font-mono text-lg">
                  {currentStepData.corrections?.length || 0}
                </div>
              </div>
            </div>

            {/* Syndrome Pattern */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Active Syndromes</div>
              <div className="bg-black/50 rounded p-2 font-mono text-xs">
                {currentStepData.syndromes?.length > 0 ? (
                  <div className="space-y-1">
                    {currentStepData.syndromes.slice(0, 5).map((syndrome: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-quantum-neon">
                          {syndrome.type}({syndrome.position.x},{syndrome.position.y},{syndrome.position.z})
                        </span>
                        <Badge variant="outline" className="text-quantum-energy">
                          {syndrome.syndrome}
                        </Badge>
                      </div>
                    ))}
                    {currentStepData.syndromes.length > 5 && (
                      <div className="text-muted-foreground">
                        +{currentStepData.syndromes.length - 5} more...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No active syndromes</div>
                )}
              </div>
            </div>

            {/* Decoding Algorithm Steps */}
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Decoding Process</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>1. Syndrome measurement</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>2. Error pattern analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {currentStepData.corrections?.length > 0 ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  )}
                  <span>3. Minimum-weight matching</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>4. Correction application</span>
                </div>
              </div>
            </div>

            {/* Step Fidelity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Step Fidelity</span>
                <Badge variant="outline" className="text-quantum-particle">
                  {((currentStepData.fidelity || 0) * 100).toFixed(2)}%
                </Badge>
              </div>
              <Progress value={(currentStepData.fidelity || 0) * 100} className="w-full" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
