
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  event_type: 'auth_failure' | 'suspicious_activity' | 'rate_limit_exceeded' | 'unauthorized_access';
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function useSecurityMonitoring() {
  const { user } = useAuth();

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      await supabase
        .from('runtime_logs')
        .insert({
          user_id: user?.id || null,
          level: 'security',
          component: 'security_monitor',
          message: `Security event: ${event.event_type}`,
          details: JSON.stringify(event.details),
          metadata: {
            event_type: event.event_type,
            severity: event.severity,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            ip_address: 'client_side' // Will be populated by server
          }
        });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, [user?.id]);

  const logAuthFailure = useCallback((email: string, error: string) => {
    logSecurityEvent({
      event_type: 'auth_failure',
      details: { email, error, timestamp: Date.now() },
      severity: 'medium'
    });
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback((activity: string, details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'suspicious_activity',
      details: { activity, ...details },
      severity: 'high'
    });
  }, [logSecurityEvent]);

  const logUnauthorizedAccess = useCallback((resource: string, attempted_action: string) => {
    logSecurityEvent({
      event_type: 'unauthorized_access',
      details: { resource, attempted_action },
      severity: 'critical'
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logAuthFailure,
    logSuspiciousActivity,
    logUnauthorizedAccess
  };
}
