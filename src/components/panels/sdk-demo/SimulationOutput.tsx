import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SimulationOutputProps {
  output: string;
  isRunning: boolean;
}

export function SimulationOutput({ output, isRunning }: SimulationOutputProps) {
  return (
    <Card className="quantum-panel neon-border flex flex-col">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Simulation Results</CardTitle>
        <CardDescription className="text-quantum-particle">
          State vectors, probabilities, and quantum properties
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="quantum-panel neon-border rounded p-4 h-full">
          {output ? (
            <pre className="text-sm font-mono text-quantum-neon whitespace-pre-wrap overflow-auto h-full">
              {output}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-quantum-particle">
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
  );
}