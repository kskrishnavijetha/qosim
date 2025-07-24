
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Video } from 'lucide-react';

export function LearningPanel() {
  const lessons = [
    { name: "Quantum Basics", progress: 100, type: "Tutorial" },
    { name: "Quantum Gates", progress: 75, type: "Interactive" },
    { name: "Entanglement", progress: 30, type: "Video" }
  ];

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Learning Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <div key={index} className="p-2 bg-quantum-matrix rounded">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm text-quantum-neon">{lesson.name}</div>
                  <Badge variant="secondary" className="text-xs mt-1">{lesson.type}</Badge>
                </div>
                <div className="text-xs text-quantum-particle">{lesson.progress}%</div>
              </div>
              <div className="w-full bg-quantum-void rounded-full h-1 mt-2">
                <div 
                  className="bg-quantum-energy h-1 rounded-full transition-all"
                  style={{ width: `${lesson.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
