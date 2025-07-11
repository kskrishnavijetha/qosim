import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface RuntimeLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'quantum';
  component: string;
  message: string;
  details?: string;
  metadata?: any;
  createdAt: Date;
}

export interface CreateLogData {
  level: 'info' | 'warning' | 'error' | 'quantum';
  component: string;
  message: string;
  details?: string;
  metadata?: any;
}

export function useRuntimeLogs() {
  const [logs, setLogs] = useState<RuntimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Transform database log to local format
  const transformLog = (dbLog: any): RuntimeLog => ({
    id: dbLog.id,
    timestamp: new Date(dbLog.timestamp),
    level: dbLog.level,
    component: dbLog.component,
    message: dbLog.message,
    details: dbLog.details,
    metadata: dbLog.metadata,
    createdAt: new Date(dbLog.created_at)
  });

  // Fetch logs from database
  const fetchLogs = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('runtime_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        setLogs(data.map(transformLog));
      } else {
        // Initialize default logs
        await initializeDefaultLogs();
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize default logs
  const initializeDefaultLogs = useCallback(async () => {
    if (!user) return;

    const defaultLogs = [
      {
        level: "quantum" as const,
        component: "QOS-CORE",
        message: "Quantum state |ψ⟩ = 0.707|0⟩ + 0.707|1⟩ initialized on qubit 0",
        details: "Bell state preparation successful"
      },
      {
        level: "info" as const,
        component: "SCHEDULER",
        message: "Job Q-4571 'Quantum Teleportation' started execution",
        details: "Allocated 6 qubits from QMB-0"
      },
      {
        level: "warning" as const,
        component: "MEMORY",
        message: "Coherence time degradation detected on qubit 8",
        details: "Remaining coherence: 23.4μs (threshold: 20μs)"
      },
      {
        level: "error" as const,
        component: "QEC",
        message: "Quantum error correction triggered",
        details: "Bit-flip error on qubit 15, syndrome: 101"
      },
      {
        level: "quantum" as const,
        component: "ENTANGLER",
        message: "Entanglement established between qubits 2-3",
        details: "Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 created"
      },
      {
        level: "info" as const,
        component: "QFS",
        message: "File 'bell_state.qasm' accessed in superposition",
        details: "Quantum read operation completed"
      }
    ];

    try {
      for (const log of defaultLogs) {
        await supabase
          .from('runtime_logs')
          .insert({
            user_id: user.id,
            ...log
          });
      }
    } catch (error) {
      console.error('Error initializing logs:', error);
      toast.error('Failed to initialize logs');
    }
  }, [user]);

  // Create a new log entry
  const createLog = useCallback(async (logData: CreateLogData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('runtime_logs')
        .insert({
          user_id: user.id,
          level: logData.level,
          component: logData.component,
          message: logData.message,
          details: logData.details,
          metadata: logData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      return transformLog(data);
    } catch (error) {
      console.error('Error creating log:', error);
      toast.error('Failed to create log');
    }
  }, [user]);

  // Generate a random log entry for simulation
  const generateRandomLog = useCallback(async () => {
    const components = ["QOS-CORE", "SCHEDULER", "MEMORY", "QEC", "ENTANGLER", "QFS"];
    const levels: CreateLogData['level'][] = ["info", "warning", "error", "quantum"];
    
    const messages = {
      "QOS-CORE": [
        "Quantum measurement completed on qubit {qubit}",
        "State vector normalized successfully",
        "Quantum gate {gate} applied to qubit {qubit}"
      ],
      "SCHEDULER": [
        "Job Q-{job} queued for execution",
        "Resource allocation completed",
        "Priority queue updated"
      ],
      "MEMORY": [
        "Coherence refreshed on qubits {range}",
        "Memory bank {bank} accessed",
        "Quantum state cached"
      ],
      "QEC": [
        "Error correction cycle completed",
        "Syndrome detection active",
        "Logical qubit error rate: {rate}%"
      ],
      "ENTANGLER": [
        "GHZ state |GHZ⟩ = (|000⟩ + |111⟩)/√2 prepared",
        "Entanglement fidelity: {fidelity}",
        "Bell pair generated"
      ],
      "QFS": [
        "Quantum file write operation initiated",
        "File system coherence check passed",
        "Virtual quantum filesystem mounted"
      ]
    };

    const component = components[Math.floor(Math.random() * components.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const messageTemplates = messages[component as keyof typeof messages];
    const message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)]
      .replace('{qubit}', Math.floor(Math.random() * 16).toString())
      .replace('{job}', Math.floor(Math.random() * 9999).toString())
      .replace('{gate}', ['H', 'X', 'Y', 'Z', 'CNOT', 'T'][Math.floor(Math.random() * 6)])
      .replace('{range}', `${Math.floor(Math.random() * 16)}-${Math.floor(Math.random() * 16) + 16}`)
      .replace('{bank}', ['QMB-0', 'QMB-1', 'QMB-2'][Math.floor(Math.random() * 3)])
      .replace('{rate}', (Math.random() * 5).toFixed(2))
      .replace('{fidelity}', (0.9 + Math.random() * 0.1).toFixed(3));

    await createLog({
      level,
      component,
      message,
      details: `Generated at ${new Date().toLocaleTimeString()}`
    });
  }, [createLog]);

  // Clear all logs
  const clearLogs = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('runtime_logs')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Logs cleared successfully');
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Failed to clear logs');
    }
  }, [user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchLogs();

    const channel = supabase
      .channel('runtime_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'runtime_logs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time log update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newLog = transformLog(payload.new);
            setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep only latest 100 logs
          } else if (payload.eventType === 'DELETE') {
            if (payload.old.user_id === user.id) {
              setLogs([]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchLogs]);

  // Auto-generate logs for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      if (logs.length < 50) { // Don't generate too many logs
        generateRandomLog();
      }
    }, 15000); // Generate a log every 15 seconds

    return () => clearInterval(interval);
  }, [logs.length, generateRandomLog]);

  const getLogStats = useCallback(() => {
    const errors = logs.filter(l => l.level === 'error').length;
    const warnings = logs.filter(l => l.level === 'warning').length;
    const quantum = logs.filter(l => l.level === 'quantum').length;
    const info = logs.filter(l => l.level === 'info').length;
    
    return { errors, warnings, quantum, info };
  }, [logs]);

  return {
    logs,
    loading,
    createLog,
    generateRandomLog,
    clearLogs,
    getLogStats: getLogStats()
  };
}