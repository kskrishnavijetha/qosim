import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link2 } from 'lucide-react';

interface EntanglementHeaderProps {
  lastUpdate: number;
  mode: string;
  executionTime: number;
  fidelity?: number;
}

export function EntanglementHeader({ lastUpdate, mode, executionTime, fidelity }: EntanglementHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
        <Link2 className="w-5 h-5" />
        Quantum Entanglement Analysis
      </CardTitle>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-xs">
          Updated: {new Date(lastUpdate).toLocaleTimeString()}
        </Badge>
        <Badge variant="outline" className={`font-mono ${
          mode === 'cloud' ? 'border-quantum-glow text-quantum-glow' :
          mode === 'accurate' ? 'border-quantum-neon text-quantum-neon' :
          mode === 'step-by-step' ? 'border-purple-400 text-purple-400' :
          'border-quantum-particle text-quantum-particle'
        }`}>
          {mode === 'step-by-step' ? 'DEBUG' : mode.toUpperCase()}
        </Badge>
        <Badge variant="secondary" className="font-mono text-xs">
          {executionTime.toFixed(0)}ms
        </Badge>
        {fidelity && (
          <Badge variant="secondary" className="font-mono text-xs">
            Fidelity: {(fidelity * 100).toFixed(1)}%
          </Badge>
        )}
      </div>
    </CardHeader>
  );
}