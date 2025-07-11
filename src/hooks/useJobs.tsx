import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QuantumGate, quantumSimulator } from '@/lib/quantumSimulator';
import { toast } from 'sonner';

export interface Job {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobData {
  name: string;
  priority: "high" | "medium" | "low";
  circuit: QuantumGate[];
  qubits: number;
  estimatedTime: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Transform database job to local job format
  const transformJob = (dbJob: any): Job => ({
    id: dbJob.id,
    name: dbJob.name,
    status: dbJob.status,
    progress: dbJob.progress,
    qubits: dbJob.qubits,
    estimatedTime: dbJob.estimated_time || '0m 0s',
    priority: dbJob.priority,
    circuit: dbJob.circuit_data || [],
    logs: dbJob.logs || [],
    startTime: dbJob.start_time ? new Date(dbJob.start_time) : undefined,
    endTime: dbJob.end_time ? new Date(dbJob.end_time) : undefined,
    createdAt: new Date(dbJob.created_at),
    updatedAt: new Date(dbJob.updated_at)
  });

  // Fetch jobs from database
  const fetchJobs = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quantum_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data?.map(transformJob) || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new job
  const createJob = useCallback(async (jobData: CreateJobData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quantum_jobs')
        .insert({
          user_id: user.id,
          name: jobData.name,
          priority: jobData.priority,
          circuit_data: jobData.circuit as any,
          qubits: jobData.qubits,
          estimated_time: jobData.estimatedTime,
          logs: [`[${new Date().toLocaleTimeString()}] INFO: Job created and queued`] as any
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Job created successfully');
      return transformJob(data);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  }, [user]);

  // Update job status and logs
  const updateJob = useCallback(async (jobId: string, updates: Partial<{
    status: Job['status'];
    progress: number;
    logs: string[];
    startTime: Date;
    endTime: Date;
  }>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      
      if (updates.status) updateData.status = updates.status;
      if (updates.progress !== undefined) updateData.progress = updates.progress;
      if (updates.logs) updateData.logs = updates.logs;
      if (updates.startTime) updateData.start_time = updates.startTime.toISOString();
      if (updates.endTime) updateData.end_time = updates.endTime.toISOString();

      const { error } = await supabase
        .from('quantum_jobs')
        .update(updateData)
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    }
  }, [user]);

  // Delete a job
  const deleteJob = useCallback(async (jobId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('quantum_jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  }, [user]);

  // Add log entry to a job
  const addJobLog = useCallback(async (jobId: string, level: string, message: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const timestamp = `[${new Date().toLocaleTimeString()}]`;
    const logEntry = `${timestamp} ${level}: ${message}`;
    const newLogs = [...job.logs, logEntry];

    await updateJob(jobId, { logs: newLogs });
  }, [jobs, updateJob]);

  // Simulate a job
  const simulateJob = useCallback(async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    try {
      await addJobLog(jobId, "INFO", "Starting quantum simulation...");
      
      if (job.circuit.length === 0) {
        throw new Error("Empty circuit - no gates to simulate");
      }

      // Validate circuit
      const maxQubit = Math.max(
        ...job.circuit.flatMap(gate => 
          gate.qubit !== undefined ? [gate.qubit] : gate.qubits || []
        )
      );
      
      if (maxQubit >= 5) {
        throw new Error(`Circuit uses qubit ${maxQubit}, but simulator supports max 5 qubits (0-4)`);
      }

      await addJobLog(jobId, "INFO", `Circuit validated: ${job.circuit.length} gates, ${maxQubit + 1} qubits`);
      
      // Update progress incrementally
      for (let progress = 10; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await updateJob(jobId, { progress });
        
        if (progress === 50) {
          await addJobLog(jobId, "INFO", "Processing quantum gates...");
        }
      }

      // Simulate the circuit
      const result = quantumSimulator.simulate(job.circuit);
      
      // Add detailed results to logs
      await addJobLog(jobId, "INFO", "Simulation completed successfully");
      await addJobLog(jobId, "INFO", `State vector: ${quantumSimulator.getStateString()}`);
      
      // Display qubit states
      for (const [index, qubitState] of result.qubitStates.entries()) {
        const prob = (qubitState.probability * 100).toFixed(1);
        const phase = (qubitState.phase * 180 / Math.PI).toFixed(1);
        await addJobLog(jobId, "INFO", `Qubit ${index}: ${qubitState.state} (${prob}% probability, ${phase}° phase)`);
      }

      // Display measurement probabilities for basis states
      const significantStates = result.measurementProbabilities
        .map((prob, index) => ({ index, prob }))
        .filter(({ prob }) => prob > 0.001)
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5);

      await addJobLog(jobId, "INFO", "Measurement probabilities:");
      for (const { index, prob } of significantStates) {
        const binaryState = index.toString(2).padStart(maxQubit + 1, '0');
        await addJobLog(jobId, "INFO", `  |${binaryState}⟩: ${(prob * 100).toFixed(2)}%`);
      }

      // Mark job as completed
      await updateJob(jobId, { 
        status: "completed", 
        progress: 100, 
        endTime: new Date() 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown simulation error";
      await addJobLog(jobId, "ERROR", `Simulation failed: ${errorMessage}`);
      
      // Mark job as failed
      await updateJob(jobId, { 
        status: "failed", 
        endTime: new Date() 
      });
    }
  }, [jobs, addJobLog, updateJob]);

  // Handle job actions
  const handleJobAction = useCallback(async (jobId: string, action: "run" | "pause" | "resume" | "delete") => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    switch (action) {
      case "run":
        if (job.status === "queued") {
          await updateJob(jobId, { 
            status: "running", 
            startTime: new Date() 
          });
          await addJobLog(jobId, "INFO", "Job started");
          // Start simulation asynchronously
          simulateJob(jobId);
        }
        break;
      case "pause":
        if (job.status === "running") {
          await updateJob(jobId, { status: "paused" });
          await addJobLog(jobId, "INFO", "Job paused");
        }
        break;
      case "resume":
        if (job.status === "paused") {
          await updateJob(jobId, { status: "running" });
          await addJobLog(jobId, "INFO", "Job resumed");
          // Resume simulation
          simulateJob(jobId);
        }
        break;
      case "delete":
        await deleteJob(jobId);
        break;
    }
  }, [jobs, updateJob, addJobLog, simulateJob, deleteJob]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchJobs();

    const channel = supabase
      .channel('quantum_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quantum_jobs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time job update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newJob = transformJob(payload.new);
            setJobs(prev => [newJob, ...prev]);
            toast.success(`Job "${newJob.name}" created`);
          } else if (payload.eventType === 'UPDATE') {
            const updatedJob = transformJob(payload.new);
            setJobs(prev => prev.map(job => 
              job.id === updatedJob.id ? updatedJob : job
            ));
          } else if (payload.eventType === 'DELETE') {
            setJobs(prev => prev.filter(job => job.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchJobs]);

  const getJobStats = useCallback(() => {
    const running = jobs.filter(j => j.status === "running").length;
    const queued = jobs.filter(j => j.status === "queued").length;
    const completed = jobs.filter(j => j.status === "completed").length;
    const failed = jobs.filter(j => j.status === "failed").length;
    return { running, queued, completed, failed };
  }, [jobs]);

  return {
    jobs,
    loading,
    createJob,
    updateJob,
    deleteJob,
    handleJobAction,
    addJobLog,
    simulateJob,
    getJobStats: getJobStats()
  };
}