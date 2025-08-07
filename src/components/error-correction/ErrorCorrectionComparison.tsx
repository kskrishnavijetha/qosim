
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ErrorCorrectionComparisonProps {
  fourDResults: any;
  noiseLevel: number;
  latticeSize: [number, number, number, number];
}

export function ErrorCorrectionComparison({
  fourDResults,
  noiseLevel,
  latticeSize
}: ErrorCorrectionComparisonProps) {
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    generateComparisonData();
  }, [fourDResults, noiseLevel, latticeSize]);

  const generateComparisonData = () => {
    // Simulate 2D and 3D surface code results for comparison
    const timeSteps = Array.from({ length: 10 }, (_, i) => i + 1);
    
    const data = timeSteps.map(step => {
      const baseErrorRate = noiseLevel;
      
      // 4D Toric Code (actual results)
      const fourDFidelity = fourDResults?.timeSteps?.[step - 1]?.fidelity || 
        Math.max(0.5, 1 - baseErrorRate * step * 0.3);
      
      // 3D Surface Code (simulated)
      const threeDFidelity = Math.max(0.4, 1 - baseErrorRate * step * 0.5);
      
      // 2D Surface Code (simulated)
      const twoDFidelity = Math.max(0.2, 1 - baseErrorRate * step * 0.8);
      
      return {
        step,
        '4D Toric Code': fourDFidelity,
        '3D Surface Code': threeDFidelity,
        '2D Surface Code': twoDFidelity,
        '4D Errors': Math.floor((1 - fourDFidelity) * 64),
        '3D Errors': Math.floor((1 - threeDFidelity) * 36),
        '2D Errors': Math.floor((1 - twoDFidelity) * 16)
      };
    });
    
    setComparisonData(data);
    
    // Calculate performance metrics
    const finalData = data[data.length - 1];
    setPerformanceMetrics({
      fidelityComparison: {
        '4D': finalData['4D Toric Code'],
        '3D': finalData['3D Surface Code'],
        '2D': finalData['2D Surface Code']
      },
      errorThreshold: {
        '4D': noiseLevel * 100 < 12 ? 'Below' : 'Above',
        '3D': noiseLevel * 100 < 8 ? 'Below' : 'Above',
        '2D': noiseLevel * 100 < 4 ? 'Below' : 'Above'
      },
      logicalErrorRate: {
        '4D': Math.pow(noiseLevel, 2) * 100,
        '3D': Math.pow(noiseLevel, 1.5) * 100,
        '2D': Math.pow(noiseLevel, 1) * 100
      }
    });
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Error Correction Comparison
        </CardTitle>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-energy">4D</div>
            <div className="text-xs text-muted-foreground">Toric Code</div>
            <Badge variant="outline" className="text-quantum-energy mt-1">
              Topological
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-neon">3D</div>
            <div className="text-xs text-muted-foreground">Surface Code</div>
            <Badge variant="outline" className="text-quantum-neon mt-1">
              Stabilizer
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-particle">2D</div>
            <div className="text-xs text-muted-foreground">Surface Code</div>
            <Badge variant="outline" className="text-quantum-particle mt-1">
              Planar
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="fidelity" className="w-full">
          <TabsList className="grid w-full grid-cols-3 quantum-panel">
            <TabsTrigger value="fidelity">Fidelity Evolution</TabsTrigger>
            <TabsTrigger value="errors">Error Accumulation</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fidelity" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="step" 
                    stroke="#888"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#888"
                    fontSize={12}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #444',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="4D Toric Code" 
                    stroke="#00ff88" 
                    strokeWidth={3}
                    dot={{ fill: '#00ff88', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="3D Surface Code" 
                    stroke="#0088ff" 
                    strokeWidth={2}
                    dot={{ fill: '#0088ff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="2D Surface Code" 
                    stroke="#ff8800" 
                    strokeWidth={2}
                    dot={{ fill: '#ff8800' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="errors" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="step" 
                    stroke="#888"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#888"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid #444',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="4D Errors" fill="#00ff88" />
                  <Bar dataKey="3D Errors" fill="#0088ff" />
                  <Bar dataKey="2D Errors" fill="#ff8800" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            {performanceMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Final Fidelity */}
                <Card className="quantum-panel neon-border p-4">
                  <h4 className="text-sm font-mono text-quantum-glow mb-3">Final Fidelity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">4D Toric:</span>
                      <Badge className="bg-quantum-energy text-black">
                        {(performanceMetrics.fidelityComparison['4D'] * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress 
                      value={performanceMetrics.fidelityComparison['4D'] * 100} 
                      className="h-2" 
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">3D Surface:</span>
                      <Badge variant="outline" className="text-quantum-neon">
                        {(performanceMetrics.fidelityComparison['3D'] * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress 
                      value={performanceMetrics.fidelityComparison['3D'] * 100} 
                      className="h-2" 
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">2D Surface:</span>
                      <Badge variant="outline" className="text-quantum-particle">
                        {(performanceMetrics.fidelityComparison['2D'] * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress 
                      value={performanceMetrics.fidelityComparison['2D'] * 100} 
                      className="h-2" 
                    />
                  </div>
                </Card>
                
                {/* Error Threshold */}
                <Card className="quantum-panel neon-border p-4">
                  <h4 className="text-sm font-mono text-quantum-neon mb-3">Threshold Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>4D (~12%):</span>
                      <Badge 
                        variant={performanceMetrics.errorThreshold['4D'] === 'Below' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {performanceMetrics.errorThreshold['4D']}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>3D (~8%):</span>
                      <Badge 
                        variant={performanceMetrics.errorThreshold['3D'] === 'Below' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {performanceMetrics.errorThreshold['3D']}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>2D (~4%):</span>
                      <Badge 
                        variant={performanceMetrics.errorThreshold['2D'] === 'Below' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {performanceMetrics.errorThreshold['2D']}
                      </Badge>
                    </div>
                  </div>
                </Card>
                
                {/* Logical Error Rate */}
                <Card className="quantum-panel neon-border p-4">
                  <h4 className="text-sm font-mono text-quantum-particle mb-3">Logical Error Rate</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>4D:</span>
                      <span className="text-quantum-energy font-mono">
                        {performanceMetrics.logicalErrorRate['4D'].toFixed(3)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>3D:</span>
                      <span className="text-quantum-neon font-mono">
                        {performanceMetrics.logicalErrorRate['3D'].toFixed(3)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>2D:</span>
                      <span className="text-quantum-particle font-mono">
                        {performanceMetrics.logicalErrorRate['2D'].toFixed(3)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
