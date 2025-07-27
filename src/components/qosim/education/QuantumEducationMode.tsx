
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  Award,
  Star,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';

export function QuantumEducationMode() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState({
    totalLessons: 24,
    completedLessons: 8,
    badges: 3,
    currentStreak: 5
  });

  const courses = [
    {
      id: 'basics',
      title: 'Quantum Computing Basics',
      description: 'Introduction to quantum mechanics and computing',
      difficulty: 'Beginner',
      lessons: 8,
      duration: '2 hours',
      completed: 6,
      topics: ['Qubits', 'Superposition', 'Entanglement', 'Measurement']
    },
    {
      id: 'gates',
      title: 'Quantum Gates & Circuits',
      description: 'Learn quantum gates and circuit design',
      difficulty: 'Intermediate',
      lessons: 12,
      duration: '4 hours',
      completed: 2,
      topics: ['Pauli Gates', 'Hadamard', 'CNOT', 'Rotation Gates']
    },
    {
      id: 'algorithms',
      title: 'Quantum Algorithms',
      description: 'Grover, Shor, and other quantum algorithms',
      difficulty: 'Advanced',
      lessons: 16,
      duration: '6 hours',
      completed: 0,
      topics: ['Grover Search', 'Shor Algorithm', 'QFT', 'VQE']
    },
    {
      id: 'hardware',
      title: 'Quantum Hardware',
      description: 'Understanding quantum computers and NISQ devices',
      difficulty: 'Advanced',
      lessons: 10,
      duration: '3 hours',
      completed: 0,
      topics: ['Superconducting', 'Trapped Ion', 'Photonic', 'Error Correction']
    }
  ];

  const achievements = [
    {
      id: 'first-circuit',
      title: 'First Circuit',
      description: 'Created your first quantum circuit',
      earned: true,
      icon: '🎯'
    },
    {
      id: 'bell-state',
      title: 'Entanglement Master',
      description: 'Successfully created a Bell state',
      earned: true,
      icon: '🔗'
    },
    {
      id: 'grover-expert',
      title: 'Search Algorithm Expert',
      description: 'Implemented Grover\'s algorithm',
      earned: true,
      icon: '🔍'
    },
    {
      id: 'quantum-ninja',
      title: 'Quantum Ninja',
      description: 'Completed 50 quantum circuits',
      earned: false,
      icon: '🥷'
    }
  ];

  const quizzes = [
    {
      id: 'superposition',
      title: 'Superposition Quiz',
      questions: 10,
      timeLimit: '15 min',
      difficulty: 'Easy',
      score: 85
    },
    {
      id: 'entanglement',
      title: 'Entanglement Challenge',
      questions: 15,
      timeLimit: '20 min',
      difficulty: 'Medium',
      score: null
    },
    {
      id: 'algorithms',
      title: 'Algorithm Mastery',
      questions: 20,
      timeLimit: '30 min',
      difficulty: 'Hard',
      score: null
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-quantum-neon';
    }
  };

  const renderCourseDetail = (course: any) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setSelectedCourse(null)}
          variant="outline"
          size="sm"
          className="neon-border"
        >
          ← Back to Courses
        </Button>
        <Badge variant="outline" className={`neon-border ${getDifficultyColor(course.difficulty)}`}>
          {course.difficulty}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">{course.title}</CardTitle>
              <p className="text-quantum-particle">{course.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-quantum-neon">Progress</span>
                  <span className="text-sm text-quantum-particle">
                    {course.completed}/{course.lessons} lessons
                  </span>
                </div>
                <Progress 
                  value={(course.completed / course.lessons) * 100} 
                  className="quantum-progress"
                />
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-quantum-neon">Topics Covered</h4>
                <div className="grid grid-cols-2 gap-2">
                  {course.topics.map((topic: string, index: number) => (
                    <Badge key={index} variant="outline" className="neon-border">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Interactive Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: course.lessons }, (_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        index < course.completed ? 'bg-green-500' : 'bg-quantum-void border border-quantum-neon/30'
                      }`}>
                        {index < course.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <div className="text-sm text-quantum-neon">
                          Lesson {index + 1}: {course.topics[index % course.topics.length]}
                        </div>
                        <div className="text-xs text-quantum-particle">
                          15 min • Interactive
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={index < course.completed ? 'outline' : 'default'}
                      className="neon-border"
                    >
                      {index < course.completed ? 'Review' : 'Start'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Course Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-quantum-particle">Duration:</span>
                <span className="text-quantum-neon">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-quantum-particle">Lessons:</span>
                <span className="text-quantum-neon">{course.lessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-quantum-particle">Completed:</span>
                <span className="text-quantum-neon">{course.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-quantum-particle">Difficulty:</span>
                <span className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full neon-border">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" className="w-full neon-border">
                  <Target className="w-4 h-4 mr-2" />
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (selectedCourse) {
    const course = courses.find(c => c.id === selectedCourse);
    if (course) {
      return renderCourseDetail(course);
    }
  }

  return (
    <div className="space-y-6">
      {/* Education Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">
                  {userProgress.completedLessons}
                </div>
                <div className="text-sm text-quantum-particle">Lessons Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">
                  {userProgress.badges}
                </div>
                <div className="text-sm text-quantum-particle">Badges Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">
                  {userProgress.currentStreak}
                </div>
                <div className="text-sm text-quantum-particle">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">
                  {Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)}%
                </div>
                <div className="text-sm text-quantum-particle">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="quantum-panel neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-glow">{course.title}</CardTitle>
                <Badge variant="outline" className={`neon-border ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </Badge>
              </div>
              <p className="text-quantum-particle">{course.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-quantum-particle">
                  {course.lessons} lessons • {course.duration}
                </span>
                <span className="text-quantum-neon">
                  {course.completed}/{course.lessons} completed
                </span>
              </div>
              
              <Progress 
                value={(course.completed / course.lessons) * 100} 
                className="quantum-progress"
              />

              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {course.topics.slice(0, 3).map((topic, index) => (
                    <Badge key={index} variant="outline" className="neon-border text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {course.topics.length > 3 && (
                    <Badge variant="outline" className="neon-border text-xs">
                      +{course.topics.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => setSelectedCourse(course.id)}
                  size="sm"
                  className="neon-border"
                >
                  {course.completed > 0 ? 'Continue' : 'Start'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements & Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded ${
                  achievement.earned ? 'bg-quantum-matrix/50' : 'bg-quantum-void/50'
                }`}>
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className={`font-medium ${achievement.earned ? 'text-quantum-neon' : 'text-quantum-particle'}`}>
                      {achievement.title}
                    </div>
                    <div className="text-xs text-quantum-particle">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.earned && (
                    <Badge variant="outline" className="neon-border text-green-400">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                  <div>
                    <div className="font-medium text-quantum-neon">{quiz.title}</div>
                    <div className="text-xs text-quantum-particle">
                      {quiz.questions} questions • {quiz.timeLimit} • {quiz.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.score && (
                      <Badge variant="outline" className="neon-border">
                        {quiz.score}%
                      </Badge>
                    )}
                    <Button size="sm" className="neon-border">
                      {quiz.score ? 'Retake' : 'Start'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
