
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EducatorProfile {
  id: string;
  user_id: string;
  institution_name?: string;
  institution_type?: string;
  department?: string;
  subjects?: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  plan_type: 'free_classroom' | 'premium_classroom' | 'enterprise';
  max_students: number;
  max_simulations_per_month: number;
  created_at: string;
  updated_at: string;
}

export function useEducatorProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('educator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching educator profile:', error);
      toast.error('Failed to load educator profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<EducatorProfile>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('educator_profiles')
      .insert({
        user_id: user.id,
        ...profileData,
      })
      .select()
      .single();

    if (error) throw error;

    setProfile(data);
    return data;
  };

  const updateProfile = async (updates: Partial<EducatorProfile>) => {
    if (!user || !profile) {
      throw new Error('User not authenticated or profile not found');
    }

    const { data, error } = await supabase
      .from('educator_profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setProfile(data);
    return data;
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
  };
}
