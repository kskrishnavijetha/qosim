import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { EnhancedCircuitRenderer } from './EnhancedCircuitRenderer';

interface CircuitGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

interface OptimizationData {
  original: { gates: number; depth: number };
  optimized: { gates: number; depth: number };
  gateSavings: number;
  depthSavings: number;
  suggestions: string[];
}

interface OptimizationComparisonProps {
  originalCircuit: CircuitGate[];
  optimizedCircuit: CircuitGate[];
  optimizationData: OptimizationData;
  numQubits: number;
  onApplyOptimization: () => void;
}

export function OptimizationComparison({
  originalCircuit,
  optimizedCircuit,
  optimizationData,
  numQubits,
  onApplyOptimization
}: OptimizationComparisonProps) {
  const gateReduction = Math.round(((optimizationData.original.gates - optimizationData.optimized.gates) / optimizationData.original.gates) * 100);
  const depthReduction = Math.round(((optimizationData.original.depth - optimizationData.optimized.depth) / optimizationData.original.depth) * 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Circuit Optimization Results
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-600">
            {gateReduction > 0 ? `-${gateReduction}%` : 'No change'} gates
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            {depthReduction > 0 ? `-${depthReduction}%` : 'No change'} depth
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Performance Improvements */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-red-700 dark:text-red-300">Original Circuit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gates:</span>
                <span className="font-mono">{optimizationData.original.gates}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Depth:</span>
                <span className="font-mono">{optimizationData.original.depth}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-green-700 dark:text-green-300">Optimized Circuit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gates:</span>
                <span className="font-mono text-green-600 dark:text-green-400">{optimizationData.optimized.gates}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Depth:</span>
                <span className="font-mono text-green-600 dark:text-green-400">{optimizationData.optimized.depth}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side-by-side circuit comparison */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Circuit Comparison</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700 dark:text-red-300">Original</span>
                <Badge variant="outline" className="text-xs">{originalCircuit.length} gates</Badge>
              </div>
              <div className="border rounded-lg p-3 bg-red-50 dark:bg-red-900/10">
                <EnhancedCircuitRenderer
                  gates={originalCircuit}
                  numQubits={numQubits}
                  width={300}
                  height={Math.max(150, numQubits * 40 + 60)}
                  showTooltips={false}
                />
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Optimized</span>
                <Badge variant="outline" className="text-xs">{optimizedCircuit.length} gates</Badge>
              </div>
              <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/10">
                <EnhancedCircuitRenderer
                  gates={optimizedCircuit}
                  numQubits={numQubits}
                  width={300}
                  height={Math.max(150, numQubits * 40 + 60)}
                  showTooltips={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Applied Optimizations</h4>
          <div className="space-y-2">
            {optimizationData.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 text-sm p-2 bg-muted/50 rounded">
                <Zap className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button 
          onClick={onApplyOptimization}
          className="w-full"
          size="lg"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Apply Optimizations
        </Button>
      </CardContent>
    </Card>
  );
}