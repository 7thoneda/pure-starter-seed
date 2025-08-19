import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Crown, Heart, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  price_coins: number;
  is_premium: boolean;
  category: string;
  animation_type: string;
}

interface VirtualGiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: VirtualGift) => Promise<void>;
  coinBalance: number;
  isPremiumUser: boolean;
}

export function VirtualGiftPanel({ 
  isOpen, 
  onClose, 
  onSendGift, 
  coinBalance, 
  isPremiumUser 
}: VirtualGiftPanelProps) {
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sendingGift, setSendingGift] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadGifts();
    }
  }, [isOpen]);

  const loadGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .order('price_coins', { ascending: true });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error loading gifts:', error);
    }
  };

  const handleSendGift = async (gift: VirtualGift) => {
    if (gift.is_premium && !isPremiumUser) return;
    if (coinBalance < gift.price_coins) return;
    
    setSendingGift(gift.id);
    try {
      await onSendGift(gift);
    } finally {
      setSendingGift(null);
    }
  };

  const filteredGifts = gifts.filter(gift => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'premium') return gift.is_premium;
    return gift.category === selectedCategory;
  });

  const categories = [
    { value: 'all', label: 'All', icon: Gift },
    { value: 'romantic', label: 'Romantic', icon: Heart },
    { value: 'luxury', label: 'Luxury', icon: Crown },
    { value: 'cute', label: 'Cute', icon: Sparkles },
    { value: 'premium', label: 'Premium', icon: Crown },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-warm max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Virtual Gifts</h3>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-coin/10 border-coin/20 text-coin">
              {coinBalance} coins
            </Badge>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              {categories.slice(0, 3).map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Icon className="w-3 h-3" />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="flex gap-2 mb-4">
              {categories.slice(3).map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Icon className="w-3 h-3" />
                    {category.label}
                  </Button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {filteredGifts.map((gift) => {
                const canAfford = coinBalance >= gift.price_coins;
                const canSend = canAfford && (!gift.is_premium || isPremiumUser);
                const isLoading = sendingGift === gift.id;

                return (
                  <Button
                    key={gift.id}
                    onClick={() => handleSendGift(gift)}
                    disabled={!canSend || isLoading}
                    variant="outline"
                    className={cn(
                      "h-20 p-2 flex-col gap-1 relative overflow-hidden",
                      "bg-gradient-to-br from-background to-background/80",
                      "border-border/50 hover:border-primary/50",
                      !canAfford && "opacity-50",
                      gift.is_premium && "border-premium/30 bg-gradient-premium/10",
                      isLoading && "animate-pulse"
                    )}
                  >
                    {gift.is_premium && (
                      <Crown className="absolute top-1 right-1 w-3 h-3 text-premium" />
                    )}
                    <span className="text-2xl mb-1">{gift.emoji}</span>
                    <span className="text-xs font-medium truncate w-full text-center">
                      {gift.name}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] px-1 py-0",
                        canAfford ? "bg-coin/10 border-coin/20 text-coin" : "bg-destructive/10 border-destructive/20 text-destructive"
                      )}
                    >
                      {gift.price_coins}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {filteredGifts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No gifts found in this category</p>
              </div>
            )}
          </Tabs>
        </div>
      </Card>
    </div>
  );
}