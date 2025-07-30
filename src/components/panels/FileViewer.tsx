
import { useState } from "react";
import { 
  FileText, 
  Download, 
  Edit, 
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { QuantumFile } from "@/hooks/useQuantumFiles";

interface FileViewerProps {
  file: QuantumFile;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [activeTab, setActiveTab] = useState("content");

  console.log('=== FileViewer RENDER ===');
  console.log('FileViewer file:', file ? { id: file.id, name: file.name, type: file.type } : 'null');

  if (!file) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No file provided</p>
      </div>
    );
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "circuit":
      case "qasm":
        return <Code className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          {getFileIcon(file.type)}
          <div>
            <h3 className="text-lg font-semibold">{file.name}</h3>
            <Badge variant="outline">{file.type.toUpperCase()}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
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

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getFileIcon(file.type)}
                </div>
                <h4 className="text-xl font-semibold mb-2">{file.name}</h4>
                <Badge variant="outline" className="mb-4">{file.type.toUpperCase()}</Badge>
                <p className="text-muted-foreground">Size: {file.sizeDisplay}</p>
                
                {file.type === "circuit" && (
                  <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-left">
{`OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
cx q[0],q[1];
measure q -> c;`}
                    </pre>
                  </div>
                )}
                
                {file.type === "algorithm" && (
                  <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-left">
{`def grover_search(oracle, n_qubits):
    circuit = QuantumCircuit(n_qubits)
    
    # Initialize superposition
    for qubit in range(n_qubits):
        circuit.h(qubit)
    
    return circuit`}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="flex-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-mono">{file.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-mono">{file.sizeDisplay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Modified</p>
                  <p className="text-sm">{file.updatedAt.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {file.superposition && (
                  <Badge className="bg-blue-100 text-blue-800">Superposition</Badge>
                )}
                {file.favorite && (
                  <Badge className="bg-yellow-100 text-yellow-800">Favorite</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
