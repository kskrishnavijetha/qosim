
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type QuantumGate, type QuantumSimulationResult } from '@/types/qosim';
import { Zap, TrendingDown, Clock } from 'lucide-react';

interface OptimizationPanelProps {
  circuit: QuantumGate[];
  simulationResult: QuantumSimulationResult | null;
  onOptimize: (optimizedCircuit: QuantumGate[]) => void;
}

export function OptimizationPanel({ circuit, simulationResult, onOptimize }: OptimizationPanelProps) {
  const circuitDepth = circuit.reduce((max, gate) => Math.max(max, gate.position.x), 0) / 60;
  const gateCount = circuit.length;

  const optimizationSuggestions = [
    { type: 'Gate Reduction', potential: '15%', description: 'Remove redundant consecutive gates' },
    { type: 'Circuit Depth', potential: '25%', description: 'Parallelize independent operations' },
    { type: 'Error Rate', potential: '10%', description: 'Use more robust gate combinations' }
  ];

  return (
    <Card className="bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          AI Circuit Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/50 rounded-lg p-3">
            <div className="text-slate-400 text-sm">Gate Count</div>
            <div className="text-xl font-bold text-cyan-400">{gateCount}</div>
          </div>
          <div className="bg-black/50 rounded-lg p-3">
            <div className="text-slate-400 text-sm">Circuit Depth</div>
            <div className="text-xl font-bold text-purple-400">{Math.ceil(circuitDepth)}</div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-yellow-400">Optimization Opportunities</h4>
          {optimizationSuggestions.map((suggestion, index) => (
            <div key={index} className="bg-black/50 rounded-lg p-3 border border-yellow-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{suggestion.type}</div>
                  <div className="text-xs text-slate-400">{suggestion.description}</div>
                </div>
                <Badge variant="outline" className="text-emerald-400">
                  -{suggestion.potential}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Optimization Actions */}
        <div className="space-y-2">
          <Button
            onClick={() => onOptimize(circuit)}
            disabled={circuit.length === 0}
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Apply All Optimizations
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-400 border-slate-400/30"
            >
              <Clock className="w-4 h-4 mr-1" />
              Depth Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-400 border-slate-400/30"
            >
              <Zap className="w-4 h-4 mr-1" />
              Gates Only
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
