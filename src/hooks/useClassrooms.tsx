
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Classroom {
  id: string;
  educator_id: string;
  name: string;
  description?: string;
  subject?: string;
  semester?: string;
  access_code: string;
  is_active: boolean;
  max_students: number;
  created_at: string;
  updated_at: string;
}

export function useClassrooms() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClassrooms = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setClassrooms(data || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      toast.error('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  const createClassroom = async (classroomData: Partial<Classroom>) => {
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
      .from('classrooms')
      .insert({
        educator_id: profile.id,
        ...classroomData,
      })
      .select()
      .single();

    if (error) throw error;

    setClassrooms(prev => [data, ...prev]);
    return data;
  };

  const updateClassroom = async (id: string, updates: Partial<Classroom>) => {
    const { data, error } = await supabase
      .from('classrooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    setClassrooms(prev => 
      prev.map(classroom => classroom.id === id ? data : classroom)
    );
    return data;
  };

  const deleteClassroom = async (id: string) => {
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setClassrooms(prev => prev.filter(classroom => classroom.id !== id));
  };

  useEffect(() => {
    if (user) {
      fetchClassrooms();
    } else {
      setClassrooms([]);
    }
  }, [user]);

  return {
    classrooms,
    loading,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    refetch: fetchClassrooms,
  };
}
