
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityHub } from '@/hooks/useCommunityHub';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Pin, 
  Lock, 
  Eye, 
  Reply,
  Plus,
  Star,
  GitBranch
} from 'lucide-react';

export function CommunityHubPanel() {
  const { forums, topics, loading, fetchTopics, createTopic } = useCommunityHub();
  const [selectedForum, setSelectedForum] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  const handleForumSelect = (forumId: string) => {
    setSelectedForum(forumId);
    fetchTopics(forumId);
  };

  const handleCreateTopic = async () => {
    if (!selectedForum || !newTopicTitle.trim()) return;
    
    const result = await createTopic(selectedForum, newTopicTitle, 'Topic content...');
    if (result) {
      setNewTopicTitle('');
      setShowCreateTopic(false);
    }
  };

  const renderForumCard = (forum: any) => (
    <Card 
      key={forum.id} 
      className="quantum-panel border-quantum-glow/20 hover:border-quantum-glow/40 transition-all cursor-pointer"
      onClick={() => handleForumSelect(forum.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          {forum.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          {forum.description}
        </p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>Topics: 0</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Members: 0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTopicCard = (topic: any) => (
    <Card key={topic.id} className="quantum-panel border-quantum-glow/20 hover:border-quantum-glow/40 transition-all cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {topic.is_pinned && <Pin className="w-4 h-4 text-quantum-neon" />}
              {topic.is_locked && <Lock className="w-4 h-4 text-muted-foreground" />}
              <h3 className="font-medium text-quantum-glow text-sm">{topic.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {topic.content}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{topic.views_count} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Reply className="w-3 h-3" />
                <span>{topic.replies_count} replies</span>
              </div>
              <span>Created: {new Date(topic.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full bg-quantum-void text-quantum-glow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-quantum-glow">Community Hub</h1>
          <p className="text-sm text-muted-foreground">
            Connect, collaborate, and learn with the quantum community
          </p>
        </div>
      </div>

      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="projects">Collaborate</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="space-y-4">
          {!selectedForum ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-quantum-glow">Discussion Forums</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forums.map(renderForumCard)}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedForum(null)}
                  >
                    ← Back to Forums
                  </Button>
                  <h2 className="text-lg font-semibold text-quantum-glow">
                    {forums.find(f => f.id === selectedForum)?.name}
                  </h2>
                </div>
                <Button 
                  className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
                  onClick={() => setShowCreateTopic(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Topic
                </Button>
              </div>

              {showCreateTopic && (
                <Card className="quantum-panel border-quantum-glow/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Input
                        placeholder="Topic title..."
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleCreateTopic}
                          className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
                        >
                          Create Topic
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setShowCreateTopic(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="quantum-panel animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-quantum-matrix rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-quantum-matrix rounded w-full mb-1"></div>
                        <div className="h-3 bg-quantum-matrix rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : topics.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No topics yet. Start the conversation!</p>
                  </div>
                ) : (
                  topics.map(renderTopicCard)
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-quantum-glow">Collaboration Projects</h2>
            <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <div className="text-center py-12">
            <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Collaborative projects will appear here.</p>
          </div>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Community profiles coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Community leaderboard coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
