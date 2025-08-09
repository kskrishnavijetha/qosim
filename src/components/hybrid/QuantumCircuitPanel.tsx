import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Atom, Zap } from 'lucide-react';
import { QuantumGate, Connection } from '@/hooks/useHybridSimulation';
import { Complex } from '@/services/complexNumbers';

interface QuantumCircuitPanelProps {
  state: {
    gates: QuantumGate[];
    qubits: number[];
    stateVector: Complex[];
    measurements: Record<string, number>;
  };
  isRunning: boolean;
  currentStep: number;
  connections: Connection[];
  selectedConnection: string | null;
}

export function QuantumCircuitPanel({
  state,
  isRunning,
  currentStep,
  connections,
  selectedConnection
}: QuantumCircuitPanelProps) {
  const renderQubitLine = (qubitIndex: number) => {
    const qubit = state.qubits[qubitIndex];
    const gates = state.gates.filter(g => g.qubit === qubit);
    
    return (
      <g key={`qubit-${qubit}`} transform={`translate(0, ${qubitIndex * 60 + 50})`}>
        {/* Qubit Line */}
        <line
          x1={50}
          y1={0}
          x2={350}
          y2={0}
          className="stroke-quantum-neon stroke-2"
        />
        
        {/* Qubit Label */}
        <text
          x={20}
          y={5}
          className="text-sm font-mono fill-quantum-text text-anchor-middle"
        >
          |q{qubit}⟩
        </text>
        
        {/* Render Gates */}
        {gates.map((gate, gateIndex) => {
          const x = 80 + gateIndex * 80;
          const isControlled = gate.controlledBy;
          const connection = connections.find(c => c.to === gate.id);
          const isActive = connection && isRunning;
          
          return (
            <g key={gate.id} transform={`translate(${x}, 0)`}>
              {/* Gate Box */}
              <rect
                x={-15}
                y={-15}
                width={30}
                height={30}
                rx={3}
                className={`fill-card stroke-2 ${
                  isActive ? 'stroke-quantum-glow' : 'stroke-quantum-matrix'
                }`}
              />
              
              {/* Gate Label */}
              <text
                x={0}
                y={5}
                className={`text-sm font-mono text-anchor-middle ${
                  isActive ? 'fill-quantum-glow' : 'fill-quantum-text'
                }`}
              >
                {gate.type}
              </text>
              
              {/* Control Indicator */}
              {isControlled && (
                <circle
                  cx={0}
                  cy={-25}
                  r={3}
                  className={`${
                    isActive ? 'fill-quantum-glow' : 'fill-quantum-neon'
                  }`}
                />
              )}
              
              {/* Active Gate Animation */}
              {isActive && (
                <circle
                  cx={0}
                  cy={0}
                  r={20}
                  className="fill-none stroke-quantum-glow stroke-1 opacity-30"
                  strokeDasharray="2,2"
                >
                  <animate
                    attributeName="r"
                    values="20;25;20"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const renderClassicalConnections = () => {
    return connections
      .filter(conn => conn.type === 'classical-to-quantum')
      .map(conn => {
        const gate = state.gates.find(g => g.id === conn.to);
        if (!gate) return null;
        
        const qubitIndex = state.qubits.indexOf(gate.qubit);
        const gateIndex = state.gates.filter(g => g.qubit === gate.qubit).indexOf(gate);
        
        const startX = 350;
        const startY = qubitIndex * 60 + 25;
        const endX = 80 + gateIndex * 80;
        const endY = qubitIndex * 60 + 50;
        
        return (
          <line
            key={conn.id}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            className={`stroke-2 stroke-quantum-energy ${
              selectedConnection === conn.id ? 'opacity-100' : 'opacity-60'
            }`}
            strokeDasharray="3,3"
            markerEnd="url(#arrowhead)"
          >
            {isRunning && (
              <animate
                attributeName="stroke-dashoffset"
                values="0;6"
                dur="0.5s"
                repeatCount="indefinite"
              />
            )}
          </line>
        );
      });
  };

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Atom className="w-4 h-4" />
          Quantum Circuit Processor
          <Badge variant="outline" className="text-xs">
            {state.qubits.length} Qubits
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-full">
        {/* Circuit Canvas */}
        <div className="flex-1 border border-quantum-matrix rounded-lg bg-quantum-void/50 overflow-hidden">
          <svg
            width="100%"
            height="300"
            className="w-full h-full"
            viewBox="0 0 400 300"
          >
            {/* Arrow Marker */}
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
                  className="fill-quantum-energy"
                />
              </marker>
            </defs>
            
            {/* Render Qubit Lines and Gates */}
            {state.qubits.map((_, index) => renderQubitLine(index))}
            
            {/* Render Classical Connections */}
            {renderClassicalConnections()}
          </svg>
        </div>
        
        {/* Quantum State Info */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-quantum-neon">Quantum State</div>
          <div className="grid grid-cols-2 gap-2">
            {state.qubits.map(qubit => (
              <div
                key={qubit}
                className="flex items-center justify-between text-xs p-2 bg-card/30 rounded border"
              >
                <span className="font-mono">Q{qubit}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.random() > 0.5 ? '|0⟩' : '|1⟩'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        {/* Measurements */}
        {Object.keys(state.measurements).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-quantum-neon">Measurements</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(state.measurements).map(([qubit, value]) => (
                <div
                  key={qubit}
                  className="flex items-center justify-between text-xs p-2 bg-card/30 rounded border"
                >
                  <span className="font-mono">M{qubit}</span>
                  <Badge
                    variant={value === 1 ? "default" : "outline"}
                    className={`text-xs ${
                      value === 1 ? 'bg-quantum-glow/20 text-quantum-glow' : ''
                    }`}
                  >
                    {value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
