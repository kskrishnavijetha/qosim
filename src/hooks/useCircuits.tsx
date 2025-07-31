
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

  console.log("useCircuits - Hook initialized");
  console.log("useCircuits - user:", user);

  const fetchCircuits = async () => {
    if (!user) {
      console.log("useCircuits - No user, clearing circuits and returning");
      setCircuits([]);
      return;
    }
    
    console.log("useCircuits - Fetching circuits for user:", user.id);
    setLoading(true);
    
    try {
      console.log("useCircuits - Making Supabase query...");
      const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      console.log("useCircuits - Supabase response data:", data);
      console.log("useCircuits - Supabase response error:", error);

      if (error) {
        console.error("useCircuits - Supabase error:", error);
        throw error;
      }

      const circuitData = data || [];
      console.log("useCircuits - Setting circuits to:", circuitData);
      setCircuits(circuitData);
    } catch (error) {
      console.error('useCircuits - Error fetching circuits:', error);
      toast.error('Failed to load circuits');
      setCircuits([]); // Set empty array on error
    } finally {
      console.log("useCircuits - Setting loading to false");
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
    console.log("useCircuits - useEffect triggered");
    console.log("useCircuits - user changed to:", user);
    
    if (user) {
      console.log("useCircuits - User exists, fetching circuits");
      fetchCircuits();
    } else {
      console.log("useCircuits - No user, clearing circuits");
      setCircuits([]);
      setLoading(false);
    }
  }, [user]);

  console.log("useCircuits - Returning hook values:");
  console.log("useCircuits - circuits:", circuits);
  console.log("useCircuits - loading:", loading);

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
