import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface TestCase {
  id: string;
  name: string;
  description: string;
  circuit: Gate[];
  expectedResult: any;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration: number;
}

export function QuantumTestSuite() {
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: 'test-1',
      name: 'Hadamard on Qubit 0',
      description: 'Applies a Hadamard gate to qubit 0 and checks the state',
      circuit: [{ id: 'gate-1', type: 'H', qubit: 0, position: 0 }],
      expectedResult: { qubitStates: [{ state: '|+⟩', probability: 0.5 }] },
      status: 'pending',
      duration: 0,
    },
    {
      id: 'test-2',
      name: 'CNOT Entanglement',
      description: 'Creates an entangled state with CNOT gate',
      circuit: [
        { id: 'gate-1', type: 'H', qubit: 0, position: 0 },
        { id: 'gate-2', type: 'CNOT', qubits: [0, 1], position: 1 },
      ],
      expectedResult: { entanglement: { totalEntanglement: 0.9 } },
      status: 'pending',
      duration: 0,
    },
  ]);
  const [runningTest, setRunningTest] = useState<string | null>(null);

  const runTest = useCallback(async (testId: string) => {
    setTestCases((prevTests) =>
      prevTests.map((test) =>
        test.id === testId ? { ...test, status: 'running', duration: 0 } : test
      )
    );
    setRunningTest(testId);

    const startTime = performance.now();

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Mock test result
    const passed = Math.random() > 0.5;

    setTestCases((prevTests) =>
      prevTests.map((test) =>
        test.id === testId
          ? {
              ...test,
              status: passed ? 'passed' : 'failed',
              duration: duration,
            }
          : test
      )
    );
    setRunningTest(null);
  }, []);

  const runAllTests = useCallback(async () => {
    for (const test of testCases) {
      await runTest(test.id);
    }
  }, [testCases, runTest]);

  const anyTestsRunning = runningTest !== null;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Quantum Test Suite
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runAllTests}
            disabled={anyTestsRunning}
            className="neon-border"
          >
            {anyTestsRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {testCases.map((test) => (
          <div
            key={test.id}
            className="p-3 bg-quantum-void rounded border border-quantum-matrix"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-quantum-particle">{test.name}</h4>
              <Badge
                variant={
                  test.status === 'passed'
                    ? 'success'
                    : test.status === 'failed'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {test.status === 'running' ? (
                  <>
                    <Clock className="w-3 h-3 mr-1 animate-spin" />
                    Running...
                  </>
                ) : test.status === 'passed' ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passed
                  </>
                ) : test.status === 'failed' ? (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Failed
                  </>
                ) : (
                  'Pending'
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{test.description}</p>
            <div className="flex justify-between items-center mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => runTest(test.id)}
                disabled={test.status === 'running'}
              >
                {test.status === 'running' ? (
                  <>
                    <Clock className="w-3 h-3 mr-1 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    Run Test
                  </>
                )}
              </Button>
              {test.status !== 'pending' && (
                <span className="text-xs text-muted-foreground">
                  Duration: {(test.duration / 1000).toFixed(2)}s
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
