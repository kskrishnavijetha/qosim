
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search } from 'lucide-react';

interface AlgorithmLibraryProps {
  onAlgorithmSelect: (algorithm: any) => void;
  selectedAlgorithm: any;
}

export function AlgorithmLibrary({ onAlgorithmSelect, selectedAlgorithm }: AlgorithmLibraryProps) {
  const algorithms = [
    { id: 'grover', name: "Grover's Search", category: 'Search', difficulty: 'Intermediate' },
    { id: 'shor', name: "Shor's Algorithm", category: 'Factoring', difficulty: 'Expert' },
    { id: 'qft', name: 'Quantum Fourier Transform', category: 'Transform', difficulty: 'Advanced' },
    { id: 'vqe', name: 'Variational Quantum Eigensolver', category: 'Optimization', difficulty: 'Expert' },
    { id: 'bell', name: 'Bell State Creation', category: 'Basics', difficulty: 'Beginner' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Algorithm Library</h3>
        </div>
        <Button variant="outline" size="sm">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {algorithms.map((algorithm) => (
          <Card 
            key={algorithm.id}
            className={`cursor-pointer transition-colors ${
              selectedAlgorithm?.id === algorithm.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onAlgorithmSelect(algorithm)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{algorithm.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {algorithm.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Category: {algorithm.category}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
