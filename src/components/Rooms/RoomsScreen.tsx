import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Video, Phone, Users, Play, Share, Copy, Crown, Globe } from "lucide-react";
import { useSimpleGroups } from "@/hooks/useSimpleGroups";
import { useToast } from "@/hooks/use-toast";

interface RoomsScreenProps {
  onBack: () => void;
  onJoinRoom?: (roomId: string, roomType: 'video' | 'voice' | 'chat') => void;
}

export function RoomsScreen({ onBack, onJoinRoom }: RoomsScreenProps) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    room_type: "video" as const,
    max_participants: 8,
    is_private: false
  });

  const { rooms, loading, createRoom, joinRoom } = useSimpleGroups();
  const { toast } = useToast();

  const handleCreateRoom = async () => {
    if (!formData.name.trim()) return;

    const room = await createRoom(formData);
    if (room && onJoinRoom) {
      setShowCreateRoom(false);
      setFormData({
        name: "",
        description: "",
        room_type: "video",
        max_participants: 8,
        is_private: false
      });
      // Auto-join the created room
      onJoinRoom(room.id, room.room_type);
    }
  };

  const handleJoinRoom = async (roomId: string, roomType: 'video' | 'voice' | 'chat') => {
    const success = await joinRoom(roomId);
    if (success && onJoinRoom) {
      onJoinRoom(roomId, roomType);
    }
  };

  const generateRoomLink = (roomId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?room=${roomId}`;
  };

  const shareRoom = async (roomId: string, roomName: string) => {
    const roomLink = generateRoomLink(roomId);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join "${roomName}" room`,
          text: `Hey! Join me in this ${rooms.find(r => r.id === roomId)?.room_type} room`,
          url: roomLink,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(roomLink, roomName);
      }
    } else {
      copyToClipboard(roomLink, roomName);
    }
  };

  const copyToClipboard = async (link: string, roomName: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied! 🔗",
        description: `Room link for "${roomName}" copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Share Link",
        description: link,
      });
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'voice': return Phone;
      default: return Users;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-red-500 to-pink-500';
      case 'voice': return 'from-blue-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatParticipantCount = (count: number, max: number) => {
    const percentage = (count / max) * 100;
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-background safe-area-top">
      {/* Header */}
      <div className="bg-gradient-primary pt-16 pb-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-dancing text-3xl font-bold text-white">
              Video & Voice Rooms
            </h1>
            <p className="text-white/90 font-poppins text-sm">Create or join rooms with friends</p>
          </div>
          <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    placeholder="Enter room name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="room-description">Description (Optional)</Label>
                  <Textarea
                    id="room-description"
                    placeholder="What's this room about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select 
                    value={formData.room_type} 
                    onValueChange={(value: any) => setFormData({ ...formData, room_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">📹 Video Chat</SelectItem>
                      <SelectItem value="voice">🎙️ Voice Chat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="max-participants">Max Participants</Label>
                  <Select 
                    value={formData.max_participants.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, max_participants: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 people</SelectItem>
                      <SelectItem value="6">6 people</SelectItem>
                      <SelectItem value="8">8 people</SelectItem>
                      <SelectItem value="10">10 people</SelectItem>
                      <SelectItem value="12">12 people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreateRoom} className="w-full" disabled={!formData.name.trim()}>
                  🚀 Create & Join Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <Video className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-xs font-poppins mb-1">Video Rooms</p>
              <p className="text-white text-lg font-bold font-poppins">{rooms.filter(r => r.room_type === 'video').length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <Phone className="w-8 h-8 text-white mx-auto mb-2" />
              <p className="text-white/80 text-xs font-poppins mb-1">Voice Rooms</p>
              <p className="text-white text-lg font-bold font-poppins">{rooms.filter(r => r.room_type === 'voice').length}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Create Room CTA */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <h3 className="text-lg font-bold mb-2">Create Your Own Room</h3>
              <p className="text-white/90 text-sm mb-4">
                Start a video or voice room and invite friends with a link
              </p>
              <Button 
                onClick={() => setShowCreateRoom(true)}
                className="bg-white text-purple-600 font-semibold rounded-2xl px-6 py-2 hover:bg-white/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </CardContent>
          </Card>

          {/* Public Rooms */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active rooms</p>
                <p className="text-sm text-muted-foreground mt-1">Be the first to create a room!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Active Rooms
              </h3>
              
              {rooms.map((room) => {
                const IconComponent = getRoomTypeIcon(room.room_type);
                
                return (
                  <Card key={room.id} className="shadow-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getRoomTypeColor(room.room_type)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{room.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {room.room_type === 'video' ? '📹 Video' : '🎙️ Voice'} Room
                            </p>
                            {room.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            variant="outline" 
                            className={formatParticipantCount(room.participant_count, room.max_participants)}
                          >
                            {room.participant_count}/{room.max_participants}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => shareRoom(room.id, room.name)}
                            >
                              <Share className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleJoinRoom(room.id, room.room_type)}
                              disabled={room.participant_count >= room.max_participants}
                              className="min-w-[70px]"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created today</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {room.participant_count} online
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Share Dialog */}
      <Dialog open={!!showShareDialog} onOpenChange={() => setShowShareDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this link with friends to invite them to the room:
            </p>
            <div className="flex gap-2">
              <Input
                value={showShareDialog ? generateRoomLink(showShareDialog) : ''}
                readOnly
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={() => showShareDialog && copyToClipboard(
                  generateRoomLink(showShareDialog),
                  rooms.find(r => r.id === showShareDialog)?.name || 'Room'
                )}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              💡 Anyone with this link can join the room
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}