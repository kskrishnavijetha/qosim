
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Pin, 
  Zap, 
  Clock,
  MapPin
} from 'lucide-react';
import { QOSimError, ErrorSeverity } from '@/services/ErrorHandlingService';
import { ErrorFixSuggestion } from '@/services/ErrorFixSuggestionService';
import { cn } from '@/lib/utils';

interface ErrorOverlayProps {
  error: QOSimError;
  suggestions?: ErrorFixSuggestion[];
  onDismiss: () => void;
  onPin: () => void;
  onApplyFix: (suggestion: ErrorFixSuggestion) => void;
  onShowLocation?: () => void;
  className?: string;
}

export function ErrorOverlay({
  error,
  suggestions = [],
  onDismiss,
  onPin,
  onApplyFix,
  onShowLocation,
  className
}: ErrorOverlayProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<ErrorFixSuggestion | null>(null);

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColors = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLocationText = () => {
    if (!error.location) return null;
    
    const parts = [];
    if (error.location.line) parts.push(`Line ${error.location.line}`);
    if (error.location.gateId) parts.push(`Gate ${error.location.gateId}`);
    if (error.location.qubitIndex !== undefined) parts.push(`Qubit ${error.location.qubitIndex}`);
    
    return parts.join(', ');
  };

  return (
    <Card className={cn(
      'fixed top-4 right-4 w-96 z-50 shadow-lg animate-in slide-in-from-right-2',
      getSeverityColors(error.severity),
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {getSeverityIcon(error.severity)}
            <div className="flex-1">
              <CardTitle className="text-sm font-medium">
                {error.message}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {error.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {error.severity}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(error.timestamp)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPin}
              className={cn(
                "h-6 w-6 p-0",
                error.pinned && "text-blue-600"
              )}
            >
              <Pin className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Error Details */}
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cause:</p>
            <p className="text-sm">{error.cause}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Suggested Fix:</p>
            <p className="text-sm">{error.possibleFix}</p>
          </div>

          {getLocationText() && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{getLocationText()}</span>
              {onShowLocation && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowLocation}
                  className="h-5 px-2 text-xs"
                >
                  Show
                </Button>
              )}
            </div>
          )}
        </div>

        {/* AI Fix Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-medium">AI Fix Suggestions</p>
            </div>
            
            <ScrollArea className="max-h-32">
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-2 rounded-md border cursor-pointer transition-colors",
                      selectedSuggestion === suggestion
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                    onClick={() => setSelectedSuggestion(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{suggestion.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    {suggestion.code && (
                      <pre className="text-xs text-muted-foreground mt-1 font-mono">
                        {suggestion.code}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {selectedSuggestion && (
              <Button
                size="sm"
                onClick={() => onApplyFix(selectedSuggestion)}
                className="w-full"
              >
                <Zap className="w-3 h-3 mr-1" />
                Apply Fix
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
