import { realMatchingService } from './realMatchingService';

export interface MatchingRequest {
  id: string;
  userId: string;
  userGender: 'male' | 'female' | 'other';
  preferredGender: 'anyone' | 'men' | 'women';
  isPremium: boolean;
  callType: 'video' | 'voice';
  status: 'waiting' | 'matched' | 'cancelled';
  createdAt: Date;
  matchedWith?: string;
  callId?: string;
}

export class CallMatchingService {
  private static instance: CallMatchingService;
  private matchingService = realMatchingService;

  static getInstance(): CallMatchingService {
    if (!CallMatchingService.instance) {
      CallMatchingService.instance = new CallMatchingService();
    }
    return CallMatchingService.instance;
  }

  // Start looking for a match
  async startMatching(
    userId: string,
    userGender: 'male' | 'female' | 'other',
    preferredGender: 'anyone' | 'men' | 'women',
    isPremium: boolean,
    callType: 'video' | 'voice'
  ): Promise<string> {
    console.log('Starting matching for user:', userId);
    
    try {
      // Use the real matching service
      const result = await this.matchingService.startMatching(
        userId,
        userGender,
        preferredGender,
        isPremium,
        callType
      );
      
      // Set up event handlers for the matching service
      this.matchingService.onMatchFound = (callId: string, partnerId: string) => {
        this.onMatchFound?.(callId, partnerId);
      };
      
      this.matchingService.onError = (error: string) => {
        this.onError?.(error);
      };
      
      return result;
    } catch (error) {
      console.error('Error in matching process:', error);
      this.onError?.('Failed to start matching');
      throw error;
    }
  }

  // Cancel matching
  async cancelMatching(matchingRequestId: string): Promise<void> {
    console.log('Cancelling matching request:', matchingRequestId);
    
    try {
      await this.matchingService.cancelMatching(matchingRequestId);
    } catch (error) {
      console.error('Error cancelling matching:', error);
      this.onError?.('Failed to cancel matching');
      throw error;
    }
  }

  // Clean up old matching requests (should be called periodically)
  static async cleanupOldRequests(): Promise<void> {
    try {
      await realMatchingService.cleanupOldRequests();
    } catch (error: any) {
      console.error('Failed to cleanup old requests:', error);
    }
  }

  // Event handlers
  onMatchFound?: (callId: string, partnerId: string) => void;
  onError?: (error: string) => void;
}

export const callMatchingService = CallMatchingService.getInstance();