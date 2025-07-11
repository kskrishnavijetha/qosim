import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VersionHistory } from "../circuits/VersionHistory";
import { FileSystemStats } from "./FileSystemStats";
import { QuantumProperties } from "./QuantumProperties";
import { FileItem } from "./FileItem";
import { useFileOperations } from "@/hooks/useFileOperations";
import { ShareDialog } from "../dialogs/ShareDialog";

export function FilesPanel() {
  const [files, setFiles] = useState([
    { 
      id: "qfs-001", 
      name: "bell_state.qasm", 
      type: "circuit", 
      size: "2.4 KB", 
      modified: "2024-01-15 14:30",
      superposition: true,
      favorite: true,
      tags: ["bell", "entanglement"],
      versions: 3,
      lastVersion: "v1.2"
    },
    { 
      id: "qfs-002", 
      name: "grover_search.py", 
      type: "algorithm", 
      size: "8.7 KB", 
      modified: "2024-01-15 13:45",
      superposition: false,
      favorite: false,
      tags: ["search", "grover"],
      versions: 5,
      lastVersion: "v2.1"
    },
    { 
      id: "qfs-003", 
      name: "error_correction/", 
      type: "folder", 
      size: "15 files", 
      modified: "2024-01-14 16:22",
      superposition: true,
      favorite: false,
      tags: ["error-correction"],
      versions: 1,
      lastVersion: "v1.0"
    },
    { 
      id: "qfs-004", 
      name: "quantum_ml_model.qnn", 
      type: "model", 
      size: "45.2 MB", 
      modified: "2024-01-14 11:18",
      superposition: false,
      favorite: true,
      tags: ["ml", "neural"],
      versions: 8,
      lastVersion: "v3.4"
    },
    { 
      id: "qfs-005", 
      name: "results.json", 
      type: "data", 
      size: "1.2 MB", 
      modified: "2024-01-13 09:33",
      superposition: true,
      favorite: false,
      tags: ["results", "data"],
      versions: 2,
      lastVersion: "v1.1"
    },
  ]);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFile, setShareFile] = useState<any>(null);

  const {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
    handleContextAction: contextAction,
    toggleFavorite
  } = useFileOperations(files, setFiles);

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
    } else {
      contextAction(action, fileId, (file) => {
        setShareFile(file);
        setShowShareDialog(true);
      });
    }
  };

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
        <FileSystemStats favoriteCount={files.filter(f => f.favorite).length} />

        {/* File Browser */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">File Browser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  draggedItem={draggedItem}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onToggleFavorite={toggleFavorite}
                  onContextAction={handleContextAction}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantum File Properties */}
        <QuantumProperties files={files} />

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