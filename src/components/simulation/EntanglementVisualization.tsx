import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Atom, Zap, Network, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEntanglementTracking } from '@/hooks/useEntanglementTracking';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface EntanglementVisualizationProps {
  circuit: Gate[];
}

export function EntanglementVisualization({ circuit }: EntanglementVisualizationProps) {
  const { toast } = useToast();
  const {
    selectedGates,
    hasEntanglingGates,
    entanglingGatesInCircuit,
    toggleGate,
    validateEntanglementAnalysis,
    calculateMockEntanglement,
    ENTANGLING_GATES
  } = useEntanglementTracking(circuit);

  const entanglementScore = useMemo(() => {
    return calculateMockEntanglement();
  }, [calculateMockEntanglement]);

  const handleAnalyzeClick = () => {
    if (validateEntanglementAnalysis()) {
      // Perform entanglement analysis logic here
      console.log("Performing entanglement analysis...");
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Atom className="w-4 h-4" />
          Quantum Entanglement
          <Badge variant="secondary" className="ml-2">
            {entanglingGatesInCircuit.length} gates
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Analysis Button */}
        <Button
          onClick={handleAnalyzeClick}
          disabled={!hasEntanglingGates}
          className="w-full neon-border"
          variant="outline"
        >
          <Network className="w-4 h-4 mr-2" />
          Analyze Entanglement
        </Button>

        {/* Entanglement Score */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-particle flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Entanglement Score
          </h4>
          <Progress value={entanglementScore * 100} className="h-4" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0% (No Entanglement)</span>
            <span>100% (Max Entanglement)</span>
          </div>
        </div>

        {/* Entangling Gates Selection */}
        {hasEntanglingGates && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-semibold text-quantum-particle mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Select Entangling Gates
              </h4>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {ENTANGLING_GATES.map((gateType) => (
                  <Badge
                    key={gateType}
                    variant={selectedGates.includes(gateType) ? 'default' : 'outline'}
                    onClick={() => toggleGate(gateType)}
                    className="cursor-pointer"
                  >
                    {gateType}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* No Entanglement Message */}
        {!hasEntanglingGates && (
          <div className="text-center text-quantum-glow py-4">
            <Atom className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Add entangling gates to analyze entanglement</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

