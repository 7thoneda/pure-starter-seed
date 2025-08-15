import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  price_coins: number;
  is_premium: boolean;
  category: string;
  animation_type: string;
}

export const useVirtualGifts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendGift = async (
    gift: VirtualGift, 
    receiverId: string, 
    callSessionId?: string
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check coin balance
      const { data: userCoins, error: coinsError } = await supabase
        .from('user_coins')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (coinsError && coinsError.code !== 'PGRST116') {
        throw coinsError;
      }

      const currentBalance = userCoins?.balance || 0;
      if (currentBalance < gift.price_coins) {
        toast({
          title: "Insufficient Coins",
          description: `You need ${gift.price_coins} coins to send this gift.`,
          variant: "destructive"
        });
        return false;
      }

      // Create gift transaction
      const { error: transactionError } = await supabase
        .from('gift_transactions')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          gift_id: gift.id,
          call_session_id: callSessionId,
          coins_spent: gift.price_coins
        });

      if (transactionError) throw transactionError;

      // Deduct coins from sender
      const { error: deductError } = await supabase
        .from('user_coins')
        .update({ 
          balance: currentBalance - gift.price_coins,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (deductError) throw deductError;

      toast({
        title: "Gift Sent! 🎁",
        description: `${gift.emoji} ${gift.name} sent successfully!`,
      });

      return true;
    } catch (error: any) {
      console.error('Error sending gift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send gift",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getGiftHistory = async (limit = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('gift_transactions')
        .select(`
          *,
          virtual_gifts (*)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting gift history:', error);
      return [];
    }
  };

  return {
    sendGift,
    getGiftHistory,
    isLoading
  };
};