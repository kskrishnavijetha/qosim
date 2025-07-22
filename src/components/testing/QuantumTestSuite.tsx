
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface QuantumTestSuiteProps {
  circuit: Gate[];
}

export function QuantumTestSuite({ circuit }: QuantumTestSuiteProps) {
  const [tests, setTests] = useState<TestResult[]>([
    { id: '1', name: 'Circuit Validation', status: 'pending' },
    { id: '2', name: 'Gate Connectivity', status: 'pending' },
    { id: '3', name: 'Quantum State Consistency', status: 'pending' },
    { id: '4', name: 'Entanglement Analysis', status: 'pending' },
    { id: '5', name: 'Performance Benchmarks', status: 'pending' }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    for (let i = 0; i < tests.length; i++) {
      setTests(prev => prev.map((test, idx) => 
        idx === i ? { ...test, status: 'running' } : test
      ));
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const passed = Math.random() > 0.2; // 80% pass rate
      setTests(prev => prev.map((test, idx) => 
        idx === i ? { 
          ...test, 
          status: passed ? 'passed' : 'failed',
          duration: Math.floor(Math.random() * 500) + 100,
          error: passed ? undefined : 'Test assertion failed'
        } : test
      ));
      
      setProgress(((i + 1) / tests.length) * 100);
    }
    
    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ 
      ...test, 
      status: 'pending',
      duration: undefined,
      error: undefined
    })));
    setProgress(0);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      case 'passed':
        return <Badge variant="secondary">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon">Quantum Test Suite</CardTitle>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline">{circuit.length} gates</Badge>
          <Badge variant="secondary">{passedTests} passed</Badge>
          {failedTests > 0 && <Badge variant="destructive">{failedTests} failed</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning || circuit.length === 0}
            className="flex-1"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Run Tests
          </Button>
          <Button onClick={resetTests} variant="outline" disabled={isRunning}>
            Reset
          </Button>
        </div>

        {isRunning && (
          <Progress value={progress} className="w-full" />
        )}

        <div className="space-y-2">
          {tests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-2 rounded border">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <span className="text-sm">{test.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {test.duration && (
                  <span className="text-xs text-muted-foreground">{test.duration}ms</span>
                )}
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>

        {failedTests > 0 && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded">
            <h4 className="text-sm font-semibold text-destructive mb-2">Test Failures</h4>
            {tests.filter(t => t.status === 'failed').map(test => (
              <div key={test.id} className="text-xs text-destructive">
                {test.name}: {test.error}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
