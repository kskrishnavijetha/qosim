
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function Header({ className, children }: HeaderProps) {
  return (
    <header className={cn("h-16 bg-card border-b flex items-center px-6", className)}>
      {children}
    </header>
  );
}
