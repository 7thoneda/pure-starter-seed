import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Video, Users, Crown, Filter, Gem, Phone, Globe, Star } from "lucide-react";

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
}: HomeScreenProps) {
  const { t } = useTranslation();
  const [liveUserCount] = useState(1247832);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

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
        className={`relative flex-1 h-16 rounded-2xl border transition-all duration-300 ${
          isActive 
            ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white border-transparent shadow-md" 
            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
        } ${locked ? "opacity-60" : ""}`}
        aria-disabled={locked}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-1">
          <span className="text-lg">{emoji}</span>
          <span className="text-xs font-medium">{label}</span>
          {locked && (
            <Crown className="w-3 h-3 text-gray-400 absolute top-1 right-1" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="pt-16 pb-8 px-6 text-center bg-white shadow-sm relative">
        <button
          onClick={() => setShowLanguageSelector(true)}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Globe className="w-5 h-5" />
        </button>
        
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('app.name')}</h1>
        <p className="text-gray-600 text-sm">{t('app.tagline')}</p>
        
        {/* Live stats */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{liveUserCount.toLocaleString()} {t('home.online')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>190+ {t('home.countries')}</span>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 max-w-sm mx-auto -mt-4">
        {/* Main matching card */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white overflow-hidden">
          <CardContent className="p-0">
            {/* Preference selection */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{t('home.whoToMeet')}</span>
              </div>
              
              <div className="flex gap-2">
                <PreferenceButton value="anyone" label={t('home.everyone')} emoji="🌟" />
                <PreferenceButton value="men" label={t('home.men')} emoji="👨" />
                <PreferenceButton value="women" label={t('home.women')} emoji="👩" />
              </div>
              
              {!isPremium && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-yellow-800 font-medium">{t('premium.upgradeToChoose')}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Main action button */}
            <div className="p-6 pt-2">
              <Button 
                onClick={onStartMatch}
                className="w-full h-16 rounded-3xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-lg font-bold"
              >
                <div className="flex items-center gap-3">
                  <Video className="w-6 h-6" />
                  <div className="text-left">
                    <div>{t('home.startMatching')}</div>
                    <div className="text-sm opacity-90 font-normal">{t('home.videoChat')}</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice chat option */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <Button
              onClick={() => {/* Navigate to voice tab */}}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{t('home.voiceChat')}</div>
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    {hasUnlimitedCalls ? (
                      <>
                        <Crown className="w-3 h-3" />
                        <span>{t('home.unlimited')}</span>
                      </>
                    ) : (
                      <>
                        <Gem className="w-3 h-3" />
                        <span>20 {t('coins.balance').toLowerCase()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Stats card */}
        <Card className="rounded-3xl border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{liveUserCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{t('home.peopleOnline')}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">4.8</span>
                </div>
                <div className="text-xs text-gray-600">{t('home.appRating')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium upgrade for non-premium users */}
        {!isPremium && (
          <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-bold mb-2">{t('premium.title')}</h3>
              <p className="text-white/90 text-sm mb-4">
                {t('premium.subtitle')}
              </p>
              
              <div className="flex justify-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Gender filters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Priority queue</span>
                </div>
              </div>
              
              <Button 
                onClick={onUpgradePremium}
                className="bg-white text-purple-600 font-semibold rounded-2xl px-6 py-2 hover:bg-white/90 transition-all duration-300 hover:scale-105"
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