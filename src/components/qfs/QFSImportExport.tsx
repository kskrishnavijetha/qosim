import { useState } from "react";
import { Upload, Download, FileText, Code, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QFSFile } from "@/lib/qfs/qfsCore";
import { toast } from "sonner";

interface QFSImportExportProps {
  onQASMImport: (content: string, fileName: string) => void;
  onQASMFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onJSONImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  files: QFSFile[];
  onExportQASM: (fileId: string) => void;
  onExportJSON: (fileId: string) => void;
}

export function QFSImportExport({ 
  onQASMImport, 
  onQASMFileUpload, 
  onJSONImport, 
  files, 
  onExportQASM, 
  onExportJSON 
}: QFSImportExportProps) {
  const [qasmContent, setQasmContent] = useState("");
  const [qasmFileName, setQasmFileName] = useState("");

  const handleQASMImport = () => {
    if (!qasmContent.trim() || !qasmFileName.trim()) {
      toast.error("Please provide both QASM content and file name");
      return;
    }
    
    onQASMImport(qasmContent, qasmFileName);
    setQasmContent("");
    setQasmFileName("");
  };

  const circuitFiles = files.filter(f => f.type === 'circuit' || f.type === 'qasm');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Files</TabsTrigger>
          <TabsTrigger value="export">Export Files</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          {/* QASM Import */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Import QASM Circuit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qasm-filename">File Name</Label>
                <Input
                  id="qasm-filename"
                  placeholder="my_circuit"
                  value={qasmFileName}
                  onChange={(e) => setQasmFileName(e.target.value)}
                  className="quantum-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qasm-content">QASM Content</Label>
                <Textarea
                  id="qasm-content"
                  placeholder="OPENQASM 2.0;&#10;include &quot;qelib1.inc&quot;;&#10;&#10;qreg q[2];&#10;creg c[2];&#10;&#10;h q[0];&#10;cx q[0],q[1];&#10;measure q -> c;"
                  value={qasmContent}
                  onChange={(e) => setQasmContent(e.target.value)}
                  className="min-h-32 font-mono text-sm quantum-input"
                />
              </div>
              
              <Button onClick={handleQASMImport} className="bg-quantum-glow text-black">
                <Upload className="w-4 h-4 mr-2" />
                Import QASM
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qasm-file">Upload QASM File</Label>
                <Input
                  id="qasm-file"
                  type="file"
                  accept=".qasm,.txt"
                  onChange={onQASMFileUpload}
                  className="quantum-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="json-file">Upload JSON File</Label>
                <Input
                  id="json-file"
                  type="file"
                  accept=".json"
                  onChange={onJSONImport}
                  className="quantum-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sample QASM Templates */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Code className="w-5 h-5" />
                QASM Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQasmContent(`OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

h q[0];
cx q[0],q[1];
measure q -> c;`);
                    setQasmFileName("bell_state");
                  }}
                  className="neon-border"
                >
                  Bell State
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setQasmContent(`OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
h q[1];
h q[2];
x q[2];
ccx q[0],q[1],q[2];
h q[0];
h q[1];
measure q -> c;`);
                    setQasmFileName("grover_3qubit");
                  }}
                  className="neon-border"
                >
                  Grover 3-Qubit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          {/* Export Options */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {circuitFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No circuit files available for export
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Available Circuit Files</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {circuitFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-muted/20 bg-black/20"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-quantum-glow" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {file.type} • {file.sizeDisplay} • {file.metadata.version}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onExportJSON(file.id)}
                            className="neon-border"
                          >
                            <Database className="w-3 h-3 mr-1" />
                            JSON
                          </Button>
                          
                          {(file.type === 'circuit' || file.type === 'qasm') && (
                            <Button
                              size="sm"
                              onClick={() => onExportQASM(file.id)}
                              className="bg-quantum-glow text-black"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              QASM
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bulk Export */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Bulk Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={() => {
                  files.forEach(file => onExportJSON(file.id));
                  toast.success('All files exported as JSON');
                }}
                className="w-full neon-border"
                disabled={files.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Files as JSON
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  circuitFiles.forEach(file => onExportQASM(file.id));
                  toast.success('All circuit files exported as QASM');
                }}
                className="w-full neon-border"
                disabled={circuitFiles.length === 0}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export All Circuits as QASM
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}