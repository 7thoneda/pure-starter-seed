import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CoinEarningTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'special';
}

export const useCoinEarning = () => {
  const [tasks] = useState<CoinEarningTask[]>([
    {
      id: 'daily-login',
      title: 'Daily Login',
      description: 'Login to earn coins',
      reward: 10,
      completed: false,
      type: 'daily'
    },
    {
      id: 'complete-profile',
      title: 'Complete Profile',
      description: 'Add photos and bio',
      reward: 50,
      completed: false,
      type: 'special'
    },
    {
      id: 'first-video-call',
      title: 'First Video Call',
      description: 'Make your first video call',
      reward: 25,
      completed: false,
      type: 'special'
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const completeTask = useCallback(async (taskId: string) => {
    setIsProcessing(true);
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return false;

      const { data, error } = await supabase.functions.invoke('track-offer-completion', {
        body: {
          offerId: taskId,
          offerType: 'task',
          reward: task.reward,
          completedAt: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast({
        title: "Task Completed! 🎉",
        description: `You earned ${task.reward} coins!`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [tasks, toast]);

  const completeOffer = useCallback(async (offer: any) => {
    setIsProcessing(true);
    try {
      // First validate the reward server-side
      const { data: validation, error: validationError } = await supabase.functions.invoke('validate-reward', {
        body: {
          offerId: offer.id,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (validationError || !validation?.valid) {
        throw new Error(validation?.reason || 'Offer validation failed');
      }

      // Track the completion
      const { data, error } = await supabase.functions.invoke('track-offer-completion', {
        body: {
          offerId: offer.id,
          offerType: offer.type,
          reward: offer.reward,
          completedAt: new Date().toISOString()
        }
      });

      if (error) throw error;

      toast({
        title: "Offer Completed! 🎉",
        description: `You earned ${offer.reward} coins!`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete offer",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const claimDailyReward = useCallback(async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('claim-daily-reward');

      if (error) throw error;

      if (data.reward > 0) {
        toast({
          title: "Daily Reward Claimed! 🎁",
          description: `You earned ${data.reward} coins! Streak: ${data.streak} days`,
        });
        return data.reward;
      } else {
        toast({
          title: "Already Claimed",
          description: "You've already claimed your daily reward today",
          variant: "default"
        });
        return 0;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to claim daily reward",
        variant: "destructive"
      });
      return 0;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const getAvailableTasks = useCallback(() => {
    return tasks.filter(task => !task.completed);
  }, [tasks]);

  const getCoinBalance = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return 0;

      const { data, error } = await supabase
        .from('user_coins')
        .select('balance')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.balance || 0;
    } catch (error) {
      console.error('Failed to get coin balance:', error);
      return 0;
    }
  }, []);

  return {
    tasks,
    isProcessing,
    completeTask,
    completeOffer,
    claimDailyReward,
    getAvailableTasks,
    getCoinBalance
  };
};