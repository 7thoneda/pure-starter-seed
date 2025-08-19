export interface AdGemOffer {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'app_install' | 'survey' | 'video' | 'signup' | 'purchase';
  imageUrl?: string;
  estimatedTime?: string;
}

export class AdGemService {
  private static instance: AdGemService;
  private isInitialized = false;
  private completedOffers: Set<string> = new Set();
  
  static getInstance(): AdGemService {
    if (!AdGemService.instance) {
      AdGemService.instance = new AdGemService();
    }
    return AdGemService.instance;
  }

  async initialize(userId: string): Promise<void> {
    try {
      // For now, using mock data until AdGem SDK is properly integrated
      console.log('AdGem Service initialized for user:', userId);
      this.isInitialized = true;
      
      // Load completed offers from localStorage
      const completed = localStorage.getItem('completedOffers');
      if (completed) {
        this.completedOffers = new Set(JSON.parse(completed));
      }
    } catch (error) {
      console.error('Failed to initialize AdGem:', error);
    }
  }

  async getOffers(): Promise<AdGemOffer[]> {
    if (!this.isInitialized) {
      throw new Error('AdGem not initialized');
    }

    // Enhanced mock offers with more realistic data
    const allOffers: AdGemOffer[] = [
      {
        id: 'offer_1',
        title: 'Install TikTok',
        description: 'Download TikTok, open the app and watch 3 videos to earn coins',
        reward: 150,
        type: 'app_install' as const,
        estimatedTime: '2 min'
      },
      {
        id: 'offer_2', 
        title: 'Mobile Gaming Survey',
        description: 'Share your gaming preferences and help improve mobile games',
        reward: 80,
        type: 'survey' as const,
        estimatedTime: '5 min'
      },
      {
        id: 'offer_3',
        title: 'Watch Promotional Video',
        description: 'Watch a short video about the latest tech products',
        reward: 25,
        type: 'video' as const,
        estimatedTime: '30 sec'
      },
      {
        id: 'offer_4',
        title: 'Netflix Premium Trial',
        description: 'Sign up for Netflix premium and start your free trial',
        reward: 500,
        type: 'signup' as const,
        estimatedTime: '3 min'
      },
      {
        id: 'offer_5',
        title: 'Instagram Profile Setup',
        description: 'Download Instagram, create account and upload your first photo',
        reward: 120,
        type: 'app_install' as const,
        estimatedTime: '3 min'
      },
      {
        id: 'offer_6',
        title: 'Product Experience Survey',
        description: 'Rate your recent online shopping experiences',
        reward: 60,
        type: 'survey' as const,
        estimatedTime: '4 min'
      },
      {
        id: 'offer_7',
        title: 'Spotify Music App',
        description: 'Install Spotify and listen to 5 songs to complete',
        reward: 180,
        type: 'app_install' as const,
        estimatedTime: '4 min'
      },
      {
        id: 'offer_8',
        title: 'Quick Video Review',
        description: 'Watch and rate a 2-minute product demonstration',
        reward: 45,
        type: 'video' as const,
        estimatedTime: '2 min'
      },
      {
        id: 'offer_9',
        title: 'Amazon Prime Signup',
        description: 'Start your Amazon Prime free trial and explore benefits',
        reward: 350,
        type: 'signup' as const,
        estimatedTime: '5 min'
      },
      {
        id: 'offer_10',
        title: 'Dating Preferences Survey',
        description: 'Help us understand modern dating preferences and trends',
        reward: 75,
        type: 'survey' as const,
        estimatedTime: '6 min'
      },
      {
        id: 'offer_11',
        title: 'Uber Eats First Order',
        description: 'Download Uber Eats and place your first food order',
        reward: 200,
        type: 'purchase' as const,
        estimatedTime: '10 min'
      },
      {
        id: 'offer_12',
        title: 'YouTube Premium Trial',
        description: 'Sign up for YouTube Premium and enjoy ad-free videos',
        reward: 300,
        type: 'signup' as const,
        estimatedTime: '3 min'
      }
    ];
    
    // Filter out completed offers
    return allOffers.filter(offer => !this.completedOffers.has(offer.id));
  }

  async completeOffer(offerId: string): Promise<{ success: boolean; reward: number }> {
    // Check if already completed
    if (this.completedOffers.has(offerId)) {
      throw new Error('Offer already completed');
    }
    
    const allOffers = await this.getAllOffers();
    const offer = allOffers.find(o => o.id === offerId);
    
    if (!offer) {
      throw new Error('Offer not found');
    }

    // Simulate offer completion (would integrate with real AdGem SDK)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, AdGem would validate completion
    // For now, we simulate validation and track via Supabase
    
    // Mark as completed locally
    this.completedOffers.add(offerId);
    localStorage.setItem('completedOffers', JSON.stringify([...this.completedOffers]));
    
    return {
      success: true,
      reward: offer.reward
    };
  }

  // New method to validate offer completion server-side
  async validateOfferCompletion(offerId: string, userId: string): Promise<boolean> {
    try {
      // In real implementation, this would call AdGem's validation API
      // For now, simulate validation based on localStorage
      return this.completedOffers.has(offerId);
    } catch (error) {
      console.error('Offer validation failed:', error);
      return false;
    }
  }

  private async getAllOffers(): Promise<AdGemOffer[]> {
    // Return all offers regardless of completion status
    return [
      {
        id: 'offer_1',
        title: 'Install TikTok',
        description: 'Download and open TikTok app',
        reward: 150,
        type: 'app_install' as const,
        estimatedTime: '2 min'
      },
      {
        id: 'offer_2', 
        title: 'Complete Survey',
        description: 'Share your opinion about mobile apps',
        reward: 80,
        type: 'survey' as const,
        estimatedTime: '5 min'
      },
      {
        id: 'offer_3',
        title: 'Watch Video Ad',
        description: 'Watch a short promotional video',
        reward: 25,
        type: 'video' as const,
        estimatedTime: '30 sec'
      },
      {
        id: 'offer_4',
        title: 'Sign up for Netflix',
        description: 'Create Netflix account and start trial',
        reward: 500,
        type: 'signup' as const,
        estimatedTime: '3 min'
      },
      {
        id: 'offer_5',
        title: 'Install Instagram',
        description: 'Download Instagram and create account',
        reward: 120,
        type: 'app_install' as const,
        estimatedTime: '3 min'
      },
      {
        id: 'offer_6',
        title: 'Product Review Survey',
        description: 'Rate products you\'ve used recently',
        reward: 60,
        type: 'survey' as const,
        estimatedTime: '4 min'
      }
    ];
  }
  openOfferwall(): void {
    // For demo, open a new window - replace with actual AdGem offerwall
    const offerwallUrl = 'https://www.adgem.com/offerwall/demo';
    window.open(offerwallUrl, '_blank', 'width=800,height=600');
  }

  // Get completion status
  isOfferCompleted(offerId: string): boolean {
    return this.completedOffers.has(offerId);
  }

  // Get completed offers count
  getCompletedOffersCount(): number {
    return this.completedOffers.size;
  }
}