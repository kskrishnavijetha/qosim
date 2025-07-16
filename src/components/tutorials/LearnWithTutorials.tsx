
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Code, Zap, Trophy, Clock, Users, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LearnWithTutorials() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const tutorials = [
    {
      id: 'quantum-basics',
      title: 'Quantum Computing Basics',
      description: 'Learn the fundamental concepts of quantum computing',
      duration: '30 min',
      level: 'Beginner',
      lessons: 4,
      color: 'bg-blue-500'
    },
    {
      id: 'quantum-gates',
      title: 'Quantum Gates & Circuits',
      description: 'Understand quantum gates and how to build circuits',
      duration: '45 min',
      level: 'Beginner',
      lessons: 6,
      color: 'bg-green-500'
    },
    {
      id: 'superposition',
      title: 'Superposition & Entanglement',
      description: 'Explore quantum superposition and entanglement phenomena',
      duration: '60 min',
      level: 'Intermediate',
      lessons: 5,
      color: 'bg-purple-500'
    },
    {
      id: 'algorithms',
      title: 'Quantum Algorithms',
      description: 'Learn famous quantum algorithms like Grover and Shor',
      duration: '90 min',
      level: 'Advanced',
      lessons: 8,
      color: 'bg-orange-500'
    }
  ];

  const toggleLesson = (tutorialId: string) => {
    if (completedLessons.includes(tutorialId)) {
      setCompletedLessons(prev => prev.filter(id => id !== tutorialId));
    } else {
      setCompletedLessons(prev => [...prev, tutorialId]);
    }
  };

  const totalLessons = tutorials.reduce((acc, tutorial) => acc + tutorial.lessons, 0);
  const completedCount = completedLessons.length;
  const overallProgress = Math.round((completedCount / tutorials.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-foreground">Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Learn with Tutorials
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Master quantum computing with our interactive step-by-step tutorials
          </p>
          
          {/* Overall Progress */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Learning Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{totalLessons} total lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Earn certificates</span>
            </div>
          </div>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tutorials.map((tutorial) => {
            const isCompleted = completedLessons.includes(tutorial.id);
            
            return (
              <Card key={tutorial.id} className="hover:shadow-lg transition-all duration-300 border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${tutorial.color}`} />
                        <Badge variant="secondary" className="text-xs">
                          {tutorial.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-foreground mb-2">{tutorial.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {tutorial.description}
                      </CardDescription>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{tutorial.lessons} lessons</span>
                    <span>{tutorial.duration}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      variant={isCompleted ? "secondary" : "default"}
                      onClick={() => toggleLesson(tutorial.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isCompleted ? 'Review' : 'Start Learning'}
                    </Button>
                    
                    <Link to="/tutorials" className="flex-shrink-0">
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Learning Path */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended Learning Path
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Follow this path for the best learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tutorials.map((tutorial, index) => (
                <div key={tutorial.id} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{tutorial.title}</h4>
                    <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tutorial.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Achievement */}
        {completedCount === tutorials.length && (
          <div className="text-center">
            <Card className="inline-block p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Congratulations!
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You've completed all tutorial modules!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
