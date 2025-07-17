
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Code, 
  Database, 
  Brain, 
  Rocket, 
  Cpu, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  BookOpen, 
  Store,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Star,
  Target,
  Layers
} from "lucide-react";

interface RoadmapModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Planning' | 'In Progress' | 'Testing' | 'Completed';
  timeline: string;
  dependencies: string[];
  deliverables: string[];
  progress: number;
  quarter: 'Q1' | 'Q2';
  month: number;
}

const roadmapData: RoadmapModule[] = [
  // Month 1-2 (Foundation & Core)
  {
    id: 'qfs-core',
    name: 'Quantum Foundation Stack (QFS)',
    description: 'Revolutionary quantum-native file system with memory mapping',
    icon: <Database className="w-5 h-5" />,
    priority: 'High',
    status: 'In Progress',
    timeline: 'Month 1-2',
    dependencies: [],
    deliverables: ['Quantum file indexing', 'Memory mapping system', 'State persistence'],
    progress: 65,
    quarter: 'Q1',
    month: 1
  },
  {
    id: 'quantum-os-kernel',
    name: 'Quantum OS Kernel',
    description: 'Core operating system for quantum computing environments',
    icon: <Cpu className="w-5 h-5" />,
    priority: 'High',
    status: 'In Progress',
    timeline: 'Month 1-2',
    dependencies: ['qfs-core'],
    deliverables: ['Process scheduler', 'Resource manager', 'System calls API'],
    progress: 45,
    quarter: 'Q1',
    month: 1
  },
  {
    id: 'python-sdk',
    name: 'Python SDK',
    description: 'Comprehensive Python library for quantum circuit development',
    icon: <Code className="w-5 h-5" />,
    priority: 'High',
    status: 'Testing',
    timeline: 'Month 1-2',
    dependencies: [],
    deliverables: ['Circuit builder API', 'Simulation engine', 'Export utilities'],
    progress: 85,
    quarter: 'Q1',
    month: 1
  },
  
  // Month 2-3 (SDKs & Integration)
  {
    id: 'javascript-sdk',
    name: 'JavaScript SDK',
    description: 'Browser and Node.js quantum computing toolkit',
    icon: <Code className="w-5 h-5" />,
    priority: 'High',
    status: 'In Progress',
    timeline: 'Month 2-3',
    dependencies: ['python-sdk'],
    deliverables: ['Web components', 'Visualization library', 'NPM package'],
    progress: 70,
    quarter: 'Q1',
    month: 2
  },
  {
    id: 'hybrid-simulator',
    name: 'Hybrid Quantum-Classical Simulator',
    description: 'Seamless integration between quantum and classical computing',
    icon: <Zap className="w-5 h-5" />,
    priority: 'High',
    status: 'Planning',
    timeline: 'Month 2-3',
    dependencies: ['quantum-os-kernel'],
    deliverables: ['Classical interface', 'Quantum bridge', 'Optimization engine'],
    progress: 25,
    quarter: 'Q1',
    month: 2
  },
  {
    id: 'quantum-compiler',
    name: 'Quantum Compiler Integration',
    description: 'Advanced quantum circuit compilation and optimization',
    icon: <Layers className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 2-3',
    dependencies: ['python-sdk', 'javascript-sdk'],
    deliverables: ['QASM compiler', 'Circuit optimizer', 'Error correction'],
    progress: 15,
    quarter: 'Q1',
    month: 2
  },

  // Month 3-4 (Advanced Features)
  {
    id: 'quantum-neural-networks',
    name: 'Quantum Neural Networks (QNN)',
    description: 'AI-powered quantum machine learning framework',
    icon: <Brain className="w-5 h-5" />,
    priority: 'High',
    status: 'Planning',
    timeline: 'Month 3-4',
    dependencies: ['hybrid-simulator'],
    deliverables: ['QNN architecture', 'Training algorithms', 'Model deployment'],
    progress: 10,
    quarter: 'Q2',
    month: 3
  },
  {
    id: 'rust-sdk',
    name: 'Rust SDK',
    description: 'High-performance quantum computing library for Rust',
    icon: <Code className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 3-4',
    dependencies: ['python-sdk', 'javascript-sdk'],
    deliverables: ['Core library', 'Performance benchmarks', 'Memory safety'],
    progress: 5,
    quarter: 'Q2',
    month: 3
  },
  {
    id: 'qml-toolkit',
    name: 'Quantum ML Toolkit',
    description: 'Complete suite for quantum machine learning applications',
    icon: <Target className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 3-4',
    dependencies: ['quantum-neural-networks'],
    deliverables: ['Pre-trained models', 'Training pipeline', 'Evaluation metrics'],
    progress: 0,
    quarter: 'Q2',
    month: 3
  },

  // Month 4-5 (Infrastructure & Performance)
  {
    id: 'gpu-tpu-acceleration',
    name: 'GPU/TPU Acceleration',
    description: 'Hardware acceleration for quantum simulations',
    icon: <Zap className="w-5 h-5" />,
    priority: 'High',
    status: 'Planning',
    timeline: 'Month 4-5',
    dependencies: ['hybrid-simulator'],
    deliverables: ['CUDA integration', 'TPU support', 'Performance optimization'],
    progress: 0,
    quarter: 'Q2',
    month: 4
  },
  {
    id: 'qpu-telemetry',
    name: 'Real-time QPU Telemetry',
    description: 'Live monitoring and analytics for quantum processors',
    icon: <Globe className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 4-5',
    dependencies: ['quantum-os-kernel'],
    deliverables: ['Telemetry dashboard', 'Performance metrics', 'Alert system'],
    progress: 0,
    quarter: 'Q2',
    month: 4
  },
  {
    id: 'deployment-engine',
    name: 'Quantum App Deployment Engine',
    description: 'Streamlined deployment for quantum applications',
    icon: <Rocket className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 4-5',
    dependencies: ['quantum-os-kernel', 'qfs-core'],
    deliverables: ['Container support', 'Auto-scaling', 'CI/CD integration'],
    progress: 0,
    quarter: 'Q2',
    month: 4
  },

  // Month 5-6 (Community & Ecosystem)
  {
    id: 'cloud-sandbox',
    name: 'Secure Cloud Sandbox',
    description: 'Isolated quantum computing environments in the cloud',
    icon: <Shield className="w-5 h-5" />,
    priority: 'High',
    status: 'Planning',
    timeline: 'Month 5-6',
    dependencies: ['deployment-engine'],
    deliverables: ['Sandbox environments', 'Security protocols', 'Resource limits'],
    progress: 0,
    quarter: 'Q2',
    month: 5
  },
  {
    id: 'community-hub',
    name: 'Community Hub',
    description: 'Collaborative platform for quantum developers',
    icon: <Users className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 5-6',
    dependencies: ['cloud-sandbox'],
    deliverables: ['Developer forums', 'Code sharing', 'Collaboration tools'],
    progress: 0,
    quarter: 'Q2',
    month: 5
  },
  {
    id: 'documentation-builder',
    name: 'Documentation Builder',
    description: 'Automated documentation generation for quantum projects',
    icon: <BookOpen className="w-5 h-5" />,
    priority: 'Medium',
    status: 'Planning',
    timeline: 'Month 5-6',
    dependencies: ['python-sdk', 'javascript-sdk', 'rust-sdk'],
    deliverables: ['Auto-generation', 'Interactive examples', 'API references'],
    progress: 0,
    quarter: 'Q2',
    month: 5
  },
  {
    id: 'marketplace',
    name: 'Marketplace Integration',
    description: 'Platform for sharing and monetizing quantum applications',
    icon: <Store className="w-5 h-5" />,
    priority: 'Low',
    status: 'Planning',
    timeline: 'Month 6',
    dependencies: ['community-hub', 'deployment-engine'],
    deliverables: ['App store', 'Payment system', 'Revenue sharing'],
    progress: 0,
    quarter: 'Q2',
    month: 6
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'Testing':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'In Progress':
      return <Clock className="w-4 h-4 text-blue-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'Low':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export const ProductRoadmap = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedModule, setSelectedModule] = useState<RoadmapModule | null>(null);

  const q1Modules = roadmapData.filter(m => m.quarter === 'Q1');
  const q2Modules = roadmapData.filter(m => m.quarter === 'Q2');
  
  const completedModules = roadmapData.filter(m => m.status === 'Completed').length;
  const inProgressModules = roadmapData.filter(m => m.status === 'In Progress').length;
  const overallProgress = Math.round((roadmapData.reduce((sum, m) => sum + m.progress, 0) / roadmapData.length));

  return (
    <section className="py-24 bg-gradient-to-br from-quantum-void/10 to-quantum-matrix/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--quantum-glow))/8,transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-quantum-plasma text-quantum-plasma mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            6-Month Development Plan
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Product{" "}
            <span className="bg-gradient-to-r from-quantum-glow to-quantum-neon bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our ambitious 6-month journey to revolutionize quantum computing with 20 core modules, 
            from foundational SDKs to advanced quantum neural networks and marketplace integration.
          </p>
          
          {/* Progress Overview */}
          <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <Card className="border-quantum-glow/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-glow">{overallProgress}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </CardContent>
            </Card>
            <Card className="border-quantum-neon/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-neon">{completedModules}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-quantum-plasma/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-plasma">{inProgressModules}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            <Card className="border-quantum-energy/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-energy">20</div>
                <div className="text-sm text-muted-foreground">Total Modules</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="details">Module Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quarterly Overview */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-quantum-glow/30 bg-gradient-to-br from-quantum-glow/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-xl text-quantum-glow flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Q1 2025: Foundation & Core (Months 1-3)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Building the foundational infrastructure and core SDKs
                  </div>
                  {q1Modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-quantum-glow">{module.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{module.name}</div>
                          <div className="text-xs text-muted-foreground">{module.timeline}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(module.status)}
                        <Progress value={module.progress} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-quantum-neon/30 bg-gradient-to-br from-quantum-neon/5 to-transparent">
                <CardHeader>
                  <CardTitle className="text-xl text-quantum-neon flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Q2 2025: Advanced Features & Ecosystem (Months 4-6)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Advanced AI features, performance optimization, and community tools
                  </div>
                  {q2Modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-quantum-neon">{module.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{module.name}</div>
                          <div className="text-xs text-muted-foreground">{module.timeline}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(module.status)}
                        <Progress value={module.progress} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Key Milestones */}
            <Card className="border-quantum-plasma/30">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Target className="w-5 h-5 mr-2 text-quantum-plasma" />
                  Key Milestones & Early Access Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-quantum-glow/10 to-transparent rounded-lg">
                    <div className="text-lg font-semibold text-quantum-glow mb-2">Month 2</div>
                    <div className="text-sm text-muted-foreground">Python SDK Early Access</div>
                    <div className="text-xs text-quantum-glow mt-1">Beta Release</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-quantum-neon/10 to-transparent rounded-lg">
                    <div className="text-lg font-semibold text-quantum-neon mb-2">Month 4</div>
                    <div className="text-sm text-muted-foreground">QNN Framework Launch</div>
                    <div className="text-xs text-quantum-neon mt-1">Public Alpha</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-quantum-plasma/10 to-transparent rounded-lg">
                    <div className="text-lg font-semibold text-quantum-plasma mb-2">Month 6</div>
                    <div className="text-sm text-muted-foreground">Full Platform Release</div>
                    <div className="text-xs text-quantum-plasma mt-1">General Availability</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            {/* Timeline View */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-quantum-glow via-quantum-neon to-quantum-plasma"></div>
              
              {Array.from({length: 6}, (_, i) => i + 1).map((month) => {
                const monthModules = roadmapData.filter(m => m.month === month);
                return (
                  <div key={month} className="relative pl-20 pb-12">
                    <div className="absolute left-6 w-4 h-4 bg-quantum-glow rounded-full border-4 border-background"></div>
                    <div className="bg-gradient-to-br from-quantum-void/20 to-quantum-matrix/20 rounded-lg p-6 border border-quantum-glow/20">
                      <h3 className="text-xl font-semibold mb-4 text-quantum-glow">Month {month}</h3>
                      <div className="grid gap-4">
                        {monthModules.map((module) => (
                          <div key={module.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="text-quantum-neon">{module.icon}</div>
                              <div>
                                <div className="font-medium">{module.name}</div>
                                <div className="text-sm text-muted-foreground">{module.description}</div>
                                <Badge className={`mt-2 ${getPriorityColor(module.priority)}`}>
                                  {module.priority} Priority
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(module.status)}
                                <span className="text-sm">{module.status}</span>
                              </div>
                              <Progress value={module.progress} className="w-20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Module List */}
              <Card className="lg:col-span-1 border-quantum-neon/20">
                <CardHeader>
                  <CardTitle className="text-lg">All Modules</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {roadmapData.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className={`w-full text-left p-3 hover:bg-quantum-glow/10 transition-colors ${
                          selectedModule?.id === module.id ? 'bg-quantum-glow/20 border-r-2 border-quantum-glow' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {module.icon}
                            <span className="text-sm font-medium">{module.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Module Details */}
              <Card className="lg:col-span-2 border-quantum-plasma/20">
                <CardContent className="p-6">
                  {selectedModule ? (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{selectedModule.name}</h3>
                          <p className="text-muted-foreground mb-4">{selectedModule.description}</p>
                          <div className="flex items-center gap-4">
                            <Badge className={getPriorityColor(selectedModule.priority)}>
                              {selectedModule.priority} Priority
                            </Badge>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(selectedModule.status)}
                              <span className="text-sm">{selectedModule.status}</span>
                            </div>
                            <Badge variant="outline">{selectedModule.timeline}</Badge>
                          </div>
                        </div>
                        <div className="text-quantum-glow">{selectedModule.icon}</div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Progress</h4>
                        <Progress value={selectedModule.progress} className="mb-2" />
                        <span className="text-sm text-muted-foreground">{selectedModule.progress}% Complete</span>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Key Deliverables</h4>
                        <ul className="space-y-2">
                          {selectedModule.deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-quantum-glow" />
                              <span className="text-sm">{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {selectedModule.dependencies.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Dependencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedModule.dependencies.map((dep, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {roadmapData.find(m => m.id === dep)?.name || dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-4">
                        Select a module from the list to view detailed information
                      </div>
                      <Button 
                        onClick={() => setSelectedModule(roadmapData[0])}
                        className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black"
                      >
                        View First Module
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto border-quantum-energy/30 bg-gradient-to-br from-quantum-energy/10 to-transparent">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Join the Early Access Program</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to experience these groundbreaking features as they're released. 
                Get exclusive access to beta versions and shape the future of quantum computing.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-quantum-glow to-quantum-neon text-black hover:from-quantum-neon hover:to-quantum-plasma"
              >
                Get Early Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
