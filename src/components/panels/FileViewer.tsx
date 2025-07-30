
import { useState } from "react";
import { 
  FileText, 
  Download, 
  Edit, 
  Code, 
  Image as ImageIcon,
  Film,
  Music,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuantumFile } from "@/hooks/useQuantumFiles";

interface FileViewerProps {
  file: QuantumFile;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [activeTab, setActiveTab] = useState("content");

  console.log('=== FileViewer RENDER START ===');
  console.log('FileViewer - Props received:', { file: file ? { id: file.id, name: file.name, type: file.type } : null });
  
  if (!file) {
    console.log('FileViewer - No file provided, showing empty state');
    return (
      <div className="flex items-center justify-center h-64 p-8">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No file selected</p>
        </div>
      </div>
    );
  }

  console.log('FileViewer - File details:', {
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.sizeDisplay,
    favorite: file.favorite,
    superposition: file.superposition
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "circuit":
      case "qasm":
        return <Code className="w-5 h-5 text-quantum-glow" />;
      case "algorithm":
        return <FileText className="w-5 h-5 text-quantum-neon" />;
      case "model":
        return <Archive className="w-5 h-5 text-purple-400" />;
      case "data":
        return <FileText className="w-5 h-5 text-green-400" />;
      case "folder":
        return <Archive className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderFileContent = () => {
    console.log('renderFileContent called for type:', file.type);
    
    const commonContent = (
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {getFileIcon(file.type)}
          </div>
          <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
          <Badge variant="outline" className="mb-4">{file.type.toUpperCase()}</Badge>
          <p className="text-muted-foreground">Size: {file.sizeDisplay}</p>
        </div>
      </div>
    );
    
    switch (file.type) {
      case "circuit":
        return (
          <div className="p-6 space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-quantum-glow/20">
              <h4 className="text-sm font-mono text-quantum-glow mb-3">Circuit Definition</h4>
              <pre className="text-sm text-quantum-neon font-mono whitespace-pre-wrap overflow-auto">
{`OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
cx q[0],q[1];
measure q -> c;`}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="quantum-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Qubits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-quantum-glow">2</p>
                </CardContent>
              </Card>
              <Card className="quantum-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Gates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-quantum-neon">3</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case "algorithm":
        return (
          <div className="p-6 space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-quantum-neon/20">
              <h4 className="text-sm font-mono text-quantum-neon mb-3">Python Code</h4>
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto">
{`def grover_search(oracle, n_qubits):
    """
    Grover's quantum search algorithm
    """
    circuit = QuantumCircuit(n_qubits, n_qubits)
    
    # Initialize superposition
    for qubit in range(n_qubits):
        circuit.h(qubit)
    
    # Apply Grover operator
    iterations = int(np.pi/4 * np.sqrt(2**n_qubits))
    for _ in range(iterations):
        oracle(circuit)
        diffuser(circuit)
    
    return circuit`}
              </pre>
            </div>
          </div>
        );
        
      case "data":
        return (
          <div className="p-6 space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-green-400/20">
              <h4 className="text-sm font-mono text-green-400 mb-3">Measurement Results</h4>
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto">
{`{
  "experiment_id": "bell_state_001",
  "shots": 1024,
  "results": {
    "00": 512,
    "11": 512
  },
  "fidelity": 0.998,
  "execution_time": "2.34ms"
}`}
              </pre>
            </div>
          </div>
        );
        
      case "model":
        return (
          <div className="p-6 space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-purple-400/20">
              <h4 className="text-sm font-mono text-purple-400 mb-3">Model Architecture</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-purple-400">Input Layer:</span> 16 qubits</p>
                <p><span className="text-purple-400">Hidden Layers:</span> 3 variational layers</p>
                <p><span className="text-purple-400">Output:</span> Classification (4 classes)</p>
                <p><span className="text-purple-400">Parameters:</span> 48 trainable parameters</p>
              </div>
            </div>
          </div>
        );
        
      case "folder":
        return (
          <div className="text-center py-12 px-6">
            <Archive className="w-20 h-20 mx-auto mb-4 text-blue-400" />
            <h3 className="text-lg font-semibold mb-2 text-blue-400">Directory</h3>
            <p className="text-muted-foreground mb-2">This is a folder containing multiple files</p>
            <p className="text-sm text-muted-foreground">{file.sizeDisplay}</p>
          </div>
        );
        
      default:
        console.log('Rendering default content for file:', file.name);
        return commonContent;
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  console.log('FileViewer - About to render main component');

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-quantum-glow/20">
        <div className="flex items-center gap-3">
          {getFileIcon(file.type)}
          <div>
            <h3 className="text-lg font-semibold">{file.name}</h3>
            <Badge variant="outline" className="text-xs">{file.type.toUpperCase()}</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="quantum-panel mx-4 mt-4 mb-0">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full m-4 mt-2">
              <Card className="quantum-panel h-full">
                <CardContent className="p-0 h-full">
                  <ScrollArea className="h-full">
                    {renderFileContent()}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="h-full m-4 mt-2">
              <Card className="quantum-panel h-full">
                <CardHeader>
                  <CardTitle className="text-sm">File Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-mono">{file.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-mono">{file.sizeDisplay}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Modified</p>
                      <p className="text-xs">{formatDate(file.updatedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    {file.superposition && (
                      <Badge className="bg-quantum-glow/20 text-quantum-glow">
                        Superposition
                      </Badge>
                    )}
                    {file.favorite && (
                      <Badge className="bg-yellow-400/20 text-yellow-400">
                        Favorite
                      </Badge>
                    )}
                  </div>
                  
                  {file.tags && file.tags.length > 0 && (
                    <div>
                      <p className="text-muted-foreground text-sm mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="h-full m-4 mt-2">
              <Card className="quantum-panel h-full">
                <CardHeader>
                  <CardTitle className="text-sm">Version Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Current Version</p>
                      <p className="font-mono">{file.lastVersion || 'v1.0'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Versions</p>
                      <p className="font-mono">{file.versions || 1}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="text-xs">{formatDate(file.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Modified</p>
                      <p className="text-xs">{formatDate(file.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
