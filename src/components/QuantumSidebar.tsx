import React, { useState } from "react";
import { 
  Zap, 
  Binary, 
  Bot, 
  FileText, 
  Play, 
  HardDrive, 
  Terminal, 
  BookOpen, 
  Code,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function QuantumSidebar({ activeTab, onTabChange }: QuantumSidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { id: "circuit", label: "Circuit Builder", icon: Zap },
    { id: "my-circuits", label: "My Circuits", icon: FolderOpen },
    { id: "algorithms", label: "Algorithms", icon: Binary },
    { id: "ai", label: "AI Assistant", icon: Bot },
    { id: "files", label: "Files", icon: FileText },
    { id: "jobs", label: "Jobs", icon: Play },
    { id: "memory", label: "Memory", icon: HardDrive },
    { id: "logs", label: "Logs", icon: Terminal },
    { id: "learning", label: "Learning", icon: BookOpen },
    { id: "sdk", label: "SDK", icon: Code },
  ];

  return (
    <div
      className={`flex flex-col bg-quantum-matrix text-quantum-glow border-r border-r-gray-800 transition-width duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } h-screen`}
    >
      {/* Brand */}
      <div className="flex items-center justify-start px-4 py-6">
        <span className="text-xl font-bold">
          {isExpanded ? "Quantum OS" : "QOS"}
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center justify-start w-full py-3 px-4 rounded-md transition-colors duration-200 ${
              activeTab === item.id
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {isExpanded && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-t-gray-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 justify-between w-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} />
                <AvatarFallback>QN</AvatarFallback>
              </Avatar>
              {isExpanded && <span className="ml-2">{user?.email}</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount className="bg-quantum-panel border-quantum-glow/30">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
