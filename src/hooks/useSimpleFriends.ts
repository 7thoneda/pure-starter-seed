import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SimpleUserProfile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  is_public: boolean;
}

export interface SimpleFriend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  profile?: SimpleUserProfile;
}

export function useSimpleFriends() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<SimpleFriend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFriends();
    }
  }, [user]);

  const loadFriends = async () => {
    if (!user) return;
    
    try {
      // Mock data for now since Supabase relations aren't configured
      const mockFriends: SimpleFriend[] = [
        {
          id: '1',
          user_id: user.id,
          friend_id: '2',
          status: 'accepted',
          created_at: new Date().toISOString(),
          profile: {
            id: '2',
            user_id: '2',
            username: 'alice',
            display_name: 'Alice Johnson',
            status: 'online',
            is_public: true
          }
        },
        {
          id: '2',
          user_id: user.id,
          friend_id: '3',
          status: 'accepted',
          created_at: new Date().toISOString(),
          profile: {
            id: '3',
            user_id: '3',
            username: 'bob',
            display_name: 'Bob Smith',
            status: 'away',
            is_public: true
          }
        }
      ];
      
      setFriends(mockFriends);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: "Error",
        description: "Failed to load friends",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (userId: string) => {
    if (!user) return false;

    try {
      // Mock success
      toast({
        title: "Friend Added",
        description: "Friend request sent successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add friend",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    friends,
    loading,
    addFriend,
    refetch: loadFriends
  };
}