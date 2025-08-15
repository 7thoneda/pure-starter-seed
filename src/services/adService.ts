import { toast } from "@/hooks/use-toast";

export interface AdConfig {
  admobAppId: string;
  bannerId: string;
  interstitialId: string;
  rewardedVideoId: string;
  testMode: boolean;
}

export interface RewardedAdReward {
  amount: number;
  type: 'coins' | 'time_extension';
}

class AdService {
  private static instance: AdService;
  private config: AdConfig;
  private isInitialized = false;
  private adsLoaded = {
    banner: false,
    interstitial: false,
    rewardedVideo: false
  };

  private constructor() {
    this.config = {
      admobAppId: 'ca-app-pub-1776596266948987~8787462524',
      bannerId: 'ca-app-pub-1776596266948987/6300978111',
      interstitialId: 'ca-app-pub-1776596266948987/5213212207',
      rewardedVideoId: 'ca-app-pub-1776596266948987/4126446304',
      testMode: true // Set to false for production
    };
  }

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load Google AdSense script
      await this.loadAdSenseScript();
      
      // Initialize AdSense
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({
          google_ad_client: this.config.admobAppId,
          enable_page_level_ads: true
        });
      }

      this.isInitialized = true;
      console.log('Ad Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ad service:', error);
      throw error;
    }
  }

  private loadAdSenseScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="adsbygoogle.js"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.admobAppId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load AdSense script'));
      
      document.head.appendChild(script);
    });
  }

  async showRewardedVideo(rewardType: 'coins' | 'time_extension' = 'coins'): Promise<RewardedAdReward | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Simulate rewarded video ad for web
      return new Promise((resolve) => {
        // Create modal overlay for video ad simulation
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center';
        overlay.innerHTML = `
          <div class="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
            <h3 class="text-lg font-semibold mb-4">Rewarded Video Ad</h3>
            <div class="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <div class="text-gray-500">🎬 Video Ad Playing...</div>
            </div>
            <div class="flex gap-3">
              <button id="ad-close" class="flex-1 px-4 py-2 bg-gray-300 rounded">Close</button>
              <button id="ad-complete" class="flex-1 px-4 py-2 bg-green-500 text-white rounded">Complete (+${rewardType === 'coins' ? '50 coins' : '30 seconds'})</button>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#ad-close');
        const completeBtn = overlay.querySelector('#ad-complete');

        closeBtn?.addEventListener('click', () => {
          document.body.removeChild(overlay);
          resolve(null);
        });

        completeBtn?.addEventListener('click', () => {
          document.body.removeChild(overlay);
          const reward: RewardedAdReward = {
            amount: rewardType === 'coins' ? 50 : 30,
            type: rewardType
          };
          resolve(reward);
        });

        // Auto-complete after 5 seconds for demo
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
            const reward: RewardedAdReward = {
              amount: rewardType === 'coins' ? 50 : 30,
              type: rewardType
            };
            resolve(reward);
          }
        }, 5000);
      });
    } catch (error) {
      console.error('Error showing rewarded video:', error);
      toast({
        title: "Ad Error",
        description: "Unable to load rewarded video. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }

  async showInterstitial(trigger: 'call_end' | 'app_switch' | 'manual'): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Simulate interstitial ad
      return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-white z-50 flex items-center justify-center';
        overlay.innerHTML = `
          <div class="text-center">
            <div class="w-80 h-60 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <div class="text-gray-600">📱 Interstitial Ad</div>
            </div>
            <button id="interstitial-close" class="px-6 py-3 bg-primary text-white rounded-lg">
              Continue to App
            </button>
          </div>
        `;

        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('#interstitial-close');
        closeBtn?.addEventListener('click', () => {
          document.body.removeChild(overlay);
          resolve(true);
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
            resolve(true);
          }
        }, 5000);
      });
    } catch (error) {
      console.error('Error showing interstitial:', error);
      return false;
    }
  }

  async loadBannerAd(containerId: string, size: 'banner' | 'leaderboard' | 'rectangle' = 'banner'): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Banner container not found:', containerId);
        return false;
      }

      const sizeConfig = {
        banner: { width: '320', height: '50' },
        leaderboard: { width: '728', height: '90' },
        rectangle: { width: '300', height: '250' }
      };

      const config = sizeConfig[size];
      
      container.innerHTML = `
        <ins class="adsbygoogle"
             style="display:inline-block;width:${config.width}px;height:${config.height}px"
             data-ad-client="${this.config.admobAppId}"
             data-ad-slot="${this.config.bannerId}">
        </ins>
      `;

      if ((window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.log('AdSense push error:', e);
        }
      }

      this.adsLoaded.banner = true;
      return true;
    } catch (error) {
      console.error('Error loading banner ad:', error);
      return false;
    }
  }

  isAdBlockerActive(): boolean {
    // Simple ad blocker detection
    const testElement = document.createElement('div');
    testElement.innerHTML = '&nbsp;';
    testElement.className = 'adsbox';
    testElement.style.position = 'absolute';
    testElement.style.left = '-999px';
    
    document.body.appendChild(testElement);
    const isBlocked = testElement.offsetHeight === 0;
    document.body.removeChild(testElement);
    
    return isBlocked;
  }

  getAdRevenue(): { estimated: number; currency: string } {
    // Mock revenue calculation
    const dailyImpressions = Math.floor(Math.random() * 1000) + 500;
    const cpm = 2.5; // $2.50 CPM
    const estimatedDaily = (dailyImpressions / 1000) * cpm;
    
    return {
      estimated: estimatedDaily,
      currency: 'USD'
    };
  }
}

export { AdService };