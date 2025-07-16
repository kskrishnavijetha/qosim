
import { useState, useEffect } from 'react';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Clock,
  Trash2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error' | 'quantum' | 'success';
  message: string;
  data?: any;
}

interface OutputSimulationLogsProps {
  simulationResult: OptimizedSimulationResult | null;
}

export function OutputSimulationLogs({ simulationResult }: OutputSimulationLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Generate logs from simulation result
  useEffect(() => {
    if (!simulationResult) return;

    const newLogs: LogEntry[] = [];
    const timestamp = Date.now();

    // Simulation start log
    newLogs.push({
      id: `start-${timestamp}`,
      timestamp,
      level: 'info',
      message: `Simulation started in ${simulationResult.mode} mode`,
      data: { mode: simulationResult.mode }
    });

    // Execution time log
    newLogs.push({
      id: `exec-${timestamp}`,
      timestamp: timestamp + 1,
      level: 'success',
      message: `Simulation completed in ${simulationResult.executionTime.toFixed(2)}ms`,
      data: { executionTime: simulationResult.executionTime }
    });

    // Fidelity analysis
    if (simulationResult.fidelity < 0.95) {
      newLogs.push({
        id: `fidelity-${timestamp}`,
        timestamp: timestamp + 2,
        level: 'warning',
        message: `Low fidelity detected: ${(simulationResult.fidelity * 100).toFixed(1)}%`,
        data: { fidelity: simulationResult.fidelity }
      });
    } else {
      newLogs.push({
        id: `fidelity-${timestamp}`,
        timestamp: timestamp + 2,
        level: 'info',
        message: `High fidelity achieved: ${(simulationResult.fidelity * 100).toFixed(1)}%`,
        data: { fidelity: simulationResult.fidelity }
      });
    }

    // Entanglement detection
    if (simulationResult.entanglement && simulationResult.entanglement.totalEntanglement > 0) {
      newLogs.push({
        id: `entangle-${timestamp}`,
        timestamp: timestamp + 3,
        level: 'quantum',
        message: `Entanglement detected: ${(simulationResult.entanglement.totalEntanglement * 100).toFixed(1)}%`,
        data: { 
          entanglement: simulationResult.entanglement.totalEntanglement,
          pairs: simulationResult.entanglement.pairs.length
        }
      });

      // Log individual entangled pairs
      simulationResult.entanglement.pairs.forEach((pair, index) => {
        newLogs.push({
          id: `pair-${timestamp}-${index}`,
          timestamp: timestamp + 4 + index,
          level: 'quantum',
          message: `Entangled pair detected: Q${pair.qubits[0]} ↔ Q${pair.qubits[1]} (${(pair.strength * 100).toFixed(1)}%)`,
          data: { pair }
        });
      });
    }

    // Error analysis
    if (simulationResult.errorRates) {
      Object.entries(simulationResult.errorRates).forEach(([qubit, rate], index) => {
        if (rate > 0.01) {
          newLogs.push({
            id: `error-q${qubit}-${timestamp}`,
            timestamp: timestamp + 10 + index,
            level: 'error',
            message: `High error rate on qubit ${qubit}: ${(rate * 100).toFixed(2)}%`,
            data: { qubit: parseInt(qubit), errorRate: rate }
          });
        }
      });
    }

    // State analysis
    const significantStates = simulationResult.measurementProbabilities
      .filter(p => p > 0.001).length;
    
    if (significantStates > 1) {
      newLogs.push({
        id: `superposition-${timestamp}`,
        timestamp: timestamp + 20,
        level: 'quantum',
        message: `Superposition state detected with ${significantStates} significant basis states`,
        data: { significantStates }
      });
    }

    // Performance metrics
    const stateVectorSize = Math.pow(2, simulationResult.qubitStates.length);
    newLogs.push({
      id: `metrics-${timestamp}`,
      timestamp: timestamp + 30,
      level: 'info',
      message: `State vector size: ${stateVectorSize} dimensions, ${simulationResult.qubitStates.length} qubits`,
      data: { 
        dimensions: stateVectorSize, 
        qubits: simulationResult.qubitStates.length 
      }
    });

    setLogs(prev => [...prev, ...newLogs].slice(-100)); // Keep last 100 logs
  }, [simulationResult]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'info': return <Info className="w-3 h-3 text-blue-400" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-3 h-3 text-red-400" />;
      case 'quantum': return <Zap className="w-3 h-3 text-quantum-glow" />;
      default: return <Info className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'quantum': return 'text-quantum-glow';
      default: return 'text-muted-foreground';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'success': return 'bg-green-500/20 border-green-500/50';
      case 'info': return 'bg-blue-500/20 border-blue-500/50';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50';
      case 'error': return 'bg-red-500/20 border-red-500/50';
      case 'quantum': return 'bg-quantum-glow/20 border-quantum-glow/50';
      default: return 'bg-muted/20 border-muted/50';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + '.' + String(date.getMilliseconds()).padStart(3, '0');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {logs.length} entries
          </Badge>
          {simulationResult && (
            <Badge variant="outline" className="text-xs font-mono border-quantum-particle">
              <Clock className="w-3 h-3 mr-1" />
              Last run: {formatTime(Date.now())}
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={clearLogs}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>

      <ScrollArea className="h-64 quantum-panel neon-border rounded p-3">
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-mono text-sm">No simulation logs yet</p>
              <p className="text-xs mt-1">Run a simulation to see detailed logs</p>
            </div>
          ) : (
            logs
              .sort((a, b) => b.timestamp - a.timestamp) // Most recent first
              .map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-2 p-2 rounded hover:bg-quantum-matrix/30 transition-all duration-300 text-xs font-mono group"
                >
                  <span className="text-muted-foreground shrink-0 mt-0.5">
                    [{formatTime(log.timestamp)}]
                  </span>
                  
                  <div className="shrink-0 mt-0.5">
                    {getLevelIcon(log.level)}
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "shrink-0 text-xs font-bold px-2 py-0",
                      getLevelBadgeColor(log.level)
                    )}
                  >
                    {log.level.toUpperCase()}
                  </Badge>
                  
                  <span className={cn(
                    "flex-1 leading-relaxed",
                    getLevelColor(log.level)
                  )}>
                    {log.message}
                  </span>
                  
                  {log.level === 'quantum' && (
                    <div className="ml-auto text-quantum-particle text-xs particle-animation">
                      ⚛️
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
