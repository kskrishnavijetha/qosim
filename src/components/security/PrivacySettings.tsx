
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Shield, Users, Globe, Eye } from 'lucide-react';

type PrivacyLevel = 'private' | 'friends' | 'public';

export function PrivacySettings() {
  const { user } = useAuth();
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('private');
  const [allowProfileSearch, setAllowProfileSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('privacy_level, allow_profile_search')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setPrivacyLevel(data.privacy_level || 'private');
        setAllowProfileSearch(data.allow_profile_search || false);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_level: privacyLevel,
          allow_profile_search: allowProfileSearch,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log security event
      await supabase
        .from('security_audit_log')
        .insert({
          user_id: user.id,
          event_type: 'privacy_settings_updated',
          event_data: { privacy_level: privacyLevel, allow_profile_search: allowProfileSearch },
        });

      toast.success('Privacy settings updated successfully');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const getPrivacyIcon = (level: PrivacyLevel) => {
    switch (level) {
      case 'private':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'friends':
        return <Users className="h-4 w-4 text-yellow-600" />;
      case 'public':
        return <Globe className="h-4 w-4 text-red-600" />;
    }
  };

  if (loading) {
    return <div>Loading privacy settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control who can see your profile and find you in searches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="privacy-level">Profile Visibility</Label>
          <Select value={privacyLevel} onValueChange={(value: PrivacyLevel) => setPrivacyLevel(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Private - Only you can see your profile
                </div>
              </SelectItem>
              <SelectItem value="friends">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-yellow-600" />
                  Friends - People you follow can see your profile
                </div>
              </SelectItem>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-red-600" />
                  Public - Anyone can see your profile
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              {getPrivacyIcon(privacyLevel)}
              {privacyLevel === 'private' && 'Your profile is completely private'}
              {privacyLevel === 'friends' && 'Only people you follow can see your profile'}
              {privacyLevel === 'public' && 'Your profile is visible to everyone'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="allow-search">Allow Profile Search</Label>
            <div className="text-sm text-muted-foreground">
              Let others find your profile when searching for users
            </div>
          </div>
          <Switch
            id="allow-search"
            checked={allowProfileSearch}
            onCheckedChange={setAllowProfileSearch}
          />
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Privacy Notice</h4>
          <p className="text-sm text-yellow-700">
            Even with private settings, your public circuits and community contributions may still be visible. 
            Review your circuit privacy settings separately.
          </p>
        </div>

        <Button onClick={savePrivacySettings} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
