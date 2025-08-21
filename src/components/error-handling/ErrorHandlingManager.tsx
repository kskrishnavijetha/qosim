
import React, { useState, useEffect, useCallback } from 'react';
import { QOSimError, ErrorFixSuggestion, errorHandlingService } from '@/services/ErrorHandlingService';
import { errorFixSuggestionService } from '@/services/ErrorFixSuggestionService';
import { ErrorOverlay } from './ErrorOverlay';
import { ErrorLoggingConsole } from './ErrorLoggingConsole';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlingManagerProps {
  onApplyCircuitFix?: (gateId: string, fix: any) => void;
  onApplyCodeFix?: (line: number, code: string) => void;
  onHighlightLocation?: (location: any) => void;
}

export function ErrorHandlingManager({
  onApplyCircuitFix,
  onApplyCodeFix,
  onHighlightLocation
}: ErrorHandlingManagerProps) {
  const [errors, setErrors] = useState<QOSimError[]>([]);
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = useState<Map<string, ErrorFixSuggestion[]>>(new Map());
  const [consoleVisible, setConsoleVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorHandlingService.subscribe((newErrors) => {
      setErrors(newErrors);
      
      // Show overlays for new critical errors
      newErrors.forEach(error => {
        if (error.severity === 'critical' && !error.dismissed && !activeOverlays.has(error.id)) {
          setActiveOverlays(prev => new Set([...prev, error.id]));
          
          // Generate AI fix suggestions
          errorFixSuggestionService.generateFixSuggestions(error).then(fixSuggestions => {
            setSuggestions(prev => new Map(prev).set(error.id, fixSuggestions));
          });
        }
      });
    });

    return unsubscribe;
  }, [activeOverlays]);

  // Auto-show console when errors accumulate
  useEffect(() => {
    const activeErrors = errors.filter(e => !e.dismissed);
    if (activeErrors.length >= 3 && !consoleVisible) {
      setConsoleVisible(true);
    }
  }, [errors, consoleVisible]);

  const handleDismissOverlay = useCallback((errorId: string) => {
    setActiveOverlays(prev => {
      const newSet = new Set(prev);
      newSet.delete(errorId);
      return newSet;
    });
    errorHandlingService.dismissError(errorId);
  }, []);

  const handlePinError = useCallback((errorId: string) => {
    errorHandlingService.pinError(errorId);
    toast({
      title: "Error Pinned",
      description: "Error has been pinned and won't be auto-dismissed",
    });
  }, [toast]);

  const handleApplyFix = useCallback(async (errorId: string, suggestion: ErrorFixSuggestion) => {
    const error = errors.find(e => e.id === errorId);
    if (!error) return;

    try {
      if (error.type === 'circuit' && error.location?.gateId && onApplyCircuitFix) {
        if (suggestion.gateConfig) {
          await onApplyCircuitFix(error.location.gateId, suggestion.gateConfig);
        }
      } else if (error.type === 'syntax' && error.location?.line && onApplyCodeFix) {
        if (suggestion.code) {
          await onApplyCodeFix(error.location.line, suggestion.code);
        }
      }

      // Remove the error after successful fix
      errorHandlingService.removeError(errorId);
      
      toast({
        title: "Fix Applied",
        description: "The suggested fix has been applied successfully",
      });

    } catch (fixError) {
      console.error('Failed to apply fix:', fixError);
      
      // Add a new error for the failed fix
      errorHandlingService.addError({
        type: 'runtime',
        severity: 'warning',
        message: 'Failed to apply suggested fix',
        cause: `Error applying fix: ${fixError}`,
        possibleFix: 'Try applying the fix manually or contact support'
      });

      toast({
        title: "Fix Failed",
        description: "Could not apply the suggested fix. Please try manually.",
        variant: "destructive"
      });
    }
  }, [errors, onApplyCircuitFix, onApplyCodeFix, toast]);

  const handleShowLocation = useCallback((error: QOSimError) => {
    if (error.location && onHighlightLocation) {
      onHighlightLocation(error.location);
    }
  }, [onHighlightLocation]);

  return (
    <>
      {/* Error Overlays */}
      {Array.from(activeOverlays).map(errorId => {
        const error = errors.find(e => e.id === errorId);
        if (!error || error.dismissed) return null;

        return (
          <ErrorOverlay
            key={errorId}
            error={error}
            suggestions={suggestions.get(errorId) || []}
            onDismiss={() => handleDismissOverlay(errorId)}
            onPin={() => handlePinError(errorId)}
            onApplyFix={(suggestion) => handleApplyFix(errorId, suggestion)}
            onShowLocation={() => handleShowLocation(error)}
            style={{
              top: `${4 + Array.from(activeOverlays).indexOf(errorId) * 120}px`
            }}
          />
        );
      })}

      {/* Error Logging Console */}
      <ErrorLoggingConsole
        isVisible={consoleVisible}
        onToggleVisibility={() => setConsoleVisible(!consoleVisible)}
      />
    </>
  );
}
