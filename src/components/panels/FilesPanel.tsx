
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

import { useQuantumFiles, QuantumFile } from "@/hooks/useQuantumFiles";
import { ShareDialog } from "../dialogs/ShareDialog";

export function FilesPanel() {
  const { files, loading, createFile, updateFile, deleteFile, toggleFavorite, getFileStats } = useQuantumFiles();

  const [selectedFile, setSelectedFile] = useState<QuantumFile | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFile, setShareFile] = useState<any>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);

  console.log('=== FilesPanel RENDER ===');
  console.log('FilesPanel - files count:', files.length);
  console.log('FilesPanel - selectedFile:', selectedFile ? { id: selectedFile.id, name: selectedFile.name } : null);
  console.log('FilesPanel - showFileViewer:', showFileViewer);

  // Transform files to legacy format for compatibility
  const legacyFiles = files.map(file => ({
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

  // Simplified drag and drop state
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

  const handleFileSelect = (fileId: string) => {
    console.log('=== handleFileSelect CALLED ===');
    console.log('handleFileSelect - fileId:', fileId);
    
    const file = files.find(f => f.id === fileId);
    console.log('handleFileSelect - found file:', file ? { id: file.id, name: file.name, type: file.type } : null);
    
    if (file) {
      console.log('handleFileSelect - Setting selectedFile and opening viewer');
      setSelectedFile(file);
      
      // Force a small delay to ensure state is updated
      setTimeout(() => {
        console.log('handleFileSelect - Opening file viewer dialog');
        setShowFileViewer(true);
      }, 10);
    } else {
      console.error('handleFileSelect - File not found with id:', fileId);
    }
  };

  const handleContextAction = (action: string, fileId: string) => {
    console.log('Context action:', action, 'for file:', fileId);
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
    console.log('=== handleCloseFileViewer CALLED ===');
    setShowFileViewer(false);
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="h-full overflow-auto quantum-grid">
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading files...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum File System</h2>
            <p className="text-muted-foreground font-mono">QFS - Enhanced with AI assistance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="neon-border">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
              <Plus className="w-4 h-4 mr-2" />
              New File
            </Button>
          </div>
        </div>

        {/* File System Stats */}
        <FileSystemStats favoriteCount={getFileStats.favoriteCount} />

        {/* File Browser */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">File Browser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {legacyFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  draggedItem={draggedItem}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onToggleFavorite={handleToggleFavorite}
                  onContextAction={handleContextAction}
                  onFileSelect={handleFileSelect}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantum File Properties */}
        <QuantumProperties files={legacyFiles} />

        {/* Debug: Test Button */}
        <Button 
          onClick={() => {
            console.log('Test button clicked, forcing dialog open');
            setSelectedFile(files[0]);
            setShowFileViewer(true);
          }}
          variant="outline"
          className="mb-4"
        >
          Debug: Test File Viewer with First File
        </Button>

        {/* File Viewer Dialog */}
        {console.log('Rendering Dialog with:', { showFileViewer, selectedFile: selectedFile?.name })}
        <Dialog open={showFileViewer} onOpenChange={setShowFileViewer}>
          <DialogContent className="max-w-6xl max-h-[90vh] h-[80vh] p-0">
            <DialogHeader className="p-4">
              <DialogTitle>
                {selectedFile ? selectedFile.name : 'File Viewer'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden p-4">
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
