import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SimpleGroupRoom {
  id: string;
  name: string;
  description?: string;
  room_type: 'video' | 'voice' | 'chat';
  max_participants: number;
  participant_count: number;
  is_private: boolean;
  creator_id: string;
  created_at: string;
  is_active: boolean;
}

export function useSimpleGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<SimpleGroupRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      // Mock data for now
      const mockRooms: SimpleGroupRoom[] = [
        {
          id: '1',
          name: 'Fun Video Chat',
          description: 'Casual video chat room for everyone',
          room_type: 'video',
          max_participants: 8,
          participant_count: 3,
          is_private: false,
          creator_id: 'user1',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: '2',
          name: 'Music Lovers Voice',
          description: 'Talk about your favorite music',
          room_type: 'voice',
          max_participants: 6,
          participant_count: 2,
          is_private: false,
          creator_id: 'user2',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
      
      setRooms(mockRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (roomData: {
    name: string;
    description?: string;
    room_type: 'video' | 'voice' | 'chat';
    max_participants?: number;
    is_private?: boolean;
  }) => {
    try {
      toast({
        title: "Room Created",
        description: `${roomData.room_type} room "${roomData.name}" has been created`,
      });
      loadRooms();
      return { id: Date.now().toString(), ...roomData };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive"
      });
      return null;
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      toast({
        title: "Joined Room",
        description: "You have successfully joined the room",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to join room",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    rooms,
    loading,
    createRoom,
    joinRoom,
    refetch: loadRooms
  };
}