import { useState, useEffect, useCallback } from 'react';
import { QFSCore, QFSFile, QFSDirectory } from '@/lib/qfs/qfsCore';
import { useQuantumFiles, QuantumFile } from './useQuantumFiles';
import { toast } from 'sonner';

export function useEnhancedQFS() {
  const [qfs] = useState(() => new QFSCore());
  const [currentDirectory, setCurrentDirectory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const quantumFiles = useQuantumFiles();

  // Sync QFS with Supabase files
  useEffect(() => {
    if (quantumFiles.files.length > 0) {
      syncWithSupabase();
    }
  }, [quantumFiles.files]);

  const syncWithSupabase = useCallback(() => {
    quantumFiles.files.forEach(file => {
      const existingFile = qfs.getAllFiles().find(f => f.name === file.name);
      if (!existingFile) {
        qfs.saveFile({
          name: file.name,
          type: mapFileType(file.type),
          path: `/${file.name}`,
          parentId: file.parentFolderId,
          size: file.sizeBytes,
          sizeDisplay: file.sizeDisplay,
          contentData: file.contentData,
          permissions: qfs['getDefaultPermissions'](),
          metadata: {
            version: file.lastVersion,
            description: `Imported from Supabase`
          },
          superposition: file.superposition,
          favorite: file.favorite,
          tags: file.tags
        });
      }
    });
  }, [quantumFiles.files, qfs]);

  // ============= FILE OPERATIONS =============

  const saveFile = useCallback(async (
    name: string,
    content: any,
    type: 'circuit' | 'algorithm' | 'data' | 'qasm' | 'model' = 'circuit'
  ) => {
    try {
      // Save to QFS
      const qfsFile = qfs.saveFile({
        name,
        type,
        path: currentDirectory ? `${getCurrentDirectoryPath()}/${name}` : `/${name}`,
        parentId: currentDirectory,
        size: JSON.stringify(content).length,
        sizeDisplay: qfs['formatSize'](JSON.stringify(content).length),
        contentData: content,
        permissions: qfs['getDefaultPermissions'](),
        metadata: {
          version: 'v1.0',
          author: 'current_user',
          format: getFormatForType(type)
        },
        superposition: type === 'circuit',
        favorite: false,
        tags: [type]
      });

      // Also save to Supabase for persistence
      await quantumFiles.createFile({
        name,
        type,
        sizeBytes: qfsFile.size,
        sizeDisplay: qfsFile.sizeDisplay,
        contentData: content,
        superposition: qfsFile.superposition,
        tags: qfsFile.tags,
        parentFolderId: currentDirectory
      });

      return qfsFile;
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
      return null;
    }
  }, [currentDirectory, qfs, quantumFiles]);

  const loadFile = useCallback((fileId: string) => {
    return qfs.loadFile(fileId);
  }, [qfs]);

  const deleteFile = useCallback(async (fileId: string) => {
    try {
      const file = qfs.loadFile(fileId);
      if (!file) return false;

      // Delete from QFS
      const qfsSuccess = qfs.deleteFile(fileId);
      
      // Find and delete from Supabase
      const supabaseFile = quantumFiles.files.find(f => f.name === file.name);
      if (supabaseFile) {
        await quantumFiles.deleteFile(supabaseFile.id);
      }

      return qfsSuccess;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  }, [qfs, quantumFiles]);

  // ============= QASM OPERATIONS =============

  const exportQASM = useCallback((fileId: string) => {
    const qasmContent = qfs.exportQASM(fileId);
    if (qasmContent) {
      const blob = new Blob([qasmContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qfs.loadFile(fileId)?.name || 'circuit'}.qasm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('QASM file exported successfully');
    }
    return qasmContent;
  }, [qfs]);

  const importQASM = useCallback((qasmContent: string, fileName: string) => {
    const file = qfs.importQASM(qasmContent, fileName);
    if (file) {
      // Also save to Supabase
      quantumFiles.createFile({
        name: file.name,
        type: 'qasm',
        sizeBytes: file.size,
        sizeDisplay: file.sizeDisplay,
        contentData: file.contentData,
        superposition: false,
        tags: file.tags
      });
    }
    return file;
  }, [qfs, quantumFiles]);

  const handleQASMFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      importQASM(content, file.name.replace('.qasm', ''));
    };
    reader.readAsText(file);
  }, [importQASM]);

  // ============= DIRECTORY OPERATIONS =============

  const createDirectory = useCallback((name: string) => {
    const newDir = qfs.createDirectory(name, currentDirectory);
    return newDir;
  }, [qfs, currentDirectory]);

  const navigateToDirectory = useCallback((directoryId?: string) => {
    console.log('Navigating to directory:', directoryId);
    setCurrentDirectory(directoryId);
  }, []);

  const getCurrentDirectoryPath = useCallback(() => {
    if (!currentDirectory) return '/';
    const dir = qfs.getAllDirectories().find(d => d.id === currentDirectory);
    return dir?.path || '/';
  }, [currentDirectory, qfs]);

  const getDirectoryContents = useCallback(() => {
    return qfs.getDirectoryContents(currentDirectory);
  }, [qfs, currentDirectory]);

  // ============= PERMISSION MANAGEMENT =============

  const setFilePermissions = useCallback((fileId: string, permissions: any) => {
    return qfs.setPermissions(fileId, permissions);
  }, [qfs]);

  const checkFilePermission = useCallback((fileId: string, permission: 'read' | 'write' | 'execute') => {
    return qfs.checkPermission(fileId, permission);
  }, [qfs]);

  // ============= SEARCH AND FILTER =============

  const getFilteredFiles = useCallback(() => {
    let files = qfs.getAllFiles();

    // Apply search filter
    if (searchQuery.trim()) {
      files = qfs.searchFiles(searchQuery);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      files = files.filter(file => file.type === selectedType);
    }

    // Apply directory filter
    if (currentDirectory) {
      files = files.filter(file => file.parentId === currentDirectory);
    } else {
      files = files.filter(file => !file.parentId);
    }

    return files;
  }, [qfs, searchQuery, selectedType, currentDirectory]);

  const searchFiles = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const filterByType = useCallback((type: string) => {
    setSelectedType(type);
  }, []);

  // ============= FILE SYSTEM STATS =============

  const getEnhancedStats = useCallback(() => {
    const qfsStats = qfs.getFileStats();
    const supabaseStats = quantumFiles.getFileStats;
    
    return {
      ...qfsStats,
      syncedFiles: quantumFiles.files.length,
      directoriesCount: qfs.getAllDirectories().length,
      permissions: {
        readableFiles: qfs.getAllFiles().filter(f => f.permissions.readable).length,
        writableFiles: qfs.getAllFiles().filter(f => f.permissions.writable).length,
        sharedFiles: qfs.getAllFiles().filter(f => f.permissions.shared).length
      }
    };
  }, [qfs, quantumFiles]);

  // ============= UTILITY FUNCTIONS =============

  const mapFileType = (type: string): 'circuit' | 'algorithm' | 'data' | 'folder' | 'qasm' | 'model' => {
    switch (type) {
      case 'circuit': return 'circuit';
      case 'algorithm': return 'algorithm';
      case 'data': return 'data';
      case 'folder': return 'folder';
      case 'model': return 'model';
      default: return 'data';
    }
  };

  const getFormatForType = (type: string): string => {
    switch (type) {
      case 'circuit': return 'QFS Circuit';
      case 'qasm': return 'QASM 2.0';
      case 'algorithm': return 'Python/JavaScript';
      case 'model': return 'QML Model';
      default: return 'JSON';
    }
  };

  const exportFileAsJSON = useCallback((fileId: string) => {
    const file = qfs.loadFile(fileId);
    if (!file) return;

    const exportData = {
      ...file,
      exportedAt: new Date().toISOString(),
      exportedBy: 'QFS'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('File exported as JSON');
  }, [qfs]);

  const importJSONFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        saveFile(data.name || 'imported_file', data.contentData || data, data.type || 'data');
      } catch (error) {
        toast.error('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  }, [saveFile]);

  return {
    // Core QFS instance
    qfs,
    
    // File operations
    saveFile,
    loadFile: useCallback((fileId: string) => qfs.loadFile(fileId), [qfs]),
    deleteFile: useCallback(async (fileId: string) => {
      try {
        const file = qfs.loadFile(fileId);
        if (!file) return false;

        // Delete from QFS
        const qfsSuccess = qfs.deleteFile(fileId);
        
        // Find and delete from Supabase
        const supabaseFile = quantumFiles.files.find(f => f.name === file.name);
        if (supabaseFile) {
          await quantumFiles.deleteFile(supabaseFile.id);
        }

        return qfsSuccess;
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
        return false;
      }
    }, [qfs, quantumFiles]),
    files: getFilteredFiles(),
    
    // QASM operations
    exportQASM: useCallback((fileId: string) => {
      const qasmContent = qfs.exportQASM(fileId);
      if (qasmContent) {
        const blob = new Blob([qasmContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${qfs.loadFile(fileId)?.name || 'circuit'}.qasm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('QASM file exported successfully');
      }
      return qasmContent;
    }, [qfs]),
    importQASM: useCallback((qasmContent: string, fileName: string) => {
      const file = qfs.importQASM(qasmContent, fileName);
      if (file) {
        // Also save to Supabase
        quantumFiles.createFile({
          name: file.name,
          type: 'qasm',
          sizeBytes: file.size,
          sizeDisplay: file.sizeDisplay,
          contentData: file.contentData,
          superposition: false,
          tags: file.tags
        });
      }
      return file;
    }, [qfs, quantumFiles]),
    handleQASMFileUpload: useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedFile = qfs.importQASM(content, file.name.replace('.qasm', ''));
        if (importedFile) {
          quantumFiles.createFile({
            name: importedFile.name,
            type: 'qasm',
            sizeBytes: importedFile.size,
            sizeDisplay: importedFile.sizeDisplay,
            contentData: importedFile.contentData,
            superposition: false,
            tags: importedFile.tags
          });
        }
      };
      reader.readAsText(file);
    }, [qfs, quantumFiles]),
    
    // Directory operations
    createDirectory,
    navigateToDirectory,
    currentDirectory,
    currentPath: getCurrentDirectoryPath(),
    directoryContents: getDirectoryContents(),
    directories: qfs.getAllDirectories(),
    
    // Permission management
    setFilePermissions: useCallback((fileId: string, permissions: any) => {
      return qfs.setPermissions(fileId, permissions);
    }, [qfs]),
    checkFilePermission: useCallback((fileId: string, permission: 'read' | 'write' | 'execute') => {
      return qfs.checkPermission(fileId, permission);
    }, [qfs]),
    
    // Search and filter
    searchFiles: useCallback((query: string) => {
      setSearchQuery(query);
    }, []),
    filterByType: useCallback((type: string) => {
      setSelectedType(type);
    }, []),
    searchQuery,
    selectedType,
    
    // Import/Export
    exportFileAsJSON: useCallback((fileId: string) => {
      const file = qfs.loadFile(fileId);
      if (!file) return;

      const exportData = {
        ...file,
        exportedAt: new Date().toISOString(),
        exportedBy: 'QFS'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('File exported as JSON');
    }, [qfs]),
    importJSONFile: useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          saveFile(data.name || 'imported_file', data.contentData || data, data.type || 'data');
        } catch (error) {
          toast.error('Invalid JSON file format');
        }
      };
      reader.readAsText(file);
    }, [saveFile]),
    
    // Stats
    stats: getEnhancedStats(),
    
    // Loading state from Supabase
    loading: quantumFiles.loading
  };
}
