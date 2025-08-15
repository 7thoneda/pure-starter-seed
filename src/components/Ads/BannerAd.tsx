import { useEffect, useRef, useState } from 'react';
import { AdService } from '@/services/adService';
import { X } from 'lucide-react';

interface BannerAdProps {
  size?: 'banner' | 'leaderboard' | 'rectangle';
  position?: 'top' | 'bottom' | 'inline';
  className?: string;
  showForPremium?: boolean;
}

export function BannerAd({ 
  size = 'banner', 
  position = 'bottom',
  className = '',
  showForPremium = false 
}: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);

  // Mock premium status - replace with actual premium detection
  const isPremiumUser = false; // This should come from your auth/subscription service

  useEffect(() => {
    const loadAd = async () => {
      if (!containerRef.current || (isPremiumUser && !showForPremium)) return;

      try {
        const adService = AdService.getInstance();
        
        // Check for ad blocker
        if (adService.isAdBlockerActive()) {
          setAdBlockerDetected(true);
          return;
        }

        const containerId = `banner-ad-${Date.now()}`;
        containerRef.current.id = containerId;
        
        const success = await adService.loadBannerAd(containerId, size);
        setIsLoaded(success);
      } catch (error) {
        console.error('Failed to load banner ad:', error);
      }
    };

    loadAd();
  }, [size, showForPremium, isPremiumUser]);

  if (isPremiumUser && !showForPremium) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-40 bg-white border-b';
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-40 bg-white border-t';
      case 'inline':
      default:
        return 'relative';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'leaderboard':
        return 'h-[90px]';
      case 'rectangle':
        return 'h-[250px]';
      case 'banner':
      default:
        return 'h-[50px]';
    }
  };

  if (adBlockerDetected) {
    return (
      <div className={`${getPositionClasses()} ${getSizeClasses()} ${className}`}>
        <div className="flex items-center justify-center h-full bg-yellow-50 border border-yellow-200">
          <div className="text-center px-4">
            <p className="text-sm text-yellow-800">
              Please disable your ad blocker to support our free service
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getPositionClasses()} ${getSizeClasses()} ${className}`}>
      <div className="relative flex items-center justify-center h-full">
        {position !== 'inline' && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-1 right-1 p-1 bg-black/20 hover:bg-black/40 rounded-full z-10"
            aria-label="Close ad"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
        
        <div 
          ref={containerRef}
          className="flex items-center justify-center w-full h-full"
        >
          {!isLoaded && (
            <div className="flex items-center justify-center bg-gray-100 rounded border w-full h-full">
              <span className="text-gray-500 text-sm">Advertisement</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}