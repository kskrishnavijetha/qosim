import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, 
  Play, 
  Database, 
  Folder, 
  Brain, 
  BookOpen, 
  ShoppingBag, 
  MessageSquare, 
  FileCode, 
  Cpu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSDKSelect: (sdk: string) => void;
}

export function QuantumSidebar({ activeTab, onTabChange, onSDKSelect }: QuantumSidebarProps) {
  const [circuitsExpanded, setCircuitsExpanded] = useState(true);
  const [communityExpanded, setCommunityExpanded] = useState(false);
  const [sdkExpanded, setSdkExpanded] = useState(false);

  const menuItems = [
    // Circuit Design Section
    {
      id: "circuit-design",
      label: "Circuit Design",
      icon: Zap,
      isGroup: true,
      expanded: circuitsExpanded,
      onToggle: () => setCircuitsExpanded(!circuitsExpanded),
      children: [
        { id: "circuits", label: "Circuit Builder", icon: Zap },
        { id: "my-circuits", label: "My Circuits", icon: Database },
        { id: "simulation", label: "Simulation", icon: Play },
      ]
    },
    
    // Quantum Operations
    { id: "jobs", label: "Jobs", icon: Play },
    { id: "memory", label: "Memory", icon: Database },
    { id: "files", label: "QFS", icon: Folder },
    
    // AI & Learning
    { id: "ai", label: "AI Assistant", icon: Brain },
    { id: "algorithms", label: "Algorithms", icon: BookOpen },
    
    // Hardware Integration
    { id: "hardware", label: "Hardware Integration", icon: Cpu },
    
    // Community & Marketplace Section
    {
      id: "community-section",
      label: "Community & Marketplace",
      icon: MessageSquare,
      isGroup: true,
      expanded: communityExpanded,
      onToggle: () => setCommunityExpanded(!communityExpanded),
      children: [
        { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
        { id: "community", label: "Community Hub", icon: MessageSquare },
      ]
    },
    
    // Development SDKs Section
    {
      id: "sdk-section",
      label: "Development SDKs",
      icon: FileCode,
      isGroup: true,
      expanded: sdkExpanded,
      onToggle: () => setSdkExpanded(!sdkExpanded),
      children: [
        { id: "sdk", label: "SDK Demo", icon: FileCode },
      ]
    },
  ];

  const handleItemClick = (item: any) => {
    console.log("Clicked item:", item.id);
    
    if (item.isGroup) {
      item.onToggle();
      return;
    }

    // Handle SDK-specific items
    if (item.id === 'sdk') {
      console.log("Opening SDK Demo");
      onTabChange('sdk');
      onSDKSelect('javascript');
    } else {
      // Handle regular tabs
      console.log("Opening regular tab:", item.id);
      onTabChange(item.id);
    }
  };

  const isItemActive = (itemId: string) => {
    return activeTab === itemId;
  };

  const renderMenuItem = (item: any, isChild = false) => {
    const isActive = isItemActive(item.id);
    const IconComponent = item.icon;
    
    if (item.isGroup && !isChild) {
      return (
        <div key={item.id} className="space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-between text-left font-normal text-quantum-text hover:bg-quantum-matrix hover:text-quantum-glow transition-all duration-200 ${
              isActive ? 'bg-quantum-matrix text-quantum-glow neon-border' : ''
            }`}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center gap-3">
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </div>
            {item.expanded ? (
              <ChevronDown className="w-4 h-4 text-quantum-particle" />
            ) : (
              <ChevronRight className="w-4 h-4 text-quantum-particle" />
            )}
          </Button>
          
          {item.expanded && item.children && (
            <div className="ml-6 space-y-1 border-l border-quantum-matrix pl-4">
              {item.children.map((child: any) => renderMenuItem(child, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={`w-full justify-start text-left font-normal text-quantum-text hover:bg-quantum-matrix hover:text-quantum-glow transition-all duration-200 ${
          isActive ? 'bg-quantum-matrix text-quantum-glow neon-border' : ''
        } ${isChild ? 'text-xs py-2' : 'text-sm'}`}
        onClick={() => handleItemClick(item)}
      >
        <div className="flex items-center gap-3">
          <IconComponent className={`${isChild ? 'w-3 h-3' : 'w-4 h-4'}`} />
          <span>{item.label}</span>
        </div>
      </Button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-quantum-dark border-r border-quantum-matrix">
      {/* Header */}
      <div className="p-6 border-b border-quantum-matrix">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-quantum-glow to-quantum-neon rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-quantum-glow">QoSim</h1>
            <p className="text-xs text-quantum-particle">Quantum Simulator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>

      {/* Status Footer */}
      <div className="p-4 border-t border-quantum-matrix space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-quantum-particle">Status</span>
          <Badge variant="outline" className="text-xs bg-quantum-matrix border-quantum-glow text-quantum-glow">
            Online
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-quantum-particle">Quantum State</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-quantum-glow rounded-full animate-pulse"></div>
            <span className="text-xs text-quantum-glow">Active</span>
          </div>
        </div>
        
        <Separator className="bg-quantum-matrix" />
        
        <div className="text-xs text-quantum-particle text-center">
          v2.0.0 - Quantum Ready
        </div>
      </div>
    </div>
  );
}
