
import { useState } from "react";
import { 
  Circuit, 
  FileText, 
  Play, 
  Terminal, 
  Memory, 
  Code, 
  Cpu,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface QuantumSidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export function QuantumSidebar({ activePanel, onPanelChange }: QuantumSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    { id: "circuits", icon: Circuit, label: "Circuits", description: "Build quantum circuits" },
    { id: "files", icon: FileText, label: "Files", description: "Manage quantum files" },
    { id: "jobs", icon: Play, label: "Jobs", description: "Execute quantum jobs" },
    { id: "logs", icon: Terminal, label: "Runtime Logs", description: "View system logs" },
    { id: "memory", icon: Memory, label: "Memory", description: "Monitor system memory" },
    { id: "sdk", icon: Code, label: "SDK Demo", description: "Explore the SDK" },
    { id: "workspace", icon: Cpu, label: "Workspace", description: "Quantum OS workspace" },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-quantum-matrix/50 border-r border-quantum-glow/20 backdrop-blur-sm flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-quantum-glow/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-quantum-glow">QoSim</h1>
              <p className="text-xs text-quantum-neon font-mono">Quantum OS</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-quantum-glow hover:bg-quantum-glow/10"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activePanel === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activePanel === item.id 
                  ? "bg-quantum-glow/20 text-quantum-glow border-quantum-glow/30" 
                  : "text-muted-foreground hover:text-quantum-glow hover:bg-quantum-glow/10"
              }`}
              onClick={() => onPanelChange(item.id)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-quantum-glow/20">
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-quantum-glow/20 text-quantum-glow">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-quantum-glow truncate">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-quantum-neon">Quantum Developer</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-muted-foreground hover:text-quantum-glow"
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex-1 text-muted-foreground hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
