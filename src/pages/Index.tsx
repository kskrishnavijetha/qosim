
import { QuantumDashboard } from "@/components/QuantumDashboard";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center">
        <div className="text-quantum-glow">Loading...</div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show dashboard for authenticated users
  return <QuantumDashboard />;
};

export default Index;
