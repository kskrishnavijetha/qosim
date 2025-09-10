import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EnhancedSimulationResult } from '@/lib/enhancedQuantumSimulator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Eye, Zap, Activity, TrendingUp } from 'lucide-react';

interface LiveQuantumVisualizerProps {
  simulationResult: EnhancedSimulationResult | null;
  isSimulating: boolean;
  onStepVisualization?: (step: number) => void;
}

interface BlochSphereData {
  qubit: number;
  x: number;
  y: number;
  z: number;
  magnitude: number;
}

export function LiveQuantumVisualizer({ 
  simulationResult, 
  isSimulating, 
  onStepVisualization 
}: LiveQuantumVisualizerProps) {
  const [activeTab, setActiveTab] = useState('probabilities');
  const [animationFrame, setAnimationFrame] = useState(0);
  const [showRealTime, setShowRealTime] = useState(true);

  // Animation loop for real-time updates
  useEffect(() => {
    if (!isSimulating || !showRealTime) return;

    const interval = setInterval(() => {
      setAnimationFrame(frame => frame + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [isSimulating, showRealTime]);

  // Prepare probability data for bar chart
  const prepareProbabilityData = useCallback(() => {
    if (!simulationResult) return [];

    return simulationResult.probabilities
      .map((prob, index) => ({
        state: index.toString(2).padStart(Math.log2(simulationResult.probabilities.length), '0'),
        probability: prob,
        percentage: (prob * 100).toFixed(2)
      }))
      .filter(item => item.probability > 0.001) // Only show significant probabilities
      .slice(0, 16) // Limit display to prevent overcrowding
      .sort((a, b) => b.probability - a.probability);
  }, [simulationResult]);

  // Prepare measurement counts data
  const prepareMeasurementData = useCallback(() => {
    if (!simulationResult) return [];

    return Object.entries(simulationResult.measurementCounts)
      .map(([state, count]) => ({
        state,
        count,
        percentage: ((count / Object.values(simulationResult.measurementCounts).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [simulationResult]);

  // Prepare Bloch sphere data
  const prepareBlochSphereData = useCallback((): BlochSphereData[] => {
    if (!simulationResult) return [];

    return simulationResult.qubitStates.map(qubit => ({
      qubit: qubit.qubit,
      x: qubit.blochVector.x,
      y: qubit.blochVector.y,
      z: qubit.blochVector.z,
      magnitude: Math.sqrt(
        qubit.blochVector.x ** 2 + 
        qubit.blochVector.y ** 2 + 
        qubit.blochVector.z ** 2
      )
    }));
  }, [simulationResult]);

  // Prepare entanglement visualization data
  const prepareEntanglementData = useCallback(() => {
    if (!simulationResult) return [];

    return simulationResult.entanglement.pairs.map(pair => ({
      connection: `q${pair.qubit1}-q${pair.qubit2}`,
      strength: pair.strength,
      percentage: (pair.strength * 100).toFixed(1)
    }));
  }, [simulationResult]);

  // Custom Bloch Sphere component (simplified 2D representation)
  const BlochSphere = ({ data }: { data: BlochSphereData }) => {
    const size = 120;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Project 3D coordinates to 2D
    const projectedX = centerX + (data.x * radius * 0.8);
    const projectedY = centerY - (data.z * radius * 0.8); // Flip Y for screen coordinates

    return (
      <div className="flex flex-col items-center">
        <svg width={size} height={size} className="border border-border rounded-full">
          {/* Sphere outline */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Equator */}
          <ellipse
            cx={centerX}
            cy={centerY}
            rx={radius * 0.8}
            ry={radius * 0.3}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.2"
          />
          
          {/* Meridian */}
          <ellipse
            cx={centerX}
            cy={centerY}
            rx={radius * 0.3}
            ry={radius * 0.8}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.2"
          />
          
          {/* State vector */}
          <line
            x1={centerX}
            y1={centerY}
            x2={projectedX}
            y2={projectedY}
            stroke="hsl(var(--quantum-blue))"
            strokeWidth="2"
          />
          
          {/* State point */}
          <circle
            cx={projectedX}
            cy={projectedY}
            r="4"
            fill="hsl(var(--quantum-blue))"
            stroke="white"
            strokeWidth="1"
          />
          
          {/* Labels */}
          <text x={centerX} y={centerY - radius - 5} textAnchor="middle" className="text-xs fill-foreground">|0⟩</text>
          <text x={centerX} y={centerY + radius + 15} textAnchor="middle" className="text-xs fill-foreground">|1⟩</text>
        </svg>
        
        <div className="mt-2 text-center">
          <Badge variant="outline" className="text-xs">
            q{data.qubit}
          </Badge>
          <div className="text-xs text-muted-foreground mt-1">
            |{data.magnitude.toFixed(2)}|
          </div>
        </div>
      </div>
    );
  };

  if (!simulationResult) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-quantum-glow">
            <Eye className="w-5 h-5" />
            Live Quantum Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Run a simulation to see live quantum state visualization</p>
            {isSimulating && (
              <div className="mt-4">
                <Progress value={animationFrame % 100} className="w-48 mx-auto" />
                <p className="text-sm mt-2">Simulation in progress...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const probabilityData = prepareProbabilityData();
  const measurementData = prepareMeasurementData();
  const blochData = prepareBlochSphereData();
  const entanglementData = prepareEntanglementData();

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-quantum-glow">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Quantum Visualizer
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={simulationResult.validation.isValid ? "default" : "destructive"}>
              {simulationResult.validation.isValid ? 'Valid' : 'Invalid'}
            </Badge>
            <Badge variant="outline">
              Fidelity: {simulationResult.fidelity.toFixed(4)}
            </Badge>
            <Badge variant="outline">
              {simulationResult.executionTime.toFixed(1)}ms
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="bloch">Bloch Spheres</TabsTrigger>
            <TabsTrigger value="entanglement">Entanglement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="probabilities" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">State Probabilities</h4>
              <Badge variant="outline">
                {probabilityData.length} significant states
              </Badge>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={probabilityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="state" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, 'Probability']}
                    labelFormatter={(label) => `State |${label}⟩`}
                  />
                  <Bar dataKey="probability" fill="hsl(var(--quantum-blue))" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {probabilityData.slice(0, 4).map((item, index) => (
                <div key={index} className="p-2 bg-muted rounded">
                  <div className="font-mono">|{item.state}⟩</div>
                  <div className="text-quantum-blue font-medium">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="measurements" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Measurement Counts</h4>
              <Badge variant="outline">
                {Object.values(simulationResult.measurementCounts).reduce((a, b) => a + b, 0)} shots
              </Badge>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={measurementData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="state" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [value, 'Count']}
                    labelFormatter={(label) => `State |${label}⟩`}
                  />
                  <Bar dataKey="count" fill="hsl(var(--quantum-purple))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              {measurementData.slice(0, 3).map((item, index) => (
                <div key={index} className="text-center p-2 bg-muted rounded">
                  <div className="font-mono text-quantum-purple">|{item.state}⟩</div>
                  <div className="font-medium">{item.count} shots</div>
                  <div className="text-muted-foreground">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="bloch" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Qubit States (Bloch Spheres)</h4>
              <Badge variant="outline">
                {blochData.length} qubits
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {blochData.map(data => (
                <BlochSphere key={data.qubit} data={data} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {simulationResult.qubitStates.map(qubit => (
                <div key={qubit.qubit} className="p-3 bg-muted rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Qubit {qubit.qubit}</span>
                    <Badge variant="outline">
                      {(qubit.probability1 * 100).toFixed(1)}% |1⟩
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div>P(|0⟩) = {qubit.probability0.toFixed(4)}</div>
                    <div>P(|1⟩) = {qubit.probability1.toFixed(4)}</div>
                    <div>Phase = {(qubit.phase / Math.PI).toFixed(2)}π</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="entanglement" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Quantum Entanglement</h4>
              <Badge variant="outline">
                Total: {(simulationResult.entanglement.totalEntanglement * 100).toFixed(1)}%
              </Badge>
            </div>
            
            {entanglementData.length > 0 ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={entanglementData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="connection" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Strength']}
                      />
                      <Bar dataKey="strength" fill="hsl(var(--quantum-green))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Entangled Pairs</h5>
                  {simulationResult.entanglement.pairs.map((pair, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span>Qubits {pair.qubit1} ↔ {pair.qubit2}</span>
                      <Badge variant="outline">
                        {(pair.strength * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No significant entanglement detected</p>
                  <p className="text-xs">Add entangling gates (CNOT, TOFFOLI) to create entanglement</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Real-time indicator */}
        {isSimulating && showRealTime && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-quantum-blue">
              <Zap className="w-4 h-4 animate-pulse" />
              Live updating during simulation
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}