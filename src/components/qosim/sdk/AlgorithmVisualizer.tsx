
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type QuantumAlgorithm, type QuantumSimulationResult } from '@/types/qosim';
import { Zap, BarChart3 } from 'lucide-react';

interface AlgorithmVisualizerProps {
  algorithm: QuantumAlgorithm | null;
  simulationResult: QuantumSimulationResult | null;
}

export function AlgorithmVisualizer({ algorithm, simulationResult }: AlgorithmVisualizerProps) {
  if (!algorithm) {
    return (
      <div className="text-center text-slate-400 py-8">
        <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Select an algorithm to visualize</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            {algorithm.name} Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-black/50 rounded-lg p-4 border border-cyan-400/20">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">Algorithm Overview</h4>
              <p className="text-slate-300 text-sm">{algorithm.description}</p>
            </div>
            
            {simulationResult && (
              <div className="bg-black/50 rounded-lg p-4 border border-purple-400/20">
                <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Simulation Results
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Qubits:</span>
                    <span className="ml-2 text-white">{simulationResult.qubits}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Fidelity:</span>
                    <span className="ml-2 text-white">{(simulationResult.fidelity * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
