import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Trophy, Target, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface EducationQuizProps {
  circuitType: string;
  gates: any[];
  onComplete: (score: number, totalQuestions: number) => void;
}

interface QuizProgress {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  completedQuizzes: string[];
}

export function EducationQuiz({ circuitType, gates, onComplete }: EducationQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [progress, setProgress] = useState<QuizProgress>({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    completedQuizzes: []
  });

  const { toast } = useToast();

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('qosim-quiz-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Generate questions based on circuit type and gates
    const generatedQuestions = generateQuestionsForCircuit(circuitType, gates);
    setQuestions(generatedQuestions);
  }, [circuitType, gates]);

  const saveProgress = (newProgress: QuizProgress) => {
    localStorage.setItem('qosim-quiz-progress', JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  const generateQuestionsForCircuit = (type: string, circuitGates: any[]): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    
    // Question 1: Circuit purpose
    if (type.toLowerCase().includes('bell') || type.toLowerCase().includes('epr')) {
      questions.push({
        id: 'bell-purpose',
        question: 'What is the primary purpose of a Bell state circuit?',
        options: [
          'To create classical superposition',
          'To create quantum entanglement between two qubits',
          'To measure quantum states',
          'To perform quantum error correction'
        ],
        correctAnswer: 1,
        explanation: 'Bell states create maximal entanglement between two qubits, demonstrating quantum correlation where measuring one qubit instantly determines the state of the other.',
        difficulty: 'beginner'
      });
    } else if (type.toLowerCase().includes('ghz')) {
      questions.push({
        id: 'ghz-purpose',
        question: 'What makes a GHZ state special compared to Bell states?',
        options: [
          'It uses fewer gates',
          'It creates entanglement among three or more qubits',
          'It is easier to measure',
          'It has no quantum interference'
        ],
        correctAnswer: 1,
        explanation: 'GHZ states demonstrate multipartite entanglement, where three or more qubits are quantum mechanically correlated in a way that has no classical analogue.',
        difficulty: 'intermediate'
      });
    } else if (type.toLowerCase().includes('superposition')) {
      questions.push({
        id: 'superposition-purpose',
        question: 'What does the Hadamard gate create?',
        options: [
          'Quantum entanglement',
          'Classical randomness',
          'Quantum superposition',
          'Quantum measurement'
        ],
        correctAnswer: 2,
        explanation: 'The Hadamard gate creates quantum superposition, transforming |0⟩ into (|0⟩ + |1⟩)/√2, allowing the qubit to exist in both states simultaneously.',
        difficulty: 'beginner'
      });
    }

    // Question 2: Gate mechanics
    const hasHGate = circuitGates.some(g => g.type === 'H');
    const hasCNOT = circuitGates.some(g => g.type === 'CNOT');
    
    if (hasHGate) {
      questions.push({
        id: 'hadamard-mechanics',
        question: 'When a Hadamard gate is applied to |0⟩, what is the resulting state?',
        options: [
          '|1⟩',
          '(|0⟩ + |1⟩)/√2',
          '(|0⟩ - |1⟩)/√2',
          '|0⟩'
        ],
        correctAnswer: 1,
        explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2. This creates an equal superposition of |0⟩ and |1⟩ states with equal probability amplitudes.',
        difficulty: 'intermediate'
      });
    }

    if (hasCNOT) {
      questions.push({
        id: 'cnot-mechanics',
        question: 'In a CNOT gate, what happens when the control qubit is in state |1⟩?',
        options: [
          'Nothing happens to either qubit',
          'The control qubit is flipped',
          'The target qubit is flipped',
          'Both qubits are flipped'
        ],
        correctAnswer: 2,
        explanation: 'CNOT performs a controlled NOT operation: when the control qubit is |1⟩, it flips the target qubit. When control is |0⟩, nothing happens to the target.',
        difficulty: 'beginner'
      });
    }

    // Question 3: Quantum concepts
    questions.push({
      id: 'measurement-effect',
      question: 'What happens when you measure a qubit in superposition?',
      options: [
        'You get both measurement outcomes simultaneously',
        'The superposition is preserved',
        'The quantum state collapses to a definite classical state',
        'The measurement always fails'
      ],
      correctAnswer: 2,
      explanation: 'Quantum measurement causes wave function collapse, forcing the qubit from superposition into a definite classical state (either |0⟩ or |1⟩) with probabilities determined by the quantum amplitudes.',
      difficulty: 'intermediate'
    });

    // Ensure we have exactly 3 questions
    return questions.slice(0, 3);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setAnswered(true);
    setShowResult(true);
    
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      const newProgress = {
        ...progress,
        correctAnswers: progress.correctAnswers + 1,
        streak: progress.streak + 1,
        bestStreak: Math.max(progress.bestStreak, progress.streak + 1)
      };
      saveProgress(newProgress);
      
      toast({
        title: "Correct! 🎉",
        description: questions[currentQuestionIndex].explanation,
      });
    } else {
      const newProgress = {
        ...progress,
        streak: 0
      };
      saveProgress(newProgress);
      
      toast({
        title: "Incorrect",
        description: questions[currentQuestionIndex].explanation,
        variant: "destructive"
      });
    }
    
    const newProgressTotal = {
      ...progress,
      totalQuestions: progress.totalQuestions + 1
    };
    saveProgress(newProgressTotal);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswered(false);
    } else {
      // Quiz completed
      const finalProgress = {
        ...progress,
        completedQuizzes: [...progress.completedQuizzes, circuitType]
      };
      saveProgress(finalProgress);
      
      onComplete(score, questions.length);
      
      toast({
        title: `Quiz Complete! 🏆`,
        description: `You scored ${score}/${questions.length}. ${score === questions.length ? 'Perfect score!' : 'Keep practicing!'}`,
      });
    }
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Generating quiz questions...</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Education Quiz
          </CardTitle>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1}/{questions.length}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="w-full" />
        
        {/* Progress stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Streak: {progress.streak}
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Accuracy: {progress.totalQuestions > 0 ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100) : 0}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          <Badge variant="outline" className="text-xs">
            {currentQuestion.difficulty}
          </Badge>
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
              className={`w-full p-4 text-left border rounded-lg transition-colors ${
                selectedAnswer === index
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              } ${
                answered && index === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : answered && selectedAnswer === index && index !== currentQuestion.correctAnswer
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {answered && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Result explanation */}
        {showResult && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">Explanation:</h4>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Score: {score}/{questions.length}
          </div>
          
          <div className="space-x-2">
            {!answered ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}