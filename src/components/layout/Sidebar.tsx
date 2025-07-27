
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  children?: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <div className={cn("w-64 h-full bg-card border-r", className)}>
      {children}
    </div>
  );
}
