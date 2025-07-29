
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisualizationStep {
  id: string;
  title: string;
  description: string;
  circuitState: any;
  blochSphereData: BlochSphereData[];
  entanglementMatrix: number[][];
  measurementStats: MeasurementStats;
  gateHighlight?: string;
}

interface BlochSphereData {
  qubit: number;
  x: number;
  y: number;
  z: number;
  phase: number;
}

interface MeasurementStats {
  probabilities: { [state: string]: number };
  fidelity: number;
  entropy: number;
}

interface InteractiveAlgorithmVisualizerProps {
  algorithm: 'grover' | 'shor' | 'qft' | 'vqe' | 'qaoa' | 'bell' | 'error-correction';
  steps: VisualizationStep[];
  onStepChange?: (step: number) => void;
  className?: string;
}

export function InteractiveAlgorithmVisualizer({ 
  algorithm, 
  steps, 
  onStepChange,
  className 
}: InteractiveAlgorithmVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [showEntanglement, setShowEntanglement] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, steps.length]);

  useEffect(() => {
    onStepChange?.(currentStep);
    drawVisualization();
  }, [currentStep, selectedQubit, showEntanglement, onStepChange]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const step = steps[currentStep];
    if (!step) return;

    // Draw Bloch spheres
    drawBlochSpheres(ctx, step.blochSphereData);
    
    // Draw entanglement visualization
    if (showEntanglement && step.entanglementMatrix) {
      drawEntanglementMatrix(ctx, step.entanglementMatrix);
    }
  };

  const drawBlochSpheres = (ctx: CanvasRenderingContext2D, blochData: BlochSphereData[]) => {
    const sphereRadius = 60;
    const sphereSpacing = 150;
    const startX = 80;
    const startY = 100;

    blochData.forEach((sphere, index) => {
      const centerX = startX + (index % 4) * sphereSpacing;
      const centerY = startY + Math.floor(index / 4) * sphereSpacing;

      // Draw sphere outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = index === selectedQubit ? '#00ff88' : '#666';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axes
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      
      // X axis
      ctx.beginPath();
      ctx.moveTo(centerX - sphereRadius, centerY);
      ctx.lineTo(centerX + sphereRadius, centerY);
      ctx.stroke();
      
      // Y axis
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - sphereRadius);
      ctx.lineTo(centerX, centerY + sphereRadius);
      ctx.stroke();

      // Draw state vector
      const vectorX = centerX + sphere.x * sphereRadius * 0.8;
      const vectorY = centerY - sphere.y * sphereRadius * 0.8;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(vectorX, vectorY);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw state point
      ctx.beginPath();
      ctx.arc(vectorX, vectorY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ff88';
      ctx.fill();

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Q${sphere.qubit}`, centerX, centerY + sphereRadius + 15);
    });
  };

  const drawEntanglementMatrix = (ctx: CanvasRenderingContext2D, matrix: number[][]) => {
    const cellSize = 20;
    const startX = 500;
    const startY = 50;

    matrix.forEach((row, i) => {
      row.forEach((value, j) => {
        const x = startX + j * cellSize;
        const y = startY + i * cellSize;
        
        // Color based on entanglement strength
        const intensity = Math.abs(value);
        const color = `rgba(0, 255, 136, ${intensity})`;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
        
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, y, cellSize, cellSize);
      });
    });

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText('Entanglement Matrix', startX, startY - 10);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="quantum-panel">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {algorithm.toUpperCase()} Algorithm Visualizer
            </CardTitle>
            <Badge variant="outline" className="text-quantum-glow">
              Step {currentStep + 1} / {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visualization Canvas */}
            <div className="space-y-4">
              <div className="bg-quantum-void rounded-lg p-4 border border-quantum-neon/20">
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStepBackward}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStepForward}
                  disabled={currentStep === steps.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={(value) => setPlaybackSpeed(value[0])}
                  max={3}
                  min={0.5}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-sm text-quantum-glow">{playbackSpeed}x</span>
              </div>
            </div>

            {/* Step Information */}
            <div className="space-y-4">
              <div className="bg-quantum-matrix rounded-lg p-4">
                <h3 className="font-semibold text-quantum-glow mb-2">
                  {currentStepData?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentStepData?.description}
                </p>
              </div>

              <Tabs defaultValue="measurements" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="measurements">Measurements</TabsTrigger>
                  <TabsTrigger value="entanglement">Entanglement</TabsTrigger>
                  <TabsTrigger value="fidelity">Fidelity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="measurements" className="space-y-2">
                  <ScrollArea className="h-48">
                    {currentStepData?.measurementStats.probabilities && 
                      Object.entries(currentStepData.measurementStats.probabilities).map(([state, prob]) => (
                        <div key={state} className="flex justify-between items-center p-2 bg-quantum-void rounded">
                          <span className="font-mono text-sm">|{state}⟩</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-quantum-matrix rounded-full h-2">
                              <div 
                                className="bg-quantum-glow h-2 rounded-full transition-all duration-300"
                                style={{ width: `${prob * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-quantum-neon">{(prob * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))
                    }
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="entanglement" className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showEntanglement"
                        checked={showEntanglement}
                        onChange={(e) => setShowEntanglement(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="showEntanglement" className="text-sm">
                        Show entanglement matrix
                      </label>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div>Entropy: {currentStepData?.measurementStats.entropy.toFixed(3)}</div>
                      <div>Max Entanglement: {Math.max(...(currentStepData?.entanglementMatrix.flat() || [0])).toFixed(3)}</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="fidelity" className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>State Fidelity:</span>
                      <span className="text-quantum-glow">
                        {currentStepData?.measurementStats.fidelity.toFixed(3)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-quantum-matrix rounded-full h-2">
                      <div 
                        className="bg-quantum-energy h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStepData?.measurementStats.fidelity || 0) * 100}%` }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
