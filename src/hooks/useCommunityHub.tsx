
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CommunityForum {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  moderator_ids: string[];
  created_at: string;
}

export interface ForumTopic {
  id: string;
  forum_id: string;
  creator_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  replies_count: number;
  last_reply_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  topic_id: string;
  author_id: string;
  content: string;
  parent_reply_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityProfile {
  id: string;
  user_id: string;
  bio?: string;
  website_url?: string;
  github_url?: string;
  reputation_score: number;
  total_downloads: number;
  total_contributions: number;
  badges: any[];
  following_ids: string[];
  followers_count: number;
  is_creator: boolean;
  created_at: string;
  updated_at: string;
}

export function useCommunityHub() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [forums, setForums] = useState<CommunityForum[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [userProfile, setUserProfile] = useState<CommunityProfile | null>(null);

  const fetchForums = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_forums')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setForums(data || []);
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  }, []);

  const fetchTopics = useCallback(async (forumId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('forum_topics')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (forumId) {
        query = query.eq('forum_id', forumId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load forum topics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReplies = useCallback(async (topicId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast.error('Failed to load replies');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTopic = useCallback(async (forumId: string, title: string, content: string) => {
    if (!user) {
      toast.error('You must be signed in to create topics');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          forum_id: forumId,
          creator_id: user.id,
          title,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Topic created successfully');
      await fetchTopics(forumId);
      return data;
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchTopics]);

  const createReply = useCallback(async (topicId: string, content: string, parentReplyId?: string) => {
    if (!user) {
      toast.error('You must be signed in to reply');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: topicId,
          author_id: user.id,
          content,
          parent_reply_id: parentReplyId,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Reply posted successfully');
      await fetchReplies(topicId);
      return data;
    } catch (error) {
      console.error('Error creating reply:', error);
      toast.error('Failed to post reply');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchReplies]);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [user]);

  const createUserProfile = useCallback(async (profileData: Partial<CommunityProfile>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('community_profiles')
        .insert({
          user_id: user.id,
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      toast.success('Profile created successfully');
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
      return null;
    }
  }, [user]);

  useEffect(() => {
    fetchForums();
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchForums, fetchUserProfile]);

  return {
    loading,
    forums,
    topics,
    replies,
    userProfile,
    fetchTopics,
    fetchReplies,
    createTopic,
    createReply,
    createUserProfile,
    refetch: fetchForums,
  };
}
