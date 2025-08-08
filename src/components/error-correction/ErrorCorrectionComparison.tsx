
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface CodePerformance {
  dimension: '2D' | '3D' | '4D';
  logicalErrorRate: number;
  physicalErrorRate: number;
  threshold: number;
  decodingTime: number;
  resourceOverhead: number;
  stabilizers: number;
  physicalQubits: number;
  logicalQubits: number;
}

interface ComparisonMetrics {
  errorSuppression: number;
  faultToleranceLevel: number;
  scalability: number;
  practicalImplementation: number;
}

export function ErrorCorrectionComparison() {
  const [activeCode, setActiveCode] = useState<'2D' | '3D' | '4D'>('4D');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [performanceData, setPerformanceData] = useState<CodePerformance[]>([
    {
      dimension: '2D',
      logicalErrorRate: 0.001,
      physicalErrorRate: 0.01,
      threshold: 0.0109,
      decodingTime: 100,
      resourceOverhead: 1.0,
      stabilizers: 18,
      physicalQubits: 25,
      logicalQubits: 1
    },
    {
      dimension: '3D',
      logicalErrorRate: 0.0001,
      physicalErrorRate: 0.01,
      threshold: 0.0307,
      decodingTime: 500,
      resourceOverhead: 2.5,
      stabilizers: 125,
      physicalQubits: 216,
      logicalQubits: 1
    },
    {
      dimension: '4D',
      logicalErrorRate: 0.00001,
      physicalErrorRate: 0.01,
      threshold: 0.0500,
      decodingTime: 2000,
      resourceOverhead: 5.0,
      stabilizers: 625,
      physicalQubits: 1296,
      logicalQubits: 1
    }
  ]);

  const [comparisonMetrics] = useState<Record<string, ComparisonMetrics>>({
    '2D': {
      errorSuppression: 70,
      faultToleranceLevel: 60,
      scalability: 90,
      practicalImplementation: 95
    },
    '3D': {
      errorSuppression: 85,
      faultToleranceLevel: 80,
      scalability: 70,
      practicalImplementation: 70
    },
    '4D': {
      errorSuppression: 95,
      faultToleranceLevel: 95,
      scalability: 50,
      practicalImplementation: 40
    }
  });

  const runComparison = async () => {
    setSimulationRunning(true);
    
    // Simulate running all three codes
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setPerformanceData(prev => prev.map(code => ({
        ...code,
        logicalErrorRate: code.logicalErrorRate * (0.95 + Math.random() * 0.1),
        decodingTime: code.decodingTime * (0.9 + Math.random() * 0.2)
      })));
    }
    
    setSimulationRunning(false);
  };

  const renderLatticeVisualization = (dimension: '2D' | '3D' | '4D') => {
    switch (dimension) {
      case '2D':
        return (
          <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls />
            {/* 2D Surface Code */}
            {Array.from({ length: 5 }, (_, x) =>
              Array.from({ length: 5 }, (_, y) => (
                <Box
                  key={`2d-${x}-${y}`}
                  position={[x - 2, y - 2, 0]}
                  args={[0.8, 0.8, 0.1]}
                >
                  <meshStandardMaterial color="#00ff88" transparent opacity={0.7} />
                </Box>
              ))
            )}
          </Canvas>
        );
      
      case '3D':
        return (
          <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls />
            {/* 3D Surface Code */}
            {Array.from({ length: 4 }, (_, x) =>
              Array.from({ length: 4 }, (_, y) =>
                Array.from({ length: 4 }, (_, z) => (
                  <Box
                    key={`3d-${x}-${y}-${z}`}
                    position={[x - 1.5, y - 1.5, z - 1.5]}
                    args={[0.6, 0.6, 0.6]}
                  >
                    <meshStandardMaterial color="#0088ff" transparent opacity={0.6} />
                  </Box>
                ))
              )
            )}
          </Canvas>
        );
      
      case '4D':
        return (
          <Canvas camera={{ position: [10, 10, 10], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls />
            {/* 4D Toric Code - showing time slices */}
            {Array.from({ length: 3 }, (_, t) =>
              Array.from({ length: 3 }, (_, x) =>
                Array.from({ length: 3 }, (_, y) =>
                  Array.from({ length: 3 }, (_, z) => (
                    <Box
                      key={`4d-${t}-${x}-${y}-${z}`}
                      position={[x - 1 + t * 4, y - 1, z - 1]}
                      args={[0.4, 0.4, 0.4]}
                    >
                      <meshStandardMaterial 
                        color={`hsl(${t * 60}, 70%, 60%)`} 
                        transparent 
                        opacity={0.8} 
                      />
                    </Box>
                  ))
                )
              )
            )}
            {/* Time dimension indicators */}
            {Array.from({ length: 3 }, (_, t) => (
              <Line
                key={`time-${t}`}
                points={[new Vector3(t * 4, -2, 0), new Vector3(t * 4, 2, 0)]}
                color="#ffff00"
                lineWidth={2}
              />
            ))}
          </Canvas>
        );
      
      default:
        return null;
    }
  };

  const currentData = performanceData.find(d => d.dimension === activeCode);
  const currentMetrics = comparisonMetrics[activeCode];

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-quantum-glow">
          Quantum Error Correction Comparison
        </h2>
        <Button
          onClick={runComparison}
          disabled={simulationRunning}
          className="bg-quantum-neon/20 hover:bg-quantum-neon/30 text-quantum-glow border-quantum-neon/50"
        >
          {simulationRunning ? 'Simulating...' : 'Run Comparison'}
        </Button>
      </div>

      <Tabs value={activeCode} onValueChange={(value) => setActiveCode(value as '2D' | '3D' | '4D')}>
        <TabsList className="grid w-full grid-cols-3 bg-quantum-dark border-quantum-neon/30">
          <TabsTrigger value="2D" className="data-[state=active]:bg-quantum-neon/20 text-quantum-text">
            2D Surface Code
          </TabsTrigger>
          <TabsTrigger value="3D" className="data-[state=active]:bg-quantum-neon/20 text-quantum-text">
            3D Surface Code
          </TabsTrigger>
          <TabsTrigger value="4D" className="data-[state=active]:bg-quantum-neon/20 text-quantum-text">
            4D Toric Code
          </TabsTrigger>
        </TabsList>

        {(['2D', '3D', '4D'] as const).map((dimension) => (
          <TabsContent key={dimension} value={dimension} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
              {/* Visualization */}
              <Card className="bg-quantum-dark border-quantum-neon/30">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">
                    {dimension} Code Lattice Structure
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
                      {performanceData.find(d => d.dimension === dimension)?.physicalQubits} Physical Qubits
                    </Badge>
                    <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
                      {performanceData.find(d => d.dimension === dimension)?.stabilizers} Stabilizers
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-120px)]">
                  {renderLatticeVisualization(dimension)}
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <Card className="bg-quantum-dark border-quantum-neon/30">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentData && (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-quantum-text">Logical Error Rate</span>
                            <span className="text-quantum-neon">
                              {currentData.logicalErrorRate.toExponential(2)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-quantum-text">Error Threshold</span>
                            <span className="text-quantum-neon">
                              {(currentData.threshold * 100).toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-quantum-text">Decoding Time</span>
                            <span className="text-quantum-neon">
                              {currentData.decodingTime.toFixed(0)}ms
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-quantum-text">Resource Overhead</span>
                            <span className="text-quantum-neon">
                              {currentData.resourceOverhead.toFixed(1)}×
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-quantum-dark border-quantum-neon/30">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow">Capability Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentMetrics && (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-quantum-text">Error Suppression</span>
                            <span className="text-quantum-neon">{currentMetrics.errorSuppression}%</span>
                          </div>
                          <Progress value={currentMetrics.errorSuppression} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-quantum-text">Fault Tolerance</span>
                            <span className="text-quantum-neon">{currentMetrics.faultToleranceLevel}%</span>
                          </div>
                          <Progress value={currentMetrics.faultToleranceLevel} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-quantum-text">Scalability</span>
                            <span className="text-quantum-neon">{currentMetrics.scalability}%</span>
                          </div>
                          <Progress value={currentMetrics.scalability} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-quantum-text">Implementation</span>
                            <span className="text-quantum-neon">{currentMetrics.practicalImplementation}%</span>
                          </div>
                          <Progress value={currentMetrics.practicalImplementation} className="h-2" />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Comparison Summary */}
      <Card className="bg-quantum-dark border-quantum-neon/30">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Side-by-Side Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-quantum-neon/30">
                  <th className="text-left p-2 text-quantum-text">Metric</th>
                  <th className="text-center p-2 text-quantum-neon">2D Surface</th>
                  <th className="text-center p-2 text-quantum-neon">3D Surface</th>
                  <th className="text-center p-2 text-quantum-neon">4D Toric</th>
                </tr>
              </thead>
              <tbody className="text-quantum-text">
                <tr className="border-b border-quantum-neon/10">
                  <td className="p-2">Physical Qubits</td>
                  <td className="text-center p-2">{performanceData[0].physicalQubits}</td>
                  <td className="text-center p-2">{performanceData[1].physicalQubits}</td>
                  <td className="text-center p-2">{performanceData[2].physicalQubits}</td>
                </tr>
                <tr className="border-b border-quantum-neon/10">
                  <td className="p-2">Error Threshold</td>
                  <td className="text-center p-2">{(performanceData[0].threshold * 100).toFixed(1)}%</td>
                  <td className="text-center p-2">{(performanceData[1].threshold * 100).toFixed(1)}%</td>
                  <td className="text-center p-2">{(performanceData[2].threshold * 100).toFixed(1)}%</td>
                </tr>
                <tr className="border-b border-quantum-neon/10">
                  <td className="p-2">Logical Error Rate</td>
                  <td className="text-center p-2">{performanceData[0].logicalErrorRate.toExponential(1)}</td>
                  <td className="text-center p-2">{performanceData[1].logicalErrorRate.toExponential(1)}</td>
                  <td className="text-center p-2">{performanceData[2].logicalErrorRate.toExponential(1)}</td>
                </tr>
                <tr>
                  <td className="p-2">Decoding Time</td>
                  <td className="text-center p-2">{performanceData[0].decodingTime}ms</td>
                  <td className="text-center p-2">{performanceData[1].decodingTime}ms</td>
                  <td className="text-center p-2">{performanceData[2].decodingTime}ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
