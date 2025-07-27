
import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      
      {/* QOSim Ecosystem Badge */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="outline" className="bg-card/80 backdrop-blur-sm shadow-lg">
          <Zap className="w-3 h-3 mr-1" />
          QOSim Ecosystem Active
        </Badge>
      </div>
    </div>
  );
}
