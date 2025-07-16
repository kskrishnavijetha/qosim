import { useState } from "react";
import { 
  Upload, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  FolderPlus, 
  Import, 
  Settings,
  FileText,
  ChevronRight,
  Home
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEnhancedQFS } from "@/hooks/useEnhancedQFS";
import { QFSFileItem } from "./QFSFileItem";
import { QFSDirectoryTree } from "./QFSDirectoryTree";
import { QFSPermissionManager } from "./QFSPermissionManager";
import { QFSImportExport } from "./QFSImportExport";

export function EnhancedFilesPanel() {
  const {
    files,
    directories,
    currentDirectory,
    currentPath,
    searchQuery,
    selectedType,
    stats,
    loading,
    navigateToDirectory,
    createDirectory,
    saveFile,
    deleteFile,
    searchFiles,
    filterByType,
    exportQASM,
    importQASM,
    handleQASMFileUpload,
    exportFileAsJSON,
    importJSONFile
  } = useEnhancedQFS();

  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showCreateDir, setShowCreateDir] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [newDirName, setNewDirName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    
    const content = fileContent.trim() ? JSON.parse(fileContent) : {};
    await saveFile(newFileName, content, 'circuit');
    
    setNewFileName("");
    setFileContent("");
    setShowCreateFile(false);
  };

  const handleCreateDirectory = () => {
    if (!newDirName.trim()) return;
    
    createDirectory(newDirName);
    setNewDirName("");
    setShowCreateDir(false);
  };

  const getPathBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    return [
      { name: 'Root', path: undefined },
      ...parts.map((part, index) => ({
        name: part,
        path: parts.slice(0, index + 1).join('/')
      }))
    ];
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Enhanced Quantum File System</h2>
            <p className="text-muted-foreground font-mono">QFS v2.0 - Advanced file operations with QASM support</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showImportExport} onOpenChange={setShowImportExport}>
              <DialogTrigger asChild>
                <Button variant="outline" className="neon-border">
                  <Import className="w-4 h-4 mr-2" />
                  Import/Export
                </Button>
              </DialogTrigger>
              <DialogContent className="quantum-panel border-quantum-glow/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-quantum-glow">Import/Export Files</DialogTitle>
                </DialogHeader>
                <QFSImportExport
                  onQASMImport={importQASM}
                  onQASMFileUpload={handleQASMFileUpload}
                  onJSONImport={importJSONFile}
                  files={files}
                  onExportQASM={exportQASM}
                  onExportJSON={exportFileAsJSON}
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={showCreateDir} onOpenChange={setShowCreateDir}>
              <DialogTrigger asChild>
                <Button variant="outline" className="neon-border">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent className="quantum-panel border-quantum-glow/30">
                <DialogHeader>
                  <DialogTitle className="text-quantum-glow">Create New Directory</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Directory name"
                    value={newDirName}
                    onChange={(e) => setNewDirName(e.target.value)}
                    className="quantum-input"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateDirectory} className="bg-quantum-glow text-black">
                      Create Directory
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDir(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showCreateFile} onOpenChange={setShowCreateFile}>
              <DialogTrigger asChild>
                <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </Button>
              </DialogTrigger>
              <DialogContent className="quantum-panel border-quantum-glow/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-quantum-glow">Create New File</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="File name (e.g., my_circuit.qasm)"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="quantum-input"
                  />
                  <textarea
                    placeholder="File content (JSON format for circuits)"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full h-32 p-3 rounded-md bg-black/20 border border-quantum-glow/30 text-foreground font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateFile} className="bg-quantum-glow text-black">
                      Create File
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateFile(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToDirectory()}
                className="text-quantum-glow hover:bg-quantum-glow/10"
              >
                <Home className="w-4 h-4 mr-1" />
                Root
              </Button>
              {getPathBreadcrumbs().slice(1).map((breadcrumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToDirectory(breadcrumb.path)}
                    className="text-quantum-glow hover:bg-quantum-glow/10"
                  >
                    {breadcrumb.name}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Controls */}
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and directories..."
                  value={searchQuery}
                  onChange={(e) => searchFiles(e.target.value)}
                  className="pl-10 quantum-input"
                />
              </div>
              <Select value={selectedType} onValueChange={filterByType}>
                <SelectTrigger className="w-48 quantum-input">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="quantum-panel border-quantum-glow/30">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="circuit">Circuits</SelectItem>
                  <SelectItem value="qasm">QASM Files</SelectItem>
                  <SelectItem value="algorithm">Algorithms</SelectItem>
                  <SelectItem value="data">Data Files</SelectItem>
                  <SelectItem value="model">Models</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowPermissions(true)}
                className="neon-border"
              >
                <Settings className="w-4 h-4 mr-2" />
                Permissions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File System Stats */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">QFS Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">{stats.totalFiles}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">{stats.directoriesCount}</div>
                <div className="text-sm text-muted-foreground">Directories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">{stats.qasmCount}</div>
                <div className="text-sm text-muted-foreground">QASM Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-quantum-glow">{stats.permissions?.sharedFiles || 0}</div>
                <div className="text-sm text-muted-foreground">Shared</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Browser */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Directory Tree */}
          <Card className="quantum-panel neon-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-quantum-glow">Directory Tree</CardTitle>
            </CardHeader>
            <CardContent>
              <QFSDirectoryTree
                directories={directories}
                currentDirectory={currentDirectory}
                onNavigate={navigateToDirectory}
              />
            </CardContent>
          </Card>

          {/* File List */}
          <Card className="quantum-panel neon-border lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-quantum-glow">
                Files {currentPath !== '/' && `in ${currentPath}`}
                <Badge variant="secondary" className="ml-2">{files.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading files...</div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No files match your search' : 'No files in this directory'}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {files.map((file) => (
                    <QFSFileItem
                      key={file.id}
                      file={file}
                      onSelect={setSelectedFile}
                      onDelete={deleteFile}
                      onExportQASM={exportQASM}
                      onExportJSON={exportFileAsJSON}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permission Management Dialog */}
        <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
          <DialogContent className="quantum-panel border-quantum-glow/30 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">File Permissions Management</DialogTitle>
            </DialogHeader>
            <QFSPermissionManager
              files={files}
              selectedFile={selectedFile}
              onClose={() => setShowPermissions(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}