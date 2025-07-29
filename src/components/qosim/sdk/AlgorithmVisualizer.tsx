
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface AlgorithmVisualizerProps {
  algorithm: any;
}

export function AlgorithmVisualizer({ algorithm }: AlgorithmVisualizerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Algorithm Visualizer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          {algorithm ? (
            <div>
              <div className="text-lg font-medium mb-2">{algorithm.name}</div>
              <div>Step-by-step visualization will appear here</div>
            </div>
          ) : (
            <div>Select an algorithm to visualize its execution</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
