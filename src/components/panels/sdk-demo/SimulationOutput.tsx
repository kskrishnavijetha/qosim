
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlochSphereVisualization } from "@/components/quantum/BlochSphereVisualization";
import { StateVectorMatrix } from "@/components/quantum/StateVectorMatrix";
import { QuantumSimulationResult } from "@/lib/realQuantumSimulation";

interface SimulationOutputProps {
  output: string;
  isRunning: boolean;
  simulationResult?: QuantumSimulationResult | null;
}

export function SimulationOutput({ output, isRunning, simulationResult }: SimulationOutputProps) {
  // Convert simulation result to proper format for components
  const convertedQubitStates = simulationResult?.stateVector ? 
    simulationResult.stateVector.map((amplitude, index) => ({
      qubit: index,
      state: `|${index.toString(2).padStart(Math.ceil(Math.log2(simulationResult.stateVector.length)), '0')}⟩`,
      amplitude: {
        real: amplitude.real,
        imag: amplitude.imag
      },
      phase: Math.atan2(amplitude.imag, amplitude.real),
      probability: amplitude.real * amplitude.real + amplitude.imag * amplitude.imag
    })) : [];

  const blochSphereData = convertedQubitStates.map(qubit => {
    const theta = 2 * Math.acos(Math.abs(qubit.amplitude.real));
    const phi = qubit.phase;
    
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta),
      qubit: qubit.qubit,
      theta,
      phi
    };
  });

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      {/* Results Summary */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Simulation Results</CardTitle>
          <CardDescription className="text-quantum-particle">
            Real-time quantum circuit execution results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="quantum-panel neon-border rounded p-4">
            {output ? (
              <pre className="text-sm font-mono text-quantum-neon whitespace-pre-wrap overflow-auto max-h-32">
                {output}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-32 text-quantum-particle">
                {isRunning ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-quantum-glow border-t-transparent rounded-full animate-spin"></div>
                    Simulating quantum circuit...
                  </div>
                ) : (
                  "Run a simulation to see results"
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visual Output */}
      {simulationResult && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <BlochSphereVisualization 
              blochSphereData={blochSphereData}
              qubitStates={convertedQubitStates}
              selectedQubit={0}
              onQubitSelect={() => {}}
            />
          </div>
          <div className="flex-1">
            <StateVectorMatrix 
              stateVector={simulationResult.stateVector}
              probabilities={simulationResult.probabilities}
              basisStates={simulationResult.basisStates}
            />
          </div>
        </div>
      )}
    </div>
  );
}
