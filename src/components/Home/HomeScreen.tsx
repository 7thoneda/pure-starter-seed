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
  const { formatPrice, getFormattedPricing, currencyConfig } = useCurrency();

  const pricing = getFormattedPricing();

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
        className={`relative flex-1 h-16 rounded-2xl border-2 transition-all duration-300 overflow-hidden group ${
          isActive 
            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
            : "bg-card text-muted-foreground border-border hover:bg-muted hover:shadow-md"
        } ${locked ? "opacity-60" : ""} hover:scale-[1.02] active:scale-[0.98]`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1.5">
          <span className="text-lg">{emoji}</span>
          <span className="text-xs font-semibold">{label}</span>
          {locked && (
            <div className="absolute top-2 right-2">
              <Crown className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 safe-area-top">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-background relative">
        {/* Language selector button at top center */}
        <button
          onClick={() => setShowLanguageSelector(true)}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all duration-300 hover:scale-105 z-10"
        >
          <Globe className="w-4 h-4" />
        </button>
        
        {/* Header content with app name centered and balance on right */}
        <div className="flex items-start justify-between relative z-10 mt-6">
          {/* Center - App name and tagline */}
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-1 font-dancing">{t('app.name')}</h1>
            <p className="text-muted-foreground text-sm font-medium font-poppins">{t('app.tagline')}</p>
          </div>
          
          {/* Right side - Balance display */}
          <div className="bg-primary rounded-xl px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary-foreground/20 rounded-full">
                <Gem className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="text-center">
                <p className="text-primary-foreground/80 text-xs font-poppins font-medium">Your Balance</p>
                <p className="text-primary-foreground text-sm font-bold font-poppins">{coinBalance}</p>
              </div>
              <Button 
                size="sm"
                onClick={onBuyCoins}
                className="bg-primary-foreground text-primary font-poppins font-semibold h-6 px-2 rounded-lg border-0 shadow-none text-xs ml-1 hover:bg-primary-foreground/90"
              >
                Buy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 max-w-md mx-auto pt-6">
        {/* Main matching card - focused design */}
        <Card className="rounded-3xl border-0 shadow-sm bg-card backdrop-blur-sm overflow-hidden animate-fade-in">
          <CardContent className="p-0">
            {/* Preference selection */}
            <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">{t('home.whoToMeet')}</span>
            </div>
              
              <div className="flex gap-3">
                <PreferenceButton value="anyone" label={t('home.everyone')} emoji="🌟" />
                <PreferenceButton value="men" label={t('home.men')} emoji="👨" />
                <PreferenceButton value="women" label={t('home.women')} emoji="👩" />
              </div>
              
              {!isPremium && (
                <div className="mt-5 p-4 bg-primary/5 border border-primary/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-primary" />
                    <span className="text-xs text-foreground font-semibold">{t('premium.upgradeToChoose')}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Main action button */}
            <div className="p-6 pt-2">
            <Button 
              onClick={() => {
                onStartMatch();
              }}
              className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-bold relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-2 bg-primary-foreground/20 rounded-xl">
                  <Video className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold">{t('home.startMatching')}</div>
                  <div className="text-sm opacity-90 font-normal">{t('home.videoChat')}</div>
                </div>
              </div>
            </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice chat option */}
        <Card className="rounded-3xl border-0 shadow-sm bg-card backdrop-blur-sm animate-fade-in">
          <CardContent className="p-5">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-voice'))}
              className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-2 bg-secondary-foreground/20 rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold">{t('home.voiceChat')}</div>
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
          </CardContent>
        </Card>

        {/* Stats card */}
        <Card className="rounded-3xl border-0 shadow-sm bg-card backdrop-blur-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground font-poppins">{liveUserCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground font-medium">{t('home.peopleOnline')}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 justify-end">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                  </div>
                  <span className="text-lg font-bold text-foreground">4.8</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium">{t('home.appRating')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium upgrade for non-premium users */}
        {!isPremium && (
          <Card className="rounded-3xl border-0 shadow-sm bg-primary text-primary-foreground overflow-hidden relative animate-fade-in">
            <CardContent className="p-6 text-center relative z-10">
              <div className="p-3 bg-primary-foreground/20 rounded-2xl w-fit mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">{t('premium.title')}</h3>
              <p className="text-primary-foreground/90 text-sm mb-6 font-medium leading-relaxed">
                {t('premium.subtitle')}
              </p>
              
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                    <Filter className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Gender filters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                    <Users className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Priority queue</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={onUpgradePremium}
                  className="w-full bg-primary-foreground text-primary font-bold rounded-2xl px-8 py-3 hover:bg-primary-foreground/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('premium.upgradeNow')}
                </Button>
                
                {onOpenReferrals && (
                  <Button 
                    onClick={onOpenReferrals}
                    className="w-full bg-primary-foreground/10 text-primary-foreground font-bold rounded-2xl px-8 py-2.5 hover:bg-primary-foreground/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-primary-foreground/20"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Invite Friends for Premium
                  </Button>
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