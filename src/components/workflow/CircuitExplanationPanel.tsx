
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gate } from '@/hooks/useCircuitState';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { circuitExplanationService, CircuitExplanation } from '@/services/CircuitExplanationService';
import { Bot, BookOpen, Lightbulb, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitExplanationPanelProps {
  gates: Gate[];
  result: QuantumBackendResult;
  numQubits: number;
  isVisible?: boolean;
}

export function CircuitExplanationPanel({
  gates,
  result,
  numQubits,
  isVisible = true
}: CircuitExplanationPanelProps) {
  const [explanation, setExplanation] = useState<CircuitExplanation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasGenerated && gates.length >= 0 && result) {
      generateExplanation();
    }
  }, [isVisible, gates, result, hasGenerated]);

  const generateExplanation = async () => {
    setIsGenerating(true);
    try {
      console.log('🤖 Generating AI circuit explanation...');
      const newExplanation = await circuitExplanationService.generateExplanation(
        gates,
        result,
        numQubits
      );
      setExplanation(newExplanation);
      setHasGenerated(true);
      console.log('✅ Circuit explanation generated:', newExplanation);
    } catch (error) {
      console.error('❌ Failed to generate explanation:', error);
      toast.error('Failed to generate circuit explanation');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Explanation copied to clipboard');
  };

  const regenerateExplanation = () => {
    setHasGenerated(false);
    setExplanation(null);
    generateExplanation();
  };

  if (!isVisible) return null;

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Circuit Explanation
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Human-readable analysis of your quantum circuit</span>
          {explanation && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-quantum-neon">
                {(explanation.confidence * 100).toFixed(0)}% confidence
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={regenerateExplanation}
                disabled={isGenerating}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-quantum-particle">
              <Bot className="w-5 h-5 animate-pulse" />
              <span>Analyzing circuit and generating explanation...</span>
            </div>
          </div>
        ) : explanation ? (
          <Tabs defaultValue="full" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="full" className="text-xs">
                <BookOpen className="w-3 h-3 mr-1" />
                Complete
              </TabsTrigger>
              <TabsTrigger value="gates" className="text-xs">
                Gates
              </TabsTrigger>
              <TabsTrigger value="evolution" className="text-xs">
                Evolution
              </TabsTrigger>
              <TabsTrigger value="results" className="text-xs">
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="full" className="space-y-4">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription className="text-sm leading-relaxed">
                  {explanation.fullExplanation}
                </AlertDescription>
              </Alert>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(explanation.fullExplanation)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Explanation
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="gates" className="space-y-4">
              <div className="p-4 bg-card/30 rounded-lg border">
                <h4 className="font-semibold text-quantum-neon mb-2">Gate Analysis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {explanation.gateAnalysis}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="evolution" className="space-y-4">
              <div className="p-4 bg-card/30 rounded-lg border">
                <h4 className="font-semibold text-quantum-plasma mb-2">State Evolution</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {explanation.stateEvolution}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <div className="p-4 bg-card/30 rounded-lg border">
                <h4 className="font-semibold text-quantum-energy mb-2">Measurement Explanation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {explanation.measurementExplanation}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Button onClick={generateExplanation} disabled={isGenerating}>
              <Bot className="w-4 h-4 mr-2" />
              Generate AI Explanation
            </Button>
            <p className="text-sm text-quantum-particle mt-2">
              Get an AI-powered explanation of your circuit's behavior
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
