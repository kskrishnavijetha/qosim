import React, { useState, useRef } from 'react';
import { Download, Github, Package, Image, FileText, Code, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useCircuitExport } from '@/hooks/useCircuitExport';
import { useToast } from '@/hooks/use-toast';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  label?: string;
  comment?: string;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit: Gate[];
  circuitRef: React.RefObject<HTMLElement>;
  numQubits: number;
}

export function ExportDialog({ 
  open, 
  onOpenChange, 
  circuit, 
  circuitRef,
  numQubits 
}: ExportDialogProps) {
  const { toast } = useToast();
  const {
    isExporting,
    exportToJSON,
    exportToQASM,
    exportToQiskit,
    exportToSVG,
    exportToZip,
    exportToGitHub,
    captureCircuitImage,
    downloadBlob
  } = useCircuitExport();

  const [options, setOptions] = useState({
    includeComments: true,
    customLabels: true,
    projectName: 'quantum_circuit'
  });

  const [githubSettings, setGithubSettings] = useState({
    repository: '',
    token: ''
  });

  const handleExportJSON = async () => {
    try {
      const blob = exportToJSON(circuit, options);
      downloadBlob(blob, `${options.projectName}.json`);
      toast({ title: "JSON exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportQASM = async () => {
    try {
      const blob = exportToQASM(circuit, options, numQubits);
      downloadBlob(blob, `${options.projectName}.qasm`);
      toast({ title: "QASM exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportQiskit = async () => {
    try {
      const blob = exportToQiskit(circuit, options, numQubits);
      downloadBlob(blob, `${options.projectName}.py`);
      toast({ title: "Qiskit exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportSVG = async () => {
    try {
      const blob = exportToSVG(circuit, numQubits);
      downloadBlob(blob, `${options.projectName}.svg`);
      toast({ title: "SVG exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportPNG = async () => {
    try {
      const blob = await captureCircuitImage(circuitRef);
      downloadBlob(blob, `${options.projectName}.png`);
      toast({ title: "PNG exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportZip = async () => {
    try {
      let imageBlob;
      try {
        imageBlob = await captureCircuitImage(circuitRef);
      } catch (error) {
        console.warn('Failed to capture circuit image:', error);
      }
      
      const zipBlob = await exportToZip(circuit, options, imageBlob, numQubits);
      downloadBlob(zipBlob, `${options.projectName}_complete.zip`);
      toast({ title: "ZIP package exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportGitHub = async () => {
    if (!githubSettings.repository || !githubSettings.token) {
      toast({ 
        title: "Missing GitHub settings", 
        description: "Please provide repository and token",
        variant: "destructive" 
      });
      return;
    }

    try {
      await exportToGitHub(circuit, options, githubSettings.repository, githubSettings.token, numQubits);
      toast({ title: "Successfully exported to GitHub!" });
    } catch (error) {
      toast({ 
        title: "GitHub export failed", 
        description: String(error), 
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Quantum Circuit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <Card className="quantum-panel border-quantum-glow/20">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={options.projectName}
                  onChange={(e) => setOptions(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name"
                  className="neon-border"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeComments">Include Comments</Label>
                <Switch
                  id="includeComments"
                  checked={options.includeComments}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeComments: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="customLabels">Custom Labels</Label>
                <Switch
                  id="customLabels"
                  checked={options.customLabels}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, customLabels: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Individual Exports */}
          <Card className="quantum-panel border-quantum-glow/20">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-quantum-glow">Individual Formats</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleExportJSON} 
                  variant="outline" 
                  className="neon-border flex items-center gap-2"
                  disabled={isExporting}
                >
                  <FileText className="w-4 h-4" />
                  JSON
                </Button>

                <Button 
                  onClick={handleExportQASM} 
                  variant="outline" 
                  className="neon-border flex items-center gap-2"
                  disabled={isExporting}
                >
                  <Code className="w-4 h-4" />
                  QASM
                </Button>

                <Button 
                  onClick={handleExportQiskit} 
                  variant="outline" 
                  className="neon-border flex items-center gap-2"
                  disabled={isExporting}
                >
                  <Code className="w-4 h-4" />
                  Qiskit
                </Button>

                <Button 
                  onClick={handleExportSVG} 
                  variant="outline" 
                  className="neon-border flex items-center gap-2"
                  disabled={isExporting}
                >
                  <Image className="w-4 h-4" />
                  SVG
                </Button>
              </div>

              <Button 
                onClick={handleExportPNG} 
                variant="outline" 
                className="neon-border w-full flex items-center gap-2"
                disabled={isExporting}
              >
                <Image className="w-4 h-4" />
                PNG Screenshot
              </Button>
            </CardContent>
          </Card>

          {/* ZIP Export */}
          <Card className="quantum-panel border-quantum-glow/20">
            <CardContent className="p-4">
              <Button 
                onClick={handleExportZip} 
                className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-black flex items-center gap-2"
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                Export Complete ZIP Package
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Includes JSON, QASM, Qiskit, SVG, PNG, and README
              </p>
            </CardContent>
          </Card>

          <Separator className="bg-quantum-glow/20" />

          {/* GitHub Integration */}
          <Card className="quantum-panel border-quantum-glow/20">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-quantum-glow flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Integration
              </h3>

              <div className="space-y-2">
                <Label htmlFor="repository">Repository (owner/repo)</Label>
                <Input
                  id="repository"
                  value={githubSettings.repository}
                  onChange={(e) => setGithubSettings(prev => ({ ...prev, repository: e.target.value }))}
                  placeholder="username/repository-name"
                  className="neon-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">GitHub Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={githubSettings.token}
                  onChange={(e) => setGithubSettings(prev => ({ ...prev, token: e.target.value }))}
                  placeholder="ghp_..."
                  className="neon-border"
                />
              </div>

              <Button 
                onClick={handleExportGitHub} 
                variant="outline"
                className="w-full neon-border flex items-center gap-2"
                disabled={isExporting || !githubSettings.repository || !githubSettings.token}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-4 h-4" />
                )}
                Export to GitHub
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Creates files in /circuits/ folder with JSON, QASM, and Qiskit formats
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}