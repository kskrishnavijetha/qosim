
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SecureCredential {
  service_name: string;
  credentials: any;
}

export function useSecureCredentials() {
  const [loading, setLoading] = useState(false);

  const storeCredentials = async (serviceName: string, credentials: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-credentials', {
        body: {
          service_name: serviceName,
          credentials,
          action: 'store'
        }
      });

      if (error) throw error;

      toast.success('Credentials stored securely');
      return { success: true };
    } catch (error: any) {
      console.error('Error storing credentials:', error);
      toast.error('Failed to store credentials');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const retrieveCredentials = async (serviceName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-credentials', {
        body: {
          service_name: serviceName,
          action: 'retrieve'
        }
      });

      if (error) throw error;

      return { credentials: data.credentials };
    } catch (error: any) {
      console.error('Error retrieving credentials:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const deleteCredentials = async (serviceName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-credentials', {
        body: {
          service_name: serviceName,
          action: 'delete'
        }
      });

      if (error) throw error;

      toast.success('Credentials deleted');
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting credentials:', error);
      toast.error('Failed to delete credentials');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    storeCredentials,
    retrieveCredentials,
    deleteCredentials,
  };
}
