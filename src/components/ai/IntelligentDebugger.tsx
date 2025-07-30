
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  TrendingUp, 
  Eye,
  Brain,
  Wrench
} from 'lucide-react';
import { quantumAI, AIDebugResult } from '@/services/QuantumAIService';
import { toast } from 'sonner';

interface IntelligentDebuggerProps {
  circuit: any[];
  onCircuitFixed: (gates: any[]) => void;
  onShowStateVisualization: (step: number) => void;
}

export function IntelligentDebugger({ 
  circuit, 
  onCircuitFixed, 
  onShowStateVisualization 
}: IntelligentDebuggerProps) {
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<AIDebugResult | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto-debug when circuit changes
    if (circuit.length > 0) {
      performQuickAnalysis();
    }
  }, [circuit]);

  const performQuickAnalysis = async () => {
    try {
      const result = await quantumAI.debugCircuit(circuit);
      setDebugResult(result);
    } catch (error) {
      console.error('Quick analysis failed:', error);
    }
  };

  const performDeepDebug = async () => {
    setIsDebugging(true);
    setProgress(0);

    try {
      // Simulate deep debugging process
      const steps = [
        { value: 20, message: 'Analyzing quantum states...' },
        { value: 40, message: 'Checking gate sequences...' },
        { value: 60, message: 'Validating entanglement patterns...' },
        { value: 80, message: 'Computing error probabilities...' },
        { value: 100, message: 'Generating recommendations...' }
      ];

      for (const step of steps) {
        setProgress(step.value);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const result = await quantumAI.debugCircuit(circuit);
      setDebugResult(result);
      
      toast.success(`Found ${result.issues.length} potential issues`);
      
    } catch (error) {
      toast.error('Deep debugging failed');
      console.error('Debug error:', error);
    } finally {
      setIsDebugging(false);
      setProgress(0);
    }
  };

  const autoFixIssue = (issueIndex: number) => {
    const issue = debugResult?.issues[issueIndex];
    if (!issue || !issue.autoFix) return;

    let fixedCircuit = [...circuit];

    switch (issue.type) {
      case 'optimization':
        // Remove redundant gates
        if (issue.gate && issue.position < circuit.length - 1) {
          const nextGate = circuit[issue.position + 1];
          if (nextGate && circuit[issue.position].type === nextGate.type) {
            fixedCircuit.splice(issue.position, 2);
          }
        }
        break;
        
      case 'warning':
        // Move measurements to end
        if (issue.gate === 'M') {
          const measurementGate = fixedCircuit[issue.position];
          fixedCircuit.splice(issue.position, 1);
          fixedCircuit.push(measurementGate);
        }
        break;
    }

    // Update positions
    fixedCircuit.forEach((gate, index) => {
      gate.position = Math.floor(index / 2);
    });

    onCircuitFixed(fixedCircuit);
    toast.success('Issue automatically fixed!');
    
    // Refresh debug analysis
    performQuickAnalysis();
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'optimization': return <TrendingUp className="w-4 h-4 text-blue-400" />;
      default: return <Bug className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-400/50 bg-red-400/10';
      case 'warning': return 'border-yellow-400/50 bg-yellow-400/10';
      case 'optimization': return 'border-blue-400/50 bg-blue-400/10';
      default: return 'border-muted/50 bg-muted/10';
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Brain className="w-5 h-5" />
          AI Circuit Debugger
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Debug Controls */}
        <div className="flex gap-2">
          <Button
            onClick={performDeepDebug}
            disabled={isDebugging || circuit.length === 0}
            className="flex-1 bg-gradient-to-r from-quantum-matrix to-quantum-neon text-white hover:opacity-90"
          >
            {isDebugging ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Bug className="w-4 h-4 mr-2" />
                Deep Debug
              </>
            )}
          </Button>
          
          {debugResult && debugResult.issues.length > 0 && (
            <Button
              variant="outline"
              onClick={() => onShowStateVisualization(0)}
              className="neon-border"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Debug Progress */}
        {isDebugging && (
          <div className="space-y-2">
            <Progress value={progress} className="quantum-progress" />
            <div className="text-center text-xs text-quantum-particle">
              AI debugging circuit structure...
            </div>
          </div>
        )}

        {/* Debug Results */}
        {debugResult && (
          <div className="space-y-4">
            <Separator />
            
            {/* State Analysis */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-quantum-matrix/20 rounded text-center">
                <div className="text-quantum-neon">Entanglement</div>
                <div className="font-mono text-quantum-glow">
                  {(debugResult.stateAnalysis.entanglement * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-quantum-matrix/20 rounded text-center">
                <div className="text-quantum-neon">Coherence</div>
                <div className="font-mono text-quantum-energy">
                  {(debugResult.stateAnalysis.coherence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-quantum-matrix/20 rounded text-center">
                <div className="text-quantum-neon">Fidelity</div>
                <div className="font-mono text-quantum-particle">
                  {(debugResult.stateAnalysis.fidelity * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Issues List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-quantum-neon">
                  Detected Issues ({debugResult.issues.length})
                </h4>
                {debugResult.issues.length === 0 && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    All Clear
                  </Badge>
                )}
              </div>
              
              {debugResult.issues.length > 0 && (
                <ScrollArea className="h-[200px] pr-2">
                  <div className="space-y-2">
                    {debugResult.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          getIssueColor(issue.type)
                        } ${
                          selectedIssue === index ? 'ring-1 ring-quantum-neon' : ''
                        }`}
                        onClick={() => setSelectedIssue(selectedIssue === index ? null : index)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {issue.gate} gate at position {issue.position}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {issue.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                {issue.description}
                              </p>
                              <p className="text-xs text-quantum-particle">
                                {issue.suggestion}
                              </p>
                            </div>
                          </div>
                          
                          {issue.autoFix && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                autoFixIssue(index);
                              }}
                              className="ml-2 h-6 px-2 text-xs"
                            >
                              <Wrench className="w-3 h-3 mr-1" />
                              Fix
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Recommendations */}
            {debugResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-quantum-neon">AI Recommendations</h4>
                <div className="space-y-1">
                  {debugResult.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Zap className="w-3 h-3 text-quantum-energy" />
                      <span className="text-quantum-particle">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {circuit.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Build a circuit to enable AI debugging</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
