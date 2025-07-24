
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Download, 
  GitFork, 
  Heart, 
  Share, 
  TrendingUp,
  Crown,
  Clock,
  Users
} from 'lucide-react';

interface CommunityAlgorithm {
  id: string;
  name: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  rating: number;
  downloads: number;
  forks: number;
  likes: number;
  category: string;
  tags: string[];
  isVerified: boolean;
  isTrending: boolean;
  lastUpdated: string;
  license: string;
}

const communityAlgorithms: CommunityAlgorithm[] = [
  {
    id: 'quantum-ml-classifier',
    name: 'Quantum ML Classifier',
    author: {
      name: 'Dr. Alice Chen',
      avatar: '/api/placeholder/32/32',
      verified: true
    },
    description: 'Variational quantum classifier for machine learning tasks with 94% accuracy on MNIST',
    rating: 4.8,
    downloads: 1250,
    forks: 89,
    likes: 156,
    category: 'Machine Learning',
    tags: ['ml', 'classification', 'variational', 'mnist'],
    isVerified: true,
    isTrending: true,
    lastUpdated: '2 days ago',
    license: 'MIT'
  },
  {
    id: 'portfolio-optimization',
    name: 'QAOA Portfolio Optimizer',
    author: {
      name: 'Bob Martinez',
      avatar: '/api/placeholder/32/32',
      verified: false
    },
    description: 'Quantum Approximate Optimization Algorithm for financial portfolio optimization',
    rating: 4.6,
    downloads: 892,
    forks: 45,
    likes: 78,
    category: 'Finance',
    tags: ['qaoa', 'optimization', 'finance', 'portfolio'],
    isVerified: false,
    isTrending: true,
    lastUpdated: '1 week ago',
    license: 'Apache 2.0'
  },
  {
    id: 'drug-discovery-vqe',
    name: 'Molecular VQE Simulator',
    author: {
      name: 'QuantumBioLab',
      avatar: '/api/placeholder/32/32',
      verified: true
    },
    description: 'VQE implementation for molecular simulation in drug discovery applications',
    rating: 4.9,
    downloads: 567,
    forks: 34,
    likes: 123,
    category: 'Chemistry',
    tags: ['vqe', 'molecular', 'drug-discovery', 'chemistry'],
    isVerified: true,
    isTrending: false,
    lastUpdated: '3 days ago',
    license: 'MIT'
  },
  {
    id: 'quantum-game-theory',
    name: 'Quantum Game Theory Solver',
    author: {
      name: 'GameTheoryAI',
      avatar: '/api/placeholder/32/32',
      verified: false
    },
    description: 'Quantum algorithms for solving complex game theory problems and Nash equilibria',
    rating: 4.4,
    downloads: 234,
    forks: 12,
    likes: 45,
    category: 'Game Theory',
    tags: ['game-theory', 'nash', 'equilibrium', 'strategy'],
    isVerified: false,
    isTrending: false,
    lastUpdated: '1 month ago',
    license: 'GPL 3.0'
  }
];

interface AlgorithmMarketplaceProps {
  searchQuery: string;
}

export function AlgorithmMarketplace({ searchQuery }: AlgorithmMarketplaceProps) {
  const [selectedTab, setSelectedTab] = useState('trending');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<CommunityAlgorithm | null>(null);

  const filteredAlgorithms = communityAlgorithms.filter(algorithm =>
    algorithm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    algorithm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    algorithm.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const trendingAlgorithms = filteredAlgorithms.filter(a => a.isTrending);
  const verifiedAlgorithms = filteredAlgorithms.filter(a => a.isVerified);
  const recentAlgorithms = filteredAlgorithms.sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );

  const renderAlgorithmCard = (algorithm: CommunityAlgorithm) => (
    <Card key={algorithm.id} className="quantum-panel neon-border hover:neon-glow transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={algorithm.author.avatar} />
              <AvatarFallback>{algorithm.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
                {algorithm.name}
                {algorithm.isVerified && <Crown className="w-4 h-4 text-yellow-500" />}
                {algorithm.isTrending && <TrendingUp className="w-4 h-4 text-green-500" />}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-quantum-particle">by {algorithm.author.name}</span>
                {algorithm.author.verified && <Badge variant="secondary" className="text-xs">Verified</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-xs text-quantum-neon">{algorithm.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-quantum-particle">{algorithm.description}</p>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {algorithm.category}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {algorithm.license}
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="text-quantum-neon font-mono">{algorithm.downloads}</div>
            <div className="text-quantum-particle">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-quantum-energy font-mono">{algorithm.forks}</div>
            <div className="text-quantum-particle">Forks</div>
          </div>
          <div className="text-center">
            <div className="text-quantum-glow font-mono">{algorithm.likes}</div>
            <div className="text-quantum-particle">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-quantum-matrix font-mono text-xs">{algorithm.lastUpdated}</div>
            <div className="text-quantum-particle">Updated</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Download className="w-3 h-3 mr-1" />
            Install
          </Button>
          <Button size="sm" variant="outline">
            <GitFork className="w-3 h-3 mr-1" />
            Fork
          </Button>
          <Button size="sm" variant="outline">
            <Heart className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Share className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {algorithm.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-3">
            <Users className="w-6 h-6" />
            Community Algorithm Marketplace
            <Badge variant="outline" className="text-quantum-energy">
              {filteredAlgorithms.length} algorithms
            </Badge>
          </CardTitle>
          <p className="text-quantum-particle">
            Discover, share, and collaborate on quantum algorithms created by the community
          </p>
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="trending" className="quantum-tab">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending ({trendingAlgorithms.length})
          </TabsTrigger>
          <TabsTrigger value="verified" className="quantum-tab">
            <Crown className="w-4 h-4 mr-2" />
            Verified ({verifiedAlgorithms.length})
          </TabsTrigger>
          <TabsTrigger value="recent" className="quantum-tab">
            <Clock className="w-4 h-4 mr-2" />
            Recent ({recentAlgorithms.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="quantum-tab">
            All ({filteredAlgorithms.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingAlgorithms.map(renderAlgorithmCard)}
          </div>
        </TabsContent>

        <TabsContent value="verified" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {verifiedAlgorithms.map(renderAlgorithmCard)}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentAlgorithms.map(renderAlgorithmCard)}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAlgorithms.map(renderAlgorithmCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Submit Algorithm Section */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg text-quantum-glow">Share Your Algorithm</CardTitle>
          <p className="text-quantum-particle">
            Contribute to the quantum computing community by sharing your algorithms
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="flex-1">
              Submit Algorithm
            </Button>
            <Button variant="outline">
              View Guidelines
            </Button>
            <Button variant="outline">
              Join Community
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
