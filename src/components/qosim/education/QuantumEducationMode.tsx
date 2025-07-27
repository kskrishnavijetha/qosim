
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Star,
  Award,
  Target,
  Lightbulb
} from 'lucide-react';

export function QuantumEducationMode() {
  const [selectedCourse, setSelectedCourse] = useState('basics');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState({ basics: 25, intermediate: 10, advanced: 0 });

  const courses = {
    basics: {
      title: 'Quantum Computing Basics',
      level: 'Beginner',
      duration: '2 hours',
      progress: 25,
      lessons: [
        { id: 1, title: 'What is Quantum Computing?', duration: '15 min', completed: true },
        { id: 2, title: 'Qubits and Superposition', duration: '20 min', completed: true },
        { id: 3, title: 'Quantum Gates', duration: '25 min', completed: false },
        { id: 4, title: 'Measurement', duration: '20 min', completed: false }
      ]
    },
    intermediate: {
      title: 'Quantum Algorithms',
      level: 'Intermediate',
      duration: '4 hours',
      progress: 10,
      lessons: [
        { id: 1, title: 'Quantum Entanglement', duration: '30 min', completed: true },
        { id: 2, title: 'Bell States', duration: '25 min', completed: false },
        { id: 3, title: 'Quantum Teleportation', duration: '40 min', completed: false },
        { id: 4, title: 'Grover\'s Algorithm', duration: '45 min', completed: false }
      ]
    },
    advanced: {
      title: 'Quantum Error Correction',
      level: 'Advanced',
      duration: '6 hours',
      progress: 0,
      lessons: [
        { id: 1, title: 'Quantum Noise', duration: '45 min', completed: false },
        { id: 2, title: 'Error Correction Codes', duration: '60 min', completed: false },
        { id: 3, title: 'Fault-Tolerant Computing', duration: '75 min', completed: false }
      ]
    }
  };

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: true },
    { id: 2, title: 'Quantum Explorer', description: 'Try 5 different quantum gates', earned: true },
    { id: 3, title: 'Bell State Master', description: 'Create your first Bell state', earned: false },
    { id: 4, title: 'Algorithm Guru', description: 'Implement Grover\'s algorithm', earned: false }
  ];

  const handleStartLesson = (courseId: string, lessonId: number) => {
    setSelectedCourse(courseId);
    setCurrentLesson(lessonId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quantum Education Mode</h2>
          <p className="text-muted-foreground">Learn quantum computing step by step</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Level 3
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            {achievements.filter(a => a.earned).length} Achievements
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(courses).map(([key, course]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{course.title}</span>
                    <Badge variant="outline">{course.level}</Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    {course.duration}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {course.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <div className="w-4 h-4 border-2 rounded-full" />
                          )}
                          <span className="text-sm">{lesson.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleStartLesson(key, 1)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {course.progress > 0 ? 'Continue' : 'Start Course'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interactive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Circuit Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Drag gates to build circuits</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Launch Interactive Mode
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quantum Sandbox</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-40 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Lightbulb className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <p className="text-sm text-muted-foreground">Experiment freely</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    Open Sandbox
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">What is the result of applying a Hadamard gate to |0⟩?</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      A) |0⟩
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      B) |1⟩
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      C) (|0⟩ + |1⟩)/√2
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      D) (|0⟩ - |1⟩)/√2
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Question 1 of 10</span>
                  <Button>Next Question</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned ? 'border-primary' : 'opacity-60'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className={`w-5 h-5 ${achievement.earned ? 'text-yellow-500' : 'text-gray-400'}`} />
                    {achievement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.earned && (
                    <Badge variant="outline" className="mt-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Earned
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
