import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Share2, RotateCcw, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuantumResultsDisplay } from '@/components/quantum/QuantumResultsDisplay';
import { BlochSphereVisualization } from '@/components/quantum/BlochSphereVisualization';
import { ProbabilityHistogram } from '@/components/visualization/ProbabilityHistogram';
import { QuantumStateHeatmap } from '@/components/visualization/QuantumStateHeatmap';
import { EnhancedEntanglementVisualization } from '@/components/simulation/EnhancedEntanglementVisualization';

interface QuantumResultsPageProps {
  results: any;
  onBack: () => void;
  onRerun: () => void;
  circuit?: any;
}

export const QuantumResultsPage: React.FC<QuantumResultsPageProps> = ({
  results,
  onBack,
  onRerun,
  circuit
}) => {
  const { toast } = useToast();

  if (!results) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Editor
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quantum Simulation Results</h1>
              <p className="text-sm text-muted-foreground">
                Circuit: {circuit?.name || 'Unnamed Circuit'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">No results to display.</p>
        </div>
      </div>
    );
  }

  if (!results.success) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Editor
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quantum Simulation Results</h1>
              <p className="text-sm text-muted-foreground">
                Circuit: {circuit?.name || 'Unnamed Circuit'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Simulation failed. Check your circuit and try again.</p>
        </div>
      </div>
    );
  }

  const handleCopyResults = () => {
    const resultsText = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(resultsText);
    toast({
      title: "Results copied",
      description: "Quantum simulation results copied to clipboard",
    });
  };

  const handleDownloadResults = () => {
    const resultsText = JSON.stringify(results, null, 2);
    const blob = new Blob([resultsText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    toast({
      title: "Share feature",
      description: "Sharing functionality coming soon!",
    });
  };

  // Safely extract probability data with proper typing
  const getProbabilityData = () => {
    if (!results?.probabilities) return [];
    
    return Object.entries(results.probabilities).map(([state, prob]) => ({
      state,
      probability: typeof prob === 'number' ? prob : 0
    }));
  };

  // Safely extract state vector data with proper typing
  const getStateVectorData = () => {
    if (!results?.stateVector) return [];
    
    return results.stateVector.map((amplitude: any, index: number) => {
      const real = typeof amplitude?.real === 'number' ? amplitude.real : 0;
      const imag = typeof amplitude?.imag === 'number' ? amplitude.imag : 0;
      return {
        state: `|${index.toString(2).padStart(Math.ceil(Math.log2(results.stateVector.length)), '0')}⟩`,
        real,
        imag,
        magnitude: Math.sqrt(real * real + imag * imag)
      };
    });
  };

  // Get execution metrics with proper typing
  const getExecutionMetrics = () => {
    const executionTime = typeof results?.executionTime === 'number' ? results.executionTime : 0;
    const memoryUsage = typeof results?.memoryUsage === 'number' ? results.memoryUsage : 0;
    const circuitDepth = typeof results?.circuitDepth === 'number' ? results.circuitDepth : 0;
    const gateCount = typeof results?.gateCount === 'number' ? results.gateCount : 0;
    
    return {
      executionTime,
      memoryUsage,
      circuitDepth,
      gateCount
    };
  };

  const probabilityData = getProbabilityData();
  const stateVectorData = getStateVectorData();
  const metrics = getExecutionMetrics();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Editor
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quantum Simulation Results</h1>
            <p className="text-sm text-muted-foreground">
              Circuit: {circuit?.name || 'Unnamed Circuit'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyResults}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadResults}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={onRerun}>
            <Play className="w-4 h-4 mr-2" />
            Re-run
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-4 p-4">
          {/* Left Panel - Results Overview */}
          <div className="col-span-4 space-y-4">
            {/* Execution Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Execution Summary
                  <Badge variant={results?.success ? 'default' : 'destructive'}>
                    {results?.success ? 'Success' : 'Failed'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Execution Time</p>
                    <p className="font-mono">{metrics.executionTime}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Memory Usage</p>
                    <p className="font-mono">{metrics.memoryUsage}MB</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Circuit Depth</p>
                    <p className="font-mono">{metrics.circuitDepth}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gate Count</p>
                    <p className="font-mono">{metrics.gateCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurement Results */}
            <Card>
              <CardHeader>
                <CardTitle>Measurement Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {probabilityData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <span className="font-mono text-sm">{item.state}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-background rounded overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${item.probability * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-sm min-w-[60px] text-right">
                            {(item.probability * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* State Vector Data */}
            {stateVectorData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>State Vector</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-1 font-mono text-sm">
                      {stateVectorData.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-1">
                          <span>{item.state}</span>
                          <span>
                            {item.real.toFixed(3)} + {item.imag.toFixed(3)}i
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center Panel - Visualizations */}
          <div className="col-span-5 space-y-4">
            {/* Probability Histogram */}
            <Card>
              <CardHeader>
                <CardTitle>Probability Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ProbabilityHistogram data={probabilityData} />
                </div>
              </CardContent>
            </Card>

            {/* Quantum State Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Quantum State Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <QuantumStateHeatmap data={stateVectorData} />
                </div>
              </CardContent>
            </Card>

            {/* Entanglement Visualization */}
            {results?.entanglement && (
              <Card>
                <CardHeader>
                  <CardTitle>Entanglement Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <EnhancedEntanglementVisualization 
                      entanglementData={results.entanglement}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Advanced Visualizations */}
          <div className="col-span-3 space-y-4">
            {/* Bloch Sphere */}
            <Card>
              <CardHeader>
                <CardTitle>Bloch Sphere</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <BlochSphereVisualization 
                    stateVector={results?.stateVector}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quantum Results Display */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-auto">
                  <QuantumResultsDisplay results={results} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
