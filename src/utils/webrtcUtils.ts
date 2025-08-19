// WebRTC utilities and validation
export class WebRTCUtils {
  // Check if WebRTC is supported
  static isWebRTCSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection
    );
  }

  // Check if HTTPS is available (required for WebRTC)
  static isSecureContext(): boolean {
    return window.isSecureContext || window.location.hostname === 'localhost';
  }

  // Get supported media constraints
  static async getSupportedConstraints(): Promise<MediaStreamConstraints> {
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    
    return {
      video: supportedConstraints.width && supportedConstraints.height ? {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 }
      } : true,
      audio: {
        echoCancellation: supportedConstraints.echoCancellation !== undefined ? true : undefined,
        noiseSuppression: supportedConstraints.noiseSuppression !== undefined ? true : undefined,
        autoGainControl: supportedConstraints.autoGainControl !== undefined ? true : undefined
      }
    };
  }

  // Test media access
  static async testMediaAccess(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isWebRTCSupported()) {
        return { success: false, error: 'WebRTC not supported' };
      }

      if (!this.isSecureContext()) {
        return { success: false, error: 'Secure context required for WebRTC' };
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Stop tracks immediately
      stream.getTracks().forEach(track => track.stop());
      
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Media access failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera/microphone permission denied';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera/microphone found';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera/microphone already in use';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  // Get optimal ICE server configuration
  static getICEServers(): RTCConfiguration {
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ],
      iceCandidatePoolSize: 10
    };
  }
}