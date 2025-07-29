
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCircuitSharing } from '@/hooks/useCircuitSharing';
import { toast } from 'sonner';

interface CollaborativeUser {
  id: string;
  name: string;
  cursor?: { x: number; y: number };
  lastSeen: string;
}

interface CollaborativeChange {
  type: 'gate_added' | 'gate_removed' | 'gate_moved' | 'circuit_saved' | 'comment_added' | 'circuit_exported' | 'circuit_imported' | 'circuit_optimized' | 'simulation_completed' | 'user_joined' | 'user_left';
  data: any;
  userId: string;
  timestamp: string;
}

export function useRealtimeCollaboration(circuitId: string | null) {
  const { user } = useAuth();
  const { logActivity } = useCircuitSharing();
  const [activeUsers, setActiveUsers] = useState<CollaborativeUser[]>([]);
  const [recentChanges, setRecentChanges] = useState<CollaborativeChange[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const broadcastChange = useCallback(async (
    type: 'gate_added' | 'gate_removed' | 'gate_moved' | 'circuit_saved' | 'comment_added' | 'circuit_exported' | 'circuit_imported' | 'circuit_optimized' | 'simulation_completed' | 'user_joined' | 'user_left',
    data: any
  ) => {
    if (!circuitId || !user) return;

    // Log to database
    await logActivity(circuitId, type, data);

    // Add to local state for immediate feedback
    const change: CollaborativeChange = {
      type,
      data,
      userId: user.id,
      timestamp: new Date().toISOString(),
    };

    setRecentChanges(prev => [change, ...prev.slice(0, 9)]); // Keep last 10 changes
  }, [circuitId, user, logActivity]);

  const joinCircuit = useCallback(async () => {
    if (!circuitId || !user) return;

    await logActivity(circuitId, 'user_joined', { 
      userName: user.email,
      timestamp: new Date().toISOString() 
    });
    
    toast.success('Joined collaborative session');
  }, [circuitId, user, logActivity]);

  const leaveCircuit = useCallback(async () => {
    if (!circuitId || !user) return;

    await logActivity(circuitId, 'user_left', { 
      userName: user.email,
      timestamp: new Date().toISOString() 
    });
  }, [circuitId, user, logActivity]);

  // Set up real-time subscription for circuit activity
  useEffect(() => {
    if (!circuitId) return;

    const channel = supabase
      .channel(`circuit_${circuitId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'circuit_activity_log',
        filter: `circuit_id=eq.${circuitId}`,
      }, (payload) => {
        const activity = payload.new;
        
        // Don't show our own changes
        if (activity.user_id === user?.id) return;

        const change: CollaborativeChange = {
          type: activity.action_type as any,
          data: activity.action_data,
          userId: activity.user_id,
          timestamp: activity.timestamp,
        };

        setRecentChanges(prev => [change, ...prev.slice(0, 9)]);

        // Show toast for important changes
        if (activity.action_type === 'user_joined') {
          toast.info(`${activity.action_data.userName} joined the session`);
        } else if (activity.action_type === 'user_left') {
          toast.info(`${activity.action_data.userName} left the session`);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'circuits',
        filter: `id=eq.${circuitId}`,
      }, (payload) => {
        // Circuit was updated by another user
        if (payload.new.user_id !== user?.id) {
          toast.info('Circuit updated by collaborator');
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          joinCircuit();
        }
      });

    // Cleanup on unmount
    return () => {
      leaveCircuit();
      supabase.removeChannel(channel);
    };
  }, [circuitId, user?.id, joinCircuit, leaveCircuit]);

  // Track user presence (simplified version)
  useEffect(() => {
    if (!user || !circuitId) return;

    const updatePresence = () => {
      setActiveUsers(prev => {
        const filtered = prev.filter(u => u.id !== user.id);
        return [...filtered, {
          id: user.id,
          name: user.email || 'Anonymous',
          lastSeen: new Date().toISOString(),
        }];
      });
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user, circuitId]);

  return {
    activeUsers,
    recentChanges,
    isConnected,
    broadcastChange,
    joinCircuit,
    leaveCircuit,
  };
}
