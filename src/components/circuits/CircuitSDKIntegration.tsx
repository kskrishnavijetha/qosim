
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCircuitSDKIntegration } from '@/hooks/useCircuitSDKIntegration';
import { 
  Code, 
  Download, 
  Upload, 
  Zap, 
  Lightbulb, 
  Play, 
  Users,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CircuitSDKIntegrationProps {
  onOptimizedCircuit?: (circuit: any) => void;
  onSimulationResult?: (result: any) => void;
}

export function CircuitSDKIntegration({ 
  onOptimizedCircuit, 
  onSimulationResult 
}: CircuitSDKIntegrationProps) {
  const [activeTab, setActiveTab] = useState('export');
  const [importCode, setImportCode] = useState('');
  const [importFormat, setImportFormat] = useState<'javascript' | 'python' | 'qasm' | 'json'>('javascript');
  const [exportFormat, setExportFormat] = useState<'javascript' | 'python'>('javascript');

  const {
    exportToSDK,
    importFromSDK,
    optimizeCircuit,
    isOptimizing,
    suggestions,
    getContextSuggestions,
    runUnifiedSimulation,
    syncStatus,
    isConnected,
    circuit
  } = useCircuitSDKIntegration({
    enableRealTimeSync: true,
    enableAIOptimization: true,
    enableContextSuggestions: true,
    targetSDK: exportFormat
  });

  const handleExport = async () => {
    try {
      const result = await exportToSDK(exportFormat);
      
      // Create downloadable file
      const blob = new Blob([result.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantum_circuit.${exportFormat === 'javascript' ? 'js' : 'py'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async () => {
    if (!importCode.trim()) return;
    
    try {
      const importedCircuit = await importFromSDK(importCode, importFormat);
      onOptimizedCircuit?.(importedCircuit);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const handleOptimize = async () => {
    try {
      await optimizeCircuit();
      onOptimizedCircuit?.(circuit);
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  const handleSimulation = async () => {
    try {
      const result = await runUnifiedSimulation();
      onSimulationResult?.(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  };

  const contextSuggestions = getContextSuggestions();
  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Code className="w-5 h-5" />
            Circuit ↔ SDK Integration
          </CardTitle>
          <div className="flex items-center gap-2">
            {getSyncStatusIcon()}
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 quantum-panel">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="optimize">Optimize</TabsTrigger>
            <TabsTrigger value="simulate">Simulate</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div>
              <label className="text-sm text-quantum-neon mb-2 block">Target SDK</label>
              <Select value={exportFormat} onValueChange={(value: 'javascript' | 'python') => setExportFormat(value)}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="javascript">JavaScript SDK</SelectItem>
                  <SelectItem value="python">Python SDK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExport} 
                className="flex-1"
                disabled={circuit.gates.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export to {exportFormat.toUpperCase()}
              </Button>
            </div>
            
            <div className="text-xs text-quantum-particle">
              Export your visual circuit as {exportFormat === 'javascript' ? 'JavaScript' : 'Python'} SDK code
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div>
              <label className="text-sm text-quantum-neon mb-2 block">Source Format</label>
              <Select value={importFormat} onValueChange={(value: any) => setImportFormat(value)}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="qasm">QASM</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder={`Paste your ${importFormat.toUpperCase()} quantum circuit code here...`}
              className="quantum-panel neon-border h-32 font-mono text-xs"
            />
            
            <Button 
              onClick={handleImport}
              disabled={!importCode.trim()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import to Visual Builder
            </Button>
          </TabsContent>

          <TabsContent value="optimize" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-quantum-neon">AI-Powered Optimization</h4>
              <Button 
                onClick={handleOptimize}
                disabled={isOptimizing || circuit.gates.length === 0}
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isOptimizing ? 'Optimizing...' : 'Optimize'}
              </Button>
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-quantum-particle">Recent Optimizations</h5>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-2 bg-quantum-void rounded border border-quantum-matrix">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-quantum-glow">
                        {(suggestion.impact * 100).toFixed(0)}% improvement
                      </span>
                    </div>
                    <p className="text-xs text-quantum-particle mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Context-Aware Suggestions */}
            {contextSuggestions.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-quantum-particle flex items-center gap-2">
                  <Lightbulb className="w-3 h-3" />
                  Smart Suggestions
                </h5>
                {contextSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-2 bg-quantum-matrix/20 rounded border border-quantum-glow/20">
                    <h6 className="text-xs font-medium text-quantum-glow">
                      {suggestion.title}
                    </h6>
                    <p className="text-xs text-quantum-particle">
                      {suggestion.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="simulate" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-quantum-neon">Unified Simulation</h4>
              <Button 
                onClick={handleSimulation}
                disabled={circuit.gates.length === 0}
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </Button>
            </div>
            
            <div className="text-xs text-quantum-particle">
              Run identical simulations from both visual builder and SDK with synchronized results.
            </div>
            
            {isConnected && (
              <div className="flex items-center gap-2 p-2 bg-quantum-matrix/10 rounded">
                <Users className="w-4 h-4 text-quantum-glow" />
                <span className="text-xs text-quantum-particle">
                  Real-time collaboration enabled - simulation results will be shared with collaborators
                </span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
