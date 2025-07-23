
import { useState } from "react";
import { Upload, Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VersionHistory } from "../circuits/VersionHistory";
import { FileSystemStats } from "./FileSystemStats";
import { QuantumProperties } from "./QuantumProperties";
import { FileItem } from "./FileItem";
import { FileViewer } from "./FileViewer";

import { useQuantumFiles } from "@/hooks/useQuantumFiles";
import { ShareDialog } from "../dialogs/ShareDialog";

export function FilesPanel() {
  const { files, loading, createFile, updateFile, deleteFile, toggleFavorite, getFileStats } = useQuantumFiles();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFile, setShareFile] = useState<any>(null);
  const [showFileViewer, setShowFileViewer] = useState(false);

  // Transform files to legacy format for useFileOperations compatibility
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

  // Simplified drag and drop state for this component
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
    setSelectedFile(fileId);
    setShowFileViewer(true);
  };

  const handleContextAction = (action: string, fileId: string) => {
    if (action === "versions") {
      setSelectedFile(fileId);
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

  // Get the actual QuantumFile object instead of transformed data
  const selectedFileData = selectedFile ? files.find(f => f.id === selectedFile) : null;

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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-glow mx-auto mb-4"></div>
                <p>Loading quantum files...</p>
              </div>
            ) : legacyFiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-sm mb-4">Get started by creating your first quantum file</p>
                <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
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
            )}
          </CardContent>
        </Card>

        {/* Quantum File Properties */}
        <QuantumProperties files={legacyFiles} />

        {/* File Viewer Dialog */}
        <Dialog open={showFileViewer} onOpenChange={setShowFileViewer}>
          <DialogContent className="quantum-panel border-quantum-glow/30 max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">
                {selectedFileData?.name || "File Viewer"}
              </DialogTitle>
            </DialogHeader>
            {selectedFileData ? (
              <FileViewer 
                file={selectedFileData} 
                onClose={() => setShowFileViewer(false)}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>File not found</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Version History Dialog */}
        <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
          <DialogContent className="quantum-panel border-quantum-glow/30 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">
                Version History - {selectedFile && files.find(f => f.id === selectedFile)?.name}
              </DialogTitle>
            </DialogHeader>
            {selectedFile && <VersionHistory fileId={selectedFile} />}
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
