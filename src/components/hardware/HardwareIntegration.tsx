
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HardwareBackendManager, HardwareBackend } from './HardwareBackendManager';
import { QASMExporter, QuantumJob } from './QASMExporter';
import { JobQueueManager } from './JobQueueManager';
import { SimulationComparison } from './SimulationComparison';
import { Gate } from '@/hooks/useCircuitState';
import { Settings, FileText, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface HardwareIntegrationProps {
  circuit: Gate[];
  simulationResult: any;
}

export function HardwareIntegration({ circuit, simulationResult }: HardwareIntegrationProps) {
  const [backends, setBackends] = useState<HardwareBackend[]>([]);
  const [jobs, setJobs] = useState<QuantumJob[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<{
    simulation: any;
    hardware: any;
    jobInfo: any;
  } | null>(null);

  const handleBackendSave = (backend: HardwareBackend) => {
    setBackends(prev => [...prev.filter(b => b.id !== backend.id), backend]);
  };

  const handleJobSubmit = (job: QuantumJob) => {
    setJobs(prev => [...prev, job]);
    
    // Simulate job processing
    setTimeout(() => {
      simulateJobExecution(job.id);
    }, 2000);
  };

  const simulateJobExecution = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'running' as const, progress: 0 }
        : job
    ));

    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        clearInterval(progressInterval);
        completeJob(jobId);
      } else {
        setJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, progress: Math.min(progress, 100) }
            : job
        ));
      }
    }, 1000);
  };

  const completeJob = (jobId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        // Generate mock hardware results
        const mockResults = generateMockHardwareResults(job.shots);
        
        return {
          ...job,
          status: 'completed' as const,
          completedAt: new Date(),
          result: mockResults
        };
      }
      return job;
    }));

    toast.success('Job completed successfully!');
  };

  const generateMockHardwareResults = (shots: number) => {
    // Generate realistic hardware results with noise
    const states = ['00', '01', '10', '11'];
    const counts: Record<string, number> = {};
    
    // Add some realistic distribution with noise
    const baseProbs = [0.4, 0.3, 0.2, 0.1];
    const noiseLevel = 0.05;
    
    let remaining = shots;
    for (let i = 0; i < states.length - 1; i++) {
      const noisyProb = baseProbs[i] + (Math.random() - 0.5) * noiseLevel;
      const count = Math.floor(remaining * noisyProb);
      counts[states[i]] = count;
      remaining -= count;
    }
    counts[states[states.length - 1]] = remaining;

    return {
      counts,
      executionTime: 5000 + Math.random() * 10000,
      queueTime: 30000 + Math.random() * 60000
    };
  };

  const handleJobCancel = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'failed' as const, error: 'Job cancelled by user' }
        : job
    ));
    toast.success('Job cancelled');
  };

  const handleJobResubmit = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newJob = {
        ...job,
        id: `${job.id}_resubmit_${Date.now()}`,
        status: 'pending' as const,
        submittedAt: new Date(),
        completedAt: undefined,
        result: undefined,
        error: undefined
      };
      handleJobSubmit(newJob);
    }
  };

  const handleJobRefresh = (jobId: string) => {
    // In a real implementation, this would fetch the latest status from the backend
    toast.success('Job status refreshed');
  };

  const handleCompareResults = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.result && simulationResult) {
      setSelectedComparison({
        simulation: {
          counts: simulationResult.counts || {},
          executionTime: simulationResult.executionTime || 0,
          fidelity: simulationResult.fidelity || 1,
          shots: job.shots
        },
        hardware: job.result,
        jobInfo: {
          name: job.name,
          backend: job.backend,
          submittedAt: job.submittedAt,
          completedAt: job.completedAt!
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="backends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="backends" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Backends
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export & Submit
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Job Queue
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Compare Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backends">
          <HardwareBackendManager
            backends={backends}
            onBackendSave={handleBackendSave}
          />
        </TabsContent>

        <TabsContent value="export">
          <QASMExporter
            circuit={circuit}
            backends={backends}
            onJobSubmit={handleJobSubmit}
          />
        </TabsContent>

        <TabsContent value="queue">
          <JobQueueManager
            jobs={jobs}
            onJobCancel={handleJobCancel}
            onJobResubmit={handleJobResubmit}
            onJobRefresh={handleJobRefresh}
          />
        </TabsContent>

        <TabsContent value="compare">
          {selectedComparison ? (
            <SimulationComparison
              simulationResult={selectedComparison.simulation}
              hardwareResult={selectedComparison.hardware}
              jobInfo={selectedComparison.jobInfo}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Complete a hardware job to compare results with simulation
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
