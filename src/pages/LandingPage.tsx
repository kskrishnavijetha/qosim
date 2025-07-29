
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Code, Users, Cpu, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-quantum-void to-quantum-matrix">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 text-quantum-glow border-quantum-neon">
            QOSim v2.0 - Now with SDK Integration
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-quantum-glow">
            Quantum Circuit
            <span className="text-quantum-neon"> Builder</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-quantum-particle max-w-3xl mx-auto">
            Design, simulate, and optimize quantum circuits with our advanced visual builder
            and seamless SDK integration. Now with real-time collaboration!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-quantum-neon text-quantum-void hover:bg-quantum-glow text-lg px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Circuit Builder
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="border-quantum-glow text-quantum-glow hover:bg-quantum-glow hover:text-quantum-void text-lg px-8 py-3"
            >
              <Link to="/tutorials">View Tutorials</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Visual Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                Drag-and-drop interface for building quantum circuits with real-time simulation
              </p>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Code className="w-5 h-5" />
                SDK Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                Export to JavaScript/Python or import existing code into the visual builder
              </p>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                Real-time collaborative editing with comments and activity tracking
              </p>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                AI Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                AI-powered circuit optimization and intelligent gate suggestions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-quantum-glow">
            Ready to Start Building?
          </h2>
          <p className="text-lg mb-8 text-quantum-particle max-w-2xl mx-auto">
            Access the full quantum circuit builder with SDK integration, 
            collaboration tools, and AI optimization features.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-quantum-neon text-quantum-void hover:bg-quantum-glow text-lg px-12 py-4"
          >
            <Play className="w-5 h-5 mr-2" />
            Go to Circuit Builder
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
