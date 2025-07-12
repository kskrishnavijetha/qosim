import React from 'react';
import { GraduationCap, Trophy } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LearningModeToggleProps {
  isLearningMode: boolean;
  onToggle: () => void;
  progress: {
    level: 'beginner' | 'intermediate' | 'expert';
    totalScore: number;
    completedTemplates: string[];
  };
}

export function LearningModeToggle({ isLearningMode, onToggle, progress }: LearningModeToggleProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-quantum-glow text-black';
      case 'intermediate': return 'bg-quantum-neon text-black';
      case 'expert': return 'bg-quantum-plasma text-black';
      default: return 'bg-secondary';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'expert': return <Trophy className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  return (
    <Card className={cn(
      "quantum-panel neon-border transition-all duration-500",
      isLearningMode && "quantum-glow animate-pulse"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <GraduationCap className={cn(
                "w-6 h-6 transition-all duration-300",
                isLearningMode ? "text-quantum-glow quantum-float" : "text-muted-foreground"
              )} />
              {isLearningMode && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-quantum-glow rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="font-mono font-semibold text-sm">Learning Mode</h3>
              <p className="text-xs text-muted-foreground">
                {isLearningMode ? 'Guided tutorials active' : 'Get step-by-step guidance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs font-mono", getLevelColor(progress.level))}
                >
                  {getLevelIcon(progress.level)}
                  {progress.level}
                </Badge>
              </div>
              <div className="text-xs text-quantum-neon font-mono">
                Score: {progress.totalScore}
              </div>
            </div>

            <Switch
              checked={isLearningMode}
              onCheckedChange={() => {
                console.log('🎓 Learning mode toggle clicked! Current state:', isLearningMode);
                onToggle();
              }}
              className="data-[state=checked]:bg-quantum-glow"
            />
          </div>
        </div>

        {isLearningMode && (
          <div className="mt-3 pt-3 border-t border-quantum-neon/20">
            <div className="text-xs text-quantum-glow font-mono">
              ✨ Tutorials available • Templates ready • Progress tracked
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}