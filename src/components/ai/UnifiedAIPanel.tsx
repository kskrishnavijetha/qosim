
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, TrendingUp, Bug, MessageSquare } from 'lucide-react';
import { NaturalLanguageProcessor } from './NaturalLanguageProcessor';
import { SmartOptimizer } from './SmartOptimizer';
import { IntelligentDebugger } from './IntelligentDebugger';

interface UnifiedAIPanelProps {
  circuit: any[];
  onCircuitGenerated: (gates: any[]) => void;
  onAlgorithmGenerated: (code: string) => void;
  onCircuitOptimized: (gates: any[]) => void;
  onCircuitFixed: (gates: any[]) => void;
  onShowStateVisualization: (step: number) => void;
  className?: string;
}

export function UnifiedAIPanel({
  circuit,
  onCircuitGenerated,
  onAlgorithmGenerated,
  onCircuitOptimized,
  onCircuitFixed,
  onShowStateVisualization,
  className
}: UnifiedAIPanelProps) {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <Card className={`quantum-panel neon-border ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Brain className="w-6 h-6" />
          AI-Powered Quantum Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 quantum-panel mb-4">
            <TabsTrigger value="generate" className="text-xs">
              <MessageSquare className="w-4 h-4 mr-1" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="optimize" className="text-xs">
              <TrendingUp className="w-4 h-4 mr-1" />
              Optimize
            </TabsTrigger>
            <TabsTrigger value="debug" className="text-xs">
              <Bug className="w-4 h-4 mr-1" />
              Debug
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">
              <Sparkles className="w-4 h-4 mr-1" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4 mt-0">
            <NaturalLanguageProcessor
              onCircuitGenerated={onCircuitGenerated}
              onAlgorithmGenerated={onAlgorithmGenerated}
            />
          </TabsContent>
          
          <TabsContent value="optimize" className="space-y-4 mt-0">
            <SmartOptimizer
              circuit={circuit}
              onOptimizedCircuit={onCircuitOptimized}
            />
          </TabsContent>
          
          <TabsContent value="debug" className="space-y-4 mt-0">
            <IntelligentDebugger
              circuit={circuit}
              onCircuitFixed={onCircuitFixed}
              onShowStateVisualization={onShowStateVisualization}
            />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4 mt-0">
            <div className="text-center py-8 space-y-4">
              <Sparkles className="w-12 h-12 mx-auto text-quantum-neon opacity-50" />
              <div className="text-quantum-particle">
                <h3 className="font-semibold mb-2">Quantum Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced analytics and learning recommendations coming soon!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
