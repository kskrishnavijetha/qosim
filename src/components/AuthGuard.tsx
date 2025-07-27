
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, User } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center">
        <div className="text-quantum-neon">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center p-6">
        <Card className="quantum-panel neon-border max-w-md">
          <CardHeader>
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-quantum-particle">
              Please sign in to access the QOSim ecosystem and quantum development tools.
            </p>
            <Button
              onClick={() => window.location.href = '/auth'}
              className="w-full neon-border"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
