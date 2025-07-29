
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Link, Upload, Download, Sync, Users, Eye } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';
import { toast } from 'sonner';

interface CircuitBuilderIntegrationProps {
  onCircuitSync: (direction: 'export' | 'import') => void;
  currentCircuit: any;
  selectedAlgorithm: Algorithm | null;
}

export function CircuitBuilderIntegration({ 
  onCircuitSync, 
  currentCircuit, 
  selectedAlgorithm 
}: CircuitBuilderIntegrationProps) {
  const [autoSync, setAutoSync] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);

  const handleExportToBuilder = () => {
    onCircuitSync('export');
  };

  const handleImportFromBuilder = () => {
    onCircuitSync('import');
  };

  const handleAutoOptimization = async () => {
    if (!selectedAlgorithm) return;
    
    try {
      // Simulate AI optimization process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Circuit optimized: 15% depth reduction, 20% gate count reduction');
    } catch (error) {
      toast.error('Optimization failed');
    }
  };

  const handleCollaborationToggle = (enabled: boolean) => {
    setCollaborationMode(enabled);
    if (enabled) {
      toast.success('Real-time collaboration enabled via QFS');
    } else {
      toast.info('Collaboration mode disabled');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Integration Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
            <Link className="w-5 h-5" />
            Circuit Builder Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleExportToBuilder}
              disabled={!selectedAlgorithm}
              className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Builder
            </Button>
            <Button
              onClick={handleImportFromBuilder}
              disabled={!currentCircuit}
              variant="outline"
              className="neon-border"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import from Builder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Sync className="w-4 h-4" />
            Synchronization Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-quantum-glow">Auto-Sync</div>
                <div className="text-xs text-quantum-particle">Automatically sync changes between builder and SDK</div>
              </div>
              <Switch
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-quantum-glow">AI Optimization</div>
                <div className="text-xs text-quantum-particle">Apply AI-powered circuit optimizations during sync</div>
              </div>
              <Switch
                checked={optimizationEnabled}
                onCheckedChange={setOptimizationEnabled}
              />
            </div>
            
            {optimizationEnabled && (
              <div className="bg-quantum-void rounded-lg border border-quantum-matrix p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-quantum-neon">Optimization Available</span>
                  <Badge variant="secondary">AI Ready</Badge>
                </div>
                <Button
                  size="sm"
                  onClick={handleAutoOptimization}
                  className="w-full neon-border"
                  variant="outline"
                >
                  Apply One-Click Optimization
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Features */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Users className="w-4 h-4" />
            Real-Time Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-quantum-glow">QFS Collaboration</div>
                <div className="text-xs text-quantum-particle">Multi-user editing with live sync</div>
              </div>
              <Switch
                checked={collaborationMode}
                onCheckedChange={handleCollaborationToggle}
              />
            </div>
            
            {collaborationMode && (
              <div className="space-y-3">
                <div className="bg-quantum-void rounded-lg border border-quantum-matrix p-3">
                  <div className="text-xs text-quantum-particle mb-2">Active Collaborators</div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-quantum-energy rounded-full flex items-center justify-center text-xs">
                      U1
                    </div>
                    <div className="w-6 h-6 bg-quantum-neon rounded-full flex items-center justify-center text-xs">
                      U2
                    </div>
                    <Badge variant="outline" className="text-xs">
                      2 online
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="neon-border text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View Comments
                  </Button>
                  <Button size="sm" variant="outline" className="neon-border text-xs">
                    Version History
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="flex-1 quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon">Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-quantum-particle mb-2">Selected Algorithm</div>
              {selectedAlgorithm ? (
                <div className="bg-quantum-void rounded-lg border border-quantum-matrix p-3">
                  <div className="text-sm text-quantum-glow mb-1">{selectedAlgorithm.name}</div>
                  <div className="text-xs text-quantum-particle">{selectedAlgorithm.description}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{selectedAlgorithm.qubits} qubits</Badge>
                    <Badge variant="secondary">{selectedAlgorithm.complexity}</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No algorithm selected</div>
              )}
            </div>

            <Separator className="bg-quantum-matrix" />

            <div>
              <div className="text-xs text-quantum-particle mb-2">Circuit Builder Status</div>
              {currentCircuit ? (
                <div className="bg-quantum-void rounded-lg border border-quantum-matrix p-3">
                  <div className="text-sm text-quantum-glow mb-1">{currentCircuit.name || 'Untitled Circuit'}</div>
                  <div className="text-xs text-quantum-particle">
                    Ready for import • {currentCircuit.gates?.length || 0} gates
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No circuit available</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-xs text-quantum-particle">Integration Features</div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Visual ↔ Code Sync</span>
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>AI Optimization</span>
                  <Badge variant={optimizationEnabled ? "default" : "secondary"} className="text-xs">
                    {optimizationEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Real-time Collaboration</span>
                  <Badge variant={collaborationMode ? "default" : "secondary"} className="text-xs">
                    {collaborationMode ? "Active" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
