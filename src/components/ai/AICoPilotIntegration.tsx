import React from 'react';
import { AICoPilotSidebar } from './AICoPilotSidebar';
import { useAICoPilot } from '@/hooks/useAICoPilot';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AICoPilotIntegrationProps {
  onInsertToCanvas?: (content: string, framework?: string) => void;
}

export function AICoPilotIntegration({ onInsertToCanvas }: AICoPilotIntegrationProps) {
  const { isOpen, toggleCoPilot, closeCoPilot } = useAICoPilot();
  const { toast } = useToast();

  const handleInsertToCanvas = (content: string, framework?: string) => {
    if (onInsertToCanvas) {
      // Extract quantum circuit information from the AI response
      const circuitData = parseAIResponseToCircuit(content);
      onInsertToCanvas(circuitData, framework);
    } else {
      toast({
        title: "Circuit Generation",
        description: "AI Co-Pilot generated quantum circuit code ready for implementation.",
      });
    }
  };

  return (
    <>
      {/* Floating AI Co-Pilot Button */}
      {!isOpen && (
        <Button
          onClick={toggleCoPilot}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full quantum-glow shadow-quantum"
          size="lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* AI Co-Pilot Sidebar */}
      <AICoPilotSidebar
        isOpen={isOpen}
        onClose={closeCoPilot}
        onInsertToCanvas={handleInsertToCanvas}
      />
    </>
  );
}

// Helper function to parse AI responses into circuit format
function parseAIResponseToCircuit(aiResponse: string): string {
  // Extract QASM code from AI response
  const qasmMatch = aiResponse.match(/```qasm\n([\s\S]*?)\n```/);
  if (qasmMatch) {
    return qasmMatch[1];
  }

  // Extract general code blocks
  const codeMatch = aiResponse.match(/```[\w]*\n([\s\S]*?)\n```/);
  if (codeMatch) {
    return codeMatch[1];
  }

  // Return the full response if no code blocks found
  return aiResponse;
}