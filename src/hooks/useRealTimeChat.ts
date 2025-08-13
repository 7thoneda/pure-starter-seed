import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  message_type: 'text' | 'image' | 'video';
}

export interface ChatRoom {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export function useRealTimeChat(roomId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock send message function
  const sendMessage = useCallback(async (content: string, messageType: 'text' | 'image' | 'video' = 'text') => {
    if (!roomId) return;

    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        sender_id: 'current-user',
        created_at: new Date().toISOString(),
        message_type: messageType
      };

      setMessages(prev => [...prev, newMessage]);
      
      toast({
        title: "Message Sent",
        description: "Your message has been delivered",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [roomId, toast]);

  // Mock create room function
  const createOrGetRoom = useCallback(async (otherUserId: string) => {
    try {
      const newRoomId = `room_${Date.now()}`;
      const newRoom: ChatRoom = {
        id: newRoomId,
        user1_id: 'current-user',
        user2_id: otherUserId,
        created_at: new Date().toISOString()
      };

      setRooms(prev => [...prev, newRoom]);
      return newRoomId;
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create chat room",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Mock load functions
  const loadMessages = useCallback(async (chatRoomId: string) => {
    // Mock messages for demonstration
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        content: 'Hello! How are you?',
        sender_id: 'other-user',
        created_at: new Date(Date.now() - 5000).toISOString(),
        message_type: 'text'
      },
      {
        id: '2',
        content: 'Hi there! I\'m doing great, thanks for asking!',
        sender_id: 'current-user',
        created_at: new Date().toISOString(),
        message_type: 'text'
      }
    ];
    setMessages(mockMessages);
  }, []);

  const loadRooms = useCallback(async () => {
    // Mock rooms for demonstration
    const mockRooms: ChatRoom[] = [
      {
        id: 'room_1',
        user1_id: 'current-user',
        user2_id: 'other-user-1',
        created_at: new Date().toISOString()
      }
    ];
    setRooms(mockRooms);
  }, []);

  return {
    messages,
    rooms,
    isLoading,
    sendMessage,
    createOrGetRoom,
    loadMessages,
    loadRooms
  };
}