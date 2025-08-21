
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { QuantumBackendResult } from "@/services/quantumBackendService";
import { quantumSimulator } from "@/lib/quantumSimulator";

interface QuantumStateVisualizationProps {
  simulationResult: OptimizedSimulationResult | null;
  NUM_QUBITS: number;
  backendResult?: QuantumBackendResult | null;
}

export function QuantumStateVisualization({ 
  simulationResult, 
  NUM_QUBITS, 
  backendResult 
}: QuantumStateVisualizationProps) {
  console.log('🔬 QuantumStateVisualization: Rendering with', { 
    simulationResult, 
    NUM_QUBITS, 
    backendResult,
    hasBackendResult: !!backendResult 
  });

  // Use backend result if available, otherwise use simulation result
  const displayResult = backendResult ? {
    qubitStates: backendResult.qubitStates.map(qubit => ({
      ...qubit,
      amplitude: {
        real: qubit.amplitude.real,
        imag: qubit.amplitude.imaginary
      }
    })),
    measurementProbabilities: Array.isArray(backendResult.measurementProbabilities) 
      ? backendResult.measurementProbabilities 
      : Object.values(backendResult.measurementProbabilities || {}),
    stateVector: backendResult.stateVector,
    executionTime: backendResult.executionTime,
    fidelity: 1.0,
    mode: backendResult.backend
  } : simulationResult;
  
  const getBlochSphereStyle = (qubitState: { 
    amplitude: { real: number; imag: number }; 
    phase: number; 
  }) => {
    const { amplitude, phase } = qubitState;
    const theta = 2 * Math.acos(Math.abs(amplitude.real));
    const phi = phase;
    
    return {
      background: `conic-gradient(from ${phi}rad, hsl(var(--quantum-glow)), hsl(var(--quantum-neon)), hsl(var(--quantum-particle)))`,
      transform: `rotateX(${theta}rad) rotateZ(${phi}rad)`,
      boxShadow: `0 0 20px hsl(var(--quantum-glow) / 0.6)`
    };
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow">
          Live Quantum State Simulation
          {backendResult && (
            <span className="text-sm text-quantum-neon ml-2">
              ({backendResult.backend.toUpperCase()})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: NUM_QUBITS }).map((_, i) => {
            const qubitState = displayResult?.qubitStates[i] || {
              state: '|0⟩',
              amplitude: { real: 1, imag: 0 },
              phase: 0,
              probability: 1
            };
            
            return (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="text-xs font-mono text-quantum-neon">Qubit {i}</div>
                <div 
                  className="w-16 h-16 rounded-full border-2 border-quantum-neon flex items-center justify-center quantum-float particle-animation"
                  style={getBlochSphereStyle(qubitState)}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-xs font-mono text-center">
                  <div className="text-quantum-neon">{qubitState.state}</div>
                  <div className="text-muted-foreground">φ: {qubitState.phase.toFixed(2)}</div>
                  <div className="text-muted-foreground">P: {qubitState.probability.toFixed(3)}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* State Vector Display */}
        {displayResult && (
          <div className="mt-6 p-4 bg-quantum-matrix rounded-lg">
            <h4 className="text-sm font-mono text-quantum-neon mb-2">State Vector</h4>
            <div className="text-xs font-mono text-muted-foreground max-h-20 overflow-y-auto">
              {backendResult ? 
                `Backend Result (${backendResult.backend})` : 
                quantumSimulator.getStateString()
              }
            </div>
            <div className="mt-2">
              <h5 className="text-xs font-mono text-quantum-particle">Measurement Probabilities</h5>
              <div className="text-xs font-mono text-muted-foreground">
                {displayResult.measurementProbabilities
                  .map((prob, i) => prob > 0.001 ? `|${i.toString(2).padStart(NUM_QUBITS, '0')}⟩: ${(prob * 100).toFixed(1)}%` : null)
                  .filter(Boolean)
                  .join(', ')}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
