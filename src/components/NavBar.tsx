
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Home, BookOpen, Users } from 'lucide-react';

export function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-quantum-matrix bg-quantum-void/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-quantum-glow rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-quantum-void" />
              </div>
              <span className="text-xl font-bold text-quantum-glow">QOSim</span>
              <Badge variant="secondary" className="text-xs">v2.0</Badge>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-quantum-glow bg-quantum-matrix' 
                    : 'text-quantum-particle hover:text-quantum-glow hover:bg-quantum-matrix/50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/builder" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/builder') 
                    ? 'text-quantum-glow bg-quantum-matrix' 
                    : 'text-quantum-particle hover:text-quantum-glow hover:bg-quantum-matrix/50'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Circuit Builder</span>
              </Link>
              
              <Link 
                to="/sdk" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/sdk') 
                    ? 'text-quantum-glow bg-quantum-matrix' 
                    : 'text-quantum-particle hover:text-quantum-glow hover:bg-quantum-matrix/50'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Algorithms SDK</span>
              </Link>
              
              <a 
                href="#tutorials" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-quantum-particle hover:text-quantum-glow hover:bg-quantum-matrix/50 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Tutorials</span>
              </a>
              
              <a 
                href="#community" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-quantum-particle hover:text-quantum-glow hover:bg-quantum-matrix/50 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="neon-border">
              Sign In
            </Button>
            <Button size="sm" className="quantum-button">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
