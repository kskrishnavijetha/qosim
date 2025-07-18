import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Zap, Eye, Cpu, GraduationCap, Code, FlaskConical, Users, Github, Twitter, Mail, Shield, CircuitBoard, Database, MemoryStick, Atom, Menu, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("hero");

  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with early access system
    console.log("Early access signup:", email);
    setEmail("");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const openRoadmapInNewTab = () => {
    window.open('/roadmap', '_blank');
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'features', 'use-cases', 'early-access'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom > 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-quantum-glow to-quantum-neon rounded-md flex items-center justify-center">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              QOSim
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { id: 'hero', label: 'Home' },
              { id: 'about', label: 'Product' },
              { id: 'features', label: 'Features' },
              { id: 'use-cases', label: 'Use Cases' },
              { id: 'early-access', label: 'Early Access' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm transition-colors hover:text-quantum-glow ${
                  activeSection === item.id ? 'text-quantum-glow' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={openRoadmapInNewTab}
              className="text-sm transition-colors hover:text-quantum-glow text-muted-foreground"
            >
              Roadmap
            </button>
            <a
              href="/educators"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:text-quantum-glow text-muted-foreground"
            >
              For Educators
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:flex border-quantum-neon text-quantum-neon">
              <Shield className="w-3 h-3 mr-1" />
              Patent Pending
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/integrations">SDKs</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="/educators" target="_blank" rel="noopener noreferrer">
                  For Educators
                </a>
              </Button>
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
      <section id="hero" className="relative overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Nebula */}
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-void/40 via-background to-quantum-matrix/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(var(--quantum-glow))/20,transparent_70%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,hsl(var(--quantum-neon))/15,transparent_70%)] animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_80%,hsl(var(--quantum-plasma))/10,transparent_70%)] animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* Enhanced Floating Particles Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large particles */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-quantum-glow rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-quantum-neon rounded-full opacity-70 animate-float-delayed"></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-quantum-plasma rounded-full opacity-40 animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/3 w-2.5 h-2.5 bg-quantum-energy rounded-full opacity-80 animate-float-reverse"></div>
          
          {/* Small particles */}
          <div className="absolute top-16 left-16 w-1 h-1 bg-quantum-glow rounded-full opacity-50 animate-float-fast"></div>
          <div className="absolute top-1/2 right-16 w-1 h-1 bg-quantum-neon rounded-full opacity-60 animate-float-delayed"></div>
          <div className="absolute bottom-16 left-1/2 w-1 h-1 bg-quantum-plasma rounded-full opacity-40 animate-float"></div>
          <div className="absolute top-40 right-1/2 w-1 h-1 bg-quantum-energy rounded-full opacity-70 animate-float-slow"></div>
        </div>
        
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="quantum-grid animate-pulse"></div>
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
            
            {/* Patent Pending Badge */}
            <div className="flex justify-center mt-6">
              <div className="relative group">
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-quantum-glow/30 to-quantum-neon/30 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                {/* Badge */}
                <div className="relative bg-gradient-to-r from-quantum-void/40 to-quantum-matrix/40 border border-quantum-glow/40 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                  <span className="text-quantum-glow font-medium">
                    🛡️ Patent Pending: Quantum File System (QFS)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center pt-6">
              <Button size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg" asChild>
                <Link to="/auth">
                  Join Early Access
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-quantum-glow text-quantum-glow hover:bg-quantum-glow hover:text-black px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg" asChild>
                <Link to="/app">
                  View Live Preview
                </Link>
              </Button>
            </div>
            
            {/* Floating Laptop Mockup */}
            <div className="mt-16 relative">
              <div className="relative max-w-4xl mx-auto">
                {/* Laptop Frame */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-quantum-neon/30 transform perspective-1000 rotate-x-15 hover:rotate-x-12 transition-transform duration-500 shadow-2xl">
                  {/* Screen */}
                  <div className="bg-gradient-to-br from-quantum-void/60 to-quantum-matrix/60 rounded-xl border border-quantum-glow/40 p-4 backdrop-blur-sm relative overflow-hidden">
                    {/* Simulator Interface Mockup */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-xs text-quantum-glow">QOSim - Quantum OS Simulator</div>
                      </div>
                      
                      {/* Circuit Grid */}
                      <div className="grid grid-cols-8 gap-1 py-4">
                        {Array.from({length: 32}).map((_, i) => (
                          <div key={i} className={`h-2 rounded-sm ${
                            i % 8 === 0 || i % 8 === 7 ? 'bg-quantum-glow/40' :
                            i % 4 === 1 ? 'bg-quantum-neon/40' :
                            i % 6 === 2 ? 'bg-quantum-plasma/40' :
                            'bg-quantum-energy/20'
                          }`}></div>
                        ))}
                      </div>
                      
                      {/* Quantum State Visualization */}
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="w-16 h-1 bg-quantum-glow rounded"></div>
                          <div className="w-12 h-1 bg-quantum-neon rounded"></div>
                          <div className="w-20 h-1 bg-quantum-plasma rounded"></div>
                        </div>
                        <div className="w-12 h-12 border border-quantum-glow/50 rounded-full flex items-center justify-center">
                          <Atom className="w-6 h-6 text-quantum-glow animate-spin-slow" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-quantum-glow/5 to-transparent rounded-xl"></div>
                  </div>
                  
                  {/* Laptop base */}
                  <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-b-xl"></div>
                </div>
                
                {/* Floating effect shadow */}
                <div className="absolute inset-0 bg-quantum-glow/10 blur-3xl rounded-2xl transform translate-y-8 scale-95"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-br from-quantum-void/5 to-quantum-matrix/5 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--quantum-glow))/5,transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                See QOSim in{" "}
                <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                  Action
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch how easy it is to create a quantum circuit, simulate it in real-time, 
                and export to QASM format - all in under 60 seconds.
              </p>
            </div>
            
            {/* Demo video container */}
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-quantum-glow via-quantum-neon to-quantum-plasma rounded-2xl blur-sm opacity-30 group-hover:opacity-50 transition-opacity"></div>
              
              {/* Video container */}
              <div className="relative bg-gradient-to-br from-quantum-void/20 to-background border border-quantum-neon/30 rounded-2xl p-2 backdrop-blur-sm">
              <div className="aspect-video rounded-xl overflow-hidden bg-quantum-void/40 flex items-center justify-center relative">
                {/* Placeholder for demo GIF */}
                <div className="absolute inset-0 bg-gradient-to-br from-quantum-glow/10 to-quantum-neon/10"></div>
                
                {/* GIF placeholder - replace src with actual demo GIF */}
                <img
                  src="/placeholder.svg"
                  alt="QOSim Demo: Create, Simulate, Export Quantum Circuits"
                  className="w-full h-full object-cover rounded-xl"
                />
                
                {/* Demo overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-quantum-void/60 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-quantum-glow/30 to-quantum-neon/30 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-quantum-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011 1v3" />
                        <rect x="7" y="8" width="10" height="8" rx="1" />
                        <path d="M10 12h4M10 14h2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold text-quantum-glow mb-2">Interactive Demo</p>
                    <p className="text-sm text-muted-foreground">Circuit Creation → Simulation → QASM Export</p>
                    <p className="text-xs text-quantum-neon/70 mt-2">GIF Demo Coming Soon</p>
                  </div>
                </div>
              </div>
              </div>
              
              {/* Feature highlights below video */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-quantum-glow/20 to-quantum-glow/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-quantum-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-quantum-glow mb-1">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">Build circuits in seconds</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-quantum-neon/20 to-quantum-neon/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-quantum-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-quantum-neon mb-1">Real-time Preview</h3>
                  <p className="text-sm text-muted-foreground">See results instantly</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-quantum-plasma/20 to-quantum-plasma/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-quantum-plasma" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-quantum-plasma mb-1">Easy Export</h3>
                  <p className="text-sm text-muted-foreground">QASM, Qiskit, Cirq ready</p>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg"
                asChild
              >
                <Link to="/auth">Try It Yourself</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-quantum-void/10 to-quantum-matrix/10 relative">
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
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Everything you need to explore, learn, and innovate in quantum computing
            </p>
            
            {/* Patent Pending Badge in Features */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-quantum-plasma/20 to-quantum-energy/20 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
                
                {/* Badge */}
                <div className="relative bg-gradient-to-r from-quantum-void/30 to-quantum-matrix/30 border border-quantum-plasma/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs">
                  <span className="text-quantum-plasma font-medium">
                    🛡️ Patent Pending: Quantum File System (QFS)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Cpu className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Visual Circuit Builder",
                description: "Drag and drop quantum gates to build complex circuits"
              },
              {
                icon: <Eye className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Real-time Simulation",
                description: "Watch quantum states evolve as you build"
              },
              {
                icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Bloch Sphere Visualization",
                description: "3D representation of qubit states"
              },
              {
                icon: <Code className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Code Export",
                description: "Export to Qiskit, Cirq, and more"
              },
              {
                icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Collaborative Workspaces",
                description: "Share and collaborate on quantum projects"
              },
              {
                icon: <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Educational Resources",
                description: "Built-in tutorials and learning paths"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-4 sm:p-6 hover:border-quantum-glow/50 transition-colors">
                <CardHeader className="p-0 pb-3 sm:pb-4">
                  <div className="text-quantum-glow mb-2">{feature.icon}</div>
                  <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Cosmic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-void/20 via-background to-quantum-matrix/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,hsl(var(--quantum-plasma))/15,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--quantum-energy))/10,transparent_50%)]"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-quantum-glow rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-quantum-neon rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-quantum-plasma rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-quantum-energy rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                It Works
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Build quantum circuits visually, simulate them in real-time, and export to your favorite quantum framework. 
              No complex math required.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-24 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-quantum-glow/50 to-quantum-neon/50"></div>
              <div className="hidden md:block absolute top-24 right-0 w-1/3 h-0.5 bg-gradient-to-r from-quantum-neon/50 to-quantum-plasma/50 translate-x-1/3"></div>
              
              {/* Step 1: Create */}
              <div className="text-center group">
                <div className="relative mb-8">
                  {/* Wireframe icon container */}
                  <div className="w-24 h-24 mx-auto relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-quantum-glow/20 rounded-full blur-xl group-hover:bg-quantum-glow/30 transition-all duration-500"></div>
                    
                    {/* Icon background */}
                    <div className="relative w-full h-full border-2 border-quantum-glow/50 rounded-full flex items-center justify-center group-hover:border-quantum-glow group-hover:scale-110 transition-all duration-500">
                      {/* Wireframe circuit icon */}
                      <svg viewBox="0 0 48 48" className="w-10 h-10 text-quantum-glow">
                        <g fill="none" stroke="currentColor" strokeWidth="1.5">
                          {/* Circuit board lines */}
                          <path d="M8 12h32M8 24h32M8 36h32" className="opacity-60"/>
                          <path d="M12 8v32M24 8v32M36 8v32" className="opacity-60"/>
                          {/* Quantum gates */}
                          <rect x="18" y="18" width="12" height="12" rx="2" className="group-hover:fill-quantum-glow/10 transition-all"/>
                          <circle cx="12" cy="12" r="3" className="group-hover:fill-quantum-glow/10 transition-all"/>
                          <circle cx="36" cy="36" r="3" className="group-hover:fill-quantum-glow/10 transition-all"/>
                          {/* Connection points */}
                          <circle cx="12" cy="24" r="1.5" fill="currentColor"/>
                          <circle cx="24" cy="12" r="1.5" fill="currentColor"/>
                          <circle cx="36" cy="24" r="1.5" fill="currentColor"/>
                        </g>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-quantum-glow to-quantum-neon rounded-full flex items-center justify-center text-black font-bold text-sm">
                    1
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-quantum-glow">Create</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Drag and drop quantum gates to build your circuit. No coding required - 
                  just intuitive visual design with real-time feedback.
                </p>
              </div>
              
              {/* Step 2: Simulate */}
              <div className="text-center group">
                <div className="relative mb-8">
                  {/* Wireframe icon container */}
                  <div className="w-24 h-24 mx-auto relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-quantum-neon/20 rounded-full blur-xl group-hover:bg-quantum-neon/30 transition-all duration-500"></div>
                    
                    {/* Icon background */}
                    <div className="relative w-full h-full border-2 border-quantum-neon/50 rounded-full flex items-center justify-center group-hover:border-quantum-neon group-hover:scale-110 transition-all duration-500">
                      {/* Wireframe simulation icon */}
                      <svg viewBox="0 0 48 48" className="w-10 h-10 text-quantum-neon">
                        <g fill="none" stroke="currentColor" strokeWidth="1.5">
                          {/* Quantum state visualization */}
                          <circle cx="24" cy="24" r="16" className="opacity-60"/>
                          <circle cx="24" cy="24" r="10" className="opacity-40"/>
                          <circle cx="24" cy="24" r="4" className="group-hover:fill-quantum-neon/10 transition-all"/>
                          {/* Probability waves */}
                          <path d="M8 24c4-8 8-8 12 0s8 8 12 0s8-8 12 0" className="opacity-80"/>
                          <path d="M10 18c3-6 6-6 9 0s6 6 9 0s6-6 9 0" className="opacity-60"/>
                          <path d="M10 30c3-6 6-6 9 0s6 6 9 0s6-6 9 0" className="opacity-60"/>
                          {/* Measurement indicators */}
                          <circle cx="16" cy="12" r="2" fill="currentColor" className="opacity-80"/>
                          <circle cx="32" cy="12" r="2" fill="currentColor" className="opacity-80"/>
                          <circle cx="16" cy="36" r="2" fill="currentColor" className="opacity-80"/>
                          <circle cx="32" cy="36" r="2" fill="currentColor" className="opacity-80"/>
                        </g>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-quantum-neon to-quantum-plasma rounded-full flex items-center justify-center text-black font-bold text-sm">
                    2
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-quantum-neon">Simulate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Watch your quantum circuit come to life with real-time simulation. 
                  Visualize quantum states, probabilities, and entanglement.
                </p>
              </div>
              
              {/* Step 3: Export */}
              <div className="text-center group">
                <div className="relative mb-8">
                  {/* Wireframe icon container */}
                  <div className="w-24 h-24 mx-auto relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-quantum-plasma/20 rounded-full blur-xl group-hover:bg-quantum-plasma/30 transition-all duration-500"></div>
                    
                    {/* Icon background */}
                    <div className="relative w-full h-full border-2 border-quantum-plasma/50 rounded-full flex items-center justify-center group-hover:border-quantum-plasma group-hover:scale-110 transition-all duration-500">
                      {/* Wireframe export icon */}
                      <svg viewBox="0 0 48 48" className="w-10 h-10 text-quantum-plasma">
                        <g fill="none" stroke="currentColor" strokeWidth="1.5">
                          {/* Document/code representation */}
                          <rect x="12" y="8" width="24" height="32" rx="2" className="opacity-60"/>
                          <path d="M16 16h16M16 20h12M16 24h16M16 28h8" className="opacity-80"/>
                          {/* Export arrow */}
                          <path d="M24 32l-4 4m4-4l4 4m-4-4v8" strokeLinecap="round" strokeLinejoin="round"/>
                          {/* Platform indicators */}
                          <circle cx="8" cy="36" r="3" className="group-hover:fill-quantum-plasma/10 transition-all"/>
                          <circle cx="40" cy="36" r="3" className="group-hover:fill-quantum-plasma/10 transition-all"/>
                          <rect x="18" y="6" width="12" height="4" rx="1" className="opacity-40"/>
                        </g>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-quantum-plasma to-quantum-energy rounded-full flex items-center justify-center text-black font-bold text-sm">
                    3
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-quantum-plasma">Export</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Export your circuits to Qiskit, Cirq, or other quantum frameworks. 
                  Seamless integration with your existing quantum workflow.
                </p>
              </div>
            </div>
            
            {/* Call to action */}
            <div className="text-center mt-16">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg"
                asChild
              >
                <Link to="/auth">Start Building Quantum Circuits</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Uses QOSim?</h2>
          </div>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <Card className="p-4 sm:p-6 text-center border-quantum-neon/20 cursor-pointer hover:shadow-lg transition-all hover:border-quantum-glow/50 group" onClick={() => window.open('/educators', '_blank')}>
              <CardHeader className="p-0 pb-4">
                <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-quantum-glow mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg sm:text-xl group-hover:text-quantum-glow transition-colors">Educators</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors">
                  Teach quantum computing concepts with interactive visualizations.
                  Perfect for universities and online courses.
                </p>
                <div className="mt-4 inline-flex items-center text-quantum-glow text-sm font-medium">
                  Get Free Classroom Plan 
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-4 sm:p-6 text-center border-quantum-energy/20">
              <CardHeader className="p-0 pb-4">
                <Code className="w-12 h-12 sm:w-16 sm:h-16 text-quantum-energy mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">Developers</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Prototype quantum algorithms visually before implementing in code.
                  Export to popular quantum frameworks.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-4 sm:p-6 text-center border-quantum-plasma/20">
              <CardHeader className="p-0 pb-4">
                <FlaskConical className="w-12 h-12 sm:w-16 sm:h-16 text-quantum-plasma mx-auto mb-3 sm:mb-4" />
                <CardTitle className="text-lg sm:text-xl">Research Labs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Collaborate on quantum research with powerful simulation tools
                  and shared workspaces.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Educator Spotlight Section */}
      <section className="py-24 bg-gradient-to-br from-quantum-glow/5 to-quantum-neon/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--quantum-glow))/10,transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="outline" className="border-quantum-glow text-quantum-glow mb-4">
                <GraduationCap className="w-4 h-4 mr-2" />
                For Educators
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                  Quantum Classroom
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of educators worldwide using QOSim to make quantum computing 
                accessible and engaging for students at all levels.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-quantum-void/20 to-background border border-quantum-glow/30 rounded-lg p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-glow/20 to-quantum-glow/10 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-quantum-glow" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Free Classroom Plan</h3>
                <p className="text-muted-foreground text-sm">
                  Up to 30 students • 500 simulations/month • LMS integrations
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-quantum-neon/20 to-background border border-quantum-neon/30 rounded-lg p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-neon/20 to-quantum-neon/10 rounded-full flex items-center justify-center">
                  <CircuitBoard className="w-8 h-8 text-quantum-neon" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
                <p className="text-muted-foreground text-sm">
                  Visual quantum circuits • Real-time simulation • Student analytics
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-quantum-plasma/20 to-background border border-quantum-plasma/30 rounded-lg p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-quantum-plasma/20 to-quantum-plasma/10 rounded-full flex items-center justify-center">
                  <Database className="w-8 h-8 text-quantum-plasma" />
                </div>
                <h3 className="text-xl font-semibold mb-2">LMS Integration</h3>
                <p className="text-muted-foreground text-sm">
                  Canvas • Moodle • Blackboard • Google Classroom
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma"
                onClick={() => window.open('/educators', '_blank')}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Get Free Educator Account
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-quantum-glow text-quantum-glow hover:bg-quantum-glow hover:text-black"
                onClick={() => window.open('/educators', '_blank')}
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* JavaScript SDK Section */}
      <section className="py-20 bg-gradient-to-br from-quantum-void/5 to-quantum-matrix/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--quantum-glow))/5,transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
                  JavaScript SDK
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Build quantum circuits directly in the browser or integrate with your JavaScript applications
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* SDK Features */}
              <div className="space-y-6">
                <Card className="border-quantum-glow/20 hover:border-quantum-glow/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-quantum-glow/20 to-quantum-glow/10 rounded-lg flex items-center justify-center">
                        <Code className="w-6 h-6 text-quantum-glow" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">QOSim JavaScript SDK</CardTitle>
                        <p className="text-sm text-muted-foreground">Browser & Node.js support</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Create quantum circuits programmatically with our comprehensive JavaScript SDK. Perfect for web applications, Node.js backends, and educational tools.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-quantum-glow rounded-full"></div>
                        <span>Quantum gate operations</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-quantum-neon rounded-full"></div>
                        <span>Circuit visualization</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-quantum-plasma rounded-full"></div>
                        <span>State vector simulation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-quantum-energy rounded-full"></div>
                        <span>QASM export/import</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href="/qosim-core.js" download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Core
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href="/qosim-visualizer.js" download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Visualizer
                        </a>
                      </Button>
                    </div>
                    
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href="/qosim-getting-started.pdf" target="_blank">
                        <FileText className="w-4 h-4 mr-2" />
                        Getting Started Guide
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              {/* Code Example */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-quantum-void/30 to-quantum-matrix/30 border border-quantum-glow/30 rounded-lg p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-quantum-glow">Quick Start Example</h3>
                    <Badge variant="outline" className="border-quantum-neon text-quantum-neon text-xs">
                      JavaScript
                    </Badge>
                  </div>
                  
                  <div className="bg-background/50 rounded-md p-4 font-mono text-sm overflow-x-auto">
                    <div className="text-muted-foreground">
                      <div className="text-quantum-glow">// Import QOSim SDK</div>
                      <div><span className="text-quantum-neon">import</span> &#123; QuantumCircuit &#125; <span className="text-quantum-neon">from</span> <span className="text-quantum-plasma">'qosim-core'</span>;</div>
                      <br />
                      <div className="text-quantum-glow">// Create a Bell state circuit</div>
                      <div><span className="text-quantum-neon">const</span> circuit = <span className="text-quantum-neon">new</span> <span className="text-quantum-plasma">QuantumCircuit</span>(2);</div>
                      <div>circuit.<span className="text-quantum-energy">hadamard</span>(0);</div>
                      <div>circuit.<span className="text-quantum-energy">cnot</span>(0, 1);</div>
                      <br />
                      <div className="text-quantum-glow">// Simulate and get results</div>
                      <div><span className="text-quantum-neon">const</span> result = circuit.<span className="text-quantum-energy">simulate</span>();</div>
                      <div>console.<span className="text-quantum-energy">log</span>(result.<span className="text-quantum-plasma">stateVector</span>);</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black">
                      <Eye className="w-4 h-4 mr-2" />
                      Try in Playground
                    </Button>
                    <Button size="sm" variant="outline">
                      Copy Code
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-quantum-glow/10 to-quantum-glow/5 rounded-lg border border-quantum-glow/20">
                    <div className="text-2xl font-bold text-quantum-glow">15KB</div>
                    <div className="text-sm text-muted-foreground">Minified Size</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-quantum-neon/10 to-quantum-neon/5 rounded-lg border border-quantum-neon/20">
                    <div className="text-2xl font-bold text-quantum-neon">Zero</div>
                    <div className="text-sm text-muted-foreground">Dependencies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section id="early-access" className="py-24 relative overflow-hidden">
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
            
            <div className="bg-gradient-to-br from-quantum-void/30 to-quantum-matrix/30 border border-quantum-neon/30 rounded-2xl p-4 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col gap-3 sm:gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email for early access"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border-quantum-glow/30 focus:border-quantum-glow px-3 py-2 sm:px-4 sm:py-3"
                />
                <Button 
                  className="w-full bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg"
                  asChild
                >
                  <Link to="/auth">
                    Join Early Access
                  </Link>
                </Button>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
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
                <li><a href="mailto:support@qosim.app" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@qosim.app
                </a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 QOSim. All rights reserved.</p>
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
