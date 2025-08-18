
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Clock, MapPin, Monitor } from 'lucide-react';
import { format } from 'date-fns';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export function SecurityAuditLog() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSecurityEvents();
    }
  }, [user]);

  const loadSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setEvents(data || []);
    } catch (error) {
      console.error('Error loading security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-blue-100 text-blue-800';
      case 'credential_stored':
        return 'bg-purple-100 text-purple-800';
      case 'privacy_settings_updated':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed_login':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventDescription = (event: SecurityEvent) => {
    switch (event.event_type) {
      case 'login':
        return 'Successfully signed in';
      case 'logout':
        return 'Signed out';
      case 'credential_stored':
        return `Stored credentials for ${event.event_data?.service_name}`;
      case 'privacy_settings_updated':
        return `Updated privacy level to ${event.event_data?.privacy_level}`;
      case 'failed_login':
        return 'Failed sign-in attempt';
      default:
        return event.event_type.replace(/_/g, ' ');
    }
  };

  if (loading) {
    return <div>Loading security log...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Activity Log
        </CardTitle>
        <CardDescription>
          Recent security events for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No security events recorded yet
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getEventTypeColor(event.event_type)}>
                      {event.event_type.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-sm font-medium">
                      {getEventDescription(event)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}
                    </div>
                    
                    {event.ip_address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.ip_address}
                      </div>
                    )}
                    
                    {event.user_agent && (
                      <div className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        {event.user_agent.substring(0, 50)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
