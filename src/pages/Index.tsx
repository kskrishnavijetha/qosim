
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, redirect to app
          navigate('/app');
        } else {
          // User is not authenticated, redirect to landing
          navigate('/landing');
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // On error, redirect to landing
        navigate('/landing');
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  // Show minimal loading while redirecting
  return (
    <div className="min-h-screen bg-quantum-void flex items-center justify-center">
      <div className="text-quantum-glow">Loading...</div>
    </div>
  );
}
