import React from 'react';
import { LearningModeToggle } from '@/components/learning/LearningModeToggle';
import { TutorialStepGuide } from '@/components/learning/TutorialStepGuide';
import { CircuitTemplates } from '@/components/learning/CircuitTemplates';
import { ProgressTracker } from '@/components/learning/ProgressTracker';

interface LearningModeSectionProps {
  isLearningMode: boolean;
  onToggle: () => void;
  progress: any;
  currentStep: any;
  onReset: () => void;
  templates: any[];
  onSelectTemplate: (templateId: string) => void;
  onLoadTemplate: (template: any) => void;
}

export function LearningModeSection({
  isLearningMode,
  onToggle,
  progress,
  currentStep,
  onReset,
  templates,
  onSelectTemplate,
  onLoadTemplate
}: LearningModeSectionProps) {
  return (
    <>
      {/* Learning Mode Toggle */}
      <LearningModeToggle
        isLearningMode={isLearningMode}
        onToggle={onToggle}
        progress={progress}
      />

      {isLearningMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Tutorial Guide */}
          <TutorialStepGuide
            currentStep={currentStep}
            onReset={onReset}
          />

          {/* Progress Tracker */}
          <ProgressTracker
            progress={progress}
            totalTemplates={templates.length}
          />
        </div>
      )}

      {/* Circuit Templates - Always show to make templates accessible */}
      {console.log('🎯 Rendering CircuitTemplates with:', { templates, templateCount: templates.length })}
      <CircuitTemplates
        templates={templates}
        completedTemplates={progress.completedTemplates}
        onSelectTemplate={onSelectTemplate}
        onLoadTemplate={onLoadTemplate}
      />
    </>
  );
}