import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Zap } from 'lucide-react';

export function EntanglementEmptyState() {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Quantum Entanglement Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-mono">No simulation data available</p>
          <p className="text-sm mt-2">Add gates to your circuit to see entanglement analysis</p>
        </div>
      </CardContent>
    </Card>
  );
}