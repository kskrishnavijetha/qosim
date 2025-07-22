import { useState, useCallback } from 'react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface LearningModeState {
  activeLesson: string | null;
  completedLessons: string[];
}

export function useLearningMode() {
  const [learningState, setLearningState] = useState<LearningModeState>({
    activeLesson: null,
    completedLessons: []
  });

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

  return {
    learningState,
    startLesson,
    completeLesson,
    resetLearning
  };
}
