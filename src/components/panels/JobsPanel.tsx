import { useState } from "react";
import { Clock, Cpu, CheckCircle, XCircle, Pause, Play, Trash2, Plus, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QuantumGate } from "@/lib/quantumSimulator";
import { useJobs, type Job } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";

export function JobsPanel() {
  const { user } = useAuth();
  const { 
    jobs, 
    loading, 
    createJob, 
    handleJobAction, 
    getJobStats 
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [newJobPriority, setNewJobPriority] = useState<"high" | "medium" | "low">("medium");
  const [newJobCircuit, setNewJobCircuit] = useState("");

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to use the job scheduler</p>
      </div>
    );
  }

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

  const createNewJob = async () => {
    if (!newJobName.trim()) return;
    
    // Parse simple circuit description (e.g., "H(0), CNOT(0,1)")
    const gates: QuantumGate[] = [];
    let position = 0;
    
    if (newJobCircuit.trim()) {
      const gateStrings = newJobCircuit.split(',').map(s => s.trim());
      gateStrings.forEach((gateStr, idx) => {
        const match = gateStr.match(/(\w+)\(([^)]+)\)/);
        if (match) {
          const [, type, params] = match;
          const paramList = params.split(',').map(p => parseInt(p.trim()));
          
          if (type === "CNOT" && paramList.length === 2) {
            gates.push({
              id: `gate-${idx}`,
              type,
              qubits: paramList,
              position
            });
          } else if (paramList.length === 1) {
            gates.push({
              id: `gate-${idx}`,
              type,
              qubit: paramList[0],
              position
            });
          }
          position++;
        }
      });
    }
    
    const qubits = Math.max(...gates.flatMap(g => g.qubit ? [g.qubit] : g.qubits || []), 0) + 1;
    const estimatedTime = `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`;
    
    await createJob({
      name: newJobName,
      priority: newJobPriority,
      circuit: gates,
      qubits,
      estimatedTime
    });
    
    setNewJobName("");
    setNewJobCircuit("");
    setIsCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-quantum-glow">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Job Scheduler</h2>
            <p className="text-muted-foreground font-mono">Quantum process queue management</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="quantum-panel neon-border">
              <DialogHeader>
                <DialogTitle className="text-quantum-glow font-mono">Create New Quantum Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jobName" className="text-sm font-mono">Job Name</Label>
                  <Input
                    id="jobName"
                    value={newJobName}
                    onChange={(e) => setNewJobName(e.target.value)}
                    placeholder="e.g., Bell State Generation"
                    className="neon-border"
                  />
                </div>
                <div>
                  <Label htmlFor="priority" className="text-sm font-mono">Priority</Label>
                  <Select value={newJobPriority} onValueChange={(value: any) => setNewJobPriority(value)}>
                    <SelectTrigger className="neon-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="circuit" className="text-sm font-mono">Circuit Description</Label>
                  <Textarea
                    id="circuit"
                    value={newJobCircuit}
                    onChange={(e) => setNewJobCircuit(e.target.value)}
                    placeholder="e.g., H(0), CNOT(0,1), X(2)"
                    className="neon-border"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: H(0), X(1), CNOT(0,1), Y(2), Z(3)
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewJob} className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
                    Create Job
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Queue Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">{getJobStats.running}</div>
                <div className="text-xs text-muted-foreground font-mono">RUNNING</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-neon">{getJobStats.queued}</div>
                <div className="text-xs text-muted-foreground font-mono">QUEUED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{getJobStats.completed}</div>
                <div className="text-xs text-muted-foreground font-mono">COMPLETED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{getJobStats.failed}</div>
                <div className="text-xs text-muted-foreground font-mono">FAILED</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Queue */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="quantum-panel neon-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground font-mono">No jobs in queue</p>
                <p className="text-sm text-muted-foreground mt-2">Create your first quantum job to get started</p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
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
                    {/* Circuit Preview */}
                    <div className="bg-quantum-matrix/30 rounded p-2 font-mono text-xs">
                      <span className="text-muted-foreground">Circuit: </span>
                      <span className="text-quantum-neon">
                        {job.circuit.map(gate => 
                          gate.type === "CNOT" 
                            ? `${gate.type}(${gate.qubits?.join(',')})`
                            : `${gate.type}(${gate.qubit})`
                        ).join(', ') || 'No gates defined'}
                      </span>
                    </div>
                    
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="neon-border"
                              onClick={() => setSelectedJob(job)}
                            >
                              <Terminal className="w-3 h-3 mr-1" />
                              Logs
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="quantum-panel neon-border max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-quantum-glow font-mono">
                                Job Logs: {job.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="bg-black rounded p-4 max-h-96 overflow-y-auto">
                              {job.logs.map((log, idx) => (
                                <div key={idx} className="font-mono text-xs text-green-400 mb-1">
                                  {log}
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {job.status === "queued" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="neon-border"
                            onClick={() => handleJobAction(job.id, "run")}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Run
                          </Button>
                        )}
                        
                        {job.status === "running" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="neon-border"
                            onClick={() => handleJobAction(job.id, "pause")}
                          >
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </Button>
                        )}
                        
                        {job.status === "paused" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="neon-border"
                            onClick={() => handleJobAction(job.id, "resume")}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Resume
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="neon-border hover:border-red-400 hover:text-red-400"
                          onClick={() => handleJobAction(job.id, "delete")}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}