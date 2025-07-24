
import { useAuth } from "@/contexts/AuthContext";
import { QuantumDashboard } from "@/components/QuantumDashboard";
import LandingPage from "./LandingPage";

const Index = () => {
  const { user, loading } = useAuth();

  console.log("Index component - loading:", loading, "user:", user);

  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center">
        <div className="text-quantum-glow text-lg">Loading...</div>
      </div>
    );
  }

  // Show dashboard for authenticated users, landing page for guests
  if (user) {
    console.log("Rendering QuantumDashboard for authenticated user");
    return <QuantumDashboard />;
  } else {
    console.log("Rendering LandingPage for unauthenticated user");
    return <LandingPage />;
  }
};

export default Index;
