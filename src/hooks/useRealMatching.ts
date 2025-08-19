import { useState, useCallback, useEffect } from 'react';
import { realMatchingService } from '@/services/realMatchingService';
import { useRealWebRTC } from '@/hooks/useRealWebRTC';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UseRealMatchingProps {
  userGender: 'male' | 'female' | 'other';
  isPremium: boolean;
}

export function useRealMatching({ userGender, isPremium }: UseRealMatchingProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [matchingRequestId, setMatchingRequestId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    isInCall,
    isConnected,
    localVideoRef,
    remoteVideoRef,
    startCall,
    joinCall,
    endCall,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled
  } = useRealWebRTC({
    userId: user?.id || `anonymous-${Date.now()}`
  });

  // Set up real-time matching event handlers
  useEffect(() => {
    realMatchingService.onMatchFound = async (callId: string, partnerId: string) => {
      
      setCurrentMatch({
        id: callId,
        partnerId,
        type: 'matched'
      });

      try {
        // Join the call that was created
        await joinCall(callId, 'video');
        toast({
          title: "Match Found! 🎉",
          description: "Connecting to your match...",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your match. Please try again.",
          variant: "destructive"
        });
      }
    };

    realMatchingService.onError = (error: string) => {
      console.error('Matching error:', error);
      setIsSearching(false);
      toast({
        title: "Matching Error",
        description: error,
        variant: "destructive"
      });
    };

    return () => {
      // Cleanup event handlers
      realMatchingService.onMatchFound = undefined;
      realMatchingService.onError = undefined;
    };
  }, [joinCall, toast]);

  const startMatching = useCallback(async (preferredGender: 'anyone' | 'men' | 'women') => {
    // Use a test user ID if no authenticated user
    const effectiveUserId = user?.id || `test-user-${Date.now()}`;
    
    if (!effectiveUserId) {
      toast({
        title: "User ID Required",
        description: "Cannot start matching without user identification.",
        variant: "destructive"
      });
      return null;
    }

    setIsSearching(true);
    
    try {
      const requestId = await realMatchingService.startMatching(
        effectiveUserId,
        userGender,
        preferredGender,
        isPremium,
        'video'
      );
      setMatchingRequestId(requestId);

      // Check if we got an immediate match (existing session ID means we matched)
      if (requestId.includes('call_')) {
        // This is actually a call session ID, meaning we got an immediate match
        
        // Immediately start the WebRTC call
        try {
          await startCall('video');
        } catch (webrtcError) {
          // Log error silently for monitoring
        }
        
        return { success: true, callId: requestId };
      } else {
        // We're now waiting for a match
        
        toast({
          title: isPremium ? "Premium Matching Started 👑" : "Matching Started 🎲",
          description: isPremium 
            ? "Finding matches based on your preferences..." 
            : "Searching for random matches...",
        });
        
        return { success: true, requestId };
      }
      
    } catch (error: any) {
      setIsSearching(false);
      toast({
        title: "Matching Failed",
        description: error.message || "Failed to start matching. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [user, userGender, isPremium, toast, startCall]);

  const cancelMatching = useCallback(async () => {
    if (matchingRequestId) {
      try {
        await realMatchingService.cancelMatching(matchingRequestId);
        setIsSearching(false);
        setMatchingRequestId(null);
        toast({
          title: "Matching Cancelled",
          description: "Your matching request has been cancelled.",
        });
      } catch (error: any) {
        toast({
          title: "Cancel Failed",
          description: error.message || "Failed to cancel matching.",
          variant: "destructive"
        });
      }
    }
  }, [matchingRequestId, toast]);

  const endMatch = useCallback(async () => {
    try {
      if (isInCall) {
        await endCall('User ended call');
      }
      if (matchingRequestId) {
        await realMatchingService.cancelMatching(matchingRequestId);
      }
      setCurrentMatch(null);
      setIsSearching(false);
      setMatchingRequestId(null);
    } catch (error) {
      // Log error silently for monitoring
    }
  }, [isInCall, endCall, matchingRequestId]);

  const getMatchingExplanation = useCallback(() => {
    if (isPremium) {
      return {
        title: "Premium Matching",
        description: "You can choose to match with specific genders. Your preferences will be respected.",
        features: [
          "Choose your preferred gender",
          "Higher match success rate", 
          "Priority in matching queue",
          "Advanced filtering options"
        ]
      };
    } else {
      return {
        title: "Free Random Matching",
        description: "You'll be matched with random users of any gender for diverse conversations.",
        features: [
          "Random gender matching",
          "Meet diverse people", 
          "No gender restrictions",
          "Upgrade for preferences"
        ]
      };
    }
  }, [isPremium]);

  return {
    // State
    isSearching,
    currentMatch,
    isInCall,
    isConnected,
    isAudioEnabled,
    isVideoEnabled,
    
    // Refs for video elements
    localVideoRef,
    remoteVideoRef,
    
    // Actions
    startMatching,
    cancelMatching,
    endMatch,
    toggleAudio,
    toggleVideo,
    getMatchingExplanation
  };
}