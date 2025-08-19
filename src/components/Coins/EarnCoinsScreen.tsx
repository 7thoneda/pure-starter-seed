import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Zap, TrendingUp, Filter, Search, Play, UserPlus } from "lucide-react";
import { AdGemService, AdGemOffer } from "@/services/adgemService";
import { useToast } from "@/hooks/use-toast";
import { useCoinEarning } from "@/hooks/useCoinEarning";
import { useCoinBalance } from "@/hooks/useCoinBalance";
import { OfferCard } from "./OfferCard";
import { OfferFilters } from "./OfferFilters";
import { CoinRewardAnimation } from "./CoinRewardAnimation";
import { RewardedVideoAd } from "@/components/Ads/RewardedVideoAd";
import { BannerAd } from "@/components/Ads/BannerAd";

interface EarnCoinsScreenProps {
  onBack: () => void;
}

export function EarnCoinsScreen({ onBack }: EarnCoinsScreenProps) {
  const [offers, setOffers] = useState<AdGemOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<AdGemOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingOffer, setCompletingOffer] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [lastRewardAmount, setLastRewardAmount] = useState(0);
  const { toast } = useToast();
  const { isProcessing, completeOffer, claimDailyReward } = useCoinEarning();
  const { balance: coinBalance, addCoins } = useCoinBalance();

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, activeFilter]);

  const loadOffers = async () => {
    try {
      const adgemService = AdGemService.getInstance();
      await adgemService.initialize('demo-user');
      const availableOffers = await adgemService.getOffers();
      setOffers(availableOffers);
    } catch (error) {
      console.error('Failed to load offers:', error);
      toast({
        title: "Error",
        description: "Failed to load earning opportunities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = offers;
    
    if (activeFilter === 'quick') {
      filtered = offers.filter(offer => 
        offer.estimatedTime && parseInt(offer.estimatedTime) <= 2
      );
    } else if (activeFilter !== 'all') {
      filtered = offers.filter(offer => offer.type === activeFilter);
    }
    
    // Sort by reward (highest first) with quick earns prioritized
    filtered.sort((a, b) => {
      const aIsQuick = a.estimatedTime && parseInt(a.estimatedTime) <= 2;
      const bIsQuick = b.estimatedTime && parseInt(b.estimatedTime) <= 2;
      
      if (aIsQuick && !bIsQuick) return -1;
      if (!aIsQuick && bIsQuick) return 1;
      
      return b.reward - a.reward;
    });
    
    setFilteredOffers(filtered);
  };

  const handleCompleteOffer = async (offer: AdGemOffer) => {
    if (isProcessing) return;
    
    setCompletingOffer(offer.id);
    try {
      // First complete via AdGem service (simulated)
      const adgemResult = await AdGemService.getInstance().completeOffer(offer.id);
      
      if (adgemResult.success) {
        // Then validate and track via Supabase
        const success = await completeOffer(offer);
        if (success) {
          addCoins(offer.reward);
          setLastRewardAmount(offer.reward);
          setShowRewardAnimation(true);
          
          // Show enhanced success toast
          toast({
            title: "🎉 Offer Completed!",
            description: `You earned ${offer.reward} coins! Keep it up!`,
          });
          
          // Refresh offers to remove completed one
          loadOffers();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete offer",
        variant: "destructive"
      });
    } finally {
      setCompletingOffer(null);
    }
  };

  const handleClaimDailyReward = async () => {
    const reward = await claimDailyReward();
    if (reward > 0) {
      addCoins(reward);
      setLastRewardAmount(reward);
      setShowRewardAnimation(true);
    }
  };

  const getRecommendedOffers = () => {
    return filteredOffers.filter(offer => offer.reward >= 200 || 
      (offer.estimatedTime && parseInt(offer.estimatedTime) <= 2));
  };

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header */}
      <div className="bg-gradient-secondary pt-16 pb-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-dancing text-3xl font-bold text-white">
              Earn Coins
            </h1>
            <p className="text-white/90 font-poppins text-sm">Complete offers to earn coins</p>
          </div>
        </div>
        
        {/* Current Balance */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-white/80 text-sm font-poppins mb-1">Current Balance</p>
            <p className="text-white text-2xl font-bold font-poppins">{coinBalance} coins</p>
          </CardContent>
        </Card>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Daily Reward */}
          <Card className="shadow-card rounded-2xl border-0 border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 font-poppins">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Gift className="w-5 h-5 text-green-600" />
                </div>
                Daily Login Reward
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground font-poppins mb-4">
                Claim your daily reward for logging in today
              </p>
              <Button 
                onClick={handleClaimDailyReward}
                className="w-full h-12 font-poppins font-semibold rounded-xl"
                variant="gradient"
              >
                <Gift className="w-5 h-5 mr-2" />
                Claim Daily Reward
              </Button>
            </CardContent>
          </Card>

          {/* Rewarded Video Ads */}
          <RewardedVideoAd 
            rewardType="coins"
            onRewardEarned={(reward) => {
              setLastRewardAmount(reward.amount);
              setShowRewardAnimation(true);
            }}
          />

          {/* AdGem Offerwall */}
          <Card className="shadow-card rounded-2xl border-0 border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 font-poppins">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                AdGem Offerwall
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground font-poppins mb-4">
                Complete surveys, download apps, and more to earn coins
              </p>
              <Button 
                onClick={() => AdGemService.getInstance().openOfferwall()}
                className="w-full h-12 font-poppins font-semibold rounded-xl"
                variant="gradient"
              >
                <Gift className="w-5 h-5 mr-2" />
                Open Offerwall
              </Button>
            </CardContent>
          </Card>

          {/* Offer Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg font-poppins">Browse Offers</h3>
              <Badge variant="outline" className="text-xs font-poppins">
                {filteredOffers.length} available
              </Badge>
            </div>
            <OfferFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </div>

          {/* Recommended Offers */}
          {getRecommendedOffers().length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg font-poppins px-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                Recommended for You
              </h3>
              {getRecommendedOffers().slice(0, 3).map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onComplete={handleCompleteOffer}
                  isCompleting={completingOffer === offer.id}
                />
              ))}
            </div>
          )}

          {/* All Offers */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg font-poppins px-2">
              {activeFilter === 'all' ? 'All Offers' : 
               activeFilter === 'quick' ? 'Quick Earn Offers' :
               `${activeFilter.replace('_', ' ')} Offers`}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2 font-poppins">Loading offers...</p>
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-poppins">No offers available for this category</p>
              </div>
            ) : (
              filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onComplete={handleCompleteOffer}
                  isCompleting={completingOffer === offer.id}
                />
              ))
            )}
          </div>

          {/* Quick Earn Section */}
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 font-poppins flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Quick Earn
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    // Simulate watching an ad
                    setTimeout(() => {
                      addCoins(25);
                      setLastRewardAmount(25);
                      setShowRewardAnimation(true);
                      toast({
                        title: "Ad Reward! 🎬",
                        description: "You earned 25 coins for watching an ad!",
                      });
                    }, 3000);
                  }}
                  variant="outline"
                  className="h-16 flex-col gap-1 font-poppins"
                >
                  <Play className="w-5 h-5 text-green-600" />
                  <span className="text-xs">Watch Ad</span>
                  <span className="text-xs text-green-600 font-bold">+25</span>
                </Button>
                
                <Button
                  onClick={() => {
                    // Simulate sharing the app
                    addCoins(50);
                    setLastRewardAmount(50);
                    setShowRewardAnimation(true);
                    toast({
                      title: "Share Bonus! 📱",
                      description: "You earned 50 coins for sharing the app!",
                    });
                  }}
                  variant="outline"
                  className="h-16 flex-col gap-1 font-poppins"
                >
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Share App</span>
                  <span className="text-xs text-blue-600 font-bold">+50</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Earning Tips */}
          <Card className="shadow-card rounded-2xl border-0 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3 font-poppins flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-600" />
                Earning Tips
              </h4>
              <div className="space-y-2 text-sm text-orange-700 font-poppins">
                <p>• Complete offers fully to receive rewards</p>
                <p>• Check back daily for new opportunities</p>
                <p>• Higher reward offers may take more time</p>
                <p>• Make sure to follow all offer requirements</p>
                <p>• Watch ads and share the app for quick coins</p>
                <p>• Daily login streaks give bonus rewards</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Banner Ad for Free Users */}
      <BannerAd position="bottom" size="banner" />

      {/* Coin Reward Animation */}
      <CoinRewardAnimation
        amount={lastRewardAmount}
        isVisible={showRewardAnimation}
        onComplete={() => setShowRewardAnimation(false)}
      />
    </div>
  );
}