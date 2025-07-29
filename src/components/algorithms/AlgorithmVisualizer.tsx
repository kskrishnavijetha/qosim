
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, ChevronRight, Eye } from 'lucide-react';
import { QuantumCircuit, SimulationResult } from '@/sdk/qosim-sdk';
import { BlochSphere } from '../BlochSphere';

interface AlgorithmVisualizerProps {
  algorithm: string;
  circuit: QuantumCircuit;
  onStepChange?: (step: number) => void;
}

interface VisualizationStep {
  stepNumber: number;
  description: string;
  gateIndex: number;
  stateVector: { real: number; imag: number }[];
  blochData: Array<{
    qubit: number;
    x: number;
    y: number;
    z: number;
  }>;
  entanglement?: {
    pairs: [number, number][];
    strength: number;
  };
}

export function AlgorithmVisualizer({ 
  algorithm, 
  circuit, 
  onStepChange 
}: AlgorithmVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per step

  useEffect(() => {
    generateVisualizationSteps();
  }, [circuit]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length - 1) {
            setIsPlaying(false);
          }
          onStepChange?.(next);
          return next;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, playbackSpeed, onStepChange]);

  const generateVisualizationSteps = () => {
    const visualizationSteps: VisualizationStep[] = [];
    
    // Initial state
    const initialState = Array.from({ length: Math.pow(2, circuit.qubits) }, (_, i) => ({
      real: i === 0 ? 1 : 0,
      imag: 0
    }));

    visualizationSteps.push({
      stepNumber: 0,
      description: `Initialize ${circuit.qubits} qubits in |0⟩ state`,
      gateIndex: -1,
      stateVector: initialState,
      blochData: Array.from({ length: circuit.qubits }, (_, i) => ({
        qubit: i,
        x: 0,
        y: 0,
        z: 1 // |0⟩ state points up on Bloch sphere
      }))
    });

    // Simulate each gate step
    let currentState = [...initialState];
    circuit.gates.forEach((gate, index) => {
      // Apply gate (simplified)
      const newBlochData = calculateBlochVectors(currentState, circuit.qubits);
      
      visualizationSteps.push({
        stepNumber: index + 1,
        description: getGateDescription(gate, index),
        gateIndex: index,
        stateVector: [...currentState],
        blochData: newBlochData,
        entanglement: calculateEntanglement(currentState, circuit.qubits)
      });
    });

    setSteps(visualizationSteps);
  };

  const calculateBlochVectors = (stateVector: { real: number; imag: number }[], qubits: number) => {
    return Array.from({ length: qubits }, (_, qubit) => {
      // Simplified Bloch sphere calculation
      const angle = Math.random() * 2 * Math.PI; // Placeholder
      const phi = Math.random() * Math.PI;
      
      return {
        qubit,
        x: Math.sin(phi) * Math.cos(angle),
        y: Math.sin(phi) * Math.sin(angle),
        z: Math.cos(phi)
      };
    });
  };

  const calculateEntanglement = (stateVector: { real: number; imag: number }[], qubits: number) => {
    // Simplified entanglement calculation
    const pairs: [number, number][] = [];
    let totalStrength = 0;

    for (let i = 0; i < qubits - 1; i++) {
      for (let j = i + 1; j < qubits; j++) {
        const strength = Math.random() * 0.5; // Placeholder
        if (strength > 0.1) {
          pairs.push([i, j]);
          totalStrength += strength;
        }
      }
    }

    return pairs.length > 0 ? { pairs, strength: totalStrength } : undefined;
  };

  const getGateDescription = (gate: any, index: number): string => {
    switch (gate.type) {
      case 'h':
        return `Step ${index + 1}: Apply Hadamard gate to qubit ${gate.qubit}`;
      case 'x':
        return `Step ${index + 1}: Apply X gate to qubit ${gate.qubit}`;
      case 'cnot':
        return `Step ${index + 1}: Apply CNOT gate (control: ${gate.controlQubit}, target: ${gate.qubit})`;
      default:
        return `Step ${index + 1}: Apply ${gate.type} gate`;
    }
  };

  const currentStepData = steps[currentStep];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    onStepChange?.(0);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      onStepChange?.(next);
    }
  };

  if (!currentStepData) {
    return <div>Loading visualization...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-quantum-glow flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {algorithm} Algorithm Visualizer
            </span>
            <Badge variant="outline" className="neon-border">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <Progress 
              value={(currentStep / (steps.length - 1)) * 100} 
              className="w-full h-2"
            />
            <p className="text-sm text-quantum-particle mt-2">
              {currentStepData.description}
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="neon-border"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              className="neon-border"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStepForward}
              disabled={currentStep >= steps.length - 1}
              className="neon-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {/* Speed Control */}
            <select 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="ml-4 px-2 py-1 bg-quantum-void border border-quantum-matrix rounded text-quantum-glow"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloch Spheres */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Qubit States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {currentStepData.blochData.map(({ qubit, x, y, z }) => (
                <div key={qubit} className="text-center">
                  <h4 className="text-sm font-semibold text-quantum-particle mb-2">
                    Qubit {qubit}
                  </h4>
                  <div className="w-32 h-32 mx-auto">
                    <BlochSphere vector={{ x, y, z }} size={128} />
                  </div>
                  <p className="text-xs text-quantum-neon mt-1">
                    ({x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)})
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* State Vector & Probabilities */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Quantum State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Measurement Probabilities */}
              <div>
                <h4 className="text-sm font-semibold text-quantum-particle mb-2">
                  Measurement Probabilities
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {currentStepData.stateVector.map((amplitude, index) => {
                    const probability = amplitude.real * amplitude.real + amplitude.imag * amplitude.imag;
                    if (probability > 0.001) {
                      const state = index.toString(2).padStart(circuit.qubits, '0');
                      return (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-quantum-neon font-mono">|{state}⟩</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-quantum-void rounded">
                              <div 
                                className="h-full bg-quantum-glow rounded"
                                style={{ width: `${probability * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-quantum-particle w-12 text-right">
                              {(probability * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Entanglement Information */}
              {currentStepData.entanglement && (
                <div>
                  <h4 className="text-sm font-semibold text-quantum-particle mb-2">
                    Entanglement
                  </h4>
                  <div className="space-y-1">
                    {currentStepData.entanglement.pairs.map(([q1, q2], index) => (
                      <div key={index} className="text-xs text-quantum-neon">
                        Qubits {q1} ↔ {q2}
                      </div>
                    ))}
                    <div className="text-xs text-quantum-glow mt-2">
                      Total Entanglement: {currentStepData.entanglement.strength.toFixed(3)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
