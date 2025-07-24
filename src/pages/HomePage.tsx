
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Zap, FileText, ArrowRight, Atom, Activity } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // If user is logged in, redirect to the main app
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleViewDocs = () => {
    navigate('/sdk-docs');
  };

  // Show loading while checking auth status
  if (user) {
    return (
      <div className="min-h-screen bg-quantum-void flex items-center justify-center">
        <div className="text-quantum-glow">Launching Quantum OS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quantum-void text-foreground">
      <header className="border-b border-quantum-matrix bg-quantum-void/95 backdrop-blur supports-[backdrop-filter]:bg-quantum-void/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Atom className="w-8 h-8 text-quantum-glow" />
            <span className="text-xl font-bold text-quantum-glow">Quantum OS</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Button variant="ghost" onClick={handleViewDocs}>
              Documentation
            </Button>
            <Button onClick={handleGetStarted} className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
              Launch App
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
            Quantum Circuit Simulator
          </h1>
          <p className="text-xl text-quantum-particle mb-8 max-w-2xl mx-auto">
            Build, simulate, and visualize quantum circuits with our advanced quantum computing platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
            >
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleViewDocs}
              className="neon-border text-quantum-neon"
            >
              <FileText className="mr-2 w-5 h-5" />
              View Documentation
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <Cpu className="w-6 h-6" />
                Visual Circuit Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-quantum-particle">
                Drag and drop quantum gates to build complex circuits with an intuitive visual interface
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <Zap className="w-6 h-6" />
                Real-time Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-quantum-particle">
                See your quantum circuits come to life with real-time state visualization and measurement
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <Activity className="w-6 h-6" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-quantum-particle">
                Analyze circuit performance, entanglement, and quantum properties with detailed metrics
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="quantum-panel neon-border rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-quantum-glow">
              Ready to explore quantum computing?
            </h2>
            <p className="text-quantum-particle mb-6">
              Join thousands of researchers, students, and developers building the future of quantum technology
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
