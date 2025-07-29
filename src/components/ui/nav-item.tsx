
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  onClick: () => void;
  active: boolean;
  className?: string;
}

export function NavItem({ 
  id, 
  name, 
  icon: Icon, 
  description, 
  onClick, 
  active, 
  className 
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-colors group",
        "hover:bg-quantum-matrix hover:text-quantum-glow",
        active ? "bg-quantum-matrix text-quantum-glow neon-border" : "text-quantum-particle",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {name}
          </p>
          <p className="text-xs text-quantum-neon truncate">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
