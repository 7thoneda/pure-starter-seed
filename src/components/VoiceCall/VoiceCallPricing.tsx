import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Phone, Globe } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface VoiceCallPricingProps {
  onPurchaseCoins: () => void;
  hasUnlimitedCalls?: boolean;
}

export function VoiceCallPricing({ onPurchaseCoins, hasUnlimitedCalls }: VoiceCallPricingProps) {
  const { getFormattedPricing, currencyConfig } = useCurrency();
  const pricing = getFormattedPricing();

  if (hasUnlimitedCalls) {
    return null;
  }

  return (
    <Card className="rounded-3xl border-0 shadow-card bg-card/95 backdrop-blur-sm">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Pricing for {currencyConfig.country}
          </span>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4">
          <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground mb-1">
            {pricing.voice_call.formatted}
          </div>
          <div className="text-sm text-muted-foreground">per voice call</div>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground mb-6">
          <div className="flex items-center justify-center gap-2">
            <Gem className="w-4 h-4 text-accent" />
            <span>High quality voice calls</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-accent" />
            <span>Connect with people worldwide</span>
          </div>
        </div>

        <Button 
          onClick={onPurchaseCoins}
          className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300"
          size="lg"
        >
          <Gem className="w-4 h-4 mr-2" />
          Buy Coins
        </Button>

        <p className="text-xs text-muted-foreground mt-3">
          Prices automatically adjusted for your region
        </p>
      </CardContent>
    </Card>
  );
}