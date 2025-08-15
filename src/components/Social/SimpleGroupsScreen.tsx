import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Video, Phone, MessageCircle, Users, Play, Crown } from "lucide-react";
import { useSimpleGroups } from "@/hooks/useSimpleGroups";

interface SimpleGroupsScreenProps {
  onJoinRoom?: (roomId: string, roomType: 'video' | 'voice' | 'chat') => void;
}

export function SimpleGroupsScreen({ onJoinRoom }: SimpleGroupsScreenProps) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    room_type: "video" as const,
    max_participants: 8,
    is_private: false
  });

  const { rooms, loading, createRoom, joinRoom } = useSimpleGroups();

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
        is_private: false
      });
    }
  };

  const handleJoinRoom = async (roomId: string, roomType: 'video' | 'voice' | 'chat') => {
    const success = await joinRoom(roomId);
    if (success && onJoinRoom) {
      onJoinRoom(roomId, roomType);
    }
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
    <div className="space-y-4">
      {/* Create Room Button */}
      <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Room
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
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateRoom} className="w-full" disabled={!formData.name.trim()}>
              Create Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rooms List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No rooms available</p>
            <p className="text-sm text-muted-foreground mt-1">Create a room to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{room.name}</h3>
                          {room.is_private && <Crown className="w-4 h-4 text-yellow-500" />}
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
                        className={formatParticipantCount(room.participant_count, room.max_participants)}
                      >
                        {room.participant_count}/{room.max_participants}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleJoinRoom(room.id, room.room_type)}
                        disabled={room.participant_count >= room.max_participants}
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
          })}
        </div>
      )}
    </div>
  );
}