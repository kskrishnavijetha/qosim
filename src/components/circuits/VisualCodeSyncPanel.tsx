
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CodeEditor } from '@/components/panels/sdk-demo/CodeEditor';
import { useCircuitSDKIntegration } from '@/hooks/useCircuitSDKIntegration';
import { ArrowLeftRight, Eye, Code2, Sync } from 'lucide-react';

interface VisualCodeSyncPanelProps {
  circuit: any;
  onCircuitUpdate?: (circuit: any) => void;
}

export function VisualCodeSyncPanel({ circuit, onCircuitUpdate }: VisualCodeSyncPanelProps) {
  const [autoSync, setAutoSync] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'visual' | 'code'>('split');
  const [currentCode, setCurrentCode] = useState('');
  const [codeFormat, setCodeFormat] = useState<'javascript' | 'python'>('javascript');

  const {
    exportToSDK,
    importFromSDK,
    syncStatus,
    circuit: integrationCircuit
  } = useCircuitSDKIntegration({
    enableRealTimeSync: autoSync,
    enableAIOptimization: true,
    enableContextSuggestions: true,
    targetSDK: codeFormat
  });

  // Auto-sync circuit to code when enabled
  useEffect(() => {
    if (autoSync && circuit) {
      syncCircuitToCode();
    }
  }, [circuit, autoSync, codeFormat]);

  const syncCircuitToCode = async () => {
    try {
      const result = await exportToSDK(codeFormat);
      setCurrentCode(result.code);
    } catch (error) {
      console.error('Failed to sync circuit to code:', error);
    }
  };

  const syncCodeToCircuit = async () => {
    if (!currentCode.trim()) return;
    
    try {
      const importedCircuit = await importFromSDK(currentCode, codeFormat);
      onCircuitUpdate?.(importedCircuit);
    } catch (error) {
      console.error('Failed to sync code to circuit:', error);
    }
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
    
    if (autoSync) {
      // Debounce auto-sync
      const timeoutId = setTimeout(() => {
        syncCodeToCircuit();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="quantum-panel neon-border mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Visual ↔ Code Sync
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-quantum-particle">Auto-sync</span>
                <Switch
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>
              <Badge variant={syncStatus === 'syncing' ? 'default' : 'secondary'}>
                {syncStatus === 'syncing' ? 'Syncing...' : 'Ready'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={viewMode === 'visual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('visual')}
            >
              <Eye className="w-4 h-4 mr-1" />
              Visual
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              <ArrowLeftRight className="w-4 h-4 mr-1" />
              Split
            </Button>
            <Button
              variant={viewMode === 'code' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('code')}
            >
              <Code2 className="w-4 h-4 mr-1" />
              Code
            </Button>
            
            {!autoSync && (
              <Button
                variant="outline"
                size="sm"
                onClick={syncCircuitToCode}
                className="ml-auto"
              >
                <Sync className="w-4 h-4 mr-1" />
                Sync Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 grid gap-4" style={{
        gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
        display: viewMode === 'visual' ? 'none' : 'grid'
      }}>
        {(viewMode === 'split' || viewMode === 'code') && (
          <div className="space-y-4">
            <CodeEditor
              selectedExample="custom"
              customCode={currentCode}
              isRunning={false}
              selectedSDK={codeFormat}
              onExampleChange={() => {}}
              onCodeChange={handleCodeChange}
              onRunExample={() => {}}
              onCopyCode={(code) => navigator.clipboard.writeText(code)}
              onDownloadSDK={() => {}}
              onSDKChange={setCodeFormat}
            />
            
            {!autoSync && (
              <Button
                onClick={syncCodeToCircuit}
                disabled={!currentCode.trim()}
                className="w-full"
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Apply Code to Visual Builder
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
