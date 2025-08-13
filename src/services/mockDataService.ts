// Simple mock data service to replace Firebase for demonstration purposes
// In a production app, you would implement these with your chosen backend

export interface CallData {
  id: string;
  callerId: string;
  receiverId?: string;
  status: 'waiting' | 'connecting' | 'connected' | 'ended';
  createdAt: Date;
  endedAt?: Date;
  callType: 'video' | 'voice';
}

export interface MatchingRequest {
  id: string;
  userId: string;
  userGender: 'male' | 'female' | 'other';
  preferredGender: 'anyone' | 'men' | 'women';
  isPremium: boolean;
  callType: 'video' | 'voice';
  status: 'waiting' | 'matched' | 'cancelled';
  createdAt: Date;
  matchedWith?: string;
  callId?: string;
}

export class MockDataService {
  private static callData: Map<string, CallData> = new Map();
  private static matchingRequests: Map<string, MatchingRequest> = new Map();

  // Create a new document
  static async createDocument(collection: string, data: any): Promise<string> {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date();
    
    if (collection === 'calls') {
      this.callData.set(id, {
        id,
        ...data,
        createdAt: timestamp
      });
    } else if (collection === 'matchingRequests') {
      this.matchingRequests.set(id, {
        id,
        ...data,
        createdAt: timestamp
      });
    }
    
    return id;
  }

  // Update a document
  static async updateDocument(collection: string, docId: string, data: any): Promise<void> {
    if (collection === 'calls' && this.callData.has(docId)) {
      const existing = this.callData.get(docId)!;
      this.callData.set(docId, { ...existing, ...data });
    } else if (collection === 'matchingRequests' && this.matchingRequests.has(docId)) {
      const existing = this.matchingRequests.get(docId)!;
      this.matchingRequests.set(docId, { ...existing, ...data });
    }
  }

  // Get a document
  static async getDocument(collection: string, docId: string): Promise<any | null> {
    if (collection === 'calls') {
      return this.callData.get(docId) || null;
    } else if (collection === 'matchingRequests') {
      return this.matchingRequests.get(docId) || null;
    }
    return null;
  }

  // Delete a document
  static async deleteDocument(collection: string, docId: string): Promise<void> {
    if (collection === 'calls') {
      this.callData.delete(docId);
    } else if (collection === 'matchingRequests') {
      this.matchingRequests.delete(docId);
    }
  }

  // Find matching requests
  static async findMatchingRequests(filters: any): Promise<MatchingRequest[]> {
    return Array.from(this.matchingRequests.values()).filter(request => {
      if (filters.status && request.status !== filters.status) return false;
      if (filters.callType && request.callType !== filters.callType) return false;
      return true;
    });
  }

  // Clean up old requests
  static async cleanupOldRequests(): Promise<void> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    for (const [id, request] of this.matchingRequests.entries()) {
      if (request.status === 'waiting' && request.createdAt < fiveMinutesAgo) {
        this.matchingRequests.delete(id);
      }
    }
  }
}