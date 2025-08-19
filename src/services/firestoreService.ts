import { MockDataService } from './mockDataService';

export class FirestoreService {
  // Use MockDataService for now to keep the existing functionality
  static async createDocument(collectionName: string, data: any): Promise<string> {
    try {
      return await MockDataService.createDocument(collectionName, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  static async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      await MockDataService.updateDocument(collectionName, docId, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  static async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      await MockDataService.deleteDocument(collectionName, docId);
    } catch (error: any) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  static async getDocument(collectionName: string, docId: string): Promise<any | null> {
    try {
      return await MockDataService.getDocument(collectionName, docId);
    } catch (error: any) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  static async getDocuments(
    collectionName: string, 
    filters?: { field: string; operator: any; value: any }[],
    orderByField?: string,
    limitCount?: number
  ): Promise<any[]> {
    try {
      return [];
    } catch (error: any) {
      throw new Error(`Failed to get documents: ${error.message}`);
    }
  }

  static subscribeToCollection(
    collectionName: string,
    callback: (documents: any[]) => void,
    filters?: { field: string; operator: any; value: any }[]
  ) {
    try {
      callback([]);
      return () => {};
    } catch (error: any) {
      throw new Error(`Failed to subscribe to collection: ${error.message}`);
    }
  }

  static subscribeToDocument(
    collectionName: string,
    docId: string,
    callback: (document: any | null) => void
  ) {
    try {
      callback(null);
      return () => {};
    } catch (error: any) {
      throw new Error(`Failed to subscribe to document: ${error.message}`);
    }
  }

  static async createCall(callData: {
    callerId: string;
    callType: 'video' | 'voice';
    status: 'waiting' | 'connecting' | 'connected' | 'ended';
  }): Promise<string> {
    try {
      return await MockDataService.createDocument('calls', {
        ...callData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to create call: ${error.message}`);
    }
  }

  static async updateCallStatus(callId: string, status: string, additionalData?: any): Promise<void> {
    try {
      await MockDataService.updateDocument('calls', callId, {
        status,
        updatedAt: new Date(),
        ...additionalData
      });
    } catch (error: any) {
      throw new Error(`Failed to update call status: ${error.message}`);
    }
  }

  static async sendSignal(signalData: {
    type: string;
    data: any;
    from: string;
    to: string;
    callId: string;
  }): Promise<void> {
    try {
      await MockDataService.createDocument('signals', {
        ...signalData,
        timestamp: new Date()
      });
    } catch (error: any) {
      throw new Error(`Failed to send signal: ${error.message}`);
    }
  }

  static subscribeToSignals(
    callId: string,
    targetUser: string,
    callback: (signals: any[]) => void
  ) {
    try {
      callback([]);
      return () => {};
    } catch (error: any) {
      throw new Error(`Failed to subscribe to signals: ${error.message}`);
    }
  }
}