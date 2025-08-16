import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VersionHistory } from "../circuits/VersionHistory";
import { FileSystemStats } from "./FileSystemStats";
import { QuantumProperties } from "./QuantumProperties";
import { FileItem } from "./FileItem";
import { FileViewer } from "./FileViewer";
import { QFSDirectoryTree } from "../qfs/QFSDirectoryTree";
import { useQuantumFiles, QuantumFile } from "@/hooks/useQuantumFiles";
import { useEnhancedQFS } from "@/hooks/useEnhancedQFS";
import { ShareDialog } from "../dialogs/ShareDialog";

export function FilesPanel() {
  const { files, loading, createFile, updateFile, deleteFile, toggleFavorite, getFileStats } = useQuantumFiles();
  const { directories, currentDirectory, navigateToDirectory, createDirectory } = useEnhancedQFS();
  
  const [selectedFile, setSelectedFile] = useState<QuantumFile | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFile, setShareFile] = useState<any>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);

  console.log('FilesPanel - files count:', files.length);
  console.log('FilesPanel - loading:', loading);
  console.log('FilesPanel - current directory:', currentDirectory);
  console.log('FilesPanel - directories:', directories.length);

  // Filter files by current directory
  const currentFiles = files.filter(file => {
    if (currentDirectory) {
      // Show files that belong to the current directory
      return file.parentFolderId === currentDirectory;
    } else {
      // Show files that don't have a parent (root level files)
      return !file.parentFolderId;
    }
  });

  console.log('FilesPanel - current files after filtering:', currentFiles.length);
  console.log('FilesPanel - filtered files:', currentFiles.map(f => ({ name: f.name, parentId: f.parentFolderId })));

  // Transform files to legacy format for compatibility with existing components
  const legacyFiles = currentFiles.map(file => ({
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.sizeDisplay,
    modified: file.updatedAt.toLocaleString(),
    superposition: file.superposition,
    favorite: file.favorite,
    tags: file.tags,
    versions: file.versions,
    lastVersion: file.lastVersion
  }));

  // Drag and drop handlers
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedItem(fileId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, fileId: string) => {
    e.preventDefault();
    handleDragEnd();
  };

  const handleDirectoryNavigate = (directoryId?: string) => {
    console.log('Navigating to directory:', directoryId);
    navigateToDirectory(directoryId);
  };

  const handleFileSelect = (fileId: string) => {
    console.log('handleFileSelect called with:', fileId);
    const file = files.find(f => f.id === fileId);
    if (file) {
      console.log('Setting selected file:', file.name);
      setSelectedFile(file);
      setShowFileViewer(true);
    } else {
      console.log('File not found:', fileId);
    }
  };

  const handleContextAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    
    if (action === "versions") {
      setSelectedFile(file || null);
      setShowVersionHistory(true);
    } else if (action === "share") {
      if (file) {
        setShareFile(file);
        setShowShareDialog(true);
      }
    } else if (action === "delete") {
      deleteFile(fileId);
    } else if (action === "view" || action === "open") {
      handleFileSelect(fileId);
    }
  };

  const handleToggleFavorite = (fileId: string) => {
    toggleFavorite(fileId);
  };

  const handleCloseFileViewer = () => {
    setShowFileViewer(false);
    setSelectedFile(null);
  };

  const handleCreateNewFile = () => {
    const fileName = prompt("Enter file name:");
    if (fileName) {
      createFile({
        name: fileName,
        type: 'circuit',
        parentFolderId: currentDirectory,
        sizeBytes: 0,
        sizeDisplay: '0 B',
        contentData: {},
        superposition: false,
        tags: ['circuit', 'new']
      });
    }
  };

  const handleCreateNewDirectory = () => {
    const dirName = prompt("Enter directory name:");
    if (dirName) {
      console.log('Creating directory:', dirName);
      createDirectory(dirName);
    }
  };

  // Get current directory name for display
  const getCurrentDirectoryName = () => {
    if (!currentDirectory) return 'Root Directory';
    const dir = directories.find(d => d.id === currentDirectory);
    return dir ? dir.name : 'Unknown Directory';
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-auto quantum-grid">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading quantum files...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum File System</h2>
            <p className="text-muted-foreground font-mono">QFS - Enhanced with AI assistance</p>
            <div className="text-sm text-quantum-neon mt-1">
              Current: {getCurrentDirectoryName()}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="neon-border">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button onClick={handleCreateNewFile} className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
              <Plus className="w-4 h-4 mr-2" />
              New File
            </Button>
            <Button onClick={handleCreateNewDirectory} variant="outline" className="neon-border">
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>
        </div>

        {/* File System Stats */}
        <FileSystemStats favoriteCount={getFileStats.favoriteCount} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Directory Tree */}
          <div className="lg:col-span-1">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-quantum-glow">Directory Tree</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <QFSDirectoryTree
                  directories={directories}
                  currentDirectory={currentDirectory}
                  onNavigate={handleDirectoryNavigate}
                />
              </CardContent>
            </Card>
          </div>

          {/* File Browser */}
          <div className="lg:col-span-3">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg font-mono text-quantum-glow">
                  File Browser
                  <span className="text-sm font-normal text-quantum-neon ml-2">
                    - {getCurrentDirectoryName()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {legacyFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {currentDirectory ? 'No files in this directory' : 'No files uploaded yet'}
                    </p>
                    <Button 
                      onClick={handleCreateNewFile} 
                      variant="outline" 
                      className="mt-4 neon-border"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {legacyFiles.map((file) => (
                      <FileItem
                        key={file.id}
                        file={file}
                        draggedItem={null}
                        onDragStart={() => {}}
                        onDragOver={() => {}}
                        onDrop={() => {}}
                        onDragEnd={() => {}}
                        onToggleFavorite={handleToggleFavorite}
                        onContextAction={handleContextAction}
                        onFileSelect={handleFileSelect}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quantum File Properties */}
        <QuantumProperties files={legacyFiles} />

        {/* File Viewer Dialog */}
        <Dialog open={showFileViewer} onOpenChange={setShowFileViewer}>
          <DialogContent className="max-w-6xl max-h-[90vh] h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>
                {selectedFile ? selectedFile.name : 'File Viewer'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              {selectedFile ? (
                <FileViewer file={selectedFile} onClose={handleCloseFileViewer} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No file selected</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Version History Dialog */}
        <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
          <DialogContent className="quantum-panel border-quantum-glow/30 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">
                Version History - {selectedFile?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedFile && <VersionHistory fileId={selectedFile.id} />}
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        {shareFile && (
          <ShareDialog
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            file={shareFile}
          />
        )}
      </div>
    </div>
  );
}
