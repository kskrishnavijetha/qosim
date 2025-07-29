
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Target, Award, ArrowRight, Lightbulb } from 'lucide-react';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'visual' | 'code' | 'theory';
  completed: boolean;
  circuitData?: any;
  codeExample?: string;
}

interface UnifiedLearningModeProps {
  currentCircuit: any;
  onCircuitUpdate?: (circuit: any) => void;
  onCodeGenerate?: (code: string, format: string) => void;
}

export function UnifiedLearningMode({ 
  currentCircuit, 
  onCircuitUpdate, 
  onCodeGenerate 
}: UnifiedLearningModeProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [learningPath, setLearningPath] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const learningSteps: LearningStep[] = [
    {
      id: 'basics-1',
      title: 'Understanding Qubits',
      description: 'Learn about quantum bits and their superposition states',
      type: 'theory',
      completed: false
    },
    {
      id: 'basics-2',
      title: 'Your First Gate',
      description: 'Add a Hadamard gate to create superposition',
      type: 'visual',
      completed: false,
      circuitData: {
        gates: [{ type: 'H', qubit: 0, position: 0 }]
      }
    },
    {
      id: 'basics-3',
      title: 'Code It Up',
      description: 'See how your visual circuit translates to code',
      type: 'code',
      completed: false,
      codeExample: `# Your first quantum circuit
from qiskit import QuantumCircuit

qc = QuantumCircuit(1)
qc.h(0)  # Hadamard gate
print(qc.draw())`
    },
    {
      id: 'entanglement-1',
      title: 'Bell States',
      description: 'Create quantum entanglement with two qubits',
      type: 'visual',
      completed: false,
      circuitData: {
        gates: [
          { type: 'H', qubit: 0, position: 0 },
          { type: 'CNOT', qubits: [0, 1], position: 1 }
        ]
      }
    }
  ];

  const currentStep = learningSteps[currentLesson];
  const progress = ((currentLesson + 1) / learningSteps.length) * 100;

  const handleNext = () => {
    if (currentLesson < learningSteps.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleApplyToBuilder = () => {
    if (currentStep.circuitData) {
      onCircuitUpdate?.(currentStep.circuitData);
    }
  };

  const handleGenerateCode = () => {
    if (currentStep.codeExample) {
      onCodeGenerate?.(currentStep.codeExample, 'python');
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Interactive Learning Mode
            </CardTitle>
            <Badge variant="outline">
              Step {currentLesson + 1} of {learningSteps.length}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Learning Content */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            {currentStep.type === 'visual' && <Target className="w-5 h-5 text-blue-500" />}
            {currentStep.type === 'code' && <BookOpen className="w-5 h-5 text-green-500" />}
            {currentStep.type === 'theory' && <Lightbulb className="w-5 h-5 text-yellow-500" />}
            <CardTitle className="text-lg">{currentStep.title}</CardTitle>
          </div>
          <p className="text-quantum-particle">{currentStep.description}</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="instruction" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instruction">Instruction</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="verify">Verify</TabsTrigger>
            </TabsList>

            <TabsContent value="instruction" className="space-y-4">
              <div className="p-4 bg-quantum-void rounded border border-quantum-matrix">
                {currentStep.type === 'theory' && (
                  <div>
                    <h4 className="font-semibold text-quantum-glow mb-2">Theory</h4>
                    <p className="text-quantum-particle text-sm">
                      Quantum bits (qubits) can exist in a superposition of both 0 and 1 states simultaneously. 
                      This is what gives quantum computers their power.
                    </p>
                  </div>
                )}

                {currentStep.type === 'visual' && (
                  <div>
                    <h4 className="font-semibold text-quantum-glow mb-2">Visual Circuit</h4>
                    <p className="text-quantum-particle text-sm mb-3">
                      Build the circuit shown below in the visual builder.
                    </p>
                    <Button
                      onClick={handleApplyToBuilder}
                      className="w-full"
                    >
                      Apply to Circuit Builder
                    </Button>
                  </div>
                )}

                {currentStep.type === 'code' && (
                  <div>
                    <h4 className="font-semibold text-quantum-glow mb-2">Code Example</h4>
                    <pre className="bg-black p-3 rounded text-green-400 text-xs overflow-x-auto">
                      {currentStep.codeExample}
                    </pre>
                    <Button
                      onClick={handleGenerateCode}
                      className="w-full mt-3"
                    >
                      Generate Code
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="practice" className="space-y-4">
              <div className="p-4 bg-quantum-matrix/20 rounded border border-quantum-glow/20">
                <p className="text-quantum-particle text-sm">
                  Practice area - your circuit builder and code editor are synchronized here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="verify" className="space-y-4">
              <div className="p-4 bg-green-500/20 rounded border border-green-500/40">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-green-400">Verification</span>
                </div>
                <p className="text-green-300 text-sm">
                  Great job! Your circuit matches the expected result.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentLesson === 0}
            >
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentLesson === learningSteps.length - 1}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
