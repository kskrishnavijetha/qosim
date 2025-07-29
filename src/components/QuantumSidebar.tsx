
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Cpu, 
  Code, 
  GitBranch, 
  Memory, 
  FileText, 
  Terminal, 
  Wrench, 
  Share2, 
  Brain,
  BookOpen,
  Activity,
  Settings,
  Database,
  Zap
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Main quantum computing interface'
  },
  {
    name: 'QOSim',
    href: '/qosim',
    icon: Cpu,
    description: 'Quantum OS Simulator',
    badge: 'v2.1.0'
  },
  {
    name: 'Circuit Builder',
    href: '/qosim?tab=circuit-builder',
    icon: GitBranch,
    description: 'Visual quantum circuit design',
    indent: true
  },
  {
    name: 'Algorithms SDK',
    href: '/qosim?tab=algorithms-sdk',
    icon: Code,
    description: 'Python & JavaScript APIs',
    indent: true
  },
  {
    name: 'Integration Layer',
    href: '/qosim?tab=integration',
    icon: Share2,
    description: 'Seamless module sync',
    indent: true
  },
  {
    name: 'Memory',
    href: '/memory',
    icon: Memory,
    description: 'Quantum memory states'
  },
  {
    name: 'Files',
    href: '/files',
    icon: FileText,
    description: 'Circuit files and exports'
  },
  {
    name: 'Runtime Logs',
    href: '/logs',
    icon: Terminal,
    description: 'System execution logs'
  },
  {
    name: 'SDK Tools',
    href: '/sdk',
    icon: Wrench,
    description: 'Development toolkit'
  },
  {
    name: 'AI Assistant',
    href: '/ai',
    icon: Brain,
    description: 'Quantum AI optimization'
  },
  {
    name: 'Education Mode',
    href: '/education',
    icon: BookOpen,
    description: 'Tutorials and learning'
  },
  {
    name: 'Collaboration',
    href: '/collaboration',
    icon: Share2,
    description: 'QFS real-time sharing'
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: Database,
    description: 'Hardware & cloud backends'
  }
];

export function QuantumSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-quantum-void border-r border-quantum-neon/20">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-quantum-neon/20 px-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className="h-8 w-8 text-quantum-glow" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-quantum-energy rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-quantum-glow font-mono">Quantum OS</h1>
            <p className="text-xs text-quantum-particle">Simulator v2.1.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href.includes('?tab=') && location.pathname === '/qosim');
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                item.indent && 'ml-4 pl-6 border-l border-quantum-neon/20',
                isActive
                  ? 'bg-quantum-energy/10 text-quantum-energy border border-quantum-energy/30'
                  : 'text-quantum-particle hover:bg-quantum-matrix/30 hover:text-quantum-glow'
              )}
            >
              <item.icon className={cn(
                'h-4 w-4 transition-colors',
                isActive ? 'text-quantum-energy' : 'text-quantum-particle group-hover:text-quantum-glow'
              )} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 bg-quantum-energy/20 text-quantum-energy rounded font-mono">
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.description && (
                  <div className="text-xs text-quantum-particle/60 mt-0.5">
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="border-t border-quantum-neon/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-quantum-glow" />
            <span className="text-sm font-medium text-quantum-glow">System Status</span>
          </div>
          <Settings className="h-4 w-4 text-quantum-particle hover:text-quantum-glow cursor-pointer" />
        </div>
        
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-quantum-particle">Qubits:</span>
            <span className="text-quantum-glow font-mono">20/20</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-quantum-particle">Simulation:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-quantum-energy">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-quantum-particle">QFS:</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-quantum-energy" />
              <span className="text-quantum-glow">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
