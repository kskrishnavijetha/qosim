import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Zap, Eye, Cpu, GraduationCap, Code, FlaskConical, Users, Github, Twitter, Mail, Shield, CircuitBoard, Database, MemoryStick, Atom } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with early access system
    console.log("Early access signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-quantum-glow to-quantum-neon rounded-md flex items-center justify-center">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              QOSim
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-quantum-neon text-quantum-neon">
              <Shield className="w-3 h-3 mr-1" />
              Patent Pending
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/app">Launch App</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-void/30 via-background to-quantum-matrix/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--quantum-glow))/30,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,hsl(var(--quantum-neon))/20,transparent_50%)]" />
        
        {/* Floating Particles Animation */}
        <div className="absolute inset-0">
          <div className="particle-animation absolute top-10 left-10 w-2 h-2 bg-quantum-glow rounded-full opacity-60"></div>
          <div className="particle-animation absolute top-32 right-20 w-1 h-1 bg-quantum-neon rounded-full opacity-80" style={{animationDelay: '1s'}}></div>
          <div className="particle-animation absolute bottom-20 left-32 w-3 h-3 bg-quantum-plasma rounded-full opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="particle-animation absolute top-60 right-40 w-1.5 h-1.5 bg-quantum-energy rounded-full opacity-70" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="quantum-grid"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 text-center z-10">
          <div className="max-w-5xl mx-auto space-y-10">
            <Badge variant="outline" className="border-quantum-neon text-quantum-neon mb-6 text-sm px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              The world's first interactive Quantum OS Simulator with QFS – Patent Pending
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-quantum-glow via-quantum-neon to-quantum-plasma bg-clip-text text-transparent">
                Build. Simulate. Understand
              </span>
              <br />
              <span className="text-foreground">Quantum Computing</span>
              <br />
              <span className="bg-gradient-to-r from-quantum-energy to-quantum-particle bg-clip-text text-transparent">
                Visually.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The world's first interactive Quantum OS Simulator with drag-and-drop UI, 
              memory mapping, and a revolutionary quantum-native file system (QFS).
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
              <Button size="lg" className="group bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma px-8 py-3 text-lg">
                Join Early Access
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-quantum-glow text-quantum-glow hover:bg-quantum-glow hover:text-black px-8 py-3 text-lg" asChild>
                <Link to="/app">
                  View Live Preview
                </Link>
              </Button>
            </div>
            
            {/* 3D Mockup Placeholder */}
            <div className="mt-16 relative">
              <div className="bg-gradient-to-br from-quantum-void/40 to-quantum-matrix/40 rounded-2xl border border-quantum-neon/30 p-8 backdrop-blur-sm">
                <div className="text-quantum-glow text-center">
                  <CircuitBoard className="w-24 h-24 mx-auto mb-4 opacity-60" />
                  <p className="text-sm text-muted-foreground">3D Quantum Circuit UI Mockup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-br from-quantum-void/10 to-quantum-matrix/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--quantum-plasma))/10,transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                About the{" "}
                <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                  Product
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                QOSim revolutionizes quantum computing with visual interfaces, making complex quantum mechanics 
                accessible through intuitive drag-and-drop tools and real-time simulation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-quantum-neon/30 bg-gradient-to-br from-quantum-void/20 to-background hover:border-quantum-glow/50 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-glow/20 to-quantum-neon/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CircuitBoard className="w-8 h-8 text-quantum-glow" />
                  </div>
                  <CardTitle className="text-lg">Quantum Circuit Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Drag-and-drop interface for building complex quantum circuits with real-time visualization
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-quantum-energy/30 bg-gradient-to-br from-quantum-matrix/20 to-background hover:border-quantum-energy/50 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-energy/20 to-quantum-plasma/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Code className="w-8 h-8 text-quantum-energy" />
                  </div>
                  <CardTitle className="text-lg">QASM/Qiskit Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Export your visual circuits to industry-standard quantum programming languages
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-quantum-plasma/30 bg-gradient-to-br from-quantum-particle/20 to-background hover:border-quantum-plasma/50 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-plasma/20 to-quantum-particle/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MemoryStick className="w-8 h-8 text-quantum-plasma" />
                  </div>
                  <CardTitle className="text-lg">Memory Management + QFS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Revolutionary quantum-native file system with advanced memory mapping capabilities
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-quantum-particle/30 bg-gradient-to-br from-quantum-energy/20 to-background hover:border-quantum-particle/50 transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-particle/20 to-quantum-glow/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Atom className="w-8 h-8 text-quantum-particle" />
                  </div>
                  <CardTitle className="text-lg">Multi-qubit Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    3D Bloch sphere and state vector representations for deep quantum understanding
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to explore, learn, and innovate in quantum computing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "Visual Circuit Builder",
                description: "Drag and drop quantum gates to build complex circuits"
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Real-time Simulation",
                description: "Watch quantum states evolve as you build"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Bloch Sphere Visualization",
                description: "3D representation of qubit states"
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "Code Export",
                description: "Export to Qiskit, Cirq, and more"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Collaborative Workspaces",
                description: "Share and collaborate on quantum projects"
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Educational Resources",
                description: "Built-in tutorials and learning paths"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:border-quantum-glow/50 transition-colors">
                <CardHeader>
                  <div className="text-quantum-glow mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Uses QOSim?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-quantum-neon/20">
              <CardHeader>
                <GraduationCap className="w-16 h-16 text-quantum-glow mx-auto mb-4" />
                <CardTitle>Educators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Teach quantum computing concepts with interactive visualizations.
                  Perfect for universities and online courses.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-quantum-energy/20">
              <CardHeader>
                <Code className="w-16 h-16 text-quantum-energy mx-auto mb-4" />
                <CardTitle>Developers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prototype quantum algorithms visually before implementing in code.
                  Export to popular quantum frameworks.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-quantum-plasma/20">
              <CardHeader>
                <FlaskConical className="w-16 h-16 text-quantum-plasma mx-auto mb-4" />
                <CardTitle>Research Labs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Collaborate on quantum research with powerful simulation tools
                  and shared workspaces.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-glow/5 via-background to-quantum-neon/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--quantum-plasma))/10,transparent_70%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Join the{" "}
              <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                Quantum Revolution
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Be among the first to experience the future of quantum computing. 
              Get early access to QOSim and shape the quantum computing landscape.
            </p>
            
            <div className="bg-gradient-to-br from-quantum-void/30 to-quantum-matrix/30 border border-quantum-neon/30 rounded-2xl p-8 backdrop-blur-sm">
              <form onSubmit={handleWaitlistSignup} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email for early access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-background/50 border-quantum-glow/30 focus:border-quantum-glow"
                />
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma px-8"
                >
                  Join Early Access
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground mt-6">
                🔒 No spam, quantum-secured privacy. Join 10,000+ quantum enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-quantum-glow to-quantum-neon rounded-md flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                  QOSim
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                The future of quantum computing visualization.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/app" className="hover:text-foreground transition-colors">Launch App</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Discord
                </a></li>
                <li><a href="#" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </a></li>
                <li><a href="#" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:hello@qosim.com" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@qosim.com
                </a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 QOSim. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Badge variant="outline" className="border-quantum-neon text-quantum-neon">
                <Shield className="w-3 h-3 mr-1" />
                Patent Pending
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;