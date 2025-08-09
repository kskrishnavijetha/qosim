
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

interface EducationalModePanelProps {
  content: {
    currentExplanation: string;
    stepDescription: string;
    whatIsHappening: string[];
  };
  currentStep: number;
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export function EducationalModePanel({
  content,
  currentStep,
  isActive,
  onToggle
}: EducationalModePanelProps) {
  const educationalSteps = [
    {
      title: "Classical Signal Generation",
      description: "Classical logic nodes generate Boolean signals based on their inputs and logic rules.",
      details: [
        "Clock nodes generate periodic signals",
        "Logic gates (AND, OR, NOT) process input signals",
        "Output signals propagate through classical pathways"
      ]
    },
    {
      title: "Classical-to-Quantum Interface",
      description: "Classical control signals trigger quantum gate operations through hybrid connections.",
      details: [
        "Classical HIGH signal activates connected quantum gate",
        "Signal latency affects quantum operation timing",
        "Multiple classical signals can control single quantum gate"
      ]
    },
    {
      title: "Quantum Gate Execution",
      description: "Quantum gates modify qubit states when triggered by classical control signals.",
      details: [
        "Gate applies unitary transformation to target qubit",
        "Quantum superposition and entanglement may be created",
        "Operation affects overall quantum system state"
      ]
    },
    {
      title: "Quantum Measurement",
      description: "Quantum measurements collapse superposition states and generate classical results.",
      details: [
        "Measurement projects qubit to |0⟩ or |1⟩ state",
        "Result is probabilistic based on quantum amplitudes",
        "Classical bit value is generated from measurement"
      ]
    },
    {
      title: "Quantum-to-Classical Feedback",
      description: "Quantum measurement results feed back into classical logic for further processing.",
      details: [
        "Measurement result becomes classical bit value",
        "Classical logic can make decisions based on quantum results",
        "Feedback creates hybrid control loops"
      ]
    }
  ];

  const currentStepIndex = Math.floor(currentStep / 20) % educationalSteps.length;
  const currentStepInfo = educationalSteps[currentStepIndex];

  return (
    <div className="space-y-4">
      {/* Educational Mode Toggle */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Educational Mode
            <Badge variant={isActive ? "default" : "outline"} className="text-xs">
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-quantum-particle">
              Get step-by-step explanations of hybrid classical-quantum operations
            </p>
            <Button
              onClick={() => onToggle(!isActive)}
              variant={isActive ? "default" : "outline"}
              className="neon-border"
            >
              {isActive ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Explanation */}
      {isActive && (
        <Card className="quantum-panel neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              What's Happening Now
              <Badge variant="outline" className="text-xs font-mono">
                Step {currentStep}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-quantum-energy/10 border border-quantum-energy/30 rounded-lg">
              <h3 className="font-semibold text-quantum-energy mb-2">
                {content.currentExplanation}
              </h3>
              <p className="text-sm text-quantum-text">
                {content.stepDescription}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-quantum-neon">Details:</h4>
              <ul className="space-y-1">
                {content.whatIsHappening.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-quantum-text">
                    <ArrowRight className="w-3 h-3 mt-0.5 text-quantum-particle flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Steps Guide */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Learning Guide: Hybrid Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {educationalSteps.map((step, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all ${
                  index === currentStepIndex && isActive
                    ? 'bg-quantum-glow/10 border-quantum-glow/30'
                    : 'bg-card/30 border-quantum-matrix'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={index === currentStepIndex && isActive ? "default" : "outline"}
                    className="text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <h4 className="font-semibold text-sm text-quantum-neon">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-quantum-text mb-2">
                  {step.description}
                </p>
                {(index === currentStepIndex && isActive) && (
                  <ul className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-xs text-quantum-particle">
                        <ArrowRight className="w-2 h-2 mt-1 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono text-quantum-glow">
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 mt-0.5 text-quantum-energy flex-shrink-0" />
              <span className="text-quantum-text">
                Watch the glowing connections to see live signal flow
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 mt-0.5 text-quantum-energy flex-shrink-0" />
              <span className="text-quantum-text">
                Use Step mode to examine each operation in detail
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 mt-0.5 text-quantum-energy flex-shrink-0" />
              <span className="text-quantum-text">
                Click on connections to highlight specific signal paths
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
