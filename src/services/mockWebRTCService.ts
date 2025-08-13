// Mock WebRTC service for demonstration purposes
// In a production app, you would implement proper WebRTC signaling

export interface CallData {
  id: string;
  callerId: string;
  receiverId?: string;
  status: 'waiting' | 'connecting' | 'connected' | 'ended';
  createdAt: Date;
  endedAt?: Date;
  callType: 'video' | 'voice';
}

export class MockWebRTCService {
  private localStream: MediaStream | null = null;
  private callId: string | null = null;
  private userId: string;

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

  // Create a new call (mock implementation)
  async createCall(callType: 'video' | 'voice'): Promise<string> {
    console.log('Creating mock call as initiator');
    
    // Initialize media
    await this.initializeMedia(callType);
    
    // Generate mock call ID
    this.callId = Math.random().toString(36).substr(2, 9);
    
    // Simulate connection after delay
    setTimeout(() => {
      this.onConnectionEstablished?.();
    }, 2000);
    
    return this.callId;
  }

  // Join an existing call (mock implementation)
  async joinCall(callId: string, callType: 'video' | 'voice'): Promise<void> {
    console.log('Joining mock call as receiver:', callId);
    
    // Initialize media
    await this.initializeMedia(callType);
    
    this.callId = callId;
    
    // Simulate connection after delay
    setTimeout(() => {
      this.onConnectionEstablished?.();
    }, 1500);
  }

  // End the call
  async endCall(): Promise<void> {
    console.log('Ending mock call');
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }

    this.callId = null;
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

  // Get call ID
  getCallId(): string | null {
    return this.callId;
  }

  // Event handlers (to be set by components)
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionEstablished?: () => void;
  onCallEnded?: () => void;
  onError?: (error: string) => void;
}