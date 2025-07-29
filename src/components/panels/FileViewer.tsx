
import { useState } from "react";
import { 
  FileText, 
  Download, 
  Edit, 
  Eye, 
  Code, 
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  X
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

  console.log('FileViewer received file:', file);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No file selected</p>
      </div>
    );
  }

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
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-400" />;
      case "video":
        return <Film className="w-5 h-5 text-red-400" />;
      case "audio":
        return <Music className="w-5 h-5 text-yellow-400" />;
      case "folder":
        return <Archive className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const renderFileContent = () => {
    switch (file.type) {
      case "circuit":
        return (
          <div className="space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-quantum-glow/20">
              <h4 className="text-sm font-mono text-quantum-glow mb-2">Circuit Definition</h4>
              <pre className="text-sm text-quantum-neon font-mono">
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
          <div className="space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-quantum-neon/20">
              <h4 className="text-sm font-mono text-quantum-neon mb-2">Python Code</h4>
              <pre className="text-sm text-green-400 font-mono">
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
          <div className="space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-green-400/20">
              <h4 className="text-sm font-mono text-green-400 mb-2">Measurement Results</h4>
              <pre className="text-sm text-green-400 font-mono">
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
          <div className="space-y-4">
            <div className="bg-quantum-matrix/20 rounded-lg p-4 border border-purple-400/20">
              <h4 className="text-sm font-mono text-purple-400 mb-2">Model Architecture</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-purple-400">Input Layer:</span> 16 qubits</p>
                <p><span className="text-purple-400">Hidden Layers:</span> 3 variational layers</p>
                <p><span className="text-purple-400">Output:</span> Classification (4 classes)</p>
                <p><span className="text-purple-400">Parameters:</span> 48 trainable parameters</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Card className="quantum-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-green-400">94.2%</p>
                </CardContent>
              </Card>
              <Card className="quantum-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-yellow-400">0.156</p>
                </CardContent>
              </Card>
              <Card className="quantum-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Epochs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-quantum-neon">50</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
        
      case "folder":
        return (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Archive className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-lg font-semibold mb-2">Directory</h3>
              <p className="text-muted-foreground">This is a folder containing multiple files</p>
              <p className="text-sm text-muted-foreground mt-2">{file.sizeDisplay}</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>File preview available</p>
            <p className="text-sm mt-2">Type: {file.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="quantum-panel">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
            <TabsTrigger value="metadata" className="text-xs">Metadata</TabsTrigger>
          </TabsList>
          
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

        <TabsContent value="content" className="h-full">
          <ScrollArea className="h-[500px]">
            {renderFileContent()}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="properties" className="h-full">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              <Card className="quantum-panel">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getFileIcon(file.type)}
                    File Information
                  </CardTitle>
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
                      <p className="text-xs">
                        {file.updatedAt ? 
                          (file.updatedAt instanceof Date ? 
                            file.updatedAt.toLocaleString() : 
                            new Date(file.updatedAt).toLocaleString()
                          ) : 
                          'Unknown'
                        }
                      </p>
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
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="metadata" className="h-full">
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              <Card className="quantum-panel">
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
                      <p className="text-xs">
                        {file.createdAt ? 
                          (file.createdAt instanceof Date ? 
                            file.createdAt.toLocaleString() : 
                            new Date(file.createdAt).toLocaleString()
                          ) : 
                          'Unknown'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Modified</p>
                      <p className="text-xs">
                        {file.updatedAt ? 
                          (file.updatedAt instanceof Date ? 
                            file.updatedAt.toLocaleString() : 
                            new Date(file.updatedAt).toLocaleString()
                          ) : 
                          'Unknown'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="quantum-panel">
                <CardHeader>
                  <CardTitle className="text-sm">Quantum Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Superposition State</span>
                      <span className={file.superposition ? "text-quantum-glow" : "text-muted-foreground"}>
                        {file.superposition ? "Active" : "Collapsed"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entanglement</span>
                      <span className="text-quantum-neon">None detected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coherence Time</span>
                      <span className="font-mono">∞</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
