
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OptimizationButton } from '@/components/optimization/OptimizationButton';
import { useAIOptimization } from '@/hooks/useAIOptimization';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { Zap, Settings, TrendingUp, AlertCircle, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitOptimizerProps {
  circuit: Gate[];
  onOptimizedCircuit: (gates: Gate[]) => void;
}

export function CircuitOptimizer({ circuit, onOptimizedCircuit }: CircuitOptimizerProps) {
  const { optimizationResult, isOptimizing, optimizeCircuit } = useAIOptimization();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptimize = async () => {
    try {
      const result = await optimizeCircuit(circuit);
      if (result.preservesFunctionality) {
        onOptimizedCircuit(result.optimizedGates);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (circuit.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Circuit Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Add gates to your circuit to enable AI optimization
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI Circuit Optimizer
          <Badge variant="outline" className="text-quantum-glow animate-pulse">
            AI-POWERED
          </Badge>
          <Badge variant="secondary" className="ml-2">
            {circuit.length} gates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* One-Click Optimization */}
        <div className="flex gap-2">
          <OptimizationButton
            circuit={circuit}
            onOptimizedCircuit={onOptimizedCircuit}
            disabled={isOptimizing}
          />
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="neon-border"
          >
            <Settings className="w-4 h-4 mr-2" />
            Advanced
          </Button>
        </div>

        {/* Optimization Results */}
        {optimizationResult && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-particle flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Optimization Results
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                  <div className="text-xs text-quantum-particle">Gate Reduction</div>
                  <div className="text-lg font-bold text-quantum-glow">
                    {optimizationResult.metrics.gateReduction.toFixed(1)}%
                  </div>
                </div>
                
                <div className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                  <div className="text-xs text-quantum-particle">Depth Reduction</div>
                  <div className="text-lg font-bold text-quantum-glow">
                    {optimizationResult.metrics.depthReduction.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {optimizationResult.suggestions.length > 0 && (
                <div className="p-3 bg-quantum-matrix/10 rounded border border-quantum-glow/30">
                  <div className="text-xs text-quantum-neon font-semibold mb-2">
                    AI Suggestions Applied
                  </div>
                  <div className="text-xs text-quantum-particle">
                    {optimizationResult.suggestions.length} optimization(s) applied
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Advanced Options */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-particle">
                Advanced AI Optimization Options
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => optimizeCircuit(circuit, { optimizeDepth: true, reduceGates: false })}
                  className="neon-border"
                >
                  Depth Only
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => optimizeCircuit(circuit, { optimizeDepth: false, reduceGates: true })}
                  className="neon-border"
                >
                  Gates Only
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => optimizeCircuit(circuit, { errorCorrection: true })}
                  className="neon-border"
                >
                  Error Correction
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => optimizeCircuit(circuit, { preserveEntanglement: true })}
                  className="neon-border"
                >
                  Preserve Entanglement
                </Button>
              </div>
            </div>
          </>
        )}

        {circuit.length > 0 && !optimizationResult && (
          <div className="text-center text-quantum-particle py-4">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Click "AI Optimize" to analyze your circuit</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
