import { useState } from "react";
import { Cpu, Database, FileText, GitBranch, Activity, Terminal, Share2, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "circuits", label: "Circuits", icon: GitBranch },
  { id: "jobs", label: "Jobs", icon: Cpu },
  { id: "memory", label: "Memory", icon: Database },
  { id: "files", label: "Files", icon: FileText },
  { id: "logs", label: "Runtime Logs", icon: Terminal },
  { id: "integrations", label: "Integrations", icon: Share2 },
];

export function QuantumSidebar({ activeTab, onTabChange }: QuantumSidebarProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'QU';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-64 bg-quantum-void border-r neon-border quantum-panel h-full flex flex-col">
      <div className="p-4 lg:p-6 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <Activity className="w-8 h-8 text-quantum-glow particle-animation" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-quantum-neon rounded-full quantum-orbit"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-quantum-glow quantum-float">Quantum OS</h1>
            <p className="text-xs text-quantum-neon font-mono">Simulator v2.1.0</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 relative group",
                  "hover:bg-quantum-matrix hover:quantum-glow hover:scale-105",
                  isActive 
                    ? "bg-quantum-matrix text-quantum-glow quantum-glow neon-border scale-105" 
                    : "text-muted-foreground hover:text-quantum-neon"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5 transition-all duration-300", 
                    isActive ? "quantum-float" : "group-hover:scale-110"
                  )} />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-glow rounded-full particle-animation"></div>
                  )}
                </div>
                <span className="font-mono font-medium">{item.label}</span>
                
                {/* Hover effect line */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-quantum-glow to-quantum-neon rounded-r transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )} />
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 quantum-panel rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-quantum-neon">System Status</h3>
            <ThemeToggle />
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span>Qubits:</span>
              <span className="text-quantum-glow">128/256</span>
            </div>
            <div className="flex justify-between">
              <span>Entangled:</span>
              <span className="text-quantum-neon">64</span>
            </div>
            <div className="flex justify-between">
              <span>Coherence:</span>
              <span className="text-green-400">98.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-quantum-matrix">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full p-2 h-auto hover:bg-quantum-matrix">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="w-8 h-8 neon-border">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-quantum-matrix text-quantum-glow text-xs">
                    {getInitials(user?.user_metadata?.display_name || user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-quantum-glow truncate">
                    {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-quantum-neon truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 quantum-panel neon-border">
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-quantum-matrix" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}