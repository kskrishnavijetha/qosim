
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Code } from 'lucide-react';

export function AlgorithmsPanel() {
  const algorithms = [
    { name: "Grover's Search", complexity: "Intermediate", category: "Search" },
    { name: "Bell States", complexity: "Basic", category: "Entanglement" },
    { name: "QFT", complexity: "Advanced", category: "Transform" }
  ];

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Quantum Algorithms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {algorithms.map((algo, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-quantum-matrix rounded">
              <div>
                <div className="font-mono text-sm text-quantum-neon">{algo.name}</div>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">{algo.complexity}</Badge>
                  <Badge variant="secondary" className="text-xs">{algo.category}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline">
                  <Play className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <Code className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
