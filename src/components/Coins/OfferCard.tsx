import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, TrendingUp, Users } from "lucide-react";
import { AdGemOffer } from "@/services/adgemService";
import { OfferDifficultyBadge } from "./OfferDifficultyBadge";

interface OfferCardProps {
  offer: AdGemOffer;
  onComplete: (offer: AdGemOffer) => void;
  isCompleting: boolean;
}

export function OfferCard({ offer, onComplete, isCompleting }: OfferCardProps) {
  const [progress, setProgress] = useState(0);

  const getOfferIcon = (type: string) => {
    const iconMap = {
      'app_install': '📱',
      'video': '🎬',
      'signup': '✏️',
      'purchase': '💳',
      'survey': '📋'
    };
    return iconMap[type as keyof typeof iconMap] || '🎁';
  };

  const getPopularityCount = () => Math.floor(Math.random() * 5000) + 500;

  const isHighValue = offer.reward >= 200;
  const isQuickEarn = offer.estimatedTime && parseInt(offer.estimatedTime) <= 2;

  const handleStart = () => {
    if (isCompleting) return;
    
    // Simulate progress during completion
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    onComplete(offer);
  };

  return (
    <Card className={`
      shadow-card rounded-xl border-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      ${isHighValue ? 'ring-2 ring-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : ''}
      ${isCompleting ? 'opacity-75' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* App Icon/Emoji */}
          <div className={`
            text-3xl p-2 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm
            ${isCompleting ? 'animate-pulse' : ''}
          `}>
            {getOfferIcon(offer.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header with badges */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-base font-poppins flex items-center gap-2">
                  {offer.title}
                  {isHighValue && <Badge className="bg-yellow-500 text-white text-xs animate-pulse">Hot Deal</Badge>}
                  {isQuickEarn && <Badge className="bg-green-500 text-white text-xs">Quick Earn</Badge>}
                </h4>
              </div>
              <div className="flex items-center gap-1 text-yellow-600 font-bold font-poppins">
                <Star className="w-4 h-4 fill-current" />
                {offer.reward}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground font-poppins mb-3 line-clamp-2">{offer.description}</p>
            
            {/* Progress bar during completion */}
            {isCompleting && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Completing offer...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {offer.estimatedTime && (
                  <Badge variant="outline" className="text-xs font-poppins">
                    <Clock className="w-3 h-3 mr-1" />
                    {offer.estimatedTime}
                  </Badge>
                )}
                <OfferDifficultyBadge estimatedTime={offer.estimatedTime || ''} reward={offer.reward} />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {getPopularityCount()}+ completed
                </div>
              </div>
              
              <Button 
                size="sm"
                onClick={handleStart}
                disabled={isCompleting}
                className={`
                  h-8 px-4 font-poppins rounded-lg transition-all duration-300
                  ${isHighValue ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : ''}
                  ${isCompleting ? 'animate-pulse' : 'hover:scale-105'}
                `}
                variant={isHighValue ? "default" : "default"}
              >
                {isCompleting ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Start
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}