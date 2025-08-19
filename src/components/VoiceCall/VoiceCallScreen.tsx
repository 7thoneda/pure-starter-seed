import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Crown, Gem, ArrowLeft, Mic, Users, Zap, Heart, Sparkles, Star, Lock, Timer, Flame } from "lucide-react";
import { VoiceCallPricing } from "./VoiceCallPricing";

interface VoiceCallScreenProps {
  onStartCall: () => void;
  isPremium: boolean;
  hasUnlimitedCalls?: boolean;
  coinBalance: number;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  onRequestUpgrade: () => void;
  onBack?: () => void;
  onBuyCoins?: () => void;
  onSpendCoins: (amount: number) => void;
}

export function VoiceCallScreen({
  onStartCall,
  isPremium,
  hasUnlimitedCalls = false,
  coinBalance,
  matchPreference,
  onChangePreference,
  onRequestUpgrade,
  onBack,
  onBuyCoins,
  onSpendCoins,
}: VoiceCallScreenProps) {
  const canMakeCall = isPremium || hasUnlimitedCalls || coinBalance >= 20;

  const handleStartCall = () => {
    if (hasUnlimitedCalls) {
      // User has unlimited calls subscription
      onStartCall();
    } else if (isPremium) {
      // Premium users still need to pay for voice calls unless they have unlimited
      if (coinBalance >= 20) {
        onSpendCoins(20);
        onStartCall();
      } else {
        onBuyCoins?.();
      }
    } else if (coinBalance >= 20) {
      // Free users pay per call
      onSpendCoins(20);
      onStartCall();
    } else {
      // Not enough coins
      onBuyCoins?.();
    }
  };

  const PreferenceButton = ({
    value,
    label,
    emoji,
  }: { value: "anyone" | "men" | "women"; label: string; emoji: string }) => {
    const locked = !isPremium && value !== "anyone";
    const isActive = matchPreference === value;
    return (
      <button
        onClick={() => (locked ? onRequestUpgrade() : onChangePreference(value))}
        className={`relative flex-1 h-16 rounded-2xl border-2 transition-all duration-300 group ${
          isActive 
            ? "bg-gradient-primary text-white border-transparent shadow-warm scale-105" 
            : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary/5"
        } ${locked ? "opacity-70" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <span className="text-2xl">{emoji}</span>
          <span className="font-poppins font-semibold text-sm">{label}</span>
          {locked && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-premium rounded-full flex items-center justify-center shadow-warm">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 safe-area-top safe-area-bottom">
      {/* Floating Header with Glass Effect */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 pt-16">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/50 hover:bg-white/70 shadow-lg border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
          )}
          
          {/* Coin Balance - More Prominent */}
          {onBuyCoins && (
            <button 
              onClick={onBuyCoins}
              className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Gem className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white/90 text-xs font-medium font-poppins">Your Balance</p>
                  <p className="text-white text-lg font-bold font-poppins">{coinBalance}</p>
                </div>
                <div className="w-2 h-2 bg-white/50 rounded-full group-hover:bg-white transition-colors"></div>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pb-32 space-y-6 max-w-md mx-auto">
        {/* Hero Section with Compelling Copy */}
        <div className="text-center py-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Phone className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-xs font-bold">🔥</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3 font-poppins">Voice Dating</h1>
          <p className="text-muted-foreground font-poppins text-lg mb-2">Connect through authentic conversations</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-sm font-medium font-poppins">247 online now</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards - More Compelling */}
        <div className="space-y-4">
          {/* Premium Highlighted Option */}
          {!isPremium && (
            <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-1 border-0">
              <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-3 py-1 rounded-bl-xl text-xs font-bold">
                BEST VALUE
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-poppins">Premium Unlimited</h3>
                    <p className="text-white/90 font-poppins">Unlimited voice calls + premium features</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">$9.99</span>
                    <span className="text-white/70 line-through text-sm">$19.99</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-0">50% OFF</Badge>
                </div>
                <Button 
                  onClick={onRequestUpgrade}
                  className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold font-poppins rounded-xl h-12 shadow-lg"
                >
                  Get Premium Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Current Status Card */}
          {hasUnlimitedCalls ? (
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-poppins">Unlimited Active</h3>
                    <p className="text-white/90 font-poppins">24h unlimited voice calls remaining</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 font-poppins">Active</Badge>
                </div>
              </CardContent>
            </Card>
          ) : isPremium ? (
            <Card className="bg-gradient-premium text-white shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-poppins">Premium Member</h3>
                    <p className="text-white/90 font-poppins">Enjoy exclusive premium features</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 font-poppins">VIP</Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Coin-based pricing with urgency
            <Card className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Gem className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-poppins text-foreground">Pay Per Call</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground font-poppins">Voice calls from</p>
                        <span className="text-orange-600 font-bold">20 coins</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600 font-poppins">20</div>
                    <div className="text-xs text-muted-foreground font-poppins">coins each</div>
                  </div>
                </div>
                
                {/* Balance Status */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground font-poppins">Your balance:</span>
                      <span className={`font-bold font-poppins ${coinBalance >= 20 ? 'text-green-600' : 'text-red-500'}`}>
                        {coinBalance} coins
                      </span>
                    </div>
                    {coinBalance < 20 && (
                      <div className="flex items-center gap-2 text-red-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Need {20 - coinBalance} more</span>
                      </div>
                    )}
                  </div>
                  
                  {coinBalance < 100 && (
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-orange-700 font-poppins">
                          🔥 Limited time: Buy 100 coins, get 50 FREE!
                        </div>
                        <Button 
                          onClick={onBuyCoins}
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-poppins rounded-xl hover:scale-105 transition-transform"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main CTA Button - More Compelling */}
        <div className="relative">
          <Button 
            onClick={handleStartCall}
            disabled={!canMakeCall}
            className={`w-full h-20 font-poppins font-bold text-xl rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden group ${
              canMakeCall 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white hover:scale-105" 
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            }`}
          >
            {/* Animated shimmer effect */}
            {canMakeCall && (
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            )}
            
            <div className="relative flex items-center justify-center space-x-4">
              <div className={`p-3 rounded-full ${canMakeCall ? 'bg-white/20' : 'bg-muted-foreground/20'}`}>
                <Phone className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">
                  {hasUnlimitedCalls ? "Start Unlimited Call" : 
                   isPremium ? "Start Premium Call" : 
                   canMakeCall ? "Start Voice Chat" : "Get Coins to Call"}
                </div>
                <div className="text-sm opacity-90">
                  {!canMakeCall ? `Need ${20 - coinBalance} more coins` : 
                   hasUnlimitedCalls ? "No limits" :
                   isPremium ? "Premium perks included" : 
                   "20 coins per conversation"}
                </div>
              </div>
              {canMakeCall && (
                <div className="flex">
                  <Flame className="w-5 h-5 text-white animate-bounce" />
                </div>
              )}
            </div>
          </Button>
          
          {/* Glow effect */}
          {canMakeCall && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-30 -z-10 animate-pulse" />
          )}
        </div>

        {/* Currency-Aware Pricing Display */}
        <VoiceCallPricing 
          onPurchaseCoins={onBuyCoins} 
          hasUnlimitedCalls={hasUnlimitedCalls} 
        />

        {/* Urgency & Social Proof */}
        {!isPremium && !hasUnlimitedCalls && (
          <div className="space-y-4">
            {coinBalance < 20 && (
              <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-lg animate-pulse">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-2xl">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 font-poppins">Unlock Voice Dating</h4>
                      <p className="text-sm text-red-700 font-poppins">You're just {20 - coinBalance} coins away from your next conversation</p>
                    </div>
                    <Button 
                      onClick={onBuyCoins}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-poppins rounded-xl shadow-lg hover:scale-105 transition-transform"
                    >
                      Get Coins
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Social Proof */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 shadow-lg">
              <CardContent className="p-5">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-secondary rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-gradient-premium rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-blue-700 font-bold font-poppins">1,247+</span>
                  </div>
                  <p className="text-blue-800 font-semibold font-poppins">people found their match this week through voice calls</p>
                  <p className="text-blue-600 text-sm font-poppins mt-1">⭐ 4.9/5 average rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}