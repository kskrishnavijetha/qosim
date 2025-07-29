
import { useState } from "react";
import { Cpu, Database, FileText, GitBranch, Activity, Terminal, Share2, User, LogOut, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
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
  onSDKSelect?: (sdkType: string) => void;
}

const navigationItems = [
  { id: "circuits", label: "Circuits", icon: GitBranch },
  { id: "jobs", label: "Jobs", icon: Cpu },
  { id: "memory", label: "Memory", icon: Database },
  { id: "files", label: "Files", icon: FileText },
  { id: "logs", label: "Runtime Logs", icon: Terminal },
];

export function QuantumSidebar({ activeTab, onTabChange, onSDKSelect }: QuantumSidebarProps) {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'QU';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn(
      "bg-quantum-void border-r neon-border quantum-panel h-full flex flex-col",
      isMobile ? "w-72" : "w-64"
    )}>
      <div className="p-3 lg:p-6 flex-1">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="relative">
            <img 
              src="/lovable-uploads/9ba01b22-3dfc-4014-9b17-0ba4cbbca31e.png" 
              alt="QOSim Logo" 
              className="w-6 h-6 lg:w-8 lg:h-8 quantum-float"
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-quantum-neon rounded-full quantum-orbit"></div>
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-quantum-glow quantum-float">Quantum OS</h1>
            <p className="text-xs text-quantum-neon font-mono">Simulator v2.1.0</p>
          </div>
        </div>
        
        <nav className="space-y-2 lg:space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-500 relative group text-left",
                  "hover:bg-quantum-matrix hover:quantum-glow hover:scale-105",
                  isActive 
                    ? "bg-quantum-matrix text-quantum-glow quantum-glow neon-border scale-105" 
                    : "text-muted-foreground hover:text-quantum-neon"
                )}
              >
                <div className="relative shrink-0">
                  <Icon className={cn("w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300", 
                    isActive ? "quantum-float" : "group-hover:scale-110"
                  )} />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-quantum-glow rounded-full particle-animation"></div>
                  )}
                </div>
                <span className="font-mono font-medium text-sm lg:text-base truncate">{item.label}</span>
                
                {/* Hover effect line */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-quantum-glow to-quantum-neon rounded-r transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )} />
              </button>
            );
          })}

          {/* SDK Tools Dropdown */}
          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-500 relative group text-left",
                  "hover:bg-quantum-matrix hover:quantum-glow hover:scale-105",
                  "text-muted-foreground hover:text-quantum-neon"
                )}>
                  <div className="relative shrink-0">
                    <Code className="w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <span className="font-mono font-medium text-sm lg:text-base truncate">SDK Tools</span>
                  
                  {/* Hover effect line */}
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-quantum-glow to-quantum-neon rounded-r transition-all duration-300",
                    "opacity-0 group-hover:opacity-50"
                  )} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-quantum-matrix border-quantum-neon/20">
                <DropdownMenuItem 
                  onClick={() => onSDKSelect?.('quantum-algorithms')}
                  className="text-quantum-neon hover:bg-quantum-void/50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Quantum Algorithms SDK
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-quantum-matrix" />
                <DropdownMenuItem 
                  onClick={() => onTabChange("javascript-sdk")}
                  className="text-quantum-neon hover:bg-quantum-void/50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  JavaScript SDK
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onTabChange("python-sdk")}
                  className="text-quantum-neon hover:bg-quantum-void/50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Python SDK
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Integrations */}
          <button
            onClick={() => onTabChange("integrations")}
            className={cn(
              "w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-500 relative group text-left",
              "hover:bg-quantum-matrix hover:quantum-glow hover:scale-105",
              activeTab === "integrations"
                ? "bg-quantum-matrix text-quantum-glow quantum-glow neon-border scale-105" 
                : "text-muted-foreground hover:text-quantum-neon"
            )}
          >
            <div className="relative shrink-0">
              <Share2 className={cn("w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300", 
                activeTab === "integrations" ? "quantum-float" : "group-hover:scale-110"
              )} />
              {activeTab === "integrations" && (
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-quantum-glow rounded-full particle-animation"></div>
              )}
            </div>
            <span className="font-mono font-medium text-sm lg:text-base truncate">Integrations</span>
            
            {/* Hover effect line */}
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-quantum-glow to-quantum-neon rounded-r transition-all duration-300",
              activeTab === "integrations" ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )} />
          </button>
        </nav>
        
        {/* System Status - Hide on small mobile screens */}
        <div className={cn(
          "mt-6 lg:mt-8 p-3 lg:p-4 quantum-panel rounded-lg",
          isMobile ? "hidden sm:block" : ""
        )}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs lg:text-sm font-semibold text-quantum-neon">System Status</h3>
            <ThemeToggle />
          </div>
          <div className="space-y-1 lg:space-y-2 text-xs font-mono">
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
      <div className="p-3 lg:p-4 border-t border-quantum-matrix">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full p-2 h-auto hover:bg-quantum-matrix">
              <div className="flex items-center gap-2 lg:gap-3 w-full min-w-0">
                <Avatar className="w-6 h-6 lg:w-8 lg:h-8 neon-border shrink-0">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-quantum-matrix text-quantum-glow text-xs">
                    {getInitials(user?.user_metadata?.display_name || user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-quantum-glow truncate">
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
