
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, Clock, BookOpen, Target, Award, ArrowRight } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  completed: boolean;
  progress: number;
  topics: string[];
}

const tutorials: Tutorial[] = [
  {
    id: 'quantum-basics',
    title: 'Quantum Computing Fundamentals',
    description: 'Learn the basics of quantum computing, qubits, and quantum gates',
    difficulty: 'Beginner',
    duration: '45 min',
    lessons: 8,
    completed: false,
    progress: 0,
    topics: ['Qubits', 'Superposition', 'Entanglement', 'Quantum Gates']
  },
  {
    id: 'bell-states',
    title: 'Creating Bell States',
    description: 'Master entanglement by creating and understanding Bell states',
    difficulty: 'Beginner',
    duration: '30 min',
    lessons: 5,
    completed: false,
    progress: 60,
    topics: ['Entanglement', 'Bell States', 'Measurement']
  },
  {
    id: 'grovers-algorithm',
    title: 'Grover\'s Search Algorithm',
    description: 'Implement and understand quantum search with quadratic speedup',
    difficulty: 'Intermediate',
    duration: '60 min',
    lessons: 10,
    completed: false,
    progress: 20,
    topics: ['Amplitude Amplification', 'Oracle', 'Quantum Search']
  },
  {
    id: 'qft-algorithm',
    title: 'Quantum Fourier Transform',
    description: 'Deep dive into QFT and its applications in quantum algorithms',
    difficulty: 'Advanced',
    duration: '90 min',
    lessons: 12,
    completed: false,
    progress: 0,
    topics: ['Fourier Transform', 'Phase Estimation', 'Shor\'s Algorithm']
  },
  {
    id: 'vqe-tutorial',
    title: 'Variational Quantum Eigensolver',
    description: 'Hybrid quantum-classical algorithms for optimization',
    difficulty: 'Advanced',
    duration: '120 min',
    lessons: 15,
    completed: false,
    progress: 0,
    topics: ['Variational Algorithms', 'Optimization', 'Chemistry']
  }
];

const achievements = [
  { id: 'first-circuit', title: 'First Circuit', description: 'Created your first quantum circuit', earned: true },
  { id: 'bell-master', title: 'Bell Master', description: 'Mastered Bell state creation', earned: true },
  { id: 'search-guru', title: 'Search Guru', description: 'Implemented Grover\'s algorithm', earned: false },
  { id: 'transform-wizard', title: 'Transform Wizard', description: 'Mastered QFT', earned: false },
  { id: 'optimization-expert', title: 'Optimization Expert', description: 'Completed VQE tutorial', earned: false }
];

export function LearningMode() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);

  const overallProgress = tutorials.reduce((sum, t) => sum + t.progress, 0) / tutorials.length;

  return (
    <div className="space-y-6">
      {/* Learning Dashboard */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Learning Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-quantum-neon">Overall Progress</span>
                <span className="text-quantum-particle">{overallProgress.toFixed(0)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-glow">
                {tutorials.filter(t => t.completed).length}
              </div>
              <div className="text-sm text-quantum-neon">Tutorials Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-glow">
                {achievements.filter(a => a.earned).length}
              </div>
              <div className="text-sm text-quantum-neon">Achievements Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tutorials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map(tutorial => (
              <Card key={tutorial.id} className="quantum-panel neon-border hover:shadow-lg hover:shadow-quantum-glow/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-quantum-glow">{tutorial.title}</CardTitle>
                    <Badge className={
                      tutorial.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      tutorial.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-quantum-neon mt-2">{tutorial.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-quantum-particle" />
                      <span className="text-quantum-neon">{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-quantum-particle" />
                      <span className="text-quantum-neon">{tutorial.lessons} lessons</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-quantum-neon">Progress</span>
                      <span className="text-quantum-particle">{tutorial.progress}%</span>
                    </div>
                    <Progress value={tutorial.progress} className="h-2" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {tutorial.topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 neon-border"
                      variant="outline"
                      onClick={() => setSelectedTutorial(tutorial)}
                    >
                      {tutorial.progress > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                    {tutorial.completed && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Create a Bell State',
                description: 'Build a circuit that creates a Bell state',
                difficulty: 'Beginner',
                points: 100,
                completed: true
              },
              {
                title: 'Implement Deutsch Algorithm',
                description: 'Determine if a function is constant or balanced',
                difficulty: 'Intermediate',
                points: 200,
                completed: false
              },
              {
                title: 'Quantum Teleportation',
                description: 'Teleport a quantum state using entanglement',
                difficulty: 'Advanced',
                points: 300,
                completed: false
              }
            ].map((exercise, index) => (
              <Card key={index} className="quantum-panel neon-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-quantum-glow">{exercise.title}</CardTitle>
                    {exercise.completed && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-quantum-neon mt-2">{exercise.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={
                      exercise.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }>
                      {exercise.difficulty}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-quantum-particle" />
                      <span className="text-quantum-neon">{exercise.points} pts</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full neon-border"
                    variant="outline"
                    disabled={exercise.completed}
                  >
                    {exercise.completed ? 'Completed' : 'Start Exercise'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <Card key={achievement.id} className={`quantum-panel neon-border ${
                achievement.earned ? 'bg-quantum-glow/5' : 'opacity-60'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                      <Award className={`w-5 h-5 ${
                        achievement.earned ? 'text-quantum-glow' : 'text-quantum-particle'
                      }`} />
                      {achievement.title}
                    </CardTitle>
                    {achievement.earned && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-quantum-neon mt-2">{achievement.description}</p>
                </CardHeader>
                
                <CardContent>
                  <Badge variant={achievement.earned ? 'default' : 'outline'}>
                    {achievement.earned ? 'Earned' : 'Locked'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
