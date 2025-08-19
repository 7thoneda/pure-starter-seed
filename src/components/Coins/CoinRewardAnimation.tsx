import { useEffect, useState } from "react";
import { Coins, Sparkles } from "lucide-react";

interface CoinRewardAnimationProps {
  amount: number;
  isVisible: boolean;
  onComplete: () => void;
}

export function CoinRewardAnimation({ amount, isVisible, onComplete }: CoinRewardAnimationProps) {
  const [stage, setStage] = useState<'hidden' | 'appearing' | 'celebrating' | 'disappearing'>('hidden');

  useEffect(() => {
    if (isVisible) {
      setStage('appearing');
      const timer1 = setTimeout(() => setStage('celebrating'), 300);
      const timer2 = setTimeout(() => setStage('disappearing'), 2000);
      const timer3 = setTimeout(() => {
        setStage('hidden');
        onComplete();
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isVisible, onComplete]);

  if (stage === 'hidden') return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="relative">
        {/* Particle effects */}
        {stage === 'celebrating' && (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-ping`}
                style={{
                  left: `${Math.cos(i * 45 * Math.PI / 180) * 60}px`,
                  top: `${Math.sin(i * 45 * Math.PI / 180) * 60}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </>
        )}

        {/* Main coin animation */}
        <div className={`
          flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 
          text-white px-6 py-4 rounded-full shadow-2xl transform transition-all duration-500
          ${stage === 'appearing' ? 'scale-0 opacity-0' : ''}
          ${stage === 'celebrating' ? 'scale-110 opacity-100 animate-bounce' : ''}
          ${stage === 'disappearing' ? 'scale-75 opacity-0' : ''}
        `}>
          <Coins className="w-8 h-8 animate-spin" />
          <span className="font-bold text-xl font-poppins">+{amount} Coins!</span>
        </div>
      </div>
    </div>
  );
}