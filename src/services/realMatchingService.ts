import { supabase } from '@/integrations/supabase/client';

export interface MatchingRequest {
  id: string;
  user_id: string;
  gender: 'male' | 'female' | 'other';
  preferred_gender: 'anyone' | 'men' | 'women';
  call_type: 'video' | 'voice';
  is_premium: boolean;
  status: 'waiting' | 'matched' | 'cancelled';
  matched_with_user_id?: string;
  call_session_id?: string;
  created_at: string;
  updated_at: string;
}

export class RealMatchingService {
  private static instance: RealMatchingService;
  private realtimeChannel: any = null;
  private currentMatchingRequestId: string | null = null;

  private constructor() {}

  static getInstance(): RealMatchingService {
    if (!RealMatchingService.instance) {
      RealMatchingService.instance = new RealMatchingService();
    }
    return RealMatchingService.instance;
  }

  // Start matching process
  async startMatching(
    userId: string,
    userGender: 'male' | 'female' | 'other',
    preferredGender: 'anyone' | 'men' | 'women',
    isPremium: boolean,
    callType: 'video' | 'voice'
  ): Promise<string> {
    console.log('🎯 realMatchingService.startMatching called with:', {
      userId, userGender, preferredGender, isPremium, callType
    });

    // First, try to find an existing compatible request
    console.log('🔍 Looking for existing compatible requests...');
    const compatibleRequest = await this.findCompatibleRequest(
      userGender,
      preferredGender,
      isPremium,
      callType
    );

    if (compatibleRequest) {
      console.log('🎉 Found compatible request:', compatibleRequest);
      // Found a match! Create call session and update both requests
      return await this.createMatch(userId, compatibleRequest);
    } else {
      console.log('⭕ No compatible requests found, creating new matching request...');
      // No match found, create new matching request
      return await this.createMatchingRequest(
        userId,
        userGender,
        preferredGender,
        isPremium,
        callType
      );
    }
  }

  // Find compatible matching request
  private async findCompatibleRequest(
    userGender: 'male' | 'female' | 'other',
    preferredGender: 'anyone' | 'men' | 'women',
    isPremium: boolean,
    callType: 'video' | 'voice'
  ): Promise<MatchingRequest | null> {
    console.log('🔍 [realMatchingService] findCompatibleRequest called with:', {
      userGender, preferredGender, isPremium, callType
    });
    // Build gender filter for potential matches
    let genderFilter = '';
    if (preferredGender === 'men') {
      genderFilter = 'male';
    } else if (preferredGender === 'women') {
      genderFilter = 'female';
    }

    let query = supabase
      .from('user_matching')
      .select('*')
      .eq('status', 'waiting')
      .eq('call_type', callType)
      .order('created_at', { ascending: true })
      .limit(1);

    // Apply gender filters
    if (genderFilter) {
      query = query.eq('gender', genderFilter);
    }

    // Check if the found user would accept our gender
    const { data: potentialMatches, error } = await query;

    if (error) {
      console.error('Error finding compatible request:', error);
      return null;
    }

    if (!potentialMatches || potentialMatches.length === 0) {
      return null;
    }

    // Check if the potential match's preferences are compatible with our gender
    const potentialMatch = potentialMatches[0];
    const isCompatible = this.checkGenderCompatibility(
      userGender,
      potentialMatch.preferred_gender
    );

    return isCompatible ? (potentialMatch as MatchingRequest) : null;
  }

  // Check gender compatibility
  private checkGenderCompatibility(
    userGender: string,
    preferredGender: string
  ): boolean {
    if (preferredGender === 'anyone') return true;
    if (preferredGender === 'men' && userGender === 'male') return true;
    if (preferredGender === 'women' && userGender === 'female') return true;
    return false;
  }

  // Create a match between two users
  private async createMatch(
    userId: string,
    compatibleRequest: MatchingRequest
  ): Promise<string> {
    console.log('🤝 Creating match between users:', userId, 'and', compatibleRequest.user_id);

    // Create call session
    console.log('📞 Creating call session...');
    const { data: callSession, error: callError } = await supabase
      .from('call_sessions')
      .insert({
        initiator_id: compatibleRequest.user_id,
        receiver_id: userId,
        call_type: compatibleRequest.call_type,
        status: 'connecting'
      })
      .select()
      .single();

    if (callError) {
      console.error('❌ Error creating call session:', callError);
      throw new Error(`Failed to create call session: ${callError.message}`);
    }

    console.log('✅ Call session created:', callSession);

    // Update both matching requests
    console.log('📝 Updating matching request statuses...');
    const { error: updateError } = await supabase
      .from('user_matching')
      .update({
        status: 'matched',
        matched_with_user_id: userId,
        call_session_id: callSession.id
      })
      .eq('id', compatibleRequest.id);

    if (updateError) {
      console.error('Error updating compatible request:', updateError);
    }

    // Create matching request for current user
    const { error: createError } = await supabase
      .from('user_matching')
      .insert({
        user_id: userId,
        gender: 'other', // We don't have this info here, will be updated
        preferred_gender: 'anyone',
        call_type: compatibleRequest.call_type,
        is_premium: false,
        status: 'matched',
        matched_with_user_id: compatibleRequest.user_id,
        call_session_id: callSession.id
      });

    if (createError) {
      console.error('Error creating user matching request:', createError);
    }

    // Notify about the match
    this.onMatchFound?.(callSession.id, compatibleRequest.user_id);

    return callSession.id;
  }

  // Create new matching request
  private async createMatchingRequest(
    userId: string,
    userGender: 'male' | 'female' | 'other',
    preferredGender: 'anyone' | 'men' | 'women',
    isPremium: boolean,
    callType: 'video' | 'voice'
  ): Promise<string> {
    console.log('Creating new matching request for user:', userId);

    const { data, error } = await supabase
      .from('user_matching')
      .insert({
        user_id: userId,
        gender: userGender,
        preferred_gender: preferredGender,
        call_type: callType,
        is_premium: isPremium,
        status: 'waiting'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating matching request:', error);
      throw new Error(`Failed to create matching request: ${error.message}`);
    }

    this.currentMatchingRequestId = data.id;

    // Set up real-time listening for new compatible matches
    this.setupMatchingListening(userId, userGender, preferredGender, callType);

    return data.id;
  }

  // Set up real-time listening for new matches
  private setupMatchingListening(
    userId: string,
    userGender: 'male' | 'female' | 'other',
    preferredGender: 'anyone' | 'men' | 'women',
    callType: 'video' | 'voice'
  ): void {
    this.realtimeChannel = supabase
      .channel('matching-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_matching',
          filter: `call_type=eq.${callType}`
        },
        async (payload) => {
          const newRequest = payload.new as any;
          
          // Skip if it's our own request
          if (newRequest.user_id === userId) return;
          
    // Check if this new request is compatible with our preferences
    const isGenderCompatible = this.checkGenderCompatibility(
      newRequest.gender as 'male' | 'female' | 'other',
      preferredGender
    );
    
    const areWeCompatible = this.checkGenderCompatibility(
      userGender,
      newRequest.preferred_gender as 'anyone' | 'men' | 'women'
    );

          if (isGenderCompatible && areWeCompatible && newRequest.status === 'waiting') {
            // We found a match! Cancel our waiting and create the match
            await this.createMatch(userId, newRequest as MatchingRequest);
          }
        }
      )
      .subscribe();
  }

  // Cancel matching
  async cancelMatching(matchingRequestId: string): Promise<void> {
    console.log('Cancelling matching request:', matchingRequestId);

    const { error } = await supabase
      .from('user_matching')
      .update({ status: 'cancelled' })
      .eq('id', matchingRequestId);

    if (error) {
      console.error('Error cancelling matching request:', error);
      throw new Error(`Failed to cancel matching: ${error.message}`);
    }

    // Clean up real-time channel
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }

    this.currentMatchingRequestId = null;
  }

  // Clean up old requests (utility method)
  async cleanupOldRequests(): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('user_matching')
      .update({ status: 'cancelled' })
      .eq('status', 'waiting')
      .lt('created_at', oneHourAgo);

    if (error) {
      console.error('Error cleaning up old requests:', error);
    }
  }

  // Get current matching stats
  async getMatchingStats(): Promise<{ waitingUsers: number; totalUsers: number }> {
    const { data: waiting, error: waitingError } = await supabase
      .from('user_matching')
      .select('id')
      .eq('status', 'waiting');

    const { data: total, error: totalError } = await supabase
      .from('user_matching')
      .select('id');

    return {
      waitingUsers: waiting?.length || 0,
      totalUsers: total?.length || 0
    };
  }

  // Event handlers
  onMatchFound?: (callId: string, partnerId: string) => void;
  onError?: (error: string) => void;
}

export const realMatchingService = RealMatchingService.getInstance();