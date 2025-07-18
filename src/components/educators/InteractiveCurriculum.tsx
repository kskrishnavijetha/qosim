
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Users, Clock, CheckCircle, Lock, Star } from "lucide-react";

const curriculumData = {
  fundamentals: [
    {
      id: 1,
      title: "Introduction to Quantum Computing",
      description: "Basic concepts of qubits, superposition, and quantum gates",
      duration: "45 min",
      difficulty: "Beginner",
      students: 24,
      completion: 85,
      type: "Interactive Lesson"
    },
    {
      id: 2,
      title: "Quantum Gates and Circuits",
      description: "Learn about basic quantum gates and how to build circuits",
      duration: "60 min",
      difficulty: "Beginner",
      students: 18,
      completion: 72,
      type: "Tutorial"
    },
    {
      id: 3,
      title: "Superposition and Measurement",
      description: "Understanding quantum superposition and measurement collapse",
      duration: "30 min",
      difficulty: "Beginner",
      students: 22,
      completion: 90,
      type: "Assignment"
    }
  ],
  intermediate: [
    {
      id: 4,
      title: "Quantum Entanglement",
      description: "Explore the concept of quantum entanglement and Bell states",
      duration: "50 min",
      difficulty: "Intermediate",
      students: 15,
      completion: 68,
      type: "Interactive Lesson"
    },
    {
      id: 5,
      title: "Quantum Algorithms: Deutsch-Jozsa",
      description: "Implementation and analysis of the Deutsch-Jozsa algorithm",
      duration: "75 min",
      difficulty: "Intermediate",
      students: 12,
      completion: 45,
      type: "Tutorial"
    },
    {
      id: 6,
      title: "Quantum Fourier Transform",
      description: "Understanding and implementing the Quantum Fourier Transform",
      duration: "90 min",
      difficulty: "Intermediate",
      students: 8,
      completion: 30,
      type: "Assignment"
    }
  ],
  advanced: [
    {
      id: 7,
      title: "Grover's Search Algorithm",
      description: "Advanced quantum search algorithm implementation",
      duration: "120 min",
      difficulty: "Advanced",
      students: 6,
      completion: 25,
      type: "Interactive Lesson"
    },
    {
      id: 8,
      title: "Quantum Error Correction",
      description: "Introduction to quantum error correction codes",
      duration: "90 min",
      difficulty: "Advanced",
      students: 4,
      completion: 15,
      type: "Tutorial"
    },
    {
      id: 9,
      title: "Variational Quantum Algorithms",
      description: "VQE and QAOA algorithm implementations",
      duration: "150 min",
      difficulty: "Advanced",
      students: 3,
      completion: 10,
      type: "Assignment"
    }
  ]
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500/20 text-green-400';
    case 'Intermediate':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'Advanced':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Interactive Lesson':
      return <Play className="w-4 h-4" />;
    case 'Tutorial':
      return <BookOpen className="w-4 h-4" />;
    case 'Assignment':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export function InteractiveCurriculum() {
  const [activeTab, setActiveTab] = useState('fundamentals');

  const renderLessonCard = (lesson: any) => (
    <Card key={lesson.id} className="bg-quantum-matrix border-quantum-circuit hover:border-quantum-glow/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{lesson.title}</CardTitle>
            <p className="text-quantum-silver text-sm">{lesson.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge className={getDifficultyColor(lesson.difficulty)}>
              {lesson.difficulty}
            </Badge>
            <Badge variant="outline" className="border-quantum-circuit text-quantum-glow">
              {getTypeIcon(lesson.type)}
              <span className="ml-1">{lesson.type}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-quantum-silver">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{lesson.students} students</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-quantum-silver">Completion Rate</span>
            <span className="text-quantum-glow">{lesson.completion}%</span>
          </div>
          <Progress value={lesson.completion} className="h-2" />
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
            Assign to Class
          </Button>
          <Button size="sm" variant="outline" className="border-quantum-circuit text-quantum-glow">
            Preview
          </Button>
          <Button size="sm" variant="outline" className="border-quantum-circuit text-quantum-glow">
            <Star className="w-4 h-4 mr-1" />
            Customize
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Interactive Curriculum</h2>
          <p className="text-quantum-silver">Pre-built lessons, tutorials, and assignments covering quantum fundamentals to advanced topics</p>
        </div>
        <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void">
          Create Custom Lesson
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Available Lessons</p>
                <p className="text-2xl font-bold text-white">27</p>
              </div>
              <BookOpen className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Avg. Completion</p>
                <p className="text-2xl font-bold text-white">78%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-quantum-matrix border-quantum-circuit">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-quantum-silver text-sm">Total Students</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <Users className="w-8 h-8 text-quantum-glow" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-quantum-matrix">
          <TabsTrigger value="fundamentals" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Fundamentals
          </TabsTrigger>
          <TabsTrigger value="intermediate" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Intermediate
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-quantum-silver data-[state=active]:text-quantum-glow">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals" className="mt-6">
          <div className="grid gap-6">
            {curriculumData.fundamentals.map(renderLessonCard)}
          </div>
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          <div className="grid gap-6">
            {curriculumData.intermediate.map(renderLessonCard)}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid gap-6">
            {curriculumData.advanced.map(renderLessonCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
