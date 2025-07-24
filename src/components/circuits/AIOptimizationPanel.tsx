
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIOptimizationEngine, OptimizationSuggestion, CircuitMetrics } from '@/services/aiOptimization';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Target,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface AIOptimizationPanelProps {
  circuit: Gate[];
  onOptimizedCircuit: (gates: Gate[]) => void;
  aiEngine: AIOptimizationEngine;
}

export function AIOptimizationPanel({
  circuit,
  onOptimizedCircuit,
  aiEngine
}: AIOptimizationPanelProps) {
  const [metrics, setMetrics] = useState<CircuitMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
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
      const circuitMetrics = aiEngine.analyzeCircuit(circuit);
      const optimizationSuggestions = await aiEngine.generateOptimizations(circuit);
      
      setMetrics(circuitMetrics);
      setSuggestions(optimizationSuggestions);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    try {
      const optimizedGates = await aiEngine.autoOptimize(circuit);
      onOptimizedCircuit(optimizedGates);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplySuggestion = (suggestion: OptimizationSuggestion) => {
    onOptimizedCircuit(suggestion.optimizedGates);
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-quantum-particle';
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

  return (
    <div className="h-full p-6 space-y-6">
      {/* AI Optimization Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Circuit Optimization
              <Badge variant="outline" className="text-quantum-neon animate-pulse">
                BETA
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={analyzeCircuit}
                disabled={isAnalyzing || circuit.length === 0}
                className="neon-border"
              >
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
              
              <Button 
                onClick={handleAutoOptimize}
                disabled={isOptimizing || suggestions.length === 0}
                className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {circuit.length === 0 && (
          <CardContent>
            <div className="text-center py-8 text-quantum-particle">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Add gates to your circuit to see AI optimization suggestions</p>
            </div>
          </CardContent>
        )}
      </Card>

      {metrics && (
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 quantum-tabs">
            <TabsTrigger value="metrics" className="quantum-tab">
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="quantum-tab">
              <TrendingUp className="w-4 h-4 mr-2" />
              Suggestions
              {suggestions.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {suggestions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preview" className="quantum-tab">
              <Sparkles className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-neon">Circuit Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Total Gates</span>
                      <Badge variant="outline">{metrics.totalGates}</Badge>
                    </div>
                    <Progress value={(metrics.totalGates / 20) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Circuit Depth</span>
                      <Badge variant="outline">{metrics.circuitDepth}</Badge>
                    </div>
                    <Progress value={(metrics.circuitDepth / 10) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Parallelizable</span>
                      <Badge variant="outline" className="text-green-500">
                        {metrics.parallelizableGates}
                      </Badge>
                    </div>
                    <Progress value={(metrics.parallelizableGates / metrics.totalGates) * 100} className="h-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-quantum-particle">Redundant Gates</span>
                      <Badge variant="outline" className="text-red-500">
                        {metrics.redundantGates}
                      </Badge>
                    </div>
                    <Progress value={(metrics.redundantGates / metrics.totalGates) * 100} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-quantum-matrix/10 border border-quantum-glow/30">
                  <h4 className="text-sm font-semibold text-quantum-glow mb-2">Optimization Score</h4>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={Math.max(0, 100 - (metrics.redundantGates / metrics.totalGates) * 100)} 
                      className="h-3 flex-1" 
                    />
                    <span className="text-lg font-bold text-quantum-glow">
                      {Math.round(Math.max(0, 100 - (metrics.redundantGates / metrics.totalGates) * 100))}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-4">
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="quantum-panel neon-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
                          {getImpactIcon(suggestion.impact)}
                          {suggestion.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                            {suggestion.impact} impact
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => setSelectedSuggestion(suggestion)}
                            variant="ghost"
                            className="text-quantum-neon"
                          >
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion)}
                            className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-quantum-particle mb-3">{suggestion.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-quantum-particle">
                        {suggestion.metrics.gateReduction && (
                          <span>-{suggestion.metrics.gateReduction} gates</span>
                        )}
                        {suggestion.metrics.depthReduction && (
                          <span>-{suggestion.metrics.depthReduction} depth</span>
                        )}
                        {suggestion.metrics.parallelization && (
                          <span>+{suggestion.metrics.parallelization} parallel</span>
                        )}
                        {suggestion.metrics.errorReduction && (
                          <span>-{suggestion.metrics.errorReduction}% error</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="quantum-panel neon-border">
                <CardContent className="text-center py-8 text-quantum-particle">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No optimization suggestions available</p>
                  <p className="text-xs mt-1">Your circuit is already well-optimized!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            {selectedSuggestion ? (
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">
                    Preview: {selectedSuggestion.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                      <h4 className="text-sm font-semibold text-quantum-neon mb-2">Before</h4>
                      <div className="text-sm text-quantum-particle">
                        Gates: {circuit.length} | Depth: {metrics.circuitDepth}
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-quantum-matrix/10 border border-quantum-glow/30">
                      <h4 className="text-sm font-semibold text-quantum-glow mb-2">After</h4>
                      <div className="text-sm text-quantum-particle">
                        Gates: {selectedSuggestion.optimizedGates.length} | 
                        Depth: {metrics.circuitDepth - (selectedSuggestion.metrics.depthReduction || 0)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handleApplySuggestion(selectedSuggestion)}
                        className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                      >
                        Apply Optimization
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedSuggestion(null)}
                        className="neon-border"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="quantum-panel neon-border">
                <CardContent className="text-center py-8 text-quantum-particle">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a suggestion to preview the optimization</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
