
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, ChevronRight, ChevronLeft, Lightbulb, AlertCircle } from 'lucide-react';

interface EducationalStep {
  time: number;
  title: string;
  description: string;
  concept: string;
  visualCue: string;
  qubitAffected: number[];
  severity: 'info' | 'warning' | 'critical';
}

interface QMMEducationalModeProps {
  currentTime: number;
  isActive: boolean;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
  qubitCount: number;
}

export function QMMEducationalMode({ 
  currentTime, 
  isActive, 
  onToggle, 
  onSpeedChange,
  qubitCount 
}: QMMEducationalModeProps) {
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Generate educational steps based on simulation
  const educationalSteps: EducationalStep[] = [
    {
      time: 0.0,
      title: "Initialization",
      description: "All qubits start in the |0⟩ ground state with maximum coherence and fidelity.",
      concept: "Initial quantum state preparation is crucial for algorithm success.",
      visualCue: "All tracks show bright green indicating perfect fidelity",
      qubitAffected: Array.from({length: qubitCount}, (_, i) => i),
      severity: 'info'
    },
    {
      time: 0.5,
      title: "First Gate Operations",
      description: "Hadamard gates create superposition states, slightly reducing fidelity due to gate noise.",
      concept: "Quantum gates introduce small amounts of noise, beginning the decoherence process.",
      visualCue: "Watch for slight color changes from green to yellow-green",
      qubitAffected: [0, 1],
      severity: 'info'
    },
    {
      time: 1.2,
      title: "Entanglement Creation",
      description: "CNOT gates create quantum entanglement between qubits, making them sensitive to crosstalk.",
      concept: "Entangled qubits share quantum states and can affect each other's decoherence.",
      visualCue: "Entangled qubits show 'ENT' markers and correlated color changes",
      qubitAffected: [0, 1, 2],
      severity: 'info'
    },
    {
      time: 2.1,
      title: "T1 Relaxation Effects",
      description: "Energy relaxation causes excited states to decay to ground state over time.",
      concept: "T1 time represents how long a qubit stays in the |1⟩ state before decaying to |0⟩.",
      visualCue: "Orange coloring indicates T1 relaxation affecting qubit fidelity",
      qubitAffected: [1, 3],
      severity: 'warning'
    },
    {
      time: 2.8,
      title: "T2 Dephasing",
      description: "Phase coherence is lost faster than energy, destroying superposition states.",
      concept: "T2 ≤ T1 always. T2* includes additional pure dephasing effects from environment.",
      visualCue: "Yellow to orange transitions show dephasing in superposition states",
      qubitAffected: [0, 2],
      severity: 'warning'
    },
    {
      time: 3.5,
      title: "Critical Decoherence",
      description: "Multiple decoherence sources combine, causing rapid fidelity loss.",
      concept: "Decoherence is cumulative - multiple noise sources add up quickly.",
      visualCue: "Red coloring indicates critical fidelity loss requiring attention",
      qubitAffected: [1],
      severity: 'critical'
    },
    {
      time: 4.2,
      title: "Error Correction Needed",
      description: "Fidelity has dropped below algorithmic tolerance. Error correction would help here.",
      concept: "Real quantum computers use error correction to maintain computational fidelity.",
      visualCue: "Sustained red regions indicate where error correction is essential",
      qubitAffected: [1, 3],
      severity: 'critical'
    }
  ];

  // Find current educational step
  useEffect(() => {
    const step = educationalSteps.findIndex((step, index) => {
      const nextStep = educationalSteps[index + 1];
      return currentTime >= step.time && (!nextStep || currentTime < nextStep.time);
    });
    
    if (step !== -1 && step !== currentStep) {
      setCurrentStep(step);
      if (isActive) {
        setShowExplanation(true);
        // Slow down for educational explanations
        onSpeedChange(0.3);
      }
    }
  }, [currentTime, isActive]);

  const currentStepData = educationalSteps[currentStep];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <Lightbulb className="w-4 h-4 text-blue-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'border-blue-400/50 bg-blue-400/10';
      case 'warning': return 'border-yellow-400/50 bg-yellow-400/10';
      case 'critical': return 'border-red-400/50 bg-red-400/10';
      default: return 'border-quantum-neon/50 bg-quantum-neon/10';
    }
  };

  if (!isActive) {
    return (
      <Card className="quantum-panel neon-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-quantum-neon" />
              <span className="text-quantum-glow">Educational Mode</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              Enable Learning Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Educational Mode Active
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              Disable
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-quantum-particle">
                Step {currentStep + 1} of {educationalSteps.length}
              </span>
              <Badge variant="outline" className="text-quantum-neon">
                {currentStepData.time.toFixed(1)}μs
              </Badge>
            </div>
            
            <Progress 
              value={((currentStep + 1) / educationalSteps.length) * 100} 
              className="w-full"
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex-1 border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
              >
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(Math.min(educationalSteps.length - 1, currentStep + 1))}
                disabled={currentStep === educationalSteps.length - 1}
                className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Panel */}
      {showExplanation && currentStepData && (
        <Card className={`border-2 ${getSeverityColor(currentStepData.severity)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              {getSeverityIcon(currentStepData.severity)}
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-quantum-neon mb-2">What's Happening:</h4>
              <p className="text-sm text-quantum-particle leading-relaxed">
                {currentStepData.description}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-quantum-neon mb-2">Key Concept:</h4>
              <p className="text-sm text-quantum-glow leading-relaxed">
                {currentStepData.concept}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-quantum-neon mb-2">Visual Guide:</h4>
              <p className="text-sm text-quantum-energy leading-relaxed">
                {currentStepData.visualCue}
              </p>
            </div>
            
            {currentStepData.qubitAffected.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-quantum-neon mb-2">Affected Qubits:</h4>
                <div className="flex gap-1">
                  {currentStepData.qubitAffected.map(qubit => (
                    <Badge key={qubit} variant="outline" className="text-quantum-plasma">
                      Q{qubit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
