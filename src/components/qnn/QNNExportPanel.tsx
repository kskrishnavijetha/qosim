import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QNNArchitecture } from '@/hooks/useQNNBuilder';
import { Download, Share, Code, FileJson, Globe, Zap } from 'lucide-react';

interface QNNExportPanelProps {
  architecture: QNNArchitecture;
  onExport: (format: 'python' | 'javascript' | 'json' | 'qiskit' | 'pennylane' | 'cirq') => void;
}

export function QNNExportPanel({ architecture, onExport }: QNNExportPanelProps) {
  const handleShare = () => {
    const shareData = {
      title: `QNN Architecture: ${architecture.name}`,
      text: `Check out my Quantum Neural Network with ${architecture.layers.length} layers!`,
      url: window.location.href + `?shared=${architecture.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export & Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Standard SDK Export */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-neon">Standard Export</h4>
          <div className="grid gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('python')}
              disabled={architecture.layers.length === 0}
              className="justify-start"
            >
              <Code className="w-4 h-4 mr-2" />
              Python (TensorFlow Quantum)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('javascript')}
              disabled={architecture.layers.length === 0}
              className="justify-start"
            >
              <Code className="w-4 h-4 mr-2" />
              JavaScript (TensorFlow.js)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('json')}
              disabled={architecture.layers.length === 0}
              className="justify-start"
            >
              <FileJson className="w-4 h-4 mr-2" />
              JSON Circuit File
            </Button>
          </div>
        </div>

        <Separator />

        {/* Quantum Framework Export */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-neon">Quantum Frameworks</h4>
          <div className="grid gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('qiskit')}
              disabled={architecture.layers.length === 0}
              className="justify-start"
            >
              <Zap className="w-4 h-4 mr-2" />
              Qiskit (IBM Quantum)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('pennylane')}
              disabled={architecture.layers.length === 0}
              className="justify-start"
            >
              <Zap className="w-4 h-4 mr-2" />
              PennyLane (Xanadu)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport('cirq')}
              disabled={architecture.layers.length === 0}
              className="justify-start"
            >
              <Zap className="w-4 h-4 mr-2" />
              Cirq (Google Quantum AI)
            </Button>
          </div>
        </div>

        <Separator />

        {/* Sharing */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-neon">Collaboration</h4>
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            disabled={architecture.layers.length === 0}
            className="w-full justify-start"
          >
            <Share className="w-4 h-4 mr-2" />
            Generate Shareable Link
          </Button>
        </div>

        <Separator />

        {/* Architecture Stats */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-neon">Architecture Statistics</h4>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>Total Layers:</span>
              <span className="text-quantum-glow">{architecture.layers.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantum Layers:</span>
              <span className="text-quantum-glow">
                {architecture.layers.filter(l => l.type.startsWith('quantum_')).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Classical Layers:</span>
              <span className="text-blue-400">
                {architecture.layers.filter(l => !l.type.startsWith('quantum_')).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Connections:</span>
              <span className="text-quantum-neon">{architecture.connections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Parameters:</span>
              <span className="text-quantum-energy">{architecture.metadata.totalParameters}</span>
            </div>
            <div className="flex justify-between">
              <span>Circuit Depth:</span>
              <span className="text-quantum-particle">{Math.max(1, architecture.layers.length * 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Runtime:</span>
              <span className="text-quantum-neon">{(architecture.layers.length * 0.5).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
