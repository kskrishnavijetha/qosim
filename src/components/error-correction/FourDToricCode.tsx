
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Target, Zap, Play, Square, RotateCcw } from 'lucide-react';

interface FourDToricCodeState {
  L: number;
  currentTimeStep: number;
  maxTimeSteps: number;
  syndromeCount: number;
  physicalQubitCount: number;
  correctionCount: number;
  noiseRate: number;
  autoCorrection: boolean;
  showStabilizers: boolean;
}

export function FourDToricCode() {
  const [state, setState] = useState<FourDToricCodeState>({
    L: 3,
    currentTimeStep: 0,
    maxTimeSteps: 10,
    syndromeCount: 0,
    physicalQubitCount: 27,
    correctionCount: 0,
    noiseRate: 0.01,
    autoCorrection: true,
    showStabilizers: true
  });

  const [isSimulating, setIsSimulating] = useState(false);

  console.log('FourDToricCode component rendering', { state, isSimulating });

  const handleStartSimulation = useCallback(() => {
    console.log('Starting 4D TQEC simulation');
    setIsSimulating(true);
    
    // Simulate error injection and correction
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        syndromeCount: Math.floor(Math.random() * 5) + 1,
        correctionCount: prev.correctionCount + 1
      }));
      setIsSimulating(false);
    }, 2000);
  }, []);

  const handleInjectNoise = useCallback(() => {
    console.log('Injecting noise into 4D lattice');
    setState(prev => ({
      ...prev,
      syndromeCount: Math.floor(Math.random() * 8) + 2
    }));
  }, []);

  const handleReset = useCallback(() => {
    console.log('Resetting 4D TQEC simulation');
    setState(prev => ({
      ...prev,
      currentTimeStep: 0,
      syndromeCount: 0,
      correctionCount: 0
    }));
    setIsSimulating(false);
  }, []);

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-quantum-glow">4D Topological Quantum Error Correction</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
            Step: {state.currentTimeStep + 1}/{state.maxTimeSteps}
          </Badge>
          <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
            Syndromes: {state.syndromeCount}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Main Visualization Area */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Target className="w-5 h-5" />
                4D TQEC Lattice Visualization
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isSimulating ? 'Simulating...' : 'Start Simulation'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInjectNoise}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Inject Noise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-140px)]">
              <div className="w-full h-full bg-quantum-void/50 rounded-lg border border-quantum-neon/20 flex items-center justify-center relative overflow-hidden">
                {/* Placeholder 4D Lattice Visualization */}
                <div className="grid grid-cols-3 gap-4 p-8">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${
                        i < state.syndromeCount
                          ? 'border-red-400 bg-red-400/20 animate-pulse'
                          : 'border-quantum-neon/50 bg-quantum-neon/10'
                      }`}
                    >
                      <Square 
                        className={`w-6 h-6 ${
                          i < state.syndromeCount ? 'text-red-400' : 'text-quantum-neon'
                        }`} 
                      />
                    </div>
                  ))}
                </div>
                
                {isSimulating && (
                  <div className="absolute inset-0 bg-quantum-neon/5 flex items-center justify-center">
                    <div className="text-quantum-neon font-semibold animate-pulse">
                      Simulating 4D TQEC...
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 text-xs text-quantum-text">
                  4D Toric Code Lattice ({state.L}×{state.L}×{state.L}×{state.maxTimeSteps})
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">TQEC Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-quantum-text mb-2 block">Lattice Size (L)</label>
                <Slider
                  value={[state.L]}
                  onValueChange={([value]) => setState(prev => ({ 
                    ...prev, 
                    L: value,
                    physicalQubitCount: value * value * value
                  }))}
                  min={2}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-quantum-text">{state.L}×{state.L}×{state.L}</span>
              </div>

              <div>
                <label className="text-sm text-quantum-text mb-2 block">Noise Rate</label>
                <Slider
                  value={[state.noiseRate * 100]}
                  onValueChange={([value]) => setState(prev => ({ ...prev, noiseRate: value / 100 }))}
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-quantum-text">{(state.noiseRate * 100).toFixed(1)}%</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-quantum-text">Auto Correction</label>
                  <Switch
                    checked={state.autoCorrection}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, autoCorrection: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-quantum-text">Show Stabilizers</label>
                  <Switch
                    checked={state.showStabilizers}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, showStabilizers: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Error Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Single Qubit Error', description: 'Isolated bit flip' },
                { name: 'Error Chain', description: 'Connected error path' },
                { name: 'Error Cluster', description: 'Local error region' },
                { name: 'Anyonic Path', description: 'Braiding simulation' }
              ].map((pattern, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleInjectNoise()}
                  className="w-full text-left justify-start border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  <div>
                    <div className="font-medium">{pattern.name}</div>
                    <div className="text-xs text-quantum-text opacity-70">{pattern.description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <div className="text-quantum-text">
                  Active Syndromes: <span className="text-quantum-neon">{state.syndromeCount}</span>
                </div>
                <div className="text-quantum-text">
                  Physical Qubits: <span className="text-quantum-neon">{state.physicalQubitCount}</span>
                </div>
                <div className="text-quantum-text">
                  Corrections Applied: <span className="text-quantum-neon">{state.correctionCount}</span>
                </div>
                <div className="text-quantum-text">
                  Error Threshold: <span className="text-quantum-neon">~1%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {state.syndromeCount > 0 && (
        <Alert className="bg-quantum-dark border-quantum-neon/30">
          <Info className="h-4 w-4 text-quantum-neon" />
          <AlertDescription className="text-quantum-text">
            <strong className="text-quantum-glow">Error Detection:</strong> {state.syndromeCount} syndrome(s) detected. 
            {state.autoCorrection ? ' Auto-correction will be applied.' : ' Manual correction required.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
