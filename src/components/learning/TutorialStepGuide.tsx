import React from 'react';
import { CheckCircle, Circle, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  instruction: string;
  expectedGates: string[];
  conceptHighlight?: string;
  isCompleted: boolean;
}

interface TutorialStepGuideProps {
  currentStep: TutorialStep | null;
  onReset: () => void;
}

export function TutorialStepGuide({ currentStep, onReset }: TutorialStepGuideProps) {
  if (!currentStep) {
    return (
      <Card className="quantum-panel neon-border">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-quantum-glow mx-auto mb-4" />
          <h3 className="text-lg font-mono font-semibold text-quantum-glow mb-2">
            Tutorial Complete!
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            You've mastered the basics of quantum circuit building.
          </p>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-quantum-matrix text-quantum-glow border border-quantum-neon rounded-lg hover:bg-quantum-neon hover:text-black transition-all duration-300 font-mono text-sm"
          >
            Start Over
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-right">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <div className="relative">
            {currentStep.isCompleted ? (
              <CheckCircle className="w-5 h-5 text-quantum-glow" />
            ) : (
              <Circle className="w-5 h-5 text-quantum-neon" />
            )}
          </div>
          {currentStep.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-muted-foreground text-sm mb-3">
            {currentStep.description}
          </p>
          
          <div className="bg-quantum-matrix rounded-lg p-3 border border-quantum-neon/30">
            <div className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-quantum-glow mt-0.5 shrink-0" />
              <p className="text-sm font-mono text-foreground">
                {currentStep.instruction}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-quantum-neon mb-2">Expected Gates:</h4>
          <div className="flex gap-2 flex-wrap">
            {currentStep.expectedGates.map((gate, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="font-mono text-xs border-quantum-neon text-quantum-neon"
              >
                {gate}
              </Badge>
            ))}
          </div>
        </div>

        {currentStep.conceptHighlight && (
          <div className="bg-quantum-glow/10 border border-quantum-glow/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-quantum-glow mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-quantum-glow mb-1">Key Concept</h4>
                <p className="text-xs text-quantum-glow/80">
                  {currentStep.conceptHighlight}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep.isCompleted && (
          <div className="bg-quantum-glow/10 border border-quantum-glow rounded-lg p-3 text-center animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-quantum-glow mx-auto mb-2" />
            <p className="text-sm font-mono text-quantum-glow">Step completed! ✨</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}