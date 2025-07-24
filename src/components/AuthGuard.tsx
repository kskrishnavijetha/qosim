
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
        
        if (!session && event === 'SIGNED_OUT') {
          navigate('/landing');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show loading skeleton while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-quantum-void p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-12 w-48 bg-quantum-matrix" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="quantum-panel">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-2 bg-quantum-matrix" />
                  <Skeleton className="h-4 w-1/2 mb-4 bg-quantum-matrix" />
                  <Skeleton className="h-20 w-full bg-quantum-matrix" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to landing
  if (!isAuthenticated) {
    navigate('/landing');
    return null;
  }

  return <>{children}</>;
}
