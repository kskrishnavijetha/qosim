
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  BarChart3, 
  Grid3X3,
  Clock,
  Zap
} from 'lucide-react';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { cn } from '@/lib/utils';
import { OutputMatrixFormat } from './output/OutputMatrixFormat';
import { OutputGraphicalFormat } from './output/OutputGraphicalFormat';
import { OutputSimulationLogs } from './output/OutputSimulationLogs';

interface OutputConsoleProps {
  simulationResult: OptimizedSimulationResult | null;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export function OutputConsole({ 
  simulationResult, 
  isCollapsed = false, 
  onToggleCollapse 
}: OutputConsoleProps) {
  const [activeTab, setActiveTab] = useState<'results' | 'logs'>('results');
  const [viewFormat, setViewFormat] = useState<'matrix' | 'graphical'>('graphical');

  const handleToggleCollapse = () => {
    onToggleCollapse?.(!isCollapsed);
  };

  const hasResults = simulationResult && simulationResult.qubitStates.length > 0;
  const executionTime = simulationResult?.executionTime || 0;
  const fidelity = simulationResult?.fidelity || 0;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-quantum-glow" />
            <CardTitle className="text-lg font-mono text-quantum-glow">
              Output Console
            </CardTitle>
            {hasResults && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono border-quantum-particle">
                  <Clock className="w-3 h-3 mr-1" />
                  {executionTime.toFixed(2)}ms
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-mono",
                    fidelity > 0.95 ? "border-green-400 text-green-400" : "border-yellow-400 text-yellow-400"
                  )}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {(fidelity * 100).toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className="text-quantum-neon hover:text-quantum-glow"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'results' | 'logs')}>
              <TabsList className="quantum-panel">
                <TabsTrigger value="results" className="text-xs">
                  Results
                </TabsTrigger>
                <TabsTrigger value="logs" className="text-xs">
                  Logs
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === 'results' && hasResults && (
              <div className="flex items-center gap-1">
                <Button
                  variant={viewFormat === 'graphical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewFormat('graphical')}
                  className="text-xs"
                >
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Graph
                </Button>
                <Button
                  variant={viewFormat === 'matrix' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewFormat('matrix')}
                  className="text-xs"
                >
                  <Grid3X3 className="w-3 h-3 mr-1" />
                  Matrix
                </Button>
              </div>
            )}
          </div>

          <Separator className="border-quantum-matrix" />

          <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
            {activeTab === 'results' ? (
              hasResults ? (
                viewFormat === 'matrix' ? (
                  <OutputMatrixFormat simulationResult={simulationResult} />
                ) : (
                  <OutputGraphicalFormat simulationResult={simulationResult} />
                )
              ) : (
                <div className="flex items-center justify-center h-64 text-quantum-particle">
                  <div className="text-center">
                    <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-mono">No simulation results yet</p>
                    <p className="text-sm mt-2">Build a circuit and run a simulation to see output</p>
                  </div>
                </div>
              )
            ) : (
              <OutputSimulationLogs simulationResult={simulationResult} />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
