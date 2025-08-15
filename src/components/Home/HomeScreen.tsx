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
            ? "bg-white text-gray-800 border-gray-200 shadow-lg scale-105 shadow-gray-200/50" 
            : "bg-white/60 text-gray-600 border-gray-100 hover:bg-white hover:shadow-md"
        } ${locked ? "opacity-60" : ""} hover:scale-[1.02] active:scale-[0.98]`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1.5">
          <span className="text-lg">{emoji}</span>
          <span className="text-xs font-semibold">{label}</span>
          {locked && (
            <div className="absolute top-2 right-2">
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
          )}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 pb-20 safe-area-top">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center bg-white/95 backdrop-blur-sm shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50" />
        
        <button
          onClick={() => setShowLanguageSelector(true)}
          className="absolute top-4 right-4 p-3 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-105 z-10"
        >
          <Globe className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-gentle-bounce">
            <Video className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-dancing">{t('app.name')}</h1>
          <p className="text-gray-600 text-base font-medium font-poppins">{t('app.tagline')}</p>
          
          {/* Live stats */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse shadow-sm" />
              <span className="font-medium">{liveUserCount.toLocaleString()} {t('home.online')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="font-medium">190+ {t('home.countries')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 max-w-md mx-auto -mt-6">
        {/* Main matching card */}
        <Card className="rounded-3xl border-0 shadow-card bg-card/95 backdrop-blur-sm overflow-hidden animate-fade-in">
          <CardContent className="p-0">
            {/* Preference selection */}
            <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Filter className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{t('home.whoToMeet')}</span>
            </div>
              
              <div className="flex gap-3">
                <PreferenceButton value="anyone" label={t('home.everyone')} emoji="🌟" />
                <PreferenceButton value="men" label={t('home.men')} emoji="👨" />
                <PreferenceButton value="women" label={t('home.women')} emoji="👩" />
              </div>
              
              {!isPremium && (
                <div className="mt-5 p-4 bg-accent/10 border border-accent/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Crown className="w-4 h-4 text-accent" />
                    <span className="text-xs text-accent-foreground font-semibold">{t('premium.upgradeToChoose')}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Main action button */}
            <div className="p-6 pt-2">
            <Button 
              onClick={onStartMatch}
              className="w-full h-16 rounded-3xl bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 hover:from-red-600 hover:via-pink-600 hover:to-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] border-0 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 text-lg font-bold relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl">
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
        <Card className="rounded-3xl border-0 shadow-lg bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-5">
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-voice'))}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl">
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

        {/* Referrals card */}
        {onOpenReferrals && (
          <Card className="rounded-3xl border-0 shadow-lg bg-white/95 backdrop-blur-sm animate-fade-in">
            <CardContent className="p-5">
              <Button
                onClick={onOpenReferrals}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white hover:scale-[1.02] active:scale-[0.98] border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold">Invite Friends</div>
                    <div className="text-xs opacity-90 font-medium">Earn 24h Premium for each referral</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats card */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white/95 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-800 font-poppins">{liveUserCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600 font-medium">{t('home.peopleOnline')}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 justify-end">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Star className="w-4 h-4 fill-purple-500 text-purple-500" />
                  </div>
                  <span className="text-lg font-bold text-gray-800">4.8</span>
                </div>
                <div className="text-xs text-gray-600 font-medium">{t('home.appRating')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium upgrade for non-premium users */}
        {!isPremium && (
          <Card className="rounded-3xl border-0 shadow-card bg-gradient-premium text-primary-foreground overflow-hidden relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
            <CardContent className="p-6 text-center relative z-10">
              <div className="p-3 bg-white/20 rounded-2xl w-fit mx-auto mb-4 animate-gentle-bounce">
                <Crown className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-poppins">{t('premium.title')}</h3>
              <p className="text-primary-foreground/90 text-sm mb-6 font-medium leading-relaxed">
                {t('premium.subtitle')}
              </p>
              
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Filter className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Gender filters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Users className="w-3 h-3" />
                  </div>
                  <span className="font-medium">Priority queue</span>
                </div>
              </div>
              
              <Button 
                onClick={onUpgradePremium}
                className="bg-card text-primary font-bold rounded-2xl px-8 py-3 hover:bg-card/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('premium.upgradeNow')}
              </Button>
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