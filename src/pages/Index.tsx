
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { 
  Activity, 
  Zap, 
  Code, 
  Globe, 
  Users, 
  Star, 
  ArrowRight,
  ChevronRight,
  Github,
  BookOpen,
  Puzzle,
  Cpu,
  MemoryStick,
  FileText,
  Wrench,
  Download,
  Play,
  Microscope,
  Layers,
  Settings,
  Binary,
  Atom,
  Network,
  Shield,
  Sparkles,
  Rocket,
  Target,
  Lightbulb,
  Database,
  Cloud,
  Lock,
  Smartphone,
  MonitorSpeaker,
  Headphones,
  Gamepad2,
  Camera,
  Music,
  Video,
  Image,
  FileCode,
  Terminal,
  Server,
  HardDrive,
  Wifi,
  Bluetooth,
  Usb,
  Printer,
  Keyboard,
  Mouse,
  Webcam,
  Speaker,
  Headset,
  Tablet,
  Watch,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Bus,
  Truck,
  Dna,
  Beaker,
  TestTube,
  Pipette,
  Syringe,
  Stethoscope,
  Thermometer,
  Scale,
  Calculator,
  Ruler,
  Compass,
  Eraser,
  Pen,
  Pencil,
  Brush,
  Palette,
  Scissors,
  Paperclip,
  Folder,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Trash,
  Search,
  Filter,
  Grid,
  List,
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  Store,
  Building,
  Home,
  MapPin,
  Map,
  Navigation,
  Flag,
  Clock,
  Calendar,
  Timer,
  Bell,
  Volume,
  VolumeX,
  Volume1,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Percent,
  Plus,
  Minus,
  X,
  Check,
  Info,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  MessageSquare,
  Mail,
  Send,
  Inbox,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Videotape,
  Clapperboard,
  Film,
  Tv,
  Radio,
  Podcast,
  Rss,
  Newspaper,
  Book,
  Library,
  GraduationCap,
  Award,
  Medal,
  Trophy,
  Crown,
  Gem,
  Gift,
  PartyPopper,
  Cake,
  Coffee,
  Wine,
  Beer,
  Utensils,
  ChefHat,
  Pizza,
  Sandwich,
  Salad,
  Soup,
  IceCream,
  Cookie,
  Donut,
  Candy,
  Lollipop,
  Cherry,
  Apple,
  Banana,
  Grape,
  Carrot,
  Flower,
  TreePine,
  Fish,
  Meat,
  Chicken,
  Beef,
  Pork,
  Lamb,
  Turkey,
  Duck,
  Goose,
  Rabbit,
  Deer,
  Elk,
  Moose,
  Bear,
  Wolf,
  Fox,
  Raccoon,
  Squirrel,
  Chipmunk,
  Beaver,
  Otter,
  Seal,
  Whale,
  Dolphin,
  Shark,
  Octopus,
  Crab,
  Lobster,
  Shrimp,
  Oyster,
  Clam,
  Mussel,
  Scallop,
  Jellyfish,
  Seahorse,
  Starfish,
  Turtle,
  Frog,
  Toad,
  Salamander,
  Lizard,
  Snake,
  Crocodile,
  Alligator,
  Iguana,
  Chameleon,
  Gecko
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Cpu className="w-12 h-12 text-quantum-glow" />,
      title: "Quantum Circuit Builder",
      description: "Visual drag-and-drop interface for creating quantum circuits with real-time simulation"
    },
    {
      icon: <Code className="w-12 h-12 text-quantum-glow" />,
      title: "Multi-Language SDK",
      description: "Python, JavaScript, and C++ SDKs with comprehensive quantum algorithm libraries"
    },
    {
      icon: <Globe className="w-12 h-12 text-quantum-glow" />,
      title: "Hardware Integration",
      description: "Connect to IBM Quantum, Google Cirq, and other quantum hardware platforms"
    },
    {
      icon: <Users className="w-12 h-12 text-quantum-glow" />,
      title: "Collaborative Development",
      description: "Real-time collaboration tools for quantum computing teams and researchers"
    }
  ];

  const algorithms = [
    { name: "Grover's Search", description: "Quantum search algorithm", icon: <Search className="w-6 h-6" /> },
    { name: "Shor's Algorithm", description: "Integer factorization", icon: <Calculator className="w-6 h-6" /> },
    { name: "Quantum Fourier Transform", description: "Frequency analysis", icon: <Zap className="w-6 h-6" /> },
    { name: "Variational Quantum Eigensolver", description: "Optimization problems", icon: <Target className="w-6 h-6" /> }
  ];

  const integrations = [
    { name: "IBM Quantum", logo: <Cpu className="w-8 h-8" /> },
    { name: "Google Cirq", logo: <Globe className="w-8 h-8" /> },
    { name: "Microsoft Azure", logo: <Cloud className="w-8 h-8" /> },
    { name: "Amazon Braket", logo: <Database className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-quantum-void">
      {/* Header */}
      <header className="border-b border-quantum-matrix bg-quantum-void/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-quantum-glow particle-animation" />
              <h1 className="text-2xl font-bold text-quantum-glow">Quantum OS</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tutorials" className="text-quantum-neon hover:text-quantum-glow transition-colors">
                Tutorials
              </Link>
              <Link to="/sdk" className="text-quantum-neon hover:text-quantum-glow transition-colors">
                SDK
              </Link>
              <Link to="/api" className="text-quantum-neon hover:text-quantum-glow transition-colors">
                API
              </Link>
              <Link to="/roadmap" className="text-quantum-neon hover:text-quantum-glow transition-colors">
                Roadmap
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-quantum-glow">
              The Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-glow to-quantum-neon">
                {" "}Quantum Computing
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-quantum-neon font-mono">
              Build, simulate, and deploy quantum circuits with our comprehensive development platform
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-quantum-matrix hover:bg-quantum-matrix text-quantum-neon"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-quantum-glow">
              Powerful Features
            </h3>
            <p className="text-quantum-neon text-lg max-w-2xl mx-auto">
              Everything you need to develop quantum applications in one integrated platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="quantum-panel border-quantum-matrix">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-quantum-glow">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-quantum-neon">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 px-4 bg-quantum-matrix/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-quantum-glow">
              Quick Start
            </h3>
            <p className="text-quantum-neon text-lg max-w-2xl mx-auto">
              Get up and running with quantum computing in minutes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="quantum-panel border-quantum-matrix">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-quantum-glow text-quantum-void">1</Badge>
                  <CardTitle className="text-quantum-glow">Create Account</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">Sign up for free and access the quantum development environment</p>
                <Button
                  variant="outline"
                  className="w-full border-quantum-matrix hover:bg-quantum-matrix"
                  onClick={() => navigate('/auth')}
                >
                  Sign Up Now
                </Button>
              </CardContent>
            </Card>

            <Card className="quantum-panel border-quantum-matrix">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-quantum-glow text-quantum-void">2</Badge>
                  <CardTitle className="text-quantum-glow">Build Circuit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">Use our visual circuit builder to create your first quantum program</p>
                <Button
                  variant="outline"
                  className="w-full border-quantum-matrix hover:bg-quantum-matrix"
                  onClick={() => navigate('/circuit-builder')}
                >
                  Try Circuit Builder
                </Button>
              </CardContent>
            </Card>

            <Card className="quantum-panel border-quantum-matrix">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-quantum-glow text-quantum-void">3</Badge>
                  <CardTitle className="text-quantum-glow">Run Simulation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">Execute your quantum circuits with our high-performance simulator</p>
                <Button
                  variant="outline"
                  className="w-full border-quantum-matrix hover:bg-quantum-matrix"
                  onClick={() => navigate('/tutorials')}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-quantum-glow">
              Quantum Algorithms
            </h3>
            <p className="text-quantum-neon text-lg max-w-2xl mx-auto">
              Pre-built implementations of famous quantum algorithms
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.map((algorithm, index) => (
              <Card key={index} className="quantum-panel border-quantum-matrix hover:border-quantum-glow/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-quantum-glow">{algorithm.icon}</div>
                    <CardTitle className="text-sm text-quantum-glow">{algorithm.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-quantum-neon text-sm">{algorithm.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 bg-quantum-matrix/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-quantum-glow">
              Hardware Integrations
            </h3>
            <p className="text-quantum-neon text-lg max-w-2xl mx-auto">
              Connect to leading quantum hardware providers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="quantum-panel border-quantum-matrix hover:border-quantum-glow/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="text-quantum-glow mb-3 flex justify-center">
                    {integration.logo}
                  </div>
                  <h4 className="text-quantum-glow font-semibold">{integration.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-quantum-glow">
              Ready to Enter the Quantum Realm?
            </h3>
            <p className="text-xl mb-8 text-quantum-neon">
              Join thousands of developers and researchers building the future of computing
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void font-semibold"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Building
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-quantum-matrix hover:bg-quantum-matrix text-quantum-neon"
              >
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-quantum-matrix py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-quantum-glow" />
                <h4 className="text-quantum-glow font-semibold">Quantum OS</h4>
              </div>
              <p className="text-quantum-neon text-sm">
                The comprehensive platform for quantum computing development and research.
              </p>
            </div>
            <div>
              <h5 className="text-quantum-glow font-semibold mb-3">Product</h5>
              <ul className="space-y-2">
                <li><Link to="/circuit-builder" className="text-quantum-neon hover:text-quantum-glow text-sm">Circuit Builder</Link></li>
                <li><Link to="/sdk" className="text-quantum-neon hover:text-quantum-glow text-sm">SDK</Link></li>
                <li><Link to="/api" className="text-quantum-neon hover:text-quantum-glow text-sm">API</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-quantum-glow font-semibold mb-3">Resources</h5>
              <ul className="space-y-2">
                <li><Link to="/tutorials" className="text-quantum-neon hover:text-quantum-glow text-sm">Tutorials</Link></li>
                <li><Link to="/roadmap" className="text-quantum-neon hover:text-quantum-glow text-sm">Roadmap</Link></li>
                <li><Link to="/integrations" className="text-quantum-neon hover:text-quantum-glow text-sm">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-quantum-glow font-semibold mb-3">Community</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-quantum-neon hover:text-quantum-glow text-sm">Discord</a></li>
                <li><a href="#" className="text-quantum-neon hover:text-quantum-glow text-sm">GitHub</a></li>
                <li><a href="#" className="text-quantum-neon hover:text-quantum-glow text-sm">Documentation</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-quantum-matrix" />
          <div className="text-center text-quantum-neon text-sm">
            <p>&copy; 2024 Quantum OS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
