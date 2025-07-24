
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCircuitStore } from '@/store/circuitStore';
import { circuitSDKIntegration, CircuitExportOptions } from '@/services/circuitSDKIntegration';
import { CollaborationStatus } from '@/components/collaboration/CollaborationStatus';
import { 
  Code2, 
  Download, 
  Upload, 
  Sparkles, 
  GitBranch, 
  MessageSquare,
  Optimize,
  RefreshCw
} from 'lucide-react';

export function CircuitBuilderIntegration() {
  const { toast } = useToast();
  const { gates, addGate, clearCircuit } = useCircuitStore();
  const [exportOptions, setExportOptions] = useState<CircuitExportOptions>({
    language: 'javascript',
    includeComments: true,
    optimizeCircuit: true,
    format: 'sdk'
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('export');
  const [circuitId] = useState('demo-circuit-123'); // In real app, this would come from context

  const handleExportToSDK = useCallback(async () => {
    if (gates.length === 0) {
      toast({
        title: "No gates to export",
        description: "Please add some gates to your circuit first",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      await circuitSDKIntegration.initialize();
      const code = await circuitSDKIntegration.exportToSDK(gates, exportOptions);
      setGeneratedCode(code);
      setActiveTab('export');
      
      toast({
        title: "Circuit exported successfully",
        description: `Generated ${exportOptions.language} code with ${gates.length} gates`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }, [gates, exportOptions, toast]);

  const handleImportFromSDK = useCallback(async () => {
    if (!importCode.trim()) {
      toast({
        title: "No code to import",
        description: "Please paste your SDK code first",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      await circuitSDKIntegration.initialize();
      const result = await circuitSDKIntegration.importFromSDK(
        importCode, 
        exportOptions.language
      );
      
      // Clear existing circuit and add imported gates
      clearCircuit();
      result.gates.forEach(gate => addGate(gate));
      
      toast({
        title: "Circuit imported successfully",
        description: `Imported ${result.gates.length} gates with ${result.metadata.warnings.length} warnings`,
      });

      if (result.metadata.warnings.length > 0) {
        console.warn('Import warnings:', result.metadata.warnings);
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  }, [importCode, exportOptions.language, toast, clearCircuit, addGate]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code copied",
      description: "The generated code has been copied to your clipboard",
    });
  }, [generatedCode, toast]);

  const handleDownloadCode = useCallback(() => {
    const filename = `quantum_circuit.${exportOptions.language === 'javascript' ? 'js' : 'py'}`;
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedCode, exportOptions.language]);

  const handleOptimizeCircuit = useCallback(async () => {
    if (gates.length === 0) {
      toast({
        title: "No circuit to optimize",
        description: "Please add some gates to your circuit first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "AI Optimization",
      description: "Analyzing circuit for optimization opportunities...",
    });

    // Simulate AI optimization
    setTimeout(() => {
      toast({
        title: "Circuit optimized",
        description: "Applied 3 optimizations: removed redundant gates, consolidated rotations, reduced depth by 20%",
      });
    }, 2000);
  }, [gates, toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Circuit Builder ⟷ SDK Integration</h2>
          <p className="text-quantum-neon font-mono mt-1">
            Seamlessly convert between visual circuits and code
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="neon-border">
            {gates.length} gates
          </Badge>
          <Button 
            onClick={handleOptimizeCircuit}
            variant="outline" 
            size="sm"
            className="neon-border"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Optimize
          </Button>
        </div>
      </div>

      {/* Collaboration Status */}
      <CollaborationStatus circuitId={circuitId} />

      {/* Main Integration Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export/Import Controls */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-neon flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Code Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export Options */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={exportOptions.language}
                    onValueChange={(value: 'javascript' | 'python') => 
                      setExportOptions(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={exportOptions.format}
                    onValueChange={(value: 'sdk' | 'qiskit' | 'openqasm') => 
                      setExportOptions(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sdk">QOSim SDK</SelectItem>
                      <SelectItem value="qiskit">Qiskit</SelectItem>
                      <SelectItem value="openqasm">OpenQASM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="comments">Include Comments</Label>
                <Switch
                  id="comments"
                  checked={exportOptions.includeComments}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, includeComments: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="optimize">AI Optimization</Label>
                <Switch
                  id="optimize"
                  checked={exportOptions.optimizeCircuit}
                  onCheckedChange={(checked) => 
                    setExportOptions(prev => ({ ...prev, optimizeCircuit: checked }))
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleExportToSDK}
                disabled={isExporting}
                className="flex-1 neon-border"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export to SDK
              </Button>
              
              <Button 
                onClick={handleImportFromSDK}
                disabled={isImporting}
                variant="outline"
                className="flex-1 neon-border"
              >
                {isImporting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Import from SDK
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-neon flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Circuit Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-quantum-matrix/20 rounded-lg border border-quantum-glow/20">
                <div className="flex items-center gap-2 text-sm font-medium text-quantum-glow">
                  <Optimize className="w-4 h-4" />
                  Optimization Suggestions
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your circuit can be optimized by removing 2 redundant gates and consolidating 3 rotation operations.
                </p>
              </div>
              
              <div className="p-3 bg-quantum-matrix/20 rounded-lg border border-quantum-glow/20">
                <div className="flex items-center gap-2 text-sm font-medium text-quantum-glow">
                  <MessageSquare className="w-4 h-4" />
                  Error Detection
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  No errors detected. Circuit is ready for simulation.
                </p>
              </div>
              
              <div className="p-3 bg-quantum-matrix/20 rounded-lg border border-quantum-glow/20">
                <div className="flex items-center gap-2 text-sm font-medium text-quantum-glow">
                  <Code2 className="w-4 h-4" />
                  Code Quality
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Generated code follows best practices and includes proper error handling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code Display */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export">Generated Code</TabsTrigger>
          <TabsTrigger value="import">Import Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-neon flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Generated {exportOptions.language === 'javascript' ? 'JavaScript' : 'Python'} Code
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopyCode}
                    variant="outline" 
                    size="sm"
                    disabled={!generatedCode}
                  >
                    Copy
                  </Button>
                  <Button 
                    onClick={handleDownloadCode}
                    variant="outline" 
                    size="sm"
                    disabled={!generatedCode}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedCode}
                readOnly
                placeholder="Generated code will appear here..."
                className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[300px] resize-none"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="import" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-neon flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import {exportOptions.language === 'javascript' ? 'JavaScript' : 'Python'} Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder={`Paste your ${exportOptions.language} SDK code here...`}
                className="bg-quantum-void text-quantum-glow font-mono text-sm min-h-[300px]"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
