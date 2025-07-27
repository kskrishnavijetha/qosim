
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Search, 
  Star, 
  Download, 
  DollarSign,
  Heart,
  TrendingUp,
  Award,
  Filter
} from 'lucide-react';

export function QuantumMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const marketplaceItems = [
    {
      id: 1,
      title: 'Advanced Bell State Generator',
      author: 'QuantumExpert',
      description: 'Optimized Bell state creation with error correction',
      category: 'Circuits',
      price: 9.99,
      rating: 4.8,
      downloads: 1247,
      tags: ['Bell States', 'Error Correction', 'Optimization'],
      featured: true
    },
    {
      id: 2,
      title: 'Grover Search Tutorial Series',
      author: 'AlgorithmMaster',
      description: 'Complete tutorial on Grover\'s algorithm implementation',
      category: 'Tutorials',
      price: 0,
      rating: 4.9,
      downloads: 2853,
      tags: ['Grover', 'Tutorial', 'Algorithms'],
      featured: false
    },
    {
      id: 3,
      title: 'Quantum ML Model Pack',
      author: 'MLQuantum',
      description: 'Pre-trained quantum machine learning models',
      category: 'Models',
      price: 24.99,
      rating: 4.6,
      downloads: 589,
      tags: ['Machine Learning', 'VQE', 'QAOA'],
      featured: true
    },
    {
      id: 4,
      title: 'Shor\'s Algorithm Implementation',
      author: 'CryptoBreaker',
      description: 'Complete Shor\'s algorithm with optimization',
      category: 'Algorithms',
      price: 15.99,
      rating: 4.7,
      downloads: 892,
      tags: ['Shor', 'Cryptography', 'Factoring'],
      featured: false
    }
  ];

  const categories = ['all', 'Circuits', 'Algorithms', 'Tutorials', 'Models', 'Tools'];

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.downloads - a.downloads;
      case 'rating': return b.rating - a.rating;
      case 'price': return a.price - b.price;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quantum Marketplace</h2>
          <p className="text-muted-foreground">Discover and share quantum circuits, algorithms, and tutorials</p>
        </div>
        <Button>
          <DollarSign className="w-4 h-4 mr-2" />
          Sell Your Creation
        </Button>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search circuits, algorithms, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedItems.map(item => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {item.author}</p>
                    </div>
                    {item.featured && (
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.downloads}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {item.price === 0 ? 'Free' : `$${item.price}`}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      {item.price === 0 ? 'Download' : 'Buy Now'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceItems.filter(item => item.featured).map(item => (
              <Card key={item.id} className="border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Get Featured Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-items" className="space-y-4">
          <div className="text-center py-8">
            <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Start Selling</h3>
            <p className="text-muted-foreground mb-4">
              Share your quantum circuits and algorithms with the community
            </p>
            <Button>
              <DollarSign className="w-4 h-4 mr-2" />
              Upload Your First Item
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Total Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5,581</div>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,247</div>
                <p className="text-sm text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.7</div>
                <p className="text-sm text-muted-foreground">Across all items</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
