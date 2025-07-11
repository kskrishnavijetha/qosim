import { useState } from "react";
import { FileText, Folder, Download, Upload, Trash2, Plus, Star, StarOff, History, GitBranch, Eye, MoreHorizontal, Edit, Copy, Share, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CircuitPreview } from "../circuits/CircuitPreview";
import { VersionHistory } from "../circuits/VersionHistory";

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

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder": return <Folder className="w-4 h-4 text-quantum-neon" />;
      default: return <FileText className="w-4 h-4 text-quantum-glow" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "circuit": return "text-quantum-glow";
      case "algorithm": return "text-quantum-neon";
      case "folder": return "text-quantum-neon";
      case "model": return "text-purple-400";
      case "data": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const toggleFavorite = (id: string) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, favorite: !file.favorite } : file
    ));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = files.findIndex(f => f.id === draggedId);
    const targetIndex = files.findIndex(f => f.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      return;
    }
    
    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedFile);
    
    setFiles(newFiles);
    setDraggedItem(null);
  };

  const handleContextAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case "rename":
        const newName = prompt("Enter new name:", file.name);
        if (newName && newName !== file.name) {
          setFiles(files.map(f => 
            f.id === fileId ? { ...f, name: newName, modified: new Date().toISOString().slice(0, 16).replace('T', ' ') } : f
          ));
        }
        break;
      case "duplicate":
        const extension = file.name.includes('.') ? file.name.split('.').pop() : '';
        const baseName = file.name.includes('.') ? file.name.split('.').slice(0, -1).join('.') : file.name;
        const duplicated = {
          ...file,
          id: `${file.id}-copy-${Date.now()}`,
          name: extension ? `${baseName}_copy.${extension}` : `${baseName}_copy`,
          modified: new Date().toISOString().slice(0, 16).replace('T', ' '),
          versions: 1,
          lastVersion: "v1.0"
        };
        setFiles([...files, duplicated]);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
          setFiles(files.filter(f => f.id !== fileId));
        }
        break;
      case "share":
        const shareUrl = `${window.location.origin}/shared/${fileId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert(`Share link copied to clipboard: ${shareUrl}`);
        }).catch(() => {
          alert(`Share link: ${shareUrl}`);
        });
        break;
      case "versions":
        setSelectedFile(fileId);
        setShowVersionHistory(true);
        break;
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
        <div className="grid grid-cols-4 gap-4">
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">1.2 TB</div>
                <div className="text-xs text-muted-foreground font-mono">USED</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-neon">847</div>
                <div className="text-xs text-muted-foreground font-mono">FILES</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">73%</div>
                <div className="text-xs text-muted-foreground font-mono">COHERENT</div>
              </div>
            </CardContent>
          </Card>
          <Card className="quantum-panel neon-border">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {files.filter(f => f.favorite).length}
                </div>
                <div className="text-xs text-muted-foreground font-mono">STARRED</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Browser */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">File Browser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => (
                <ContextMenu key={file.id}>
                  <ContextMenuTrigger>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, file.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, file.id)}
                      onDragEnd={handleDragEnd}
                      className={`
                        flex items-center justify-between p-3 rounded-lg transition-all duration-300
                        hover:bg-quantum-matrix cursor-pointer group
                        ${file.superposition ? 'border border-quantum-glow/30 holographic' : 'border border-transparent'}
                        ${draggedItem === file.id ? 'opacity-50 scale-95' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                          {getFileIcon(file.type)}
                          {file.superposition && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-glow rounded-full particle-animation" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{file.name}</span>
                            {file.favorite && (
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            )}
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground items-center">
                            <span className={getTypeColor(file.type)}>{file.type.toUpperCase()}</span>
                            <span>{file.size}</span>
                            <span>{file.modified}</span>
                            <div className="flex gap-1">
                              {file.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Circuit Preview for circuit files */}
                        {file.type === "circuit" && (
                          <div className="w-24 h-16 bg-quantum-void/50 rounded border border-quantum-glow/20 flex items-center justify-center">
                            <CircuitPreview fileId={file.id} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.versions > 1 && (
                          <div className="flex items-center gap-1 text-xs text-quantum-neon">
                            <GitBranch className="w-3 h-3" />
                            <span>{file.lastVersion}</span>
                          </div>
                        )}
                        {file.superposition && (
                          <span className="text-xs font-mono text-quantum-glow">|ψ⟩</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(file.id);
                          }}
                        >
                          {file.favorite ? (
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          ) : (
                            <StarOff className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  
                  <ContextMenuContent className="quantum-panel border-quantum-glow/30">
                    <ContextMenuItem onClick={() => handleContextAction("rename", file.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Rename
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleContextAction("duplicate", file.id)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleContextAction("share", file.id)}>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => handleContextAction("versions", file.id)}>
                      <History className="w-4 h-4 mr-2" />
                      Version History
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem 
                      onClick={() => handleContextAction("delete", file.id)}
                      className="text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantum File Properties */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Quantum Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Superposition Files:</span>
                <span className="text-quantum-glow">{files.filter(f => f.superposition).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entangled Pairs:</span>
                <span className="text-quantum-neon">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantum Compression:</span>
                <span className="text-green-400">78.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Decoherence Risk:</span>
                <span className="text-yellow-400">Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Versions:</span>
                <span className="text-blue-400">{files.reduce((sum, f) => sum + f.versions, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}