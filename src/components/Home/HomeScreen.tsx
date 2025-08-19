import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Video, Users, Crown, Filter, Gem, Phone, Globe, Star, Gift } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface HomeScreenProps {
  onStartMatch: () => void;
  onBuyCoins: () => void;
  onUpgradePremium: () => void;
  onOpenSpinWheel: () => void;
  matchPreference: "anyone" | "men" | "women";
  onChangePreference: (pref: "anyone" | "men" | "women") => void;
  isPremium: boolean;
  hasUnlimitedCalls?: boolean;
  onRequestUpgrade: () => void;
  onOpenReferrals?: () => void;
  coinBalance: number;
}

export default function HomeScreen({
  onStartMatch,
  onBuyCoins,
  onUpgradePremium,
  matchPreference,
  onChangePreference,
  isPremium,
  hasUnlimitedCalls = false,
  onRequestUpgrade,
  onOpenReferrals,
  coinBalance,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const [liveUserCount] = useState(1247832);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const { formatPrice, getFormattedPricing, currencyConfig } = useCurrency();

  const pricing = getFormattedPricing();

  const handleButtonPress = (buttonId: string, action: () => void) => {
    setPressedButton(buttonId);
    setTimeout(() => setPressedButton(null), 150);
    action();
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
        onClick={() => handleButtonPress(`pref-${value}`, () => locked ? onRequestUpgrade() : onChangePreference(value))}
        className={`relative flex-1 h-14 rounded-xl transition-all duration-300 overflow-hidden group ${
          isActive 
            ? "bg-gradient-primary text-white shadow-lg scale-[1.02] border-0" 
            : "bg-card/50 backdrop-blur-sm text-foreground border border-border/50 hover:bg-card hover:shadow-md"
        } ${locked ? "opacity-70" : ""} ${pressedButton === `pref-${value}` ? "animate-button-press" : ""} hover:scale-[1.02] active:scale-[0.98]`}
        aria-disabled={locked}
      >
        <div className="flex items-center justify-center h-full space-x-2">
          <span className="text-base">{emoji}</span>
          <span className="text-sm font-medium">{label}</span>
          {locked && (
            <Crown className="w-3.5 h-3.5 text-primary ml-1" />
          )}
        </div>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pb-20 safe-area-top">
      {/* Simplified Header */}
      <div className="pt-6 pb-4 px-4 relative">
        {/* Language selector button */}
        <button
          onClick={() => setShowLanguageSelector(true)}
          className="absolute top-3 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-300 hover:scale-105 z-10"
        >
          <Globe className="w-4 h-4" />
        </button>
        
        {/* Header content */}
        <div className="flex items-center justify-between pt-2">
          {/* App name */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground font-dancing">{t('app.name')}</h1>
            <p className="text-muted-foreground text-sm font-medium">{t('app.tagline')}</p>
          </div>
          
          {/* Balance display - more subtle */}
          <div className="glass-effect rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/20 rounded-lg">
                <Gem className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-primary text-xs font-medium">{coinBalance}</p>
                <button 
                  onClick={() => handleButtonPress('buy-coins', onBuyCoins)}
                  className="text-xs text-primary/70 hover:text-primary font-medium transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 max-w-md mx-auto">
        {/* Stats banner */}
        <div className="glass-effect rounded-2xl p-4 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{liveUserCount.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{t('home.peopleOnline')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-semibold text-foreground">4.8</span>
            </div>
          </div>
        </div>

        {/* Gender selection card */}
        <Card className="rounded-2xl border-0 shadow-card bg-card/80 backdrop-blur-sm animate-slide-in-up">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{t('home.whoToMeet')}</span>
            </div>
              
            <div className="flex gap-2 mb-3">
              <PreferenceButton value="anyone" label={t('home.everyone')} emoji="🌟" />
              <PreferenceButton value="men" label={t('home.men')} emoji="👨" />
              <PreferenceButton value="women" label={t('home.women')} emoji="👩" />
            </div>
            
            {!isPremium && (
              <div className="text-center">
                <button
                  onClick={() => handleButtonPress('upgrade-gender', onRequestUpgrade)}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t('premium.upgradeToChoose')}
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main action buttons */}
        <div className="space-y-3 animate-slide-in-up">
          <Button 
            onClick={() => handleButtonPress('start-match', onStartMatch)}
            className={`w-full h-16 rounded-2xl bg-gradient-primary text-white font-bold text-lg shadow-warm hover:shadow-xl transition-all duration-300 border-0 ${
              pressedButton === 'start-match' ? 'animate-button-press' : ''
            } hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2 bg-white/20 rounded-xl">
                <Video className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-bold">{t('home.startMatching')}</div>
                <div className="text-sm opacity-90 font-normal">{t('home.videoChat')}</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>

          <Button
            onClick={() => handleButtonPress('voice-chat', () => window.dispatchEvent(new CustomEvent('navigate-to-voice')))}
            className={`w-full h-14 rounded-2xl bg-gradient-secondary text-white font-semibold shadow-card hover:shadow-lg transition-all duration-300 border-0 ${
              pressedButton === 'voice-chat' ? 'animate-button-press' : ''
            } hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2 bg-white/20 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{t('home.voiceChat')}</div>
                <div className="text-xs opacity-90 flex items-center gap-2">
                  {hasUnlimitedCalls ? (
                    <>
                      <Crown className="w-3 h-3" />
                      <span className="font-medium">{t('home.unlimited')}</span>
                    </>
                  ) : (
                    <>
                      <Gem className="w-3 h-3" />
                      <span className="font-medium">{pricing.voice_call.formatted}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Button>
        </div>

        {/* Premium upgrade for non-premium users - more subtle */}
        {!isPremium && (
          <Card className="rounded-2xl border-0 shadow-card glass-effect overflow-hidden animate-slide-in-up">
            <CardContent className="p-5 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 bg-gradient-premium rounded-xl">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{t('premium.title')}</h3>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {t('premium.subtitle')}
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                  <Filter className="w-3 h-3 text-primary" />
                  <span className="font-medium">Gender filters</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                  <Users className="w-3 h-3 text-primary" />
                  <span className="font-medium">Priority queue</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => handleButtonPress('upgrade-premium', onUpgradePremium)}
                  className={`w-full bg-gradient-premium text-white font-semibold rounded-xl py-2.5 shadow-card hover:shadow-lg transition-all duration-300 border-0 ${
                    pressedButton === 'upgrade-premium' ? 'animate-button-press' : ''
                  } hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {t('premium.upgradeNow')}
                </Button>
                
                {onOpenReferrals && (
                  <button 
                    onClick={() => handleButtonPress('referrals', onOpenReferrals)}
                    className="w-full text-primary text-sm font-medium py-2 hover:text-primary/80 transition-colors"
                  >
                    <Gift className="w-4 h-4 mr-1 inline" />
                    Invite Friends for Premium
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <LanguageSelector 
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </div>
  );
}