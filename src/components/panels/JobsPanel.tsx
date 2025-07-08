import { useState, useEffect } from "react";
import { Clock, Cpu, CheckCircle, XCircle, Pause, Play, Trash2, Plus, Terminal, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QuantumGate, quantumSimulator } from "@/lib/quantumSimulator";

interface Job {
  id: string;
  name: string;
  status: "queued" | "running" | "completed" | "failed" | "paused";
  progress: number;
  qubits: number;
  estimatedTime: string;
  priority: "high" | "medium" | "low";
  circuit: QuantumGate[];
  logs: string[];
  startTime?: Date;
  endTime?: Date;
}

interface LogEntry {
  timestamp: string;
  level: "info" | "error" | "warning";
  message: string;
}

export function JobsPanel() {
  const [jobs, setJobs] = useState<Job[]>([
    { 
      id: "Q-4571", 
      name: "Quantum Teleportation", 
      status: "running", 
      progress: 73,
      qubits: 3,
      estimatedTime: "2m 14s",
      priority: "high",
      circuit: [
        { id: "1", type: "H", qubit: 0, position: 0 },
        { id: "2", type: "CNOT", qubits: [0, 1], position: 1 },
        { id: "3", type: "CNOT", qubits: [2, 0], position: 2 }
      ],
      logs: [
        "[14:32:15] INFO: Job started",
        "[14:32:16] INFO: Applying Hadamard gate to qubit 0",
        "[14:32:17] INFO: Applying CNOT gate to qubits 0,1",
        "[14:32:18] INFO: Processing CNOT gate to qubits 2,0..."
      ],
      startTime: new Date(Date.now() - 120000)
    },
    { 
      id: "Q-4570", 
      name: "Shor's Algorithm Demo", 
      status: "queued", 
      progress: 0,
      qubits: 4,
      estimatedTime: "5m 30s",
      priority: "medium",
      circuit: [
        { id: "1", type: "H", qubit: 0, position: 0 },
        { id: "2", type: "H", qubit: 1, position: 0 },
        { id: "3", type: "CNOT", qubits: [0, 2], position: 1 }
      ],
      logs: ["[14:30:45] INFO: Job queued, waiting for available resources"]
    },
    { 
      id: "Q-4569", 
      name: "Bell State Creation", 
      status: "completed", 
      progress: 100,
      qubits: 2,
      estimatedTime: "1m 15s",
      priority: "low",
      circuit: [
        { id: "1", type: "H", qubit: 0, position: 0 },
        { id: "2", type: "CNOT", qubits: [0, 1], position: 1 }
      ],
      logs: [
        "[14:28:30] INFO: Job started",
        "[14:28:31] INFO: Applying Hadamard gate to qubit 0",
        "[14:28:32] INFO: Applying CNOT gate to qubits 0,1",
        "[14:28:33] INFO: Simulation completed successfully",
        "[14:28:33] INFO: Final state: |00⟩ + |11⟩"
      ],
      startTime: new Date(Date.now() - 300000),
      endTime: new Date(Date.now() - 240000)
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [newJobPriority, setNewJobPriority] = useState<"high" | "medium" | "low">("medium");
  const [newJobCircuit, setNewJobCircuit] = useState("");

  // Simulate job progress for running jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prev => prev.map(job => {
        if (job.status === "running" && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 5, 100);
          const isCompleted = newProgress >= 100;
          
          const newLogs = [...job.logs];
          if (isCompleted) {
            newLogs.push(`[${new Date().toLocaleTimeString()}] INFO: Job completed successfully`);
          }
          
          return {
            ...job,
            progress: newProgress,
            status: isCompleted ? "completed" as const : job.status,
            logs: newLogs,
            endTime: isCompleted ? new Date() : job.endTime
          };
        }
        return job;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

  const handleJobAction = (jobId: string, action: "run" | "pause" | "resume" | "delete") => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const newLogs = [...job.logs];
        const timestamp = `[${new Date().toLocaleTimeString()}]`;
        
        switch (action) {
          case "run":
            if (job.status === "queued") {
              newLogs.push(`${timestamp} INFO: Job started`);
              return { ...job, status: "running" as const, logs: newLogs, startTime: new Date() };
            }
            break;
          case "pause":
            if (job.status === "running") {
              newLogs.push(`${timestamp} INFO: Job paused`);
              return { ...job, status: "paused" as const, logs: newLogs };
            }
            break;
          case "resume":
            if (job.status === "paused") {
              newLogs.push(`${timestamp} INFO: Job resumed`);
              return { ...job, status: "running" as const, logs: newLogs };
            }
            break;
          case "delete":
            return null;
        }
      }
      return job;
    }).filter(Boolean) as Job[]);
  };

  const createNewJob = () => {
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
    
    const newJob: Job = {
      id: `Q-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: newJobName,
      status: "queued",
      progress: 0,
      qubits: Math.max(...gates.flatMap(g => g.qubit ? [g.qubit] : g.qubits || []), 1) + 1,
      estimatedTime: `${Math.floor(Math.random() * 5) + 1}m ${Math.floor(Math.random() * 60)}s`,
      priority: newJobPriority,
      circuit: gates,
      logs: [`[${new Date().toLocaleTimeString()}] INFO: Job created and queued`]
    };
    
    setJobs(prev => [newJob, ...prev]);
    setNewJobName("");
    setNewJobCircuit("");
    setIsCreateDialogOpen(false);
  };

  const getJobStats = () => {
    const running = jobs.filter(j => j.status === "running").length;
    const queued = jobs.filter(j => j.status === "queued").length;
    const completed = jobs.filter(j => j.status === "completed").length;
    const failed = jobs.filter(j => j.status === "failed").length;
    return { running, queued, completed, failed };
  };

  const stats = getJobStats();

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
                <div className="text-2xl font-bold text-quantum-glow">{stats.running}</div>
                <div className="text-xs text-muted-foreground font-mono">RUNNING</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-neon">{stats.queued}</div>
                <div className="text-xs text-muted-foreground font-mono">QUEUED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-xs text-muted-foreground font-mono">COMPLETED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
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
          ))}
        </div>
      </div>
    </div>
  );
}