import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Coins, Clock, Gift } from 'lucide-react';
import { AdService, RewardedAdReward } from '@/services/adService';
import { useToast } from '@/hooks/use-toast';
import { useCoinBalance } from '@/hooks/useCoinBalance';

interface RewardedVideoAdProps {
  rewardType?: 'coins' | 'time_extension';
  customReward?: {
    amount: number;
    label: string;
  };
  onRewardEarned?: (reward: RewardedAdReward) => void;
  className?: string;
  variant?: 'card' | 'button' | 'compact';
}

export function RewardedVideoAd({
  rewardType = 'coins',
  customReward,
  onRewardEarned,
  className = '',
  variant = 'card'
}: RewardedVideoAdProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addCoins } = useCoinBalance();

  const getRewardInfo = () => {
    if (customReward) {
      return {
        amount: customReward.amount,
        label: customReward.label,
        icon: Gift
      };
    }

    switch (rewardType) {
      case 'time_extension':
        return {
          amount: 30,
          label: 'seconds',
          icon: Clock
        };
      case 'coins':
      default:
        return {
          amount: 50,
          label: 'coins',
          icon: Coins
        };
    }
  };

  const handleWatchAd = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const adService = AdService.getInstance();
      const reward = await adService.showRewardedVideo(rewardType);
      
      if (reward) {
        // Add coins to balance if it's a coin reward
        if (reward.type === 'coins') {
          addCoins(reward.amount);
        }

        // Call callback if provided
        onRewardEarned?.(reward);

        // Show success toast
        toast({
          title: "🎉 Reward Earned!",
          description: `You earned ${reward.amount} ${reward.type === 'coins' ? 'coins' : 'seconds'}!`,
        });
      }
    } catch (error) {
      console.error('Error watching rewarded video:', error);
      toast({
        title: "Error",
        description: "Unable to load ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const rewardInfo = getRewardInfo();
  const RewardIcon = rewardInfo.icon;

  if (variant === 'button') {
    return (
      <Button
        onClick={handleWatchAd}
        disabled={isLoading}
        className={`gap-2 ${className}`}
        variant="outline"
      >
        <Play className="w-4 h-4" />
        {isLoading ? 'Loading...' : `Watch Ad (+${rewardInfo.amount} ${rewardInfo.label})`}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border ${className}`}>
        <div className="p-2 bg-blue-500/10 rounded-full">
          <Play className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Watch video to earn</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <RewardIcon className="w-3 h-3" />
            +{rewardInfo.amount} {rewardInfo.label}
          </p>
        </div>
        <Button
          onClick={handleWatchAd}
          disabled={isLoading}
          size="sm"
          className="px-3"
        >
          {isLoading ? 'Loading...' : 'Watch'}
        </Button>
      </div>
    );
  }

  return (
    <Card className={`shadow-card rounded-2xl border-0 border-l-4 border-l-blue-500 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 font-poppins">
          <div className="p-2 bg-blue-500/10 rounded-full">
            <Play className="w-5 h-5 text-blue-600" />
          </div>
          Watch Rewarded Video
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground font-poppins mb-1">
              Watch a short video to earn rewards
            </p>
            <div className="flex items-center gap-2 text-blue-600">
              <RewardIcon className="w-4 h-4" />
              <span className="font-semibold">+{rewardInfo.amount} {rewardInfo.label}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">15-30s</p>
          </div>
        </div>
        
        <Button 
          onClick={handleWatchAd}
          disabled={isLoading}
          className="w-full h-12 font-poppins font-semibold rounded-xl"
          variant="gradient"
        >
          <Play className="w-5 h-5 mr-2" />
          {isLoading ? 'Loading Ad...' : 'Watch Video'}
        </Button>
      </CardContent>
    </Card>
  );
}