import { useEffect, useState } from 'react';
import { AdService } from '@/services/adService';

interface InterstitialTriggerProps {
  trigger: 'call_end' | 'app_switch' | 'manual';
  frequency?: number; // Show ad every X triggers
  onAdShown?: () => void;
  onAdClosed?: () => void;
  children?: React.ReactNode;
}

export function InterstitialTrigger({
  trigger,
  frequency = 3,
  onAdShown,
  onAdClosed,
  children
}: InterstitialTriggerProps) {
  const [triggerCount, setTriggerCount] = useState(0);
  const [isShowingAd, setIsShowingAd] = useState(false);

  const shouldShowAd = () => {
    const count = parseInt(localStorage.getItem(`interstitial_${trigger}_count`) || '0');
    return count % frequency === 0 && count > 0;
  };

  const incrementTriggerCount = () => {
    const currentCount = parseInt(localStorage.getItem(`interstitial_${trigger}_count`) || '0');
    const newCount = currentCount + 1;
    localStorage.setItem(`interstitial_${trigger}_count`, newCount.toString());
    setTriggerCount(newCount);
  };

  const showInterstitial = async () => {
    if (isShowingAd) return;
    
    setIsShowingAd(true);
    onAdShown?.();
    
    try {
      const adService = AdService.getInstance();
      await adService.showInterstitial(trigger);
    } catch (error) {
      console.error('Error showing interstitial:', error);
    } finally {
      setIsShowingAd(false);
      onAdClosed?.();
    }
  };

  const handleTrigger = () => {
    incrementTriggerCount();
    
    if (shouldShowAd()) {
      showInterstitial();
    }
  };

  useEffect(() => {
    const count = parseInt(localStorage.getItem(`interstitial_${trigger}_count`) || '0');
    setTriggerCount(count);
  }, [trigger]);

  // For manual trigger, return a trigger function via render prop or ref
  if (trigger === 'manual') {
    return (
      <div onClick={handleTrigger}>
        {children}
      </div>
    );
  }

  // For automatic triggers, handle them via effects
  useEffect(() => {
    if (trigger === 'app_switch') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          handleTrigger();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [trigger]);

  // For call_end trigger, this component should be used where calls end
  const triggerInterstitial = () => {
    handleTrigger();
  };

  // Expose trigger function to parent components
  useEffect(() => {
    if (trigger === 'call_end') {
      (window as any).triggerCallEndInterstitial = triggerInterstitial;
    }
  }, [trigger]);

  return children ? <>{children}</> : null;
}

// Hook for easier usage
export function useInterstitialAd(trigger: 'call_end' | 'app_switch' | 'manual', frequency = 3) {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    AdService.getInstance().initialize().then(() => {
      setIsReady(true);
    });
  }, []);

  const showAd = async () => {
    if (!isReady) return false;
    
    try {
      const adService = AdService.getInstance();
      return await adService.showInterstitial(trigger);
    } catch (error) {
      console.error('Error showing interstitial:', error);
      return false;
    }
  };

  return { showAd, isReady };
}