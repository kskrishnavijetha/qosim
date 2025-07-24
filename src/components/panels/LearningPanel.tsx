
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';

export function LearningPanel() {
  return (
    <div className="p-6 space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Learning Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-quantum-neon">
            Learn quantum computing concepts through interactive tutorials and exercises.
          </p>
          <Button>
            Start Learning <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
