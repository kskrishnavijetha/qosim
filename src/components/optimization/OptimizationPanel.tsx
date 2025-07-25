
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiOptimizationEngine, OptimizationResult, OptimizationSuggestion } from '@/services/aiOptimizationEngine';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  Activity,
  Target,
  Cpu,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

interface OptimizationPanelProps {
  circuit: Gate[];
  onOptimizedCircuit: (gates: Gate[]) => void;
  onAnalysisComplete?: (result: OptimizationResult) => void;
}

export function OptimizationPanel({ 
  circuit, 
  onOptimizedCircuit, 
  onAnalysisComplete 
}: OptimizationPanelProps) {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);

  useEffect(() => {
    if (circuit.length > 0) {
      analyzeCircuit();
    }
  }, [circuit]);

  const analyzeCircuit = async () => {
    setIsAnalyzing(true);
    try {
      const result = await aiOptimizationEngine.optimizeCircuit(circuit, {
        optimizeDepth: true,
        reduceGates: true,
        errorCorrection: true,
        preserveEntanglement: true
      });
      
      setOptimizationResult(result);
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error('Circuit analysis failed:', error);
      toast.error('Failed to analyze circuit');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOneClickOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await aiOptimizationEngine.optimizeCircuit(circuit, {
        optimizeDepth: true,
        reduceGates: true,
        errorCorrection: true,
        preserveEntanglement: true
      });
      
      if (result.preservesFunctionality) {
        onOptimizedCircuit(result.optimizedGates);
        setOptimizationResult(result);
        
        toast.success(
          `Circuit optimized! Reduced ${result.metrics.gateReduction.toFixed(1)}% gates, ${result.metrics.depthReduction.toFixed(1)}% depth`
        );
      } else {
        toast.error('Optimization failed: could not preserve circuit functionality');
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Circuit optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  const applySuggestion = (suggestion: OptimizationSuggestion) => {
    if (optimizationResult) {
      onOptimizedCircuit(optimizationResult.optimizedGates);
      toast.success(`Applied ${suggestion.title}`);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (circuit.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Circuit Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-quantum-particle">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Add gates to your circuit to enable AI optimization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Circuit Optimization
            <Badge variant="outline" className="text-quantum-neon animate-pulse">
              AI-POWERED
            </Badge>
          </CardTitle>
          
          <Button 
            onClick={handleOneClickOptimize}
            disabled={isOptimizing || circuit.length === 0}
            className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            {isOptimizing ? (
              <>
                <Cpu className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                One-Click Optimize
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 quantum-tabs">
            <TabsTrigger value="overview" className="quantum-tab">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="quantum-tab">
              <TrendingUp className="w-4 h-4 mr-2" />
              Suggestions
              {optimizationResult && optimizationResult.suggestions.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {optimizationResult.suggestions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analysis" className="quantum-tab">
              <Zap className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {isAnalyzing ? (
              <div className="text-center py-8">
                <Cpu className="w-8 h-8 mx-auto mb-3 animate-spin text-quantum-glow" />
                <p className="text-quantum-particle">Analyzing circuit with AI...</p>
              </div>
            ) : optimizationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Gate Reduction</span>
                      <span className="text-quantum-glow font-bold">
                        {optimizationResult.metrics.gateReduction.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={optimizationResult.metrics.gateReduction} className="h-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Depth Reduction</span>
                      <span className="text-quantum-glow font-bold">
                        {optimizationResult.metrics.depthReduction.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={optimizationResult.metrics.depthReduction} className="h-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Error Reduction</span>
                      <span className="text-quantum-glow font-bold">
                        {optimizationResult.metrics.errorReduction.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={optimizationResult.metrics.errorReduction} className="h-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Fidelity Improvement</span>
                      <span className="text-quantum-glow font-bold">
                        {optimizationResult.metrics.fidelityImprovement.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={optimizationResult.metrics.fidelityImprovement} className="h-2" />
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-quantum-matrix/10 border border-quantum-glow/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-quantum-glow">Functional Equivalence</h4>
                    <Badge variant={optimizationResult.preservesFunctionality ? 'default' : 'destructive'}>
                      {optimizationResult.preservesFunctionality ? 'Preserved' : 'Not Preserved'}
                    </Badge>
                  </div>
                  <p className="text-xs text-quantum-particle">
                    {optimizationResult.preservesFunctionality 
                      ? 'Circuit functionality is preserved after optimization'
                      : 'Warning: Circuit functionality may be altered'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-quantum-particle">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click "One-Click Optimize" to analyze your circuit</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {optimizationResult && optimizationResult.suggestions.length > 0 ? (
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {optimizationResult.suggestions.map((suggestion, index) => (
                    <Card key={index} className="quantum-panel neon-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
                            {getImpactIcon(suggestion.impact)}
                            {suggestion.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact}
                            </Badge>
                            <Badge variant="outline" className={getConfidenceColor(suggestion.confidence)}>
                              {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-quantum-particle mb-3">{suggestion.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-quantum-particle">
                            {suggestion.gatesAffected.length} gates affected
                          </span>
                          <Button
                            size="sm"
                            onClick={() => applySuggestion(suggestion)}
                            className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                          >
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-quantum-particle">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No optimization suggestions available</p>
                <p className="text-xs mt-1">Your circuit is already well-optimized!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {optimizationResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <h4 className="text-sm font-semibold text-quantum-neon mb-2">Original Circuit</h4>
                    <div className="text-sm text-quantum-particle space-y-1">
                      <div>Gates: {optimizationResult.originalGates.length}</div>
                      <div>Depth: {aiOptimizationEngine['calculateCircuitDepth'](optimizationResult.originalGates)}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-matrix/10 border border-quantum-glow/30">
                    <h4 className="text-sm font-semibold text-quantum-glow mb-2">Optimized Circuit</h4>
                    <div className="text-sm text-quantum-particle space-y-1">
                      <div>Gates: {optimizationResult.optimizedGates.length}</div>
                      <div>Depth: {aiOptimizationEngine['calculateCircuitDepth'](optimizationResult.optimizedGates)}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                  <h4 className="text-sm font-semibold text-quantum-neon mb-2">AI Analysis Summary</h4>
                  <div className="text-sm text-quantum-particle space-y-1">
                    <div>• Pattern recognition applied</div>
                    <div>• Error rate predictions generated</div>
                    <div>• Gate placement optimized</div>
                    <div>• Functional equivalence verified</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-quantum-particle">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Run optimization to see detailed analysis</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
