
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  LayoutDashboard,
  Github,
  Sun,
  Moon,
  Plus,
  Sliders,
  Terminal,
  Puzzle,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QuantumSidebarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  user: any;
  onLogout: () => void;
}

export function QuantumSidebar({ activePanel, onPanelChange, user, onLogout }: QuantumSidebarProps) {
  const { toast } = useToast();

  const handlePanelChange = (panel: string) => {
    onPanelChange(panel);
    toast({
      title: "Panel Changed",
      description: `Navigated to ${panel}`,
    })
  };

  const handleLogoutClick = () => {
    onLogout();
    toast({
      title: "Logged Out",
      description: "Successfully logged out of QOSim",
    });
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview of QOSim',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 'circuit-composer',
      label: 'Circuit Composer',
      icon: Puzzle,
      description: 'Design quantum circuits',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 'quantum-algorithms',
      label: 'Algorithms SDK',
      icon: Terminal,
      description: 'Explore quantum algorithms',
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'hardware-integration',
      label: 'Hardware Access',
      icon: Sliders,
      description: 'Connect to real quantum hardware',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'error-correction',
      label: 'Error Correction',
      icon: Shield,
      description: '4D Topological QEC',
      gradient: 'from-red-500 to-pink-500'
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Home className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64 bg-black border-r border-quantum-glow/20">
        <SheetHeader className="text-left">
          <SheetTitle className="font-mono text-lg text-quantum-glow">QOSim</SheetTitle>
          <SheetDescription className="text-sm text-quantum-particle">
            Quantum Simulation Dashboard
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="my-4">
          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activePanel === item.id ? "secondary" : "ghost"}
                className="justify-start font-normal"
                onClick={() => handlePanelChange(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className="mt-4 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutClick}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
}
