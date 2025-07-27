
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Atom, 
  Code, 
  BookOpen, 
  Zap, 
  ExternalLink,
  Github
} from 'lucide-react';

export function NavBar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Atom className="w-4 h-4" /> },
    { path: '/builder', label: 'Circuit Builder', icon: <Zap className="w-4 h-4" /> },
    { path: '/sdk', label: 'SDK', icon: <Code className="w-4 h-4" /> }
  ];

  return (
    <nav className="border-b border-quantum-matrix bg-quantum-void/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-quantum-glow rounded-lg flex items-center justify-center">
              <Atom className="w-5 h-5 text-quantum-void" />
            </div>
            <span className="text-xl font-bold text-quantum-glow">QOSim</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <a 
                href="https://docs.qosim.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Docs</span>
              </a>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <a 
                href="https://github.com/qosim/qosim" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
