
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

  console.log('FilesPanel render - files count:', files.length);
  console.log('FilesPanel render - selectedFile:', selectedFile);

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
    console.log('handleFileSelect called with fileId:', fileId);
    
    const file = files.find(f => f.id === fileId);
    console.log('Found file:', file);
    
    if (file) {
      console.log('Setting selected file and opening viewer');
      setSelectedFile(file);
      setShowFileViewer(true);
    } else {
      console.error('File not found:', fileId);
    }
  };

  const handleContextAction = (action: string, fileId: string) => {
    console.log('Context action:', action, 'for file:', fileId);
    if (action === "versions") {
      setSelectedFile(files.find(f => f.id === fileId) || null);
      setShowVersionHistory(true);
    } else if (action === "share") {
      const file = files.find(f => f.id === fileId);
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
    console.log('Closing file viewer');
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

        {/* File Viewer Dialog */}
        <Dialog open={showFileViewer} onOpenChange={handleCloseFileViewer}>
          <DialogContent className="quantum-panel border-quantum-glow/30 max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">
                File Viewer - {selectedFile?.name || 'Loading...'}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[70vh] overflow-y-auto">
              {selectedFile && (
                <FileViewer 
                  file={selectedFile} 
                  onClose={handleCloseFileViewer}
                />
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
