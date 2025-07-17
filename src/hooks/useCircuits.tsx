
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
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useCircuits() {
  const { user } = useAuth();
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCircuits = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCircuits(data || []);
    } catch (error) {
      console.error('Error fetching circuits:', error);
      toast.error('Failed to load circuits');
    } finally {
      setLoading(false);
    }
  };

  const saveCircuit = async (
    name: string,
    circuitData: any,
    description?: string,
    isPublic = false
  ) => {
    if (!user) {
      toast.error('You must be signed in to save circuits');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('circuits')
        .insert({
          name,
          description,
          circuit_data: circuitData,
          is_public: isPublic,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setCircuits(prev => [data, ...prev]);
      toast.success('Circuit saved successfully');
      return data;
    } catch (error) {
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

    try {
      const { data, error } = await supabase
        .from('circuits')
        .update(updates)
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
    } catch (error) {
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
      toast.success('Circuit deleted successfully');
      return true;
    } catch (error) {
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
      false
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
    } catch (error) {
      console.error('Error loading circuit:', error);
      toast.error('Failed to load circuit');
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCircuits();
    } else {
      setCircuits([]);
    }
  }, [user]);

  return {
    circuits,
    loading,
    saveCircuit,
    updateCircuit,
    deleteCircuit,
    duplicateCircuit,
    loadCircuit,
    refetch: fetchCircuits,
  };
}
