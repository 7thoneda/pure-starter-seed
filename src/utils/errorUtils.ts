// Enhanced error handling utilities
export class ErrorUtils {
  // Common error messages for user-friendly display
  static getErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    
    if (error?.message) {
      // Handle common WebRTC errors
      if (error.message.includes('NotAllowedError') || error.message.includes('permission')) {
        return 'Please allow camera and microphone access to use this feature';
      }
      if (error.message.includes('NotFoundError')) {
        return 'No camera or microphone found on this device';
      }
      if (error.message.includes('NotReadableError')) {
        return 'Camera or microphone is already in use';
      }
      if (error.message.includes('network') || error.message.includes('connection')) {
        return 'Network connection error. Please check your internet connection';
      }
      if (error.message.includes('HTTPS') || error.message.includes('secure')) {
        return 'This feature requires a secure connection (HTTPS)';
      }
      
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again';
  }

  // Log errors for debugging while showing user-friendly messages
  static handleError(error: any, context?: string): string {
    const userMessage = this.getErrorMessage(error);
    
    // Log detailed error for debugging
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    return userMessage;
  }

  // Check if error is recoverable
  static isRecoverableError(error: any): boolean {
    if (!error?.message) return true;
    
    const unrecoverableErrors = [
      'NotSupportedError',
      'SecurityError', 
      'WebRTC is not supported',
      'Secure context required'
    ];
    
    return !unrecoverableErrors.some(errType => 
      error.message.includes(errType)
    );
  }
}