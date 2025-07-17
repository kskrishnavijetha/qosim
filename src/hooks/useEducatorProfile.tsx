
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

type EducatorProfile = {
  id: string;
  user_id: string;
  institution_name: string | null;
  institution_type: 'university' | 'college' | 'high_school' | 'middle_school' | 'elementary' | 'other' | null;
  department: string | null;
  subjects: string[] | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  plan_type: 'free_classroom' | 'premium_classroom' | 'enterprise';
  max_students: number;
  max_simulations_per_month: number;
  created_at: string;
  updated_at: string;
};

type EducatorProfileInsert = Omit<EducatorProfile, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'verification_status' | 'max_students' | 'max_simulations_per_month'>;

export const useEducatorProfile = () => {
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('educator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setProfile(data as EducatorProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: EducatorProfileInsert) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { data, error } = await supabase
        .from('educator_profiles')
        .insert({
          user_id: user.id,
          institution_name: profileData.institution_name,
          institution_type: profileData.institution_type,
          department: profileData.department,
          subjects: profileData.subjects,
          plan_type: profileData.plan_type,
          verification_status: 'pending',
          max_students: 30,
          max_simulations_per_month: 500
        })
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data as EducatorProfile);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  const updateProfile = async (updates: Partial<EducatorProfileInsert>) => {
    if (!user || !profile) throw new Error('User not authenticated or profile not found');
    
    try {
      const { data, error } = await supabase
        .from('educator_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data as EducatorProfile);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchProfile
  };
};
