
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorHandlingService, QOSimError } from '@/services/ErrorHandlingService';
import { AlertTriangle, XCircle, Info, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GlobalErrorNotifications() {
  const { toast } = useToast();

  const getErrorIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Bug className="w-4 h-4" />;
    }
  };

  const getVariant = (severity: string) => {
    return severity === 'critical' ? 'destructive' : 'default';
  };

  const getUserFriendlyMessage = (error: QOSimError): string => {
    // Convert technical errors to user-friendly messages
    if (error.message.includes('qubit index')) {
      return 'Qubit index exceeds available range. Try using fewer qubits or increase register size.';
    }
    if (error.message.includes('CNOT')) {
      return 'CNOT gate requires exactly 2 different qubits. Please check your gate configuration.';
    }
    if (error.message.includes('Toffoli')) {
      return 'Toffoli gate requires exactly 3 different qubits. Please verify your gate setup.';
    }
    if (error.message.includes('authentication')) {
      return 'Authentication failed with quantum backend. Please check your API credentials.';
    }
    if (error.message.includes('timeout')) {
      return 'Quantum backend request timed out. Try reducing circuit complexity or try again later.';
    }
    if (error.message.includes('SDK')) {
      return 'SDK configuration error. Please verify your quantum computing library setup.';
    }
    if (error.message.includes('network') || error.message.includes('connection')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    
    return error.message;
  };

  const handleReportIssue = (error: QOSimError) => {
    const subject = encodeURIComponent(`QOSim Error Report: ${error.type}`);
    const body = encodeURIComponent(`
Error ID: ${error.id}
Type: ${error.type}
Severity: ${error.severity}
Message: ${error.message}
Timestamp: ${new Date(error.timestamp).toISOString()}
User Agent: ${navigator.userAgent}

Please describe what you were doing when this error occurred:


---
Technical Details:
${JSON.stringify(error, null, 2)}
    `.trim());
    
    window.open(`mailto:support@qosim.app?subject=${subject}&body=${body}`);
  };

  useEffect(() => {
    const unsubscribe = errorHandlingService.subscribe((errors) => {
      // Only show notifications for new, non-dismissed errors
      const newErrors = errors.filter(error => 
        !error.dismissed && 
        !error.context?.notificationShown &&
        (Date.now() - error.timestamp < 5000) // Only recent errors
      );

      newErrors.forEach(error => {
        // Mark as shown to prevent duplicate notifications
        error.context = { ...error.context, notificationShown: true };

        const userMessage = getUserFriendlyMessage(error);
        
        toast({
          title: `${error.type.charAt(0).toUpperCase() + error.type.slice(1)} Error`,
          description: userMessage,
          variant: getVariant(error.severity),
          duration: error.severity === 'critical' ? 10000 : 5000,
          action: (
            <div className="flex gap-2">
              {error.severity === 'critical' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReportIssue(error)}
                  className="h-8 px-2"
                >
                  <Bug className="w-3 h-3 mr-1" />
                  Report
                </Button>
              )}
            </div>
          )
        });
      });
    });

    return unsubscribe;
  }, [toast]);

  return null; // This component only handles side effects
}
