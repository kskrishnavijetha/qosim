import { GitBranch, Play, Pause, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CircuitsPanel() {
  const circuits = [
    { id: "QC-001", name: "Bell State Generator", qubits: 2, gates: 4, status: "ready" },
    { id: "QC-002", name: "Grover's Algorithm", qubits: 8, gates: 24, status: "running" },
    { id: "QC-003", name: "Quantum Fourier Transform", qubits: 4, gates: 16, status: "ready" },
    { id: "QC-004", name: "Error Correction", qubits: 16, gates: 48, status: "compiled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-quantum-glow";
      case "ready": return "text-quantum-neon";
      case "compiled": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum Circuits</h2>
            <p className="text-muted-foreground font-mono">Design and execute quantum algorithms</p>
          </div>
          <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
            <GitBranch className="w-4 h-4 mr-2" />
            New Circuit
          </Button>
        </div>

        <div className="grid gap-4">
          {circuits.map((circuit) => (
            <Card key={circuit.id} className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">{circuit.name}</CardTitle>
                  <span className={`text-xs font-mono ${getStatusColor(circuit.status)}`}>
                    {circuit.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{circuit.id}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm font-mono">
                    <div>
                      <span className="text-muted-foreground">Qubits:</span>
                      <span className="ml-2 text-quantum-neon">{circuit.qubits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gates:</span>
                      <span className="ml-2 text-quantum-neon">{circuit.gates}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="neon-border">
                      {circuit.status === "running" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button variant="outline" size="sm" className="neon-border">
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="neon-border">
                      <Zap className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Circuit Visualization */}
                <div className="mt-4 bg-quantum-matrix rounded-lg p-4 quantum-panel">
                  <div className="space-y-4">
                    {Array.from({ length: circuit.qubits }).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 text-xs font-mono text-quantum-neon">q{i}</div>
                        <div className="flex-1 relative h-6 flex items-center">
                          {/* Quantum wire */}
                          <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
                          
                          {/* Quantum gates */}
                          <div className="absolute left-1/4 w-8 h-8 bg-quantum-glow rounded border-2 border-quantum-glow flex items-center justify-center text-xs font-bold text-black quantum-float">
                            H
                          </div>
                          <div className="absolute left-1/2 w-8 h-8 bg-quantum-neon rounded border-2 border-quantum-neon flex items-center justify-center text-xs font-bold text-black quantum-float">
                            X
                          </div>
                          <div className="absolute left-3/4 w-2 h-2 bg-quantum-particle rounded-full particle-animation"></div>
                        </div>
                        <div className="w-16 text-xs font-mono text-muted-foreground text-right">
                          |{Math.random() > 0.5 ? '0' : '1'}⟩
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quantum State Visualization */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Current Quantum State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm space-y-2">
              <div className="text-quantum-neon">|ψ⟩ = 0.707|00⟩ + 0.707|11⟩</div>
              <div className="text-muted-foreground">Entanglement: Bell State (Φ+)</div>
              <div className="text-muted-foreground">Coherence Time: 45.3μs remaining</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}