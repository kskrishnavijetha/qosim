import { useState, useEffect, useCallback } from 'react';

interface QFSFile {
  id: string;
  name: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  lastAccessed: number;
}

interface UseDeferredQFSLoaderOptions {
  maxConcurrentLoads?: number;
  priorityThreshold?: number;
}

export function useDeferredQFSLoader(options: UseDeferredQFSLoaderOptions = {}) {
  const { maxConcurrentLoads = 3, priorityThreshold = 5000 } = options;
  
  const [loadingFiles, setLoadingFiles] = useState<Set<string>>(new Set());
  const [loadedFiles, setLoadedFiles] = useState<Map<string, QFSFile>>(new Map());
  const [loadQueue, setLoadQueue] = useState<QFSFile[]>([]);
  const [activeLoads, setActiveLoads] = useState(0);

  // Simulate QFS file loading with priority
  const loadQFSFile = useCallback(async (file: QFSFile): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate network delay based on priority
      const delay = file.priority === 'high' ? 100 : file.priority === 'medium' ? 300 : 800;
      setTimeout(() => {
        resolve(`// QFS Content for ${file.name}\n// Priority: ${file.priority}\n// Loaded at: ${new Date().toISOString()}`);
      }, delay);
    });
  }, []);

  // Process the load queue
  const processQueue = useCallback(async () => {
    if (activeLoads >= maxConcurrentLoads || loadQueue.length === 0) {
      return;
    }

    // Sort queue by priority (high -> medium -> low) and last accessed time
    const sortedQueue = [...loadQueue].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.lastAccessed - a.lastAccessed;
    });

    const nextFile = sortedQueue[0];
    if (!nextFile) return;

    setLoadQueue(prev => prev.filter(f => f.id !== nextFile.id));
    setLoadingFiles(prev => new Set([...prev, nextFile.id]));
    setActiveLoads(prev => prev + 1);

    try {
      const content = await loadQFSFile(nextFile);
      setLoadedFiles(prev => new Map([...prev, [nextFile.id, { ...nextFile, content }]]));
    } catch (error) {
      console.error(`Failed to load QFS file ${nextFile.name}:`, error);
    } finally {
      setLoadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(nextFile.id);
        return newSet;
      });
      setActiveLoads(prev => prev - 1);
    }
  }, [activeLoads, loadQueue, maxConcurrentLoads, loadQFSFile]);

  // Effect to process queue when conditions change
  useEffect(() => {
    processQueue();
  }, [processQueue]);

  // Add file to load queue
  const requestLoad = useCallback((file: Omit<QFSFile, 'lastAccessed'>) => {
    const fileWithTimestamp = { ...file, lastAccessed: Date.now() };
    
    // Don't queue if already loaded or loading
    if (loadedFiles.has(file.id) || loadingFiles.has(file.id)) {
      return;
    }

    // For high priority files, add to front of queue
    if (file.priority === 'high') {
      setLoadQueue(prev => [fileWithTimestamp, ...prev.filter(f => f.id !== file.id)]);
    } else {
      setLoadQueue(prev => [...prev.filter(f => f.id !== file.id), fileWithTimestamp]);
    }
  }, [loadedFiles, loadingFiles]);

  // Get loaded file content
  const getFile = useCallback((fileId: string): QFSFile | null => {
    const file = loadedFiles.get(fileId);
    if (file) {
      // Update last accessed time
      const updatedFile = { ...file, lastAccessed: Date.now() };
      setLoadedFiles(prev => new Map([...prev, [fileId, updatedFile]]));
      return updatedFile;
    }
    return null;
  }, [loadedFiles]);

  // Clear old files from memory based on access time
  const cleanupOldFiles = useCallback(() => {
    const now = Date.now();
    setLoadedFiles(prev => {
      const filtered = new Map();
      for (const [id, file] of prev) {
        if (now - file.lastAccessed < priorityThreshold || file.priority === 'high') {
          filtered.set(id, file);
        }
      }
      return filtered;
    });
  }, [priorityThreshold]);

  // Cleanup effect
  useEffect(() => {
    const interval = setInterval(cleanupOldFiles, 30000); // Cleanup every 30 seconds
    return () => clearInterval(interval);
  }, [cleanupOldFiles]);

  return {
    requestLoad,
    getFile,
    isLoading: (fileId: string) => loadingFiles.has(fileId),
    isLoaded: (fileId: string) => loadedFiles.has(fileId),
    loadedCount: loadedFiles.size,
    queueLength: loadQueue.length,
    activeLoads
  };
}