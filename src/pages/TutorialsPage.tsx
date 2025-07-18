
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, BookOpen, Code, Zap, Trophy, Clock, Users, Play, FileText, Download, ExternalLink } from 'lucide-react';
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
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-foreground">Back to Home</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              QOSim Learning Path
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Master quantum computing from basics to advanced algorithms with hands-on QOSim tutorials
          </p>
          
          {/* Learning Path Overview */}
          <div className="bg-gradient-to-br from-quantum-void/20 to-quantum-matrix/20 border border-quantum-glow/30 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-quantum-glow">What You'll Build</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3">
                <h3 className="font-semibold text-quantum-glow flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Beginner Level
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Your first quantum circuit</li>
                  <li>• Understanding qubits & superposition</li>
                  <li>• Basic quantum gates (H, X, Z)</li>
                  <li>• Measurement & probability</li>
                  <li>• Bell state creation</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-quantum-neon flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Intermediate Level
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Quantum entanglement circuits</li>
                  <li>• Multi-qubit operations</li>
                  <li>• Quantum teleportation protocol</li>
                  <li>• Conditional operations</li>
                  <li>• Export to Qiskit/QASM</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-quantum-plasma flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Advanced Level
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Grover's search algorithm</li>
                  <li>• Quantum Fourier Transform</li>
                  <li>• Error correction codes</li>
                  <li>• Custom quantum algorithms</li>
                  <li>• Real quantum hardware deployment</li>
                </ul>
              </div>
            </div>
          </div>
          
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
              <span>~4 hours total</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>15 lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>All skill levels</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black">
              <Link to="/app">
                <Play className="h-4 w-4 mr-2" />
                Start Learning in QOSim
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/qosim-tutorials.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download PDF Guide
              </a>
            </Button>
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

        {/* Learning Resources */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-quantum-glow/20 hover:border-quantum-glow/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <FileText className="h-5 w-5" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comprehensive guides on quantum computing concepts and QOSim features.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Docs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-quantum-neon/20 hover:border-quantum-neon/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-neon">
                <Code className="h-5 w-5" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ready-to-use quantum circuit templates and algorithm implementations.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Examples
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-quantum-plasma/20 hover:border-quantum-plasma/40 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-plasma">
                <Users className="h-5 w-5" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join the QOSim community to share circuits and get help from experts.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Discord
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Completion Badge */}
        {overallProgress === 100 && (
          <div className="text-center mt-8">
            <Card className="inline-block p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Congratulations!</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">You've mastered quantum computing with QOSim!</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
