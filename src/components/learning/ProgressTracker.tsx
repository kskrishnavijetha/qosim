import React from 'react';
import { Trophy, Star, Zap, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LearningProgress {
  level: 'beginner' | 'intermediate' | 'expert';
  completedTemplates: string[];
  completedSteps: string[];
  totalScore: number;
}

interface ProgressTrackerProps {
  progress: LearningProgress;
  totalTemplates: number;
}

export function ProgressTracker({ progress, totalTemplates }: ProgressTrackerProps) {
  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'beginner':
        return {
          icon: <Star className="w-5 h-5" />,
          color: 'text-quantum-glow',
          bgColor: 'bg-quantum-glow/10',
          borderColor: 'border-quantum-glow/30',
          next: 'intermediate',
          required: 2
        };
      case 'intermediate':
        return {
          icon: <Zap className="w-5 h-5" />,
          color: 'text-quantum-neon',
          bgColor: 'bg-quantum-neon/10',
          borderColor: 'border-quantum-neon/30',
          next: 'expert',
          required: 5
        };
      case 'expert':
        return {
          icon: <Trophy className="w-5 h-5" />,
          color: 'text-quantum-plasma',
          bgColor: 'bg-quantum-plasma/10',
          borderColor: 'border-quantum-plasma/30',
          next: null,
          required: 0
        };
      default:
        return {
          icon: <Star className="w-5 h-5" />,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/30',
          next: 'intermediate',
          required: 2
        };
    }
  };

  const levelInfo = getLevelInfo(progress.level);
  const completionPercentage = (progress.completedTemplates.length / totalTemplates) * 100;
  const nextLevelProgress = levelInfo.next ? 
    Math.min((progress.completedTemplates.length / levelInfo.required) * 100, 100) : 100;

  const achievements = [
    {
      id: 'first-circuit',
      name: 'First Circuit',
      description: 'Built your first quantum circuit',
      achieved: progress.completedSteps.length > 0,
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'template-master',
      name: 'Template Master',
      description: 'Completed 3 circuit templates',
      achieved: progress.completedTemplates.length >= 3,
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: 'high-scorer',
      name: 'High Scorer',
      description: 'Reached 100 points',
      achieved: progress.totalScore >= 100,
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          {levelInfo.icon}
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Level */}
        <div className={cn("rounded-lg p-4 border", levelInfo.bgColor, levelInfo.borderColor)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {levelInfo.icon}
              <span className={cn("font-mono font-semibold text-sm", levelInfo.color)}>
                {progress.level.charAt(0).toUpperCase() + progress.level.slice(1)}
              </span>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {progress.totalScore} pts
            </Badge>
          </div>
          
          {levelInfo.next && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress to {levelInfo.next}</span>
                <span>{progress.completedTemplates.length}/{levelInfo.required}</span>
              </div>
              <Progress 
                value={nextLevelProgress} 
                className="h-2"
              />
            </div>
          )}
        </div>

        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-quantum-neon font-mono">Templates Completed</span>
            <span className="text-muted-foreground font-mono">
              {progress.completedTemplates.length}/{totalTemplates}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-sm font-semibold text-quantum-neon mb-3">Achievements</h4>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border transition-all duration-300",
                  achievement.achieved 
                    ? "bg-quantum-glow/10 border-quantum-glow/30 text-quantum-glow" 
                    : "bg-muted/5 border-muted/20 text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2",
                  achievement.achieved 
                    ? "border-quantum-glow bg-quantum-glow/20" 
                    : "border-muted"
                )}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-sm font-semibold">
                    {achievement.name}
                  </div>
                  <div className="text-xs">
                    {achievement.description}
                  </div>
                </div>
                {achievement.achieved && (
                  <div className="text-quantum-glow">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-quantum-neon/20">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-quantum-glow">
              {progress.completedSteps.length}
            </div>
            <div className="text-xs text-muted-foreground">Steps Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-quantum-neon">
              {Math.round(completionPercentage)}%
            </div>
            <div className="text-xs text-muted-foreground">Overall Progress</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}