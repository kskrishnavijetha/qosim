
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Play, Code, Lightbulb, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface BeginnerTutorialProps {
  onProgressUpdate: (progress: number) => void;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  codeExample?: string;
  completed: boolean;
}

export function BeginnerTutorial({ onProgressUpdate }: BeginnerTutorialProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: TutorialStep[] = [
    {
      id: 'intro',
      title: 'What is Quantum Computing?',
      description: 'Understanding the basics of quantum mechanics and computing',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Quantum computing harnesses quantum mechanical phenomena like superposition and entanglement to process information in ways that classical computers cannot.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Key Concepts
            </h4>
            <ul className="space-y-2 text-sm">
              <li><strong>Qubit:</strong> The basic unit of quantum information (can be 0, 1, or both simultaneously)</li>
              <li><strong>Superposition:</strong> A qubit can exist in multiple states at once</li>
              <li><strong>Entanglement:</strong> Qubits can be correlated in ways that don't exist classically</li>
              <li><strong>Measurement:</strong> Observing a quantum state collapses it to a classical state</li>
            </ul>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'qubits',
      title: 'Understanding Qubits',
      description: 'Learn about the fundamental building blocks of quantum computers',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            A qubit is like a classical bit, but with quantum properties. While a classical bit is either 0 or 1, a qubit can be in a superposition of both states.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Classical Bit</h4>
              <p className="text-sm text-muted-foreground">Always in a definite state: 0 or 1</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline">0</Badge>
                <span>or</span>
                <Badge variant="outline">1</Badge>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Quantum Bit (Qubit)</h4>
              <p className="text-sm text-muted-foreground">Can be in superposition: α|0⟩ + β|1⟩</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary">|0⟩</Badge>
                <span>+</span>
                <Badge variant="secondary">|1⟩</Badge>
              </div>
            </div>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'gates',
      title: 'Quantum Gates',
      description: 'Introduction to quantum logic gates and operations',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Quantum gates are the building blocks of quantum circuits. They manipulate qubits to perform quantum computations.
          </p>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2">Pauli-X Gate (NOT Gate)</h4>
              <p className="text-sm text-muted-foreground mb-2">Flips the state of a qubit: |0⟩ → |1⟩ and |1⟩ → |0⟩</p>
              <Badge variant="outline" className="font-mono">X</Badge>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2">Hadamard Gate</h4>
              <p className="text-sm text-muted-foreground mb-2">Creates superposition: |0⟩ → (|0⟩ + |1⟩)/√2</p>
              <Badge variant="outline" className="font-mono">H</Badge>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2">CNOT Gate</h4>
              <p className="text-sm text-muted-foreground mb-2">Controlled operation: flips target if control is |1⟩</p>
              <Badge variant="outline" className="font-mono">CNOT</Badge>
            </div>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'first-circuit',
      title: 'Your First Quantum Circuit',
      description: 'Create a simple quantum circuit using QOSim',
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Let's create your first quantum circuit! We'll build a simple circuit that puts a qubit in superposition.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Step-by-Step Instructions:</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Open the QOSim circuit builder</li>
              <li>Drag a Hadamard (H) gate onto qubit 0</li>
              <li>Add a measurement gate</li>
              <li>Run the simulation</li>
              <li>Observe the 50/50 probability distribution</li>
            </ol>
          </div>
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">Try it yourself!</h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Go to the main QOSim app and follow the instructions above. This creates your first quantum superposition!
            </p>
          </div>
        </div>
      ),
      codeExample: `// QOSim SDK Example
import { QOSimSDK } from '@qosim/sdk';

const sdk = new QOSimSDK();
await sdk.initialize();

// Create circuit
let circuit = sdk.createCircuit('First Circuit', 1);

// Add Hadamard gate to create superposition
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });

// Simulate
const result = await sdk.simulate(circuit);
console.log('Probabilities:', result.probabilities);
// Output: [0.5, 0.5] - equal probability for |0⟩ and |1⟩`,
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
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Beginner: Your First Steps in Quantum Computing
          </CardTitle>
          <CardDescription>
            Learn the fundamentals of quantum computing and create your first quantum circuit
          </CardDescription>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="text-sm font-medium">{completedSteps.size}/{steps.length} completed</span>
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
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  {step.content}
                  {step.codeExample && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Code Example
                      </h4>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{step.codeExample}</code>
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
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Beginner Level Complete! 🎉</h3>
            <p className="text-sm text-green-600 mb-4">
              You've mastered the basics of quantum computing. Ready for intermediate concepts?
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Continue to Intermediate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
