
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { Zap, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitOptimizerProps {
  circuit: Gate[];
  onOptimizedCircuit: (gates: Gate[]) => void;
}

interface OptimizationSuggestion {
  type: 'gate_reduction' | 'gate_cancellation' | 'gate_commutation';
  description: string;
  impact: 'high' | 'medium' | 'low';
  gatesAffected: string[];
}

export function CircuitOptimizer({ circuit, onOptimizedCircuit }: CircuitOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);

  const analyzeCircuit = () => {
    const newSuggestions: OptimizationSuggestion[] = [];
    
    // Check for consecutive identical gates (cancellation)
    for (let i = 0; i < circuit.length - 1; i++) {
      const current = circuit[i];
      const next = circuit[i + 1];
      
      if (current.qubit === next.qubit && current.type === next.type && 
          ['X', 'Y', 'Z', 'H'].includes(current.type)) {
        newSuggestions.push({
          type: 'gate_cancellation',
          description: `Two consecutive ${current.type} gates cancel each other`,
          impact: 'high',
          gatesAffected: [current.id, next.id]
        });
      }
    }

    // Check for redundant identity operations
    const identityGates = circuit.filter(g => g.type === 'I');
    if (identityGates.length > 0) {
      newSuggestions.push({
        type: 'gate_reduction',
        description: `${identityGates.length} identity gates can be removed`,
        impact: 'medium',
        gatesAffected: identityGates.map(g => g.id)
      });
    }

    // Check for gate commutation opportunities
    for (let i = 0; i < circuit.length - 1; i++) {
      const current = circuit[i];
      const next = circuit[i + 1];
      
      if (current.qubit !== next.qubit && 
          ['H', 'X', 'Y', 'Z'].includes(current.type) && 
          ['H', 'X', 'Y', 'Z'].includes(next.type)) {
        newSuggestions.push({
          type: 'gate_commutation',
          description: `Gates on qubits ${current.qubit} and ${next.qubit} can be reordered for better parallelization`,
          impact: 'low',
          gatesAffected: [current.id, next.id]
        });
      }
    }

    setSuggestions(newSuggestions);
    return newSuggestions;
  };

  const optimizeCircuit = async () => {
    setIsOptimizing(true);
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let optimizedCircuit = [...circuit];
      const suggestions = analyzeCircuit();
      
      // Apply optimizations
      suggestions.forEach(suggestion => {
        if (suggestion.type === 'gate_cancellation') {
          // Remove pairs of canceling gates
          optimizedCircuit = optimizedCircuit.filter(
            gate => !suggestion.gatesAffected.includes(gate.id)
          );
        } else if (suggestion.type === 'gate_reduction') {
          // Remove identity gates
          optimizedCircuit = optimizedCircuit.filter(
            gate => gate.type !== 'I'
          );
        }
      });

      onOptimizedCircuit(optimizedCircuit);
      
      const gatesRemoved = circuit.length - optimizedCircuit.length;
      toast.success(`Circuit optimized! Removed ${gatesRemoved} redundant gates.`);
      
    } catch (error) {
      toast.error('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  React.useEffect(() => {
    if (circuit.length > 0) {
      analyzeCircuit();
    }
  }, [circuit]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (circuit.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Circuit Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Add gates to your circuit to see optimization suggestions
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Auto-Optimization
          <Badge variant="secondary" className="ml-2">
            {circuit.length} gates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Optimization Button */}
        <Button
          onClick={optimizeCircuit}
          disabled={isOptimizing || suggestions.length === 0}
          className="w-full neon-border"
          variant="outline"
        >
          {isOptimizing ? (
            <>
              <Settings className="w-4 h-4 mr-2 animate-spin" />
              Optimizing Circuit...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Optimize Circuit ({suggestions.length} suggestions)
            </>
          )}
        </Button>

        {/* Optimization Suggestions */}
        {suggestions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-semibold text-quantum-particle mb-3 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                Optimization Opportunities
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant={getImpactBadge(suggestion.impact)}>
                        {suggestion.impact} impact
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {suggestion.gatesAffected.length} gates
                      </span>
                    </div>
                    <p className="text-xs text-quantum-particle">
                      {suggestion.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {suggestions.length === 0 && (
          <div className="text-center text-quantum-glow py-4">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Circuit is already optimized!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
