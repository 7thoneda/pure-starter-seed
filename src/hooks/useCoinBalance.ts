import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCoinBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setBalance(0);
        return;
      }

      const { data, error } = await supabase
        .from('user_coins')
        .select('balance')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) throw error;

      setBalance(data?.balance || 0);
    } catch (err: any) {
      console.error('Failed to fetch coin balance:', err);
      setError(err.message);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCoins = useCallback((amount: number) => {
    setBalance(prev => prev + amount);
  }, []);

  const subtractCoins = useCallback((amount: number) => {
    setBalance(prev => Math.max(0, prev - amount));
  }, []);

  // Real-time updates for coin balance
  useEffect(() => {
    fetchBalance();

    const channel = supabase
      .channel('coin-balance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_coins'
        },
        () => {
          fetchBalance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    fetchBalance,
    addCoins,
    subtractCoins
  };
};