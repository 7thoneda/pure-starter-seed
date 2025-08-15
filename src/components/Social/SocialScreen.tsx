import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, MessageCircle, Heart, UserPlus, Video, Phone } from "lucide-react";
import { SimpleFriendsScreen } from "./SimpleFriendsScreen";
import { SimpleGroupsScreen } from "./SimpleGroupsScreen";
import { GroupCallScreen } from "@/components/Groups/GroupCallScreen";

interface SocialScreenProps {
  onBack: () => void;
  onStartChat?: (userId: string) => void;
  onStartVideoCall?: (userId: string) => void;
}

export function SocialScreen({ onBack, onStartChat, onStartVideoCall }: SocialScreenProps) {
  const [activeTab, setActiveTab] = useState("friends");
  const [activeRoom, setActiveRoom] = useState<{ id: string; type: 'video' | 'voice' | 'chat' } | null>(null);

  const handleJoinRoom = (roomId: string, roomType: 'video' | 'voice' | 'chat') => {
    setActiveRoom({ id: roomId, type: roomType });
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
  };

  // Show active room if joined
  if (activeRoom) {
    return (
      <GroupCallScreen
        roomId={activeRoom.id}
        roomType={activeRoom.type}
        onLeave={handleLeaveRoom}
        onBack={handleLeaveRoom}
      />
    );
  }

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
              Social Hub
            </h1>
            <p className="text-white/90 font-poppins text-sm">Connect with friends and groups</p>
          </div>
        </div>
      </div>

      <main className="pb-24 px-4 -mt-6 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="space-y-4">
              <SimpleFriendsScreen
                onStartChat={onStartChat}
                onStartVideoCall={onStartVideoCall}
              />
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              <SimpleGroupsScreen
                onJoinRoom={handleJoinRoom}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}