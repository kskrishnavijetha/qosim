
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Classroom = Tables<'classrooms'>;
type ClassroomInsert = Omit<Classroom, 'id' | 'created_at' | 'updated_at' | 'access_code'>;

export const useClassrooms = (educatorId: string) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (educatorId) {
      fetchClassrooms();
    }
  }, [educatorId]);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .eq('educator_id', educatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClassrooms(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classrooms');
    } finally {
      setLoading(false);
    }
  };

  const createClassroom = async (classroomData: Partial<ClassroomInsert> & { name: string }) => {
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .insert({
          educator_id: educatorId,
          name: classroomData.name,
          description: classroomData.description || null,
          subject: classroomData.subject || null,
          semester: classroomData.semester || null,
          max_students: classroomData.max_students || 30,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      setClassrooms(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create classroom');
    }
  };

  const updateClassroom = async (id: string, updates: Partial<ClassroomInsert>) => {
    try {
      const { data, error } = await supabase
        .from('classrooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setClassrooms(prev => prev.map(classroom => 
        classroom.id === id ? data : classroom
      ));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update classroom');
    }
  };

  const deleteClassroom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClassrooms(prev => prev.filter(classroom => classroom.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete classroom');
    }
  };

  return {
    classrooms,
    loading,
    error,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    refetch: fetchClassrooms
  };
};
