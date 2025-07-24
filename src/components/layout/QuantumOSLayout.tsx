import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { useTheme } from "@/components/ui/theme-provider"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  User,
  Book,
  BookOpen,
  Code,
  Zap,
  Waves,
  Search,
  Heart,
  Shield,
  HelpCircle,
  Github,
  Twitter,
  Mail,
} from 'lucide-react';

interface QuantumOSLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    title: "Workspace",
    items: [
      { title: "Dashboard", url: "/app", icon: LayoutDashboard },
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Profile", url: "/profile", icon: User },
    ]
  },
  {
    title: "Simulation Tools",
    items: [
      { title: "Circuit Builder", url: "/circuit-builder", icon: Code },
      { title: "Simulation Runner", url: "/simulation-runner", icon: Zap },
      { title: "Quantum Visualizations", url: "/quantum-visualizations", icon: Waves },
    ]
  },
  {
    title: "Quantum Algorithms",
    items: [
      { title: "Grover's Algorithm", url: "/grovers-algorithm", icon: Search },
      { title: "Bell State Generator", url: "/bell-state-generator", icon: Heart },
      { title: "Error Correction", url: "/error-correction", icon: Shield },
    ]
  },
  {
    title: "SDK Tools",
    items: [
      { title: "JavaScript SDK", url: "/javascript-sdk", icon: Code },
      { title: "Python SDK", url: "/python-sdk", icon: Code },
      { title: "Quantum Algorithms SDK", url: "/quantum-algorithms-sdk", icon: Zap },
      { title: "API Reference", url: "/api-reference", icon: Book },
      { title: "Documentation", url: "/sdk-docs", icon: BookOpen },
    ]
  },
  {
    title: "Resources",
    items: [
      { title: "Documentation", url: "/docs", icon: Book },
      { title: "FAQ", url: "/faq", icon: HelpCircle },
      { title: "GitHub", url: "https://github.com/quantum-tinkerers/quantum-lab", icon: Github, external: true },
      { title: "Contact Support", url: "/support", icon: Mail },
    ]
  }
];

export function QuantumOSLayout({ children }: QuantumOSLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();

  const handleThemeToggle = () => {
    // Implement theme toggle logic here
    toast({
      title: "Theme Toggled",
      description: `Theme changed to ${theme === "light" ? "dark" : "light"}`,
    })
  };

  return (
    <div className="flex h-screen bg-quantum-void text-quantum-glow">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-3/4 sm:w-2/3 md:w-1/2 bg-quantum-void border-r border-quantum-neon">
          <SheetHeader className="text-left">
            <SheetTitle>Quantum OS</SheetTitle>
            <SheetDescription>
              Explore the quantum realm.
            </SheetDescription>
          </SheetHeader>
          <Sidebar items={sidebarItems} isMobile={true} onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-quantum-neon">
        <div className="flex items-center justify-center h-16 shrink-0">
          <Link to="/app" className="font-bold text-2xl text-quantum-glow">
            Quantum OS
          </Link>
        </div>
        <Sidebar items={sidebarItems} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
