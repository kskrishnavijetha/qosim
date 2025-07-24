
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircuitBuilder } from './CircuitBuilder';
import { AIOptimizationPanel } from './AIOptimizationPanel';
import { CollaborationPanel } from './CollaborationPanel';
import { CodeExportPanel } from './CodeExportPanel';
import { useCircuitWorkspace, type Gate } from '@/hooks/useCircuitWorkspace';
import { useRealtimeCircuitCollaboration } from '@/hooks/useRealtimeCircuitCollaboration';
import { CircuitIntegrationService } from '@/services/circuitIntegration';
import { AIOptimizationEngine } from '@/services/aiOptimization';
import { 
  Code, 
  Users, 
  Zap, 
  Upload, 
  Download, 
  MessageSquare,
  Sparkles,
  GitBranch,
  History
} from 'lucide-react';
import { toast } from 'sonner';

interface IntegratedCircuitBuilderProps {
  initialCircuit?: Gate[];
  onCircuitChange?: (gates: Gate[]) => void;
  enableCollaboration?: boolean;
  enableAI?: boolean;
}

export function IntegratedCircuitBuilder({
  initialCircuit = [],
  onCircuitChange,
  enableCollaboration = true,
  enableAI = true
}: IntegratedCircuitBuilderProps) {
  const circuitRef = useRef<HTMLDivElement>(null);
  const [circuit, setCircuit] = useState<Gate[]>(initialCircuit);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importFormat, setImportFormat] = useState<'python' | 'javascript' | 'qasm' | 'json'>('python');
  const [activeTab, setActiveTab] = useState('builder');
  
  const integrationService = new CircuitIntegrationService();
  const aiEngine = new AIOptimizationEngine();
  
  const workspace = useCircuitWorkspace();
  const collaboration = useRealtimeCircuitCollaboration(workspace.activeCircuitId);

  const handleCircuitChange = useCallback((newCircuit: Gate[]) => {
    setCircuit(newCircuit);
    onCircuitChange?.(newCircuit);
    
    // Broadcast change to collaborators
    if (enableCollaboration && collaboration.isConnected) {
      collaboration.broadcastChange('gate_added', { gates: newCircuit });
    }
  }, [onCircuitChange, enableCollaboration, collaboration]);

  const handleImportCode = useCallback(async () => {
    try {
      const { gates, metadata } = await integrationService.importCircuitFromCode(importCode, importFormat);
      handleCircuitChange(gates);
      setShowImportDialog(false);
      toast.success(`Circuit imported from ${importFormat.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to import circuit: ${error}`);
    }
  }, [importCode, importFormat, handleCircuitChange]);

  const handleExportCode = useCallback(async (format: 'python' | 'javascript' | 'qasm' | 'json') => {
    try {
      const metadata = {
        name: 'Exported Circuit',
        version: '1.0.0',
        tags: [],
        comments: {},
        created: new Date(),
        lastModified: new Date()
      };
      
      const exports = await integrationService.exportCircuitToCode(circuit, metadata);
      const code = exports[format];
      
      // Copy to clipboard
      await navigator.clipboard.writeText(code);
      toast.success(`${format.toUpperCase()} code copied to clipboard`);
    } catch (error) {
      toast.error(`Failed to export circuit: ${error}`);
    }
  }, [circuit]);

  const handleAutoOptimize = useCallback(async () => {
    try {
      const optimizedGates = await aiEngine.autoOptimize(circuit);
      handleCircuitChange(optimizedGates);
      toast.success('Circuit optimized successfully');
    } catch (error) {
      toast.error(`Optimization failed: ${error}`);
    }
  }, [circuit, handleCircuitChange]);

  const handleAddComment = useCallback((gateId: string, comment: string) => {
    if (collaboration.addComment) {
      collaboration.addComment(gateId, comment);
    }
  }, [collaboration]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with Integration Controls */}
      <div className="flex items-center justify-between p-4 border-b border-quantum-matrix">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-quantum-glow">Integrated Circuit Builder</h2>
          <Badge variant="outline" className="text-quantum-neon">
            {circuit.length} gates
          </Badge>
          
          {enableCollaboration && (
            <div className="flex items-center gap-2">
              <Badge variant={collaboration.isConnected ? "default" : "secondary"}>
                <Users className="w-3 h-3 mr-1" />
                {collaboration.activeUsers.length} users
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="neon-border">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="quantum-panel neon-border">
              <DialogHeader>
                <DialogTitle className="text-quantum-glow">Import Circuit Code</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={importFormat} onValueChange={(value: any) => setImportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="qasm">QASM</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Textarea
                    id="code"
                    value={importCode}
                    onChange={(e) => setImportCode(e.target.value)}
                    placeholder="Paste your circuit code here..."
                    className="h-32 font-mono"
                  />
                </div>
                <Button onClick={handleImportCode} className="w-full">
                  Import Circuit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExportCode('python')}
            className="neon-border"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          {enableAI && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAutoOptimize}
              className="neon-border text-quantum-glow"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Auto-Optimize
            </Button>
          )}
        </div>
      </div>
      
      {/* Integrated Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="builder" className="quantum-tab">
            <Code className="w-4 h-4 mr-2" />
            Circuit Builder
          </TabsTrigger>
          
          {enableCollaboration && (
            <TabsTrigger value="collaboration" className="quantum-tab">
              <Users className="w-4 h-4 mr-2" />
              Collaboration
              {collaboration.comments.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {collaboration.comments.filter(c => !c.resolved).length}
                </Badge>
              )}
            </TabsTrigger>
          )}
          
          {enableAI && (
            <TabsTrigger value="optimization" className="quantum-tab">
              <Zap className="w-4 h-4 mr-2" />
              AI Optimization
            </TabsTrigger>
          )}
          
          <TabsTrigger value="export" className="quantum-tab">
            <Download className="w-4 h-4 mr-2" />
            Export & SDK
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder" className="flex-1">
          <CircuitBuilder
            circuit={circuit}
            dragState={{
              isDragging: false,
              gateType: '',
              dragPosition: { x: 0, y: 0 },
              hoverQubit: null,
              hoverPosition: null
            }}
            simulationResult={null}
            onDeleteGate={(gateId) => {
              const newCircuit = circuit.filter(g => g.id !== gateId);
              handleCircuitChange(newCircuit);
            }}
            onGateMouseDown={() => {}}
            circuitRef={circuitRef}
            numQubits={5}
            gridSize={60}
          />
        </TabsContent>
        
        {enableCollaboration && (
          <TabsContent value="collaboration" className="flex-1">
            <CollaborationPanel
              activeUsers={collaboration.activeUsers}
              comments={collaboration.comments}
              onAddComment={handleAddComment}
              onResolveComment={collaboration.resolveComment}
              circuit={circuit}
            />
          </TabsContent>
        )}
        
        {enableAI && (
          <TabsContent value="optimization" className="flex-1">
            <AIOptimizationPanel
              circuit={circuit}
              onOptimizedCircuit={handleCircuitChange}
              aiEngine={aiEngine}
            />
          </TabsContent>
        )}
        
        <TabsContent value="export" className="flex-1">
          <CodeExportPanel
            circuit={circuit}
            onExport={handleExportCode}
            integrationService={integrationService}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
