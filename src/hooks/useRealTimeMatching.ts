import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MatchingRequest {
  id: string;
  user_id: string;
  gender: string;
  preferred_gender: string;
  call_type: 'video' | 'voice';
  is_premium: boolean;
  status: 'waiting' | 'matched' | 'in_call' | 'ended';
  matched_with_user_id?: string;
  call_session_id?: string;
  created_at: string;
}

export function useRealTimeMatching() {
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<MatchingRequest | null>(null);
  const [matchingRequest, setMatchingRequest] = useState<MatchingRequest | null>(null);
  const { toast } = useToast();

  // Mock matching function
  const startMatching = useCallback(async (
    gender: string,
    preferredGender: string,
    callType: 'video' | 'voice',
    isPremium: boolean
  ) => {
    try {
      setIsSearching(true);

      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful match
      const mockMatch: MatchingRequest = {
        id: Date.now().toString(),
        user_id: 'current-user',
        gender,
        preferred_gender: preferredGender,
        call_type: callType,
        is_premium: isPremium,
        status: 'matched',
        matched_with_user_id: 'matched-user',
        call_session_id: `call_${Date.now()}`,
        created_at: new Date().toISOString()
      };

      setCurrentMatch(mockMatch);
      setMatchingRequest(mockMatch);
      
      toast({
        title: "Match Found! 🎉",
        description: "Connecting you now...",
      });

      return { 
        success: true, 
        callSessionId: mockMatch.call_session_id, 
        match: mockMatch 
      };
    } catch (error) {
      console.error('Error starting match:', error);
      toast({
        title: "Matching Failed",
        description: "Please try again",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  // Cancel matching
  const cancelMatching = useCallback(async () => {
    try {
      setMatchingRequest(null);
      setCurrentMatch(null);
      setIsSearching(false);
      
      toast({
        title: "Matching Cancelled",
        description: "You can start matching again anytime",
      });
    } catch (error) {
      console.error('Error cancelling match:', error);
      toast({
        title: "Error",
        description: "Failed to cancel matching",
        variant: "destructive"
      });
    }
  }, [toast]);

  // End current match
  const endMatch = useCallback(async () => {
    try {
      setCurrentMatch(null);
      setMatchingRequest(null);
      
      toast({
        title: "Match Ended",
        description: "Thanks for chatting!",
      });
    } catch (error) {
      console.error('Error ending match:', error);
    }
  }, [toast]);

  return {
    isSearching,
    currentMatch,
    matchingRequest,
    startMatching,
    cancelMatching,
    endMatch
  };
}