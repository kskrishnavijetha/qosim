import { Database, Zap, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MemoryPanel() {
  // Simulate quantum memory states
  const qubits = Array.from({ length: 64 }, (_, i) => ({
    id: i,
    state: Math.random() > 0.5 ? "|1⟩" : "|0⟩",
    coherence: Math.random() * 100,
    entangled: Math.random() > 0.7,
    amplitude: Math.random(),
  }));

  const memoryBanks = [
    { id: "QMB-0", name: "Primary Quantum Register", capacity: "256 qubits", used: "128 qubits", coherence: 98.3 },
    { id: "QMB-1", name: "Auxiliary Storage", capacity: "128 qubits", used: "64 qubits", coherence: 94.7 },
    { id: "QMB-2", name: "Error Correction Buffer", capacity: "64 qubits", used: "32 qubits", coherence: 99.1 },
  ];

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum Memory</h2>
            <p className="text-muted-foreground font-mono">Qubit state visualization and management</p>
          </div>
          <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh States
          </Button>
        </div>

        {/* Memory Banks Overview */}
        <div className="grid gap-4">
          {memoryBanks.map((bank) => (
            <Card key={bank.id} className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">{bank.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-quantum-glow particle-animation" />
                    <span className="text-sm font-mono text-quantum-neon">{bank.coherence}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="text-sm font-mono">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="ml-2 text-quantum-neon">{bank.capacity}</span>
                    </div>
                    <div className="text-sm font-mono">
                      <span className="text-muted-foreground">Used:</span>
                      <span className="ml-2 text-quantum-glow">{bank.used}</span>
                    </div>
                  </div>
                  <div className="w-32 bg-quantum-matrix rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-quantum-glow to-quantum-neon h-2 rounded-full"
                      style={{ width: `${(parseInt(bank.used) / parseInt(bank.capacity)) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Qubit State Grid */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Qubit State Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-3">
              {qubits.slice(0, 64).map((qubit) => (
                <div
                  key={qubit.id}
                  className={`
                    relative w-14 h-14 rounded-lg border-2 font-mono text-xs flex items-center justify-center cursor-pointer
                    transition-all duration-500 hover:scale-110 hover:z-10
                    ${qubit.entangled 
                      ? 'border-quantum-glow bg-quantum-glow/20 text-quantum-glow quantum-glow quantum-float' 
                      : 'border-quantum-neon bg-quantum-neon/10 text-quantum-neon hover:border-quantum-glow hover:text-quantum-glow'
                    }
                  `}
                  title={`Qubit ${qubit.id}: ${qubit.state}, Coherence: ${qubit.coherence.toFixed(1)}%`}
                >
                  <span className="z-10 relative font-bold">{qubit.state}</span>
                  
                  {/* Coherence indicator */}
                  <div 
                    className="absolute bottom-1 left-1 right-1 h-1 bg-quantum-matrix rounded-full overflow-hidden"
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-quantum-glow to-quantum-neon transition-all duration-300"
                      style={{ width: `${qubit.coherence}%` }}
                    />
                  </div>
                  
                  {/* Entanglement indicator */}
                  {qubit.entangled && (
                    <>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-quantum-glow rounded-full particle-animation quantum-orbit" />
                      <div className="absolute inset-0 border-2 border-quantum-glow rounded-lg animate-pulse" />
                    </>
                  )}
                  
                  {/* Amplitude visualization */}
                  <div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, hsl(var(--quantum-particle) / ${qubit.amplitude * 0.3}), transparent)`
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-quantum-neon bg-quantum-neon/10 rounded" />
                <span className="text-muted-foreground">Superposition</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-quantum-glow bg-quantum-glow/20 rounded" />
                <span className="text-muted-foreground">Entangled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entanglement Network */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Entanglement Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Pairs:</span>
                <span className="text-quantum-glow">32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bell States:</span>
                <span className="text-quantum-neon">16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GHZ States:</span>
                <span className="text-quantum-neon">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Fidelity:</span>
                <span className="text-green-400">0.994</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}