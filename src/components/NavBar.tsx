
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Code, Home } from 'lucide-react';

export function NavBar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-quantum-glow/30 bg-quantum-matrix">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-quantum-glow font-bold text-xl">
            <Zap className="w-6 h-6" />
            QOSim
          </Link>
          
          <div className="flex items-center gap-4">
            <Button 
              asChild 
              variant={isActive('/') ? 'default' : 'ghost'}
              className={isActive('/') ? 'bg-quantum-glow text-black' : 'text-quantum-neon hover:text-quantum-glow'}
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant={isActive('/builder') ? 'default' : 'ghost'}
              className={isActive('/builder') ? 'bg-quantum-glow text-black' : 'text-quantum-neon hover:text-quantum-glow'}
            >
              <Link to="/builder">
                <Zap className="w-4 h-4 mr-2" />
                Builder
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant={isActive('/sdk') ? 'default' : 'ghost'}
              className={isActive('/sdk') ? 'bg-quantum-glow text-black' : 'text-quantum-neon hover:text-quantum-glow'}
            >
              <Link to="/sdk">
                <Code className="w-4 h-4 mr-2" />
                SDK
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
