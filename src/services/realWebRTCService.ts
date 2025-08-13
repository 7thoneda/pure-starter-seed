import { supabase } from '@/integrations/supabase/client';

export interface CallData {
  id: string;
  initiator_id: string;
  receiver_id?: string;
  call_type: 'video' | 'voice';
  status: 'waiting' | 'connecting' | 'connected' | 'ended';
  created_at: string;
  connected_at?: string;
  ended_at?: string;
  end_reason?: string;
}

export interface SignalingMessage {
  id: string;
  call_session_id: string;
  from_user_id: string;
  to_user_id: string;
  message_type: 'offer' | 'answer' | 'ice-candidate';
  message_data: any;
  created_at: string;
}

export class RealWebRTCService {
  private localStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private callSessionId: string | null = null;
  private userId: string;
  private partnerId: string | null = null;
  private realtimeChannel: any = null;

  // ICE servers configuration
  private iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  constructor(userId: string) {
    this.userId = userId;
  }

  // Initialize local media stream
  async initializeMedia(callType: 'video' | 'voice'): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: callType === 'video' ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Local stream initialized:', this.localStream);
      return this.localStream;
    } catch (error: any) {
      console.error('Failed to access media devices:', error);
      throw new Error(`Failed to access media devices: ${error.message}`);
    }
  }

  // Create a new call session in Supabase
  async createCall(callType: 'video' | 'voice'): Promise<string> {
    console.log('Creating real call as initiator');
    
    // Initialize media first
    await this.initializeMedia(callType);
    
    // Create call session in Supabase
    const { data, error } = await supabase
      .from('call_sessions')
      .insert({
        initiator_id: this.userId,
        call_type: callType,
        status: 'waiting'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating call session:', error);
      throw new Error(`Failed to create call session: ${error.message}`);
    }
    
    this.callSessionId = data.id;
    
    // Set up real-time listening for the call session
    this.setupRealtimeListening();
    
    return this.callSessionId;
  }

  // Join an existing call session
  async joinCall(callSessionId: string, callType: 'video' | 'voice'): Promise<void> {
    console.log('Joining real call as receiver:', callSessionId);
    
    // Initialize media
    await this.initializeMedia(callType);
    
    this.callSessionId = callSessionId;
    
    // Update call session with receiver info
    const { error } = await supabase
      .from('call_sessions')
      .update({
        receiver_id: this.userId,
        status: 'connecting'
      })
      .eq('id', callSessionId);
    
    if (error) {
      console.error('Error joining call session:', error);
      throw new Error(`Failed to join call session: ${error.message}`);
    }
    
    // Set up real-time listening
    this.setupRealtimeListening();
    
    // Set up peer connection as receiver
    await this.setupPeerConnection(false);
  }

  // Set up WebRTC peer connection
  private async setupPeerConnection(isInitiator: boolean): Promise<void> {
    this.peerConnection = new RTCPeerConnection(this.iceServers);
    
    // Add local stream to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }
    
    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote stream');
      this.onRemoteStream?.(event.streams[0]);
    };
    
    // Handle ICE candidates
    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate && this.partnerId) {
        await this.sendSignalingMessage('ice-candidate', {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        });
      }
    };
    
    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
      if (this.peerConnection?.connectionState === 'connected') {
        this.updateCallStatus('connected');
        this.onConnectionEstablished?.();
      } else if (this.peerConnection?.connectionState === 'failed') {
        this.onError?.('Connection failed');
      }
    };
    
    if (isInitiator) {
      // Create and send offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      await this.sendSignalingMessage('offer', {
        sdp: offer.sdp,
        type: offer.type
      });
    }
  }

  // Set up real-time listening for signaling messages
  private setupRealtimeListening(): void {
    this.realtimeChannel = supabase
      .channel(`call-${this.callSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signaling_messages',
          filter: `call_session_id=eq.${this.callSessionId}`
        },
        async (payload) => {
          const message = payload.new as SignalingMessage;
          if (message.to_user_id === this.userId) {
            await this.handleSignalingMessage(message);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'call_sessions',
          filter: `id=eq.${this.callSessionId}`
        },
        async (payload) => {
          const callData = payload.new as CallData;
          if (callData.status === 'connecting' && callData.receiver_id && !this.partnerId) {
            this.partnerId = callData.receiver_id === this.userId ? callData.initiator_id : callData.receiver_id;
            if (!this.peerConnection) {
              await this.setupPeerConnection(callData.initiator_id === this.userId);
            }
          }
        }
      )
      .subscribe();
  }

  // Handle incoming signaling messages
  private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
    if (!this.peerConnection) {
      await this.setupPeerConnection(false);
    }

    switch (message.message_type) {
      case 'offer':
        await this.peerConnection!.setRemoteDescription(
          new RTCSessionDescription(message.message_data)
        );
        const answer = await this.peerConnection!.createAnswer();
        await this.peerConnection!.setLocalDescription(answer);
        
        await this.sendSignalingMessage('answer', {
          sdp: answer.sdp,
          type: answer.type
        });
        break;
        
      case 'answer':
        await this.peerConnection!.setRemoteDescription(
          new RTCSessionDescription(message.message_data)
        );
        break;
        
      case 'ice-candidate':
        const candidate = new RTCIceCandidate({
          candidate: message.message_data.candidate,
          sdpMLineIndex: message.message_data.sdpMLineIndex,
          sdpMid: message.message_data.sdpMid
        });
        await this.peerConnection!.addIceCandidate(candidate);
        break;
    }
  }

  // Send signaling message through Supabase
  private async sendSignalingMessage(type: 'offer' | 'answer' | 'ice-candidate', data: any): Promise<void> {
    if (!this.callSessionId || !this.partnerId) {
      console.error('Cannot send signaling message: missing call session or partner');
      return;
    }

    const { error } = await supabase
      .from('signaling_messages')
      .insert({
        call_session_id: this.callSessionId,
        from_user_id: this.userId,
        to_user_id: this.partnerId,
        message_type: type,
        message_data: data
      });

    if (error) {
      console.error('Error sending signaling message:', error);
    }
  }

  // Update call session status
  private async updateCallStatus(status: 'waiting' | 'connecting' | 'connected' | 'ended', endReason?: string): Promise<void> {
    if (!this.callSessionId) return;

    const updateData: any = { status };
    
    if (status === 'connected') {
      updateData.connected_at = new Date().toISOString();
    } else if (status === 'ended') {
      updateData.ended_at = new Date().toISOString();
      if (endReason) updateData.end_reason = endReason;
    }

    const { error } = await supabase
      .from('call_sessions')
      .update(updateData)
      .eq('id', this.callSessionId);

    if (error) {
      console.error('Error updating call status:', error);
    }
  }

  // End the call
  async endCall(reason?: string): Promise<void> {
    console.log('Ending real call');
    
    // Update call status
    await this.updateCallStatus('ended', reason);
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Unsubscribe from real-time updates
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }

    this.callSessionId = null;
    this.partnerId = null;
    console.log('Call ended successfully');
  }

  // Toggle audio
  toggleAudio(): boolean {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      console.log('Audio toggled:', audioTrack.enabled);
      return audioTrack.enabled;
    }
    return false;
  }

  // Toggle video
  toggleVideo(): boolean {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      console.log('Video toggled:', videoTrack.enabled);
      return videoTrack.enabled;
    }
    return false;
  }

  // Get local stream
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  // Get call session ID
  getCallId(): string | null {
    return this.callSessionId;
  }

  // Event handlers (to be set by components)
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionEstablished?: () => void;
  onCallEnded?: () => void;
  onError?: (error: string) => void;
}