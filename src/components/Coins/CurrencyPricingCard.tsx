import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Sparkles, Star, Crown } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  amount: number;
  formatted: string;
  popular?: boolean;
  bonus?: number;
}

interface CurrencyPricingCardProps {
  onPurchase: (packageId: string, amount: number) => void;
}

export function CurrencyPricingCard({ onPurchase }: CurrencyPricingCardProps) {
  const { getFormattedPricing, currencyConfig } = useCurrency();
  const pricing = getFormattedPricing();

  const packages: CoinPackage[] = [
    {
      id: 'small',
      name: 'Starter Pack',
      coins: pricing.coin_packages.small.coins,
      amount: pricing.coin_packages.small.amount,
      formatted: pricing.coin_packages.small.formatted,
    },
    {
      id: 'medium',
      name: 'Popular Pack',
      coins: pricing.coin_packages.medium.coins,
      amount: pricing.coin_packages.medium.amount,
      formatted: pricing.coin_packages.medium.formatted,
      popular: true,
      bonus: 100,
    },
    {
      id: 'large',
      name: 'Premium Pack',
      coins: pricing.coin_packages.large.coins,
      amount: pricing.coin_packages.large.amount,
      formatted: pricing.coin_packages.large.formatted,
      bonus: 500,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Buy Coins</h2>
        <p className="text-muted-foreground">
          Pricing automatically adjusted for {currencyConfig.country}
        </p>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
              pkg.popular 
                ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-accent/5' 
                : 'hover:shadow-md'
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                <Star className="w-3 h-3 inline mr-1" />
                POPULAR
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <div className={`p-2 rounded-xl ${
                  pkg.popular 
                    ? 'bg-gradient-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {pkg.id === 'large' ? <Crown className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                </div>
                {pkg.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {pkg.coins.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Coins</div>
                
                {pkg.bonus && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    <Sparkles className="w-3 h-3 mr-1" />
                    +{pkg.bonus} Bonus
                  </Badge>
                )}
              </div>
              
              <div className="text-2xl font-bold text-primary">
                {pkg.formatted}
              </div>
              
              <Button 
                onClick={() => onPurchase(pkg.id, pkg.amount)}
                className={`w-full ${
                  pkg.popular 
                    ? 'bg-gradient-primary hover:scale-105' 
                    : ''
                }`}
                size="lg"
              >
                Purchase Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-xs text-muted-foreground mt-6">
        <p>Prices shown in {currencyConfig.code} based on your location</p>
        <p>Secure payment processing • Instant coin delivery</p>
      </div>
    </div>
  );
}