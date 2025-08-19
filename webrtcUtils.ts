// Example of improved WebRTC configuration and ICE checks
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:turn.server.com', username: 'user', credential: 'pass' }
    ],
    iceCandidatePoolSize: 10
};

const peerConnection = new RTCPeerConnection(configuration);

// ICE connectivity checks
peerConnection.oniceconnectionstatechange = () => {
    switch (peerConnection.iceConnectionState) {
        case 'connected':
            console.log('ICE connected');
            break;
        case 'disconnected':
            console.log('ICE disconnected');
            break;
        case 'failed':
            console.log('ICE connection failed');
            break;
        case 'closed':
            console.log('ICE connection closed');
            break;
    }
};

// Other utility functions for WebRTC...
