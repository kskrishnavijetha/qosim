import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, PlayCircle, RefreshCw } from 'lucide-react';
import { EnhancedQuantumSimulator, QuantumGateOp } from '@/lib/enhancedQuantumSimulator';
import { Complex } from '@/services/complexNumbers';
import { toast } from 'sonner';

interface TestCase {
  name: string;
  description: string;
  circuit: QuantumGateOp[];
  expectedResults: {
    stateVector?: Complex[];
    probabilities?: number[];
    measurementCounts?: Record<string, number>;
  };
  tolerance: number;
}

interface TestResult {
  testName: string;
  passed: boolean;
  errors: string[];
  actualResults: any;
  expectedResults: any;
  executionTime: number;
  fidelity: number;
}

export function QuantumAccuracyTester() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('all');

  // Predefined test cases
  const testCases: TestCase[] = [
    {
      name: 'Hadamard Gate Basic',
      description: 'Test H gate on |0⟩ should produce equal superposition',
      circuit: [
        {
          id: 'h1',
          type: 'H',
          qubits: [0],
          position: 0
        }
      ],
      expectedResults: {
        stateVector: [
          new Complex(1/Math.sqrt(2), 0),
          new Complex(1/Math.sqrt(2), 0)
        ],
        probabilities: [0.5, 0.5]
      },
      tolerance: 1e-10
    },
    {
      name: 'Hadamard on |1⟩',
      description: 'Test H gate on |1⟩ should produce (|0⟩ - |1⟩)/√2',
      circuit: [
        {
          id: 'x1',
          type: 'X',
          qubits: [0],
          position: 0
        },
        {
          id: 'h1',
          type: 'H',
          qubits: [0],
          position: 1
        }
      ],
      expectedResults: {
        stateVector: [
          new Complex(1/Math.sqrt(2), 0),
          new Complex(-1/Math.sqrt(2), 0)
        ],
        probabilities: [0.5, 0.5]
      },
      tolerance: 1e-10
    },
    {
      name: 'Bell State (|00⟩ + |11⟩)/√2',
      description: 'Create Bell state using H and CNOT',
      circuit: [
        {
          id: 'h1',
          type: 'H',
          qubits: [0],
          position: 0
        },
        {
          id: 'cnot1',
          type: 'CNOT',
          qubits: [0, 1],
          control: 0,
          target: 1,
          position: 1
        }
      ],
      expectedResults: {
        stateVector: [
          new Complex(1/Math.sqrt(2), 0), // |00⟩
          new Complex(0, 0),               // |01⟩
          new Complex(0, 0),               // |10⟩
          new Complex(1/Math.sqrt(2), 0)   // |11⟩
        ],
        probabilities: [0.5, 0, 0, 0.5]
      },
      tolerance: 1e-10
    },
    {
      name: 'CNOT Gate Test',
      description: 'Test CNOT on |10⟩ should produce |11⟩',
      circuit: [
        {
          id: 'x1',
          type: 'X',
          qubits: [0],
          position: 0
        },
        {
          id: 'cnot1',
          type: 'CNOT',
          qubits: [0, 1],
          control: 0,
          target: 1,
          position: 1
        }
      ],
      expectedResults: {
        stateVector: [
          new Complex(0, 0), // |00⟩
          new Complex(0, 0), // |01⟩
          new Complex(0, 0), // |10⟩
          new Complex(1, 0)  // |11⟩
        ],
        probabilities: [0, 0, 0, 1]
      },
      tolerance: 1e-10
    },
    {
      name: 'Rotation Gates',
      description: 'Test RX(π/2) gate transformation',
      circuit: [
        {
          id: 'rx1',
          type: 'RX',
          qubits: [0],
          angle: Math.PI / 2,
          position: 0
        }
      ],
      expectedResults: {
        stateVector: [
          new Complex(1/Math.sqrt(2), 0),
          new Complex(0, -1/Math.sqrt(2))
        ],
        probabilities: [0.5, 0.5]
      },
      tolerance: 1e-10
    },
    {
      name: 'Complex Multi-Qubit Circuit',
      description: 'Test complex 3-qubit circuit with various gates',
      circuit: [
        {
          id: 'h1',
          type: 'H',
          qubits: [0],
          position: 0
        },
        {
          id: 'h2',
          type: 'H',
          qubits: [1],
          position: 0
        },
        {
          id: 'cnot1',
          type: 'CNOT',
          qubits: [0, 2],
          control: 0,
          target: 2,
          position: 1
        },
        {
          id: 'cnot2',
          type: 'CNOT',
          qubits: [1, 2],
          control: 1,
          target: 2,
          position: 2
        }
      ],
      expectedResults: {
        probabilities: [0.25, 0.25, 0.25, 0.25, 0, 0, 0, 0] // Expected for this specific circuit
      },
      tolerance: 1e-10
    }
  ];

  const compareStateVectors = (actual: Complex[], expected: Complex[], tolerance: number): { passed: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (actual.length !== expected.length) {
      errors.push(`State vector length mismatch: expected ${expected.length}, got ${actual.length}`);
      return { passed: false, errors };
    }

    for (let i = 0; i < actual.length; i++) {
      const actualAmp = actual[i];
      const expectedAmp = expected[i];
      
      const realDiff = Math.abs(actualAmp.real - expectedAmp.real);
      const imagDiff = Math.abs(actualAmp.imaginary - expectedAmp.imaginary);
      
      if (realDiff > tolerance || imagDiff > tolerance) {
        errors.push(`State ${i}: expected (${expectedAmp.real.toFixed(6)}, ${expectedAmp.imaginary.toFixed(6)}), got (${actualAmp.real.toFixed(6)}, ${actualAmp.imaginary.toFixed(6)})`);
      }
    }

    return { passed: errors.length === 0, errors };
  };

  const compareProbabilities = (actual: number[], expected: number[], tolerance: number): { passed: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (actual.length !== expected.length) {
      errors.push(`Probability array length mismatch: expected ${expected.length}, got ${actual.length}`);
      return { passed: false, errors };
    }

    for (let i = 0; i < actual.length; i++) {
      const diff = Math.abs(actual[i] - expected[i]);
      if (diff > tolerance) {
        errors.push(`Probability ${i}: expected ${expected[i].toFixed(6)}, got ${actual[i].toFixed(6)}`);
      }
    }

    return { passed: errors.length === 0, errors };
  };

  const runSingleTest = async (testCase: TestCase): Promise<TestResult> => {
    const startTime = performance.now();
    
    try {
      // Determine number of qubits needed
      const maxQubit = Math.max(...testCase.circuit.flatMap(gate => gate.qubits));
      const numQubits = maxQubit + 1;
      
      const simulator = new EnhancedQuantumSimulator({
        numQubits,
        shots: 1000,
        sparseMode: true,
        maxMemory: 1000,
        enableNoise: false,
        noiseLevel: 0
      });

      const result = await simulator.simulate(testCase.circuit);
      const executionTime = performance.now() - startTime;

      const errors: string[] = [];
      let passed = true;

      // Compare state vectors if expected
      if (testCase.expectedResults.stateVector) {
        const svComparison = compareStateVectors(
          result.stateVector,
          testCase.expectedResults.stateVector,
          testCase.tolerance
        );
        if (!svComparison.passed) {
          passed = false;
          errors.push(...svComparison.errors);
        }
      }

      // Compare probabilities if expected
      if (testCase.expectedResults.probabilities) {
        const probComparison = compareProbabilities(
          result.probabilities,
          testCase.expectedResults.probabilities,
          testCase.tolerance
        );
        if (!probComparison.passed) {
          passed = false;
          errors.push(...probComparison.errors);
        }
      }

      return {
        testName: testCase.name,
        passed,
        errors,
        actualResults: {
          stateVector: result.stateVector.slice(0, 8), // Limit display
          probabilities: result.probabilities.slice(0, 8),
          fidelity: result.fidelity
        },
        expectedResults: testCase.expectedResults,
        executionTime,
        fidelity: result.fidelity
      };

    } catch (error) {
      return {
        testName: testCase.name,
        passed: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        actualResults: null,
        expectedResults: testCase.expectedResults,
        executionTime: performance.now() - startTime,
        fidelity: 0
      };
    }
  };

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    const testsToRun = selectedTest === 'all' ? testCases : testCases.filter(t => t.name === selectedTest);
    const results: TestResult[] = [];

    for (let i = 0; i < testsToRun.length; i++) {
      const testCase = testsToRun[i];
      console.log(`🧪 Running test: ${testCase.name}`);
      
      const result = await runSingleTest(testCase);
      results.push(result);
      
      setProgress(((i + 1) / testsToRun.length) * 100);
      setTestResults([...results]);

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;

    if (passedTests === totalTests) {
      toast.success(`All ${totalTests} tests passed! 🎉`);
    } else {
      toast.error(`${totalTests - passedTests} of ${totalTests} tests failed`);
    }

    setIsRunning(false);
  }, [selectedTest, testCases]);

  const getTestStatusIcon = (result: TestResult) => {
    if (result.passed) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const averageExecutionTime = totalTests > 0 ? testResults.reduce((sum, r) => sum + r.executionTime, 0) / totalTests : 0;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <PlayCircle className="w-5 h-5" />
          Quantum Accuracy Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={runTests}
              disabled={isRunning}
              variant="default"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Run Tests
                </>
              )}
            </Button>
            
            <select 
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              disabled={isRunning}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm"
            >
              <option value="all">All Tests</option>
              {testCases.map(test => (
                <option key={test.name} value={test.name}>{test.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            {totalTests > 0 && (
              <>
                <Badge variant={passedTests === totalTests ? "default" : "destructive"}>
                  {passedTests}/{totalTests} Passed
                </Badge>
                <Badge variant="outline">
                  Avg: {averageExecutionTime.toFixed(1)}ms
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Running tests... {progress.toFixed(0)}%
            </p>
          </div>
        )}

        {/* Results */}
        {testResults.length > 0 && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testResults.map((result, index) => (
                  <Card key={index} className={`border ${result.passed ? 'border-green-500/30' : 'border-red-500/30'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{result.testName}</h4>
                        {getTestStatusIcon(result)}
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div>Time: {result.executionTime.toFixed(2)}ms</div>
                        <div>Fidelity: {result.fidelity.toFixed(6)}</div>
                        {result.errors.length > 0 && (
                          <div className="text-red-400">
                            Errors: {result.errors.length}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              {testResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      {getTestStatusIcon(result)}
                      {result.testName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.errors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {result.errors.map((error, i) => (
                              <div key={i} className="text-xs font-mono">{error}</div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h5 className="font-medium mb-2">Expected Results</h5>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(result.expectedResults, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Actual Results</h5>
                        <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(result.actualResults, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Test Cases Info */}
        <div>
          <h4 className="font-medium mb-3">Available Test Cases</h4>
          <div className="space-y-2">
            {testCases.map((testCase, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">{testCase.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{testCase.description}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Gates: {testCase.circuit.length} | Tolerance: {testCase.tolerance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}