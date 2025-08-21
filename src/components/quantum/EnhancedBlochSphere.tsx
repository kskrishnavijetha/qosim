
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlochSphereVisualization } from './BlochSphereVisualization';
import { RotateCcw, Zap } from 'lucide-react';

interface EnhancedBlochSphereProps {
  blochSphereData: Array<{
    x: number;
    y: number;
    z: number;
    qubit: number;
    theta?: number;
    phi?: number;
  }>;
  qubitStates: Array<{
    qubit: number;
    state: string;
    amplitude: { real: number; imag: number };
    phase: number;
    probability: number;
  }>;
  selectedQubit: number;
  onQubitSelect: (qubit: number) => void;
}

export function EnhancedBlochSphere({
  blochSphereData,
  qubitStates,
  selectedQubit,
  onQubitSelect
}: EnhancedBlochSphereProps) {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  const selectedQubitData = qubitStates.find(q => q.qubit === selectedQubit);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Bloch Sphere Visualization
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="neon-border"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset View
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bloch Sphere Visualization */}
        <div key={resetKey}>
          <BlochSphereVisualization
            blochSphereData={blochSphereData}
            qubitStates={qubitStates}
            selectedQubit={selectedQubit}
            onQubitSelect={onQubitSelect}
          />
        </div>
        
        {/* Qubit Selection */}
        <div className="flex flex-wrap gap-2">
          {qubitStates.map((state) => (
            <Button
              key={state.qubit}
              variant={selectedQubit === state.qubit ? "default" : "outline"}
              size="sm"
              onClick={() => onQubitSelect(state.qubit)}
              className="font-mono neon-border"
            >
              Qubit {state.qubit}
            </Button>
          ))}
        </div>
        
        {/* Selected Qubit Info */}
        {selectedQubitData && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-quantum-matrix/20 rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground mb-1">State</div>
              <div className="text-sm font-mono text-quantum-neon">
                {selectedQubitData.state}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Probability</div>
              <div className="text-sm font-mono text-quantum-glow">
                {(selectedQubitData.probability * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Phase</div>
              <div className="text-sm font-mono text-quantum-particle">
                {selectedQubitData.phase.toFixed(3)} rad
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Amplitude</div>
              <div className="text-sm font-mono text-quantum-plasma">
                {selectedQubitData.amplitude.real.toFixed(3)} + {selectedQubitData.amplitude.imag.toFixed(3)}i
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
