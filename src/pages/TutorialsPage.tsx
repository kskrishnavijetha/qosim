
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Code, Zap, Trophy, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BeginnerTutorial } from '@/components/tutorials/BeginnerTutorial';
import { IntermediateTutorial } from '@/components/tutorials/IntermediateTutorial';
import { AdvancedTutorial } from '@/components/tutorials/AdvancedTutorial';

interface TutorialProgress {
  beginner: number;
  intermediate: number;
  advanced: number;
}

export default function TutorialsPage() {
  const [progress, setProgress] = useState<TutorialProgress>({
    beginner: 0,
    intermediate: 0,
    advanced: 0
  });

  const updateProgress = (level: keyof TutorialProgress, value: number) => {
    setProgress(prev => ({ ...prev, [level]: value }));
  };

  const overallProgress = Math.round((progress.beginner + progress.intermediate + progress.advanced) / 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/app">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-foreground">Back to App</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Quantum Computing Tutorials
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Learn quantum computing from basics to advanced algorithms with hands-on QOSim examples
          </p>
          
          {/* Overall Progress */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>~3 hours total</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>12 lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>All skill levels</span>
            </div>
          </div>
        </div>

        {/* Tutorial Navigation */}
        <Tabs defaultValue="beginner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginner" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-foreground">Beginner</span>
              <Badge variant="secondary" className="ml-2">{progress.beginner}%</Badge>
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="text-foreground">Intermediate</span>
              <Badge variant="secondary" className="ml-2">{progress.intermediate}%</Badge>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-foreground">Advanced</span>
              <Badge variant="secondary" className="ml-2">{progress.advanced}%</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beginner">
            <BeginnerTutorial 
              onProgressUpdate={(value) => updateProgress('beginner', value)}
            />
          </TabsContent>

          <TabsContent value="intermediate">
            <IntermediateTutorial 
              onProgressUpdate={(value) => updateProgress('intermediate', value)}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedTutorial 
              onProgressUpdate={(value) => updateProgress('advanced', value)}
            />
          </TabsContent>
        </Tabs>

        {/* Completion Badge */}
        {overallProgress === 100 && (
          <div className="text-center mt-8">
            <Card className="inline-block p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Congratulations!</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">You've completed all quantum computing tutorials!</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
