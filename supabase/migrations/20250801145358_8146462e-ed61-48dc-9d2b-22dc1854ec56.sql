
-- Create marketplace categories table
CREATE TABLE public.marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_category_id UUID REFERENCES public.marketplace_categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketplace items table
CREATE TABLE public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('circuit', 'algorithm', 'tutorial', 'learning_module')),
  category_id UUID REFERENCES public.marketplace_categories(id),
  content_data JSONB NOT NULL DEFAULT '{}',
  price_cents INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  version TEXT DEFAULT '1.0.0',
  downloads_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketplace item versions table
CREATE TABLE public.marketplace_item_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  version TEXT NOT NULL,
  content_data JSONB NOT NULL DEFAULT '{}',
  changelog TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create marketplace reviews table
CREATE TABLE public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_id, reviewer_id)
);

-- Create marketplace purchases table
CREATE TABLE public.marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  price_paid_cents INTEGER NOT NULL,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_id, buyer_id)
);

-- Create community forums table
CREATE TABLE public.community_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  moderator_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create forum topics table
CREATE TABLE public.forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID REFERENCES public.community_forums(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create forum replies table
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user profiles extended table for community features
CREATE TABLE public.community_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  website_url TEXT,
  github_url TEXT,
  reputation_score INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_contributions INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  following_ids UUID[] DEFAULT '{}',
  followers_count INTEGER DEFAULT 0,
  is_creator BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create collaboration projects table
CREATE TABLE public.collaboration_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT DEFAULT 'circuit',
  collaborator_ids UUID[] DEFAULT '{}',
  content_data JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  max_collaborators INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user follows table
CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on all tables
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_item_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_categories (public read)
CREATE POLICY "Anyone can view categories" ON public.marketplace_categories FOR SELECT USING (true);

-- RLS Policies for marketplace_items
CREATE POLICY "Anyone can view published items" ON public.marketplace_items FOR SELECT USING (is_published = true);
CREATE POLICY "Users can view their own items" ON public.marketplace_items FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Users can create their own items" ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own items" ON public.marketplace_items FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete their own items" ON public.marketplace_items FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for marketplace_reviews
CREATE POLICY "Anyone can view reviews" ON public.marketplace_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.marketplace_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON public.marketplace_reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- RLS Policies for marketplace_purchases
CREATE POLICY "Users can view their own purchases" ON public.marketplace_purchases FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can create purchases" ON public.marketplace_purchases FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for community_forums
CREATE POLICY "Anyone can view active forums" ON public.community_forums FOR SELECT USING (is_active = true);

-- RLS Policies for forum_topics
CREATE POLICY "Anyone can view forum topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Users can create topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own topics" ON public.forum_topics FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for forum_replies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for community_profiles
CREATE POLICY "Anyone can view community profiles" ON public.community_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON public.community_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.community_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for collaboration_projects
CREATE POLICY "Anyone can view public projects" ON public.collaboration_projects FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own projects" ON public.collaboration_projects FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = ANY(collaborator_ids));
CREATE POLICY "Users can create projects" ON public.collaboration_projects FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Project creators can update their projects" ON public.collaboration_projects FOR UPDATE USING (auth.uid() = creator_id);

-- RLS Policies for user_follows
CREATE POLICY "Users can view their own follows" ON public.user_follows FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);
CREATE POLICY "Users can create follows" ON public.user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON public.user_follows FOR DELETE USING (auth.uid() = follower_id);

-- Insert default categories
INSERT INTO public.marketplace_categories (name, description, icon) VALUES
('Quantum Circuits', 'Complete quantum circuit designs and templates', 'zap'),
('Algorithms', 'Quantum algorithms and implementations', 'cpu'),
('Tutorials', 'Learning materials and step-by-step guides', 'book-open'),
('Learning Modules', 'Structured educational content and quizzes', 'graduation-cap'),
('Tools & Utilities', 'Helper tools and utility circuits', 'wrench');

-- Insert default forums
INSERT INTO public.community_forums (name, description, category) VALUES
('General Discussion', 'General quantum computing discussions', 'general'),
('Circuit Building', 'Share and discuss quantum circuit designs', 'circuits'),
('Algorithm Development', 'Quantum algorithm research and development', 'algorithms'),
('Learning & Education', 'Educational content and learning resources', 'education'),
('Marketplace', 'Discussions about marketplace items and collaborations', 'marketplace');

-- Create indexes for better performance
CREATE INDEX idx_marketplace_items_creator ON public.marketplace_items(creator_id);
CREATE INDEX idx_marketplace_items_category ON public.marketplace_items(category_id);
CREATE INDEX idx_marketplace_items_published ON public.marketplace_items(is_published);
CREATE INDEX idx_forum_topics_forum ON public.forum_topics(forum_id);
CREATE INDEX idx_forum_replies_topic ON public.forum_replies(topic_id);
CREATE INDEX idx_community_profiles_user ON public.community_profiles(user_id);
