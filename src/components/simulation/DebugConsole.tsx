import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  StepForward, 
  RotateCcw, 
  Terminal, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { OptimizedSimulationResult, SimulationStepData } from '@/lib/quantumSimulatorOptimized';
import { cn } from '@/lib/utils';

interface DebugConsoleProps {
  simulationResult: OptimizedSimulationResult | null;
  onStepMode: (enabled: boolean) => void;
  onStep: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  isStepMode: boolean;
  isPaused: boolean;
  currentStep: number;
}

interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error' | 'quantum';
  message: string;
  data?: any;
}

export function DebugConsole({
  simulationResult,
  onStepMode,
  onStep,
  onPause,
  onResume,
  onReset,
  isStepMode,
  isPaused,
  currentStep
}: DebugConsoleProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Add simulation logs
  useEffect(() => {
    if (simulationResult) {
      const newLogs: LogEntry[] = [];
      
      // Execution time log
      newLogs.push({
        id: `exec-${Date.now()}`,
        timestamp: Date.now(),
        level: 'info',
        message: `Simulation completed in ${simulationResult.executionTime.toFixed(2)}ms`,
        data: { executionTime: simulationResult.executionTime }
      });
      
      // Entanglement detection
      if (simulationResult.entanglement.totalEntanglement > 0) {
        newLogs.push({
          id: `entangle-${Date.now()}`,
          timestamp: Date.now(),
          level: 'quantum',
          message: `Entanglement detected: ${(simulationResult.entanglement.totalEntanglement * 100).toFixed(1)}%`,
          data: simulationResult.entanglement
        });
      }
      
      // Fidelity warnings
      if (simulationResult.fidelity < 0.95) {
        newLogs.push({
          id: `fidelity-${Date.now()}`,
          timestamp: Date.now(),
          level: 'warning',
          message: `Low fidelity detected: ${(simulationResult.fidelity * 100).toFixed(1)}%`,
          data: { fidelity: simulationResult.fidelity }
        });
      }
      
      // Error rate analysis
      if (simulationResult.errorRates) {
        Object.entries(simulationResult.errorRates).forEach(([qubit, rate]) => {
          if (rate > 0.01) {
            newLogs.push({
              id: `error-q${qubit}-${Date.now()}`,
              timestamp: Date.now(),
              level: 'error',
              message: `High error rate on qubit ${qubit}: ${(rate * 100).toFixed(2)}%`,
              data: { qubit: parseInt(qubit), errorRate: rate }
            });
          }
        });
      }
      
      setLogs(prev => [...prev, ...newLogs].slice(-100)); // Keep last 100 logs
    }
  }, [simulationResult]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <CheckCircle className="w-3 h-3 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-3 h-3 text-red-400" />;
      case 'quantum': return <Zap className="w-3 h-3 text-quantum-glow" />;
      default: return <Terminal className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'quantum': return 'text-quantum-glow';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false
    }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Debug Console
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono border-quantum-particle text-quantum-particle">
              {logs.length} logs
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-mono"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Debug Controls */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-quantum-matrix/20">
          <Button
            size="sm"
            variant={isStepMode ? "default" : "outline"}
            onClick={() => onStepMode(!isStepMode)}
            className="text-xs font-mono"
          >
            <StepForward className="w-3 h-3 mr-1" />
            Step Mode
          </Button>
          
          {isStepMode && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={isPaused ? onResume : onPause}
                className="text-xs font-mono"
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={onStep}
                disabled={!isPaused}
                className="text-xs font-mono"
              >
                <StepForward className="w-3 h-3" />
              </Button>
              
              <Badge variant="secondary" className="text-xs font-mono">
                Step {currentStep}
              </Badge>
            </>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={onReset}
            className="text-xs font-mono"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={clearLogs}
            className="text-xs font-mono text-muted-foreground hover:text-foreground ml-auto"
          >
            Clear
          </Button>
        </div>
        
        {/* Simulation Status */}
        {simulationResult && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-2 rounded bg-quantum-matrix/10">
              <div className="text-xs text-muted-foreground">Execution Time</div>
              <div className="text-sm font-mono text-quantum-glow">
                {simulationResult.executionTime.toFixed(2)}ms
              </div>
            </div>
            
            <div className="p-2 rounded bg-quantum-matrix/10">
              <div className="text-xs text-muted-foreground">Fidelity</div>
              <div className={cn(
                "text-sm font-mono",
                simulationResult.fidelity > 0.95 ? "text-green-400" : "text-yellow-400"
              )}>
                {(simulationResult.fidelity * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="p-2 rounded bg-quantum-matrix/10">
              <div className="text-xs text-muted-foreground">Entanglement</div>
              <div className="text-sm font-mono text-quantum-neon">
                {(simulationResult.entanglement.totalEntanglement * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="p-2 rounded bg-quantum-matrix/10">
              <div className="text-xs text-muted-foreground">Threads</div>
              <div className="text-sm font-mono text-quantum-plasma">
                {simulationResult.entanglement.entanglementThreads.length}
              </div>
            </div>
          </div>
        )}
        
        {/* Console Logs */}
        <div className={cn(
          "transition-all duration-300",
          isExpanded ? "h-64" : "h-32"
        )}>
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-1 p-2 bg-black/20 rounded font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-muted-foreground italic">
                  No logs yet. Run a simulation to see debug information.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 py-1">
                    <span className="text-muted-foreground">
                      [{formatTime(log.timestamp)}]
                    </span>
                    {getLevelIcon(log.level)}
                    <span className={getLevelColor(log.level)}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}