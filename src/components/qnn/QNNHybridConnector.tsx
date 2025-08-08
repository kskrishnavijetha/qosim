
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QNNArchitecture } from '@/hooks/useQNNBuilder';
import { Link } from 'lucide-react';

interface QNNHybridConnectorProps {
  architecture: QNNArchitecture;
  onConnect: (fromLayerId: string, toLayerId: string) => void;
}

export function QNNHybridConnector({ architecture, onConnect }: QNNHybridConnectorProps) {
  const [fromLayer, setFromLayer] = useState('');
  const [toLayer, setToLayer] = useState('');

  const handleConnect = () => {
    if (fromLayer && toLayer && fromLayer !== toLayer) {
      onConnect(fromLayer, toLayer);
      setFromLayer('');
      setToLayer('');
    }
  };

  const getLayerTypeColor = (layerType: string) => {
    return layerType.startsWith('quantum_') ? 'text-quantum-glow' : 'text-blue-400';
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Link className="w-4 h-4" />
          Hybrid Layer Connector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-quantum-neon mb-2 block">From Layer</label>
            <Select value={fromLayer} onValueChange={setFromLayer}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select source layer" />
              </SelectTrigger>
              <SelectContent>
                {architecture.layers.map(layer => (
                  <SelectItem key={layer.id} value={layer.id}>
                    <div className="flex items-center gap-2">
                      <span className={getLayerTypeColor(layer.type)}>
                        {layer.config.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {layer.type.startsWith('quantum_') ? 'Q' : 'C'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-quantum-neon mb-2 block">To Layer</label>
            <Select value={toLayer} onValueChange={setToLayer}>
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select target layer" />
              </SelectTrigger>
              <SelectContent>
                {architecture.layers.map(layer => (
                  <SelectItem key={layer.id} value={layer.id}>
                    <div className="flex items-center gap-2">
                      <span className={getLayerTypeColor(layer.type)}>
                        {layer.config.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {layer.type.startsWith('quantum_') ? 'Q' : 'C'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            onClick={handleConnect}
            disabled={!fromLayer || !toLayer || fromLayer === toLayer}
            className="w-full"
          >
            Connect Layers
          </Button>
        </div>

        {/* Connection List */}
        {architecture.connections.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-quantum-neon">Existing Connections</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {architecture.connections.map((conn, index) => {
                const fromLayerObj = architecture.layers.find(l => l.id === conn.from);
                const toLayerObj = architecture.layers.find(l => l.id === conn.to);
                
                if (!fromLayerObj || !toLayerObj) return null;

                const getConnectionColor = (type: string) => {
                  switch (type) {
                    case 'quantum_to_classical': return 'text-purple-400';
                    case 'classical_to_quantum': return 'text-cyan-400';
                    case 'quantum_to_quantum': return 'text-quantum-glow';
                    case 'classical_to_classical': return 'text-blue-400';
                    default: return 'text-muted-foreground';
                  }
                };

                return (
                  <div key={index} className="flex items-center justify-between text-xs p-2 bg-card/30 rounded border">
                    <div className="flex items-center gap-2">
                      <span className={getLayerTypeColor(fromLayerObj.type)}>
                        {fromLayerObj.config.name}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className={getLayerTypeColor(toLayerObj.type)}>
                        {toLayerObj.config.name}
                      </span>
                    </div>
                    <Badge variant="outline" className={`${getConnectionColor(conn.type)} text-xs`}>
                      {conn.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
