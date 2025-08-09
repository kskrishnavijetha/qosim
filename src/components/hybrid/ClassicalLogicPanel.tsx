
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, Plus, Clock, Zap } from 'lucide-react';
import { ClassicalNode } from '@/hooks/useHybridSimulation';

interface ClassicalLogicPanelProps {
  state: {
    nodes: ClassicalNode[];
    signals: Record<string, boolean | number>;
  };
  isRunning: boolean;
  currentStep: number;
  onConnectionCreate: (from: string, to: string, type: 'classical-to-quantum') => void;
  onConnectionSelect: (connectionId: string) => void;
  selectedConnection: string | null;
}

export function ClassicalLogicPanel({
  state,
  isRunning,
  currentStep,
  onConnectionCreate,
  onConnectionSelect,
  selectedConnection
}: ClassicalLogicPanelProps) {
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeColor = (node: ClassicalNode) => {
    const signal = state.signals[node.outputs[0]];
    if (typeof signal === 'boolean') {
      return signal ? 'text-quantum-glow' : 'text-quantum-particle';
    }
    return 'text-quantum-neon';
  };

  const getNodeIcon = (type: ClassicalNode['type']) => {
    switch (type) {
      case 'CLOCK':
        return Clock;
      case 'AND':
      case 'OR':
      case 'NOT':
        return Cpu;
      default:
        return Zap;
    }
  };

  const handleNodeDrag = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    // Update node position logic would go here
    console.log('Node drag:', nodeId, newPosition);
  }, []);

  const renderNode = (node: ClassicalNode) => {
    const Icon = getNodeIcon(node.type);
    const isActive = state.signals[node.outputs[0]];
    
    return (
      <g
        key={node.id}
        transform={`translate(${node.position.x}, ${node.position.y})`}
        className="cursor-pointer"
        onMouseDown={() => setDraggedNode(node.id)}
      >
        {/* Node Background */}
        <rect
          x={-30}
          y={-20}
          width={60}
          height={40}
          rx={5}
          className={`fill-card stroke-2 ${
            isActive ? 'stroke-quantum-glow' : 'stroke-quantum-matrix'
          }`}
        />
        
        {/* Node Label */}
        <text
          x={0}
          y={-25}
          className="text-xs fill-quantum-text text-anchor-middle"
        >
          {node.type}
        </text>
        
        {/* Node Value */}
        <text
          x={0}
          y={5}
          className={`text-sm font-mono text-anchor-middle ${getNodeColor(node)}`}
        >
          {String(state.signals[node.outputs[0]] || '0')}
        </text>
        
        {/* Glow Effect */}
        {isActive && (
          <circle
            cx={0}
            cy={0}
            r={35}
            className="fill-none stroke-quantum-glow stroke-1 opacity-20"
            strokeDasharray="2,2"
          >
            <animate
              attributeName="r"
              values="35;40;35"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
    );
  };

  const renderConnections = () => {
    return state.nodes.map(node => 
      node.outputs.map(output => {
        const signal = state.signals[output];
        const isActive = Boolean(signal);
        
        return (
          <line
            key={`${node.id}-${output}`}
            x1={node.position.x + 30}
            y1={node.position.y}
            x2={node.position.x + 80}
            y2={node.position.y}
            className={`stroke-2 ${
              isActive ? 'stroke-quantum-glow' : 'stroke-quantum-matrix'
            }`}
            strokeDasharray={isActive ? "none" : "5,5"}
          >
            {isActive && (
              <animate
                attributeName="stroke-opacity"
                values="0.3;1;0.3"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </line>
        );
      })
    );
  };

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Classical Logic Processor
          <Badge variant="outline" className="text-xs">
            {state.nodes.length} Nodes
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-full">
        {/* Node Palette */}
        <div className="flex gap-2 flex-wrap">
          {['CLOCK', 'AND', 'OR', 'NOT'].map(nodeType => (
            <Button
              key={nodeType}
              variant="outline"
              size="sm"
              className="text-xs neon-border"
            >
              <Plus className="w-3 h-3 mr-1" />
              {nodeType}
            </Button>
          ))}
        </div>
        
        {/* Logic Canvas */}
        <div className="flex-1 border border-quantum-matrix rounded-lg bg-quantum-void/50 overflow-hidden">
          <svg
            ref={svgRef}
            width="100%"
            height="300"
            className="w-full h-full"
            viewBox="0 0 400 300"
          >
            {/* Grid Background */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  className="stroke-quantum-matrix"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Render Connections */}
            {renderConnections()}
            
            {/* Render Nodes */}
            {state.nodes.map(renderNode)}
          </svg>
        </div>
        
        {/* Signal Status */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-quantum-neon">Live Signals</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(state.signals).map(([signal, value]) => (
              <div
                key={signal}
                className="flex items-center justify-between text-xs p-2 bg-card/30 rounded border"
              >
                <span className="font-mono">{signal}</span>
                <Badge
                  variant={value ? "default" : "outline"}
                  className={`text-xs ${
                    value ? 'bg-quantum-glow/20 text-quantum-glow' : ''
                  }`}
                >
                  {String(value)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
