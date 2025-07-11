import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface QuantumFile {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  sizeDisplay: string;
  superposition: boolean;
  favorite: boolean;
  tags: string[];
  versions: number;
  lastVersion: string;
  parentFolderId?: string;
  contentData?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFileData {
  name: string;
  type: string;
  sizeBytes: number;
  sizeDisplay: string;
  contentData?: any;
  superposition?: boolean;
  tags?: string[];
  parentFolderId?: string;
}

export function useQuantumFiles() {
  const [files, setFiles] = useState<QuantumFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Transform database file to local format
  const transformFile = (dbFile: any): QuantumFile => ({
    id: dbFile.id,
    name: dbFile.name,
    type: dbFile.type,
    sizeBytes: dbFile.size_bytes,
    sizeDisplay: dbFile.size_display,
    superposition: dbFile.superposition,
    favorite: dbFile.favorite,
    tags: dbFile.tags || [],
    versions: dbFile.versions,
    lastVersion: dbFile.last_version,
    parentFolderId: dbFile.parent_folder_id,
    contentData: dbFile.content_data,
    createdAt: new Date(dbFile.created_at),
    updatedAt: new Date(dbFile.updated_at)
  });

  // Fetch files from database
  const fetchFiles = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quantum_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setFiles(data.map(transformFile));
      } else {
        // Initialize default files
        await initializeDefaultFiles();
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize default files
  const initializeDefaultFiles = useCallback(async () => {
    if (!user) return;

    const defaultFiles = [
      { 
        name: "bell_state.qasm", 
        type: "circuit", 
        sizeBytes: 2400, 
        sizeDisplay: "2.4 KB",
        superposition: true,
        favorite: true,
        tags: ["bell", "entanglement"],
        versions: 3,
        lastVersion: "v1.2"
      },
      { 
        name: "grover_search.py", 
        type: "algorithm", 
        sizeBytes: 8700, 
        sizeDisplay: "8.7 KB",
        superposition: false,
        favorite: false,
        tags: ["search", "grover"],
        versions: 5,
        lastVersion: "v2.1"
      },
      { 
        name: "error_correction/", 
        type: "folder", 
        sizeBytes: 0, 
        sizeDisplay: "15 files",
        superposition: true,
        favorite: false,
        tags: ["error-correction"],
        versions: 1,
        lastVersion: "v1.0"
      },
      { 
        name: "quantum_ml_model.qnn", 
        type: "model", 
        sizeBytes: 47185920, 
        sizeDisplay: "45.2 MB",
        superposition: false,
        favorite: true,
        tags: ["ml", "neural"],
        versions: 8,
        lastVersion: "v3.4"
      },
      { 
        name: "results.json", 
        type: "data", 
        sizeBytes: 1258291, 
        sizeDisplay: "1.2 MB",
        superposition: true,
        favorite: false,
        tags: ["results", "data"],
        versions: 2,
        lastVersion: "v1.1"
      }
    ];

    try {
      for (const file of defaultFiles) {
        await supabase
          .from('quantum_files')
          .insert({
            user_id: user.id,
            name: file.name,
            type: file.type,
            size_bytes: file.sizeBytes,
            size_display: file.sizeDisplay,
            superposition: file.superposition,
            favorite: file.favorite,
            tags: file.tags,
            versions: file.versions,
            last_version: file.lastVersion
          });
      }
    } catch (error) {
      console.error('Error initializing files:', error);
      toast.error('Failed to initialize files');
    }
  }, [user]);

  // Create a new file
  const createFile = useCallback(async (fileData: CreateFileData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quantum_files')
        .insert({
          user_id: user.id,
          name: fileData.name,
          type: fileData.type,
          size_bytes: fileData.sizeBytes,
          size_display: fileData.sizeDisplay,
          content_data: fileData.contentData,
          superposition: fileData.superposition || false,
          tags: fileData.tags || [],
          parent_folder_id: fileData.parentFolderId
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('File created successfully');
      return transformFile(data);
    } catch (error) {
      console.error('Error creating file:', error);
      toast.error('Failed to create file');
    }
  }, [user]);

  // Update file
  const updateFile = useCallback(async (fileId: string, updates: Partial<{
    name: string;
    favorite: boolean;
    tags: string[];
    superposition: boolean;
    contentData: any;
    versions: number;
    lastVersion: string;
  }>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.favorite !== undefined) updateData.favorite = updates.favorite;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.superposition !== undefined) updateData.superposition = updates.superposition;
      if (updates.contentData !== undefined) updateData.content_data = updates.contentData;
      if (updates.versions !== undefined) updateData.versions = updates.versions;
      if (updates.lastVersion !== undefined) updateData.last_version = updates.lastVersion;

      const { error } = await supabase
        .from('quantum_files')
        .update(updateData)
        .eq('id', fileId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file');
    }
  }, [user]);

  // Delete file
  const deleteFile = useCallback(async (fileId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('quantum_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  }, [user]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    await updateFile(fileId, { favorite: !file.favorite });
  }, [files, updateFile]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchFiles();

    const channel = supabase
      .channel('quantum_files_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quantum_files',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time file update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newFile = transformFile(payload.new);
            setFiles(prev => [newFile, ...prev]);
            toast.success(`File "${newFile.name}" created`);
          } else if (payload.eventType === 'UPDATE') {
            const updatedFile = transformFile(payload.new);
            setFiles(prev => prev.map(file => 
              file.id === updatedFile.id ? updatedFile : file
            ));
          } else if (payload.eventType === 'DELETE') {
            setFiles(prev => prev.filter(file => file.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchFiles]);

  const getFileStats = useCallback(() => {
    const favoriteCount = files.filter(f => f.favorite).length;
    const superpositionCount = files.filter(f => f.superposition).length;
    const totalSize = files.reduce((sum, f) => sum + f.sizeBytes, 0);
    
    return { 
      favoriteCount, 
      superpositionCount, 
      totalSize,
      totalFiles: files.length
    };
  }, [files]);

  return {
    files,
    loading,
    createFile,
    updateFile,
    deleteFile,
    toggleFavorite,
    getFileStats: getFileStats()
  };
}