
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  BookOpen, 
  Video,
  FileText,
  Award,
  Star
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  completed: boolean;
  type: 'tutorial' | 'exercise' | 'theory';
  topics: string[];
}

const learningModules: LearningModule[] = [
  {
    id: 'quantum-basics',
    title: 'Quantum Computing Fundamentals',
    description: 'Learn the core concepts of quantum mechanics and quantum computing',
    level: 'Beginner',
    duration: '45 min',
    progress: 100,
    completed: true,
    type: 'theory',
    topics: ['Qubits', 'Superposition', 'Entanglement', 'Measurement']
  },
  {
    id: 'bell-states',
    title: 'Creating Bell States',
    description: 'Hands-on tutorial for creating and understanding Bell states',
    level: 'Beginner',
    duration: '30 min',
    progress: 75,
    completed: false,
    type: 'tutorial',
    topics: ['Hadamard', 'CNOT', 'Entanglement', 'EPR Pairs']
  },
  {
    id: 'grovers-algorithm',
    title: 'Grover\'s Search Algorithm',
    description: 'Interactive implementation of quantum search algorithm',
    level: 'Intermediate',
    duration: '60 min',
    progress: 30,
    completed: false,
    type: 'exercise',
    topics: ['Search', 'Oracle', 'Amplitude Amplification', 'Speedup']
  },
  {
    id: 'quantum-fourier',
    title: 'Quantum Fourier Transform',
    description: 'Deep dive into QFT and its applications',
    level: 'Advanced',
    duration: '90 min',
    progress: 0,
    completed: false,
    type: 'theory',
    topics: ['Fourier Transform', 'Phase Estimation', 'Period Finding']
  },
  {
    id: 'error-correction',
    title: 'Quantum Error Correction',
    description: 'Understanding and implementing quantum error correction codes',
    level: 'Advanced',
    duration: '120 min',
    progress: 0,
    completed: false,
    type: 'tutorial',
    topics: ['Error Correction', 'Stabilizer Codes', 'Syndrome Detection']
  }
];

export function LearningCenter() {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [userProgress, setUserProgress] = useState({
    completedModules: 1,
    totalModules: learningModules.length,
    currentStreak: 5,
    totalPoints: 1250
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <Play className="w-4 h-4" />;
      case 'exercise': return <FileText className="w-4 h-4" />;
      case 'theory': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const startModule = (module: LearningModule) => {
    setSelectedModule(module);
  };

  const overallProgress = (userProgress.completedModules / userProgress.totalModules) * 100;

  return (
    <div className="space-y-6">
      {/* Learning Center Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-3">
            <GraduationCap className="w-6 h-6" />
            Quantum Learning Center
            <Badge variant="outline" className="text-quantum-energy">
              Interactive Education
            </Badge>
          </CardTitle>
          <p className="text-quantum-particle">
            Master quantum computing through guided tutorials, interactive exercises, and comprehensive theory
          </p>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-glow">{userProgress.completedModules}/{userProgress.totalModules}</div>
            <div className="text-sm text-quantum-particle">Modules Completed</div>
          </CardContent>
        </Card>
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-energy">{overallProgress.toFixed(0)}%</div>
            <div className="text-sm text-quantum-particle">Overall Progress</div>
          </CardContent>
        </Card>
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-neon">{userProgress.currentStreak}</div>
            <div className="text-sm text-quantum-particle">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-quantum-matrix">{userProgress.totalPoints}</div>
            <div className="text-sm text-quantum-particle">Learning Points</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="modules" className="quantum-tab">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Modules
          </TabsTrigger>
          <TabsTrigger value="practice" className="quantum-tab">
            <FileText className="w-4 h-4 mr-2" />
            Practice Exercises
          </TabsTrigger>
          <TabsTrigger value="achievements" className="quantum-tab">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="resources" className="quantum-tab">
            <Video className="w-4 h-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="space-y-4">
            {learningModules.map(module => (
              <Card key={module.id} className="quantum-panel neon-border hover:neon-glow transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(module.type)}
                        <h3 className="text-lg font-semibold text-quantum-glow">{module.title}</h3>
                        {module.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      
                      <p className="text-quantum-particle mb-4">{module.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={`text-white ${getLevelColor(module.level)}`}>
                          {module.level}
                        </Badge>
                        <Badge variant="outline">
                          {module.duration}
                        </Badge>
                        <Badge variant="secondary">
                          {module.type}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {module.topics.map(topic => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      
                      {module.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-quantum-particle">Progress</span>
                            <span className="text-quantum-neon">{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6">
                      <Button 
                        onClick={() => startModule(module)}
                        className={module.completed ? 'bg-green-600' : ''}
                      >
                        {module.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review
                          </>
                        ) : module.progress > 0 ? (
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Circuit Building Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-particle mb-4">
                  Test your skills with progressively challenging circuit building exercises
                </p>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Algorithm Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-particle mb-4">
                  Implement famous quantum algorithms from scratch
                </p>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Begin Exercise
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="quantum-panel neon-border text-center">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-quantum-glow mb-2">First Circuit</h3>
                <p className="text-sm text-quantum-particle">Built your first quantum circuit</p>
                <Badge className="mt-2 bg-yellow-500 text-white">Unlocked</Badge>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border text-center opacity-50">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Entanglement Master</h3>
                <p className="text-sm text-gray-500">Create 10 entangled states</p>
                <Badge variant="secondary" className="mt-2">Locked</Badge>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border text-center opacity-50">
              <CardContent className="p-6">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Algorithm Expert</h3>
                <p className="text-sm text-gray-500">Complete all algorithm modules</p>
                <Badge variant="secondary" className="mt-2">Locked</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Video Lectures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-quantum-matrix">
                    <Video className="w-5 h-5 text-quantum-neon" />
                    <span className="text-quantum-particle">Quantum Mechanics Basics</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-quantum-matrix">
                    <Video className="w-5 h-5 text-quantum-neon" />
                    <span className="text-quantum-particle">Gate-based Quantum Computing</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-quantum-matrix">
                    <Video className="w-5 h-5 text-quantum-neon" />
                    <span className="text-quantum-particle">Quantum Algorithm Design</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-quantum-matrix">
                    <FileText className="w-5 h-5 text-quantum-energy" />
                    <span className="text-quantum-particle">QOSim API Reference</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-quantum-matrix">
                    <FileText className="w-5 h-5 text-quantum-energy" />
                    <span className="text-quantum-particle">Quantum Circuit Patterns</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-quantum-matrix">
                    <FileText className="w-5 h-5 text-quantum-energy" />
                    <span className="text-quantum-particle">Best Practices Guide</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Detail Modal */}
      {selectedModule && (
        <Card className="fixed inset-4 z-50 bg-quantum-void border-quantum-neon overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-quantum-glow">{selectedModule.title}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedModule(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-quantum-particle">{selectedModule.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-quantum-neon font-mono">{selectedModule.level}</div>
                  <div className="text-xs text-quantum-particle">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-energy font-mono">{selectedModule.duration}</div>
                  <div className="text-xs text-quantum-particle">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-glow font-mono">{selectedModule.progress}%</div>
                  <div className="text-xs text-quantum-particle">Progress</div>
                </div>
              </div>
              
              <div className="bg-quantum-matrix p-6 rounded-lg">
                <h4 className="text-lg text-quantum-glow mb-4">Learning Objectives</h4>
                <ul className="space-y-2 text-quantum-particle">
                  {selectedModule.topics.map(topic => (
                    <li key={topic} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Understand {topic}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button className="w-full" size="lg">
                <Play className="w-5 h-5 mr-2" />
                {selectedModule.completed ? 'Review Module' : 'Start Learning'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
