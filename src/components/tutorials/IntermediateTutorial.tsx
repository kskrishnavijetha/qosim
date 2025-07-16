import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Search, Code, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface IntermediateTutorialProps {
  onProgressUpdate: (progress: number) => void;
}

export function IntermediateTutorial({ onProgressUpdate }: IntermediateTutorialProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps = [
    {
      id: 'grover-intro',
      title: 'Introduction to Grover\'s Algorithm',
      description: 'Understanding quantum search and amplitude amplification',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Grover's Algorithm is a quantum search algorithm that can search an unsorted database quadratically faster than any classical algorithm.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
              <Zap className="h-4 w-4" />
              Quantum Advantage
            </h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium mb-1 text-foreground">Classical Search</p>
                <p className="text-xs text-muted-foreground">O(N) operations</p>
                <p className="text-xs text-foreground">Check each item one by one</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1 text-foreground">Grover's Algorithm</p>
                <p className="text-xs text-muted-foreground">O(√N) operations</p>
                <p className="text-xs text-foreground">Quadratic speedup!</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
              <AlertCircle className="h-4 w-4" />
              Real-World Applications
            </h4>
            <ul className="space-y-1 text-sm text-foreground">
              <li>• Database searching</li>
              <li>• Cryptography and code breaking</li>
              <li>• Optimization problems</li>
              <li>• Machine learning applications</li>
            </ul>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'oracle-function',
      title: 'The Oracle Function',
      description: 'Understanding how to mark the target item',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            The oracle function is a "black box" that can recognize the target item we're searching for. It marks the target by flipping its phase.
          </p>
          <div className="border border-border rounded-lg p-4 bg-card">
            <h4 className="font-semibold mb-2 text-foreground">Oracle Properties:</h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li><strong>Input:</strong> A quantum state (superposition of all possible items)</li>
              <li><strong>Action:</strong> Flip the phase of the target item: |target⟩ → -|target⟩</li>
              <li><strong>Output:</strong> Modified quantum state with marked target</li>
            </ul>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Example: 2-Qubit Search</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Searching for item |11⟩ in database of 4 items (|00⟩, |01⟩, |10⟩, |11⟩)
            </p>
            <div className="font-mono text-xs space-y-1 text-foreground">
              <div>Before oracle: ½(|00⟩ + |01⟩ + |10⟩ + |11⟩)</div>
              <div>After oracle:  ½(|00⟩ + |01⟩ + |10⟩ - |11⟩)</div>
            </div>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'diffusion-operator',
      title: 'The Diffusion Operator',
      description: 'Amplifying the marked item\'s amplitude',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            The diffusion operator (also called "inversion about average") amplifies the amplitude of the marked item while decreasing others.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">How it Works:</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside text-foreground">
              <li>Calculate the average amplitude of all states</li>
              <li>Reflect each amplitude about this average</li>
              <li>This amplifies the marked state and reduces others</li>
            </ol>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <h4 className="font-semibold mb-2 text-foreground">Diffusion Operator Circuit:</h4>
            <ol className="space-y-1 text-sm list-decimal list-inside text-foreground">
              <li>Apply H gates to all qubits</li>
              <li>Apply X gates to all qubits</li>
              <li>Apply multi-controlled Z gate</li>
              <li>Apply X gates to all qubits (undo step 2)</li>
              <li>Apply H gates to all qubits (undo step 1)</li>
            </ol>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'grover-implementation',
      title: 'Implementing Grover\'s Algorithm',
      description: 'Build the complete algorithm step by step',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Let's implement a complete 2-qubit Grover's search to find the state |11⟩.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Algorithm Steps:</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside text-foreground">
              <li><strong>Initialize:</strong> Put all qubits in superposition with H gates</li>
              <li><strong>Oracle:</strong> Mark the target state |11⟩</li>
              <li><strong>Diffusion:</strong> Apply the diffusion operator</li>
              <li><strong>Measure:</strong> The target state now has high probability</li>
            </ol>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
              <AlertCircle className="h-4 w-4" />
              Number of Iterations
            </h4>
            <p className="text-sm text-foreground">
              For N items, optimal iterations ≈ π/4 × √N
              <br />
              For 4 items (2 qubits): ~1 iteration
              <br />
              For 16 items (4 qubits): ~3 iterations
            </p>
          </div>
        </div>
      ),
      codeExample: `// Grover's Algorithm Implementation
import { QOSimSDK } from '@qosim/sdk';

const sdk = new QOSimSDK();
await sdk.initialize();

// Create 2-qubit circuit for searching |11⟩
let circuit = sdk.createCircuit('Grover 2-Qubit', 2);

// Step 1: Initialize superposition
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });

// Step 2: Oracle - mark |11⟩ state
// Apply Z gate when both qubits are |1⟩
circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 0, qubit: 1 });

// Step 3: Diffusion operator
// H gates
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
// X gates
circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 });
// Multi-controlled Z (implemented as CZ in this case)
circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 0, qubit: 1 });
// Undo X gates
circuit = sdk.addGate(circuit, { type: 'x', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 });
// Undo H gates
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });

// Simulate
const result = await sdk.simulate(circuit);
console.log('Final probabilities:', result.probabilities);
// |11⟩ should have the highest probability!`,
      completed: false
    },
    {
      id: 'grover-analysis',
      title: 'Analyzing Results',
      description: 'Understanding the quantum speedup and success probability',
      content: (
        <div className="space-y-4">
          <p className="text-foreground">
            Let's analyze what makes Grover's algorithm so powerful and understand the results.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4 bg-card">
              <h4 className="font-semibold mb-2 text-foreground">Before Grover</h4>
              <p className="text-sm text-muted-foreground mb-2">Uniform superposition:</p>
              <div className="space-y-1 text-xs font-mono text-foreground">
                <div>|00⟩: 25%</div>
                <div>|01⟩: 25%</div>
                <div>|10⟩: 25%</div>
                <div>|11⟩: 25%</div>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <h4 className="font-semibold mb-2 text-foreground">After Grover</h4>
              <p className="text-sm text-muted-foreground mb-2">Amplified target:</p>
              <div className="space-y-1 text-xs font-mono text-foreground">
                <div>|00⟩: ~8%</div>
                <div>|01⟩: ~8%</div>
                <div>|10⟩: ~8%</div>
                <div className="font-bold text-green-600">|11⟩: ~75%</div>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-semibold mb-2 text-foreground">Success Probability</h4>
            <p className="text-sm text-foreground">
              Grover's algorithm doesn't guarantee 100% success, but provides high probability of finding the target.
              The success probability depends on the number of iterations and problem size.
            </p>
          </div>
        </div>
      ),
      completed: false
    }
  ];

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    
    const progress = Math.round((newCompleted.size / steps.length) * 100);
    onProgressUpdate(progress);
  };

  const progress = Math.round((completedSteps.size / steps.length) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="h-5 w-5" />
            Intermediate: Grover's Search Algorithm
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Master quantum search algorithms and understand amplitude amplification
          </CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm font-medium text-foreground">{completedSteps.size}/{steps.length} completed</span>
          </div>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {steps.map((step, index) => (
          <AccordionItem key={step.id} value={step.id}>
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-4 w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStep(step.id);
                    }}
                    className="p-0 h-auto"
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  {step.content}
                  {step.codeExample && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                        <Code className="h-4 w-4" />
                        Code Example
                      </h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm border border-border">
                        <code className="text-foreground">{step.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>

      {progress === 100 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Intermediate Level Complete! 🔍</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
              You've mastered quantum search algorithms. Ready for advanced SDK integration?
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue to Advanced
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
