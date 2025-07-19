
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export interface QuantumJob {
  id: string;
  name: string;
  qasm: string;
  backend: string;
  shots: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  submittedAt: Date;
  completedAt?: Date;
  progress?: number;
  result?: {
    counts: Record<string, number>;
    executionTime: number;
    queueTime: number;
  };
  error?: string;
}

interface JobQueueManagerProps {
  jobs: QuantumJob[];
  onJobCancel: (jobId: string) => void;
  onJobResubmit: (jobId: string) => void;
  onJobRefresh: (jobId: string) => void;
}

export function JobQueueManager({ jobs, onJobCancel, onJobResubmit, onJobRefresh }: JobQueueManagerProps) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh running jobs
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      const runningJobs = jobs.filter(job => job.status === 'running' || job.status === 'pending');
      runningJobs.forEach(job => {
        onJobRefresh(job.id);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [jobs, autoRefresh, onJobRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'running':
        return 'bg-blue-500/20 text-blue-300';
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'failed':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const formatDuration = (start: Date, end?: Date) => {
    const duration = (end || new Date()).getTime() - start.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const pendingJobs = jobs.filter(job => job.status === 'pending');
  const runningJobs = jobs.filter(job => job.status === 'running');
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const failedJobs = jobs.filter(job => job.status === 'failed');

  const JobCard = ({ job }: { job: QuantumJob }) => (
    <Card className={`quantum-panel neon-border transition-all cursor-pointer ${
      selectedJob === job.id ? 'ring-2 ring-quantum-glow' : ''
    }`} onClick={() => setSelectedJob(job.id)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(job.status)}
            <span className="font-mono text-quantum-neon font-semibold">{job.name}</span>
          </div>
          <Badge className={getStatusColor(job.status)}>
            {job.status.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Backend:</span>
            <span className="text-quantum-particle">{job.backend}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shots:</span>
            <span className="text-quantum-particle">{job.shots.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted:</span>
            <span className="text-quantum-particle">{job.submittedAt.toLocaleTime()}</span>
          </div>
          {job.status === 'running' && job.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress:</span>
                <span className="text-quantum-particle">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2" />
            </div>
          )}
          {job.completedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-quantum-particle">
                {formatDuration(job.submittedAt, job.completedAt)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          {job.status === 'pending' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onJobCancel(job.id);
              }}
            >
              Cancel
            </Button>
          )}
          {job.status === 'failed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onJobResubmit(job.id);
              }}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Resubmit
            </Button>
          )}
          {(job.status === 'running' || job.status === 'pending') && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onJobRefresh(job.id);
              }}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Refresh
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-quantum-glow">
              Job Queue Manager
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-quantum-glow/20' : ''}
              >
                {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                Auto-refresh
              </Button>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300">
              {pendingJobs.length} Pending
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
              {runningJobs.length} Running
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-300">
              {completedJobs.length} Completed
            </Badge>
            <Badge variant="outline" className="bg-red-500/20 text-red-300">
              {failedJobs.length} Failed
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 quantum-tabs">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="quantum-panel neon-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No jobs submitted yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </TabsContent>

        <TabsContent value="running" className="space-y-4">
          <div className="grid gap-4">
            {runningJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          <div className="grid gap-4">
            {failedJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Details */}
      {selectedJob && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const job = jobs.find(j => j.id === selectedJob);
              if (!job) return null;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Job ID:</span>
                      <div className="font-mono text-quantum-neon">{job.id}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="text-quantum-particle">{job.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {job.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                      <div className="text-sm font-mono text-red-400">{job.error}</div>
                    </div>
                  )}

                  {job.result && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Execution Time:</span>
                          <div className="text-quantum-particle">{job.result.executionTime}ms</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Queue Time:</span>
                          <div className="text-quantum-particle">{job.result.queueTime}ms</div>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Results:</span>
                        <div className="mt-2 space-y-1">
                          {Object.entries(job.result.counts).map(([state, count]) => (
                            <div key={state} className="flex justify-between text-sm">
                              <span className="font-mono text-quantum-neon">|{state}⟩</span>
                              <span className="text-quantum-particle">{count} ({((count / job.shots) * 100).toFixed(1)}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
