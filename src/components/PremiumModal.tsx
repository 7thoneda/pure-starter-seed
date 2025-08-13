import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Crown, Check, Zap } from 'lucide-react';
import { PREMIUM_PLANS } from '@/config/payments';
import { formatCurrency, calculateDiscount } from '@/utils/paymentHelpers';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const plans = [
    { key: 'day', plan: PREMIUM_PLANS.day, badge: t('premium.badges.limitedTime'), popular: false },
    { key: 'week', plan: PREMIUM_PLANS.week, badge: t('premium.badges.mostPopular'), popular: true },
    { key: 'month', plan: PREMIUM_PLANS.month, badge: t('premium.badges.bestValue'), popular: false },
    { key: 'lifetime', plan: PREMIUM_PLANS.lifetime, badge: 'VIP', popular: false }
  ];

  const features = [
    t('premium.features.genderPreference'),
    t('premium.features.unlimitedCallTime'),
    t('premium.features.priorityQueue'),
    t('premium.features.noAds'),
    t('premium.features.premiumSupport')
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-card rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-full">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t('premium.upgradeTitle')}</h2>
                <p className="text-muted-foreground">{t('premium.upgradeSubtitle')}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Features Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {t('premium.unlimitedCalls')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {plans.map(({ key, plan, badge, popular }) => (
              <div
                key={key}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${
                  popular
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {badge && (
                  <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium ${
                    popular 
                      ? 'bg-primary text-white' 
                      : 'bg-accent text-white'
                  }`}>
                    {badge}
                  </div>
                )}
                
                <div className="text-center">
                  <h4 className="font-semibold text-foreground mb-2">{plan.duration}</h4>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-foreground">
                      {formatCurrency(plan.price)}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">{formatCurrency(plan.originalPrice)}</span>
                      <span className="ml-1 text-primary font-medium">
                        {calculateDiscount(plan.originalPrice, plan.price)}% off
                      </span>
                    </div>
                  </div>
                  <Button 
                    className={`w-full ${popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={popular ? 'default' : 'outline'}
                  >
                    {t('common.select')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>{t('premium.securePayments')}</p>
            <p className="mt-1 text-xs">{t('premium.demoMode')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}