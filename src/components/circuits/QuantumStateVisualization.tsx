
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { QuantumBackendResult } from "@/services/quantumBackendService";
import { quantumSimulator } from "@/lib/quantumSimulator";
import { BlochSphereVisualization } from "@/components/quantum/BlochSphereVisualization";
import { CircuitExplanationPanel } from "@/components/workflow/CircuitExplanationPanel";
import { Gate } from "@/hooks/useCircuitState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Activity, Bot, Zap } from 'lucide-react';

interface QuantumStateVisualizationProps {
  simulationResult: OptimizedSimulationResult | null;
  NUM_QUBITS: number;
  backendResult?: QuantumBackendResult | null;
  gates?: Gate[];
}

export function QuantumStateVisualization({ 
  simulationResult, 
  NUM_QUBITS, 
  backendResult,
  gates = []
}: QuantumStateVisualizationProps) {
  const [selectedQubit, setSelectedQubit] = useState(0);

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
    mode: backendResult.backend,
    blochSphereData: backendResult.blochSphereData || []
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

  // Generate Bloch sphere data with proper fallback
  const blochSphereData = React.useMemo(() => {
    // Use backend data if available
    if (backendResult?.blochSphereData) {
      return backendResult.blochSphereData;
    }
    
    // Generate from qubit states
    if (displayResult?.qubitStates) {
      return displayResult.qubitStates.map(qubit => {
        const alpha = Math.sqrt(Math.max(0, 1 - qubit.probability));
        const beta = Math.sqrt(Math.max(0, qubit.probability));
        const phase = qubit.phase;
        
        // Bloch sphere coordinates
        const x = 2 * alpha * beta * Math.cos(phase);
        const y = 2 * alpha * beta * Math.sin(phase);
        const z = alpha * alpha - beta * beta;
        
        return {
          x: isNaN(x) ? 0 : x,
          y: isNaN(y) ? 0 : y,
          z: isNaN(z) ? 1 : z,
          qubit: qubit.qubit,
          theta: 2 * Math.acos(alpha),
          phi: phase
        };
      });
    }
    
    // Default fallback for all qubits in |0⟩ state
    return Array.from({ length: NUM_QUBITS }, (_, i) => ({
      x: 0,
      y: 0,
      z: 1,
      qubit: i,
      theta: 0,
      phi: 0
    }));
  }, [displayResult, backendResult, NUM_QUBITS]);

  // Prepare qubit states for visualization
  const qubitStates = React.useMemo(() => {
    if (displayResult?.qubitStates) {
      return displayResult.qubitStates;
    }
    
    // Generate default qubit states
    return Array.from({ length: NUM_QUBITS }, (_, i) => ({
      qubit: i,
      state: '|0⟩',
      amplitude: { real: 1, imag: 0 },
      phase: 0,
      probability: 0
    }));
  }, [displayResult, NUM_QUBITS]);

  return (
    <div className="space-y-6">
      {/* Main Visualization Section */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Quantum State Simulation
            {backendResult && (
              <span className="text-sm text-quantum-neon ml-2">
                ({backendResult.backend.toUpperCase()})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {Array.from({ length: NUM_QUBITS }).map((_, i) => {
              const qubitState = qubitStates[i] || {
                state: '|0⟩',
                amplitude: { real: 1, imag: 0 },
                phase: 0,
                probability: 0
              };
              
              return (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="text-xs font-mono text-quantum-neon">Qubit {i}</div>
                  <div 
                    className="w-16 h-16 rounded-full border-2 border-quantum-neon flex items-center justify-center quantum-float particle-animation cursor-pointer"
                    style={getBlochSphereStyle(qubitState)}
                    onClick={() => setSelectedQubit(i)}
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

      {/* 3D Bloch Sphere Visualization */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Zap className="w-5 h-5" />
            3D Bloch Sphere Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BlochSphereVisualization
            blochSphereData={blochSphereData}
            qubitStates={qubitStates}
            selectedQubit={selectedQubit}
            onQubitSelect={setSelectedQubit}
          />
          <div className="mt-4 text-sm text-quantum-particle">
            Click on qubit vectors to select them. Use mouse to rotate and zoom the 3D visualization.
          </div>
        </CardContent>
      </Card>

      {/* AI Circuit Explanation */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Circuit Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gates.length > 0 ? (
            <CircuitExplanationPanel
              gates={gates}
              result={backendResult || {
                qubitStates: qubitStates.map(q => ({
                  ...q,
                  amplitude: { real: q.amplitude.real, imaginary: q.amplitude.imag }
                })),
                measurementProbabilities: displayResult?.measurementProbabilities || [],
                stateVector: displayResult?.stateVector || [],
                executionTime: displayResult?.executionTime || 0,
                backend: 'local'
              } as QuantumBackendResult}
              numQubits={NUM_QUBITS}
              isVisible={true}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Add quantum gates to your circuit and run simulation to see AI explanation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
