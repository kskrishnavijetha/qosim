
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Play, 
  Pause, 
  X, 
  RefreshCw, 
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  DollarSign,
  Cpu
} from 'lucide-react';
import { HardwareJob } from '@/services/quantumHardwareService';

interface JobMonitorProps {
  jobs: HardwareJob[];
  onJobCancel: (jobId: string) => Promise<boolean>;
  onJobComplete: (job: HardwareJob) => void;
  onRefresh: () => void;
}

export function JobMonitor({ jobs, onJobCancel, onJobComplete, onRefresh }: JobMonitorProps) {
  const [cancelingJobs, setCancelingJobs] = useState<Set<string>>(new Set());

  const getStatusColor = (status: HardwareJob['status']) => {
    const colors = {
      pending: 'bg-gray-500/20 border-gray-500/50 text-gray-400',
      queued: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
      running: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      completed: 'bg-green-500/20 border-green-500/50 text-green-400',
      failed: 'bg-red-500/20 border-red-500/50 text-red-400',
      cancelled: 'bg-orange-500/20 border-orange-500/50 text-orange-400'
    };
    return colors[status];
  };

  const getStatusIcon = (status: HardwareJob['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'queued':
        return <Clock className="w-4 h-4" />;
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCancelJob = async (jobId: string) => {
    setCancelingJobs(prev => new Set([...prev, jobId]));
    try {
      await onJobCancel(jobId);
      onRefresh();
    } catch (error) {
      console.error('Failed to cancel job:', error);
    } finally {
      setCancelingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const formatDuration = (start: Date, end?: Date) => {
    const duration = (end || new Date()).getTime() - start.getTime();
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const activeJobs = jobs.filter(job => job.status !== 'completed' && job.status !== 'failed' && job.status !== 'cancelled');
  const completedJobs = jobs.filter(job => job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono text-quantum-glow">Job Monitor</h3>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-mono text-quantum-neon">Active Jobs ({activeJobs.length})</h4>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <Card key={job.id} className="quantum-panel">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <h5 className="font-mono text-quantum-neon text-sm">{job.name}</h5>
                        <div className="text-xs text-muted-foreground">
                          {job.device} • {job.shots} shots
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      
                      {(job.status === 'pending' || job.status === 'queued') && (
                        <Button
                          onClick={() => handleCancelJob(job.id)}
                          disabled={cancelingJobs.has(job.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Job Progress */}
                  {job.status === 'running' && job.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-quantum-particle">{Math.round(job.progress)}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  {/* Queue Information */}
                  {job.status === 'queued' && job.queuePosition && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Queue Position: {job.queuePosition}</span>
                      {job.estimatedCompletion && (
                        <span>ETA: {job.estimatedCompletion.toLocaleTimeString()}</span>
                      )}
                    </div>
                  )}

                  {/* Job Details */}
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-quantum-neon/20 text-xs">
                    <div>
                      <div className="text-muted-foreground">Submitted</div>
                      <div className="font-mono text-quantum-particle">
                        {job.submittedAt.toLocaleTimeString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Duration</div>
                      <div className="font-mono text-quantum-energy">
                        {job.startedAt ? formatDuration(job.startedAt, job.completedAt) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost</div>
                      <div className="font-mono text-quantum-glow">
                        ${job.cost.estimated.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      <div className="space-y-4">
        <h4 className="font-mono text-quantum-neon">Recent Jobs ({completedJobs.length})</h4>
        
        {completedJobs.length === 0 ? (
          <Card className="quantum-panel">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h5 className="text-lg font-mono text-muted-foreground mb-2">No Jobs Yet</h5>
              <p className="text-sm text-muted-foreground">
                Submit your first quantum circuit to see job history here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {completedJobs.slice(0, 10).map((job) => (
              <Card key={job.id} className="quantum-panel">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <h5 className="font-mono text-quantum-neon text-sm">{job.name}</h5>
                        <div className="text-xs text-muted-foreground">
                          {job.device} • {job.shots} shots • {job.submittedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      
                      <div className="text-xs text-right">
                        <div className="text-quantum-glow">${(job.cost.actual || job.cost.estimated).toFixed(3)}</div>
                        {job.completedAt && job.startedAt && (
                          <div className="text-muted-foreground">
                            {formatDuration(job.startedAt, job.completedAt)}
                          </div>
                        )}
                      </div>
                      
                      {job.status === 'completed' && (
                        <Button
                          onClick={() => onJobComplete(job)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>

                  {job.error && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                      Error: {job.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
