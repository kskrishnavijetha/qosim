
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Zap, BookOpen, Users, Cpu, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen bg-quantum-void">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-quantum-void via-quantum-matrix to-quantum-void opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="space-y-8">
            <Badge className="quantum-glow text-quantum-void px-4 py-2">
              QOSim v2.0 - Now Available
            </Badge>
            <h1 className="text-6xl font-bold text-quantum-glow quantum-float">
              Quantum Computing
              <span className="block text-quantum-energy">Made Simple</span>
            </h1>
            <p className="text-xl text-quantum-particle max-w-3xl mx-auto">
              Build, simulate, and learn quantum circuits with our comprehensive platform. 
              From drag-and-drop circuit design to advanced quantum algorithms SDK.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg" className="quantum-button">
                <Link to="/builder">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="neon-border">
                <Link to="/sdk">
                  <Code className="w-5 h-5 mr-2" />
                  Explore SDK
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-quantum-glow mb-4">
            Everything You Need for Quantum Computing
          </h2>
          <p className="text-quantum-particle text-lg max-w-2xl mx-auto">
            Professional-grade tools for education, research, and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <Zap className="w-8 h-8 text-quantum-energy mb-2" />
              <CardTitle className="text-quantum-glow">Circuit Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle mb-4">
                Drag-and-drop interface for designing quantum circuits with real-time visualization
              </p>
              <ul className="space-y-2 text-sm text-quantum-neon">
                <li>• 50+ quantum gates</li>
                <li>• Real-time simulation</li>
                <li>• QASM import/export</li>
                <li>• Collaborative editing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <Code className="w-8 h-8 text-quantum-energy mb-2" />
              <CardTitle className="text-quantum-glow">Algorithms SDK</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle mb-4">
                Pre-built quantum algorithms with JavaScript and Python APIs
              </p>
              <ul className="space-y-2 text-sm text-quantum-neon">
                <li>• Grover's Algorithm</li>
                <li>• Quantum Fourier Transform</li>
                <li>• VQE & QAOA</li>
                <li>• Error Correction</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <Network className="w-8 h-8 text-quantum-energy mb-2" />
              <CardTitle className="text-quantum-glow">Cloud Backends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle mb-4">
                Connect to real quantum hardware and cloud simulators
              </p>
              <ul className="space-y-2 text-sm text-quantum-neon">
                <li>• IBM Quantum</li>
                <li>• Rigetti Forest</li>
                <li>• IonQ</li>
                <li>• Azure Quantum</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-quantum-energy mb-2" />
              <CardTitle className="text-quantum-glow">Learning Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle mb-4">
                Interactive tutorials and documentation for all skill levels
              </p>
              <ul className="space-y-2 text-sm text-quantum-neon">
                <li>• Beginner tutorials</li>
                <li>• Advanced algorithms</li>
                <li>• Video lessons</li>
                <li>• Practice problems</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <Cpu className="w-8 h-8 text-quantum-energy mb-2" />
              <CardTitle className="text-quantum-glow">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle mb-4">
                High-performance simulation engine with noise modeling
              </p>
              <ul className="space-y-2 text-sm text-quantum-neon">
                <li>• State vector simulation</li>
                <li>• Noise models</li>
                <li>• Benchmarking tools</li>
                <li>• Optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <Users className="w-8 h-8 text-quantum-energy mb-2" />
              <CardTitle className="text-quantum-glow">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle mb-4">
                Share circuits and algorithms with the quantum computing community
              </p>
              <ul className="space-y-2 text-sm text-quantum-neon">
                <li>• Circuit marketplace</li>
                <li>• Algorithm library</li>
                <li>• Discussion forums</li>
                <li>• Code sharing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-quantum-matrix py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-quantum-glow mb-6">
            Ready to Start Your Quantum Journey?
          </h2>
          <p className="text-quantum-particle text-lg mb-8">
            Join thousands of developers, researchers, and students exploring quantum computing with QOSim
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="quantum-button">
              <Link to="/builder">
                Start Building Circuits
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="neon-border">
              <Link to="/sdk">
                Explore SDK Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-quantum-void border-t border-quantum-matrix py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-quantum-glow font-bold text-lg mb-4">QOSim</h3>
              <p className="text-quantum-particle text-sm">
                The complete quantum computing platform for education, research, and development.
              </p>
            </div>
            <div>
              <h4 className="text-quantum-neon font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-quantum-particle">
                <li><Link to="/builder" className="hover:text-quantum-glow">Circuit Builder</Link></li>
                <li><Link to="/sdk" className="hover:text-quantum-glow">Algorithms SDK</Link></li>
                <li><a href="#" className="hover:text-quantum-glow">Cloud Backends</a></li>
                <li><a href="#" className="hover:text-quantum-glow">API Access</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-quantum-neon font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-quantum-particle">
                <li><a href="#" className="hover:text-quantum-glow">Documentation</a></li>
                <li><a href="#" className="hover:text-quantum-glow">Tutorials</a></li>
                <li><a href="#" className="hover:text-quantum-glow">Examples</a></li>
                <li><a href="#" className="hover:text-quantum-glow">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-quantum-neon font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-quantum-particle">
                <li><a href="#" className="hover:text-quantum-glow">About</a></li>
                <li><a href="#" className="hover:text-quantum-glow">Blog</a></li>
                <li><a href="#" className="hover:text-quantum-glow">Careers</a></li>
                <li><a href="#" className="hover:text-quantum-glow">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-quantum-matrix mt-8 pt-8 text-center text-quantum-particle text-sm">
            <p>&copy; 2024 QOSim. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
