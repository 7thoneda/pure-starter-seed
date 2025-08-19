import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";
import { ReactionButton } from "@/components/VideoChat/ReactionButton";
import { cn } from "@/lib/utils";

interface PremiumReactionsProps {
  isVisible: boolean;
  onReact: (reaction: string, cost: number) => void;
  coinBalance: number;
  isPremium: boolean;
}

export function PremiumReactions({ isVisible, onReact, coinBalance, isPremium }: PremiumReactionsProps) {
  const premiumReactions = [
    { emoji: "💎", label: "Diamond", cost: 25, tier: "premium" },
    { emoji: "👑", label: "Crown", cost: 30, tier: "premium" },
    { emoji: "🌟", label: "Superstar", cost: 20, tier: "premium" },
    { emoji: "🦄", label: "Unicorn", cost: 35, tier: "vip" },
    { emoji: "⚡", label: "Lightning", cost: 15, tier: "premium" },
    { emoji: "🔮", label: "Magic", cost: 40, tier: "vip" },
    { emoji: "🏆", label: "Trophy", cost: 45, tier: "vip" },
    { emoji: "💝", label: "Premium Gift", cost: 50, tier: "vip" },
  ];

  const standardStickers = [
    { emoji: "😎", label: "Cool", cost: 2 },
    { emoji: "🤔", label: "Thinking", cost: 2 },
    { emoji: "😘", label: "Kiss", cost: 3 },
    { emoji: "🤗", label: "Hug", cost: 3 },
    { emoji: "🥰", label: "Love", cost: 4 },
    { emoji: "😇", label: "Angel", cost: 4 },
    { emoji: "🤩", label: "Star Eyes", cost: 5 },
    { emoji: "🥳", label: "Party", cost: 5 },
  ];

  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-2 animate-slide-up max-h-80 overflow-y-auto">
      {/* Premium Section */}
      {isPremium && (
        <>
          <div className="flex items-center gap-1 mb-2">
            <Crown className="w-4 h-4 text-premium" />
            <Badge variant="outline" className="bg-premium/10 border-premium/20 text-premium text-xs">
              Premium
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {premiumReactions.map((reaction) => (
              <ReactionButton
                key={reaction.emoji}
                emoji={reaction.emoji}
                label={reaction.label}
                cost={reaction.cost}
                coinBalance={coinBalance}
                onReact={onReact}
                className={cn(
                  "relative",
                  reaction.tier === "vip" && "border-premium/50 bg-gradient-premium/20"
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Standard Section */}
      <div className="flex items-center gap-1 mb-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs">
          Standard
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {standardStickers.map((reaction) => (
          <ReactionButton
            key={reaction.emoji}
            emoji={reaction.emoji}
            label={reaction.label}
            cost={reaction.cost}
            coinBalance={coinBalance}
            onReact={onReact}
          />
        ))}
      </div>

      {!isPremium && (
        <div className="mt-3 p-3 bg-premium/10 border border-premium/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-premium" />
            <span className="text-sm font-medium text-premium">Unlock Premium</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Get access to exclusive premium reactions and stickers!
          </p>
          <Button size="sm" className="w-full bg-gradient-premium">
            Upgrade to Premium
          </Button>
        </div>
      )}
    </div>
  );
}