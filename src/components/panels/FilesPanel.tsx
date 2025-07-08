import { FileText, Folder, Download, Upload, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FilesPanel() {
  const files = [
    { 
      id: "qfs-001", 
      name: "bell_state.qasm", 
      type: "circuit", 
      size: "2.4 KB", 
      modified: "2024-01-15 14:30",
      superposition: true 
    },
    { 
      id: "qfs-002", 
      name: "grover_search.py", 
      type: "algorithm", 
      size: "8.7 KB", 
      modified: "2024-01-15 13:45",
      superposition: false 
    },
    { 
      id: "qfs-003", 
      name: "error_correction/", 
      type: "folder", 
      size: "15 files", 
      modified: "2024-01-14 16:22",
      superposition: true 
    },
    { 
      id: "qfs-004", 
      name: "quantum_ml_model.qnn", 
      type: "model", 
      size: "45.2 MB", 
      modified: "2024-01-14 11:18",
      superposition: false 
    },
    { 
      id: "qfs-005", 
      name: "results.json", 
      type: "data", 
      size: "1.2 MB", 
      modified: "2024-01-13 09:33",
      superposition: true 
    },
  ];

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

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum File System</h2>
            <p className="text-muted-foreground font-mono">QFS - Superposition-enabled storage</p>
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
        <div className="grid grid-cols-3 gap-4">
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
        </div>

        {/* File Browser */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">File Browser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-all duration-300
                    hover:bg-quantum-matrix cursor-pointer
                    ${file.superposition ? 'border border-quantum-glow/30 holographic' : 'border border-transparent'}
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
                      <div className="font-mono text-sm">{file.name}</div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className={getTypeColor(file.type)}>{file.type.toUpperCase()}</span>
                        <span>{file.size}</span>
                        <span>{file.modified}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.superposition && (
                      <span className="text-xs font-mono text-quantum-glow">|ψ⟩</span>
                    )}
                    <Button variant="ghost" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
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
                <span className="text-quantum-glow">3</span>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}