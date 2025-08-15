import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/hooks/useCurrency";
import { 
  Crown, 
  Check, 
  Zap, 
  Heart, 
  MessageCircle, 
  ArrowLeft,
  Sparkles,
  X,
  Loader2,
  Timer,
  Gift
} from "lucide-react";
import { PaymentService } from "@/services/paymentService";
import { PREMIUM_PLANS } from "@/config/payments";
import { useToast } from "@/hooks/use-toast";

interface PremiumScreenProps {
  onBack: () => void;
  onSubscribe: (plan: string) => void;
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const premiumFeatures = [
  { icon: Zap, text: "features.genderPreference", checked: true },
  { icon: Heart, text: "features.targetedMatching", checked: true },
  { icon: MessageCircle, text: "features.priorityQueue", checked: true },
  { icon: Sparkles, text: "features.advancedFilters", checked: true },
  { icon: Timer, text: "features.unlimitedCallTime", checked: true },
];

export function PremiumScreen({ onBack, onSubscribe, userInfo }: PremiumScreenProps) {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<'live' | 'demo'>('live');
  const { toast } = useToast();
  const { getFormattedPricing, currencyConfig } = useCurrency();

  // Test payment gateway on component mount
  useEffect(() => {
    const testGateway = async () => {
      const result = await PaymentService.testPaymentGateway();
      if (!result.available) {
        setPaymentMode('demo');
        console.warn('Payment gateway not available:', result.error);
      }
    };
    
    testGateway();
  }, [toast]);
  
  const pricing = getFormattedPricing();
  
  const plans = [
    { 
      id: "day", 
      duration: t('premium.plans.day'), 
      price: currencyConfig.code === 'INR' ? '₹19' : '$0.25', 
      originalPrice: currencyConfig.code === 'INR' ? '₹29' : '$0.35', 
      badge: t('premium.badges.mostPopular'), 
      description: t('premium.unlimitedCalls') 
    },
    { 
      id: "week", 
      duration: t('premium.plans.week'), 
      price: currencyConfig.code === 'INR' ? '₹99' : '$1.49', 
      originalPrice: currencyConfig.code === 'INR' ? '₹149' : '$2.49', 
      badge: null, 
      description: t('premium.unlimitedCalls') 
    },
    { 
      id: "month", 
      duration: t('premium.plans.month'), 
      price: pricing.premium_monthly.formatted, 
      originalPrice: currencyConfig.code === 'INR' ? '₹699' : '$9.99', 
      badge: t('premium.badges.bestValue'), 
      description: t('premium.unlimitedCalls') 
    },
    { 
      id: "lifetime", 
      duration: t('premium.plans.lifetime'), 
      price: currencyConfig.code === 'INR' ? '₹2999' : '$39.99', 
      originalPrice: currencyConfig.code === 'INR' ? '₹4999' : '$59.99', 
      badge: t('premium.badges.limitedTime'), 
      description: t('premium.allFeaturesFree') 
    },
  ];

  const handlePremiumPurchase = async (planId: string) => {
    if (isProcessing || processingPlan) return;
    
    setIsProcessing(true);
    setProcessingPlan(planId);
    
    try {
      const result = await PaymentService.subscribeToPremium(
        planId as keyof typeof PREMIUM_PLANS,
        userInfo
      );
      
      if (result.success) {
        // Only activate premium after successful payment
        onSubscribe(planId);
        const plan = plans.find(p => p.id === planId);
        toast({
          title: "Premium Activated! 👑",
          description: `Payment successful! Your ${plan?.duration} subscription is now active.`,
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Payment was not completed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Payment could not be processed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="pt-16 pb-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button 
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="text-center text-white">
          <Crown className="w-20 h-20 mx-auto mb-6 animate-float" />
          <h1 className="text-4xl font-bold mb-3 font-dancing">{t('premium.upgradeTitle')}</h1>
          <p className="text-white/90 font-poppins text-lg">{t('premium.upgradeSubtitle')}</p>
        </div>
      </div>

      <div className="px-6 pb-24 space-y-6">
        <div className="max-w-md mx-auto">
          {/* Gender Preference Highlight */}
          <Card className="bg-white/95 backdrop-blur-sm rounded-3xl border-0 shadow-2xl mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">👨</span>
                  </div>
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">👩</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-3">{t('premium.genderMatching')}</h2>
                <p className="text-gray-600 font-poppins text-base leading-relaxed">
                  {t('premium.genderMatchingDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features List */}
          <Card className="bg-white/95 backdrop-blur-sm rounded-3xl border-0 shadow-2xl mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                {premiumFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-gray-800 font-poppins text-lg flex-1">{t(`premium.${feature.text}`)}</span>
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Plans */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border-0 rounded-2xl ${
                  plan.badge === "Most Popular" 
                    ? "bg-white shadow-2xl ring-4 ring-white/50 scale-105" 
                    : "bg-white/90 backdrop-blur-sm shadow-xl hover:scale-105"
                } ${isProcessing ? "opacity-50 pointer-events-none" : ""} ${
                  processingPlan === plan.id ? "ring-2 ring-primary/50" : ""
                }`}
                onClick={() => handlePremiumPurchase(plan.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-xl font-poppins text-gray-800">{plan.duration}</span>
                        {plan.badge && (
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-poppins text-xs px-3 py-1">
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-primary font-poppins">{plan.price}</span>
                        <span className="text-lg text-gray-400 line-through font-poppins">
                          {plan.originalPrice}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                    </div>
                    <Button 
                      disabled={isProcessing || processingPlan === plan.id}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-poppins h-12 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative"
                    >
                      {processingPlan === plan.id ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          {t('common.select')}
                          {paymentMode === 'demo' && (
                            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              DEMO
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8 space-y-4">
            <p className="text-white/90 font-poppins text-lg">
              ⚡ {t('premium.paymentComplete')}
            </p>
            <p className="text-white/70 text-sm font-poppins">
              🔒 Secure payments • Pricing for {currencyConfig.country}
              {paymentMode === 'demo' && (
                <span className="block mt-1 text-yellow-300">
                  ⚠️ {t('premium.demoMode')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}