import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Video, Phone, MessageCircle, Users, Lock, Settings, Crown, Play } from "lucide-react";
import { useSimpleGroups } from "@/hooks/useSimpleGroups";
import { useAuth } from "@/hooks/useAuth";
import { BannerAd } from "@/components/Ads/BannerAd";
import { RewardedVideoAd } from "@/components/Ads/RewardedVideoAd";

interface GroupRoomsScreenProps {
  onBack: () => void;
  onJoinRoom?: (roomId: string, roomType: 'video' | 'voice' | 'chat') => void;
}

export function GroupRoomsScreen({ onBack, onJoinRoom }: GroupRoomsScreenProps) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    room_type: "video" as const,
    max_participants: 8,
    is_private: false,
    password: ""
  });

  const { rooms, loading, createRoom, joinRoom } = useSimpleGroups();
  const { user } = useAuth();

  const handleCreateRoom = async () => {
    if (!formData.name.trim()) return;

    const success = await createRoom(formData);
    if (success) {
      setShowCreateRoom(false);
      setFormData({
        name: "",
        description: "",
        room_type: "video",
        max_participants: 8,
        is_private: false,
        password: ""
      });
    }
  };

  const handleJoinRoom = async (roomId: string, requiresPassword = false) => {
    if (requiresPassword) {
      setShowPasswordPrompt(roomId);
      return;
    }

    const success = await joinRoom(roomId);
    if (success && onJoinRoom) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        onJoinRoom(roomId, room.room_type);
      }
    }
  };

  const handlePasswordSubmit = async () => {
    if (!showPasswordPrompt) return;

    const success = await joinRoom(showPasswordPrompt);
    if (success && onJoinRoom) {
      const room = rooms.find(r => r.id === showPasswordPrompt);
      if (room) {
        onJoinRoom(showPasswordPrompt, room.room_type);
      }
    }
    setShowPasswordPrompt(null);
    setRoomPassword("");
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'voice': return Phone;
      case 'chat': return MessageCircle;
      default: return Users;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-red-500 to-pink-500';
      case 'voice': return 'from-blue-500 to-purple-500';
      case 'chat': return 'from-green-500 to-teal-500';
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
              Group Rooms
            </h1>
            <p className="text-white/90 font-poppins text-sm">Connect with multiple people at once</p>
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
                      <SelectItem value="video">Video Chat</SelectItem>
                      <SelectItem value="voice">Voice Chat</SelectItem>
                      <SelectItem value="chat">Text Chat</SelectItem>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="private-room"
                    checked={formData.is_private}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
                  />
                  <Label htmlFor="private-room">Private Room</Label>
                </div>

                {formData.is_private && (
                  <div>
                    <Label htmlFor="room-password">Password (Optional)</Label>
                    <Input
                      id="room-password"
                      type="password"
                      placeholder="Set a password..."
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                )}

                <Button onClick={handleCreateRoom} className="w-full" disabled={!formData.name.trim()}>
                  Create Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="text-white/80 text-xs font-poppins mb-1">Public Rooms</p>
              <p className="text-white text-lg font-bold font-poppins">{rooms.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="text-white/80 text-xs font-poppins mb-1">My Rooms</p>
              <p className="text-white text-lg font-bold font-poppins">0</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <p className="text-white/80 text-xs font-poppins mb-1">Joined</p>
              <p className="text-white text-lg font-bold font-poppins">0</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          {/* Rewarded Video Ad */}
          <RewardedVideoAd 
            variant="compact"
            rewardType="coins"
            className="mb-6"
          />

          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-6">
              <TabsTrigger value="public">
                Public Rooms
                {rooms.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {rooms.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="public" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading rooms...</p>
                </div>
              ) : rooms.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No public rooms available</p>
                    <p className="text-sm text-muted-foreground mt-1">Create a room to get started</p>
                  </CardContent>
                </Card>
              ) : (
                rooms.map((room) => {
                  const IconComponent = getRoomTypeIcon(room.room_type);
                  const isCreator = room.creator_id === user?.id;
                  
                  return (
                    <Card key={room.id} className="shadow-card hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-12 h-12 bg-gradient-to-r ${getRoomTypeColor(room.room_type)} rounded-xl flex items-center justify-center shadow-lg`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">{room.name}</h3>
                                {room.is_private && <Lock className="w-4 h-4 text-muted-foreground" />}
                                {isCreator && <Crown className="w-4 h-4 text-yellow-500" />}
                              </div>
                              <p className="text-sm text-muted-foreground capitalize">{room.room_type} room</p>
                              {room.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge 
                              variant="outline" 
                              className={formatParticipantCount(room.participant_count || 0, room.max_participants)}
                            >
                              {room.participant_count || 0}/{room.max_participants}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleJoinRoom(room.id, room.is_private)}
                              disabled={(room.participant_count || 0) >= room.max_participants}
                              className="min-w-[80px]"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>By Creator</span>
                          <span>{new Date(room.created_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

          </Tabs>
        </div>
      </main>

      {/* Password Prompt Dialog */}
      <Dialog open={!!showPasswordPrompt} onOpenChange={() => setShowPasswordPrompt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Room Password Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="room-password">Enter Password</Label>
              <Input
                id="room-password"
                type="password"
                placeholder="Room password..."
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePasswordSubmit} className="flex-1">
                Join Room
              </Button>
              <Button variant="outline" onClick={() => setShowPasswordPrompt(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Banner Ad */}
      <BannerAd position="bottom" size="banner" />
    </div>
  );
}