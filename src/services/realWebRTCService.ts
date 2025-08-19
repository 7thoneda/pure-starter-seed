import { WebRTCUtils } from '../utils/webrtcUtils';

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  to_user_id: string;
  from_user_id: string;
  call_session_id: string;
}

export class RealWebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private userId: string;
  private partnerId: string | null = null;
  private callSessionId: string | null = null;
  private reconnectionAttempts: number = 0;
  private readonly MAX_RECONNECTION_ATTEMPTS = 3;
  private readonly ICE_RESTART_TIMEOUT = 5000;

  constructor(userId: string) {
    this.userId = userId;
  }

  async initializeConnection(): Promise<boolean> {
    try {
      // Check WebRTC support
      if (!WebRTCUtils.isWebRTCSupported()) {
        throw new Error('WebRTC is not supported in this browser');
      }

      // Ensure secure context
      if (!WebRTCUtils.isSecureContext()) {
        throw new Error('Secure context (HTTPS) required for WebRTC');
      }

      // Check ICE connectivity
      if (!await WebRTCUtils.checkICEConnectivity()) {
        throw new Error('ICE connectivity check failed');
      }

      // Create peer connection with improved configuration
      this.peerConnection = new RTCPeerConnection(WebRTCUtils.getICEServers());
      
      // Set up enhanced connection monitoring
      this.setupConnectionStateHandling();
      this.setupICEHandling();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize WebRTC connection:', error);
      throw new Error(`Connection initialization failed: ${error.message}`);
    }
  }

  private setupConnectionStateHandling(): void {
    if (!this.peerConnection) return;

    this.peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state changed to: ${this.peerConnection?.connectionState}`);
      
      switch (this.peerConnection?.connectionState) {
        case 'connected':
          console.log('✅ Connection established successfully');
          this.reconnectionAttempts = 0; // Reset counter on successful connection
          this.onConnectionEstablished?.();
          break;
          
        case 'disconnected':
          console.log('⚠️ Connection lost, attempting to reconnect...');
          this.handleDisconnection();
          break;
          
        case 'failed':
          console.error('❌ Connection failed');
          this.handleConnectionFailure();
          break;
          
        case 'closed':
          console.log('Connection closed');
          this.cleanup();
          this.onCallEnded?.();
          break;
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStream?.(this.remoteStream);
    };
  }

  private setupICEHandling(): void {
    if (!this.peerConnection) return;

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.partnerId) {
        this.sendSignalingMessage('ice-candidate', {
          candidate: event.candidate.toJSON()
        });
      }
    };

    this.peerConnection.onicegatheringstatechange = () => {
      console.log(`ICE gathering state: ${this.peerConnection?.iceGatheringState}`);
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(`ICE connection state: ${this.peerConnection?.iceConnectionState}`);
      
      if (this.peerConnection?.iceConnectionState === 'failed') {
        this.handleICEFailure();
      }
    };
  }

  private async handleDisconnection(): Promise<void> {
    if (this.reconnectionAttempts >= this.MAX_RECONNECTION_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      this.handleConnectionFailure();
      return;
    }

    this.reconnectionAttempts++;
    console.log(`Reconnection attempt ${this.reconnectionAttempts}/${this.MAX_RECONNECTION_ATTEMPTS}`);

    try {
      await this.restartICE();
    } catch (error) {
      console.error('Failed to reconnect:', error);
      setTimeout(() => this.handleDisconnection(), this.ICE_RESTART_TIMEOUT);
    }
  }

  private async restartICE(): Promise<void> {
    if (!this.peerConnection || !this.partnerId) return;

    try {
      const offer = await this.peerConnection.createOffer({ iceRestart: true });
      await this.peerConnection.setLocalDescription(offer);
      
      await this.sendSignalingMessage('offer', { sdp: offer.sdp });
      
      console.log('ICE restart initiated successfully');
    } catch (error) {
      console.error('ICE restart failed:', error);
      throw error;
    }
  }

  private handleICEFailure(): void {
    console.log('Handling ICE failure...');
    this.handleDisconnection();
  }

  private handleConnectionFailure(): void {
    this.onError?.('Connection failed after multiple attempts');
    this.cleanup();
  }

  private cleanup(): void {
    console.log('Cleaning up WebRTC resources...');
    
    // Stop all media tracks
    this.localStream?.getTracks().forEach(track => {
      track.stop();
      console.log(`Stopped local track: ${track.kind}`);
    });
    
    this.remoteStream?.getTracks().forEach(track => {
      track.stop();
      console.log(`Stopped remote track: ${track.kind}`);
    });
    
    // Close and cleanup peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Reset state
    this.localStream = null;
    this.remoteStream = null;
    this.partnerId = null;
    this.callSessionId = null;
    this.reconnectionAttempts = 0;
  }

  // Signaling methods
  private async sendSignalingMessage(type: string, data: any): Promise<void> {
    if (!this.callSessionId || !this.partnerId) {
      throw new Error('Cannot send signaling message: missing session or partner ID');
    }

    const message: SignalingMessage = {
      type: type as 'offer' | 'answer' | 'ice-candidate',
      data: data,
      to_user_id: this.partnerId,
      from_user_id: this.userId,
      call_session_id: this.callSessionId
    };

    try {
      // Implementation of actual sending mechanism would go here
      console.log('Sending signaling message:', message);
    } catch (error) {
      console.error('Failed to send signaling message:', error);
      throw error;
    }
  }

  // Public methods
  async initializeMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to peer connection if it exists
      if (this.peerConnection && this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }
      
      return this.localStream;
    } catch (error: any) {
      let errorMessage = 'Failed to access media devices';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Please allow camera and microphone access';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Media device is already in use';
      }
      
      throw new Error(errorMessage);
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Failed to create offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Failed to handle answer:', error);
      throw error;
    }
  }

  async addICECandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
      throw error;
    }
  }

  setPartnerAndSession(partnerId: string, sessionId: string): void {
    this.partnerId = partnerId;
    this.callSessionId = sessionId;
  }

  disconnect(): void {
    this.cleanup();
  }

  // Event handlers
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionEstablished?: () => void;
  onCallEnded?: () => void;
  onError?: (error: string) => void;
}