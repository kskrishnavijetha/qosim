import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Zap, Eye, Cpu, GraduationCap, Code, FlaskConical, Users, Github, Twitter, Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
  const [email, setEmail] = useState("");

  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Mailchimp
    console.log("Waitlist signup:", email);
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
            <Button asChild>
              <Link to="/app">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-void/20 via-background to-quantum-matrix/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--quantum-glow))_0%,transparent_50%)] opacity-20" />
        
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge variant="outline" className="border-quantum-neon text-quantum-neon mb-4">
              The Future of Quantum Computing
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              The Visual{" "}
              <span className="bg-gradient-to-r from-quantum-glow via-quantum-neon to-quantum-plasma bg-clip-text text-transparent">
                OS
              </span>{" "}
              for{" "}
              <span className="bg-gradient-to-r from-quantum-energy to-quantum-particle bg-clip-text text-transparent">
                Quantum Computing
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Experience quantum computing like never before with our revolutionary visual interface.
              Build, simulate, and understand quantum circuits with intuitive drag-and-drop simplicity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="group">
                <Link to="/app">
                  Start Building
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">What is QFS?</h2>
            <p className="text-lg text-muted-foreground">
              Quantum File System (QFS) is our groundbreaking approach to quantum computing education and development.
              We transform complex quantum mechanics into visual, interactive experiences that anyone can understand.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-quantum-neon/20">
                <CardHeader>
                  <Eye className="w-10 h-10 text-quantum-glow mb-2" />
                  <CardTitle>Why Visual Quantum?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Traditional quantum computing requires deep mathematical knowledge. Our visual approach makes
                    quantum concepts accessible through interactive diagrams, real-time simulations, and intuitive controls.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-quantum-plasma/20">
                <CardHeader>
                  <Zap className="w-10 h-10 text-quantum-energy mb-2" />
                  <CardTitle>Accelerated Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See quantum states evolve in real-time, understand entanglement through visualization,
                    and build complex circuits with drag-and-drop simplicity. Learn faster, understand deeper.
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

      {/* Email Waitlist */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Quantum Revolution</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be the first to access new features and quantum computing insights.
            </p>
            
            <form onSubmit={handleWaitlistSignup} className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">
                Join Waitlist
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              No spam, unsubscribe at any time.
            </p>
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