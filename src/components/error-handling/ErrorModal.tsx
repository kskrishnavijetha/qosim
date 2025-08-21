
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface ErrorDetails {
  id: string;
  title: string;
  description: string;
  category: 'Syntax Error' | 'Backend Error' | 'Resource Limit' | 'Timeout' | 'Simulation Error';
  trace: string;
  suggestions: string[];
  timestamp: number;
}

interface ErrorModalProps {
  error: ErrorDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ErrorModal({ error, isOpen, onClose }: ErrorModalProps) {
  const [showTrace, setShowTrace] = useState(false);
  const { toast } = useToast();

  if (!error) return null;

  const handleCopyDetails = () => {
    const errorText = `
Error: ${error.title}
Category: ${error.category}
Time: ${new Date(error.timestamp).toISOString()}
Description: ${error.description}

Suggestions:
${error.suggestions.map(s => `- ${s}`).join('\n')}

Stack Trace:
${error.trace}
    `.trim();

    navigator.clipboard.writeText(errorText);
    toast({
      title: "Error details copied",
      description: "Error information has been copied to clipboard",
    });
  };

  const handleReportIssue = () => {
    const subject = encodeURIComponent(`QOSim Error Report: ${error.title}`);
    const body = encodeURIComponent(`
Error Details:
- Category: ${error.category}
- Time: ${new Date(error.timestamp).toISOString()}
- Description: ${error.description}

Please describe what you were doing when this error occurred:


---
Technical Details:
${error.trace}
    `.trim());
    
    window.open(`mailto:support@qosim.app?subject=${subject}&body=${body}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Syntax Error':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'Backend Error':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Resource Limit':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Timeout':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <DialogTitle className="text-lg font-semibold">{error.title}</DialogTitle>
            <Badge className={getCategoryColor(error.category)}>
              {error.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">What happened?</h4>
            <p className="text-sm text-muted-foreground">{error.description}</p>
          </div>

          {/* Suggestions */}
          {error.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Suggested fixes:</h4>
              <ul className="space-y-1">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Trace Toggle */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTrace(!showTrace)}
              className="mb-3"
            >
              {showTrace ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              {showTrace ? 'Hide' : 'Show'} technical details
            </Button>

            {showTrace && (
              <ScrollArea className="h-32 w-full border rounded-md p-3 bg-muted">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                  {error.trace}
                </pre>
              </ScrollArea>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleCopyDetails} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-1" />
              Copy Details
            </Button>
            <Button onClick={handleReportIssue} variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1" />
              Report Issue
            </Button>
            <Button onClick={onClose} variant="default" size="sm" className="ml-auto">
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
