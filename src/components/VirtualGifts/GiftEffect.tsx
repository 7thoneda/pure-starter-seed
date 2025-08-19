import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GiftEffectProps {
  id: string;
  emoji: string;
  animationType: string;
  onComplete: (id: string) => void;
}

export function GiftEffect({ id, emoji, animationType, onComplete }: GiftEffectProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(id), 300);
    }, getAnimationDuration(animationType));

    return () => clearTimeout(timer);
  }, [id, animationType, onComplete]);

  const getAnimationDuration = (type: string) => {
    switch (type) {
      case 'sparkle': return 3000;
      case 'rainbow': return 4000;
      case 'golden': return 3500;
      case 'flame': return 2500;
      case 'flash': return 1500;
      case 'twinkle': return 2000;
      default: return 2000;
    }
  };

  const getAnimationClass = (type: string) => {
    switch (type) {
      case 'sparkle': return 'animate-sparkle';
      case 'glow': return 'animate-soft-glow';
      case 'rainbow': return 'animate-rainbow';
      case 'golden': return 'animate-golden';
      case 'bounce': return 'animate-bounce';
      case 'flame': return 'animate-fire';
      case 'flash': return 'animate-flash';
      case 'twinkle': return 'animate-twinkle';
      default: return 'animate-floating-heart';
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-50 flex items-center justify-center",
        !isVisible && "opacity-0 transition-opacity duration-300"
      )}
    >
      <div className={cn(
        "text-8xl font-bold",
        getAnimationClass(animationType),
        animationType === 'sparkle' && "drop-shadow-2xl filter",
        animationType === 'rainbow' && "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent",
        animationType === 'golden' && "text-yellow-400 drop-shadow-lg filter",
        animationType === 'flame' && "text-orange-500 drop-shadow-lg filter"
      )}>
        {emoji}
      </div>
      
      {/* Particle effects for premium gifts */}
      {['sparkle', 'rainbow', 'golden'].includes(animationType) && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 rounded-full opacity-80",
                animationType === 'sparkle' && "bg-purple-400 animate-ping",
                animationType === 'rainbow' && "bg-gradient-to-r from-pink-400 to-purple-400 animate-bounce",
                animationType === 'golden' && "bg-yellow-400 animate-pulse"
              )}
              style={{
                left: `${20 + (i * 6)}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + (i % 3) * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}