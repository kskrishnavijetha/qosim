import React from 'react';
import { BookOpen, Star, Trophy, Zap, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  category: string;
  gates: any[];
  learningObjectives: string[];
  keyconcepts: string[];
}

interface CircuitTemplatesProps {
  templates: CircuitTemplate[];
  completedTemplates: string[];
  onSelectTemplate: (templateId: string) => void;
  onLoadTemplate: (template: CircuitTemplate) => void;
}

export function CircuitTemplates({ 
  templates, 
  completedTemplates, 
  onSelectTemplate, 
  onLoadTemplate 
}: CircuitTemplatesProps) {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Star className="w-4 h-4" />;
      case 'intermediate': return <Zap className="w-4 h-4" />;
      case 'expert': return <Trophy className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-quantum-glow text-black';
      case 'intermediate': return 'bg-quantum-neon text-black';
      case 'expert': return 'bg-quantum-plasma text-black';
      default: return 'bg-secondary';
    }
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.difficulty]) {
      acc[template.difficulty] = [];
    }
    acc[template.difficulty].push(template);
    return acc;
  }, {} as Record<string, CircuitTemplate[]>);

  const renderTemplateCard = (template: CircuitTemplate) => {
    const isCompleted = completedTemplates.includes(template.id);
    
    return (
      <Card 
        key={template.id} 
        className={cn(
          "quantum-panel neon-border transition-all duration-300 hover:quantum-glow hover:scale-105",
          isCompleted && "bg-quantum-glow/5 border-quantum-glow"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-mono text-quantum-glow flex items-center gap-2">
              {getDifficultyIcon(template.difficulty)}
              {template.name}
              {isCompleted && <span className="text-xs">✓</span>}
            </CardTitle>
            <Badge 
              variant="secondary" 
              className={cn("text-xs font-mono", getDifficultyColor(template.difficulty))}
            >
              {template.difficulty}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {template.description}
          </p>
          
          <div>
            <h4 className="text-xs font-semibold text-quantum-neon mb-2">Key Concepts:</h4>
            <div className="flex gap-1 flex-wrap">
              {template.keyconcepts.map((concept, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs border-quantum-particle text-quantum-particle"
                >
                  {concept}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-quantum-neon mb-2">Learning Objectives:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {template.learningObjectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-quantum-glow mt-1">•</span>
                  {objective}
                </li>
              ))}
              {template.learningObjectives.length > 2 && (
                <li className="text-quantum-neon">+{template.learningObjectives.length - 2} more...</li>
              )}
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                console.log('Learn button clicked for template:', template.id);
                onSelectTemplate(template.id);
              }}
              className="flex-1 font-mono text-xs border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-black"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Learn
            </Button>
            <Button
              size="sm"
              onClick={() => {
                console.log('Load button clicked for template:', template.name);
                onLoadTemplate(template);
              }}
              className="flex-1 font-mono text-xs bg-quantum-glow text-black hover:bg-quantum-glow/80"
            >
              <Play className="w-3 h-3 mr-1" />
              Load
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-quantum-matrix">
            <TabsTrigger value="beginner" className="font-mono text-xs data-[state=active]:bg-quantum-glow data-[state=active]:text-black">
              Beginner
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="font-mono text-xs data-[state=active]:bg-quantum-neon data-[state=active]:text-black">
              Intermediate
            </TabsTrigger>
            <TabsTrigger value="expert" className="font-mono text-xs data-[state=active]:bg-quantum-plasma data-[state=active]:text-black">
              Expert
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(groupedTemplates).map(([difficulty, difficultyTemplates]) => (
            <TabsContent key={difficulty} value={difficulty} className="mt-4">
              <div className="grid gap-4">
                {difficultyTemplates.map(renderTemplateCard)}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}