
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Cpu, 
  Code, 
  Users, 
  ArrowRight, 
  Play,
  BookOpen,
  Sparkles
} from "lucide-react";

export function HomePage() {
  const [activeDemo, setActiveDemo] = useState("circuit");
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/app');
  };

  const handleViewDocs = () => {
    navigate('/sdk-docs');
  };

  return (
    <div className="min-h-screen bg-quantum-void">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-glow/10 via-quantum-void to-quantum-neon/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge className="mb-4 bg-quantum-glow/20 text-quantum-glow border-quantum-glow">
              <Sparkles className="w-3 h-3 mr-1" />
              Quantum Computing Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-quantum-glow mb-6">
              QOSim
              <span className="text-quantum-neon">Quantum</span>
            </h1>
            
            <p className="text-xl text-quantum-particle max-w-3xl mx-auto mb-8">
              Build, simulate, and optimize quantum circuits with our visual editor, 
              powerful SDK, and real-time collaboration tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-black font-semibold"
                onClick={handleLaunchApp}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Building
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-quantum-neon text-quantum-neon hover:bg-quantum-neon/10"
                onClick={handleViewDocs}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <Cpu className="w-5 h-5" />
                Visual Circuit Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                Drag and drop quantum gates to build circuits visually. 
                Real-time state visualization and simulation.
              </p>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <Code className="w-5 h-5" />
                Python & JavaScript SDK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                Export circuits to code or import from popular quantum 
                computing frameworks like Qiskit and Cirq.
              </p>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-quantum-glow">
                <Users className="w-5 h-5" />
                Real-time Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle">
                Work together with version control, comments, and 
                multi-user editing capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-center text-quantum-glow">
              Interactive Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeDemo} onValueChange={setActiveDemo}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="circuit">Circuit Builder</TabsTrigger>
                <TabsTrigger value="sdk">SDK Playground</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="circuit" className="mt-6">
                <div className="bg-quantum-matrix rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Cpu className="w-12 h-12 mx-auto mb-4 text-quantum-glow" />
                    <p className="text-quantum-particle">
                      Interactive circuit builder demo would go here
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sdk" className="mt-6">
                <div className="bg-quantum-matrix rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-12 h-12 mx-auto mb-4 text-quantum-glow" />
                    <p className="text-quantum-particle">
                      SDK code examples would go here
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="collaboration" className="mt-6">
                <div className="bg-quantum-matrix rounded-lg p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-quantum-glow" />
                    <p className="text-quantum-particle">
                      Collaboration features demo would go here
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-quantum-glow mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-quantum-particle mb-8">
            Join thousands of quantum developers building the future
          </p>
          <Button 
            size="lg" 
            className="bg-quantum-glow hover:bg-quantum-glow/80 text-black font-semibold"
            onClick={handleLaunchApp}
          >
            Get Started Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
