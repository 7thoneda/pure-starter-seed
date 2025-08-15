import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed';
  reward_granted: boolean;
  created_at: string;
  completed_at?: string;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  expires_at: string;
  granted_by: string;
  created_at: string;
}

export function useReferrals() {
  const [userCode, setUserCode] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [premiumExpiry, setPremiumExpiry] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Generate or fetch user's referral code
  const generateReferralCode = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user already has a code
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user.id)
        .single();

      if (existingReferral) {
        setUserCode(existingReferral.referral_code);
        return;
      }

      // Generate new code
      const { data: codeData } = await supabase.rpc('generate_referral_code');
      
      // Create referral entry
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: user.id,
          referred_id: user.id, // Temporary, will be updated when someone uses the code
          referral_code: codeData
        });

      if (error) throw error;
      setUserCode(codeData);
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast({
        title: "Error",
        description: "Failed to generate referral code",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Use a referral code
  const useReferralCode = useCallback(async (code: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Find the referral
      const { data: referral, error: findError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referral_code', code)
        .single();

      if (findError || !referral) {
        throw new Error('Invalid referral code');
      }

      if (referral.referrer_id === user.id) {
        throw new Error('Cannot use your own referral code');
      }

      // Update referral with new user
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          referred_id: user.id,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', referral.id);

      if (updateError) throw updateError;

      // Grant premium to referrer
      await supabase.rpc('grant_referral_premium', { referrer_uuid: referral.referrer_id });

      toast({
        title: "Success! 🎉",
        description: "Referral code applied successfully!",
      });

      return true;
    } catch (error: any) {
      console.error('Error using referral code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to apply referral code",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Load user data
  const loadUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (referralsData) {
        setReferrals(referralsData as Referral[]);
        const userReferral = referralsData.find(r => r.referrer_id === user.id);
        if (userReferral) {
          setUserCode(userReferral.referral_code);
        }
      }

      // Load premium subscription
      const { data: premiumData } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .gte('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .single();

      if (premiumData) {
        setPremiumExpiry(new Date(premiumData.expires_at));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has active premium
  const hasPremium = premiumExpiry && premiumExpiry > new Date();

  // Copy referral link
  const copyReferralLink = useCallback(() => {
    const link = `${window.location.origin}?ref=${userCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied! 📋",
      description: "Referral link copied to clipboard",
    });
  }, [userCode, toast]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (!userCode) {
      generateReferralCode();
    }
  }, [userCode, generateReferralCode]);

  return {
    userCode,
    referrals,
    premiumExpiry,
    hasPremium,
    isLoading,
    useReferralCode,
    copyReferralLink,
    generateReferralCode
  };
}