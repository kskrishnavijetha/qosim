
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Layers, 
  Zap, 
  Eye, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { FourDToricCodeSimulator } from './FourDToricCodeSimulator';
import { FourDLatticeVisualization } from './FourDLatticeVisualization';
import { ErrorCorrectionComparison } from './ErrorCorrectionComparison';
import { NoiseInjectionControls } from './NoiseInjectionControls';
import { DecodingStepsViewer } from './DecodingStepsViewer';
import { EducationalOverlays } from './EducationalOverlays';
import { useToast } from '@/hooks/use-toast';

interface FourDTopologicalQECProps {
  onSimulationComplete?: (result: any) => void;
}

export function FourDTopologicalQEC({ onSimulationComplete }: FourDTopologicalQECProps) {
  const [latticeSize, setLatticeSize] = useState<[number, number, number, number]>([4, 4, 4, 4]);
  const [timeSteps, setTimeSteps] = useState(10);
  const [currentTimeStep, setCurrentTimeStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0.1);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showEducationalOverlays, setShowEducationalOverlays] = useState(true);
  const [selectedVisualizationMode, setSelectedVisualizationMode] = useState<'4d' | '3d' | '2d'>('4d');
  const [showComparison, setShowComparison] = useState(false);
  
  const { toast } = useToast();
  const simulator = useMemo(() => new FourDToricCodeSimulator(latticeSize), [latticeSize]);

  const handleStartSimulation = useCallback(async () => {
    setIsSimulating(true);
    setCurrentTimeStep(0);
    
    try {
      toast({
        title: "🚀 4D QEC Simulation Started",
        description: "Initializing 4D toric code lattice...",
      });

      const results = await simulator.runSimulation({
        timeSteps,
        noiseLevel,
        errorTypes: ['bit-flip', 'phase-flip', 'depolarizing']
      });
      
      setSimulationResults(results);
      onSimulationComplete?.(results);
      
      toast({
        title: "✅ Simulation Complete",
        description: `4D toric code simulation finished with ${results.correctedErrors} errors corrected`,
      });
      
    } catch (error: any) {
      toast({
        title: "❌ Simulation Error",
        description: `Failed to run 4D QEC simulation: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  }, [simulator, timeSteps, noiseLevel, onSimulationComplete, toast]);

  const handlePauseSimulation = useCallback(() => {
    simulator.pause();
    setIsSimulating(false);
  }, [simulator]);

  const handleResetSimulation = useCallback(() => {
    simulator.reset();
    setSimulationResults(null);
    setCurrentTimeStep(0);
    setIsSimulating(false);
  }, [simulator]);

  const handleTimeStepChange = useCallback((step: number) => {
    setCurrentTimeStep(step);
    simulator.setTimeStep(step);
  }, [simulator]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Layers className="w-5 h-5" />
            4D Topological Quantum Error Correction
          </CardTitle>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
              >
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Start 4D QEC'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePauseSimulation}
                disabled={!isSimulating}
                className="neon-border"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              
              <Button
                variant="outline"
                onClick={handleResetSimulation}
                className="neon-border"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showEducationalOverlays}
                  onCheckedChange={setShowEducationalOverlays}
                />
                <span className="text-sm text-quantum-neon">Educational Overlays</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={showComparison}
                  onCheckedChange={setShowComparison}
                />
                <span className="text-sm text-quantum-particle">Show Comparison</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Lattice Configuration */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">X Dimension</label>
              <Slider
                value={[latticeSize[0]]}
                onValueChange={([value]) => setLatticeSize([value, latticeSize[1], latticeSize[2], latticeSize[3]])}
                min={2}
                max={8}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-quantum-glow font-mono">{latticeSize[0]}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Y Dimension</label>
              <Slider
                value={[latticeSize[1]]}
                onValueChange={([value]) => setLatticeSize([latticeSize[0], value, latticeSize[2], latticeSize[3]])}
                min={2}
                max={8}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-quantum-neon font-mono">{latticeSize[1]}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Z Dimension</label>
              <Slider
                value={[latticeSize[2]]}
                onValueChange={([value]) => setLatticeSize([latticeSize[0], latticeSize[1], value, latticeSize[3]])}
                min={2}
                max={8}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-quantum-particle font-mono">{latticeSize[2]}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">T Dimension</label>
              <Slider
                value={[latticeSize[3]]}
                onValueChange={([value]) => setLatticeSize([latticeSize[0], latticeSize[1], latticeSize[2], value])}
                min={2}
                max={8}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-quantum-energy font-mono">{latticeSize[3]}</div>
            </div>
          </div>
          
          {/* Time Step Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-muted-foreground">Time Evolution</label>
              <Badge variant="outline" className="text-quantum-glow">
                Step {currentTimeStep + 1}/{timeSteps}
              </Badge>
            </div>
            <Slider
              value={[currentTimeStep]}
              onValueChange={([value]) => handleTimeStepChange(value)}
              min={0}
              max={timeSteps - 1}
              step={1}
              className="w-full"
            />
            <Progress value={((currentTimeStep + 1) / timeSteps) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Visualization Panel */}
        <div className="xl:col-span-2 space-y-4">
          <FourDLatticeVisualization
            simulator={simulator}
            timeStep={currentTimeStep}
            showEducationalOverlays={showEducationalOverlays}
            visualizationMode={selectedVisualizationMode}
            onModeChange={setSelectedVisualizationMode}
          />
          
          {showEducationalOverlays && (
            <EducationalOverlays
              latticeSize={latticeSize}
              currentTimeStep={currentTimeStep}
              simulationResults={simulationResults}
            />
          )}
        </div>
        
        {/* Controls and Results */}
        <div className="space-y-4">
          <NoiseInjectionControls
            noiseLevel={noiseLevel}
            onNoiseLevelChange={setNoiseLevel}
            onInjectError={(errorType, position) => {
              simulator.injectError(errorType, position);
              toast({
                title: "🎯 Error Injected",
                description: `${errorType} error added at position [${position.x},${position.y},${position.z},${position.t}]`
              });
            }}
          />
          
          {simulationResults && (
            <DecodingStepsViewer
              results={simulationResults}
              currentTimeStep={currentTimeStep}
            />
          )}
          
          {isSimulating && (
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-quantum-neon">
                  <Activity className="w-4 h-4 mr-2" />
                  Real-time Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stabilizers Checked:</span>
                    <span className="text-quantum-glow">{simulator.getStabilizersChecked()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Errors Detected:</span>
                    <span className="text-quantum-energy">{simulator.getErrorsDetected()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Corrections Applied:</span>
                    <span className="text-quantum-particle">{simulator.getCorrectionsApplied()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Comparison Panel */}
      {showComparison && (
        <ErrorCorrectionComparison
          fourDResults={simulationResults}
          noiseLevel={noiseLevel}
          latticeSize={latticeSize}
        />
      )}
    </div>
  );
}
