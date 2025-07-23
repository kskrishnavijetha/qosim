
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Download, Star, Clock, Users, Zap, Cpu } from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: number;
  runtime: string;
  rating: number;
  downloads: number;
  author: string;
  tags: string[];
}

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onRun: () => void;
  onModify: () => void;
  onExport: () => void;
}

export function AlgorithmCard({ algorithm, onRun, onModify, onExport }: AlgorithmCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-quantum-neon/20 text-quantum-neon';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Entanglement': return <Zap className="w-4 h-4" />;
      case 'Search': return <Users className="w-4 h-4" />;
      case 'Transform': return <Cpu className="w-4 h-4" />;
      case 'Optimization': return <Star className="w-4 h-4" />;
      case 'Cryptography': return <Play className="w-4 h-4" />;
      case 'Error Correction': return <Edit className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <Card className="quantum-panel neon-border hover:shadow-lg hover:shadow-quantum-glow/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(algorithm.category)}
            <CardTitle className="text-lg text-quantum-glow">{algorithm.name}</CardTitle>
          </div>
          <Badge className={`${getDifficultyColor(algorithm.difficulty)} text-xs`}>
            {algorithm.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-quantum-neon mt-2">{algorithm.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Algorithm Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-quantum-particle" />
            <span className="text-quantum-neon">{algorithm.qubits} qubits</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-quantum-particle" />
            <span className="text-quantum-neon">{algorithm.gates} gates</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-quantum-particle" />
            <span className="text-quantum-neon">{algorithm.runtime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-quantum-particle" />
            <span className="text-quantum-neon">{algorithm.rating}/5</span>
          </div>
        </div>

        {/* Downloads and Author */}
        <div className="flex items-center justify-between text-xs text-quantum-particle">
          <div className="flex items-center gap-2">
            <Download className="w-3 h-3" />
            <span>{algorithm.downloads.toLocaleString()} downloads</span>
          </div>
          <span>by {algorithm.author}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {algorithm.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {algorithm.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{algorithm.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={onRun} className="flex-1 neon-border" variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button onClick={onModify} variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Modify
          </Button>
          <Button onClick={onExport} variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
