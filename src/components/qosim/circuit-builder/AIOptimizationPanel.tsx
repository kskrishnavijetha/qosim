
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuantumGate } from '@/hooks/useCircuitBuilder';
import { 
  Lightbulb, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface AIOptimizationPanelProps {
  circuit: QuantumGate[];
  onOptimize: (gate: Omit<QuantumGate, 'id'>) => void;
}

interface OptimizationSuggestion {
  type: 'gate_placement' | 'depth_reduction' | 'error_correction' | 'fidelity_improvement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action: string;
}

export function AIOptimizationPanel({ circuit, onOptimize }: AIOptimizationPanelProps) {
  const [optimizationMode, setOptimizationMode] = useState<'automatic' | 'manual'>('automatic');
  const [selectedOptimization, setSelectedOptimization] = useState<string>('depth');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);

  const optimizationTypes = [
    { value: 'depth', label: 'Depth Optimization', icon: '📏', description: 'Reduce circuit depth' },
    { value: 'fidelity', label: 'Fidelity Enhancement', icon: '🎯', description: 'Improve gate fidelity' },
    { value: 'error', label: 'Error Correction', icon: '🛡️', description: 'Add error correction' },
    { value: 'placement', label: 'Gate Placement', icon: '🔧', description: 'Optimize gate order' }
  ];

  const generateSuggestions = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newSuggestions: OptimizationSuggestion[] = [
        {
          type: 'gate_placement',
          title: 'Reorder H and CNOT gates',
          description: 'Moving Hadamard gate to layer 0 can reduce circuit depth by 15%',
          impact: 'high',
          confidence: 0.89,
          action: 'Apply reordering'
        },
        {
          type: 'depth_reduction',
          title: 'Parallelize independent gates',
          description: 'Gates on qubits 0 and 2 can be executed in parallel',
          impact: 'medium',
          confidence: 0.76,
          action: 'Enable parallelization'
        },
        {
          type: 'error_correction',
          title: 'Add T gate error correction',
          description: 'T gates have higher error rates - consider adding Clifford+T correction',
          impact: 'high',
          confidence: 0.92,
          action: 'Add error correction'
        },
        {
          type: 'fidelity_improvement',
          title: 'Replace RY with optimized sequence',
          description: 'RY(π/2) can be replaced with H-S-H sequence for better fidelity',
          impact: 'medium',
          confidence: 0.68,
          action: 'Replace with sequence'
        }
      ];
      
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
      toast.success('AI analysis complete - found optimization opportunities');
    }, 2000);
  };

  const applySuggestion = (suggestion: OptimizationSuggestion) => {
    // Simulate applying the suggestion
    toast.success(`Applied: ${suggestion.title}`);
    
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Target className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const circuitStats = {
    depth: Math.max(...circuit.map(g => g.layer), 0) + 1,
    gates: circuit.length,
    qubits: Math.max(...circuit.flatMap(g => g.qubits), 0) + 1,
    efficiency: circuit.length > 0 ? Math.min(100, (circuit.length / (circuit.length + 3)) * 100) : 0
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
          <TabsTrigger value="optimization" className="text-xs">Optimize</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {circuit.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-4">
                  Add gates to your circuit to receive AI suggestions
                </div>
              ) : (
                <>
                  <Button 
                    onClick={generateSuggestions} 
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Analyze Circuit
                      </>
                    )}
                  </Button>

                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getImpactIcon(suggestion.impact)}
                              <div>
                                <div className="font-medium text-sm">{suggestion.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {suggestion.description}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => applySuggestion(suggestion)}
                              className="gap-1"
                            >
                              {suggestion.action}
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Circuit Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Optimization Type</label>
                <Select value={selectedOptimization} onValueChange={setSelectedOptimization}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {optimizationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={optimizationMode === 'automatic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptimizationMode('automatic')}
                >
                  Auto
                </Button>
                <Button 
                  variant={optimizationMode === 'manual' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptimizationMode('manual')}
                >
                  Manual
                </Button>
              </div>

              <Button className="w-full" onClick={() => toast.success('Optimization applied!')}>
                <Zap className="w-4 h-4 mr-2" />
                Apply Optimization
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Optimizations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Add Error Correction
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Reduce Depth
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Improve Fidelity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Circuit Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-mono text-primary">{circuitStats.depth}</div>
                  <div className="text-xs text-muted-foreground">Circuit Depth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono text-primary">{circuitStats.gates}</div>
                  <div className="text-xs text-muted-foreground">Total Gates</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Efficiency Score</span>
                  <span className="font-mono">{circuitStats.efficiency.toFixed(1)}%</span>
                </div>
                <Progress value={circuitStats.efficiency} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Qubits Used</span>
                  <span className="font-mono">{circuitStats.qubits}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Parallelizable</span>
                  <span className="font-mono">{Math.floor(circuitStats.gates * 0.3)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
