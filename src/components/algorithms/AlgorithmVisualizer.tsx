import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlochSphere } from '@/components/BlochSphere';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { Complex } from '@/lib/quantumSimulator';

interface AlgorithmStep {
  id: string;
  title: string;
  description: string;
  code: string;
  qubitState: number[][];
  entanglement?: { pairs: [number, number][], values: number[] };
  measurements?: { [state: string]: number };
}

interface AlgorithmData {
  name: string;
  description: string;
  steps: AlgorithmStep[];
  complexity: string;
  category: 'search' | 'optimization' | 'simulation' | 'cryptography';
}

const sampleAlgorithms: AlgorithmData[] = [
  {
    name: "Bell State Preparation",
    description: "Creates maximally entangled Bell states using Hadamard and CNOT gates",
    complexity: "O(1)",
    category: "simulation",
    steps: [
      {
        id: "step1",
        title: "Initialize Qubits",
        description: "Start with two qubits in |00⟩ state",
        code: "qc.initialize([1, 0, 0, 0])",
        qubitState: [[1, 0], [1, 0]],
        measurements: { "00": 1.0 }
      },
      {
        id: "step2", 
        title: "Apply Hadamard Gate",
        description: "Create superposition on first qubit",
        code: "qc.h(0)",
        qubitState: [[0.707, 0.707], [1, 0]],
        measurements: { "00": 0.5, "10": 0.5 }
      },
      {
        id: "step3",
        title: "Apply CNOT Gate", 
        description: "Entangle qubits with controlled-X operation",
        code: "qc.cx(0, 1)",
        qubitState: [[0.707, 0.707], [0.707, 0.707]],
        entanglement: { pairs: [[0, 1]], values: [1.0] },
        measurements: { "00": 0.5, "11": 0.5 }
      }
    ]
  },
  {
    name: "Grover's Search",
    description: "Quantum search algorithm for unstructured databases",
    complexity: "O(√N)",
    category: "search",
    steps: [
      {
        id: "step1",
        title: "Superposition",
        description: "Initialize all qubits in equal superposition",
        code: "qc.h(range(n))",
        qubitState: [[0.5, 0.5], [0.5, 0.5]],
        measurements: { "00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25 }
      },
      {
        id: "step2",
        title: "Oracle Query",
        description: "Mark target state with phase flip",
        code: "oracle(qc, target)",
        qubitState: [[0.5, -0.5], [0.5, 0.5]],
        measurements: { "00": 0.25, "01": 0.25, "10": 0.25, "11": 0.25 }
      },
      {
        id: "step3",
        title: "Diffusion Operator",
        description: "Amplify marked state amplitude",
        code: "diffusion(qc)",
        qubitState: [[0.707, 0], [0, 0.707]],
        measurements: { "00": 0.5, "11": 0.5 }
      }
    ]
  }
];

export function AlgorithmVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmData>(sampleAlgorithms[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < selectedAlgorithm.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, animationSpeed);
    } else if (currentStep >= selectedAlgorithm.steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, selectedAlgorithm.steps.length, animationSpeed]);

  const handlePlay = () => {
    if (currentStep >= selectedAlgorithm.steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < selectedAlgorithm.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = selectedAlgorithm.steps[currentStep];

  // Convert qubit state to BlochSphere format
  const convertToBlochSphereState = (state: number[]) => {
    const amplitude0: Complex = { real: state[0], imag: 0 };
    const amplitude1: Complex = { real: state[1], imag: 0 };
    const probability0 = state[0] * state[0];
    const probability1 = state[1] * state[1];
    const phase = Math.atan2(0, state[1]); // Simplified phase calculation
    
    return {
      amplitude0,
      amplitude1,
      probability0,
      probability1,
      phase
    };
  };

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Interactive Algorithm Visualizer
            <Badge variant="secondary">{selectedAlgorithm.category}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleAlgorithms.map((algorithm) => (
              <Card 
                key={algorithm.name}
                className={`cursor-pointer transition-all ${
                  selectedAlgorithm.name === algorithm.name 
                    ? 'ring-2 ring-primary' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  setSelectedAlgorithm(algorithm);
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm">{algorithm.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {algorithm.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="text-xs">
                      {algorithm.complexity}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {algorithm.steps.length} steps
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedAlgorithm.name}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStepBackward}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleStepForward}
                disabled={currentStep === selectedAlgorithm.steps.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step Progress */}
            <div className="flex items-center space-x-2">
              {selectedAlgorithm.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {/* Current Step Info */}
            <div className="text-center">
              <Badge variant="secondary">
                Step {currentStep + 1} of {selectedAlgorithm.steps.length}
              </Badge>
              <h3 className="text-lg font-semibold mt-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Tabs */}
      <Tabs defaultValue="bloch" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bloch">Bloch Spheres</TabsTrigger>
          <TabsTrigger value="entanglement">Entanglement</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="bloch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Qubit States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentStepData.qubitState.map((state, index) => (
                  <div key={index} className="text-center">
                    <h4 className="font-semibold mb-2">Qubit {index}</h4>
                    <div className="flex justify-center">
                      <BlochSphere
                        qubitState={convertToBlochSphereState(state)}
                        size={200}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      |0⟩: {(state[0] ** 2 * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      |1⟩: {(state[1] ** 2 * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entanglement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entanglement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStepData.entanglement ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Entangled System
                    </Badge>
                  </div>
                  {currentStepData.entanglement.pairs.map((pair, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <span>Qubits {pair[0]} ↔ {pair[1]}</span>
                      <Badge variant="outline">
                        Entanglement: {(currentStepData.entanglement!.values[index] * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No entanglement detected in current step
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Measurement Probabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentStepData.measurements || {}).map(([state, prob]) => (
                  <div key={state} className="flex items-center justify-between">
                    <span className="font-mono">|{state}⟩</span>
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[50px]">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{currentStepData.code}</code>
                </pre>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-sm text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
