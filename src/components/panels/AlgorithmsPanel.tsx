
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, ChevronRight } from 'lucide-react';

export function AlgorithmsPanel() {
  return (
    <div className="p-6 space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <Cpu className="w-6 h-6" />
            Quantum Algorithms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-quantum-neon">
            Explore and implement various quantum algorithms including Grover's, QFT, and more.
          </p>
          <Button>
            Browse Algorithms <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
