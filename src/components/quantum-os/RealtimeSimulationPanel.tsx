
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import types from the workspace hook to ensure consistency
import type { 
  Gate, 
  Circuit 
} from '@/hooks/useCircuitWorkspace';

interface RealtimeSimulationPanelProps {
  circuit?: Circuit | null;
  simulationResult?: any;
  isRunning?: boolean;
}

export function RealtimeSimulationPanel({ 
  circuit, 
  simulationResult, 
  isRunning = false 
}: RealtimeSimulationPanelProps) {
  
  const hasResults = simulationResult && Object.keys(simulationResult).length > 0;
  
  return (
    <div className="h-full space-y-4">
      {/* Simulation Status */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Real-time Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge 
              variant={isRunning ? "default" : "secondary"}
              className={cn(
                "flex items-center gap-2",
                isRunning && "bg-quantum-glow text-black animate-pulse"
              )}
            >
              <Zap className="w-3 h-3" />
              {isRunning ? 'Running' : 'Ready'}
            </Badge>
            
            {circuit && (
              <div className="text-sm text-quantum-particle">
                Circuit: {circuit.name} ({circuit.gates.length} gates, {circuit.qubits} qubits)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {hasResults ? (
        <Card className="quantum-panel neon-border flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-quantum-neon flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Probabilities */}
            {simulationResult.probabilities && (
              <div>
                <h4 className="text-sm font-semibold text-quantum-glow mb-2">State Probabilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(simulationResult.probabilities).map(([state, prob]) => (
                    <div key={state} className="flex justify-between text-sm">
                      <span className="text-quantum-particle">|{state}⟩</span>
                      <span className="text-quantum-neon">{(prob as number * 100).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Measurement Counts */}
            {simulationResult.counts && (
              <div>
                <h4 className="text-sm font-semibold text-quantum-glow mb-2">Measurement Counts</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(simulationResult.counts).map(([state, count]) => (
                    <div key={state} className="flex justify-between text-sm">
                      <span className="text-quantum-particle">{state}</span>
                      <span className="text-quantum-neon">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="quantum-panel neon-border flex-1">
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <Activity className="w-12 h-12 text-quantum-particle mx-auto opacity-50" />
              <p className="text-muted-foreground">
                {circuit ? 'Run the circuit to see simulation results' : 'No circuit selected'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
