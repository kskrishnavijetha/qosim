
import React, { forwardRef, useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QNNLayer } from '@/hooks/useQNNBuilder';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QNNCanvasProps {
  architecture: {
    layers: QNNLayer[];
    connections: Array<{ from: string; to: string; type: 'quantum_to_classical' | 'classical_to_quantum' | 'quantum_to_quantum' | 'classical_to_classical' }>;
  };
  selectedLayer: QNNLayer | null;
  trainingMetrics: any;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  onLayerAdd: (layerType: string, config: any, position: { x: number; y: number }) => void;
  onLayerMove: (layerId: string, newPosition: { x: number; y: number }) => void;
  onLayerSelect: (layer: QNNLayer) => void;
  onLayerRemove: (layerId: string) => void;
  onCanvasClick: () => void;
  onPanStart: (e: React.MouseEvent) => void;
  onPanMove: (e: React.MouseEvent) => void;
  onPanEnd: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export const QNNCanvas = forwardRef<HTMLDivElement, QNNCanvasProps>(({
  architecture,
  selectedLayer,
  trainingMetrics,
  zoomLevel,
  panOffset,
  onLayerAdd,
  onLayerMove,
  onLayerSelect,
  onLayerRemove,
  onCanvasClick,
  onPanStart,
  onPanMove,
  onPanEnd,
  onZoomIn,
  onZoomOut,
  onResetView
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleLayerMouseDown = useCallback((e: React.MouseEvent, layer: QNNLayer) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggedLayer(layer.id);
    setIsDragging(true);
    onLayerSelect(layer);
  }, [onLayerSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && draggedLayer && ref && 'current' in ref && ref.current) {
      const canvasRect = ref.current.getBoundingClientRect();
      const newPosition = {
        x: (e.clientX - canvasRect.left - dragOffset.x) / zoomLevel,
        y: (e.clientY - canvasRect.top - dragOffset.y) / zoomLevel
      };
      onLayerMove(draggedLayer, newPosition);
    } else if (isDragging && !draggedLayer) {
      onPanMove(e);
    }
  }, [isDragging, draggedLayer, dragOffset, zoomLevel, onLayerMove, onPanMove, ref]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedLayer(null);
    onPanEnd();
  }, [onPanEnd]);

  const getLayerColor = (layerType: string) => {
    if (layerType.startsWith('quantum_')) {
      return 'bg-quantum-glow/20 border-quantum-glow text-quantum-glow';
    } else {
      return 'bg-blue-500/20 border-blue-500 text-blue-500';
    }
  };

  const getLayerIcon = (layerType: string) => {
    if (layerType.startsWith('quantum_')) {
      return '🌌';
    } else if (layerType === 'dense') {
      return '🧠';
    } else if (layerType === 'conv2d') {
      return '🔍';
    } else if (layerType === 'dropout') {
      return '💧';
    } else {
      return '⚡';
    }
  };

  const renderConnection = (connection: any) => {
    const fromLayer = architecture.layers.find(l => l.id === connection.from);
    const toLayer = architecture.layers.find(l => l.id === connection.to);
    
    if (!fromLayer || !toLayer) return null;

    const x1 = fromLayer.position.x + 100;
    const y1 = fromLayer.position.y + 30;
    const x2 = toLayer.position.x;
    const y2 = toLayer.position.y + 30;

    const pathColor = connection.type === 'quantum_to_classical' || connection.type === 'classical_to_quantum'
      ? 'stroke-quantum-neon' : 'stroke-blue-400';

    return (
      <line
        key={`${connection.from}-${connection.to}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={`${pathColor} stroke-2`}
        markerEnd="url(#arrowhead)"
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-quantum-matrix">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Zoom: {Math.round(zoomLevel * 100)}%
          </Badge>
          <Badge variant="outline">
            Layers: {architecture.layers.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onResetView}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={ref}
        className="flex-1 relative overflow-hidden cursor-move"
        onMouseDown={onPanStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={onCanvasClick}
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px)`,
          backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
        }}
      >
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                className="fill-current text-quantum-neon"
              />
            </marker>
          </defs>
          {architecture.connections.map(renderConnection)}
        </svg>

        {/* Layers */}
        <div 
          className="absolute inset-0"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}
        >
          {architecture.layers.map((layer) => (
            <Card
              key={layer.id}
              className={cn(
                "absolute w-48 h-16 cursor-pointer transition-all duration-200 select-none",
                getLayerColor(layer.type),
                selectedLayer?.id === layer.id && "ring-2 ring-quantum-glow ring-offset-2",
                "hover:scale-105 hover:shadow-lg"
              )}
              style={{
                left: layer.position.x,
                top: layer.position.y,
                transform: isDragging && draggedLayer === layer.id ? 'scale(1.1)' : 'scale(1)'
              }}
              onMouseDown={(e) => handleLayerMouseDown(e, layer)}
            >
              <div className="p-3 h-full flex items-center gap-3">
                <div className="text-2xl">{getLayerIcon(layer.type)}</div>
                <div className="flex-1">
                  <div className="font-mono text-sm font-semibold">
                    {layer.config.name || layer.type.toUpperCase()}
                  </div>
                  <div className="text-xs opacity-70">
                    {layer.type.startsWith('quantum_') ? 'Quantum Layer' : 'Classical Layer'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Training Visualization Overlay */}
        {trainingMetrics && (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border">
            <div className="text-sm font-mono text-quantum-glow mb-2">Training Status</div>
            <div className="space-y-1 text-xs">
              <div>Epoch: {trainingMetrics.currentEpoch || 0}</div>
              <div>Loss: {trainingMetrics.currentLoss?.toFixed(4) || 'N/A'}</div>
              <div>Accuracy: {trainingMetrics.currentAccuracy?.toFixed(2) || 'N/A'}%</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {architecture.layers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-mono">Start building your QNN</p>
              <p className="text-sm">Drag quantum gates and ML layers from the library</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

QNNCanvas.displayName = 'QNNCanvas';
