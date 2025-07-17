
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type LMSIntegration = {
  id: string;
  educator_id: string;
  lms_type: 'canvas' | 'moodle' | 'blackboard' | 'google_classroom' | 'schoology';
  integration_data: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type LMSIntegrationInsert = Omit<LMSIntegration, 'id' | 'educator_id' | 'created_at' | 'updated_at'>;

export const useLMSIntegrations = (educatorId: string) => {
  const [integrations, setIntegrations] = useState<LMSIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (educatorId) {
      fetchIntegrations();
    }
  }, [educatorId]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lms_integrations')
        .select('*')
        .eq('educator_id', educatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data as LMSIntegration[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch LMS integrations');
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (integrationData: LMSIntegrationInsert & { lms_type: 'canvas' | 'moodle' | 'blackboard' | 'google_classroom' | 'schoology' }) => {
    try {
      const { data, error } = await supabase
        .from('lms_integrations')
        .insert({
          educator_id: educatorId,
          lms_type: integrationData.lms_type,
          integration_data: integrationData.integration_data || {},
          is_active: integrationData.is_active ?? true
        })
        .select()
        .single();

      if (error) throw error;
      
      setIntegrations(prev => [data as LMSIntegration, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create LMS integration');
    }
  };

  const updateIntegration = async (id: string, updates: Partial<LMSIntegrationInsert>) => {
    try {
      const { data, error } = await supabase
        .from('lms_integrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === id ? data as LMSIntegration : integration
      ));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update LMS integration');
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lms_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete LMS integration');
    }
  };

  return {
    integrations,
    loading,
    error,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    refetch: fetchIntegrations
  };
};
