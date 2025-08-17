import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Circuit {
  id: string;
  name: string;
  description?: string;
  circuit_data: any;
  is_public: boolean;
  privacy_level: 'private' | 'authenticated_only' | 'public';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useCircuits() {
  const { user, loading: authLoading } = useAuth();
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("useCircuits - Hook state:", {
    user: user?.id,
    authLoading,
    circuits: circuits.length,
    loading,
    error
  });

  const fetchCircuits = async () => {
    if (!user) {
      console.log("useCircuits - No user, clearing state");
      setCircuits([]);
      setLoading(false);
      setError(null);
      return;
    }
    
    console.log("useCircuits - Fetching circuits for user:", user.id);
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('circuits')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      console.log("useCircuits - Supabase response:", { data, error: supabaseError });

      if (supabaseError) {
        console.error("useCircuits - Supabase error:", supabaseError);
        throw supabaseError;
      }

      const circuitData = data || [];
      console.log("useCircuits - Setting circuits:", circuitData.length);
      setCircuits(circuitData);
      setError(null);
    } catch (error: any) {
      console.error('useCircuits - Error fetching circuits:', error);
      setError(error.message || 'Failed to load circuits');
      setCircuits([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCircuit = async (
    name: string,
    circuitData: any,
    description?: string,
    privacyLevel: 'private' | 'authenticated_only' | 'public' = 'private'
  ) => {
    if (!user) {
      toast.error('You must be signed in to save circuits');
      return null;
    }

    // Show warning for public circuits
    if (privacyLevel === 'public') {
      const confirmed = window.confirm(
        'Are you sure you want to make this circuit public? It will be visible to anyone on the internet. Do not include sensitive research or proprietary algorithms.'
      );
      if (!confirmed) {
        return null;
      }
    }

    try {
      const { data, error } = await supabase
        .from('circuits')
        .insert({
          name,
          description,
          circuit_data: circuitData,
          privacy_level: privacyLevel,
          is_public: privacyLevel === 'public', // Keep for backward compatibility
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCircuits(prev => [data, ...prev]);
      toast.success('Circuit saved successfully');
      return data;
    } catch (error: any) {
      console.error('Error saving circuit:', error);
      toast.error('Failed to save circuit');
      return null;
    }
  };

  const updateCircuit = async (
    id: string,
    updates: Partial<Omit<Circuit, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user) return null;

    // Show warning if making circuit public
    if (updates.privacy_level === 'public') {
      const confirmed = window.confirm(
        'Are you sure you want to make this circuit public? It will be visible to anyone on the internet.'
      );
      if (!confirmed) {
        return null;
      }
    }

    try {
      // Keep is_public in sync with privacy_level for backward compatibility
      const updateData = {
        ...updates,
        is_public: updates.privacy_level === 'public'
      };

      const { data, error } = await supabase
        .from('circuits')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCircuits(prev => 
        prev.map(circuit => circuit.id === id ? data : circuit)
      );
      toast.success('Circuit updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating circuit:', error);
      toast.error('Failed to update circuit');
      return null;
    }
  };

  const deleteCircuit = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('circuits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCircuits(prev => prev.filter(circuit => circuit.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting circuit:', error);
      toast.error('Failed to delete circuit');
      return false;
    }
  };

  const duplicateCircuit = async (circuit: Circuit) => {
    return saveCircuit(
      `${circuit.name} (Copy)`,
      circuit.circuit_data,
      circuit.description,
      'private' // Always duplicate as private for security
    );
  };

  const loadCircuit = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error loading circuit:', error);
      toast.error('Failed to load circuit');
      return null;
    }
  };

  useEffect(() => {
    console.log("useCircuits - useEffect triggered", {
      user: user?.id,
      authLoading
    });
    
    if (!authLoading) {
      fetchCircuits();
    }
  }, [user, authLoading]);

  return {
    circuits,
    loading,
    error,
    saveCircuit,
    updateCircuit,
    deleteCircuit,
    duplicateCircuit,
    loadCircuit,
    refetch: fetchCircuits,
  };
}
