// Production readiness service
export class ProductionService {
  // Check if app is production ready
  static isProductionReady(): { ready: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for development keys in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_live_4Ud6wv8v2YJvbw';
      if (razorpayKey.includes('test')) {
        issues.push('Using Razorpay test key in production');
      }
    }

    // Check WebRTC requirements
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      issues.push('WebRTC media access not available');
    }

    if (!window.RTCPeerConnection) {
      issues.push('WebRTC peer connection not supported');
    }

    // Check if running over HTTPS (required for WebRTC)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push('HTTPS required for WebRTC functionality');
    }

    return {
      ready: issues.length === 0,
      issues
    };
  }

  // Initialize production monitoring
  static initializeMonitoring() {
    // Add error tracking
    window.addEventListener('error', (event) => {
      console.error('Production error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    // Check production readiness on load
    const { ready, issues } = this.isProductionReady();
    if (!ready) {
      console.warn('Production readiness issues:', issues);
    }
  }
}