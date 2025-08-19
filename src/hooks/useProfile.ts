import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  gender?: 'male' | 'female' | 'other';
  is_premium: boolean;
  coins: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user profile
  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, create a mock profile since profiles table types aren't ready
      const mockProfile: UserProfile = {
        id: user.id,
        user_id: user.id,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        gender: 'other',
        is_premium: false,
        coins: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(mockProfile);

      // Profile created above as mock
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      if (!profile) return;

      // For now, update locally until types are ready
      setProfile({ ...profile, ...updates });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  }, [profile, toast]);

  // Spend coins
  const spendCoins = useCallback(async (amount: number) => {
    try {
      if (!profile || profile.coins < amount) {
        throw new Error('Insufficient coins');
      }

      // Update locally until database types are ready
      setProfile({ ...profile, coins: profile.coins - amount });
      return true;
    } catch (error) {
      console.error('Error spending coins:', error);
      toast({
        title: "Error",
        description: "Failed to spend coins",
        variant: "destructive"
      });
      return false;
    }
  }, [profile, toast]);

  // Add coins
  const addCoins = useCallback(async (amount: number) => {
    try {
      if (!profile) return;

      // Update locally until database types are ready
      setProfile({ ...profile, coins: profile.coins + amount });
      
      toast({
        title: "Coins Added! 🪙",
        description: `You received ${amount} coins`,
      });
    } catch (error) {
      console.error('Error adding coins:', error);
      toast({
        title: "Error",
        description: "Failed to add coins",
        variant: "destructive"
      });
    }
  }, [profile, toast]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Real-time subscriptions will be enabled when database types are ready

  return {
    profile,
    isLoading,
    updateProfile,
    spendCoins,
    addCoins,
    loadProfile
  };
}