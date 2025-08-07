
import QuantumDashboard from "@/components/QuantumDashboard";
import { AuthGuard } from "@/components/AuthGuard";

const Index = () => {
  return (
    <AuthGuard>
      <QuantumDashboard />
    </AuthGuard>
  );
};

export default Index;
