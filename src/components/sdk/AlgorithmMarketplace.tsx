
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Upload, Download, GitFork, Heart, MessageSquare, Plus, Filter } from 'lucide-react';
import { AlgorithmCard } from './AlgorithmCard';

interface MarketplaceAlgorithm {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  qubits: number;
  gates: number;
  runtime: string;
  rating: number;
  downloads: number;
  likes: number;
  forks: number;
  comments: number;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isFeatured: boolean;
  code: {
    javascript: string;
    python: string;
    qasm: string;
  };
}

const marketplaceAlgorithms: MarketplaceAlgorithm[] = [
  {
    id: 'community-vqe-h2o',
    name: "VQE for H2O Molecule",
    description: "Optimized VQE implementation for water molecule ground state",
    category: 'Chemistry',
    difficulty: 'Advanced',
    qubits: 6,
    gates: 85,
    runtime: '~120ms',
    rating: 4.8,
    downloads: 892,
    likes: 156,
    forks: 23,
    comments: 8,
    author: 'ChemQuantum',
    tags: ['vqe', 'chemistry', 'water', 'optimization'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    isVerified: true,
    isFeatured: true,
    code: {
      javascript: `// VQE for H2O
const sdk = new QOSimSDK();
const vqe = sdk.vqe({
  molecule: 'H2O',
  basis: 'sto-3g',
  ansatz: 'UCCSD'
});`,
      python: `# VQE for H2O
from qosim import QOSimSDK
sdk = QOSimSDK()
vqe = sdk.vqe(molecule='H2O', basis='sto-3g', ansatz='UCCSD')`,
      qasm: `// VQE H2O QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[6];
creg c[6];`
    }
  },
  {
    id: 'quantum-ml-classifier',
    name: "Quantum ML Classifier",
    description: "Quantum machine learning for binary classification",
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    qubits: 4,
    gates: 32,
    runtime: '~45ms',
    rating: 4.6,
    downloads: 1240,
    likes: 89,
    forks: 31,
    comments: 12,
    author: 'MLQuantum',
    tags: ['ml', 'classification', 'variational', 'data'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22',
    isVerified: true,
    isFeatured: false,
    code: {
      javascript: `// Quantum ML Classifier
const sdk = new QOSimSDK();
const classifier = sdk.qml({
  type: 'binary',
  features: 4,
  circuit: 'variational'
});`,
      python: `# Quantum ML Classifier
from qosim import QOSimSDK
sdk = QOSimSDK()
classifier = sdk.qml(type='binary', features=4, circuit='variational')`,
      qasm: `// QML QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[4];
creg c[4];`
    }
  },
  {
    id: 'quantum-walk-graph',
    name: "Quantum Walk on Graph",
    description: "Continuous-time quantum walk implementation",
    category: 'Algorithms',
    difficulty: 'Advanced',
    qubits: 8,
    gates: 124,
    runtime: '~200ms',
    rating: 4.4,
    downloads: 567,
    likes: 78,
    forks: 15,
    comments: 5,
    author: 'GraphWalker',
    tags: ['quantum-walk', 'graph', 'continuous-time', 'simulation'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-18',
    isVerified: false,
    isFeatured: false,
    code: {
      javascript: `// Quantum Walk
const sdk = new QOSimSDK();
const walk = sdk.quantumWalk({
  graph: adjacencyMatrix,
  time: 10,
  startNode: 0
});`,
      python: `# Quantum Walk
from qosim import QOSimSDK
sdk = QOSimSDK()
walk = sdk.quantum_walk(graph=adjacency_matrix, time=10, start_node=0)`,
      qasm: `// Quantum Walk QASM
OPENQASM 2.0;
include "qelib1.inc";
qreg q[8];
creg c[8];`
    }
  }
];

interface AlgorithmMarketplaceProps {
  searchQuery: string;
}

export function AlgorithmMarketplace({ searchQuery }: AlgorithmMarketplaceProps) {
  const [sortBy, setSortBy] = useState('trending');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const filteredAlgorithms = marketplaceAlgorithms.filter(algo => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVerified = !filterVerified || algo.isVerified;
    const matchesFeatured = !filterFeatured || algo.isFeatured;
    
    return matchesSearch && matchesVerified && matchesFeatured;
  });

  const sortedAlgorithms = filteredAlgorithms.sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.likes + b.forks + b.downloads) - (a.likes + a.forks + a.downloads);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Algorithm Marketplace</h2>
          <p className="text-quantum-neon">Discover, share, and collaborate on quantum algorithms</p>
        </div>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neon-border">
              <Upload className="w-4 h-4 mr-2" />
              Upload Algorithm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-quantum-void border-quantum-neon">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">Upload New Algorithm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Algorithm Name
                  </label>
                  <Input placeholder="Enter algorithm name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Category
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="algorithms">Algorithms</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                      <SelectItem value="optimization">Optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-quantum-neon mb-2">
                  Description
                </label>
                <Textarea 
                  placeholder="Describe your algorithm..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Qubits
                  </label>
                  <Input type="number" placeholder="4" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Gates
                  </label>
                  <Input type="number" placeholder="20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Difficulty
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-quantum-neon mb-2">
                  Code (JavaScript)
                </label>
                <Textarea 
                  placeholder="// Your quantum algorithm code here..."
                  className="font-mono min-h-[150px]"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="neon-border">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Algorithm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Sort */}
      <Card className="quantum-panel neon-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={filterVerified ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterVerified(!filterVerified)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Verified Only
                </Button>
                <Button
                  variant={filterFeatured ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterFeatured(!filterFeatured)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Featured
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-quantum-particle">
              {filteredAlgorithms.length} algorithms found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAlgorithms.map(algorithm => (
          <Card key={algorithm.id} className="quantum-panel neon-border hover:shadow-lg hover:shadow-quantum-glow/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-quantum-glow">{algorithm.name}</CardTitle>
                <div className="flex items-center gap-1">
                  {algorithm.isVerified && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">Verified</Badge>
                  )}
                  {algorithm.isFeatured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Featured</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-quantum-neon mt-2">{algorithm.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Algorithm Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-quantum-particle" />
                  <span className="text-quantum-neon">{algorithm.rating}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-quantum-particle" />
                  <span className="text-quantum-neon">{algorithm.downloads}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-quantum-particle" />
                  <span className="text-quantum-neon">{algorithm.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-quantum-particle" />
                  <span className="text-quantum-neon">{algorithm.forks}</span>
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between text-xs text-quantum-particle">
                <span>by {algorithm.author}</span>
                <span>{new Date(algorithm.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {algorithm.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 neon-border" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  <GitFork className="w-4 h-4 mr-2" />
                  Fork
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
