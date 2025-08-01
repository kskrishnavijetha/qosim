
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, Filter, Star, Download, Plus, Zap, Cpu, BookOpen, GraduationCap } from 'lucide-react';

const categoryIcons = {
  'zap': Zap,
  'cpu': Cpu,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
};

export function MarketplacePanel() {
  const { items, categories, userItems, loading } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderItemCard = (item: any) => {
    const IconComponent = categoryIcons[item.category?.icon as keyof typeof categoryIcons] || Zap;
    
    return (
      <Card key={item.id} className="quantum-panel border-quantum-glow/20 hover:border-quantum-glow/40 transition-all cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="w-5 h-5 text-quantum-glow" />
              <CardTitle className="text-sm text-quantum-glow">{item.title}</CardTitle>
            </div>
            <Badge variant={item.is_free ? "secondary" : "default"} className="text-xs">
              {item.is_free ? 'Free' : `$${(item.price_cents / 100).toFixed(2)}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-quantum-neon" />
                <span>{item.rating_average.toFixed(1)}</span>
                <span className="text-muted-foreground">({item.rating_count})</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3 text-quantum-glow" />
                <span>{item.downloads_count}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              v{item.version}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-quantum-glow hover:bg-quantum-glow/80 text-black">
              {item.is_free ? 'Download' : 'Buy Now'}
            </Button>
            <Button size="sm" variant="outline" className="border-quantum-glow/30">
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full bg-quantum-void text-quantum-glow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-quantum-glow">Quantum Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Discover, share, and monetize quantum computing resources
          </p>
        </div>
        <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Create Item
        </Button>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="purchased">Purchased</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search circuits, algorithms, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="border-quantum-glow/30">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-quantum-glow text-black" : ""}
            >
              All Categories
            </Button>
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || Zap;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-quantum-glow text-black" : ""}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="quantum-panel animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-quantum-matrix rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-quantum-matrix rounded w-full"></div>
                      <div className="h-3 bg-quantum-matrix rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No items found matching your criteria.</p>
              </div>
            ) : (
              filteredItems.map(renderItemCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-items" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">You haven't created any items yet.</p>
                <Button className="mt-4 bg-quantum-glow hover:bg-quantum-glow/80 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Item
                </Button>
              </div>
            ) : (
              userItems.map(renderItemCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="purchased" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Your purchased items will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
