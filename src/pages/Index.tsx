
import { QuantumDashboard } from "@/components/QuantumDashboard";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* QOSim Ecosystem Quick Access */}
        <div className="container mx-auto px-4 py-6">
          <Card className="mb-6 border-quantum-glow/20 bg-gradient-to-br from-quantum-glow/5 to-quantum-neon/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-quantum-glow" />
                QOSim Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Experience the world's first interactive Quantum OS Simulator with advanced circuit building, 
                SDK workspace, educational tools, and collaborative features.
              </p>
              <Button asChild className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma">
                <Link to="/qosim">
                  Launch QOSim Ecosystem
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <QuantumDashboard />
      </div>
    </AuthGuard>
  );
};

export default Index;
