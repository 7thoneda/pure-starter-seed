import { useEffect } from 'react';
import { useToast } from './use-toast';

export function useRoomInvites() {
  const { toast } = useToast();

  useEffect(() => {
    // Check for room invite in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    
    if (roomId) {
      // Show invite notification
      toast({
        title: "Room Invitation! 🎉",
        description: "You've been invited to join a room. Click to join!",
      });
      
      // Auto-join room after showing toast
      setTimeout(() => handleRoomInvite(roomId), 2000);
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  const handleRoomInvite = (roomId: string) => {
    // Navigate to rooms and auto-join
    window.dispatchEvent(new CustomEvent('joinRoom', { detail: { roomId } }));
  };

  const generateInviteLink = (roomId: string, roomName?: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/?room=${roomId}`;
    
    return {
      url: inviteUrl,
      shareText: `Join me in "${roomName || 'this room'}"! 🎥\n\nClick here: ${inviteUrl}`
    };
  };

  const shareRoomInvite = async (roomId: string, roomName: string, roomType: 'video' | 'voice') => {
    const { url, shareText } = generateInviteLink(roomId, roomName);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join "${roomName}" ${roomType} room`,
          text: `Hey! Join me in this ${roomType} room: ${roomName}`,
          url: url,
        });
        return true;
      } catch (error) {
        console.log('Share failed, falling back to clipboard');
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Invite Link Copied! 📋",
        description: `Share the link to invite friends to "${roomName}"`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Share Link",
        description: shareText,
      });
      return false;
    }
  };

  return {
    handleRoomInvite,
    generateInviteLink,
    shareRoomInvite
  };
}