
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { toast } from 'sonner';

export interface CollaborativeUser {
  id: string;
  email: string;
  cursor?: { x: number; y: number };
  selectedGate?: string;
  lastSeen: Date;
  color: string;
}

export interface CircuitChange {
  type: 'gate_added' | 'gate_removed' | 'gate_moved' | 'gate_selected' | 'cursor_moved';
  data: any;
  userId: string;
  timestamp: Date;
  circuitId: string;
}

export interface CircuitComment {
  id: string;
  gateId: string;
  userId: string;
  content: string;
  resolved: boolean;
  timestamp: Date;
}

export function useRealtimeCircuitCollaboration(circuitId: string | null) {
  const { user } = useAuth();
  const [activeUsers, setActiveUsers] = useState<CollaborativeUser[]>([]);
  const [circuitChanges, setCircuitChanges] = useState<CircuitChange[]>([]);
  const [comments, setComments] = useState<CircuitComment[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  const broadcastChange = useCallback(async (
    type: CircuitChange['type'],
    data: any
  ) => {
    if (!circuitId || !user) return;

    const change: CircuitChange = {
      type,
      data,
      userId: user.id,
      timestamp: new Date(),
      circuitId
    };

    // Store in database
    await supabase
      .from('circuit_collaboration')
      .insert({
        circuit_id: circuitId,
        user_id: user.id,
        change_type: type,
        change_data: data,
        timestamp: change.timestamp.toISOString()
      });

    // Update local state
    setCircuitChanges(prev => [change, ...prev.slice(0, 49)]);
  }, [circuitId, user]);

  const broadcastCursorPosition = useCallback(async (x: number, y: number) => {
    if (!circuitId || !user) return;

    const channel = supabase.channel(`circuit_${circuitId}`);
    await channel.send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: { userId: user.id, x, y }
    });
  }, [circuitId, user]);

  const addComment = useCallback(async (gateId: string, content: string) => {
    if (!circuitId || !user) return;

    const comment: Omit<CircuitComment, 'id'> = {
      gateId,
      userId: user.id,
      content,
      resolved: false,
      timestamp: new Date()
    };

    const { data, error } = await supabase
      .from('circuit_comments')
      .insert({
        circuit_id: circuitId,
        gate_id: gateId,
        user_id: user.id,
        content,
        resolved: false
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add comment');
      return;
    }

    setComments(prev => [...prev, { ...comment, id: data.id }]);
    toast.success('Comment added');
  }, [circuitId, user]);

  const resolveComment = useCallback(async (commentId: string) => {
    const { error } = await supabase
      .from('circuit_comments')
      .update({ resolved: true })
      .eq('id', commentId);

    if (error) {
      toast.error('Failed to resolve comment');
      return;
    }

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: true }
        : comment
    ));
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!circuitId || !user) return;

    const channel = supabase
      .channel(`circuit_${circuitId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'circuit_collaboration',
        filter: `circuit_id=eq.${circuitId}`
      }, (payload) => {
        const change = payload.new as any;
        if (change.user_id === user.id) return; // Skip own changes

        setCircuitChanges(prev => [{
          type: change.change_type,
          data: change.change_data,
          userId: change.user_id,
          timestamp: new Date(change.timestamp),
          circuitId: change.circuit_id
        }, ...prev.slice(0, 49)]);

        // Show notification for important changes
        if (change.change_type === 'gate_added') {
          toast.info('Collaborator added a gate');
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'circuit_comments',
        filter: `circuit_id=eq.${circuitId}`
      }, (payload) => {
        const comment = payload.new as any;
        if (comment.user_id === user.id) return;

        setComments(prev => [...prev, {
          id: comment.id,
          gateId: comment.gate_id,
          userId: comment.user_id,
          content: comment.content,
          resolved: comment.resolved,
          timestamp: new Date(comment.created_at)
        }]);
      })
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        const { userId, x, y } = payload.payload;
        if (userId === user.id) return;

        setActiveUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, cursor: { x, y }, lastSeen: new Date() }
            : u
        ));
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.entries(presenceState).map(([key, presence]: [string, any]) => ({
          id: key,
          email: presence[0].email,
          lastSeen: new Date(presence[0].last_seen),
          color: userColors[Math.abs(key.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % userColors.length]
        }));
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const newUser = newPresences[0];
        toast.info(`${newUser.email} joined the session`);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const leftUser = leftPresences[0];
        toast.info(`${leftUser.email} left the session`);
      })
      .subscribe(async (status) => {
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Track presence
          await channel.track({
            user_id: user.id,
            email: user.email,
            last_seen: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circuitId, user]);

  return {
    activeUsers,
    circuitChanges,
    comments,
    isConnected,
    broadcastChange,
    broadcastCursorPosition,
    addComment,
    resolveComment
  };
}
