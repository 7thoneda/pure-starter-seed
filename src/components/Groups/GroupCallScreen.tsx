import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, UserPlus, Settings, Crown, Sparkles, ArrowLeft, MessageCircle, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ReactionButton } from "@/components/VideoChat/ReactionButton";
import { ReactionEffect } from "@/components/VideoChat/ReactionEffect";
import { VirtualGiftPanel } from "@/components/VirtualGifts/VirtualGiftPanel";
import { GiftEffect } from "@/components/VirtualGifts/GiftEffect";
import { PremiumReactions } from "@/components/Premium/PremiumReactions";
import { VoiceModulationPanel } from "@/components/VoiceModulation/VoiceModulationPanel";
import { useVirtualGifts } from "@/hooks/useVirtualGifts";
import { BannerAd } from "@/components/Ads/BannerAd";
import { CallExtensionAd } from "@/components/Ads/CallExtensionAd";

interface GroupCallScreenProps {
  roomId: string;
  roomType: 'video' | 'voice' | 'chat';
  onLeave: () => void;
  onBack?: () => void;
}

export function GroupCallScreen({ roomId, roomType, onLeave, onBack }: GroupCallScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(roomType === 'voice');
  const [participants, setParticipants] = useState<any[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [activeReactions, setActiveReactions] = useState<Array<{ id: string; reaction: string }>>([]);
  const [callDuration, setCallDuration] = useState(0);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [activeGiftEffects, setActiveGiftEffects] = useState<Array<{ id: string; emoji: string; animationType: string }>>([]);
  const [extendedTime, setExtendedTime] = useState(0);
  const [showExtensionAd, setShowExtensionAd] = useState(false);
  const [room, setRoom] = useState<any | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendGift } = useVirtualGifts();

  const reactions = [
    { emoji: "👋", label: "Wave", cost: 1 },
    { emoji: "👍", label: "Thumbs Up", cost: 1 },
    { emoji: "❤️", label: "Heart", cost: 2 },
    { emoji: "😂", label: "Laugh", cost: 2 },
    { emoji: "🎉", label: "Party", cost: 3 },
    { emoji: "👏", label: "Clap", cost: 1 },
  ];

  useEffect(() => {
    loadParticipants();
    
    // Simulate getting local video stream
    if (roomType === 'video' && localVideoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }

    // Timer for call duration
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      // Cleanup video stream
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId, roomType]);

  // Check if call should show extension ad (at 5 minutes, 10 minutes, etc.)
  useEffect(() => {
    const totalDuration = callDuration + extendedTime;
    if (totalDuration > 0 && totalDuration % 300 === 0) { // Every 5 minutes
      setShowExtensionAd(true);
    }
  }, [callDuration, extendedTime]);

  const loadParticipants = async () => {
    // Mock participants for now
    setParticipants([]);
  };

  const handleLeaveRoom = async () => {
    onLeave();
  };

  const handleTimeExtended = (additionalSeconds: number) => {
    setExtendedTime(prev => prev + additionalSeconds);
  };

  const handleReaction = (reaction: string, cost: number) => {
    // Add reaction effect
    const reactionId = Date.now().toString();
    setActiveReactions(prev => [...prev, { id: reactionId, reaction }]);
  };

  const handleSendGift = async (gift: any) => {
    // For group calls, we might send to all participants or a specific one
    const success = await sendGift(gift, 'group-participants');
    if (success) {
      // Add gift effect
      const effectId = Date.now().toString();
      setActiveGiftEffects(prev => [...prev, { 
        id: effectId, 
        emoji: gift.emoji, 
        animationType: gift.animation_type 
      }]);
      
      setShowGiftPanel(false);
    }
  };

  const handleGiftEffectComplete = (effectId: string) => {
    setActiveGiftEffects(prev => prev.filter(effect => effect.id !== effectId));
  };

  const handleReactionComplete = (reactionId: string) => {
    setActiveReactions(prev => prev.filter(r => r.id !== reactionId));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isCreator = room?.creator_id === user?.id;
  const myParticipant = participants.find(p => p.user_id === user?.id);

  return (
    <div className="fixed inset-0 bg-black z-50 safe-area-top safe-area-bottom">
      {/* Reaction Effects */}
      {activeReactions.map(({ id, reaction }) => (
        <ReactionEffect
          key={id}
          id={id}
          reaction={reaction}
          onComplete={handleReactionComplete}
        />
      ))}

      {/* Main Content Area */}
      <div className="relative h-full flex flex-col">
        {/* Video Grid or Voice Interface */}
        <div className="flex-1 bg-gradient-to-br from-primary/20 to-secondary/20 p-4">
          {roomType === 'video' ? (
            <div className="h-full grid grid-cols-2 gap-2">
              {/* Local Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {isCameraOff && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-xl font-semibold">
                          {user?.email?.charAt(0) || 'Y'}
                        </span>
                      </div>
                      <p className="text-sm">You</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                  You
                </div>
              </div>

              {/* Other Participants */}
              {participants.filter(p => p.user_id !== user?.id).slice(0, 3).map((participant, index) => (
                <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-primary/40 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-xl font-semibold">
                          {participant.profile?.display_name?.charAt(0) || participant.profile?.username?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <p className="text-sm">{participant.profile?.display_name || participant.profile?.username || 'User'}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs flex items-center gap-1">
                    {participant.role === 'creator' && <Crown className="w-3 h-3 text-yellow-400" />}
                    {participant.profile?.display_name || participant.profile?.username || 'User'}
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 4 - participants.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <UserPlus className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Waiting for participant</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Voice/Chat Interface */
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-white max-w-md">
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {participants.slice(0, 8).map((participant) => (
                    <div key={participant.id} className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary/40 rounded-full flex items-center justify-center mb-2 mx-auto">
                          <span className="text-lg font-semibold">
                            {participant.profile?.display_name?.charAt(0) || participant.profile?.username?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {participant.role === 'creator' && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-xs truncate">{participant.profile?.display_name || participant.profile?.username || 'User'}</p>
                    </div>
                  ))}
                </div>
                <h2 className="text-2xl font-bold mb-2">{roomType === 'voice' ? 'Voice Room' : 'Chat Room'}</h2>
                <p className="text-white/80 mb-4">{participants.length} participants connected</p>
                <p className="text-white/60 text-sm">Duration: {formatTime(callDuration + extendedTime)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Reaction Panel */}
        <div className="absolute top-20 right-4">
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={() => setShowReactions(!showReactions)}
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
            
            {showReactions && (
              <div className="flex flex-col gap-2 animate-slide-up">
                {reactions.map((reaction) => (
                  <ReactionButton
                    key={reaction.emoji}
                    emoji={reaction.emoji}
                    label={reaction.label}
                    cost={reaction.cost}
                    coinBalance={100} // Mock balance
                    onReact={handleReaction}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Participants Button */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setShowParticipants(true)}
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/30 text-white hover:bg-black/70"
          >
            <Users className="w-4 h-4 mr-2" />
            {participants.length}
          </Button>
        </div>

        {/* Back Button and Call Info */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Card className="bg-black/50 border-white/20">
            <CardContent className="px-3 py-2">
              <p className="text-white text-sm font-medium">{room?.name || 'Group Room'}</p>
              <p className="text-white/70 text-xs">{formatTime(callDuration + extendedTime)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            {roomType === 'video' && (
              <Button
                onClick={() => setIsCameraOff(!isCameraOff)}
                variant={isCameraOff ? "destructive" : "outline"}
                size="icon"
                className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </Button>
            )}

            <Button
              onClick={handleLeaveRoom}
              variant="destructive"
              size="icon"
              className="w-16 h-16 rounded-full animate-pulse-warm shadow-warm"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            {roomType === 'chat' && (
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            )}

            {(isCreator || myParticipant?.role === 'moderator') && (
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Participants Dialog */}
      <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Participants ({participants.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {participant.profile?.display_name?.charAt(0) || participant.profile?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{participant.profile?.display_name || participant.profile?.username || 'User'}</p>
                    <p className="text-sm text-muted-foreground">@{participant.profile?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {participant.role === 'creator' && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      <Crown className="w-3 h-3 mr-1" />
                      Creator
                    </Badge>
                  )}
                  {participant.role === 'moderator' && (
                    <Badge variant="outline">Moderator</Badge>
                  )}
                  {participant.user_id === user?.id && (
                    <Badge variant="secondary">You</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Extension Ad Modal */}
      <CallExtensionAd
        currentDuration={callDuration + extendedTime}
        onTimeExtended={handleTimeExtended}
        onClose={() => setShowExtensionAd(false)}
        isVisible={showExtensionAd}
        extensionAmount={60}
      />

      {/* Banner Ad for Free Users */}
      <BannerAd position="bottom" size="banner" />
    </div>
  );
}
