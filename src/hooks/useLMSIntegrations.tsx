
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LMSIntegration {
  id: string;
  educator_id: string;
  lms_type: 'canvas' | 'moodle' | 'blackboard' | 'google_classroom' | 'schoology';
  integration_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useLMSIntegrations() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<LMSIntegration[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIntegrations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lms_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching LMS integrations:', error);
      toast.error('Failed to load LMS integrations');
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (integrationData: Partial<LMSIntegration>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    // First get the educator profile
    const { data: profile } = await supabase
      .from('educator_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      throw new Error('Educator profile not found');
    }

    const { data, error } = await supabase
      .from('lms_integrations')
      .insert({
        educator_id: profile.id,
        ...integrationData,
      })
      .select()
      .single();

    if (error) throw error;

    setIntegrations(prev => [data, ...prev]);
    return data;
  };

  const updateIntegration = async (id: string, updates: Partial<LMSIntegration>) => {
    const { data, error } = await supabase
      .from('lms_integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setIntegrations(prev => 
      prev.map(integration => integration.id === id ? data : integration)
    );
    return data;
  };

  const deleteIntegration = async (id: string) => {
    const { error } = await supabase
      .from('lms_integrations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setIntegrations(prev => prev.filter(integration => integration.id !== id));
    toast.success('Integration removed successfully');
  };

  useEffect(() => {
    if (user) {
      fetchIntegrations();
    } else {
      setIntegrations([]);
    }
  }, [user]);

  return {
    integrations,
    loading,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    refetch: fetchIntegrations,
  };
}
