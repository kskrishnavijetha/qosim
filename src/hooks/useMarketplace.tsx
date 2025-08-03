
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

// Use Supabase generated types
export type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];
export type MarketplaceCategory = Database['public']['Tables']['marketplace_categories']['Row'];
export type MarketplaceItemInsert = Database['public']['Tables']['marketplace_items']['Insert'];

export function useMarketplace() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [userItems, setUserItems] = useState<MarketplaceItem[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchPublishedItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      toast.error('Failed to load marketplace items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserItems = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserItems(data || []);
    } catch (error) {
      console.error('Error fetching user items:', error);
      toast.error('Failed to load your items');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createItem = useCallback(async (itemData: MarketplaceItemInsert) => {
    if (!user) {
      toast.error('You must be signed in to create items');
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .insert({
          creator_id: user.id,
          ...itemData,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Item created successfully');
      await fetchUserItems();
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserItems]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<MarketplaceItem>) => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .update(updates)
        .eq('id', itemId)
        .eq('creator_id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Item updated successfully');
      await fetchUserItems();
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserItems]);

  const deleteItem = useCallback(async (itemId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .delete()
        .eq('id', itemId)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast.success('Item deleted successfully');
      await fetchUserItems();
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserItems]);

  useEffect(() => {
    fetchCategories();
    fetchPublishedItems();
    if (user) {
      fetchUserItems();
    }
  }, [user, fetchCategories, fetchPublishedItems, fetchUserItems]);

  return {
    loading,
    items,
    categories,
    userItems,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchPublishedItems,
    refetchUserItems: fetchUserItems,
  };
}
