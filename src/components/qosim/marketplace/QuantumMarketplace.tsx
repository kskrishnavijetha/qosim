
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Search, 
  Star, 
  Download, 
  Upload,
  TrendingUp,
  Heart,
  Share,
  DollarSign,
  Filter
} from 'lucide-react';

export function QuantumMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('circuits');

  const marketplaceItems = {
    circuits: [
      {
        id: 'bell-state-pro',
        title: 'Bell State Generator Pro',
        author: 'QuantumDev',
        description: 'Advanced Bell state circuit with error correction',
        price: 'Free',
        rating: 4.8,
        downloads: 1234,
        category: 'Entanglement',
        tags: ['bell-state', 'entanglement', 'error-correction'],
        preview: '|0⟩ → (|00⟩ + |11⟩)/√2'
      },
      {
        id: 'grover-optimized',
        title: 'Optimized Grover Search',
        author: 'AlgorithmMaster',
        description: 'Highly optimized Grover algorithm implementation',
        price: '$9.99',
        rating: 4.9,
        downloads: 856,
        category: 'Algorithms',
        tags: ['grover', 'search', 'optimization'],
        preview: 'O(√N) search complexity'
      },
      {
        id: 'qft-variational',
        title: 'Variational QFT',
        author: 'QuantumLab',
        description: 'Variational quantum Fourier transform circuit',
        price: '$15.99',
        rating: 4.7,
        downloads: 645,
        category: 'Transforms',
        tags: ['qft', 'variational', 'optimization'],
        preview: 'NISQ-friendly QFT'
      }
    ],
    algorithms: [
      {
        id: 'vqe-toolkit',
        title: 'VQE Toolkit',
        author: 'QuantumChem',
        description: 'Variational quantum eigensolver for chemistry',
        price: '$29.99',
        rating: 4.9,
        downloads: 423,
        category: 'Chemistry',
        tags: ['vqe', 'chemistry', 'eigensolver'],
        preview: 'Molecular ground state finder'
      },
      {
        id: 'qaoa-optimizer',
        title: 'QAOA Optimizer',
        author: 'OptimizationPro',
        description: 'Quantum approximate optimization algorithm',
        price: '$19.99',
        rating: 4.6,
        downloads: 567,
        category: 'Optimization',
        tags: ['qaoa', 'optimization', 'combinatorial'],
        preview: 'Combinatorial optimization'
      }
    ],
    tutorials: [
      {
        id: 'quantum-ml',
        title: 'Quantum Machine Learning Guide',
        author: 'MLQuantum',
        description: 'Complete guide to quantum machine learning',
        price: '$24.99',
        rating: 4.8,
        downloads: 789,
        category: 'Education',
        tags: ['machine-learning', 'tutorial', 'qml'],
        preview: 'From basics to advanced QML'
      },
      {
        id: 'hardware-guide',
        title: 'Quantum Hardware Deep Dive',
        author: 'HardwareGuru',
        description: 'Understanding quantum hardware architectures',
        price: '$34.99',
        rating: 4.9,
        downloads: 345,
        category: 'Hardware',
        tags: ['hardware', 'superconducting', 'ion-trap'],
        preview: 'Complete hardware overview'
      }
    ]
  };

  const categories = {
    circuits: { name: 'Circuits', icon: '🔌' },
    algorithms: { name: 'Algorithms', icon: '⚡' },
    tutorials: { name: 'Tutorials', icon: '📚' }
  };

  const filteredItems = marketplaceItems[selectedCategory as keyof typeof marketplaceItems].filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Quantum Marketplace</h2>
          <p className="text-quantum-particle">
            Discover, share, and collaborate on quantum circuits and algorithms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="neon-border">
            <Upload className="w-4 h-4 mr-2" />
            Upload Item
          </Button>
          <Button variant="outline" className="neon-border">
            <TrendingUp className="w-4 h-4 mr-2" />
            My Sales
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-quantum-particle w-4 h-4" />
          <Input
            type="text"
            placeholder="Search circuits, algorithms, tutorials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 quantum-input"
          />
        </div>
        <Button variant="outline" className="neon-border">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 quantum-tabs">
          {Object.entries(categories).map(([key, category]) => (
            <TabsTrigger key={key} value={key} className="quantum-tab">
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categories).map(([key, category]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="quantum-panel neon-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-quantum-glow text-lg">
                        {item.title}
                      </CardTitle>
                      <Badge variant="outline" className="neon-border">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-quantum-particle">by {item.author}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(item.rating)}
                        <span className="text-xs text-quantum-particle ml-1">
                          ({item.rating})
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-quantum-particle text-sm">
                      {item.description}
                    </p>
                    
                    <div className="bg-quantum-matrix/30 p-3 rounded">
                      <div className="text-xs text-quantum-energy font-mono">
                        {item.preview}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="neon-border text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-quantum-particle" />
                          <span className="text-xs text-quantum-particle">
                            {item.downloads}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-quantum-glow" />
                          <span className="text-sm font-medium text-quantum-glow">
                            {item.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="neon-border"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="neon-border"
                        >
                          <Share className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="neon-border"
                        >
                          {item.price === 'Free' ? 'Download' : 'Buy'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Marketplace Stats */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Marketplace Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-neon">2,847</div>
              <div className="text-sm text-quantum-particle">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-neon">1,234</div>
              <div className="text-sm text-quantum-particle">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-neon">45,678</div>
              <div className="text-sm text-quantum-particle">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-quantum-neon">$12,345</div>
              <div className="text-sm text-quantum-particle">Creator Earnings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
