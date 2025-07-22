
import { useState, useCallback } from 'react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface LearningModeState {
  activeLesson: string | null;
  completedLessons: string[];
}

interface Template {
  id: string;
  name: string;
  gates: Gate[];
}

export function useLearningMode() {
  const [learningState, setLearningState] = useState<LearningModeState>({
    activeLesson: null,
    completedLessons: []
  });
  
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Mock templates data
  const templates: Template[] = [
    {
      id: 'basic-gates',
      name: 'Basic Gates Tutorial',
      gates: []
    },
    {
      id: 'entanglement',
      name: 'Entanglement Tutorial', 
      gates: []
    }
  ];

  const progress = {
    completedTemplates: learningState.completedLessons,
    currentProgress: learningState.completedLessons.length / templates.length
  };

  const startLesson = useCallback((lessonId: string) => {
    setLearningState(prevState => ({
      ...prevState,
      activeLesson: lessonId
    }));
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setLearningState(prevState => ({
      ...prevState,
      activeLesson: null,
      completedLessons: [...prevState.completedLessons, lessonId]
    }));
  }, []);

  const resetLearning = useCallback(() => {
    setLearningState({
      activeLesson: null,
      completedLessons: []
    });
  }, []);

  const toggleLearningMode = useCallback(() => {
    setIsLearningMode(prev => !prev);
  }, []);

  const selectTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setCurrentTemplate(template || null);
    setCurrentStep(0);
  }, []);

  const checkStepCompletion = useCallback((circuit: Gate[]) => {
    // Mock step completion logic
    console.log('Checking step completion for circuit:', circuit);
  }, []);

  const completeTemplate = useCallback((templateId: string) => {
    completeLesson(templateId);
    setCurrentTemplate(null);
    setCurrentStep(0);
  }, [completeLesson]);

  const resetTutorial = useCallback(() => {
    resetLearning();
    setCurrentTemplate(null);
    setCurrentStep(0);
  }, [resetLearning]);

  return {
    learningState,
    isLearningMode,
    currentTemplate,
    currentStep,
    progress,
    templates,
    startLesson,
    completeLesson,
    resetLearning,
    toggleLearningMode,
    selectTemplate,
    checkStepCompletion,
    completeTemplate,
    resetTutorial
  };
}
