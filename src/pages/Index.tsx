
import { useAuth } from "@/contexts/AuthContext";
import { QuantumDashboard } from "@/components/QuantumDashboard";
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

  // Show dashboard for authenticated users, landing page for guests
  return user ? <QuantumDashboard /> : <LandingPage />;
};

export default Index;
