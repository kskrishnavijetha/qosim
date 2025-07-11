import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-quantum-void/20 via-background to-quantum-matrix/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--quantum-glow))_0%,transparent_50%)] opacity-20" />
      
      <div className="relative w-full max-w-lg">
        <Card className="border-quantum-glow/30 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-quantum-glow to-quantum-neon rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                Quantum Revolution!
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground">
              Thank you for joining the QOSim Beta waitlist! You're now part of an exclusive group
              of quantum computing pioneers.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-quantum-glow" />
                <span>Check your email for confirmation</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-quantum-neon" />
                <span>Get early access to new features</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-quantum-energy" />
                <span>Tagged as "QOSim Beta" member</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              We'll keep you updated on our progress and notify you when QOSim is ready for beta testing.
              In the meantime, feel free to explore our current simulator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1">
                <Link to="/app">
                  Try Current Simulator
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;