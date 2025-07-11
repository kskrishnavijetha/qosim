import { Terminal, Filter, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRuntimeLogs } from "@/hooks/useRuntimeLogs";

export function LogsPanel() {
  const { logs, loading, createLog, generateRandomLog, clearLogs, getLogStats } = useRuntimeLogs();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "bg-red-500/20 text-red-300";
      case "warning": return "bg-yellow-500/20 text-yellow-300";
      case "quantum": return "bg-purple-500/20 text-purple-300";
      case "info": return "bg-blue-500/20 text-blue-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getComponentColor = (component: string) => {
    switch (component) {
      case "QOS-CORE": return "text-quantum-glow";
      case "SCHEDULER": return "text-quantum-neon";
      case "MEMORY": return "text-green-400";
      case "QEC": return "text-red-400";
      case "ENTANGLER": return "text-purple-400";
      case "QFS": return "text-yellow-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Runtime Logs</h2>
            <p className="text-muted-foreground font-mono">System events and quantum operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="neon-border">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="neon-border">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={clearLogs}
              disabled={loading}
              variant="outline" 
              className="neon-border"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Log Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{getLogStats.errors}</div>
                <div className="text-xs text-muted-foreground font-mono">ERRORS</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{getLogStats.warnings}</div>
                <div className="text-xs text-muted-foreground font-mono">WARNINGS</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">{getLogStats.quantum}</div>
                <div className="text-xs text-muted-foreground font-mono">QUANTUM</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-neon">{getLogStats.info}</div>
                <div className="text-xs text-muted-foreground font-mono">INFO</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Entries */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">System Log Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-quantum-matrix rounded-lg p-4 hover:bg-quantum-matrix/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={getLevelColor(log.level)}>
                          {log.level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={`neon-border ${getComponentColor(log.component)}`}>
                          {log.component}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="font-mono text-sm mb-2">
                      {log.message}
                    </div>
                    
                    {log.details && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {log.details}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Log Feed */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Live Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded p-4 font-mono text-xs max-h-48 overflow-y-auto">
              <div className="text-quantum-glow">[14:32:16.234] QOS-CORE: Quantum measurement completed on qubit 5</div>
              <div className="text-quantum-neon">[14:32:16.145] SCHEDULER: Job Q-4572 queued for execution</div>
              <div className="text-green-400">[14:32:15.987] MEMORY: Coherence refreshed on qubits 0-15</div>
              <div className="text-quantum-glow">[14:32:15.856] ENTANGLER: GHZ state |GHZ⟩ = (|000⟩ + |111⟩)/√2 prepared</div>
              <div className="text-yellow-400">[14:32:15.723] QFS: Quantum file write operation initiated</div>
              <div className="text-purple-400 particle-animation">⚡ Live feed active...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}