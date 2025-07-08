import { Clock, Cpu, CheckCircle, XCircle, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function JobsPanel() {
  const jobs = [
    { 
      id: "Q-4571", 
      name: "Quantum Teleportation", 
      status: "running", 
      progress: 73,
      qubits: 6,
      estimatedTime: "2m 14s",
      priority: "high"
    },
    { 
      id: "Q-4570", 
      name: "Shor's Factorization", 
      status: "queued", 
      progress: 0,
      qubits: 12,
      estimatedTime: "5m 30s",
      priority: "medium"
    },
    { 
      id: "Q-4569", 
      name: "VQE Optimization", 
      status: "completed", 
      progress: 100,
      qubits: 8,
      estimatedTime: "3m 45s",
      priority: "low"
    },
    { 
      id: "Q-4568", 
      name: "Quantum ML Training", 
      status: "failed", 
      progress: 45,
      qubits: 16,
      estimatedTime: "8m 20s",
      priority: "high"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Cpu className="w-4 h-4 text-quantum-glow particle-animation" />;
      case "queued": return <Clock className="w-4 h-4 text-quantum-neon" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />;
      case "paused": return <Pause className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-300";
      case "medium": return "bg-yellow-500/20 text-yellow-300";
      case "low": return "bg-green-500/20 text-green-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Job Scheduler</h2>
            <p className="text-muted-foreground font-mono">Quantum process queue management</p>
          </div>
          <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
            <Cpu className="w-4 h-4 mr-2" />
            Submit Job
          </Button>
        </div>

        {/* Queue Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">1</div>
                <div className="text-xs text-muted-foreground font-mono">RUNNING</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-neon">1</div>
                <div className="text-xs text-muted-foreground font-mono">QUEUED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">1</div>
                <div className="text-xs text-muted-foreground font-mono">COMPLETED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">1</div>
                <div className="text-xs text-muted-foreground font-mono">FAILED</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Queue */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <CardTitle className="text-lg font-mono">{job.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{job.id}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(job.priority)}>
                    {job.priority.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-muted-foreground">Qubits: {job.qubits}</span>
                    <span className="text-muted-foreground">Est. Time: {job.estimatedTime}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-quantum-matrix rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-quantum-glow to-quantum-neon h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-muted-foreground">
                      Progress: {job.progress}%
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="neon-border">
                        View
                      </Button>
                      {job.status === "running" && (
                        <Button variant="outline" size="sm" className="neon-border">
                          Pause
                        </Button>
                      )}
                      {job.status === "failed" && (
                        <Button variant="outline" size="sm" className="neon-border">
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}