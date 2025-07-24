
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Play, Square, X, Terminal } from 'lucide-react';

interface SimulationConsoleProps {
  circuit: any[];
  simulationResult: any;
  isRunning: boolean;
  output: string;
}

export function SimulationConsole({ circuit, simulationResult, isRunning, output }: SimulationConsoleProps) {
  const [consoleOutput, setConsoleOutput] = React.useState(output);

  React.useEffect(() => {
    setConsoleOutput(output);
  }, [output]);

  const clearConsole = () => {
    setConsoleOutput('');
  };

  const formatSimulationResult = (result: any) => {
    if (!result) return 'No simulation result available';
    
    return JSON.stringify({
      stateVector: result.stateVector?.slice(0, 8) || [],
      probabilities: result.measurementProbabilities?.slice(0, 8) || [],
      entanglement: result.entanglement || {},
      fidelity: result.fidelity || 0,
      executionTime: result.executionTime || 0
    }, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-quantum-glow">Simulation Console</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? 'Running' : 'Ready'}
          </Badge>
          <Button
            onClick={clearConsole}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Simulation Status */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-neon flex items-center">
            <Terminal className="w-5 h-5 mr-2" />
            Simulation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-quantum-particle">Circuit Gates:</span>
                <div className="text-quantum-glow font-mono">{circuit.length}</div>
              </div>
              <div>
                <span className="text-sm text-quantum-particle">Qubits:</span>
                <div className="text-quantum-glow font-mono">5</div>
              </div>
              <div>
                <span className="text-sm text-quantum-particle">Depth:</span>
                <div className="text-quantum-glow font-mono">
                  {Math.max(...circuit.map(g => g.position || 0), 0) + 1}
                </div>
              </div>
              <div>
                <span className="text-sm text-quantum-particle">Status:</span>
                <div className="text-quantum-glow font-mono">
                  {isRunning ? 'Running...' : 'Ready'}
                </div>
              </div>
            </div>
            
            {isRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-quantum-particle">Progress:</span>
                  <span className="text-xs text-quantum-energy">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Console Output */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-neon">Console Output</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={consoleOutput}
            readOnly
            className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[200px] resize-none"
            placeholder="Simulation output will appear here..."
          />
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-neon">Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formatSimulationResult(simulationResult)}
              readOnly
              className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[250px] resize-none"
              placeholder="Simulation results will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
