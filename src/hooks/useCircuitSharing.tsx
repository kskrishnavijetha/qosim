
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SharedCircuit {
  id: string;
  circuit_id: string;
  share_token: string;
  created_by: string;
  permission_level: 'view' | 'edit' | 'admin';
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CircuitCollaborator {
  id: string;
  circuit_id: string;
  user_id: string;
  permission_level: 'view' | 'edit' | 'admin';
  invited_by: string;
  invited_at: string;
  accepted_at?: string;
  is_active: boolean;
}

export function useCircuitSharing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sharedCircuits, setSharedCircuits] = useState<SharedCircuit[]>([]);
  const [collaborators, setCollaborators] = useState<Record<string, CircuitCollaborator[]>>({});

  const createShareLink = useCallback(async (
    circuitId: string,
    permissionLevel: 'view' | 'edit' = 'view',
    expiresIn?: number // hours
  ) => {
    if (!user) {
      toast.error('You must be signed in to share circuits');
      return null;
    }

    setLoading(true);
    try {
      const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString() : null;
      
      const { data, error } = await supabase
        .from('shared_circuits')
        .insert({
          circuit_id: circuitId,
          created_by: user.id,
          permission_level: permissionLevel,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/shared/${data.share_token}`;
      toast.success('Share link created successfully');
      return { ...data, shareUrl };
    } catch (error) {
      console.error('Error creating share link:', error);
      toast.error('Failed to create share link');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const forkCircuit = useCallback(async (circuitId: string, newName?: string) => {
    if (!user) {
      toast.error('You must be signed in to fork circuits');
      return null;
    }

    setLoading(true);
    try {
      // Get the original circuit data
      const { data: originalCircuit, error: fetchError } = await supabase
        .from('circuits')
        .select('*')
        .eq('id', circuitId)
        .single();

      if (fetchError) throw fetchError;

      // Create a new circuit with the same data
      const { data: forkedCircuit, error: createError } = await supabase
        .from('circuits')
        .insert({
          name: newName || `${originalCircuit.name} (Fork)`,
          description: originalCircuit.description,
          circuit_data: originalCircuit.circuit_data,
          is_public: false,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      toast.success('Circuit forked successfully');
      return forkedCircuit;
    } catch (error) {
      console.error('Error forking circuit:', error);
      toast.error('Failed to fork circuit');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const inviteCollaborator = useCallback(async (
    circuitId: string,
    userEmail: string,
    permissionLevel: 'view' | 'edit' | 'admin' = 'edit'
  ) => {
    if (!user) {
      toast.error('You must be signed in to invite collaborators');
      return false;
    }

    setLoading(true);
    try {
      // For now, we'll use a simplified approach - in production you'd want to look up users by email
      // This is a placeholder implementation
      const { data, error } = await supabase
        .from('circuit_collaborators')
        .insert({
          circuit_id: circuitId,
          user_id: userEmail, // In production, this would be resolved from email
          permission_level: permissionLevel,
          invited_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Collaborator invited successfully');
      return true;
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast.error('Failed to invite collaborator');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const logActivity = useCallback(async (
    circuitId: string,
    actionType: 'gate_added' | 'gate_removed' | 'gate_moved' | 'circuit_saved' | 'user_joined' | 'user_left',
    actionData: any = {}
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('circuit_activity_log')
        .insert({
          circuit_id: circuitId,
          user_id: user.id,
          action_type: actionType,
          action_data: actionData,
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  const fetchSharedCircuits = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shared_circuits')
        .select('*')
        .eq('created_by', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSharedCircuits(data || []);
    } catch (error) {
      console.error('Error fetching shared circuits:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getCircuitByShareToken = useCallback(async (shareToken: string) => {
    try {
      const { data: sharedCircuit, error: shareError } = await supabase
        .from('shared_circuits')
        .select('*, circuits(*)')
        .eq('share_token', shareToken)
        .eq('is_active', true)
        .single();

      if (shareError) throw shareError;

      // Check if expired
      if (sharedCircuit.expires_at && new Date(sharedCircuit.expires_at) < new Date()) {
        throw new Error('Share link has expired');
      }

      return sharedCircuit;
    } catch (error) {
      console.error('Error fetching circuit by share token:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSharedCircuits();
    }
  }, [user, fetchSharedCircuits]);

  return {
    loading,
    sharedCircuits,
    collaborators,
    createShareLink,
    forkCircuit,
    inviteCollaborator,
    logActivity,
    getCircuitByShareToken,
    refetch: fetchSharedCircuits,
  };
}
