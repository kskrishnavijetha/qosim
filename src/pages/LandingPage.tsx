import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, BookOpen, Github, Settings, ArrowRight, GraduationCap, Sparkles, Clock, Shield, Code, Globe, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-quantum-void">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-quantum-glow" />
          <span className="text-xl font-bold text-white">QOSim</span>
        </div>
        <div className="flex items-center space-x-6">
          <Button 
            variant="ghost" 
            className="text-quantum-silver hover:text-quantum-glow"
            onClick={() => navigate('/tutorials')}
          >
            Tutorials
          </Button>
          <Button 
            variant="ghost" 
            className="text-quantum-silver hover:text-quantum-glow"
            onClick={() => navigate('/educators')}
          >
            For Educators
          </Button>
          <Button 
            variant="ghost" 
            className="text-quantum-silver hover:text-quantum-glow"
            onClick={() => navigate('/roadmap')}
          >
            Roadmap
          </Button>
          <Button 
            variant="ghost" 
            className="text-quantum-silver hover:text-quantum-glow"
            onClick={() => navigate('/sdk')}
          >
            SDK
          </Button>
          <Button 
            className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
            onClick={() => navigate('/app')}
          >
            Launch Simulator
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Zap className="w-16 h-16 text-quantum-glow animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 border-2 border-quantum-glow rounded-full animate-spin opacity-30"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Quantum Computing
              <span className="block text-quantum-glow">Made Simple</span>
            </h1>
            <p className="text-xl text-quantum-silver max-w-3xl mx-auto mb-8">
              Build, simulate, and visualize quantum circuits with our comprehensive platform. 
              From quantum gates to complex algorithms, master quantum computing interactively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                onClick={() => navigate('/app')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building Circuits
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-quantum-matrix text-quantum-glow hover:bg-quantum-matrix"
                onClick={() => navigate('/tutorials')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn Quantum Computing
              </Button>
            </div>
            <div className="mt-8 flex justify-center items-center gap-8 text-quantum-silver">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Free to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Web-Based</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span className="text-sm">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Explore Quantum Possibilities</h2>
          <p className="text-xl text-quantum-silver">Unleash the power of quantum computing with our intuitive platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <Zap className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Real-Time Simulation</CardTitle>
              <CardDescription className="text-quantum-silver">
                Visualize quantum states and gate operations with instant simulation feedback.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <Users className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Collaborative Workspace</CardTitle>
              <CardDescription className="text-quantum-silver">
                Share circuits, collaborate with peers, and learn from the community.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-quantum-glow mb-2" />
              <CardTitle className="text-white">Interactive Tutorials</CardTitle>
              <CardDescription className="text-quantum-silver">
                Step-by-step guides and examples to master quantum concepts and circuit design.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-quantum-matrix py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-quantum-silver">Get started with quantum circuit design in minutes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-quantum-circuit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">1. Build Your Circuit</h3>
                    <p className="text-quantum-silver text-sm">Drag and drop quantum gates</p>
                  </div>
                  <Zap className="w-8 h-8 text-quantum-glow" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-quantum-circuit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">2. Simulate & Visualize</h3>
                    <p className="text-quantum-silver text-sm">See quantum states evolve</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-quantum-glow" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-quantum-circuit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">3. Share & Collaborate</h3>
                    <p className="text-quantum-silver text-sm">Learn with the community</p>
                  </div>
                  <Users className="w-8 h-8 text-quantum-glow" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Dive In?</h2>
          <p className="text-xl text-quantum-silver">Start building quantum circuits today</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">New to Quantum Computing?</CardTitle>
              <CardDescription className="text-quantum-silver">
                Explore our tutorials and learn the basics of quantum mechanics and circuit design.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                onClick={() => navigate('/tutorials')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-circuit">
            <CardHeader>
              <CardTitle className="text-white">Already Know the Basics?</CardTitle>
              <CardDescription className="text-quantum-silver">
                Jump right into the simulator and start building your own quantum circuits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                onClick={() => navigate('/app')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Launch Simulator
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-quantum-matrix py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-quantum-glow" />
                <span className="text-lg font-bold text-white">QOSim</span>
              </div>
              <p className="text-quantum-silver text-sm">
                Making quantum computing accessible through interactive simulation and education.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <div className="space-y-2">
                <Button 
                  variant="link" 
                  className="text-quantum-silver hover:text-quantum-glow p-0 h-auto"
                  onClick={() => navigate('/app')}
                >
                  Quantum Simulator
                </Button>
                <Button 
                  variant="link" 
                  className="text-quantum-silver hover:text-quantum-glow p-0 h-auto"
                  onClick={() => navigate('/tutorials')}
                >
                  Tutorials
                </Button>
                <Button 
                  variant="link" 
                  className="text-quantum-silver hover:text-quantum-glow p-0 h-auto"
                  onClick={() => navigate('/sdk')}
                >
                  SDK
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <div className="space-y-2">
                <Button 
                  variant="link" 
                  className="text-quantum-silver hover:text-quantum-glow p-0 h-auto"
                  onClick={() => navigate('/educators')}
                >
                  For Educators
                </Button>
                <Button 
                  variant="link" 
                  className="text-quantum-silver hover:text-quantum-glow p-0 h-auto"
                  onClick={() => navigate('/roadmap')}
                >
                  Roadmap
                </Button>
                <Button 
                  variant="link" 
                  className="text-quantum-silver hover:text-quantum-glow p-0 h-auto"
                  onClick={() => navigate('/api')}
                >
                  API Reference
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Community</h3>
              <div className="space-y-2">
                <a href="https://github.com" className="block text-quantum-silver hover:text-quantum-glow text-sm">
                  GitHub
                </a>
                <a href="#" className="block text-quantum-silver hover:text-quantum-glow text-sm">
                  Discord
                </a>
                <a href="#" className="block text-quantum-silver hover:text-quantum-glow text-sm">
                  Documentation
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-quantum-circuit mt-8 pt-8 text-center">
            <p className="text-quantum-silver text-sm">
              © 2024 QOSim. Built for the quantum future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
