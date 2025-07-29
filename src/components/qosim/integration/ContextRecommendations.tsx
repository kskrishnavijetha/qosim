
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface ContextRecommendationsProps {
  suggestions: any[];
  sharedData: any;
}

export function ContextRecommendations({ suggestions, sharedData }: ContextRecommendationsProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Context-aware recommendations for your quantum circuits
      </div>

      {suggestions.length > 0 ? (
        suggestions.map((suggestion, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">{suggestion.type}</div>
                <div className="text-muted-foreground text-xs">
                  {suggestion.description}
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-4">
          <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div>No suggestions available</div>
          <div className="text-xs">Build a circuit to get AI recommendations</div>
        </div>
      )}
    </div>
  );
}
