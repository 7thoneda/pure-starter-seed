import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Crown, Gem, ArrowLeft, Mic, Users, Zap, Heart, Sparkles, Star, Lock, Timer, Flame, Shield, Globe, CheckCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Modern Header Section */}
      <header className="sticky top-0 z-20 glass-panel border-b border-glass px-space-md py-space-sm pt-16">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {onBack && (
            <Button 
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="rounded-full glass-card shadow-warm hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
          )}
          
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-foreground font-poppins">Voice Dating</h1>
            <p className="text-xs text-muted-foreground font-poppins">Authentic conversations await</p>
          </div>
          
          {/* Subtle Balance Indicator */}
          {onBuyCoins && (
            <button 
              onClick={onBuyCoins}
              className="glass-card rounded-xl px-3 py-2 shadow-warm hover:shadow-glow transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold font-poppins text-foreground">{coinBalance}</span>
              </div>
            </button>
          )}
        </div>
      </header>

      <main className="px-space-md pb-32 space-y-space-lg max-w-md mx-auto">
        {/* Hero Section - 30% of screen */}
        <section className="text-center py-space-lg">
          <div className="relative mb-space-md">
            <div className="w-20 h-20 glass-card bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-warm">
              <Flame className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2 font-poppins">Connect through authentic voice conversations</h2>
          <p className="text-muted-foreground font-poppins mb-space-md">Experience genuine connections without the pressure of video</p>
          
          {/* Trust Indicators & Social Proof */}
          <div className="flex items-center justify-center gap-space-md mb-space-sm">
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-sm font-semibold font-poppins">247 online</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-blue-700 text-sm font-semibold font-poppins">Safe & Private</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-sm text-muted-foreground ml-2 font-poppins">4.9/5 from 10k+ users</span>
          </div>
        </section>

        {/* Pricing Strategy Section - 40% of screen */}
        <section className="space-y-space-md">
          <div className="text-center mb-space-md">
            <h3 className="text-xl font-bold text-foreground font-poppins mb-2">Choose Your Experience</h3>
            <p className="text-muted-foreground font-poppins">Pick the plan that works best for you</p>
          </div>

          {/* Premium Unlimited Card - Best Value */}
          {!isPremium && (
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white shadow-glow hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 border-0 card-premium">
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 px-4 py-2 rounded-bl-2xl font-bold text-sm shadow-warm">
                  MOST POPULAR
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 glass-card bg-white/20 rounded-2xl flex items-center justify-center">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold font-poppins">Premium Unlimited</h4>
                    <p className="text-white/90 font-poppins">Unlimited voice calls + exclusive features</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-white/70 line-through text-lg">$19.99</span>
                    <span className="text-sm text-white/80">/month</span>
                  </div>
                  <Badge className="bg-yellow-400 text-purple-900 border-0 font-bold">SAVE 50%</Badge>
                </div>
                
                <div className="space-y-2">
                  {["Unlimited voice calls", "Priority matching", "No ads", "Advanced filters", "Premium badges"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/90 text-sm font-poppins">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={onRequestUpgrade}
                  className="w-full bg-white text-purple-600 hover:bg-white/90 font-bold font-poppins rounded-xl h-12 shadow-warm hover:scale-105 transition-all duration-300"
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Current Status Cards */}
          {hasUnlimitedCalls ? (
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-glow border-0 hover:scale-105 transition-all duration-300">
              <CardContent className="p-space-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass-card bg-white/20 rounded-2xl flex items-center justify-center">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold font-poppins">Unlimited Active</h4>
                    <p className="text-white/90 font-poppins">24h unlimited access remaining</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 font-poppins">ACTIVE</Badge>
                </div>
              </CardContent>
            </Card>
          ) : isPremium ? (
            <Card className="bg-gradient-premium text-white shadow-glow border-0 hover:scale-105 transition-all duration-300">
              <CardContent className="p-space-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass-card bg-white/20 rounded-2xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold font-poppins">Premium Member</h4>
                    <p className="text-white/90 font-poppins">Enjoying exclusive features</p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0 font-poppins">VIP</Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Pay Per Call Option
            <Card className="glass-panel rounded-2xl border-glass shadow-glow hover:shadow-warm transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-warm">
                      <Gem className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-poppins text-foreground">Pay Per Call</h4>
                      <p className="text-muted-foreground font-poppins">Flexible voice conversations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600 font-poppins">20</div>
                    <div className="text-xs text-muted-foreground font-poppins">coins each</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Balance Status */}
                <div className="glass-card bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl p-4 border border-orange-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground font-poppins">Your balance:</span>
                    <span className={`font-bold font-poppins ${coinBalance >= 20 ? 'text-green-600' : 'text-red-500'}`}>
                      {coinBalance} coins
                    </span>
                  </div>
                  
                  {coinBalance < 20 && (
                    <div className="flex items-center gap-2 text-red-500 mt-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Need {20 - coinBalance} more coins to start</span>
                    </div>
                  )}
                  
                  {coinBalance < 100 && (
                    <div className="mt-3 pt-3 border-t border-orange-200/50">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-orange-700 font-poppins">
                          ⚡ Special: Buy 100 coins, get 50 FREE!
                        </div>
                        <Button 
                          onClick={onBuyCoins}
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-poppins rounded-xl hover:scale-105 transition-transform shadow-warm"
                        >
                          Buy Coins
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Primary CTA - Hero Action */}
        <div className="relative">
          <Button 
            onClick={handleStartCall}
            disabled={!canMakeCall}
            className={`w-full h-20 font-poppins font-bold text-xl rounded-3xl shadow-glow transition-all duration-500 relative overflow-hidden group ${
              canMakeCall 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white hover:scale-105 active:scale-95" 
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            }`}
          >
            {/* Animated shimmer effect */}
            {canMakeCall && (
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            )}
            
            <div className="relative flex items-center justify-center space-x-4">
              <div className={`p-3 rounded-full glass-card ${canMakeCall ? 'bg-white/20' : 'bg-muted-foreground/20'}`}>
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
                   hasUnlimitedCalls ? "Connect instantly" :
                   isPremium ? "With premium features" : 
                   "Authentic conversations"}
                </div>
              </div>
              {canMakeCall && (
                <div className="flex animate-pulse">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
              )}
            </div>
          </Button>
          
          {/* Enhanced glow effect */}
          {canMakeCall && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-30 -z-10 animate-pulse" />
          )}
        </div>

        {/* Features & Benefits Section - 30% of screen */}
        <section className="space-y-space-md">
          <div className="text-center mb-space-md">
            <h3 className="text-lg font-bold text-foreground font-poppins">Why Voice Dating Works</h3>
            <p className="text-muted-foreground font-poppins text-sm">Experience deeper connections</p>
          </div>
          
          <div className="grid grid-cols-1 gap-space-sm">
            {/* Feature Benefits */}
            {[
              { icon: Mic, title: "Authentic Conversations", desc: "Focus on personality, not appearance" },
              { icon: Globe, title: "Global Connections", desc: "Meet people from around the world" },
              { icon: Shield, title: "Safe & Secure", desc: "Verified profiles and privacy protection" }
            ].map((feature, i) => (
              <Card key={i} className="glass-panel border-glass hover:shadow-warm transition-all duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-warm">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground font-poppins">{feature.title}</h5>
                    <p className="text-sm text-muted-foreground font-poppins">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Currency-Aware Pricing Display */}
        <VoiceCallPricing 
          onPurchaseCoins={onBuyCoins} 
          hasUnlimitedCalls={hasUnlimitedCalls} 
        />

        {/* Enhanced Social Proof & Urgency */}
        {!isPremium && !hasUnlimitedCalls && (
          <section className="space-y-space-md">
            {coinBalance < 20 && (
              <Card className="border-2 border-red-200/50 glass-panel bg-gradient-to-r from-red-50/30 to-pink-50/30 rounded-2xl shadow-warm">
                <CardContent className="p-space-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-2xl shadow-warm">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-800 font-poppins">Almost There!</h4>
                      <p className="text-sm text-red-700 font-poppins">Just {20 - coinBalance} more coins needed for your next authentic conversation</p>
                    </div>
                    <Button 
                      onClick={onBuyCoins}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-poppins rounded-xl shadow-warm hover:scale-105 transition-transform"
                    >
                      Get Coins
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Enhanced Social Proof */}
            <Card className="glass-panel bg-gradient-to-r from-blue-50/30 to-purple-50/30 rounded-2xl border-glass shadow-warm">
              <CardContent className="p-space-md">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full border-2 border-white shadow-warm"></div>
                      <div className="w-10 h-10 bg-gradient-secondary rounded-full border-2 border-white shadow-warm"></div>
                      <div className="w-10 h-10 bg-gradient-premium rounded-full border-2 border-white shadow-warm"></div>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-blue-700 font-poppins">10,247+</div>
                      <div className="text-sm text-blue-600 font-poppins">successful connections</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                    <p className="text-blue-800 font-semibold font-poppins mb-2">"Found my soulmate through a voice call!"</p>
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-600 text-sm font-poppins">- Sarah M., Premium Member</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
}