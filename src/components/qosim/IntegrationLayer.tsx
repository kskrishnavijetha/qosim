
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SyncManager } from './integration/SyncManager';
import { AIOptimizer } from './integration/AIOptimizer';
import { ContextRecommendations } from './integration/ContextRecommendations';
import { UnifiedSimulation } from './integration/UnifiedSimulation';
import { RefreshCw, Brain, Lightbulb, Cpu } from 'lucide-react';

interface IntegrationLayerProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
}

export function IntegrationLayer({ sharedData, onDataUpdate }: IntegrationLayerProps) {
  const [syncStatus, setSyncStatus] = useState('active');
  const [aiSuggestions, setAiSuggestions] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration Layer</h2>
          <p className="text-muted-foreground">
            Seamless sync between Circuit Builder and Algorithms SDK
          </p>
        </div>
        <Badge variant={syncStatus === 'active' ? 'default' : 'secondary'}>
          Sync {syncStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Sync Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SyncManager 
              status={syncStatus}
              onStatusChange={setSyncStatus}
              sharedData={sharedData}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Optimizer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIOptimizer 
              onSuggestions={setAiSuggestions}
              sharedData={sharedData}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>Context Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContextRecommendations 
              suggestions={aiSuggestions}
              sharedData={sharedData}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="w-5 h-5" />
              <span>Unified Simulation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UnifiedSimulation 
              sharedData={sharedData}
              onDataUpdate={onDataUpdate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
