import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Play, TestTube } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { enhancedQuantumSimulationManager } from '@/lib/enhancedQuantumSimulationService';

interface TestCase {
  id: string;
  name: string;
  description: string;
  circuit: Omit<Gate, 'id'>[];
  expectedResults: {
    entanglement?: number;
    measurementProbabilities: number[];
    tolerance: number;
  };
  category: 'entanglement' | 'algorithms' | 'transforms' | 'error-correction';
}

interface TestResult {
  testId: string;
  passed: boolean;
  actualResults: OptimizedSimulationResult | null;
  errorMessage?: string;
  score: number;
}

const QUANTUM_TEST_CASES: TestCase[] = [
  {
    id: 'bell-state-test',
    name: 'Bell State Verification',
    description: 'Verify |Φ+⟩ = (|00⟩ + |11⟩)/√2 creation',
    circuit: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'CNOT', qubits: [0, 1], position: 1 }
    ],
    expectedResults: {
      entanglement: 1.0,
      measurementProbabilities: [0.5, 0, 0, 0.5],
      tolerance: 0.1
    },
    category: 'entanglement'
  },
  {
    id: 'superposition-test',
    name: 'Superposition Creation',
    description: 'Single qubit in equal superposition',
    circuit: [
      { type: 'H', qubit: 0, position: 0 }
    ],
    expectedResults: {
      measurementProbabilities: [0.5, 0.5],
      tolerance: 0.05
    },
    category: 'entanglement'
  },
  {
    id: 'phase-flip-test',
    name: 'Phase Flip Test',
    description: 'Z gate on superposition state',
    circuit: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'Z', qubit: 0, position: 1 },
      { type: 'H', qubit: 0, position: 2 }
    ],
    expectedResults: {
      measurementProbabilities: [0, 1],
      tolerance: 0.05
    },
    category: 'algorithms'
  },
  {
    id: 'qft-coherence-test',
    name: 'QFT Coherence',
    description: 'Basic QFT maintains quantum coherence',
    circuit: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'RZ', qubit: 0, angle: Math.PI/2, position: 1 },
      { type: 'H', qubit: 1, position: 2 }
    ],
    expectedResults: {
      measurementProbabilities: [0.25, 0.25, 0.25, 0.25],
      tolerance: 0.1
    },
    category: 'transforms'
  },
  {
    id: 'cnot-identity-test',
    name: 'CNOT Identity Test',
    description: 'CNOT with control |0⟩ leaves target unchanged',
    circuit: [
      { type: 'CNOT', qubits: [0, 1], position: 0 }
    ],
    expectedResults: {
      measurementProbabilities: [1, 0, 0, 0],
      tolerance: 0.01
    },
    category: 'entanglement'
  }
];

interface QuantumTestSuiteProps {
  circuit: Gate[];
  onCircuitLoad: (gates: Omit<Gate, 'id'>[]) => void;
}

export function QuantumTestSuite({ circuit, onCircuitLoad }: QuantumTestSuiteProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const runSingleTest = useCallback(async (testCase: TestCase): Promise<TestResult> => {
    try {
      // Convert test circuit to QuantumGate format
      const quantumGates = testCase.circuit.map((gate, index) => ({
        id: `test-gate-${index}`,
        type: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        position: gate.position,
        angle: gate.angle
      }));

      // Run simulation
      const result = await enhancedQuantumSimulationManager.simulate(quantumGates, 5);
      
      // Validate results
      let score = 0;
      let passed = true;
      
      // Check measurement probabilities
      if (testCase.expectedResults.measurementProbabilities) {
        const expectedProbs = testCase.expectedResults.measurementProbabilities;
        const actualProbs = result.measurementProbabilities;
        const tolerance = testCase.expectedResults.tolerance;
        
        for (let i = 0; i < Math.min(expectedProbs.length, actualProbs.length); i++) {
          const diff = Math.abs(expectedProbs[i] - actualProbs[i]);
          if (diff <= tolerance) {
            score += 1;
          } else {
            passed = false;
          }
        }
        score = score / expectedProbs.length;
      }
      
      // Check entanglement if specified
      if (testCase.expectedResults.entanglement !== undefined) {
        const expectedEnt = testCase.expectedResults.entanglement;
        const actualEnt = result.entanglement.totalEntanglement;
        const entDiff = Math.abs(expectedEnt - actualEnt);
        
        if (entDiff <= testCase.expectedResults.tolerance) {
          score = Math.max(score, 0.8);
        } else {
          passed = false;
          score = Math.min(score, 0.5);
        }
      }

      return {
        testId: testCase.id,
        passed,
        actualResults: result,
        score: Math.max(0, Math.min(1, score))
      };
    } catch (error) {
      return {
        testId: testCase.id,
        passed: false,
        actualResults: null,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        score: 0
      };
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    for (const testCase of QUANTUM_TEST_CASES) {
      setCurrentTest(testCase.id);
      const result = await runSingleTest(testCase);
      results.push(result);
      setTestResults([...results]);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setCurrentTest(null);
    setIsRunning(false);
  }, [runSingleTest]);

  const runCurrentCircuitTest = useCallback(async () => {
    if (circuit.length === 0) return;
    
    setIsRunning(true);
    setCurrentTest('current-circuit');
    
    try {
      const quantumGates = circuit.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        position: gate.position,
        angle: gate.angle
      }));

      const result = await enhancedQuantumSimulationManager.simulate(quantumGates, 5);
      
      // Create a test result for current circuit
      const currentResult: TestResult = {
        testId: 'current-circuit',
        passed: true,
        actualResults: result,
        score: 1.0
      };

      setTestResults([currentResult]);
    } catch (error) {
      setTestResults([{
        testId: 'current-circuit',
        passed: false,
        actualResults: null,
        errorMessage: error instanceof Error ? error.message : 'Simulation failed',
        score: 0
      }]);
    }

    setCurrentTest(null);
    setIsRunning(false);
  }, [circuit]);

  const loadTestCase = useCallback((testCase: TestCase) => {
    onCircuitLoad(testCase.circuit);
  }, [onCircuitLoad]);

  const overallScore = testResults.length > 0 
    ? testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length 
    : 0;

  const passedTests = testResults.filter(result => result.passed).length;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <TestTube className="w-5 h-5" />
          Quantum Test Suite
          {testResults.length > 0 && (
            <Badge variant={passedTests === testResults.length ? "default" : "secondary"}>
              {passedTests}/{testResults.length} Passed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>Running Tests...</>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={runCurrentCircuitTest}
            disabled={isRunning || circuit.length === 0}
          >
            Test Current Circuit
          </Button>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running tests...</span>
              <span>{testResults.length}/{QUANTUM_TEST_CASES.length}</span>
            </div>
            <Progress 
              value={(testResults.length / QUANTUM_TEST_CASES.length) * 100} 
              className="quantum-progress"
            />
          </div>
        )}

        {/* Overall Score */}
        {testResults.length > 0 && !isRunning && (
          <Alert className="border-quantum-blue/30 bg-quantum-blue/5">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Overall Score: {(overallScore * 100).toFixed(1)}%</strong>
              <br />
              Quantum circuit validation complete. 
              {passedTests === testResults.length 
                ? " All tests passed!" 
                : ` ${testResults.length - passedTests} test(s) failed.`
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Test Cases */}
        <div className="space-y-3">
          <h4 className="font-semibold">Available Test Cases:</h4>
          {QUANTUM_TEST_CASES.map((testCase) => {
            const result = testResults.find(r => r.testId === testCase.id);
            const isCurrentTest = currentTest === testCase.id;
            
            return (
              <div key={testCase.id} className="flex items-center justify-between p-3 rounded-lg border border-quantum-blue/20 bg-quantum-dark/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{testCase.name}</h5>
                    <Badge variant="outline" className="text-xs">
                      {testCase.category}
                    </Badge>
                    {result && (
                      result.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )
                    )}
                    {isCurrentTest && (
                      <Badge variant="default" className="text-xs">Running</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {testCase.description}
                  </p>
                  {result && result.score !== undefined && (
                    <div className="text-xs mt-1">
                      Score: {(result.score * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadTestCase(testCase)}
                  disabled={isRunning}
                >
                  Load
                </Button>
              </div>
            );
          })}
        </div>

        {/* Current Circuit Test Result */}
        {testResults.find(r => r.testId === 'current-circuit') && (
          <div className="mt-4 p-3 rounded-lg border border-quantum-purple/20 bg-quantum-purple/5">
            <h4 className="font-semibold mb-2">Current Circuit Results:</h4>
            {(() => {
              const result = testResults.find(r => r.testId === 'current-circuit');
              if (!result?.actualResults) return null;
              
              return (
                <div className="space-y-2 text-sm">
                  <div>Execution time: {result.actualResults.executionTime.toFixed(2)}ms</div>
                  <div>Total entanglement: {result.actualResults.entanglement.totalEntanglement.toFixed(3)}</div>
                  <div>Fidelity: {result.actualResults.fidelity.toFixed(3)}</div>
                  <div>
                    Probabilities: [{result.actualResults.measurementProbabilities.slice(0, 4).map(p => p.toFixed(3)).join(', ')}...]
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}