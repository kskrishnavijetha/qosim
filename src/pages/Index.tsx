
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Code, BookOpen, Play } from 'lucide-react';

export function Index() {
  return (
    <div className="min-h-screen bg-quantum-void">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-quantum-glow mb-4">
            QOSim Quantum Platform
          </h1>
          <p className="text-xl text-quantum-particle mb-8 max-w-2xl mx-auto">
            Design, simulate, and learn quantum circuits with our comprehensive 
            quantum computing platform featuring an intuitive circuit builder and powerful SDK.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
              <Link to="/builder">
                <Zap className="w-5 h-5 mr-2" />
                Launch Circuit Builder
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-black">
              <Link to="/sdk">
                <Code className="w-5 h-5 mr-2" />
                Explore SDK
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-quantum-matrix border-quantum-glow/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quantum Circuit Builder
              </CardTitle>
              <CardDescription className="text-quantum-particle">
                Drag-and-drop interface for designing quantum circuits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-quantum-neon text-sm">
                <li>• Visual circuit design with quantum gates</li>
                <li>• Real-time state visualization</li>
                <li>• QASM export and import</li>
                <li>• Integrated simulation engine</li>
              </ul>
              <Button asChild className="mt-4 w-full" variant="outline">
                <Link to="/builder">
                  <Play className="w-4 h-4 mr-2" />
                  Start Building
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-quantum-matrix border-quantum-glow/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Code className="w-5 h-5" />
                Quantum Algorithms SDK
              </CardTitle>
              <CardDescription className="text-quantum-particle">
                Pre-built quantum algorithms and development tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-quantum-neon text-sm">
                <li>• Grover's, Shor's, QFT algorithms</li>
                <li>• Python and JavaScript APIs</li>
                <li>• Interactive algorithm visualizer</li>
                <li>• Performance benchmarking</li>
              </ul>
              <Button asChild className="mt-4 w-full" variant="outline">
                <Link to="/sdk">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore SDK
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-quantum-glow mb-4">
            Quick Start
          </h2>
          <p className="text-quantum-particle mb-6">
            Choose your path to quantum computing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="ghost" className="text-quantum-neon hover:text-quantum-glow">
              <Link to="/builder">
                Visual Circuit Designer →
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-quantum-neon hover:text-quantum-glow">
              <Link to="/sdk">
                Code-First SDK →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
